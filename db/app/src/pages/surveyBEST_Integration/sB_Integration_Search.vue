<template>
  <q-page >
    <MainSlot :no_footer="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'surveyBEST Integration / Search'" :img="'provider-color-logo.png'" :icon="'summarize'"/>
    </template>
     <!-- MAIN -->
     <template v-slot:main>
      <div>
        <div>
        <FILTER_BOX @update="searchQuest($event)" />
      </div>

      <div>
        <q-list class="my-card">
          <q-item v-for="(items, index) in listQuest" :key="index + 'el'">
            <q-item-section>
              <q-item-label>{{items.NAME_CHAR}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" label="Fill" @click="fillQuest(items.CODE_CD)" />
            </q-item-section>
          </q-item>
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
import FILTER_BOX from 'src/components/elements/FilterBox.vue'

export default {
  name: 'sB_Integration_Search',

  data() {
    return {
      listQuest: []
    }
  },

  components: { HEADING, MainSlot, FILTER_BOX },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.searchQuest('')
  },

  watch: {


  },

  computed: {

  },

  methods: {
    searchQuest(filter) {
      const STATEMENT =  `SELECT NAME_CHAR, CODE_CD FROM CODE_LOOKUP WHERE NAME_CHAR LIKE '%${filter}%' AND COLUMN_CD = "SURVEY_BEST";`
      this.$store.dispatch('runQuery', STATEMENT).then((response) => {
        this.listQuest = response.data
      })
    },

    fillQuest(quest) {
      this.$router.push({name: 'surveyBEST_Integration_Fill', params: {id: quest}})
    }

  }

}
</script>
