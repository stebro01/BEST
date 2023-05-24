<template>
  <div v-if="patient_data">
    <!-- VORSCHAU -->
    <q-expansion-item class="q-mt-lg my-list-item bg-grey-1" dense dense-toggle expand-separator icon="today"
      :label="MEINE_VORSCHAU">
      <!-- VISITS -->
      <q-expansion-item class="q-mt-xs my-list-item bg-orange-1" dense v-for="(visit, ind_visit) in patient_data.VISITS"
        :key="ind_visit + 'visit'" expand-separator icon="fact_check"
        :label="`Visite: ${visit.ENCOUNTER_NUM} / Datum: ${visit.START_DATE} / Observations: ${patient_data.OBSERVATIONS[ind_visit].length}  / Fehler: ${ERRORS[ind_visit]}`">
        <div v-if="patient_data.VISITS.length > 1" class="text-right"><q-btn flat no-caps icon="delete"
            @click="removeItem({ visit: ind_visit })">gesamte Visite löschen</q-btn></div>
        <!-- OBSERVATIONS -->
        <q-list dense class="bg-white">
          <q-item v-for="(obs, ind_obs) in patient_data.OBSERVATIONS[ind_visit]" :key="`visit${ind_visit}obs${ind_obs}`"
            clickable v-ripple>
            <q-item-section>
              <span v-if="obs.CONCEPT_NAME_CHAR">{{ obs.CONCEPT_NAME_CHAR }}: </span>
              <span v-else>❌{{ obs.CONCEPT_CD }} <q-tooltip>CONCEPT konnte nicht korrekt aufgelöst werden >> bitte passen
                  Sie den Eintrag im IMPORT an oder fügen Sie einen entsprechenden Eintrag in die DB
                  ein.</q-tooltip></span>
            </q-item-section>
            <q-item-section>
              <span v-if="obs.VALTYPE_CD === 'N'">{{ obs.NVAL_NUM }} <span v-if="obs.UNIT_CD">{{ obs.UNIT_CD
              }}</span></span>
              <span v-else-if="obs.VALTYPE_CD === 'F' || obs.VALTYPE_CD === 'S'">{{ obs.TVAL_RESOLVED }}</span>
              <span v-else>{{ obs.TVAL_CHAR }}</span>
            </q-item-section>
            <q-item-section side>
              <div>
              <!-- CQL CHECK -->
              <span v-if="obs._check.status === true">✅<q-tooltip>CQL Check: {{ obs._check.data.length }} rules passed</q-tooltip></span>
              <span v-else>❌<q-tooltip>
                <div>CQL Check: {{ obs._check.data.filter(el => el.status === false).length }} / {{ obs._check.data.length }} rules not passed</div>
                <div v-for="(ccheck, ic) in obs._check.data.filter(el => el.status === false)" :key="ic+'check'+ind_visit+ind_obs"><span v-if="ccheck.info">{{ ccheck.info }}:</span>{{ ccheck.data }}</div>
              </q-tooltip></span>

              <span v-if="obs._double_found === true">❌<q-tooltip>Dieser Datensatz wurde bereits in der DB gefunden</q-tooltip></span>
              <span v-else-if="obs._double_found === false">✅<q-tooltip>Keine Doppelung gefunden</q-tooltip></span>
            </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-expansion-item>
  </div>
</template>


<script>
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'PreviewImport',

  props: ['patient_data', 'total_errors_found'],

  components: {},

  data() {
    return {
    }
  },

  computed: {
    ERRORS() {
      const RESULT = []
      if (!this.patient_data) return RESULT
      this.patient_data.OBSERVATIONS.forEach(o => RESULT.push(this.checkForError(o)))
      return RESULT
    },
    MEINE_VORSCHAU() {
      if (!this.patient_data) return 'Vorschau'
      else return `Vorschau: gefunden Visiten: ${this.patient_data.VISITS.length}, Fehler: ${this.total_errors_found}`

    }
  },

  methods: {
    checkForError(item) {
      var errors = 0
      item.forEach(v => {

        if (!v.CONCEPT_NAME_CHAR) errors++
        if (v._check.status === false) errors++
        if (v._double_found === true) errors++

      })
      return errors
    },

    async removeItem(item) {
      if (!await my_confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      this.$emit('remove', item)
    },

  }






}
</script>