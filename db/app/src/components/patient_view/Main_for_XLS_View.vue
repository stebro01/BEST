<template template>

  <div class="col-10 flex flex-center bg-white">
    <q-scroll-area :style="STYLE_CONTENT" class=" q-mt-xs">
      <q-table dense :rows="ROWS" :columns="COLS" virtual-scroll :rows-per-page-options="[0]">

        <template v-slot:header-cell="props">
          <q-th :props="props" :class="{'bg-orange-2': ['ENCOUNTER_NUM','START_DATE','VISIT_BLOB'].includes(props.col.name), 'bg-green-2': ['PATIENT_CD','BIRTH_DATE'].includes(props.col.name)}">
            {{ props.col.label }}
            <q-tooltip>{{ props.col.label_long }} <span v-if="props.col.label_long !== props.col.label_cd">({{
      props.col.label_cd }})</span></q-tooltip>
            <q-icon v-if="props.col.label_long !== 'PATIENT_CD'" name="visibility_off" size="1.2em"
              class="cursor-pointer" @click="hideColKey(props.col.label_long)" />
          </q-th>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props" :class="computeClass(props)">
            <span v-if="props.row[props.col.name]">
              <span v-if="props.col.name === 'PATIENT_CD'" @click="selectPatient(props.row[props.col.name].value)" class="cursor-pointer">
                {{ props.row[props.col.name].value }}
                <!-- <q-tooltip>{{ props.row }}</q-tooltip> -->
              </span>
              <span v-else-if="props.col.name === 'ENCOUNTER_NUM'" @click="selectVisit(props.row[props.col.name].value)" class="cursor-pointer">
                <span :class="{'text-bold': props.row.ENCOUNTER_NUM && $store.getters.VISIT_PINNED && props.row.ENCOUNTER_NUM.value === $store.getters.VISIT_PINNED.ENCOUNTER_NUM}">{{ props.row[props.col.name].value }}</span>
                <!-- <q-tooltip>{{ props.row }}</q-tooltip> -->
              </span>
              <span v-else-if="props.col.name === 'VISIT_BLOB'" @click="editVisit(props.row)" class="cursor-pointer">
                <span v-if="props.row[props.col.name].value">{{ props.row[props.col.name].value }}</span>
                <span v-else>...</span>
                <!-- <q-tooltip>{{ props.row }}</q-tooltip> -->
              </span>
              <span v-else-if="props.row[props.col.name].value">
                {{ props.row[props.col.name].value }}
              </span>
              <span v-else-if="MAP_OBSERVATIONS && props.row[props.col.name].id">
                <!-- GET THE OBSERVATION_ID -->
                <span v-if="Array.isArray(props.row[props.col.name].id)">
                  <span v-for="(obs_item, obs_ind) in props.row[props.col.name].id" :key="obs_ind + 'item'">
                    <XLS_VIEW_OBS :item="MAP_OBSERVATIONS[obs_item]" @loadObservation="showObservation($event)"
                      @editObservation="editObservation($event)" />
                  </span>
                </span>
                <XLS_VIEW_OBS v-else :item="MAP_OBSERVATIONS[props.row[props.col.name].id]"
                  @loadObservation="showObservation($event)" @editObservation="editObservation($event)" />
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

    <!-- EDIT_OBS -->
    <EDIT_OBS v-if="edit_observation_show" :observation_id="edit_observation_data"
      @close="edit_observation_show = false; edit_observation_data = undefined" @save="updateObservation($event)" />

    <!-- ADD_OBS -->
    <ADD_OBS v-if="add_observation_show" :data="add_observation_data"
      @close="add_observation_show = false; add_observation_data = undefined" @save="newObservation($event)" @refresh="refreshAll()" />

    <!-- SURVEY BEST PREVIEW -->
    <SURVEY_PREVIEW v-if="survey_best_show" :input_data="survey_best_data"
      @close="survey_best_show = false; survey_best_data = undefined" @removed="$emit('refresh_removed_item', $event)" />

    <!-- RAW DATA PREVIEW -->
    <RAW_DATA_PREVIEW v-if="raw_data_show" :input_data="raw_data_data"
      @close="raw_data_show = false; raw_data_data = undefined" @removed="$emit('refresh_removed_item', $event)"/>

  </div>

</template>

<script>
import XLS_VIEW_OBS from 'src/components/elements/XLS_ViewObs.vue'

import EDIT_OBS from 'src/components/patient_view/ObsEdit.vue'
import ADD_OBS from 'src/components/patient_view/ObsAdd.vue'

import SURVEY_PREVIEW from 'src/components/patient_view/SurveyPreview.vue'
import RAW_DATA_PREVIEW from 'src/components/patient_view/RawDataPreview.vue'

import { datenow_isostring } from 'src/tools/mydate'

export default {
  name: 'Main_for_XLS_View',

  props: ['localData', 'col_keys', 'font_size', 'max_char_header', 'hide_col_keys'],

  components: { XLS_VIEW_OBS, EDIT_OBS, ADD_OBS, SURVEY_PREVIEW, RAW_DATA_PREVIEW },

  data() {
    return {
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

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
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
        row_p.PATIENT_CD = { value: patient.PATIENT_CD }
        row_p.BIRTH_DATE = { value: patient.BIRTH_DATE }
        if (patient.VISITS) {
          patient.VISITS.forEach(visit => {
            row_p.ENCOUNTER_NUM = { value: visit.ENCOUNTER_NUM }
            row_p.START_DATE = { value: visit.START_DATE }
            row_p.VISIT_BLOB = { value: visit.VISIT_BLOB }

            if (visit.OBSERVATIONS) {
              let row_v = JSON.parse(JSON.stringify(row_p))
              visit.OBSERVATIONS.forEach(observation => {
                if (!row_v[observation.CONCEPT_NAME_CHAR]) row_v[observation.CONCEPT_NAME_CHAR] = { id: observation.OBSERVATION_ID }
                else row_v[observation.CONCEPT_NAME_CHAR] = { id: [row_v[observation.CONCEPT_NAME_CHAR].id, observation.OBSERVATION_ID] }
              })
              data.push(JSON.parse(JSON.stringify(row_v)))

            }
          })
        }
      })

      this.$emit('rows', {rows: data, cols: this.col_keys})
      return data
    },

    COLS() {
       []
      const max_width = this.max_char_header
      if (!this.localData || !Array.isArray(this.localData)) return []
      // use the filtered col_keys to build the columns => only the ones that are not hidden (hide_col_keys)
      const local_col_keys = this.col_keys.filter(item => !this.hide_col_keys.includes(item.label))


      const RES = local_col_keys.map(item => {
        if (!item.value) return {}
        if (!item.label) item.label = item.value

        return {
          name: item.label,
          required: true,
          //make sure the label is not longer then max_width characters

          label: item.label.length > max_width ? item.label.substring(0, max_width) + '...' : item.label,
          label_long: item.label,
          label_cd: item.value,
          align: 'center',
          value: item.value,
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
      const VISIT_BLOB = RES.find(item => item.name === 'VISIT_BLOB')
      if (VISIT_BLOB) VISIT_BLOB.label = 'Beschr. Visite'

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
    computeClass(props) {
      if (props.row.ENCOUNTER_NUM && this.$store.getters.VISIT_PINNED && props.row.ENCOUNTER_NUM.value === this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM) {
      return 'bg-blue-2';
    }
    // Überprüfe zuerst die Bedingung für 'bg-blue-1'
    if (props.row.PATIENT_CD && this.$store.getters.PATIENT_PINNED && props.row.PATIENT_CD.value === this.$store.getters.PATIENT_PINNED.PATIENT_CD) {
      return 'bg-blue-1';
    }
    // Wenn 'bg-blue-1' nicht zutrifft, überprüfe die anderen Bedingungen
    if (['PATIENT_CD', 'BIRTH_DATE'].includes(props.col.name)) {
      return 'bg-green-1';
    }
    if (['ENCOUNTER_NUM', 'START_DATE', 'VISIT_BLOB'].includes(props.col.name)) {
      return 'bg-orange-1';
    }
    // Standardfall, wenn keine der Bedingungen zutrifft
    return '';
  },

    hideColKey(key) {
      if (!this.hide_col_keys.includes(key)) this.$emit('hide_col_key', key)
    },

    showObservation(payload) {
      if (payload.VALTYPE_CD === 'R') {
        this.raw_data_show = true
        this.raw_data_data = { OBSERVATION_ID: payload.OBSERVATION_ID }
      } else {
        this.survey_best_show = true
        this.survey_best_data = { OBSERVATION_ID: payload.OBSERVATION_ID }
      }

    },

    editObservation(data) {
      this.edit_observation_show = true
      this.edit_observation_data = data
    },

    async updateObservation(data) {
      this.edit_observation_show = false
      this.edit_observation_data = undefined
      const WHERE = { OBSERVATION_ID: data.OBSERVATION_ID }
      const SET = {}
      if (data.VALTYPE_CD === 'N') SET.NVAL_NUM = data.NVAL_NUM
      else SET.TVAL_CHAR = data.TVAL_CHAR
      if (!Object.keys(SET).length) return this.$q.notify({ message: 'No changes made', color: 'warning' })
      const res = await this.$store.dispatch('updateDB', { table: 'OBSERVATION_FACT', query_string: { where: WHERE, set: SET } })
      if (res) {
        const res_new = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { ...WHERE, _view: true } })
        this.$emit('update_observation', res_new[0])
      }
    },

    editVisit(row) {
      this.$emit('edit_visit', { ENCOUNTER_NUM: row.ENCOUNTER_NUM.value})
    },

    addObservation(col, row) {
      this.add_observation_show = true
      const patient = this.localData.find(item => item.PATIENT_CD === row.PATIENT_CD.value)
      this.add_observation_data = { CONCEPT_CD: col.label_cd, ENCOUNTER_NUM: row.ENCOUNTER_NUM.value, PATIENT_CD: row.PATIENT_CD.value, PATIENT_ID: patient.PATIENT_NUM }
    },

    refreshAll() {
      this.add_observation_show = false
      this.add_observation_data = undefined
      this.$emit('refresh_all')
    },

    async newObservation(data) {
      this.add_observation_show = false
      this.add_observation_data = undefined
      if (data.VALTYPE_CD !== 'R') {
        const res = await this.$store.dispatch('addDB', { table: 'OBSERVATION_FACT', query_string: data })
        if (res) {
          const res_new = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: res.OBSERVATION_ID, _view: true } })
          this.$emit('update_observation', res_new[0])
        }
      } else {
        data.PROVIDER_ID = this.$store.getters.PROVIDER_PINNED.PATIENT_ID
        data.START_DATE = datenow_isostring()
        data._force = true
        data.raw_fn = data.RAW_FILE.path
        const res_raw = await this.$store.dispatch('importRAWdata_from_file', data)
        if (res_raw) {
          const res_new = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: res_raw.data.OBSERVATION_ID, _view: true , _columns: ['OBSERVATION_ID', 'START_DATE', 'CONCEPT_CD', 'PATIENT_CD', 'PATIENT_NUM', 'ENCOUNTER_NUM', 'CONCEPT_NAME_CHAR', 'VALTYPE_CD', 'NVAL_NUM', 'UNIT_CD', 'UNIT_RESOLVED', 'TVAL_CHAR', 'TVAL_RESOLVED']} })
          this.$emit('update_observation', res_new[0])
        } else {
          this.$q.notify({ message: 'Error importing raw data', color: 'negative' })
        }

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

    async selectVisit(visit) {
      if (!this.localData || !Array.isArray(this.localData)) return
      // already pinned?
      if (this.$store.getters.VISIT_PINNED && this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM === visit) {
        this.$store.commit('VISIT_PINNED_SET', undefined)
        return
      }
      // get the patient
      const res = await this.$store.dispatch('searchDB', { table: 'VISIT_DIMENSION', query_string: { ENCOUNTER_NUM: visit } })
      if (!res || !res[0]) return
      this.$store.commit('VISIT_PINNED_SET', res[0])
      const patient = this.localData.find(item => item.PATIENT_NUM === res[0].PATIENT_NUM)
      if (patient) this.$store.commit('PATIENT_PINNED_SET', patient)
    }

    // ENDE METHODS
  }


}
</script>
