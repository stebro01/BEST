<template>
  <q-page>
    <MainSlot :no_footer="true" :no_options="true">

      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.observation_import.title" :img="'csv-import-logo.png'" :icon="'file_download'"
          style="z-index: 100" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="row text-center">
          <div class="col-12">
            <q-tabs style="z-index: 10" v-model="tab">
              <q-tab name="csv" label="CSV import" @click="$router.push({ name: 'DBFunctions_CSVImport' })" />
              <q-tab name="hl7" label="HL7 import" />

            </q-tabs>
          </div>

          <!-- SELECT FILE -->
          <SELECT_FILE v-if="!patient_data && !show_nothing_found_banner" class="col-12" :accept="'.json'"
            :label="'HL7JSON Datei auswählen (.json)'" @save="importData($event)" />


          <!-- qergebnisse        -->
          <div v-if="patient_data" class="col-12 column items-center">
            <q-card class="my-card q-mt-xl text-center">
              <q-card-section>
                <q-banner dense inline-actions class="bg-green-3">Daten gefunden
                  <template v-slot:action>
                    <q-btn round flat color="black" icon="close" @click="patient_data = undefined" />
                  </template>
                </q-banner>
                <q-banner v-if="patient_exists" class="bg-red-1">
                  <span class="text-caption">
                    Patient mit dieser PATIENT_CD existiert schon in der DB! Wenn die Daten dennoch gespeichert werden,
                    werden sie hinzugefügt.
                  </span>
                </q-banner>
              </q-card-section>
              <q-card-section v-if="patient_data.PATIENT">
                PATIENT_CD: {{ patient_data.PATIENT.PATIENT_CD }} <q-btn class="q-ml-md" round flat icon="search"
                  @click="show_change_patient = true"><q-tooltip>Den Eintrag einem anderen Patienten
                    zuordnen</q-tooltip></q-btn>
              </q-card-section>
              <q-card-section>
                Visiten: {{ patient_data.VISITS.length }}
              </q-card-section>

              <q-card-actions align="center">
                <q-btn class="my-btn" rounded no-caps @click="saveToDB(patient_data)">in DB speichern</q-btn>
              </q-card-actions>
            </q-card>

            <!-- VORSCHAU -->
            <PREVIEW_IMPORT v-if="patient_data" :patient_data="patient_data" />
          </div>
        </div>

        <!-- LOADING BANNER -->
        <div v-if="show_loading_spinner">
          <q-spinner color="primary" size="3em" :thickness="10" />
        </div>

        <!-- BANNER NICHTS GEFUNDEN -->
        <div v-if="show_nothing_found_banner" class="col-12">
          <q-banner class="bg-red-3 q-ma-md" dense
            inline-actions>{{ $store.getters.TEXT.page.observation_import.banner_nothing_found }}
            <template v-slot:action>
              <q-btn round flat color="black" icon="close"
                @click="show_nothing_found_banner = false; patient = undefined" />
            </template>
          </q-banner>
        </div>
      </template>

    </MainSlot>

    <DIALOG_SELECT_PATIENT v-if="show_change_patient" :active="show_change_patient" @close="show_change_patient = false"
      @save="changePatient($event)" />


  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'
import DIALOG_SELECT_PATIENT from 'src/components/Dialog_SelectPatient.vue'
import SELECT_FILE from 'src/components/elements/SelectFile.vue'
import PREVIEW_IMPORT from 'src/components/elements/PreviewImport.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBFunctions_HL7Import',

  components: { HEADING, DIALOG_SELECT_PATIENT, SELECT_FILE, PREVIEW_IMPORT, MainSlot},

  data() {
    return {
      csv_file: undefined,
      patient_data: undefined,
      show_nothing_found_banner: false,
      show_loading_spinner: false,
      patient_exists: false,
      tab: 'hl7',
      show_change_patient: false
    }
  },

  mounted() {
  },

  watch: {


  },

  computed: {

  },

  methods: {

    importData(file){
      this.show_nothing_found_banner = false
      this.show_loading_spinner = true
      this.patient_exists = false
      this.$store.dispatch('importObjectsFromHL7File', file.path)
      .then(res => {
        if (res.error) this.show_nothing_found_banner = true
        else {
          this.patient_data = res
          //überprüfe noch, ob Pat schon exisitiert
          this.$store.dispatch('searchDB', {query_string: {PATIENT_CD: this.patient_data.PATIENT.PATIENT_CD}, table: 'PATIENT_DIMENSION'})
          .then(res => this.patient_exists = (res.length > 0))
        }
      }).catch(err => {
        
      }).finally(() => this.show_loading_spinner = false)

    },

    saveToDB(patient_data) {
      this.$store.dispatch('saveHL7ObjectsToDB', patient_data)
      .then(res => {
        if (res.status) this.$q.notify(res.data)
        else if (res.error) this.$q.notify(res.error)
      }).catch(err => this.$q.notify('Error: ', err))
      .finally(() => {
        this.patient_data = undefined
        this.csv_file = undefined
      })
    },


    changePatient(patient) {
      if (!patient || !this.patient_data) return
      this.patient_data.PATIENT.PATIENT_CD = patient.PATIENT_CD
      this.show_change_patient = false
    }

    // ENDE METHODS
  },



}
</script>
