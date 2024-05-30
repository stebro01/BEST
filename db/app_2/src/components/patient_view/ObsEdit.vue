<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        <div class="text-bold">Bearbeite Observation</div>
        <div class="text-center text-caption">ID: {{ observation_id }}</div>
        <div v-if="localData && localData.OBSERVATION" class="text-center">
          {{ localData.OBSERVATION.CONCEPT_NAME_CHAR }}({{ localData.OBSERVATION.CONCEPT_CD }})
        </div>
        <q-tooltip> {{ localData }}</q-tooltip>
      </q-card-section>
      <q-card-section>
        <div class="row items-center">

          <div class="col-11">
            <q-form @submit="saveObs()">
            <q-input v-if="TYPE_OF_DATA === 'N'" v-model.number="localData.NVAL_NUM" label="Wert" type="number" @update:model-value="check_cql_status()" />
            <q-input v-else-if="TYPE_OF_DATA === 'T'" v-model="localData.TVAL_CHAR" label="Wert" type="string" @update:model-value="check_cql_status()" />
            <q-input v-else-if="TYPE_OF_DATA === 'D'" v-model="localData.TVAL_CHAR" label="Wert" type="date" @update:model-value="check_cql_status()"/>
            <q-option-group v-else-if="(TYPE_OF_DATA === 'S' || TYPE_OF_DATA === 'F') && localData.ANSWERS"
              v-model="localData.TVAL_CHAR" label="Wert" :options="localData.ANSWERS" />
            </q-form>
          </div>
          <div class="col-1 text-right" v-if="CHECK_CQL">
            <q-icon v-if="CHECK_CQL.status" name="check" color="green"><q-tooltip>{{CHECK_CQL.data}}</q-tooltip></q-icon>
            <q-icon v-else name="close" color="red"><q-tooltip>{{CHECK_CQL.data}}</q-tooltip></q-icon>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn label="Abbrechen" no-caps color="primary" rounded @click="$emit('close')" />
        <q-btn label="Speichern" no-caps color="primary" rounded @click="saveObs()" />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>

export default {
  name: 'EditObs',

  props: ['observation_id'],

  components: {},

  data() {
    return {
      localData: undefined,
      show_dialog: false,
      group: {},
      cql_status: { status: undefined, message: 'cql check not yet performed' }
    }
  },

  mounted() {
    if (!this.observation_id) return
    if (this.observation_id) this.show_dialog = true
    this.loadData()

  },

  computed: {
    TYPE_OF_DATA() {
      if (!this.localData) return undefined
      return this.localData.OBSERVATION.VALTYPE_CD
    },

    CHECK_CQL() {
      if (!this.localData) return undefined
      if (this.localData.OBSERVATION.VALTYPE_CD !== 'N' && this.localData.OBSERVATION.VALTYPE_CD !== 'T' && this.localData.OBSERVATION.VALTYPE_CD !== 'D') return undefined
      return this.cql_status
    }

  },

  methods: {
    async loadData() {
      const res = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: this.observation_id, _view: true } })
      if (!res || res.length === 0) return this.$emit('close')
      this.localData = {
        OBSERVATION: res[0]
      }

      if (this.localData.OBSERVATION.VALTYPE_CD === 'N') this.localData.NVAL_NUM = this.localData.OBSERVATION.NVAL_NUM
      else if (this.localData.OBSERVATION.VALTYPE_CD === 'T') this.localData.TVAL_CHAR = this.localData.OBSERVATION.TVAL_CHAR
      else if (this.localData.OBSERVATION.VALTYPE_CD === 'D') this.localData.TVAL_CHAR = this.localData.OBSERVATION.TVAL_CHAR
      else if (this.localData.OBSERVATION.VALTYPE_CD === 'S') {
        this.localData.ANSWERS = await this.$store.dispatch('getAnswersForObservation', { VALTYPE_CD: 'S', CONCEPT_CD: this.localData.OBSERVATION.CONCEPT_CD })
        this.localData.TVAL_CHAR = this.localData.OBSERVATION.TVAL_CHAR
      }
      else if (this.localData.OBSERVATION.VALTYPE_CD === 'F') {
        this.localData.ANSWERS = await this.$store.dispatch('getAnswers', { VALTYPE_CD: 'F', CONCEPT_CD: this.localData.OBSERVATION.CONCEPT_CD })
        this.localData.TVAL_CHAR = this.localData.OBSERVATION.TVAL_CHAR
      }

      this.check_cql_status()

    },

    async check_cql_status() {
      const data = this.localData
      if (data.OBSERVATION.VALTYPE_CD !== 'N' && data.OBSERVATION.VALTYPE_CD !== 'T' && data.OBSERVATION.VALTYPE_CD !== 'D') return
      const res = await this.$store.dispatch('checkCQLRule', { CONCEPT_CD: data.OBSERVATION.CONCEPT_CD, VALTYPE_CD: data.OBSERVATION.VALTYPE_CD, TVAL_CHAR: data.TVAL_CHAR, NVAL_NUM: data.NVAL_NUM })
      this.cql_status = res
    },

    saveObs() {
      const data = {
        OBSERVATION_ID: this.localData.OBSERVATION.OBSERVATION_ID,
        NVAL_NUM: this.localData.NVAL_NUM,
        TVAL_CHAR: this.localData.TVAL_CHAR,
        VALTYPE_CD: this.localData.OBSERVATION.VALTYPE_CD
      }
      this.$emit('save', data)
    }


  }


}
</script>
