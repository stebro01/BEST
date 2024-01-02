<template>
  <q-page >
    <MainSlot :no_footer="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'surveyBEST Integration / Fill'" :img="'provider-color-logo.png'" :icon="'summarize'"/>
    </template>
     <!-- MAIN -->
     <template v-slot:main>
      
      <div v-if="QuestJSON === undefined">
        <q-banner class="bg-red-3">Kein Fragebogen ausgewählt
          <template v-slot:action>
            <q-btn class="my-btn" label="Zur Auswahl" @click="this.$router.push({name: 'surveyBEST_Integration_Search'})"/>
          </template>
        </q-banner>
      </div>
      <div v-else>

        <RENDER_QUEST :PREVIEWQUEST="QuestJSON"/>

      </div>
     </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

import RENDER_QUEST from 'src/components/sB_Integration/RenderQuest_sB.vue'

import {blob_to_json} from 'src/classes/sqltools'

export default {
  name: 'sB_Integration_Search',

  data() {
    return {
      QuestJSON: undefined
    }
  },

  components: { HEADING, MainSlot, RENDER_QUEST },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.loadData(this.$route.params.id)
  },

  watch: {


  },

  computed: {

  },

  methods: {
    async loadData(quest_id) {
      const res = await this.$store.dispatch("searchDB", {table: 'CODE_LOOKUP', query_string: {CODE_CD: quest_id}})
      if (!res || res.length !== 1) return this._error("Fehler beim Laden.")
      // else
      const BLOB = res[0].LOOKUP_BLOB
      try {
        this.QuestJSON = blob_to_json(BLOB)
      } catch {
        this._error("Fehlerhafte Daten / Konnte kein JSON Objekt konvertieren.")
        this.QuestJSON = undefined
      }
    },

    _error(msg) {
      this.$q.notify(msg)
    }
   
  }

}
</script>
