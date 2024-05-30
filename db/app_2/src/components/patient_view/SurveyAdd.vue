<template>

    <q-card class="shadow">
      <q-card-section v-if="import_finished">
        <q-banner class="bg-positive">Import erfolgreich.</q-banner>
      </q-card-section>

      <span v-else-if="!IMPORT_RESULTS">
        <q-card-section class="text-caption">
        <div>Hier können Sie einen SURVEY-Fragebogen importieren oder direkt ausfüllen</div>
        </q-card-section>
        <q-card-section class="text-center" v-if="!selected_file">
          <q-btn class="my-btn" rounded @click="fillSurvey()">Ausfüllen</q-btn>
          <q-separator class="q-mt-lg" />
        </q-card-section>

        <q-card-section class="text-center">
          <q-file v-model="selected_file" filled accept=".json, .html">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append v-if="selected_file">
            <q-icon class="cursor-pointer" name="clear" @click="selected_file=undefined"/>
          </template>
        </q-file>
          <q-btn v-if="selected_file" class="my-btn q-mt-sm" rounded @click="importSurvey()">Importieren</q-btn>
        </q-card-section>
     </span>
     <!-- RESUTLS FROM IMPORT -->
     <span v-else>
      <q-card-section class="text-caption">
        <div class="row">
          <div class="col-8">Ergebnisse des Imports: {{ IMPORT_RESULTS.length }} Observations</div>
          <div class="col-4 text-right">
            <q-btn color="dark" rounded no-caps @click="importDataToDB()">Import</q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="width: 100%; height: 150px">
          <q-list dense>
            <q-item v-for="(item, index) in IMPORT_RESULTS" :key="index" v-ripple clickable="">
              <q-item-section side>
                <q-icon v-if="item._checked" name="check" color="green" size="xs"><q-tooltip>Daten können so importiert werden</q-tooltip></q-icon>
                <q-icon v-else name="close" color="red" size="xs"><q-tooltip>Daten können nicht importiert werden</q-tooltip></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.CONCEPT_NAME_CHAR }} / <span class="text-caption">{{ item.CONCEPT_CD }}</span></q-item-label>
                <q-item-label v-if="['N'].includes(item.VALTYPE_CD)" caption >Wert: {{ item.NVAL_NUM }}</q-item-label>
                <q-item-label v-else-if="['S', 'T', 'F'].includes(item.VALTYPE_CD)" caption>{{ item.TVAL_CHAR_RESOLVED || item.TVAL_CHAR }}</q-item-label>
                <q-item-label v-else-if="item.OBSERVATION_BLOB" caption><q-chip dense>surveyBEST</q-chip></q-item-label>
              </q-item-section>
              <q-item-section side class="q-ma-none"><q-btn icon="delete" dense flat @click="removeItem(item)"><q-tooltip>Entferne diese Observation</q-tooltip></q-btn></q-item-section>
            </q-item>

          </q-list>

        </q-scroll-area>
      </q-card-section>

     </span>

    </q-card>

</template>


<script>
import {readSurveyFile} from '/src/tools/db_tools'

export default {
  name: 'SurveyAdd',

  props: ['data'],

  components: {},

  data() {
    return {
      localData: {},
      selected_file: undefined,
      import_results: undefined,
      import_finished: false
    }
  },

  mounted() {
    if (!this.data) return
    this.loadData()

  },

  computed: {
    IMPORT_RESULTS() {
      if (!this.import_results) return undefined
      return this.import_results
    },

    ALL_IS_CHECKED() {
      if (!this.import_results) return false
      return this.import_results.every(item => item._checked)
    }

  },

  methods: {
    async loadData() {
      this.localData.CONCEPT_CD = this.data.CONCEPT_DIMENSION.CONCEPT_CD
      this.localData.CONCEPT_NAME_CHAR = this.data.CONCEPT_DIMENSION.NAME_CHAR
      this.localData.ENCOUNTER_NUM  = this.data.ENCOUNTER_NUM
      this.localData.PATIENT_ID = this.data.PATIENT_ID

    },

    async importSurvey() {
      const filename = this.selected_file.path
      const res = await readSurveyFile(filename, this.$store)
      if (res.error) return this.$q.notify({type: 'negative', message: res.error})
      this.import_results = res.OBSERVATIONS[0]
      this.import_results.forEach(item => {
        item._checked = true
      })
    },

    async fillSurvey() {
      this.$q.notify({type: 'warning', message: 'Survey fill not yet implemented'})
      // the the patient and the visit
      const res_patient = await this.$store.dispatch('searchDB', {table: 'PATIENT_DIMENSION', query_string: {PATIENT_NUM: this.localData.PATIENT_ID}})
      this.$store.commit('PATIENT_PINNED_SET', res_patient[0])
      const res_visit = await this.$store.dispatch('searchDB', {table: 'VISIT_DIMENSION', query_string: {ENCOUNTER_NUM: this.localData.ENCOUNTER_NUM}})
      this.$store.commit('VISIT_PINNED_SET', res_visit[0])
      // fill the survey
      this.$router.push({name: 'surveyBEST_Integration_Search'})
    },

    removeItem(item) {
      this.import_results = this.import_results.filter(i => i.CONCEPT_CD !== item.CONCEPT_CD)
      if (this.import_results.length === 0) this.import_results = undefined
    },

    async importDataToDB() {
      if (!this.import_results) return
      for (let item of this.import_results) {
        item.PATIENT_NUM = this.localData.PATIENT_ID
        item.ENCOUNTER_NUM = this.localData.ENCOUNTER_NUM
        item.PROVIDER_ID = this.$store.getters.PROVIDER_PINNED.PROVIDER_ID
        let res = await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: item})
        if (res.error) return this.$q.notify({type: 'negative', message: res.error})
      }
      this.import_results = undefined
      this.import_finished = true
      this.$q.notify({type: 'positive', message: 'Import erfolgreich'})
      this.$emit('refresh')
    }




  }


}
</script>
