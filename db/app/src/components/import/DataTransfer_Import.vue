<template>
  <div>
    <!-- SELECT FILE -->
    <div v-if="!JSON_FN" class="col-12 text-center">
      <SELECT_FILE :accept="'.json'" :label="`${TEXT.select_file} (.json)`" @save="importData($event)" />
    </div>

    <!-- ELSE -->
    <div v-else class="q-mt-xl col-12 text-center row q-gutter-y-lg">
      <div class="col-12">
        <q-chip removable @remove="clearFile()">{{ JSON_FN.name }}</q-chip>
      </div>
      <!-- IF SHOW_SPINNER -->
      <div v-if="show_spinner" class="col-12 text-center q-gutter-y-lg">
        <div><q-spinner-ios size="md"></q-spinner-ios></div>
        <div><q-banner class="bg-red">Import läuft, das kann einen Moment dauern.</q-banner></div>
      </div>
      <!-- ELSE IF -->
      <div class="col-12" v-else-if="DATA.length > 0">
        Preview
        <q-list dense>
          <q-item v-for="(item, ind) of DATA" :key="ind + 'import'" v-ripple clickable
            @click="item.selected = !item.selected">
            <q-item-section side>
              <q-checkbox v-model="item.selected" />
            </q-item-section>
            <q-item-section>
              {{ item.table }}
            </q-item-section>
            <q-item-section>
              Einträge: {{ item.data.length }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else-if="RESULT_IMPORT" class="col-12 row justify-center">
        <q-card class="my-card">

          <q-btn icon="clear" @click="clearFile()" round flat class="absolute-top-right z-top"></q-btn>
          <q-card-section class="bg-green-1 text-left">
            Import erfolgreich! Status kann hier eingesehen werden:<br>
            <ul>
              <li v-for="(cc, ii) in RESULT_OPTIONS" :key="ii + 'sum'">
                {{ cc }}: {{ RESULT_IMPORT[cc].length }}
              </li>
            </ul>
          </q-card-section>
          <q-card-section class="text-left" >
            <q-btn-dropdown color="primary" :label="RESULT_ACTIVE_OPTION || 'Log auswählen'">
              <q-list v-if="RESULT_OPTIONS" dense >
                <q-item v-for="(el, ind) in RESULT_OPTIONS" :key="ind + 'el'" clickable v-close-popup
                  @click="RESULT_ACTIVE_OPTION = el">
                  <q-item-section>
                    <q-item-label>{{ el }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            </q-card-section>
            <q-card-section>

              <q-table v-if="RESULT_IMPORT && RESULT_ACTIVE_OPTION" :rows="RESULT_IMPORT[RESULT_ACTIVE_OPTION]"
                :title="RESULT_ACTIVE_OPTION" style="width: 100%"></q-table>
            </q-card-section>
        </q-card>
      </div>
      <div class="col-12" v-if="!show_spinner && !RESULT_IMPORT">
        <q-btn rounded class="my-btn" @click="importNow()">Importieren</q-btn>
      </div>

    </div>
  </div>
</template>

<script>
import SELECT_FILE from "src/components/elements/SelectFile.vue";

export default {
  name: 'DataTransfer_Import',

  components: { SELECT_FILE },

  data() {
    return {
      show_spinner: false,
      JSON_FN: undefined,
      DATA: [],
      RESULT_IMPORT: undefined,
      RESULT_ACTIVE_OPTION: undefined
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    },

    RESULT_OPTIONS() {
      if (!this.RESULT_IMPORT) return []
      else {
        return Object.keys(this.RESULT_IMPORT)
      }
    }

  },

  methods: {
    clearFile() {
      this.JSON_FN = undefined;
      this.show_spinner = false
      this.DATA = []
      this.RESULT_IMPORT = undefined
    },

    importData(file) {
      console.log(file)
      if (file && file.path) {
        this.JSON_FN = file
        this.loadFile(this.JSON_FN)
      }

    },
    loadFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => this.readjson(e);
      reader.readAsText(file);
    },

    readjson(e) {
      let txt = e.target.result;
      this.DATA = JSON.parse(txt)
      this.DATA.forEach(d => d.selected = true)
    },

    async importNow() {
      const TO_IMPORT = []
      this.DATA.forEach(d => {
        if (d.selected) TO_IMPORT.push(d)
      })
      this.show_spinner = true
      this.$store.dispatch('importJSON_DataTransfer', { JSON: TO_IMPORT })
        .then(res => {
          if (res.status) {
            this.$q.notify('Aktion erfolgreich')
            //prepare results for view
            Object.keys(res.data).forEach(key => {
              if (res.data[key].length > 0) {
                const TMP = []
                res.data[key].forEach(el => TMP.push({ log: el }))
                res.data[key] = TMP
              }
            })
            this.RESULT_IMPORT = res.data
          } else this.$q.notify('etwas ging schief')
        }).finally(() => {
          this.DATA = []
          this.show_spinner = false
        })

    }

  }

}
</script>