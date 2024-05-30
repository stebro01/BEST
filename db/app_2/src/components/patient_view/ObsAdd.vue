<template>

  <q-dialog v-model="show_dialog" persistent="">
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section >
        <div class="text-bold">Neue Observation</div>
         <div v-if="localData && localData.CONCEPT_DIMENSION" class="text-center">
         {{localData.CONCEPT_DIMENSION.NAME_CHAR }} ({{ localData.CONCEPT_DIMENSION.CONCEPT_CD }})
        </div>
      </q-card-section>
      <q-card-section v-if="localData">
        <!-- SURVEY? -->
        <SURVEY_ADD v-if="localData.CONCEPT_DIMENSION.CONCEPT_CD === 'SCTID: 273249006'" :data="localData" @refresh="$emit('refresh')"/>
       <!-- ANYTHIN ELSE -->
        <div v-else class="row items-center" >

          <div class="col-11">
            <q-form @submit="saveObs()">
              <q-input v-if="TYPE_OF_DATA === 'N'" v-model.number="localData.NVAL_NUM" label="Wert" type="number"
                @update:model-value="check_cql_status()" />
              <q-input v-else-if="TYPE_OF_DATA === 'T'" v-model="localData.TVAL_CHAR" label="Wert" type="string"
                @update:model-value="check_cql_status()" />
              <q-input v-else-if="TYPE_OF_DATA === 'D'" v-model="localData.TVAL_CHAR" label="Wert" type="date"
                @update:model-value="check_cql_status()" />
              <q-option-group v-else-if="(TYPE_OF_DATA === 'S' || TYPE_OF_DATA === 'F') && localData.ANSWERS"
                v-model="localData.TVAL_CHAR" label="Wert" :options="localData.ANSWERS" />

              <q-file v-else-if="TYPE_OF_DATA === 'R'" v-model="localData.RAW_FILE">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

            </q-form>
          </div>
          <div class="col-1 text-right" v-if="CHECK_CQL">
            <q-icon v-if="CHECK_CQL.status" name="check" color="green"><q-tooltip>{{ CHECK_CQL.data
                }}</q-tooltip></q-icon>
            <q-icon v-else name="close" color="red"><q-tooltip>{{ CHECK_CQL.data }}</q-tooltip></q-icon>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn label="Abbrechen" no-caps color="primary" rounded @click="$emit('close')" />
        <q-btn v-if="NEW_DATA_ADDED" label="Speichern" no-caps color="primary" rounded @click="saveObs()" />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>

import SURVEY_ADD from './SurveyAdd.vue'

export default {
  name: 'AddObs',

  props: ['data'],

  components: {SURVEY_ADD},

  data() {
    return {
      localData: undefined,
      show_dialog: false,
      group: {},
      cql_status: { status: undefined, message: 'cql check not yet performed' }
    }
  },

  mounted() {
    if (!this.data) return
    if (this.data) this.show_dialog = true
    this.loadData()

  },

  computed: {
    TYPE_OF_DATA() {
      if (!this.localData || !this.localData.CONCEPT_DIMENSION) return undefined
      return this.localData.CONCEPT_DIMENSION.VALTYPE_CD
    },

    CHECK_CQL() {
      if (!this.localData) return undefined
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD !== 'N' && this.localData.CONCEPT_DIMENSION.VALTYPE_CD !== 'T' && this.localData.CONCEPT_DIMENSION.VALTYPE_CD !== 'D') return undefined
      return this.cql_status
    },

    NEW_DATA_ADDED() {
      if (!this.localData) return false
      if (this.localData.NVAL_NUM || this.localData.TVAL_CHAR) return true
      if (this.localData.RAW_FILE) return true
      else return false
    }

  },

  methods: {
    async loadData() {
      const res = await this.$store.dispatch('searchDB', { table: 'CONCEPT_DIMENSION', query_string: { CONCEPT_CD: this.data.CONCEPT_CD } })
      if (!res || res.length === 0) return this.$emit('close')
      this.localData = {
        CONCEPT_DIMENSION: res[0],
        ENCOUNTER_NUM: this.data.ENCOUNTER_NUM,
        PATIENT_CD: this.data.PATIENT_CD,
        PATIENT_ID: this.data.PATIENT_ID
      }

      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'N') this.localData.NVAL_NUM = null
      else this.localData.TVAL_CHAR = null

      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'S') this.localData.ANSWERS = await this.$store.dispatch('getAnswersForObservation', { VALTYPE_CD: 'S', CONCEPT_CD: this.localData.CONCEPT_DIMENSION.CONCEPT_CD })
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'F') this.localData.ANSWERS = await this.$store.dispatch('getAnswers', { VALTYPE_CD: 'F', CONCEPT_CD: this.localData.CONCEPT_DIMENSION.CONCEPT_CD })


      this.check_cql_status()

    },

    async check_cql_status() {
      if (!this.localData) return
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'N' && this.localData.NVAL_NUM === null) { this.cql_status = { status: false, data: 'no value' }; return }
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'S' && this.localData.TVAL_CHAR === null) { this.cql_status = { status: false, data: 'no value' }; return }
      const data = this.localData
      if (data.CONCEPT_DIMENSION.VALTYPE_CD !== 'N' && data.CONCEPT_DIMENSION.VALTYPE_CD !== 'T' && data.CONCEPT_DIMENSION.VALTYPE_CD !== 'D') return
      const res = await this.$store.dispatch('checkCQLRule', { CONCEPT_CD: data.CONCEPT_DIMENSION.CONCEPT_CD, VALTYPE_CD: data.CONCEPT_DIMENSION.VALTYPE_CD, TVAL_CHAR: data.TVAL_CHAR, NVAL_NUM: data.NVAL_NUM })
      this.cql_status = res
    },

    saveObs() {
      const data = {
        CONCEPT_CD: this.localData.CONCEPT_DIMENSION.CONCEPT_CD,
        VALTYPE_CD: this.localData.CONCEPT_DIMENSION.VALTYPE_CD,
        PATIENT_CD: this.localData.PATIENT_CD,
        ENCOUNTER_NUM: this.localData.ENCOUNTER_NUM,
        PATIENT_NUM: this.localData.PATIENT_ID,
        PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID,
      }
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'N') data.NVAL_NUM = this.localData.NVAL_NUM
      if (this.localData.CONCEPT_DIMENSION.VALTYPE_CD === 'R') data.RAW_FILE = this.localData.RAW_FILE
      else data.TVAL_CHAR = this.localData.TVAL_CHAR
      this.$emit('save', data)
    }


  }


}
</script>
