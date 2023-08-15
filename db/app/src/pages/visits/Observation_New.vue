<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'observation-logo.png'" :icon="'event'"/>
    </template>

     <!-- MAIN -->
     <template v-slot:main>
      <OBSERVATION_EDIT_CARD v-if="formData" :item="formData" @close="closeObservation()" @change="updateData($event)"/>
    </template>

    <template v-slot:footer>
          <!-- BUTTONS -->
    <BOTTOM_BUTTONS 
      :show_save="data_changed === true" @save="saveData()"
    />  
    </template>

  </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import OBSERVATION_EDIT_CARD from 'src/components/ObservationEdit_Card.vue'
import MainSlot from 'src/components/MainSlot.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import {beautify_data} from 'src/tools/formatdata.js'


import {datenow_isostring} from 'src/tools/mydate'

export default {
  name: 'Observation_New',

  components: {HEADING, OBSERVATION_EDIT_CARD, MainSlot, BOTTOM_BUTTONS },

  data() {
    return {
      formData: undefined,
      data_changed: false
    }
  },

  mounted() {
    if (!this.VISIT_PINNED) return this.$router.push({name: 'VisitsView'})
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
    }
  },

  methods: {
    loadLocalData() {
      this.formData = {
        ENCOUNTER_NUM: this.VISIT_PINNED.ENCOUNTER_NUM,
        PATIENT_NUM: this.PATIENT_PINNED.PATIENT_NUM,
        START_DATE: datenow_isostring(),
        PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID || undefined,
        LOCATION_CD: this.VISIT_PINNED.LOCATION_CD || undefined
      }
      
    }, 

    saveData() {
        const data = beautify_data(this.formData)
        if (data.OBSERVATION_ID) {
          const where = {OBSERVATION_ID: data.OBSERVATION_ID}
          delete data.OBSERVATION_ID
          this.$store.dispatch('updateDB', {query_string: {where: where, set: data}, table:"OBSERVATION_FACT"})
          .then(res => {
            this.$q.notify('Speichern erfolgreich')
            this.data_changed = false
          }).catch(err => this.$q.notify(err))
        } else {
          this.$store.dispatch('addDB', {query_string: data, table:"OBSERVATION_FACT"})
          .then(res => {
            this.formData.OBSERVATION_ID = res.OBSERVATION_ID
            this.$emit('updateData', res)
            this.$q.notify('Speichern erfolgreich')
          })
          .catch(err => this.$q.notify(err))
          this.data_changed = false
        }
      },

    closeObservation() {
      this.$store.commit('OBSERVATION_PINNED_SET', undefined)
      // this.$router.push({name: 'VisitsView'})

    },

    updateData(data) {
      // console.log(data)
      this.data_changed = false
      this.formData = data
      if (!this.formData) return
      if (this.formData.CONCEPT_CD === undefined || this.formData.CONCEPT_CD === "") return false
      if (this.formData.START_DATE === undefined || this.formData.START_DATE === "") return false
      if (this.formData.PROVIDER_ID === undefined || this.formData.PROVIDER_ID === "") return false
      if (this.formData.LOCATION_CD === undefined || this.formData.LOCATION_CD === "") return false
      if (this.formData.VALTYPE_CD === undefined || this.formData.VALTYPE_CD === "") return false
      if (this.formData.VALTYPE_CD === 'N') {
        if (this.formData.NVAL_NUM === null || this.formData.NVAL_NUM === undefined) return false
      }
      else if (['S', 'T', 'F'].includes(this.formData.VALTYPE_CD)) {
        if (this.formData.TVAL_CHAR === null || this.formData.TVAL_CHAR === undefined) return false
      }
      this.data_changed = true
    }
   
  }

}
</script>
