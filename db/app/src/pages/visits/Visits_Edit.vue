<template>
  <q-page class="column items-center text-center">
    

      <!-- HEADING -->
      <HEADING :title="TEXT.title" :description="TEXT.description" :img="'visit-color-logo.png'"/>


      <!-- VISITE -->
      <div class="col q-mt-xl">
        <VISIT_EDIT_CARD :item='$store.state.VISIT_PINNED' @close="$router.go(-1)" />
        </div>
        

    <!-- VISIT CARD -->

  </q-page>
</template>

<script>
// import myMixins from 'src/mixins/modes'
import VISIT_EDIT_CARD from 'src/components/visits/VisitEdit_Card.vue'
import HEADING from 'src/components/elements/Heading.vue'
// import {get_date_from_timeStamp} from 'src/classes/sqltools.js'

export default {
  name: 'Visits_Edit',

  data() {
    return {
      show_visit_card: true
    }
  },

  components: {VISIT_EDIT_CARD, HEADING },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.$store.commit('OBSERVATION_PINNED_SET', undefined)
    if (!this.$store.getters.VISIT_PINNED) this.$router.push({name: 'Visits'})
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_edit
    }
  },

  methods: {
  
    

   
  }

}
</script>
