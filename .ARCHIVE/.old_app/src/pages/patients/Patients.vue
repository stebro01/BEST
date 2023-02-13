<template>
  <q-page class="">
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
          <HEADING :title="'Patienten'" :description="'verwalten und anzeigen'" :img="'patient-color-logo.png'" :icon="'person'"/>
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_left>
        <q-btn icon="add" class="bg-black text-white" no-caps rounded label="neuer Patient" @click="newPatient()" />
      </template>
      <template v-slot:options_right>
          <FILTER_BOX :filter="filter" @update="filter = $event"/>
        </template>
        
      <!-- MAIN -->
      <template v-slot:main>
        <q-table
        class="my-table"
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
                  <div>LfdN: {{ props.row.PATIENT_NUM }}</div>
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
        
        </q-table>
      </template>
      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS v-if="SELECTION>0" 
      :show_like="SELECTION === 1" :show_edit="SELECTION === 1" :show_delete="true"
      @like="likePatient()" @edit="editPatient()" @delete="deletePatient()"
    />

      </template>

    </MainSlot>
    
  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'Patients',
  components: {HEADING, FILTER_BOX, BOTTOM_BUTTONS, MainSlot},
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
        { name: 'VITAL_STATUS_RESOLVED',required: true,label: 'Status',align: 'center',field: 'VITAL_STATUS_RESOVED',sortable: true,style: 'width: 20px', },
        { name: 'BIRTH_DATE',required: true,label: 'Geb.Datum',align: 'center',field: 'BIRTH_DATE',sortable: true,style: 'width: 20px', },
        { name: 'SEX_RESOLVED',required: true,label: 'Geschlecht',align: 'center',field: 'SEX_RESOLVED',sortable: true,style: 'width: 20px', },
        { name: 'AGE_IN_YEARS',required: true,label: 'Alter',align: 'center',field: 'AGE_IN_YEARS',sortable: true,style: 'width: 20px', },
        { name: 'PATIENT_BLOB',required: true,label: 'BLOB',align: 'center',field: 'PATIENT_BLOB',sortable: true,style: 'width: 20px', },
      ],
      options_gender: []

    }
  },


  mounted() {
    this.loadPatient() //lade den Patienten
  },

  computed: {
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
          this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: 0, _greater: true, _view: true}, table: 'PATIENT_DIMENSION'})
          .then(res => {
            this.results = res
            this.selected = {};
            this.results.forEach(e => {
              this.selected[e.PATIENT_NUM] = {PATIENT_NUM: e.PATIENT_NUM, selected: false}
            })
          })
        },


        newPatient() {
          this.$store.dispatch('addDB', {query_string: {SOURCESYSTEM_CD: 'LOINC'},table: "PATIENT_DIMENSION"})
          .then(res => {
            this.$q.notify(`neuer Patient: <<${res.PATIENT_NUM}>>`)
            this.$router.push({name: 'Patients_Edit', params: {PATIENT_NUM: res.PATIENT_NUM}})
          }).catch(err => this.$q.notify('Etwas ging schief: ' + err))
        },

        likePatient() {
          const keys = Object.keys(this.selected)
          const PATIENT_NUM = this.getSelected_PATIENT_NUM()
          this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: PATIENT_NUM}, table: 'PATIENT_DIMENSION'})
          .then(res => {
            this.$store.commit('PATIENT_PINNED_SET', res[0])
            this.$store.commit('VISIT_PINNED_SET', undefined)
            this.$store.commit('OBSERVATION_PINNED_SET', undefined)
            this.selected[PATIENT_NUM].selected = false
            this.$router.push({name: 'Visits'})
          })

        },

        editPatient() {
          return this.$router.push({name: 'Patients_Edit', params: {PATIENT_NUM: this.getSelected_PATIENT_NUM()}})
        },

        getSelected_PATIENT_NUM() {
          const keys = Object.keys(this.selected)
          var PATIENT_NUM = undefined
          keys.forEach(el => {
            if (this.selected[el].selected) PATIENT_NUM =  this.selected[el].PATIENT_NUM
          })
          return PATIENT_NUM

        },

        deletePatient() {
          if (!confirm(`Sollen ausgewählte Patienten wirklich gelöscht werden?\nAlle zugehörigen Visten und Daten werden auch entfernt.\n(Dieser Schritt kann nicht rückgängig gemacht werden!)`)) return
          const keys = Object.keys(this.selected)
          const promises = []
          let cc = 0
          keys.forEach(el => {
            if (this.selected[el].selected) {
              cc++
              promises.push(this.$store.dispatch('deleteDB', {query_string: {"PATIENT_NUM":this.selected[el].PATIENT_NUM}, table: "PATIENT_DIMENSION"}))
              // PATIENT WILL BE REMOVED from VISIT_DIMENSION and OBSERVATION_FACT via: TRIGGER delete_patient_cascade

              //unlike_
              if (this.$store.getters.PATIENT_PINNED && this.selected[el].PATIENT_NUM === this.$store.getters.PATIENT_PINNED.PATIENT_NUM) {
                this.$store.commit('PATIENT_PINNED_SET', undefined)
                this.$store.commit('VISIT_PINNED_SET', undefined)
                this.$store.commit('OBSERVATION_PINNED_SET', undefined)
              }
            }
          })

          Promise.all(promises).then(res => {}).catch(err => this.$q.notify(err)).finally(() => {
            this.loadPatient()
            this.$q.notify(`Löschen erfolgreich: ${cc} Patienten entfernt`)
          }) 
   
        }

  }

}
</script>
