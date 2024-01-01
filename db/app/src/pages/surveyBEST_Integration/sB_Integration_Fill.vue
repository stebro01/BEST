<template>
  <q-page >
    <MainSlot :no_footer="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'surveyBEST Integration / Fill'" :img="'provider-color-logo.png'" :icon="'summarize'"/>
    </template>
     <!-- MAIN -->
     <template v-slot:main>

      <div>
        <q-list bordered separator>
          <q-item v-ripple clickable @click="comming_soon()">select quest </q-item>
          <q-item v-ripple clickable @click="comming_soon()">fill quest </q-item>
        </q-list>
      </div>

     </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'surveyBEST_Integration_Fill',

  data() {
    return {
      options: this.$store.getters.ENV.options_db_functions
    }
  },

  components: { HEADING, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {

  },

  watch: {


  },

  computed: {

  },

  methods: {
    comming_soon() {
      this.$q.notify({
        message: 'Coming Soon',
        color: 'warning',
        icon: 'warning',
        position: 'bottom',
        timeout: 1000
      })
    }
   
  }

}
</script>
