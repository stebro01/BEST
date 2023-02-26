<template>
  <div class="row justify-center q-mb-lg">
    <!-- PREVIEW PATIENT -->
    <PREVIEW_IMPORT_INFO :data_checked="data_checked" :patient_data="patient_data" :mode_visits="mode_visits" 
      @updateMode="mode_visits = $event" @close="$emit('close')"
      @save="saveToDB()"
    />
    <!-- PREVIEW CONTENT -->
    <PREVIEW_IMPORT_DATA v-if="data_checked" 
      :patient_data="patient_data" :total_errors_found="total_errors_found" 
      @remove="removeItem($event)"
    />
    <div v-if="!data_checked" class="col-12 q-mb-lg text-center">
      <q-btn v-if="doing_check === false" no-caps rounded class="q-mt-md" @click="checkCQL(patient_data)">Daten mit CQL überprüfen</q-btn>
      <q-spinner v-else size="md" ></q-spinner>
    </div>
  </div>
</template>

<script>

import PREVIEW_IMPORT_INFO from './PreviewImportInfo.vue'
import PREVIEW_IMPORT_DATA from './PreviewImportData.vue'

export default {
  name: 'PreviewImport',

  components: { PREVIEW_IMPORT_DATA, PREVIEW_IMPORT_INFO },

  props: ['imported_data'],

  data() {
    return {
      mode_visits: 'new',
      data_checked: false,
      doing_check: false,
      total_errors_found: undefined,
      patient_data: undefined
    }
  },

  mounted(){
    if (this.imported_data) this.patient_data = JSON.parse(JSON.stringify(this.imported_data))
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT
    },


  },

  methods: {
    async checkCQL(data) {
      //checke die Visiten
      this.doing_check = true
      const ERRORS = {
        visits: 0, 
        observations: 0,
        total_checks: 0
      }

      for (let visit of data.VISITS) {
        //CHECK START_DATE
        visit._check = undefined
        let tmp = {VALTYPE_CD: 'D', TVAL_CHAR: visit.START_DATE}
        visit._check = this.updateCheck(visit._check, await this.$store.dispatch('checkCQLRule', tmp), ERRORS)
        
        //count errors
        if (!visit._check.status) ERRORS.visits ++
      }

      //checke die Observations
      for (let OBS of data.OBSERVATIONS) {
        for (let obs_key of Object.keys(OBS)) {
          let obs = OBS[obs_key]
          let CHECK = undefined
          if (typeof(obs.ENCOUNTER_NUM) === 'string') obs.ENCOUNTER_NUM = parseInt(obs.ENCOUNTER_NUM)
          if (typeof(obs.PATIENT_NUM) === 'string') obs.PATIENT_NUM = parseInt(obs.PATIENT_NUM)
          // CHECKE DIE REGEL
          CHECK = this.updateCheck(CHECK, await this.$store.dispatch('checkCQLRule', obs), ERRORS)
          //checke noch das START_DATE
          let tmp = {VALTYPE_CD: 'D', TVAL_CHAR: obs.START_DATE}
          CHECK = this.updateCheck(CHECK, await this.$store.dispatch('checkCQLRule', tmp), ERRORS, 'START_DATE')

          //count errors
          if (!CHECK.status) ERRORS.observations ++         
          if (typeof(obs.CONCEPT_CD) === 'object') ERRORS.observations++
          obs._check = CHECK
        }
      }   
      
      //errors:
      this.$q.notify(`${ERRORS.total_checks} Checks erfolgt: Fehler gefunden: Visiten ${ERRORS.visits} und Observations ${ERRORS.observations}`)
      this.total_errors_found = ERRORS.observations + ERRORS.visits
      this.doing_check = false
      this.data_checked = true
    },

    updateCheck(CHECK, check, ERRORS, info) {
      ERRORS.total_checks ++
      if (!CHECK) return {status: check.status, data: [check]}
      //else
      if (check.status === false) CHECK.status = false
      if (!info) CHECK.data.push(check)
      else CHECK.data.push({...check, info: info})
      return CHECK

    },

    removeItem(item) {
      if (!item || typeof(item) !== 'object') return
      if (item.visit !== undefined) {
        if (!item.observation) {
          this.patient_data.VISITS.splice(item.visit,1)
          console.log(this.patient_data.VISITS, item)
        }

      }
      this.data_checked = false
      this.$nextTick(() => this.data_checked = true)
    },

    saveToDB() {
      const data = this.patient_data
      if (!data) return;
      if (data.PATIENT) {
        data.PATIENT.PATIENT_CD = this.$store.getters.PATIENT_PINNED.PATIENT_CD;
        if (this.mode_visits === "add")
          data.FORCE_VISIT = this.$store.getters.VISIT_PINNED;

        this.$store
          .dispatch("saveHL7ObjectsToDB", data)
          .then((res) => {
            if (res.status) this.$q.notify(res.data);
            else if (res.error) this.$q.notify(res.error);
          })
          .catch((err) => this.$q.notify("Error: ", err))
          .finally(() => {
            this.$emit('close')
          });
      }
    },

  }

}
</script>