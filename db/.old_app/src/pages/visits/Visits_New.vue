<template>
  <q-page>
    <MainSlot>
       <!-- HEADING -->
       <template v-slot:header>
      <HEADING :title="TEXT.title" :description="TEXT.description" :img="'visit-color-logo.png'" :icon="'event'"/>
       </template>

      <!-- VISITE -->
      <!-- MAIN -->
      <template v-slot:main v-if="visit">
        <VISIT_EDIT_CARD :item='visit' @close="$router.go(-1)" :mode="'new'"/>
      </template>
        
    </MainSlot>    

  </q-page>
</template>

<script>
// import myMixins from 'src/mixins/modes'
import VISIT_EDIT_CARD from 'src/components/visits/VisitEdit_Card.vue'
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

import {datenow_isostring} from 'src/tools/mydate'

export default {
  name: 'New',

  data() {
    return {
      visit: undefined
    }
  },

  components: {VISIT_EDIT_CARD, HEADING, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    if (!this.PATIENT_PINNED) return this.$router.push({name: 'Visits'})
    this.$store.commit('OBSERVATION_PINNED_SET', undefined)
    this.$store.commit('VISIT_PINNED_SET', undefined)
    if (!this.PATIENT_PINNED) this.$router.push({name: 'Visits'})
    this.visit = {
      PATIENT_NUM: this.PATIENT_PINNED.PATIENT_NUM,
      START_DATE: datenow_isostring()
    }
  },

  watch: {
    PATIENT_PINNED(val) {
      if (val === undefined) this.$router.push({name: 'Visits'})
    }
  },  

  computed: {
    PATIENT_PINNED() {
      return this.$store.getters.PATIENT_PINNED
    },

    TEXT() {
      return this.$store.getters.TEXT.page.visit_new
    }
  },

  methods: {
  
   

   
  }

}
</script>
