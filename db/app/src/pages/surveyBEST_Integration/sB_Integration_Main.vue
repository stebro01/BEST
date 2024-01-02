<template>
  <q-page >
    <MainSlot :no_footer="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'surveyBEST Integration'" :img="'provider-color-logo.png'" :icon="'summarize'"/>
    </template>
     <!-- MAIN -->
     <template v-slot:main>
      <div>
      <div class="text-caption my-card q-mb-md">
        <q-icon name="info"/>
        Mit dieser Funktion können Sie die Quests von surveyBEST integrieren.
        Dabei werden Funktionen zum Importieren von Fragebögen-Vorlagen sowie zum Ausfüllen von Fragebögen bereitgestellt.
      </div>

      <div>
        <q-list bordered separator>
          <q-item v-ripple clickable @click="$router.push({name: 'surveyBEST_Integration_Manage'})">Manage Quests </q-item>
          <q-item v-ripple clickable @click="$router.push({name: 'surveyBEST_Integration_Search'})">Select and Fill a Quest </q-item>
        </q-list>
      </div>
    </div>

     </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'surveyBEST_Integration_Main',

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

   
  }

}
</script>
