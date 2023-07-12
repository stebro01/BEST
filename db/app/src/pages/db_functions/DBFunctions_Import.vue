<template>
  <q-page>
    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.observation_import.title" :img="'csv-import-logo.png'" :icon="'file_download'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <SELECT_IMPORT v-if="!imported_data" @save="importData($event)" :mode="'multiple'"/>
        <PREVIEW_MULTIPLE_IMPORT v-else :imported_data="imported_data" @close="imported_data = false"/>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
          <BOTTOM_BUTTONS 
            :show_back="imported_data" @back="imported_data = false"
          />
      </template>
    </MainSlot>
  </q-page>
</template>

<script>

// import { exportFile } from 'quasar' //for DEBUGGING

import HEADING from 'src/components/elements/Heading.vue'
import SELECT_IMPORT from 'src/components/import/SelectImport.vue'
import MainSlot from 'src/components/MainSlot.vue'
import PREVIEW_MULTIPLE_IMPORT from 'src/components/import/PreviewMultipleImport.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
  name: 'DBFunctions_Import',

  components: { BOTTOM_BUTTONS, HEADING, MainSlot, SELECT_IMPORT, PREVIEW_MULTIPLE_IMPORT },

  data() {
    return {
      imported_data: undefined,
      tab: 'csv',
      show_csv_info: false
    }
  },

  mounted() {
    // load demo data
    // const fn_csv = 'test/jest/mockups/DATA_FOR_EDIT_IMPORTVUE/IMPORT_FROM_MANY_MANY.json'
    // const fn_csv = 'test/jest/mockups/DATA_FOR_EDIT_IMPORTVUE/IMPORT_FROM_MULTIPLE.json'

    // this.loadDemoData(fn_csv)
  },

  watch: {

  },

  computed: {

  },

  methods: {
    // async loadDemoData(fn) { //FOR DEBUGGING
    //   const txt = await window.electron.readFile(fn, 'utf8')
    //   this.imported_data = JSON.parse(txt)
    // },

    importData(data) {
      if (!data || !Array.isArray(data) || data[0] === undefined)  {
        return false
      } else this.imported_data = data
      
      // // FOR DEBUGGING
      // const status = exportFile('IMPORT.json', JSON.stringify(data))

      // if (status === true) {
      //   this.$q.notify('Export erfolgreich')
      // }
    }

    // ENDE METHODS
  },


}
</script>
