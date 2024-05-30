<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'general_icon.png'" :icon="'event'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <SELECT_IMPORT v-if="!imported_data" @save="importData($event)"/>
        <PREVIEW_IMPORT v-else :imported_data="imported_data" @close="imported_data = undefined" />
      </template>
    </MainSlot>

   
  </q-page>
</template>

<script>
// import { exportFile } from 'quasar' //for DEBUGGING

import HEADING from "src/components/elements/Heading.vue";
import MainSlot from "src/components/MainSlot.vue";
import SELECT_IMPORT from 'src/components/import/SelectImport.vue'
import PREVIEW_IMPORT from 'src/components/import/PreviewImport.vue';
export default {
  name: "ImportObservation",

  components: {
    HEADING, MainSlot, SELECT_IMPORT, PREVIEW_IMPORT
  },

  data() {
    return {
      imported_data: undefined
    };
  },

  mounted() { 
    // // load demo data
    // const fn_csv = 'test/jest/mockups/DATA_FOR_EDIT_IMPORTVUE/IMPORT_FROM_CSV.json'
    // const fn_hl7 = 'test/jest/mockups/DATA_FOR_EDIT_IMPORTVUE/IMPORT_from_HL7_JSON.json'
    // const fn_survey = 'test/jest/mockups/DATA_FOR_EDIT_IMPORTVUE/IMPORT_FROM_HL7_SURVEY.json'

    // this.loadDemoData(fn_hl7)
  },

  computed: {
    
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import;
    },
  },

  methods: {
    async loadDemoData(fn) { //FOR DEBUGGING
      const txt = await window.electron.readFile(fn, 'utf8')
      this.imported_data = JSON.parse(txt)
    },

    importData(data) {
      this.imported_data = data
      
      // // FOR DEBUGGING
      // const status = exportFile('IMPORT.json', JSON.stringify(data))

      // if (status === true) {
      //   this.$q.notify('Export erfolgreich')
      // }
    },



  },
};
</script>
