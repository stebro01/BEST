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
        @save="importData($event, selected_import_method)" />

      <div v-if="selected_import_method === 'csv'">
        <q-icon name="info" class="q-mt-sm cursor-pointer" size="md" @click="show_csv_help = true" />
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
      options_import: [
        { value: "hl7", label: "HL7 JSON/HTML" },
        { value: "csv", label: "CSV Tabellenformat" },
      ],
      selected_import_method: "csv",
      show_csv_help: false,
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    },

    ACCEPT_FILETYPE() {
      if (!this.selected_import_method) return "";
      if (this.selected_import_method === "csv") return ".csv";
      if (this.selected_import_method === "hl7") return ".json, .html";
      return "";
    }
  },

  methods: {
    importData(file, method) {
      this.$store.commit("LOG", {
        method: "ImportObservation->importData",
        data: { file: file.path, method: method },
      });

      // WHICH METHOD?
      if (method === "hl7") this.importSURVEY(file.path);
      else if (method === "csv") this.importCSVFile(file.path);
      else this.$q.notify("Comming soong ...");
    },

    importCSVFile(filePath) {
      this.$store
        .dispatch("importObjectsFromCSVFile", filePath)
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

    async importSURVEY(filePath) {
      const txt = window.electron.readFile(filePath, "utf8");
      const DATA = await this.$store.dispatch("importSurveyBEST", txt);

      if (DATA.error) return this.$q.notify("Error: " + DATA.error);
      if (!DATA || !DATA.PATIENT)
        return this.$q.notify("Daten konnten nicht geladen werden");
      // else
      if (!this.mode === 'multiple') this.previewData(DATA)
      else this.previewData([DATA])
    },

    previewData(DATA) {
      this.$emit('save', DATA)
    }
  }

}
</script>