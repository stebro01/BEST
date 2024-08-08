<template>
  <div class="row justify-center q-mb-lg">
    <!-- PREVIEW PATIENT -->
    <div class="col-12 text-center">{{patient_list.length}} Patienten gefunden</div>
    <div>
      <q-table row-key="PATIENT_CD" dense :rows="patient_list" :columns="patient_list_col" :selection="SHOW_SELECTION_BTNS" v-model:selected="selected">

      </q-table>
    </div>
    <div v-if="doing_check === false" class="col-12 q-mb-lg text-center">
      <div v-if="!data_checked">
        <div>
        <q-btn  no-caps rounded class="q-mt-md" @click="checkCQL_Many(patient_data)">Daten mit CQL überprüfen</q-btn>
        </div>
        <div>
        <q-checkbox readonly :model-value="check_doubles" dense>doppelte Einträge vermeiden</q-checkbox>
        </div>
      </div>
      <q-btn v-else class="q-mt-md my-btn" no-caps flat rounded @click="importToDB(patient_data)">Daten importieren</q-btn>
    </div>
    <!-- PREVIEW PATIENT DATA -->
    <div class="col-12 row text-center justify-center" v-if="SELECTED_PATIENT">
      <PREVIEW_IMPORT_DATA :patient_data="SELECTED_PATIENT" :total_errors_found="SELECTED_PATIENT._ERRORS.total_errors_found"
        @remove="removeItem($event)"
      />
    </div>
  </div>
</template>

<script>

import modes_import from 'src/mixins/modes_import'
import PREVIEW_IMPORT_DATA from './PreviewImportData.vue'

export default {
  name: 'PreviewMultipleImport',

  components: { PREVIEW_IMPORT_DATA },

  mixins: [modes_import],

  props: ['imported_data'],

  data() {
    return {
      patient_data: undefined,
      patient_list: [],
      selected: [],
      patient_list_col: [
        {name: 'PATIENT_CD', field: 'PATIENT_CD', label: 'Patient', sortable: true},
        {name: 'VISITS_COUNT', field: 'VISITS_COUNT', label: 'Visiten', sortable: true, align: 'center'},
        {name: 'OBSERVATIONS_TOTAL', field: 'OBSERVATIONS_TOTAL', label: 'Messungen', sortable: true, align: 'center'},
        {name: 'CHECK', field: 'CHECK', label: 'CQL Check', sortable: true}
      ],
      data_checked: false,
      doing_check: false,
      check_doubles: true
    }
  },

  mounted(){
    if (this.imported_data) {
      this.patient_data = JSON.parse(JSON.stringify(this.imported_data))
      this.patient_list = []
      this.patient_data.forEach(p => {
        let tmp = {PATIENT_CD: p.PATIENT.PATIENT_CD, VISITS_COUNT: p.VISITS.length}
        tmp.OBSERVATIONS_TOTAL = this._totalObservations(p)
        tmp.CHECK = 'n.a.'
        this.patient_list.push(tmp)
      })

    }

  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT
    },

    SHOW_SELECTION_BTNS() {
      if (this.data_checked === false) return 'none'
      else return 'single'
    },

    SELECTED_PATIENT() {
      if (!this.data_checked || this.selected.length === 0) return undefined
      let obj = this.patient_data.find(el => el.PATIENT.PATIENT_CD === this.selected[0].PATIENT_CD)
      return obj
    }
  },

  methods: {
    _totalObservations(patient) {
      var cc = 0
      patient.OBSERVATIONS.forEach(o => cc += o.length)
      return cc
    },

    async checkCQL_Many(patient_data) {
      this.doing_check = true
      for (let PATIENT of patient_data) {
        let ERRORS = await this.checkCQL(PATIENT) //from mixin: modes_import.js
        PATIENT._ERRORS = ERRORS
        //update the patient_list
        let obj = this.patient_list.find(el => el.PATIENT_CD === PATIENT.PATIENT.PATIENT_CD)
        if (obj) obj.CHECK = `Fehler: ${ERRORS.total_errors_found} / Checks: ${ERRORS.total_checks}`
      }

      this.doing_check = false
        this.data_checked = true
    },

    removeItem(item) {
      if (!item || typeof(item) !== 'object') return
      if (item.visit !== undefined) {
        let obj = this.patient_data.find(el => el.PATIENT.PATIENT_CD === this.selected[0].PATIENT_CD)
        if (obj) {
          if (!item.observation) {
            obj.VISITS.splice(item.visit,1)
            obj.OBSERVATIONS.splice(item.visit,1)
            this.selected[0].VISITS_COUNT --
          }
        }
      }
    },

    async importToDB(DATA) {
      this.$store.commit('LOG', {method: 'DBFunctions_CSVImport/addImportToDb', message: 'importiere Daten'})
      const INFO = [{field: 'AGE_IN_YEARS', value: 'LID: 63900-5'}, {field: 'BIRTH_DATE', value: 'SCTID: 184099003'}, {field: 'SEX_CD', value: 'SCTID: 263495000'}]
      this.doing_check = true
      const ERRORS = []
      for (let patient of DATA) {
        //durchsuche die Observations nach Daten, um den Patienten zu befüllen
        patient.PATIENT = this._fillPatientData(patient, INFO)
        let res = await this.$store.dispatch('saveHL7ObjectsToDB', patient)
        if (!res.status) ERRORS.push(res)
      }

      if (ERRORS.length === 0) {
        this.$q.notify({message: `${DATA.length} Patient(en) erfolgreich hinzugefügt`, color: 'green', timeout: 2000})
        this.$emit('close')
      } else {
        this.$q.notify(`Fehler sind aufgetreten: ${ERRORS.length}`)
      }

      this.doing_check = false

    },
        //loops through the observations and tries to fill the PATIENT_DIMENSINO
    _fillPatientData(DATA, INFO) {
      const PATIENT = {PATIENT_CD: DATA.PATIENT.PATIENT_CD}
      DATA.OBSERVATIONS.forEach(v => {
          v.forEach(obs => {
            let obj = INFO.find(o => o.value === obs.CONCEPT_CD);
            if (obj) {
              if (obs.VALTYPE_CD === 'N') PATIENT[obj.field] = obs.NVAL_NUM
              else PATIENT[obj.field] = obs.TVAL_CHAR
            }
          })
        })
      if (!PATIENT.VITAL_STATUS_CD) PATIENT.VITAL_STATUS_CD = 'SCTID: 438949009xx' //unknown
      return PATIENT
    },

  }

}
</script>
