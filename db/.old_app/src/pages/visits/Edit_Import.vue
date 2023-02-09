<template>
  <q-page >
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'general_icon.png'" :icon="'event'"/>
        </template>

<!-- MAIN -->
<template v-slot:main class="row items-center">
    <div class="col-12" v-if="!patient_data">
          <q-tabs style="z-index: 10"
              v-model="selected_import_method"
            >
            <q-tab v-for="(item, ind) in options_import" :key="ind + 'opt'"
              :name="item.value" :label="item.label" no-caps 
              @click="patient_data = undefined; "
              />
          </q-tabs>
    </div>

    <!-- SELECT FILE -->
    <div v-if="!patient_data" class="text-center">
      <SELECT_FILE :accept="ACCEPT_FILETYPE" :label="`${TEXT.select_file} (${ACCEPT_FILETYPE})`" @save="importData($event, selected_import_method)"/>

      <div v-if="selected_import_method === 'csv'">
        <q-icon name="info" class="q-mt-sm" size="md" @click="show_csv_help = true"/>
      </div>
    </div>

    <!-- VORSCHAU -->
    <div v-if="patient_data" class="column items-center">
      <q-card  class="my-card text-center"> 
          <q-card-section>
            <q-banner dense inline-actions class="bg-green-3">Daten gefunden
              <template v-slot:action>
                <q-btn round flat color="black" icon="close" @click="patient_data = undefined"/>
              </template>
            </q-banner>
            <q-banner v-if="info_patientcd_doesnot_match" dense inline-actions class="bg-red-1">
              <span class="text-caption">
              PATIENT_CD vom Import stimmt nicht mit aktuellem Patienten überein. Wenn Sie fortfahren, wird der Datensatz dem aktuellen Patienten hinzugefügt.
              </span>
              <template v-slot:action>
                <q-btn round flat color="black" icon="close" @click="info_patientcd_doesnot_match = false"/>
              </template>
            </q-banner>

          </q-card-section>
          <q-card-section v-if="patient_data.PATIENT" class="q-pa-none">
            PATIENT_CD: {{ patient_data.PATIENT.PATIENT_CD }}
          </q-card-section>
          <q-card-section >
            Visiten: {{ patient_data.VISITS.length }}
            <div>
              <q-btn-toggle no-caps
              v-model="mode_visits"
              toggle-color="primary"
              :options="options_mode_visits"
            />
            </div>
          </q-card-section>

          <q-card-actions align="center">
            
            <q-btn class="my-btn" rounded no-caps @click="saveToDB(patient_data)">
              in DB speichern
              <q-tooltip v-if="mode_visits==='new'">Die Daten werden als neue Visite(n) hinzugefügt</q-tooltip>
              <q-tooltip v-else>Die Daten werden der aktuellen Visite hinzugefügt</q-tooltip>
            </q-btn>

          </q-card-actions>
        </q-card>

        <PREVIEW_IMPORT v-if="patient_data" :patient_data="patient_data" @remove="removeItem($event)"/>
            
      </div>

    </template>
    </MainSlot>

    <!-- HELP DIALOGS -->
    <HELP_CSV_IMPORT  :active="show_csv_help" @close="show_csv_help = false" />

    <!-- DIALOG FOR FOUND PATIENTS -->
    <q-dialog v-model="show_csv_found_list" v-if="CSV_TMP_DATA">
      
      <q-card class="my-card" >
        <q-card-section class="text-h6">Multiple Patienten gefunden</q-card-section>
        <q-card-section class="q-pa-none">
          <div class="text-caption text-center">zu importierenden Eintrag auswählen</div>
          <q-scroll-area style="height: 300px; width: 100%">
          <q-list bordered >
            <q-item v-for="(item, ind) in Object.keys(CSV_TMP_DATA)" :key="ind+'csvfound'" clickable v-ripple @click="_csv_data(CSV_TMP_DATA[item])">
              <q-item-section avatar>{{ ind+1 }}</q-item-section>
              <q-item-section>{{ CSV_TMP_DATA[item].PATIENT_CD }}: {{ CSV_TMP_DATA[item].VISITS.length }} Visiten</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
    
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import SELECT_FILE from 'src/components/elements/SelectFile.vue'
import PREVIEW_IMPORT from 'src/components/elements/PreviewImport.vue'
import HELP_CSV_IMPORT from 'src/components/Help_CSV_Import.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'ImportObservation',

  components: {HEADING, HELP_CSV_IMPORT, SELECT_FILE, PREVIEW_IMPORT, MainSlot },

  data() {
    return {
      obs: {},
      file_to_read: undefined,
      options_import: [{value: 'hl7', label: 'HL7 JSON/HTML'}, {value: 'csv', label: 'CSV Tabellenformat'}],
      selected_import_method: 'csv',
      patient_data: undefined,
      show_csv_help: false,
      show_csv_found_list: false,
      info_patientcd_doesnot_match: false,
      mode_visits: 'new',
      CSV_TMP_DATA: undefined

    }
  },

  mounted() {


  },

  computed: {
    ACCEPT_FILETYPE() {
      if (!this.selected_import_method) return ''
      if (this.selected_import_method === 'csv') return '.csv'
      if (this.selected_import_method === 'hl7') return '.json, .html'
      return ''
    },

    options_mode_visits() {
      const options = [{label: 'Neu', value: 'new'}]
      if (this.$store.getters.VISIT_PINNED) options.push({label: 'Hinzufügen', value: 'add'})
      return options
    },

    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    }
  },

  methods: {
    importData(file, method){
      this.CSV_TMP_DATA = undefined
      this.$store.commit('LOG', {method: 'ImportObservation->importData', data: {file: file.path, method: method}})

      // WHICH METHOD?
      if (method === 'hl7')  this.importSURVEY(file.path)
      else if (method === 'csv') this.importCSVFile(file.path)
      else this.$q.notify('Comming soong ...')
    },

    importCSVFile(filePath) {
      
      this.$store.dispatch('importObjectsFromCSVFile', filePath)
      .then(patients => {
        if (!patients) return this.$q.notify('Daten sind nicht kompatible')
        const keys = Object.keys(patients)
        if (keys.length > 1) {
          //prepare the dialog
          this.CSV_TMP_DATA = patients
          this.show_csv_found_list = true
        } else this. _csv_data(patients[keys[0]])
        
      })

      return
      
    },

    _csv_data(patients) {
      const DATA = {
          PATIENT: {PATIENT_CD: patients.PATIENT_CD},
          OBSERVATIONS: patients.VISITS,
          VISITS: patients.VISIT_INFO
        }

        let cc = 0
        DATA.VISITS.forEach(v => {
          cc += 1
          if (!v.SOURCESYSTEM_CD) v.SOURCESYSTEM_CD = "SNOMED-CT"
          v.ENCOUNTER_NUM = cc
        })
        // console.log(DATA)
        this.patient_data = DATA
        this.CSV_TMP_DATA = undefined
    },

    async importSURVEY(filePath) {
      const txt = window.electron.readFile(filePath, 'utf8')
      const DATA = await this.$store.dispatch('importSurveyBEST', txt)

      if (DATA.error) return this.$q.notify('Error: ' + DATA.error)
      if (!DATA || !DATA.PATIENT) return this.$q.notify('Daten konnten nicht geladen werden')
      this.patient_data = DATA
      // console.log(DATA)
      if (DATA.PATIENT.PATIENT_CD !== this.$store.getters.PATIENT_PINNED.PATIENT_CD) this.info_patientcd_doesnot_match = true
    },

    saveToDB(data) {
      if (!data) return
      if (data.PATIENT) {
        data.PATIENT.PATIENT_CD = this.$store.getters.PATIENT_PINNED.PATIENT_CD
        if (this.mode_visits === 'add') data.FORCE_VISIT = this.$store.getters.VISIT_PINNED

        this.$store.dispatch('saveHL7ObjectsToDB', data)
          .then(res => {
            if (res.status) this.$q.notify(res.data)
            else if (res.error) this.$q.notify(res.error)
          }).catch(err => this.$q.notify('Error: ', err))
          .finally(() => {
            this.patient_data = undefined
          })
      }
    },

    removeItem(item) {
      if (item.observation !== undefined && item.visit !== undefined) {
        this.patient_data.OBSERVATIONS[item.visit].splice(item.observation, 1)
        if (this.patient_data.OBSERVATIONS[item.visit].length === 0) {
          this.patient_data.OBSERVATIONS.splice(item.visit, 1)
          this.patient_data.VISITS.splice(item.visit, 1)
          if (this.patient_data.VISITS.length === 0) this.patient_data = undefined
        }
      } else if (item.visit !== undefined){
        this.patient_data.OBSERVATIONS.splice(item.visit, 1)
        this.patient_data.VISITS.splice(item.visit, 1)
        if (this.patient_data.VISITS.length === 0) this.patient_data = undefined
      }      
    }



    


   
  }

}
</script>
