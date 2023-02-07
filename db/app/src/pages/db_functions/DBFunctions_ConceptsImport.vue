<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.concept_import.title" :img="'concept-import-logo.png'" :icon="'file_download'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-card class="my-card">
          <q-separator v-if="!preview_data" class="q-mx-sm" />
          <q-card-section v-if="!preview_data" class="q-pa-md">
            <q-file v-model="csv_file" label="Datei auswählen (.csv)" accept=".csv">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <q-card-section v-if="!csv_file" class="text-center q-pa-none q-mt-md">
              <q-icon name="info" size="sm"><q-tooltip>CSV Datei entsprechend den Vorgaben ...</q-tooltip></q-icon>
            </q-card-section>
          </q-card-section>

          <q-separator v-if="csv_file && !preview_data" class="q-mx-sm" />
          <q-card-actions v-if="!preview_data" class="q-pa-md row justify-center">
            <q-btn v-if="csv_file" flat rounded icon="upload_file" class="my-btn" @click="importData(csv_file)">Laden
              <q-tooltip>Lädt die Daten, standardisiertes Format notwendig</q-tooltip></q-btn>
          </q-card-actions>

        </q-card>

        <!-- VORSCHAU DER DATEN -->
        <div v-if="preview_data && modus === 'preview'" class="text-center">
          <q-banner v-if="show_banner" class="bg-red-3 q-ma-md" dense
            inline-actions>{{ $store.getters.TEXT.page.concept_import.info_banner }}
            <template v-slot:action>
              <q-btn round flat color="black" icon="close" @click="show_banner = false" />
            </template>
          </q-banner>
          <q-btn @click="writeToDB()" class="q-mb-lg" no-caps rounded
            color="black">{{ $store.getters.TEXT.page.concept_import.btn_import }}</q-btn>
          <q-table :title="`${$store.getters.TEXT.page.concept_import.table_title} ${preview_data.length} `"
            :rows="preview_data" class="my-table" :rows-per-page-options="ROWSPERPAGE" :filter="filter" dense
            row-key="CONCEPT_PATH" selection="multiple" v-model:selected="selected">

            <template v-slot:top-right>
              <div>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="clear" @click="filter = undefined" />
                  </template>
                </q-input>
              </div>
            </template>

          </q-table>

          <div class="q-mt-md q-gutter-lg">
            <q-btn v-if="selected.length === 1" icon="edit" rounded
              @click="editEntry()">{{ $store.getters.TEXT.btn.selection.edit }}</q-btn>
            <q-btn v-if="selected.length > 0" icon="delete" rounded
              @click="deleteSelection()">{{ $store.getters.TEXT.btn.selection.remove }}</q-btn>
          </div>
        </div>

        <!-- ANZEIGE ERGEBNIS IMPORT -->
        <div v-else-if="modus === 'import_finshed'" class="q-my-xl text-center">
          <div class="q-gutter-lg q-mb-lg">
            <q-btn no-caps rounded class="my-btn" @click="$router.go(-1)">{{ $store.getters.TEXT.btn.back }}</q-btn>
          </div>
          <q-table :title="$store.getters.TEXT.page.concept_import.table_title_imported" :rows="imported_data"
            :columns="columns_imported" row-key="CONCEPT_PATH" dense :rows-per-page-options="ROWSPERPAGE">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="status" :props="props">
                  <span v-if="props.row.status">✅</span>
                  <span v-else>❌ <q-tooltip>{{ props.row.error }}</q-tooltip></span>
                </q-td>
                <q-td key="CONCEPT_CD" :props="props">
                  {{ props.row.CONCEPT_CD }}
                </q-td>
                <q-td key="CONCEPT_PATH" :props="props">
                  {{ props.row.CONCEPT_PATH }}
                </q-td>
                <q-td key="NAME_CHAR" :props="props">
                  {{ props.row.NAME_CHAR }}
                </q-td>
              </q-tr>
            </template>

          </q-table>
        </div>

      </template>
    </MainSlot>

    <!-- EDIT MODAL -->
    <q-dialog v-model="show_edit_modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $store.getters.TEXT.dialog.concept_edit.title }}</div>
          <div class="text-caption">{{ $store.getters.TEXT.dialog.concept_edit.description }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="edit_data">
          <q-form>
            <q-input dense v-model="edit_data.CONCEPT_PATH" hint="CONCEPT_PATH" />
            <q-input dense v-model="edit_data.CONCEPT_CD" hint="CONCEPT_CD" />
            <q-input dense v-model="edit_data.NAME_CHAR" hint="NAME_CHAR" />
            <q-select dense v-model="edit_data.VALTYPE_CD" hint="NAME_CHAR" :options="VALTYPE_OPTIONS"
              @blur="VALTYPE_CD_SELECTED(edit_data.VALTYPE_CD)" />
          </q-form>
        </q-card-section>
        <q-card-section v-else class="text-caption">
          {{ $store.getters.TEXT.alerts.no_data }}
        </q-card-section>

        <q-card-actions align="between">
          <q-btn class="my-btn" no-caps flat rounded :label="$store.getters.TEXT.btn.close" color="primary"
            v-close-popup />
          <q-btn class="my-btn" no-caps flat rounded :label="$store.getters.TEXT.btn.ok" color="primary"
            @click="updateConcept(edit_data)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import {importConceptFromCSV, VALTYPE_CD_LIST} from 'src/tools/formatdata'
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBFunctions_ConceptsImport',

  components: {HEADING, MainSlot},

  data() {
    return {
      csv_file: undefined,
      preview_data: undefined,
      selected: [],
      filter: undefined,
      show_edit_modal: false,
      edit_data: undefined,
      show_banner: false,
      modus: undefined,
      imported_data: undefined,
      columns_imported: [
        { name: 'status', align: 'center', label: 'status', field: 'status', sortable: true },
        { name: 'CONCEPT_CD', align: 'center', label: 'CONCEPT_CD', field: 'CONCEPT_CD', sortable: true },
        { name: 'CONCEPT_PATH', align: 'center', label: 'CONCEPT_PATH', field: 'CONCEPT_PATH', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'NAME_CHAR', field: 'NAME_CHAR', sortable: true },
      ]
    }
  },

  mounted() {
    // this.importData({path: "/Users/ste/MyProjects/dbBEST/dbase/CONCEPTS_DATA_2023sb.csv"})
  },

  watch: {


  },

  computed: {
    VALTYPE_OPTIONS() {
      return VALTYPE_CD_LIST
    },
    ROWSPERPAGE() {
      return [10, 25, 50, 100]
    }
  },

  methods: {
    loadFile() {
      console.log('lade: ', this.csv_file)
    },

    importData(file){
      this.$store.commit('LOG', {method: 'ImportObservation->importData', data: {file: file.path}})
      const txt = window.electron.readFile(file.path, 'utf8')
      this.preview_data = importConceptFromCSV(txt)
      this.show_banner = true
      this.modus = 'preview'
    },

    deleteSelection() {
      if (!confirm(this.$store.getters.TEXT.question.selection_remove)) return
      
      this.selected.forEach(s => {
        this.preview_data = this.preview_data.filter(el => el.CONCEPT_PATH !== s.CONCEPT_PATH)
      })
      this.selected = []

    },

    editEntry() {
      this.show_edit_modal = true; 
      this.edit_data = JSON.parse(JSON.stringify(this.selected[0]))
    },

    VALTYPE_CD_SELECTED(val) {
      if (val && val.value) {
        this.edit_data.VALTYPE_CD = val.value
      }
    },

    updateConcept(val) {
      let obj = this.preview_data.find(f => f.CONCEPT_PATH === this.selected[0].CONCEPT_PATH && f.CONCEPT_CD === this.selected[0].CONCEPT_CD)
      if (!obj) return this.$q.notify('ERROR: should never happen 20230105')
      obj.CONCEPT_CD = val.CONCEPT_CD
      obj.CONCEPT_PATH = val.CONCEPT_PATH
      obj.NAME_CHAR = val.NAME_CHAR
      obj.VALTYPE_CD = val.VALTYPE_CD
      this.selected = [];
      this.edit_data = undefined
      this.show_edit_modal = false
    },

    writeToDB() {
      if (!this.preview_data) return
      
      const promises = []

      this.preview_data.forEach((data) => {
        promises.push(this._write(data)) 
      })

      var RESULT = []
      Promise.all(promises).then(r => RESULT = r)
      .finally(e => {
        this.imported_data = RESULT
        this.modus = 'import_finshed'
      })

    },

    // ACTUALLY WRITE AND RETURN A PROMISE WITH STATUS
    _write(data) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('addDB', {query_string: data, table: 'CONCEPT_DIMENSION'})
        .then(r => resolve({...{status: true}, ...data}))
        .catch(e => resolve({...{status: false, error: e}, ...data }))

      })
    },

    refreshPage() {
      this.csv_file = undefined
      this.preview_data = undefined
      this.selected = []
      this.filter = undefined
      this.show_edit_modal = false
      this.edit_data = undefined
      this.show_banner = false
      this.modus = undefined
      this.imported_data = undefined
    }

  }

}
</script>
