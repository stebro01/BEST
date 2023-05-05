<template>
  <q-page>
    <MainSlot>

      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'visit-color-logo.png'" :icon="'event'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <VISIT_EDIT_CARD :item='$store.state.VISIT_PINNED' @close="$router.go(-1)" />
      </template>

            <!-- FOOTER -->
            <template v-slot:footer>
        <BOTTOM_BUTTONS :show_back="true" @back="$router.go(-1)" />
      </template>

    </MainSlot>

  </q-page>
</template>

<script>
// import myMixins from 'src/mixins/modes'
import VISIT_EDIT_CARD from 'src/components/visits/VisitEdit_Card.vue'
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
  name: 'Visits_Edit',

  data() {
    return {
      show_visit_card: true
    }
  },

  components: {VISIT_EDIT_CARD, HEADING, MainSlot, BOTTOM_BUTTONS },
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
