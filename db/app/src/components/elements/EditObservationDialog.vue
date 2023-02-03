<template>
  <q-dialog v-model="ACTIVE">
    <q-card>
      <q-btn icon="close" class="absolute-top-right z-top" flat round @click="$emit('close')" />
      <q-card-section>Observation bearbeiten</q-card-section>
      <q-card-section v-if="OBSERVATION">
        <q-form @submit="saveItem()">
          <q-markup-table dense>
            <tbody>
              <tr>
                <td colspan="1">PATIENT_CD</td>
                <td colspan="3" class="text-center">{{ OBSERVATION.PATIENT_NUM }}</td>
              </tr>
              <tr>
                <td>Visiten-ID</td>
                <td class="text-center">{{ OBSERVATION.ENCOUNTER_NUM }}</td>
              </tr>
              <tr>
                <td>Datum</td>
                <td><q-input dense v-model="OBSERVATION.START_DATE" type="date" filled input-class="text-center" /></td>
              </tr>
              <tr>
                <td>Untersuchung</td>
                <td class="text-center text-bold" style="max-width: 400px; overflow: hidden">{{ OBSERVATION.CONCEPT_NAME_CHAR }}</td>
              </tr>
              <!-- CONTENT -->
              <tr>
                <td>Wert/Auswahl</td>
                <td v-if="OBSERVATION.VALTYPE_CD === 'N'"><q-input dense v-model="OBSERVATION.NVAL_NUM" type="number"
                    filled input-class="text-center" /></td>
                <td v-else-if="OBSERVATION.VALTYPE_CD === 'D'"><q-input dense v-model="OBSERVATION.TVAL_CHAR"
                    type="date" filled input-class="text-center" /></td>
                <td v-else-if="OBSERVATION.VALTYPE_CD === 'F' || OBSERVATION.VALTYPE_CD === 'S'" class="text-left bg-grey-2">
                  <q-option-group v-model="OBSERVATION.TVAL_CHAR" :options="options_select" color="primary" @update:model-value="updateOptionGroup($event)" />
                  </td>
              </tr>
              <tr>
                <td colspan="100%">
                  <q-expansion-item v-model="expanded" icon="source" label="Mehr Details">
                    <q-markup-table dense>
            <tbody>
              <tr>
                <td>Beschreibung</td>
                <td><q-input v-model="OBSERVATION.OBSERVATION_BLOB" dense filled input-class="text-center" /></td>
              </tr>
              <tr>
                <td>Kategorie</td>
                <td><q-input v-model="OBSERVATION.CATEGORY_CHAR" dense filled input-class="text-center" /></td>
              </tr>
            </tbody>
          </q-markup-table>
          </q-expansion-item>
          </td>
          </tr>
          </tbody>
          </q-markup-table>
          <!-- {{ OBSERVATION }} -->

        </q-form>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn no-caps rounded class="my-btn" @click="saveItem">{{ $store.getters.TEXT.btn.save }}</q-btn>
        <q-btn size="sm" round  color="dark" class="absolute-bottom-left q-mb-sm" icon="delete" @click="deleteObs()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script>
export default {
  name: 'EditObservationDialog',

  props: ['active', 'item'],

  components: {  },

  data() {
    return {
      PATIENT: undefined,
      OBSERVATION: undefined,
      expanded: false,
      options_select: []
    }
  },

  mounted() {
    if (!this.item) return
    this.PATIENT = this.item.PATIENT
    this.OBSERVATION = JSON.parse(JSON.stringify(this.item.OBSERVATION))
    if (this.OBSERVATION.VALTYPE_CD === 'S' || this.OBSERVATION.VALTYPE_CD === 'F') {
      this.loadAnswers(this.OBSERVATION)
    }
  },

  computed: {
    ACTIVE: {
      get() {
        return this.active
      }, set(val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    async loadAnswers(obs) {
      this.options_select = await this.$store.dispatch('getAnswersForObservation', obs)
    },

    updateOptionGroup(val) {
      let obj = this.options_select.find(el => el.value === val)
      this.OBSERVATION.TVAL_RESOLVED = obj.label
    },


    saveItem() {
      this.$emit('save', {PATIENT: this.PATIENT, OBSERVATION: this.OBSERVATION})
    },

    deleteObs() {
      if (!confirm(`Soll der Eintrag wirklich gelöscht werden?)`)) return
      this.$emit('delete', {PATIENT: this.PATIENT, OBSERVATION: this.OBSERVATION})
    }

    
    

  }






}
</script>