<template template>
  <q-page >

    <MainSlot v-if="!full_mode" :no_options="true" :no_footer="true" @resize="main_slot_size = $event">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'XLS View'" :img="'db-queries-logo.png'" :icon="'wysiwyg'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="column" :style="STYLE_DIV">
          <!-- HEADER -->
          <HEADER_FOR_XLS_VIEW v-if="col_keys" @zoom_in="font_size++; max_char_header = +max_char_header + 5"
            @zoom_out="font_size--; max_char_header = max_char_header - 5" @reset="resetData()" :col_keys="col_keys" :hide_col_keys="hide_col_keys" @updateView="updateViewLayout($event)" @update_sql="loadLocalData()"  @update_patients_info="loadLocalData()"/>

          <!-- CONTENT -->
          <MAIN_FOR_XLS_VIEW v-if="col_keys" :localData="localData" :col_keys="COL_KEYS_FILTERED" :font_size="font_size"
            :max_char_header="max_char_header" :hide_col_keys="hide_col_keys" @hide_col_key="hide_col_keys.push($event)"
            @update_observation="updateLocalData($event)" @rows="rows_to_export = $event" @refresh_removed_item="resetData()" @refresh_all="resetData()" @edit_visit="eventEditVisit($event)"/>
          <!-- FOOTER -->
          <FOOTER_FOR_XLS_VIEW :localData="localData" :hide_col_keys="hide_col_keys" :col_count="COL_COUNT" :event_edit_visit="event_edit_visit" @event_edit_visit_update="event_edit_visit = $event" @add_person="show_add_person = true"
            @clear_hide_cols="hide_col_keys = []" @addColumn="addColumnWithObservation($event)" @refresh="loadLocalData()" :full_mode="full_mode" @toggleFullScreen="toggleFullScreen($event)" @export_data="exportData()"/>
        </div>
      </template>

    </MainSlot>


  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

import FOOTER_FOR_XLS_VIEW from 'src/components/patient_view/Footer_for_XLS_View.vue'
import HEADER_FOR_XLS_VIEW from 'src/components/patient_view/Header_for_XLS_View.vue'
import MAIN_FOR_XLS_VIEW from 'src/components/patient_view/Main_for_XLS_View.vue'

import { exportFile } from 'quasar'

export default {
  name: 'ObservationsView_XLS',

  components: { HEADING, MainSlot, FOOTER_FOR_XLS_VIEW, HEADER_FOR_XLS_VIEW, MAIN_FOR_XLS_VIEW },

  data() {
    return {
      font_size: this.$store.getters.STANDARD_XLS_VIEW.font_size,
      max_char_header: this.$store.getters.STANDARD_XLS_VIEW.max_char_header,
      main_slot_size: undefined,
      localData: undefined,
      col_keys: undefined,
      col_keys_filtered: undefined,
      hide_col_keys: [],
      full_mode: false,
      rows_to_export: undefined,
      event_edit_visit: false,

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
      if (this.full_mode) return 'background-color: white;width: 100vw; height: 100vh'
      if (!this.main_slot_size) return `width: 100%; height: ${this.$q.screen.height - 280 * ((this.$q.screen.height / this.$q.screen.height * 0.90))}px`
      // else
      return `width: 100%; height: ${(this.main_slot_size.height / 12 * 10) - 12}px`
    },

    COL_COUNT() {
      if (!this.COL_KEYS_FILTERED) return 0
      return this.COL_KEYS_FILTERED.length
    },

    COL_KEYS_FILTERED:  {
      get() {
      if (!this.col_keys_filtered) return this.col_keys
      return this.col_keys_filtered
      },
      set(val) {
        console.log('COL_KEYS_FILTERED>set', val)
      }
    },

    PATIENT_INFO() {
      return this.$store.getters.PATIENT_XLS_VIEWS
    },

    CALC_OFFSET() {
      let start = this.PATIENT_INFO.index * this.PATIENT_INFO.offset
      if (start < 0) start = 0
      if (start > this.PATIENT_INFO.count) start = this.PATIENT_INFO.count

      let end = start + this.PATIENT_INFO.offset
      if (end > this.PATIENT_INFO.count) end = this.PATIENT_INFO.count
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.PATIENT_INFO.current_count = end - start
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.PATIENT_INFO.offset_min = start
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.PATIENT_INFO.offset_max = end

      console.log(this.PATIENT_INFO)
      console.log('CALC_OFFSET', start, end)

      return [start, end]

    }

  },


  methods: {
    // METHODS
    async loadLocalData() {
      this.$store.commit('SPINNER_SET', true)

      let res_p = await this.loadPatientData()
      this.PATIENT_INFO.count = res_p.length
      // now load the visits
      let res_v = await this.loadVisitsAndObservations(res_p.slice(this.CALC_OFFSET[0], this.CALC_OFFSET[1]))
      this.localData = res_v
      this.col_keys = this.buildColKeys(res_v)

      //also set the active layout
      if (this.$store.getters.PATIENT_VIEW.active_layout && this.$store.getters.PATIENT_VIEW.active_layout.length > 0) {
        const REMAPPED = this.$store.getters.PATIENT_VIEW.active_layout.map(item => {return {label: item.CONCEPT_NAME_CHAR, value: item.CONCEPT_CD}})
        this.col_keys_filtered = [...JSON.parse(JSON.stringify(this.$store.getters.PATIENT_VIEW_COLUMNS)), ...REMAPPED]
      }
      this.$store.commit('SPINNER_SET', false)
    },

    // load the patients
    async loadPatientData(data) {
      data = undefined
      const query = this.$store.getters.PATIENT_VIEW_SQL_STATEMENT
      const patients = await this.$store.dispatch('runQuery', query)
      let unique_patients = patients.data.reduce((acc, item) => {
        delete item.USER_ID;
        if (!acc.some(accItem => accItem.PATIENT_CD === item.PATIENT_CD)) {
          acc.push({ PATIENT_CD: item.PATIENT_CD, PATIENT_NUM: item.PATIENT_NUM, VITAL_STATUS_CD: item.VITAL_STATUS_CD, BIRTH_DATE: item.BIRTH_DATE, SEX_CD: item.SEX_CD });
        }
        return acc;
      }, []);
      return unique_patients
    },

    // load the visits
    async loadVisitsAndObservations(patients) {
      for (let i = 0; i < patients.length; i++) {
        patients[i].VISITS = await this.$store.dispatch('searchDB', { query_string: { PATIENT_NUM: patients[i].PATIENT_NUM, _columns: ['ENCOUNTER_NUM', 'START_DATE', 'VISIT_BLOB', 'LOCATION_CD', 'ACTIVE_STATUS_CD'] }, table: 'VISIT_DIMENSION' })
        for (let j = 0; j < patients[i].VISITS.length; j++) {
          patients[i].VISITS[j].OBSERVATIONS = await this.$store.dispatch('searchDB', { query_string: { ENCOUNTER_NUM: patients[i].VISITS[j].ENCOUNTER_NUM, _view: true, _columns: ['OBSERVATION_ID', 'START_DATE', 'CONCEPT_CD', 'CONCEPT_NAME_CHAR', 'VALTYPE_CD', 'NVAL_NUM', 'UNIT_CD', 'UNIT_RESOLVED', 'TVAL_CHAR', 'TVAL_RESOLVED'] }, table: 'OBSERVATION_FACT' })
        }
      }
      return patients
    },

    // BUILD COL KEYS
    buildColKeys(data) {
      const COL_KEY = JSON.parse(JSON.stringify(this.$store.getters.PATIENT_VIEW_COLUMNS))
      data.forEach(patient => {
        if (patient.VISITS) {
          patient.VISITS.forEach(visit => {
            if (visit.OBSERVATIONS) {
              visit.OBSERVATIONS.forEach(observation => {
                if (!COL_KEY.some(item => item.label === observation.CONCEPT_NAME_CHAR)) {
                  COL_KEY.push({ label: observation.CONCEPT_NAME_CHAR, value: observation.CONCEPT_CD })
                }
              })
            }
          })
        }

      })
      return COL_KEY
    },


    // UPDATE LOCAL DATA
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
      this.check_if_patient_data_is_set(data)
    },

    check_if_patient_data_is_set(obs) {
      if (obs.CONCEPT_CD !== 'SCTID: 184099003') return //do nothing
      // get the patient
      const patient = this.localData.find(item => item.PATIENT_CD === obs.PATIENT_CD)
      if (!patient || (patient.BIRTH_DATE !== undefined && patient.BIRTH_DATE !== null)) return
      const WHERE = { PATIENT_NUM: obs.PATIENT_NUM }
      const SET = { BIRTH_DATE: obs.TVAL_CHAR }
      this.$store.dispatch('updateDB', { table: 'PATIENT_DIMENSION', query_string: { where: WHERE, set: SET } })
      patient.BIRTH_DATE = obs.TVAL_CHAR

    },

    addColumnWithObservation(item) {
      // if the item is already in the col_keys array, return
      if (this.COL_KEYS_FILTERED.find(el => el.value === item.value)) {
        this.$q.notify({ type: 'warning', message: 'Spalte bereits vorhanden!' })

      } else {
        //update the corresponding structures
        if (!this.col_keys_filtered) this.col_keys.push(item)
        else {

          this.$store.getters.PATIENT_VIEW.active_layout.push({CONCEPT_NAME_CHAR: item.label, CONCEPT_CD: item.value})
          this.col_keys_filtered.push(item)}
          this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", true)

      }
    },

    async exportData() {
      const SEP_STR = ','
      const col_keys = this.rows_to_export.cols
      const rows = this.rows_to_export.rows

      var content = col_keys.map(item => item.label).join(SEP_STR) + '\n'
      content += col_keys.map(item => item.value).join(SEP_STR) + '\n'
      // now add the rows
      for (let i = 0; i < rows.length; i++) {
        let tmp = []
        for (let j = 0; j < col_keys.length; j++) {
          let col = col_keys[j]
          let val = rows[i][col.label]
          if (val === undefined || val === null) val = ''
          else if (val.value) val = val.value
          else if (val.id) {
            if (typeof(val.id) === 'object') val = 'object'
            else {
              let res = await this.$store.dispatch('searchDB', { query_string: { OBSERVATION_ID: val.id, _view: true }, table: 'OBSERVATION_FACT' })
              if (res[0].VALTYPE_CD === 'N') val = res[0].NVAL_NUM
              else if (res[0].VALTYPE_CD === 'T') val = res[0].TVAL_CHAR
              else if (res[0].VALTYPE_CD === 'S' || res[0].VALTYPE_CD === 'F') val = res[0].TVAL_RESOLVED
              else val = ''
            }
          }
          else val = ''
          tmp.push(val)
        }
        content += tmp.join(SEP_STR) + '\n'
      }

      const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )
    },

    resetData() {
      this.loadLocalData()
      this.font_size = this.$store.getters.STANDARD_XLS_VIEW.font_size
      this.max_char_header = this.$store.getters.STANDARD_XLS_VIEW.max_char_header
      this.col_keys_filtered = undefined
      this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', undefined)
      this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_SET', [])
    },

    async eventEditVisit(payload) {
      // is the payload.ENCOUNTER_NUM alread pinned?
      this.$store.commit('PATIENT_PINNED_SET', undefined)
      if (this.$store.getters.VISIT_PINNED && this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM === payload.ENCOUNTER_NUM)  {this.event_edit_visit = true; return}
      // else load the visit
      const res = await this.$store.dispatch('searchDB', { table: 'VISIT_DIMENSION', query_string: { ENCOUNTER_NUM: payload.ENCOUNTER_NUM } })
      if (!res || res.length === 0) return
      this.$store.commit('VISIT_PINNED_SET', res[0])
      this.event_edit_visit = true
    },

    updateViewLayout(layout) {
      this.col_keys_filtered = layout
    },

    toggleFullScreen(mode) {

      this.full_mode = mode
      // if (mode) this.$q.fullscreen.request()
      // else this.$q.fullscreen.exit()
    }


    // ENDE METHODS
  }


}
</script>
