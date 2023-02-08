<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'db-queries-logo.png'" :icon="'assessment'"/>
    </template>
      
    <!-- MAIN -->
    <template v-slot:main>       
        <q-table
        class="my-table q-mt-xl"
        :rows="results"
        :columns="columns"
        :filter="filter"
        selection="single"
        dense
        
        row-key="PATIENT_NUM"
      >
      <!-- PROPS -->
       <template v-slot:body="props">
            <q-tr :props="props" @click="selected[props.row.PATIENT_NUM].selected = !selected[props.row.PATIENT_NUM].selected" class="cursor-pointer">
              <q-td>
                <q-checkbox v-model="selected[props.row.PATIENT_NUM].selected" />
              </q-td>
              <q-td v-for="el in Object.keys(results[0])" :key="el" :props="props" class="text-center" style="overflow:hidden;white-space:nowrap;">
                <!-- ANZEIGE IM TABLE -->
                {{props.row[el]}}
                <q-tooltip v-if="el === 'PATIENT_CD'">
                  <div>Alter: {{ props.row.AGE_IN_YEARS }}</div>
                  <div>Geschlecht: {{ props.row.SEX_RESOLVED }}</div>
                  <div>Sprache: {{ props.row.LANGUAGE_RESOLVED }}</div>
                  <div>Ethnicity: {{ props.row.RACE_RESOLVED }}</div>
                  <div>Status: {{ props.row.MARITAL_STATUS_RESOLVED }}</div>
                  <div>Religion: {{ props.row.RELIGION_RESOLVED }}</div>
                </q-tooltip>
              </q-td>
            </q-tr>
        </template>

      
      <!-- TOP -->
      <template v-slot:top>
         <q-btn v-if="SELECTION === 0" round flat icon="check_circle_outline" @click="setSelection(true)"><q-tooltip>{{$store.getters.TEXT.msg.select_all}}</q-tooltip></q-btn>
         <q-btn v-else round flat icon="unpublished" @click="setSelection(false)"><q-tooltip>{{$store.getters.TEXT.msg.deselect_all}}</q-tooltip></q-btn>
          <q-space />
          <FILTER_BOX :filter="filter" @update="filter = $event"/>
        </template>
        
      </q-table>
    </template>

      <!-- FOOTER -->
      <template v-slot:footer>
      <BOTTOM_BUTTONS v-if="SELECTION > 0"
        :show_export="true"
        @export="exportPatients()"
      />
      </template>

    </MainSlot>

      <!-- DIALOG FOR EXPORT -->
      <q-dialog v-model="show_query_concepts_dialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{TEXT.dialog_title}}</div>
            <div class="text-caption">{{ TEXT.dialog_description }}: {{ SELECTION }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-center">{{ TEXT.dialog_todo }}</div>
            <q-list dense bordered>
              <q-item v-for="(item, ind) in concepts_to_export" :key="ind + 'item'" v-ripple class="text-small" dense>
                <q-item-section side class="cursor-pointer" @click="removeConcept(ind)"><q-icon name="close"><q-tooltip>entfernen</q-tooltip></q-icon></q-item-section>
                <q-item-section>{{ item.CONCEPT_NAME_CHAR }}</q-item-section>
                <q-item-section>{{ item.CONCEPT_CD }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn rounded no-caps class="my-btn"  v-close-popup icon="close"/> 
            <q-btn rounded no-caps class="my-btn" @click="doExportCSV()"> CSV {{ $store.getters.TEXT.btn.export }}</q-btn>
            <q-btn v-if="SELECTION === 1" rounded no-caps class="my-btn" @click="doExportHL7()"> HL7 {{ $store.getters.TEXT.btn.export }}</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'

import { exportFile } from 'quasar'

export default {
  name: 'DBQueries_PatientCSVExport',

  data() {
    return {
      filter: null,
      selected: {},
      results: [],
      columns: [
        {
          name: 'PATIENT_CD',
          required: true,
          label: 'ID',
          align: 'center',
          field: 'PATIENT_CD',
          sortable: true,
          style: 'width: 20px',
        },
        { name: 'VITAL_STATUS_RESOLVED', required: true, label: 'Status', align: 'center', field: 'VITAL_STATUS_RESOVED', sortable: true, style: 'width: 20px', },
        { name: 'BIRTH_DATE', required: true, label: 'Geb.Datum', align: 'center', field: 'BIRTH_DATE', sortable: true, style: 'width: 20px', },
        { name: 'SEX_RESOLVED', required: true, label: 'Geschlecht', align: 'center', field: 'SEX_RESOLVED', sortable: true, style: 'width: 20px', },
        { name: 'AGE_IN_YEARS', required: true, label: 'Alter', align: 'center', field: 'AGE_IN_YEARS', sortable: true, style: 'width: 20px', },
        { name: 'PATIENT_BLOB', required: true, label: 'BLOB', align: 'center', field: 'PATIENT_BLOB', sortable: true, style: 'width: 20px', },
      ],
      concepts_to_export: [],
      show_query_concepts_dialog: false

    }
  },

  components: { HEADING, BOTTOM_BUTTONS, FILTER_BOX, MainSlot },

  mounted() {
    this.loadPatient()
  },

  watch: {


  },

  computed: {

    TEXT() {
      return this.$store.getters.TEXT.page.db_queries_csv_export
    },

    SELECTION() {
      var cc = 0
      const keys = Object.keys(this.selected)
      keys.forEach(el => {
        if (this.selected[el].selected) cc++
      })

      return cc
    }
  },

  methods: {
    loadPatient() {
      //load patients
      this.$store.dispatch('searchDB', { query_string: { PATIENT_NUM: 0, _greater: true, _view: true }, table: 'PATIENT_DIMENSION' })
        .then(res => {
          this.results = res
          this.results.forEach(e => {
            this.selected[e.PATIENT_NUM] = { PATIENT_NUM: e.PATIENT_NUM, selected: false }
          })
          this.resetParams()
        })
    },

    setSelection(val) {
      Object.keys(this.selected).forEach(k => {
        this.selected[k].selected = val
      })
    },

    resetParams() {
      this.show_query_concepts_dialog = false
      this.concepts_to_export = []
      this.setSelection(false)
    },

    getSelected_PATIENTS() {
      const keys = Object.keys(this.selected)
      var PATIENTS = []
      keys.forEach(el => {
        if (this.selected[el].selected) PATIENTS.push({PATIENT_NUM : this.selected[el].PATIENT_NUM})
      })
      return PATIENTS
    },

    exportPatients() {
      const PATIENTS = this.getSelected_PATIENTS()
      this.$store.dispatch('getDistinctPatientList',PATIENTS)
      .then(res => {
        this.concepts_to_export = res
        this.show_query_concepts_dialog = true
      }).catch(err => this.$q.notify(err))
    },

    removeConcept(ind) {
      if (ind === undefined ) return
      this.concepts_to_export.splice(ind, 1)
    },

    doExportCSV() {
      const payload = {PATIENTS: this.getSelected_PATIENTS(), CONCEPTS: this.concepts_to_export}
      this.$store.dispatch('exportObservationsCSV', payload)
      .then(res => {
        if (res.error) return this.$q.notify(res.error)
        const status = exportFile('patient_observations_export.csv', res.data)
        this.resetParams()
      })
      .catch(err => this.$q.notify(err))
    },

    async doExportHL7() {
      const payload = {PATIENTS: this.getSelected_PATIENTS(), CONCEPTS: this.concepts_to_export}
      const res = await this.$store.dispatch('exportObservationsHL7', payload)
      if (res.error) return this.$q.notify(res.error)
      for (let d of res.data) {
          let json = JSON.stringify(d)
          let filename = `patient_${d.cda.subject.display}_${d.cda.date}_HL7.json`
          // await this.sleep(1000)
          let status = exportFile(filename, json)
      }   
      await this.sleep(1000)
      this.resetParams()
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }



  }

}
</script>
