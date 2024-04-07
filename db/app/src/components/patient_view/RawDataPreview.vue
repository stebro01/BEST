<template>

  <q-dialog v-model="show_dialog">
    <q-card class="q-ma-md no-shadow my-card">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        Vorschau: <span v-if="localData"> <b>{{ localData.CONCEPT_NAME_CHAR }} </b>({{ localData.CONCEPT_CD }})</span>
      </q-card-section>

      <q-card-section>
        Dateiinformationen: <span v-if="FILE_INFO">{{ FILE_INFO }}</span>
      </q-card-section>

      <q-card-section>
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


export default {
  name: 'RawDataPreview',

  props: ['input_data'],

  components: {},

  data() {
    return {
      show_dialog: false,
      localData: undefined,
      preview_raw_item: undefined
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

      this.previewRAW(this.localData)
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

      } else this.$q.notify({ type: 'negative', message: 'Keine Vorschau verfügbar' })
    },



  }


}
</script>
