<template>
<div>

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
                <td class="text-center">{{ OBSERVATION.ENCOUNTER_NUM }} 
                  <span class="float float-right cursor-pointer"><q-icon name="search" @click="showVisitSelect()"/><q-tooltip>Einer anderen Visite zuordnen</q-tooltip></span>
                </td>
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

  <!-- DIALOG SEARCH VISITE -->
  <q-dialog v-model="show_visit_dialog">
    <q-card>
      <q-btn icon="close" class="absolute-top-right z-top" flat round @click="show_visit_dialog=false; show_visit_dialog_list = undefined" />
      <q-card-section>Visite suchen</q-card-section>
      <q-card-section class="q-pa-none text-center"><q-chip ><q-icon name="add" @click="showVisitNew()"/><q-tooltip>Visite hinzufuegen</q-tooltip> </q-chip></q-card-section>
      <q-card-section>
       <q-list v-if="show_visit_dialog_list" dense>
        <q-item v-for="(item_v, ind_v) in show_visit_dialog_list" :key="ind_v + 'visite'" clickable v-ripple @click="selectVisit(item_v)">
          <q-item-section side>ID: {{ item_v.ENCOUNTER_NUM }}</q-item-section>
          <q-item-section>
            <q-item-label>{{ item_v.START_DATE }}</q-item-label>
            <q-item-label caption>{{ item_v.VISIT_BLOB }}</q-item-label>
          </q-item-section>
        </q-item>
       </q-list>
       <q-banner v-else>Keine Visite gefunden</q-banner>
      
      </q-card-section>
      </q-card>
    </q-dialog>

     <!-- DIALOG NEW VISITE -->
     <NEW_VISIT_DIALOG v-if="show_visit_new_dialog" :active="show_visit_new_dialog" @close="show_visit_new_dialog = false" :item="OBSERVATION" @save="setNewVisit($event)"/>
</div>
</template>


<script>

import NEW_VISIT_DIALOG from './NewVisitDialog.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'EditObservationDialog',

  props: ['active', 'item'],

  components: { NEW_VISIT_DIALOG },

  data() {
    return {
      PATIENT: undefined,
      OBSERVATION: undefined,
      expanded: false,
      options_select: [],
      show_visit_dialog: false,
      show_visit_dialog_list: undefined,
      show_visit_new_dialog: false,
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

    async deleteObs() {
      if (!await my_confirm(`Soll der Eintrag wirklich gelöscht werden?)`)) return
      this.$emit('delete', {PATIENT: this.PATIENT, OBSERVATION: this.OBSERVATION})
    },

    async showVisitSelect() {
      this.show_visit_dialog = true
      this.show_visit_dialog_list = await this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: this.OBSERVATION.PATIENT_NUM}, table: 'VISIT_DIMENSION'})
    },

    selectVisit(item) {
      this.OBSERVATION.ENCOUNTER_NUM = item.ENCOUNTER_NUM
      this.OBSERVATION.START_DATE = item.START_DATE
      this.show_visit_dialog = false
      this.show_visit_dialog_list = undefined
    },

    showVisitNew() {
      this.show_visit_dialog = false
      this.show_visit_dialog_list = undefined
      this.show_visit_new_dialog = true
    },

    setNewVisit(item) {
      this.selectVisit(item)
      this.show_visit_new_dialog = false
    }

    
    

  }






}
</script>