<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'observation-logo.png'"/>
    </template>

     <!-- MAIN -->
     <template v-slot:main>
      <OBSERVATION_EDIT_CARD v-if="formData" :item="formData" @close="closeObservation()"/>
    </template>

  </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import OBSERVATION_EDIT_CARD from 'src/components/ObservationEdit_Card.vue'
import MainSlot from 'src/components/MainSlot.vue'
import {datenow_isostring} from 'src/tools/mydate'

export default {
  name: 'Observation_New',

  components: {HEADING, OBSERVATION_EDIT_CARD, MainSlot },

  data() {
    return {
      formData: undefined,
      // changeDetected: false,
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
      console.log(this.formData)
      // this.changeDetected = false
    }, 

    closeObservation() {
      this.$store.commit('OBSERVATION_PINNED_SET', undefined)
      this.$router.push({name: 'VisitsView'})
    }
   
  }

}
</script>
