<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'visit-color-logo.png'" :icon="'event'"/>
      </template>

      <!-- Options -->
      <template v-slot:options_right>
        <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        
        <div v-if="PATIENT_PINNED">
          <q-table v-if="this.rows" :rows="rows" :columns="columns" row-key="OBSERVATION_ID"
            class="cursor-pointer my-table" :filter="filter" :rows-per-page-options="rowsperpage" dense
            selection="multiple" v-model:selected="selected">

            <template v-slot:top>
              <VISIT_TAB v-if="PATIENT_PINNED" :PATIENT="PATIENT_PINNED" @clicked="visitTabClicked($event)" />

            </template>


          </q-table>

          <div class=" text-center text-caption q-mt-xs">Zum Hinzufügen von Observations eine Visite auswählen</div>
        </div>

      </template>
      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_add="selected.length === 0 && $store.getters.VISIT_PINNED"
          :show_add_playlist="selected.length === 0 && $store.getters.VISIT_PINNED" :show_import="selected.length === 0"
          :show_edit="selected.length > 0" :show_delete="selected.length > 0"
          @add="$router.push({ name: 'Observation_New' })" @add_playlist="$router.push({ name: 'Scheme_Edit' })"
          @edit="editSelection()" @delete="deleteSelection()" @import="$router.push({ name: 'Observation_Import' })" />
      </template>
    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import { beautify_data } from 'src/tools/formatdata'
import VISIT_TAB from 'src/components/visits/VisitTab.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'


// import {get_date_from_timeStamp} from 'src/classes/sqltools.js'

export default {
  name: 'Visits_ViewAllObservations',

  components: { BOTTOM_BUTTONS, HEADING, VISIT_TAB, FILTER_BOX, MainSlot },

  data() {
    return {
      filter: undefined,
      rowsperpage: [10, 50, 100],
      selected: [],
      rows: [],
      observations: [],
      columns: [
        // {name: 'OBSERVATION_ID', field: 'OBSERVATION_ID', label: 'ID', sortable: true, align: 'center'},
        // {name: 'ENCOUNTER_NUM', field: 'ENCOUNTER_NUM', label: 'Visite', sortable: true, align: 'center'},
        // {name: 'PATIENT_NUM', field: 'name', label: 'Patient'},
        // {name: 'CATEGORY_CHAR', field: 'CATEGORY_CHAR', label: 'Kategorie', style: 'max-width: 40px; overflow: hidden', sortable: true, align: 'center'},
        {name: 'CONCEPT_CD', field: 'CONCEPT_CD', label: 'Concept', sortable: true, align: 'left', style: 'max-width: 150px; overflow: hidden'},
        // {name: 'VALTYPE_CD', field: 'VALTYPE_CD', label: 'Typ', align: 'center'},
        {name: 'TVAL_CHAR', field: 'TVAL_CHAR', label: 'Wert', align: 'center', style: 'max-width: 200px; overflow: hidden'},
        // {name: 'NVAL_NUM', field: 'NVAL_NUM', label: 'Wert(N)', align: 'center'},
        {name: 'UNIT_CD', field: 'UNIT_CD', label: 'Einheit', align: 'center'},
        {name: 'OBSERVATION_BLOB', field: 'OBSERVATION_BLOB', label: 'Beschr.', style: 'max-width: 100px', align: 'center'},
        {name: 'START_DATE', field: 'START_DATE', label: 'Datum', sortable: true, align: 'center', style: 'max-width: 50px; overflow: hidden'},
      ],
    }
  },

  mounted() {
    this.$store.commit('OBSERVATION_PINNED_SET', undefined)
    const PATIENT = this.PATIENT_PINNED 
    if (!PATIENT) return this.$router.push({name: 'Visits'})
    if (!PATIENT.PATIENT_NUM) return this.$router.push({name: 'Visits'})
    if (!this.$store.getters.VISIT_PINNED) this.loadObservations({PATIENT_NUM: PATIENT.PATIENT_NUM})
    else this.loadObservations({PATIENT_NUM: PATIENT.PATIENT_NUM, ENCOUNTER_NUM: this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM})

  },

  watch: {

  },  

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_view
    }, 

    PATIENT_PINNED() {
      return this.$store.getters.PATIENT_PINNED
    }
  },

  methods: {
    // a row in the visit table was clicked

    visitTabClicked(item) {
      if (!item) return
      if (item === 'all') {
        this.loadObservations({PATIENT_NUM: this.PATIENT_PINNED.PATIENT_NUM})
        this.$store.commit('VISIT_PINNED_SET', undefined)
      } else {
        this.$store.commit('VISIT_PINNED_SET', item)
        this.loadObservations({PATIENT_NUM: this.PATIENT_PINNED.PATIENT_NUM, ENCOUNTER_NUM: item.ENCOUNTER_NUM})
      }
    },

    loadObservations(PAYLOAD) {
      this.selected = []
      this.$store.dispatch('searchDB', { query_string: {...PAYLOAD, _view: true}, table: "OBSERVATION_FACT"})
      .then(res_obs => {

        this.rows = []
        res_obs.forEach(r => {
          if (r.PROVIDER_ID !== '<SYSTEM>') this.rows.push(r)
        })
        this.observations = JSON.parse(JSON.stringify(res_obs))
        this.rows.forEach(r => {
          if (r.CONCEPT_NAME_CHAR) r.CONCEPT_CD = r.CONCEPT_NAME_CHAR
          if (r.TVAL_RESOLVED) r.TVAL_CHAR = r.TVAL_RESOLVED
          if (r.NVAL_NUM ) r.TVAL_CHAR = r.NVAL_NUM
          if (r.OBSERVATION_BLOB && r.OBSERVATION_BLOB.indexOf('resourceType') > 0) r.OBSERVATION_BLOB = 'surveyBEST'
        })
      })
    },

    editSelection() {
      //find index of selected elements >> use the this.observations (not resolved for CONCEPTS)
      var to_select = []
      this.selected.forEach(obs =>{
        let index = this.rows.map(object => object.OBSERVATION_ID).indexOf(obs.OBSERVATION_ID);
        to_select.push(index)
      })
      to_select.sort()
      const edit_observation_formData = []
      to_select.forEach(el => edit_observation_formData.push(this.observations[el]))

      //pin the data and go to the edit page
      this.$store.commit('OBSERVATION_PINNED_SET', JSON.parse(JSON.stringify(edit_observation_formData)))
      this.$router.push({name: 'Observation_Edit'})

    },

    deleteSelection() {
      if (!confirm(`Sollen ${this.selected.length} ausgewählte Einträge wirklich gelöscht werden?`)) return
      const promise = []
      const to_delete = []
      this.selected.forEach(obs =>{
        promise.push(this.$store.dispatch('deleteDB', {query_string:{OBSERVATION_ID: obs.OBSERVATION_ID},table: "OBSERVATION_FACT"}))
        let index = this.rows.map(object => object.OBSERVATION_ID).indexOf(obs.OBSERVATION_ID);
        to_delete.push(index)
      })

      to_delete.sort()
      Promise.all(promise).then(() => {
        //remove elements from current table
        for (let i = to_delete.length -1; i >= 0; i--) {
          this.rows.splice(to_delete[i],1)
          this.observations.splice(to_delete[i],1)
        }
        this.$q.notify('Erfolgreich')
        this.selected = []
      }) 
    },

    saveChangedData() {
      const promise = []
      this.edit_observation_formData.forEach(data => {
        let OBSERVATION = beautify_data(data)
        let WHERE = {OBSERVATION_ID: OBSERVATION.OBSERVATION_ID}
        delete OBSERVATION.OBSERVATION_ID
        promise.push(this.$store.dispatch('updateDB', {query_string: {where: WHERE, set: OBSERVATION}, table:"OBSERVATION_FACT"}))
        //update the local data
        let index = this.rows.map(object => object.OBSERVATION_ID).indexOf(WHERE.OBSERVATION_ID);
        this.observations[index] = beautify_data(data)
        this.rows[index] = JSON.parse(JSON.stringify(this.observations[index]))
        this.rows[index].CONCEPT_CD = data.CONCEPT_CD.label
        if ((this.rows[index].VALTYPE_CD === 'S' || this.rows[index].VALTYPE_CD === 'F') && this.rows[index].TVAL_CHAR)  this.rows[index].TVAL_CHAR = data.TVAL_CHAR.label
        Object.keys(this.rows[index]).forEach(key => {
          if (this.rows[index][key] === 'NULL') {
            this.rows[index][key] = undefined
            this.observations[index][key] = undefined
          }
        })
      })
      Promise.all(promise).then(() => {
        this.edit_observations_data_changed = false
        this.$q.notify('Speichern erfolgreich')
      })
    }
  }

}
</script>
