<template>
  <q-page>
    <MainSlot :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'surveyBEST Integration / Fill'" :img="'provider-color-logo.png'" :icon="'summarize'" />
      </template>
      <!-- MAIN -->
      <template v-slot:main>

        <div v-if="QuestJSON === undefined">
          <q-banner class="bg-red-3">Kein Fragebogen ausgewählt
            <template v-slot:action>
              <q-btn class="my-btn" label="Zur Auswahl"
                @click="this.$router.push({ name: 'surveyBEST_Integration_Search' })" />
            </template>
          </q-banner>
        </div>
        <div v-else>

          <div v-if="CDA === undefined">
            <RENDER_QUEST v-if="PID" :PREVIEWQUEST="QuestJSON" :PID="PID" @emitValue="saveData($event)" />
            <div v-else>
              Patient auswählen
              <PATIENT_LIST :auto_load="true" @clicked="setActivePatient($event)"/>
            </div>
          </div>
          <div v-else>
            <q-card>
              <q-card-section>
                <div class="row text-center">
                <div class="col text-bold text-center">{{ CDA.info.title }}</div>
                <q-btn class="absolute-right" flat icon="visibility" @click="show_view_surveypreview = true"><q-tooltip>Zeige Vorschau</q-tooltip></q-btn>
              </div>
              </q-card-section>
     
              <q-card-section v-if="IMPORTED_DATA">
                <!-- summary -->
                <PREVIEW_IMPORT_SINGLE :imported_data="IMPORTED_DATA" @close="discardData()"/>
              </q-card-section>
            </q-card>

          </div>

          <!-- PREVIEW -->
          <SURVEY_PREVIEW v-if="show_view_surveypreview" :input_data="CDA" :mode="'buffer_surveybest'" @close="show_view_surveypreview = false"/>

        </div>
      </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

import RENDER_QUEST from 'src/components/sB_Integration/RenderQuest_sB.vue'
import PATIENT_LIST from 'src/components/patient_view/PatientList.vue'
import SURVEY_PREVIEW from 'src/components/patient_view/SurveyPreview.vue'
import PREVIEW_IMPORT_SINGLE from 'src/components/import/PreviewImport.vue'

import { blob_to_json } from 'src/classes/sqltools'

import myMixins from 'src/mixins/modes_msg'

export default {
  name: 'sB_Integration_Search',
  mixins: [myMixins],

  data() {
    return {
      QuestJSON: undefined,
      CDA: undefined,
      IMPORTED_DATA: undefined,
      show_view_surveypreview: false
    }
  },

  components: { HEADING, MainSlot, RENDER_QUEST, PATIENT_LIST, SURVEY_PREVIEW, PREVIEW_IMPORT_SINGLE },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.loadData(this.$route.params.id)
  },

  watch: {


  },

  computed: {
    PID() {
      if (this.$store.getters.PATIENT_PINNED === undefined) return undefined
      return this.$store.getters.PATIENT_PINNED.PATIENT_CD
    }
  },

  methods: {
    async loadData(quest_id) {
      const res = await this.$store.dispatch("searchDB", { table: 'CODE_LOOKUP', query_string: { CODE_CD: quest_id } })
      if (!res || res.length !== 1) return this._error_msg("Fehler beim Laden.")
      // else
      const BLOB = res[0].LOOKUP_BLOB
      try {
        this.QuestJSON = blob_to_json(BLOB)
      } catch {
        this._error_msg("Fehlerhafte Daten / Konnte kein JSON Objekt konvertieren.")
        this.QuestJSON = undefined
      }
    },

    discardData() {
      this.CDA = undefined
      this.QuestJSON = undefined
      this.IMPORTED_DATA = undefined
    },

    async saveData(cda) {
      this.CDA = cda
      const DATA = await this.$store.dispatch('importSurveyBEST', JSON.stringify(cda))

      if (DATA.status === false) return this._error_msg('Fehler beim Speichern')
      else {
        this._success_msg('Fragebogen erfolgreich als CDA importiert')
        console.log(DATA)
        this.IMPORTED_DATA = DATA
      }
    },

    // set the Patient as returned from PATIENT_LIST
    setActivePatient(PATIENT) {
      if (PATIENT === undefined) return
      this.$store.commit("PATIENT_PINNED_SET", PATIENT);
    }


  }

}
</script>
