<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'observation-logo.png'" :icon="'event'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <OBSERVATION_TABLE_EDIT v-if="formData" :input_data="formData" @changed="dataChanged($event)" @previewSurvey="previewSurveyBest($event)"/>
        
        <q-btn v-if="!show_print_view && !preview_survey_best_show" class="q-mt-xl" rounded @click="show_print_view = true">Druck-version</q-btn>
        <PRINT_PREVIEW v-else-if="show_print_view" :formData="formData" @close="show_print_view = false"/>

        <!-- PREVIEW SURVEYBEST -->
        <SURVEY_BEST_PREVIEW v-if="preview_survey_best_show" :item="preview_survey_best_item"
      @close="preview_survey_best_item = false; preview_survey_best_show = false" />


      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTON :show_back="true" @back="closeObservation()" :show_save="data_changed"
          @save="saveChangedData()" />
      </template>

      <!-- ENDE -->
    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import OBSERVATION_TABLE_EDIT from 'src/components/ObservationTable_edit.vue'
import BOTTOM_BUTTON from 'src/components/elements/BottomButtons.vue'
import MainSlot from 'src/components/MainSlot.vue'
import PRINT_PREVIEW from 'src/components/visits/PrintPreview.vue'
import SURVEY_BEST_PREVIEW from 'src/components/visits/SurveyBestPreview.vue'

import {beautify_data} from 'src/tools/formatdata'
export default {
  name: 'Observation_Edit',

  components: {HEADING, OBSERVATION_TABLE_EDIT, BOTTOM_BUTTON, MainSlot, PRINT_PREVIEW, SURVEY_BEST_PREVIEW},

  data() {
    return {
      formData: undefined,
      data_changed: false,
      show_print_view: false, 
      preview_survey_best_show: false,
      preview_survey_best_item: undefined
    }
  },

  mounted() {
    if (!this.OBSERVATION_PINNED) return this.$router.push({name: 'VisitsView'})
    this.loadLocalData()

  },

  watch: {

  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.observation_edit
    },

    VISIT_PINNED() {
      return this.$store.getters.VISIT_PINNED
    },

    PATIENT_PINNED() {
      return this.$store.getters.PATIENT_PINNED
    },

    OBSERVATION_PINNED() {
      return this.$store.getters.OBSERVATION_PINNED
    }
  },

  methods: {
    loadLocalData() {
      this.formData = this.OBSERVATION_PINNED
      // this.changeDetected = false
    }, 

    closeObservation() {
      this.$store.commit('OBSERVATION_PINNED_SET', undefined)
      this.$router.push({name: 'VisitsView'})
    },

    dataChanged(data) {
      this.formData = data
      this.data_changed = true
    },

    saveChangedData() {
      const promise = []
      
      this.formData.forEach(data => {
        let OBSERVATION = beautify_data(data)
        let WHERE = {OBSERVATION_ID: OBSERVATION.OBSERVATION_ID}
        delete OBSERVATION.OBSERVATION_ID
        promise.push(this.$store.dispatch('updateDB', {query_string: {where: WHERE, set: OBSERVATION}, table:"OBSERVATION_FACT"}))
      })
      Promise.all(promise).then(() => {
        this.data_changed = false
        this.$q.notify(this.$store.getters.TEXT.msg.save_successful)
      })
    },

    previewSurveyBest(val) {
      this.preview_survey_best_show = false
      this.$nextTick(() => {
        this.preview_survey_best_item = val;
        this.preview_survey_best_show = true
      })
    }
   
  }

}
</script>
