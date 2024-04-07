<template
  template>
  <q-page class="">

    <MainSlot :no_options="true" :no_footer="true" @resize="main_slot_size = $event">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'XLS View'" :img="'db-queries-logo.png'" :icon="'wysiwyg'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="column" :style="STYLE_DIV">
          <!-- HEADER -->
          <HEADER_FOR_XLS_VIEW @zoom_in="font_size++; max_char_header=+max_char_header+5" @zoom_out="font_size--; max_char_header=max_char_header-5"/>

          <!-- CONTENT -->
          <div class="col-10 flex flex-center bg-white">
            <q-scroll-area :style="STYLE_CONTENT" class=" q-mt-xs">
              <q-table dense 
                :rows="ROWS"
                :columns="COLS"
                virtual-scroll
                :rows-per-page-options="[0]"
              >

              <template v-slot:header-cell="props">
                <q-th :props="props" >
                  {{ props.col.label }}
                  <q-tooltip>{{ props.col.label_long }} <span v-if="props.col.label_long !== props.col.label_cd">({{ props.col.label_cd }})</span></q-tooltip>
                  <q-icon v-if="props.col.label_long !== 'PATIENT_CD'" name="visibility_off" size="1.2em" class="cursor-pointer" @click="hideColKey(props.col.label_long)" />
                </q-th>
              </template>
              
              <template v-slot:body-cell="props">
                <q-td :props="props" :class="{'bg-green-1': props.row.PATIENT_CD && $store.getters.PATIENT_PINNED && props.row.PATIENT_CD.value === $store.getters.PATIENT_PINNED.PATIENT_CD}">
                  <span v-if="props.row[props.col.name]">
                    <span v-if="props.col.name === 'PATIENT_CD'" @click="selectPatient(props.row[props.col.name].value)">
                      {{ props.row[props.col.name].value }}
                      <!-- <q-tooltip>{{ props.row }}</q-tooltip> -->
                    </span>
                    <span v-else-if="props.row[props.col.name].value">
                      {{ props.row[props.col.name].value }}
                    </span>
                    <span v-else-if="MAP_OBSERVATIONS && props.row[props.col.name].id">
                      <!-- GET THE OBSERVATION_ID -->
                      <span v-if="Array.isArray(props.row[props.col.name].id)">
                        <span v-for="(obs_item, obs_ind) in props.row[props.col.name].id" :key="obs_ind+'item'">
                          <XLS_VIEW_OBS  :item="MAP_OBSERVATIONS[obs_item]" @loadObservation="showObservation($event)" @editObservation="editObservation($event)"/>
                        </span>
                      </span>
                      <XLS_VIEW_OBS v-else  :item="MAP_OBSERVATIONS[props.row[props.col.name].id]" @loadObservation="showObservation($event)" @editObservation="editObservation($event)"/>
                    </span>
                    <span v-else @click="addObservation(props.col, props.row)">...</span>
                  </span>
                  <span v-else @click="addObservation(props.col, props.row)">
                    ...
                  </span>                  
                </q-td>
              </template>


              </q-table>
            </q-scroll-area>
          </div>
          <!-- FOOTER -->
            <FOOTER_FOR_XLS_VIEW :localData="localData" :hide_col_keys="hide_col_keys" @clear_hide_cols="hide_col_keys = []"/>
          
          </div>
      </template>

    </MainSlot>

    <!-- SURVEY BEST PREVIEW -->
    <SURVEY_PREVIEW v-if="survey_best_show" :input_data="survey_best_data" @close="survey_best_show=false; survey_best_data = undefined"/>

    <!-- RAW DATA PREVIEW -->
    <RAW_DATA_PREVIEW v-if="raw_data_show" :input_data="raw_data_data" @close="raw_data_show=false; raw_data_data = undefined"/>

    <!-- EDIT_OBS -->
    <EDIT_OBS v-if="edit_observation_show" :observation_id="edit_observation_data" @close="edit_observation_show=false; edit_observation_data = undefined" @save="updateObservation($event)"/>

    <!-- ADD_OBS -->
    <ADD_OBS v-if="add_observation_show" :data="add_observation_data" @close="add_observation_show=false; add_observation_data = undefined" @save="newObservation($event)"/>

  </q-page>
</template> 

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import XLS_VIEW_OBS from 'src/components/elements/XLS_ViewObs.vue'

import SURVEY_PREVIEW from 'src/components/patient_view/SurveyPreview.vue'
import RAW_DATA_PREVIEW from 'src/components/patient_view/RawDataPreview.vue'
import EDIT_OBS from 'src/components/patient_view/EditObs.vue'
import ADD_OBS from 'src/components/patient_view/AddObs.vue'

import FOOTER_FOR_XLS_VIEW from 'src/components/patient_view/Footer_for_XLS_View.vue'
import HEADER_FOR_XLS_VIEW from 'src/components/patient_view/Header_for_XLS_View.vue'

export default {
  name: 'ObservationsView_XLS',

  components: { HEADING, MainSlot, XLS_VIEW_OBS, SURVEY_PREVIEW, RAW_DATA_PREVIEW, EDIT_OBS, ADD_OBS, FOOTER_FOR_XLS_VIEW, HEADER_FOR_XLS_VIEW },

  data() {
    return {
      font_size: 10,
      max_char_header: 20,
      main_slot_size: undefined,
      localData: undefined,
      col_keys: undefined,
      hide_col_keys: [],
      // for survey best preview
      survey_best_show: false,
      survey_best_data: undefined,
      // for raw data
      raw_data_show: false,
      raw_data_data: undefined,
      // for edit observation
      edit_observation_show: false,
      edit_observation_data: undefined,
      // for add observation
      add_observation_show: false,
      add_observation_data: undefined
    }
  },

  mounted() {
    this.loadLocalData()
  },


  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    },

    STYLE_DIV() {
      if (!this.main_slot_size) return `width: 100%; height: ${this.$q.screen.height - 280*((this.$q.screen.height/this.$q.screen.height*0.90))}px`
      // else
      return `width: 100%; height: ${(this.main_slot_size.height / 12 * 10) - 12}px`
    },

    STYLE_CONTENT() {
      return "width: 100%; height: 100%"
    },

    TD_STYLE() {
      return `font-size: ${this.font_size}pt; padding: 5px; border: 0.1px solid #ccc;overflow: hidden;max-width: 100px`
    },

    ROWS() {
      const data = []
      if (!this.localData || !Array.isArray(this.localData)) return data
      
      // first build an array with all the columns
      const tmp = {}
      this.col_keys.forEach(item => {
        tmp[item.value] = null
      })
      this.localData.forEach(patient => {
        let row_p = JSON.parse(JSON.stringify(tmp))
        row_p.PATIENT_CD = {value: patient.PATIENT_CD}
        row_p.BIRTH_DATE = {value: patient.BIRTH_DATE}
        if (patient.VISITS) {
          patient.VISITS.forEach(visit => {
            row_p.ENCOUNTER_NUM = {value: visit.ENCOUNTER_NUM}
            row_p.START_DATE = {value: visit.START_DATE}
            
            if (visit.OBSERVATIONS) {
              let row_v = JSON.parse(JSON.stringify(row_p))
              visit.OBSERVATIONS.forEach(observation => {
                if (!row_v[observation.CONCEPT_NAME_CHAR]) row_v[observation.CONCEPT_NAME_CHAR] = {id: observation.OBSERVATION_ID}
                else row_v[observation.CONCEPT_NAME_CHAR] = {id: [row_v[observation.CONCEPT_NAME_CHAR].id, observation.OBSERVATION_ID]}
              })
              data.push(JSON.parse(JSON.stringify(row_v)))

            }
          })
        }
      })
    
      return data
    },

    COLS() {
      const max_width = this.max_char_header
      if (!this.localData || !Array.isArray(this.localData)) return []
      // use the filtered col_keys to build the columns => only the ones that are not hidden (hide_col_keys)
      const local_col_keys = this.col_keys.filter(item => !this.hide_col_keys.includes(item.label))

      const RES =  local_col_keys.map(item => {
        return {
          name: item.label,
          required: true,
          //make sure the label is not longer then max_width characters

          label: item.label.length > max_width ? item.label.substring(0, max_width) + '...' : item.label,
          label_long: item.label,
          label_cd: item.value,
          align: 'center',
          field: row => row[item.label],
          format: val => `${val}`,
          style: this.TD_STYLE
        }
      })
      // relabel some items
      const ENCOUNTER_NUM = RES.find(item => item.name === 'ENCOUNTER_NUM')
      if (ENCOUNTER_NUM) ENCOUNTER_NUM.label = 'Visite'
      const START_DATE = RES.find(item => item.name === 'START_DATE')
      if (START_DATE) START_DATE.label = 'Datum'
      const BIRTH_DATE = RES.find(item => item.name === 'BIRTH_DATE')
      if (BIRTH_DATE) BIRTH_DATE.label = 'Geb.Datum'
      const PATIENT_CD = RES.find(item => item.name === 'PATIENT_CD')
      if (PATIENT_CD) PATIENT_CD.label = 'ID'
      

      return RES
    
    },

    // return a map of all observations: 
    MAP_OBSERVATIONS() {
      const data = {}
      if (!this.localData || !Array.isArray(this.localData)) return undefined
      this.localData.forEach(patient => {
        if (patient.VISITS) {
          patient.VISITS.forEach(visit => {
            if (visit.OBSERVATIONS) {
              visit.OBSERVATIONS.forEach(observation => {

                data[observation.OBSERVATION_ID] = observation
              })
            }
          })
        }
      })
      return data
    }


  },


  methods: {
    // METHODS
    async loadLocalData() {      
      let res_p = await this.loadPatientData()
      // now load the visits
      let res_v = await this.loadVisitsAndObservations(res_p)
      this.localData = res_v
      this.col_keys = this.buildColKeys(res_v)
    },

    // load the patients
    async loadPatientData(data) {
      data = undefined
      const query = this.$store.getters.PATIENT_VIEW_SQL_STATEMENT
      const patients = await this.$store.dispatch('runQuery', query)
      let unique_patients = patients.data.reduce((acc, item) => {
        delete item.USER_ID;
        if (!acc.some(accItem => accItem.PATIENT_CD === item.PATIENT_CD)) {
            acc.push({PATIENT_CD: item.PATIENT_CD, PATIENT_NUM: item.PATIENT_NUM, VITAL_STATUS_CD: item.VITAL_STATUS_CD, BIRTH_DATE: item.BIRTH_DATE, SEX_CD: item.SEX_CD});
        }
        return acc;
        }, []);
      return unique_patients
    },

    // load the visits
    async loadVisitsAndObservations(patients) {
      for (let i = 0; i < patients.length; i++) {
        patients[i].VISITS = await this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: patients[i].PATIENT_NUM, _columns: ['ENCOUNTER_NUM', 'START_DATE', 'LOCATION_CD', 'ACTIVE_STATUS_CD']}, table: 'VISIT_DIMENSION'})
        for (let j = 0; j < patients[i].VISITS.length; j++) {
          patients[i].VISITS[j].OBSERVATIONS = await this.$store.dispatch('searchDB', {query_string: {ENCOUNTER_NUM: patients[i].VISITS[j].ENCOUNTER_NUM, _view: true, _columns: ['OBSERVATION_ID', 'START_DATE', 'CONCEPT_CD', 'CONCEPT_NAME_CHAR', 'VALTYPE_CD','NVAL_NUM', 'UNIT_CD', 'UNIT_RESOLVED', 'TVAL_CHAR', 'TVAL_RESOLVED']}, table: 'OBSERVATION_FACT'})
        }
      }
      return patients
    },

    // BUILD COL KEYS
    buildColKeys(data) {
      const COL_KEY = [{label: "PATIENT_CD", value: "PATIENT_CD"}, {label: "BIRTH_DATE", value: "BIRTH_DATE"}]
      COL_KEY.push({label: "ENCOUNTER_NUM", value: "ENCOUNTER_NUM"})
      COL_KEY.push({label: "START_DATE", value: "START_DATE"})
      data.forEach(patient => {
        if (patient.VISITS) {
          patient.VISITS.forEach(visit => {
            if (visit.OBSERVATIONS) {
              visit.OBSERVATIONS.forEach(observation => {
                if (!COL_KEY.some(item => item.label === observation.CONCEPT_NAME_CHAR)) {
                  COL_KEY.push({label: observation.CONCEPT_NAME_CHAR, value: observation.CONCEPT_CD})
                }
              })
            }
          })
        }

      })
      return COL_KEY
    },

    hideColKey(key) {
      if (!this.hide_col_keys.includes(key)) this.hide_col_keys.push(key)        
    },


    showObservation(payload) {
      console.log('showObservation', payload)
      if (payload.VALTYPE_CD === 'R') {
        this.raw_data_show = true
        this.raw_data_data = {OBSERVATION_ID: payload.OBSERVATION_ID}
      } else {
        this.survey_best_show = true
        this.survey_best_data = {OBSERVATION_ID: payload.OBSERVATION_ID}
      }
      
    },

    editObservation(data) {
      this.edit_observation_show = true
      this.edit_observation_data = data
    },

    async updateObservation(data) {
      this.edit_observation_show = false
      this.edit_observation_data = undefined
      const WHERE = {OBSERVATION_ID: data.OBSERVATION_ID}
      const SET = {}
      if (data.VALTYPE_CD === 'N') SET.NVAL_NUM = data.NVAL_NUM
      else SET.TVAL_CHAR = data.TVAL_CHAR
      if (!Object.keys(SET).length) return this.$q.notify({message: 'No changes made', color: 'warning'})
      const res = await this.$store.dispatch('updateDB', {table: 'OBSERVATION_FACT', query_string: {where: WHERE, set: SET}})
      if (res) {
        const res_new = await this.$store.dispatch('searchDB', {table: 'OBSERVATION_FACT', query_string: {...WHERE, _view: true}})
        this.updateLocalData(res_new[0])
        this.check_if_patient_data_is_set(res_new[0])
      }      
    },

    addObservation(col, row) {
      this.add_observation_show = true
      const patient = this.localData.find(item => item.PATIENT_CD === row.PATIENT_CD.value)
      this.add_observation_data = {CONCEPT_CD: col.label_cd, ENCOUNTER_NUM: row.ENCOUNTER_NUM.value, PATIENT_CD: row.PATIENT_CD.value, PATIENT_ID: patient.PATIENT_NUM}
    },

    async newObservation(data) {
      console.log('newObservation', data)
      this.add_observation_show = false
      this.add_observation_data = undefined
      const res = await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: data})
      if (res) {
        const res_new = await this.$store.dispatch('searchDB', {table: 'OBSERVATION_FACT', query_string: {OBSERVATION_ID: res.OBSERVATION_ID, _view: true}})
        this.updateLocalData(res_new[0])
        this.check_if_patient_data_is_set(res_new[0])
      
      }
    },


    updateLocalData(data) {
      if (!this.localData || !Array.isArray(this.localData)) return
      const OBSERVATION_ID = data.OBSERVATION_ID
      const PATIENT_CD = data.PATIENT_CD
      const ENCOUNTER_NUM = data.ENCOUNTER_NUM
      // find the patient
      const patient = this.localData.find(item => item.PATIENT_CD === PATIENT_CD)
      // find the encounter
      const visit = patient.VISITS.find(item => item.ENCOUNTER_NUM === ENCOUNTER_NUM)
      // find the observation
      const observation = visit.OBSERVATIONS.find(item => item.OBSERVATION_ID === OBSERVATION_ID)
      // update the observation
      if (observation) {
        if (data.NVAL_NUM) observation.NVAL_NUM = data.NVAL_NUM
        if (data.TVAL_CHAR) observation.TVAL_CHAR = data.TVAL_CHAR
        if (data.TVAL_RESOLVED) observation.TVAL_RESOLVED = data.TVAL_RESOLVED
      } else {
        visit.OBSERVATIONS.push(data)
      }
    },

    selectPatient(patient_cd) {
      if (!this.localData || !Array.isArray(this.localData)) return
      // get the patient
      const patient = this.localData.find(item => item.PATIENT_CD === patient_cd)
      // is the patient already pinned?
      if (this.$store.getters.PATIENT_PINNED && this.$store.getters.PATIENT_PINNED.PATIENT_CD === patient_cd) {
        this.$store.commit('PATIENT_PINNED_SET', undefined)
      } else this.$store.commit('PATIENT_PINNED_SET', patient)
    },

    check_if_patient_data_is_set(obs) {
      if (obs.CONCEPT_CD !== 'SCTID: 184099003') return //do nothing
      // get the patient
      const patient = this.localData.find(item => item.PATIENT_CD === obs.PATIENT_CD)
      console.log(patient)
      if (!patient || (patient.BIRTH_DATE !== undefined && patient.BIRTH_DATE !== null)) return
      const WHERE = {PATIENT_NUM: obs.PATIENT_NUM}
      const SET = {BIRTH_DATE: obs.TVAL_CHAR}
      this.$store.dispatch('updateDB', {table: 'PATIENT_DIMENSION', query_string: {where: WHERE, set: SET}})
      patient.BIRTH_DATE = obs.TVAL_CHAR

    }


    // ENDE METHODS
  }


}
</script>
