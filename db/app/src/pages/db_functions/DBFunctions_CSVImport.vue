<template>
  <q-page class="column items-center q-pb-lg">
      <!-- HEADING -->
      <HEADING :title="$store.getters.TEXT.page.observation_import.title" :img="'csv-import-logo.png'"/>
      <div class="col q-mt-xl">
        
        <div class="q-mt-xl text-center">
          <q-tabs
              v-model="tab"
            >
              <q-tab name="csv"  label="CSV import" />
              <q-tab name="hl7"  label="HL7 import" @click="$router.push({name: 'DBFunctions_HL7Import'})"/>

          </q-tabs>
        </div>
        <!-- SELECT FILE -->
        <div v-if="!patients && !show_nothing_found_banner">
          <SELECT_FILE :accept="'.csv'" :label="'CSV Datei auswählen (.csv)'" @save="importData($event)"/>
        </div>
        
      </div>

      <!-- INFO  -->
      <div v-if="!patients && !show_nothing_found_banner && !show_loading_spinner" class="col"><q-icon class="cursor-pointer" name="info" size="lg" @click="show_info = true"/></div>
      <HELP_CSV_IMPORT :active="show_info" :no_limit="true" @close="show_info = false"/>

      <!-- LOADING BANNER -->
      <div v-if="show_loading_spinner">
          <q-spinner
            color="primary"
            size="3em"
            :thickness="10"
          />
      </div>

      <!-- BANNER NICHTS GEFUNDEN -->
      <div v-if="show_nothing_found_banner" class="col">
      <q-banner  class="bg-red-3 q-ma-md" dense inline-actions>{{$store.getters.TEXT.page.observation_import.banner_nothing_found}}
          <template v-slot:action>
            <q-btn round flat color="black" icon="close" @click="show_nothing_found_banner = false; patient = undefined"/>
          </template>
      </q-banner>
      </div>
      <!-- ERGEBNISSE ANZEIGEN -->
      <div class="col my-list-item q-pb-xl" v-if="patients">
        <q-banner v-if="show_banner" class="bg-red-3 q-ma-md" dense inline-actions>{{$store.getters.TEXT.page.concept_import.info_banner}}
          <template v-slot:action>
            <q-btn round flat color="black" icon="close" @click="show_banner = false"/>
          </template>
        </q-banner>
        <q-list dense v-for="(item, ind) in patients" :key="ind+'elemente'" class="q-my-lg ">
          <q-expansion-item
            expand-separator
            icon="perm_identity"
            :label="`ID: ${item.PATIENT_CD}`"
            :caption="`num: ${item.PATIENT_NUM}`"
          >
          <q-card>
            <q-card-section class="text-h4 bg-grey-3">
              Patient: {{item.PATIENT_NUM}}
              <span class="q-ml-lg text-caption">
                ID: {{item.PATIENT_CD}}
                <EDIT_ICON />
                <q-popup-edit v-model="item.PATIENT_CD" auto-save buttons v-slot="scope">
                  <q-input v-model="scope.value" dense  type="text" @keyup.enter="scope.set" @blur="patient_cd_changed(scope.value, item)"/>
                </q-popup-edit>
            </span>
            </q-card-section>
           
            <q-card-section v-for="(visite, ind_visite) in item.VISITS" :key="ind_visite + 'visite'" class="q-pa-none q-mb-md bg-grey-3">
                <OBSERVATION_TABLE_SHORT :title="`Visite ${ind_visite+1}`" :input_data="item.VISIT_INFO[ind_visite]" @changed="(item.VISIT_INFO[ind_visite] = $event);" />
                <OBSERVATION_TABLE_EDIT :input_data=" visite" @changed="item.VISITS[ind_visite] = $event"/>
            </q-card-section>            
          
         </q-card>
          </q-expansion-item>
        </q-list>

        <div class="fixed-bottom text-center q-mb-lg my-transparent-bg">
          <div>
            <q-checkbox disable v-model="options_import.new_patient" label="Probanden/Patienten als NEU hinzufügen" />
          </div>
          <div class=" q-gutter-md">
            <q-btn icon="add_circle" no-caps  rounded class="my-btn" @click="addImportToDB()" label="hinzufügen" />
            <q-btn icon="close" no-caps  rounded class="my-btn" @click="patients = undefined; show_nothing_found_banner = false" label="abbrechen"/>
          </div>
        </div>

        
      </div>
  </q-page>
</template>

<script>

import HELP_CSV_IMPORT from 'src/components/Help_CSV_Import.vue'
import OBSERVATION_TABLE_SHORT from 'src/components/ObservationTable_short.vue'
import OBSERVATION_TABLE_EDIT from 'src/components/ObservationTable_edit.vue'
import EDIT_ICON from 'src/components/elements/EditIcon.vue'
import HEADING from 'src/components/elements/Heading.vue'
import SELECT_FILE from 'src/components/elements/SelectFile.vue'

import {beautify_data} from 'src/tools/formatdata'

export default {
  name: 'DBFunctions_CSVImport',

  components: { HEADING, HELP_CSV_IMPORT, OBSERVATION_TABLE_SHORT, HELP_CSV_IMPORT, OBSERVATION_TABLE_EDIT, EDIT_ICON, SELECT_FILE },

  data() {
    return {
      csv_file: undefined,
      show_info: false,
      patients: undefined,
      options_import: {new_patient: true},
      show_banner: true,
      show_nothing_found_banner: false,
      show_loading_spinner: false,
      tab: 'csv'
    }
  },

  mounted() {
    // this.importData({path: "/Users/ste/MyProjects/dbBEST/dbase/OBSERVATIONS_MCI_202301_as.csv"})
  },

  watch: {


  },

  computed: {

  },

  methods: {


    importData(file){
      this.show_nothing_found_banner = false
      this.show_loading_spinner = true
      this.$store.dispatch('importObjectsFromCSVFile', file.path)
      .then(res => {
        this.show_loading_spinner = false
        if (res) this.patients = res
        else this.show_nothing_found_banner = true
      }).catch(err => {
        this.show_loading_spinner = false
      })

    },

    


    // import the data
    addImportToDB() {
      this.$store.commit('LOG', {method: 'DBFunctions_CSVImport/addImportToDb', message: 'importiere Daten'})
      const INFO = [{field: 'AGE_IN_YEARS', value: 'LID: 63900-5'}, {field: 'BIRTH_DATE', value: 'SCTID: 184099003'}, {field: 'SEX_CD', value: 'SCTID: 263495000'}]
      // LOOPE durch alle Patienten
      const PATIENT_IDS = []
      Object.keys(this.patients).forEach(p => {
        let patient = this.patients[p]
        //durchsuche die Observations nach Daten, um den Patienten zu befüllen
        const PATIENT = this.fillPatientData(patient, INFO)

        // TODO addDB >> PATIENT >> get ID
        this.$store.dispatch('addDB', {query_string: PATIENT, table: "PATIENT_DIMENSION"})
        .then(res_patient => {
          // LOOP THROUGH ALL VISITS
          PATIENT_IDS.push(res_patient)
          for (let i = 0; i < patient.VISIT_INFO.length; i++) {
            let VISIT = patient.VISIT_INFO[i]
            VISIT.PATIENT_NUM = res_patient.PATIENT_NUM
            let OBSERVATIONS = patient.VISITS[i]
            this.$store.dispatch('addDB', {query_string: VISIT, table: "VISIT_DIMENSION"})
            .then(res_visit => {
              OBSERVATIONS.forEach(obs => {
                delete obs._CHECK
                let OBS = beautify_data(obs)
                OBS.PATIENT_NUM = res_patient.PATIENT_NUM
                OBS.ENCOUNTER_NUM = res_visit.ENCOUNTER_NUM
                this.$store.dispatch('addDB', {query_string: OBS, table: "OBSERVATION_FACT"})
              })
            }).catch(err => this.$q.notify(err))
          }
        }).catch(err => this.$q.notify({message: err, timeout: 5000}))
        .finally(() => {
          if (PATIENT_IDS.length >= Object.keys(this.patients).length) {
            this.$q.notify(`Erfolgreich: ${PATIENT_IDS.length} Probanden/Patienten hinzugefügt: ${JSON.stringify(PATIENT_IDS)}`)
            this.patients = undefined
            this.csv_file = undefined
          }
        })
      })
    },

    //loops through the observations and tries to fill the PATIENT_DIMENSINO
    fillPatientData(patient, INFO) {
      const PATIENT = {PATIENT_CD: patient.PATIENT_CD}
      patient.VISITS.forEach(v => {
          v.forEach(obs => {
            let obj = INFO.find(o => o.value === obs.CONCEPT_CD);
            if (obj) {
              if (obs.VALTYPE_CD === 'N') PATIENT[obj.field] = obs.NVAL_NUM
              else PATIENT[obj.field] = obs.TVAL_CHAR
            }
          })
        })
      if (!PATIENT.VITAL_STATUS_CD) PATIENT.VITAL_STATUS_CD = 'SCTID: 438949009xx' //unknown
      return beautify_data(PATIENT)
    },

    // UPDATE THE PATIENT_CD in all sub-structures
    patient_cd_changed(PATIENT_CD, item){
      item.PATIENT_CD = PATIENT_CD
      item.VISITS.forEach(v => {
        v.forEach(o => {
          o.PATIENT_CD = PATIENT_CD
        })
      })
    }


    // ENDE METHODS
  },



}
</script>
