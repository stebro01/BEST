<template>
    <div v-if="patient_data">
      <q-expansion-item class="q-mt-lg my-list-item bg-grey-1"
              dense
              dense-toggle
              expand-separator
              icon="today"
              label="Vorschau"
            >

            <q-expansion-item class="q-mt-xs my-list-item bg-orange-1"
              dense
              v-for="(visit, ind_visit) in patient_data.VISITS" :key="ind_visit + 'visit'" 
              expand-separator
              icon="fact_check"
              :label="`Visite: ${ visit.ENCOUNTER_NUM } / Datum: ${ visit.START_DATE } / Observations: ${patient_data.OBSERVATIONS[ind_visit].length}  / Fehler: ${ ERRORS[ind_visit] }`"
              >
                <div v-if="patient_data.VISITS.length > 1" class="text-right"><q-btn flat no-caps icon="delete" @click="removeItem({visit: ind_visit})">gesamte Visite löschen</q-btn></div>
                  <q-list dense class="bg-white" >
                    <q-item v-for="(obs, ind_obs) in patient_data.OBSERVATIONS[ind_visit]" :key="`visit${ind_visit}obs${ind_obs}`" clickable v-ripple>
                      <q-item-section>
                       <span v-if="obs.CONCEPT_NAME_CHAR">{{ obs.CONCEPT_NAME_CHAR }}: </span>
                       <span v-else>❌{{ obs.CONCEPT_CD }} <q-tooltip>CONCEPT konnte nicht korrekt aufgelöst werden >> bitte passen Sie den Eintrag im IMPORT an oder fügen Sie einen entsprechenden Eintrag in die DB ein.</q-tooltip></span>
                    </q-item-section>
                    <q-item-section>
                      <span v-if="obs.VALTYPE_CD === 'N'">{{obs.NVAL_NUM}} <span v-if=" obs.UNIT_CD">{{ obs.UNIT_CD }}</span></span>
                      <span v-else-if="obs.VALTYPE_CD === 'F' || obs.VALTYPE_CD === 'S'"  >{{obs.TVAL_RESOLVED}}</span>
                      <span v-else>{{obs.TVAL_CHAR}}</span>
                    </q-item-section>
                    <q-item-section side><q-btn icon="delete" flat round @click="removeItem({visit: ind_visit, observation: ind_obs})"/></q-item-section>
                    </q-item>
                  </q-list>
                  


            </q-expansion-item>
            </q-expansion-item>
    </div>
</template>


<script>
export default {
  name: 'PreviewImport',

  props: ['patient_data'],

  components: {  },

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
    }
  },

  methods: {
    checkForError(item) {
      var errors = 0
      item.forEach(v => {
        if (!v.CONCEPT_NAME_CHAR) errors ++
      })
      return errors
    },

    removeItem(item) {
      if (!confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      this.$emit('remove', item)
    }
  }






}
</script>