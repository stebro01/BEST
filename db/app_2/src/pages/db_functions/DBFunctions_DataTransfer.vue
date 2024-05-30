<template>
  <q-page>
    <MainSlot >
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.db_functions_transfer.title" :description="$store.getters.TEXT.page.db_functions_transfer.description" :img="'csv-import-logo.png'" :icon="'import_export'"/>
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_left>
        <!-- <div class="text-right"><q-btn :class="{'bg-grey': mode === 'import'}" flat @click="mode='import'">Import</q-btn></div> -->
        <div class="text-right">
          <q-tabs v-model="mode" class="float-right">
        <q-tab name="import">Import</q-tab>
      </q-tabs>
        </div>
      </template>
      <template v-slot:options_right>
        <!-- <div class="text-left"><q-btn :class="{'bg-grey': mode === 'export'}" flat @click="mode='export'">Export</q-btn></div> -->
        <div class="text-left">
          <q-tabs v-model="mode" class="float-left">
        <q-tab name="export">Export</q-tab>
      </q-tabs>
        </div>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <DATATRANSFER_IMPORT  v-if="mode==='import'" />
        <DATATRANSFER_EXPORT v-else />
        
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
          <BOTTOM_BUTTONS 
            :show_back="true" @back="go_back()"
          />
      </template>
    </MainSlot>
  </q-page>
</template>

<script>

// import { exportFile } from 'quasar' //for DEBUGGING

import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import DATATRANSFER_IMPORT from 'src/components/import/DataTransfer_Import.vue'
import DATATRANSFER_EXPORT from 'src/components/import/DataTransfer_Export.vue'


export default {
  name: 'DBFunctions_DataTransfer',

  components: { BOTTOM_BUTTONS, HEADING, MainSlot, DATATRANSFER_IMPORT, DATATRANSFER_EXPORT  },

  data() {
    return {
      mode: 'import'
    }
  },

  mounted() {

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

    go_back() {
      this.$router.push({name: 'DBFunctions'})
    }

    // ENDE METHODS
  },


}
</script>
