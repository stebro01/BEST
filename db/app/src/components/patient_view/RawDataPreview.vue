<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        Vorschau: <span v-if="localData"> <b>{{ localData.CONCEPT_NAME_CHAR }} </b>({{ localData.CONCEPT_CD }})</span>
      </q-card-section>

      <q-card-section>
        <div v-if="FILE_INFO">Dateiinformationen: {{ FILE_INFO }}</div>
        <div class="row q-gutter-lg">
          <div><q-btn icon="download"  color="dark" rounded  @click="downloadRaw()"></q-btn></div>
          <div><q-btn icon="delete" color="dark" rounded @click="removeRaw()"></q-btn></div>
        </div>
      </q-card-section>

      <!-- IMAGE DATA -->
      <q-card-section v-if="IS_IMAGE_DATA">
        <img :src="image_src" @load="revokeURL(image_src)" style="width: 100%; height: 100%;" />
      </q-card-section>
      <!-- PDF DATA -->
      <q-card-section v-else-if="IS_PDF_DATA" class="text-center">
        <q-btn @click="openPDF()" class="my-btn" rounded>PDF öffnen</q-btn>
      </q-card-section>
      <!-- RANDOM RAW DATA -->
      <q-card-section v-else>
        Content:
        <q-scroll-area style="width: 100%; height: 300px; font-size: 0.8em;font-family: 'Courier New', Courier, monospace;">
        <div v-if="BLOB" class="bg-grey-2">
            {{ BLOB }}
        </div>
      </q-scroll-area>
      </q-card-section>

    </q-card>
  </q-dialog>


</template>


<script>

import { my_confirm } from 'src/tools/my_dialog'
import {downloadBlob} from 'src/tools/db_tools'

export default {
  name: 'RawDataPreview',

  props: ['input_data'],

  components: {},

  data() {
    return {
      show_dialog: false,
      localData: undefined,
      preview_raw_item: undefined,
      image_src: undefined,
      pdf_src: undefined
    }
  },

  mounted() {
    if (!this.input_data) return
    if (this.input_data) this.show_dialog = true
    this.loadObservation(this.input_data)
  },

  computed: {
    FILE_INFO() {
      if (!this.localData) return undefined
      const data = JSON.parse(this.localData.TVAL_CHAR)
      return `${data.filename} / ${Math.round(data.sizeKB)}KB`
    },

    BLOB() {
      if (!this.localData || !this.preview_raw_item) return undefined
      else return this.preview_raw_item
    },

    IS_IMAGE_DATA() {
      if (!this.localData) return false
      return this.localData.CONCEPT_CD === 'CUSTOM: RAW_IMAGE' && this.image_src
    },

    IS_PDF_DATA() {
      if (!this.localData) return false
      return  this.pdf_src
    }
  },

  methods: {
    async loadObservation(payload) {
      const res1 = await this.$store.dispatch('searchDB', {table: 'OBSERVATION_FACT', query_string: {OBSERVATION_ID: payload.OBSERVATION_ID, _columns: ['OBSERVATION_BLOB', 'TVAL_CHAR', 'CONCEPT_CD']}})
      const res2 = await this.$store.dispatch('searchDB', {table: 'OBSERVATION_FACT', query_string: {OBSERVATION_ID: payload.OBSERVATION_ID, _columns: ['CONCEPT_NAME_CHAR'], _view: true}})

      this.localData = {
        OBSERVATION_BLOB: res1[0].OBSERVATION_BLOB,
        TVAL_CHAR: res1[0].TVAL_CHAR,
        CONCEPT_CD: res1[0].CONCEPT_CD,
        CONCEPT_NAME_CHAR: res2[0].CONCEPT_NAME_CHAR,
        OBSERVATION_ID: payload.OBSERVATION_ID
      }

      // console.log(this.localData)

      if (this.localData.CONCEPT_CD === 'CUSTOM: RAW_IMAGE') this.previewImage(this.localData)
      else this.previewRAW(this.localData)
    },


    previewRAW(item) {
      let val = JSON.parse(item.TVAL_CHAR)
      if (val.ext === '.txt' || val.ext === '.csv' || val.ext === ".json" || val.ext === ".xml" || val.ext === ".html" || val.ext === ".htm") {
        const decoder = new TextDecoder();
        const text = decoder.decode(item.OBSERVATION_BLOB);

        this.preview_raw_item = {
          title: val.filename,
          text: text
        }
      }
      else if (val.ext === '.pdf') this.previewImage(item)
      else this.$q.notify({ type: 'negative', message: 'Keine Vorschau verfügbar' })
    },

    // LOAD IMAGE DATA
    previewImage(val) {
      if (val) {
        // OBJECT DATA
        const image_data = JSON.parse(val.TVAL_CHAR)
        // PNG DATA
        if (image_data.ext === '.png') {
          //  BLOB DATA
          let blob = new Blob([val.OBSERVATION_BLOB], { type: 'image/png' });

          let imageUrl = URL.createObjectURL(blob);
          this.image_src = imageUrl
        }
        // PDF
        else if (image_data.ext === '.pdf') {
            // PDF BLOB DATA
            let blob = new Blob([val.OBSERVATION_BLOB], { type: 'application/pdf' });

            let pdfUrl = URL.createObjectURL(blob);
            // Zum Anzeigen des PDFs kannst du entweder ein <iframe>, <embed> oder <object> HTML-Element verwenden,
            // oder den Benutzer veranlassen, das PDF direkt herunterzuladen bzw. in einem neuen Tab zu öffnen.
            this.pdf_src = pdfUrl;


        }
        else return this.$q.notify({ type: 'negative', message: 'Keine Vorschau verfügbar' })

      }
    },

    revokeURL(url) {
      URL.revokeObjectURL(url);
    },

    openPDF() {
      window.open(this.pdf_src, '_blank')
    },

    // DOWNLOAD
    downloadRaw() {
      // get the object data
      const data = this.localData.OBSERVATION_BLOB;
      const fileName = JSON.parse(this.localData.TVAL_CHAR).filename;
      downloadBlob(data, fileName);

    },

    // REMOVE
    async removeRaw() {
      if (!await my_confirm('Möchten Sie die Datei wirklich löschen?')) return
      const res = await this.$store.dispatch('deleteDB', {table: 'OBSERVATION_FACT', query_string: {OBSERVATION_ID: this.localData.OBSERVATION_ID}})
      if (res) {
        this.$q.notify({ type: 'positive', message: 'Datei wurde gelöscht' })
        this.$emit('close')
        this.$emit('removed', this.localData.OBSERVATION_ID)
      }

    }


  }


}
</script>
