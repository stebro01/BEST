<template>
  <div>

    <div class="col-12">
      <q-tabs style="z-index: 10" v-model="selected_import_method">
        <q-tab v-for="(item, ind) in options_import" :key="ind + 'opt'" :name="item.value" :label="item.label" no-caps />
      </q-tabs>
    </div>
    <!-- SELECT FILE -->
    <div class="col-12 text-center">
      <SELECT_FILE :accept="ACCEPT_FILETYPE" :label="`${TEXT.select_file} (${ACCEPT_FILETYPE})`"
        @save="importData($event, selected_import_method)" :multiple="true"/>

      <div v-if="selected_import_method === 'csv' && !$store.getters.SHOW_SPINNER">
        <q-icon name="info" class="q-mt-sm cursor-pointer" size="md" @click="show_csv_help = true" />
      </div>
      <div v-if="$store.getters.SHOW_SPINNER">
        <q-spinner size="md"></q-spinner>
      </div>
    </div>

     <!-- DIALOG -->
     <HELP_CSV_IMPORT :active="show_csv_help" @close="show_csv_help = false" />

  </div>
</template>

<script>
import HELP_CSV_IMPORT from "src/components/import/Help_CSV_Import.vue";
import SELECT_FILE from "src/components/elements/SelectFile.vue";

export default {
  name: 'SelectImport',

  props: ['mode'],

  components: {HELP_CSV_IMPORT, SELECT_FILE},

  data() {
    return {
      options_import: this.$store.getters.IMPORT_OPTIONS,
      selected_import_method: this.$store.getters.IMPORT_MODES.hl7,
      show_csv_help: false,
      show_spinner: false
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    },

    ACCEPT_FILETYPE() {
      if (!this.selected_import_method) return "";
      if (this.selected_import_method === this.$store.getters.IMPORT_MODES.csv) return ".csv";
      if (this.selected_import_method === this.$store.getters.IMPORT_MODES.hl7) return ".json, .html";
      if (this.selected_import_method === this.$store.getters.IMPORT_MODES.raw) return "*";
      return "";
    }
  },

  methods: {
    importData(fileArr, method) {
      if (!Array.isArray(fileArr)) return false
      const FILE_PATH = []
      fileArr.forEach(f => FILE_PATH.push(f.path))

      this.$store.commit("LOG", {
        method: "SelectImport.vue / ImportObservation->importData",
        data: { file: FILE_PATH, method: method },
      });

      // WHICH METHOD?
      if (method === "hl7") return this.importSURVEY(FILE_PATH);
      else if (method === "csv") return this.importCSVFile(FILE_PATH);
      else if (method === "raw") return this.importRAWdata(FILE_PATH);
      else {
        this.$q.notify("Comming soong ...")
      }
    },

    importRAWdata(FILE_PATH) {
      this.$router.push({name: 'Observation_Import_RAW', params: {FILE_PATH: JSON.stringify(FILE_PATH)}})
    },

    importCSVFile(filePath) {
      this.$store
        .dispatch("importObjectsFromCSVFile", filePath[0])
        .then((patients) => {
          if (!patients) return this.$q.notify("Daten sind nicht kompatible");
          const keys = Object.keys(patients);


          if (this.mode !== 'multiple') {
            this.$q.notify('Mehr als ein Patient wurde gefunden, verwende nur den ersten ... ')
            let DATA = this._csv_data(patients[keys[0]])
            this.previewData(DATA)
          } else {
            // multilpe
            let DATA = []
            keys.forEach(k => DATA.push(this._csv_data(patients[k])))
            this.previewData(DATA)
          }

        });
      return;
    },

    _csv_data(patients) {
      const DATA = {
        PATIENT: { PATIENT_CD: patients.PATIENT_CD },
        OBSERVATIONS: patients.VISITS,
        VISITS: patients.VISIT_INFO,
      };

      let cc = 0;
      DATA.VISITS.forEach((v) => {
        cc += 1;
        if (!v.SOURCESYSTEM_CD) v.SOURCESYSTEM_CD = "SNOMED-CT";
        v.ENCOUNTER_NUM = cc;
      });
      return DATA
    },

    async importSURVEY(FILE_PATH) {
      var DATA = undefined
      for (let fp of FILE_PATH) {
        let DATA_TMP = await this._readSURVEY(fp)
        if (DATA_TMP.PATIENT) {
          if (DATA === undefined) DATA = DATA_TMP
          else {
            //MERGE MULTIPLE DATA POINTS
            DATA.OBSERVATIONS[0] = DATA.OBSERVATIONS[0].concat(DATA_TMP.OBSERVATIONS[0])
          }
        }
      }

      //prepare the preview
      if (this.mode === 'multiple') this.previewData([DATA])
      else this.previewData(DATA)
    },

    async _readSURVEY(filePath) {
      const txt = window.electron.readFile(filePath, "utf8");
      const DATA = await this.$store.dispatch("importSurveyBEST", txt);
      if (DATA.error) this.$q.notify("Error: " + DATA.error);
      if (!DATA || !DATA.PATIENT) this.$q.notify("Daten konnten nicht geladen werden");
      return DATA
    },

    previewData(DATA) {
      this.$emit('save', DATA)
    }
  }

}
</script>
