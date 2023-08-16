<template>
  <q-page class="">
    <q-resize-observer @resize="onResize($event, 'main_size')" />

    <MainSlot :no_options="true" :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Patienten bearbeiten / Modern View'" :img="'db-queries-logo.png'" :icon="'wysiwyg'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="column" :style="MAIN_STYLE">
          <!-- HEADER -->
          <div class="col-2 q-pa-sm">
            <div class="row ">
              <div class="col-8"><q-input dense input-class="text-left" input-style="font-family: 'Courier', monospace;"
                  filled v-model="param.sql_query" label="SQL Statement" /></div>
              <div class="col"><q-btn class="q-ml-md my-btn" @click="runSQLStatement(param.sql_query)">laden</q-btn></div>
            </div>
          </div>
          <!-- MAIN -->
          <div class="col">
            <div class="row justify-center fit">
              <!-- PATIENTLIST -->
              <div class="col-3" >
                <q-resize-observer @resize="onResize($event, 'patientlist_size')" />
                <PATIENT_LIST :patients="localData.PATIENTS" :size="param.patientlist_size" @clicked="patientClicked($event)" />
              </div>
              <!-- MAIN -->
              <div class="col-9 column" v-if="$store.getters.PATIENT_PINNED">
                <div class="col-2" >
                  <VISIT_LIST />
                  <GLOBAL_OBSERVATIONS />
                </div>
  
                <div class="col-10">
                 
                  <q-resize-observer @resize="onResize($event, 'observationlist_size')" />
                  <OBSERVATION_LIST :param="param"/>
                </div>
              </div>

              <!-- ADD DATA BTN -->
              <ADD_DATA_BTN />

            </div>
          </div>
        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
       
      </template>

    </MainSlot>

  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import PATIENT_LIST from 'src/components/patient_view/PatientList.vue'
import VISIT_LIST from 'src/components/patient_view/VisitList.vue'
import OBSERVATION_LIST from 'src/components/patient_view/ObservationList.vue'
import ADD_DATA_BTN from 'src/components/patient_view/AddDataBtn.vue'

import GLOBAL_OBSERVATIONS from 'src/components/patient_view/GlobalObservations.vue'


export default {
  name: 'DBQueries_PatientView',

  components: { HEADING, MainSlot, PATIENT_LIST, VISIT_LIST, OBSERVATION_LIST, ADD_DATA_BTN, GLOBAL_OBSERVATIONS },

  data() {
    return {
      options: this.$store.getters.ENV.options_db_queries,
      param: {
        sql_query: this.$store.getters.ENV.app.env.patient_view.sql_statement,
        filter_patient: undefined,
        main_size: undefined,
        patientlist_size: undefined,
        observationlist_size: undefined
      },
      localData: {
        PATIENTS: undefined
      }
    }
  },

  mounted() {
    this.runSQLStatement(this.param.sql_query)

  },


  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    },

    MAIN_STYLE() {
      if (!this.param.main_size) return `width: 100%; height: 200px`
      return `width: 100%; height: ${this.param.main_size.height / 12 * 9.5}px`
    },

    PATIENTS() {
      if (!this.localData.PATIENTS) return []
      return this.localData.PATIENTS.filter(item => {
        if (!this.param.filter_patient) return true
        return item.PATIENT_CD.includes(this.param.filter_patient)
      })
    }
  },

  methods: {
    

    onResize(size, field) {
      this.param[field] = size
    },

    // LOAD THE DATA
    async runSQLStatement(sql_query) {
      const res = await this.$store.dispatch('runQuery', sql_query)
      if (res.status) {
        this.localData.PATIENTS = res.data
        this.$q.notify({ type: 'positive', message: 'Daten erfolgreich geladen' })
      } else {
        this.$q.notify({ type: 'negative', message: 'Daten konnten nicht geladen werden' })
      }
    },

    // PATIENT CLICKED
    patientClicked(patient) {
      // lade die Visiten
      this.$store.commit('PATIENT_PINNED_SET', patient)
      this.$store.commit('VISIT_PINNED_SET', undefined)
    },

    // ENDE METHODS
  }


}
</script>
