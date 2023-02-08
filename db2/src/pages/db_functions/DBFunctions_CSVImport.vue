<template>
  <q-page>
    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.observation_import.title" :img="'csv-import-logo.png'" :icon="'file_download'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="row">

          <div class="col-12">
            <q-tabs v-model="tab">
              <q-tab name="csv" label="CSV import" />
              <q-tab name="hl7" label="HL7 import" @click="$router.push({ name: 'DBFunctions_HL7Import' })" />
            </q-tabs>
          </div>
          <!-- SELECT FILE -->
          <SELECT_FILE v-if="!patients && !show_nothing_found_banner" class="col-12" :accept="'.csv'"
            :label="'CSV Datei auswählen (.csv)'" @save="importData($event)" />

          <!-- INFO  -->
          <div v-if="!patients && !show_nothing_found_banner && !show_loading_spinner" class="col-12 text-center">
            <q-icon class="cursor-pointer" name="info" size="lg" @click="show_info = true" />
          </div>
          <HELP_CSV_IMPORT :active="show_info" :no_limit="true" @close="show_info = false" />

          <!-- BANNER NICHTS GEFUNDEN -->
          <div v-if="show_nothing_found_banner" class="col-12">
            <q-banner class="bg-red-3 q-ma-md" dense inline-actions>{{
              $store.getters.TEXT.page.observation_import.banner_nothing_found
            }}
              <template v-slot:action>
                <q-btn round flat color="black" icon="close"
                  @click="show_nothing_found_banner = false; patient = undefined" />
              </template>
            </q-banner>
          </div>
          <!-- ERGEBNISSE ANZEIGEN -->
          <div class="col-12 row justify-center my-list-item q-pb-xl" v-if="patients">
            <q-banner v-if="show_banner" class="bg-red-3 q-ma-md" dense inline-actions>{{
              $store.getters.TEXT.page.concept_import.info_banner
            }}
              <template v-slot:action>
                <q-btn round flat color="black" icon="close" @click="show_banner = false" />
              </template>
            </q-banner>
            <q-list dense v-for="(item, ind) in patients" :key="ind + 'elemente'" class="q-my-md ">
              <q-expansion-item expand-separator icon="perm_identity" :label="`ID: ${item.PATIENT_CD}`"
                :caption="`num: ${item.PATIENT_NUM}`" class="bg-accent q-ma-xs">
                <q-card>
                  <q-card-section class="text-h4 bg-grey-3">
                    Patient: {{ item.PATIENT_NUM }}
                    <span class="q-ml-lg text-caption">
                      ID: {{ item.PATIENT_CD }}
                      <EDIT_ICON />
                      <q-popup-edit v-model="item.PATIENT_CD" auto-save buttons v-slot="scope">
                        <q-input v-model="scope.value" dense type="text" @keyup.enter="scope.set"
                          @blur="patient_cd_changed(scope.value, item)" />
                      </q-popup-edit>
                    </span>
                  </q-card-section>

                  <q-card-section v-for="(visite, ind_visite) in item.VISITS" :key="ind_visite + 'visite'"
                    class="q-pa-none q-mb-md bg-grey-3">
                    <OBSERVATION_TABLE_SHORT :title="`Visite ${ind_visite + 1}`"
                      :input_data="item.VISIT_INFO[ind_visite]" @changed="(item.VISIT_INFO[ind_visite] = $event);" />
                    <OBSERVATION_TABLE_EDIT :input_data="visite" @changed="item.VISITS[ind_visite] = $event" />
                  </q-card-section>

                </q-card>
              </q-expansion-item>
            </q-list>


          </div>

        </div>

      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <!-- LOADING BANNER -->
        <div v-if="show_loading_spinner" class="col-12">
          <q-spinner color="primary" size="3em" :thickness="10" />
        </div>

        <!-- BUTTONS  -->
        <div class="text-center" v-if="patients">
          <div class=" q-gutter-md" style="position: relative">
            <q-btn icon="add_circle" no-caps rounded class="my-btn" @click="addImportToDB()" label="hinzufügen" />
            <q-btn icon="close" no-caps rounded class="my-btn"
              @click="patients = undefined; show_nothing_found_banner = false" label="abbrechen" />

            <q-checkbox style="position: absolute; top: -40px; right: 50%" disable v-model="options_import.new_patient"
              label="Probanden/Patienten als NEU hinzufügen" />
          </div>
        </div>
      </template>
    </MainSlot>
  </q-page>
</template>

<script>

import HELP_CSV_IMPORT from 'src/components/Help_CSV_Import.vue'
import OBSERVATION_TABLE_SHORT from 'src/components/ObservationTable_short.vue'
import OBSERVATION_TABLE_EDIT from 'src/components/ObservationTable_edit.vue'
import EDIT_ICON from 'src/components/elements/EditIcon.vue'
import HEADING from 'src/components/elements/Heading.vue'
import SELECT_FILE from 'src/components/elements/SelectFile.vue'
import MainSlot from 'src/components/MainSlot.vue'


import {beautify_data} from 'src/tools/formatdata'

export default {
  name: 'DBFunctions_CSVImport',

  components: { HEADING, HELP_CSV_IMPORT, OBSERVATION_TABLE_SHORT, HELP_CSV_IMPORT, OBSERVATION_TABLE_EDIT, EDIT_ICON, SELECT_FILE, MainSlot },

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
    async addImportToDB() {
      this.$store.commit('LOG', {method: 'DBFunctions_CSVImport/addImportToDb', message: 'importiere Daten'})
      const INFO = [{field: 'AGE_IN_YEARS', value: 'LID: 63900-5'}, {field: 'BIRTH_DATE', value: 'SCTID: 184099003'}, {field: 'SEX_CD', value: 'SCTID: 263495000'}]
      // LOOPE durch alle Patienten
      const PATIENT_IDS = []
      for (let p of Object.keys(this.patients)) {
        let patient = this.patients[p]
        //durchsuche die Observations nach Daten, um den Patienten zu befüllen
        const PATIENT = this.fillPatientData(patient, INFO)

        // TODO addDB >> PATIENT >> get ID
        let res_patient = await this.$store.dispatch('addDB', {query_string: PATIENT, table: "PATIENT_DIMENSION"})
          // LOOP THROUGH ALL VISITS
          PATIENT_IDS.push(res_patient)
          for (let i = 0; i < patient.VISIT_INFO.length; i++) {
            let VISIT = patient.VISIT_INFO[i]
            VISIT.PATIENT_NUM = res_patient.PATIENT_NUM
            let OBSERVATIONS = patient.VISITS[i]
            let res_visit = await this.$store.dispatch('addDB', {query_string: VISIT, table: "VISIT_DIMENSION"})
            
            for (let obs of OBSERVATIONS) {
                delete obs._CHECK
                let OBS = beautify_data(obs)
                OBS.PATIENT_NUM = res_patient.PATIENT_NUM
                OBS.ENCOUNTER_NUM = res_visit.ENCOUNTER_NUM
                await this.$store.dispatch('addDB', {query_string: OBS, table: "OBSERVATION_FACT"})
              }
          }

        }

        // FINALY
        if (PATIENT_IDS.length >= Object.keys(this.patients).length) {
            this.$q.notify(`Erfolgreich: ${PATIENT_IDS.length} Probanden/Patienten hinzugefügt: ${JSON.stringify(PATIENT_IDS)}`)
            this.patients = undefined
            this.csv_file = undefined
        }

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
