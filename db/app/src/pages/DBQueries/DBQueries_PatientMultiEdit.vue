<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Patient MultiEdit'" :description="'Mehrere Patienten / Eigenschaften bearbeiten'" :icon="'assessment'"
          :img="'db-queries-logo.png'" />
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_left>
        <div class="row justify-center">
          <q-btn class="my-btn" no-caps rounded @click="show_dialog_select_patient = true">Pat. hinzufügen</q-btn>
        </div>
      </template>
      <template v-slot:options_right>
        <div class="row justify-center q-gutter-md">
          <q-btn v-if="session_changed" no-caps rounded class="my-btn" @click="saveSession()">Speichere Sitzung</q-btn>
          <q-btn v-if="session_changed" icon="refresh" rounded color="dark" @click="loadSession()"><q-tooltip>Sitzung erneut laden / nicht gespeicherte Änderungen werden verworfen</q-tooltip></q-btn>
          <q-btn v-if="!session_changed" no-caps rounded class="" icon="clear" @click="clearSession()"><q-tooltip>Sitzung
              leeren -> alle lokalen Daten werden gelöscht / DB Einträge bleiben unverändert</q-tooltip></q-btn>
        </div>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <!-- FILTER -->
        <div class="q-mb-md">
          <q-expansion-item v-model="expand_obs_filter" icon="filter_list"
            :label="`Observations-Filter: ${ OBSERVATION_TYPES.length }`"
            caption="Elemente hinzufügen, damit diese beim Patienten angezeigt werden">
            <q-card class="q-pa-none">
              <q-card-actions align="center" class="q-pb-none">
                <q-btn no-caps color="dark" round @click="show_concept_dialog = true">add</q-btn>
              </q-card-actions>
              <q-card-section class="q-pb-none">
                <q-list dense>
                  <q-item v-for="(item_obs, ind_obs) in OBSERVATION_TYPES" :key="ind_obs + 'obstypes'" clickable v-ripple>
                    <q-item-section side> {{ item_obs.VALTYPE_CD }}</q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item_obs.NAME_CHAR }}</q-item-label>
                      <q-item-label caption>{{ item_obs.CONCEPT_CD }}</q-item-label>
                    </q-item-section>
                    <q-item-section side> <q-icon class="cursor-pointer" name="delete"
                        @click="removeOBSERVATION_TYPE(item_obs)" /></q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>

        <!-- PATIENTS -->
        <div>
          <q-table title="Patienten" :rows="PATIENTS_DATA" :columns="columns" row-key="PATIENT_CD"
            v-model:expanded="expanded" class="my-list-item" :filter="filter">
            <template v-slot:top-right>
              <FILTER_BOX :filter="filter" @update="filter = $event" />
            </template>
            <!-- HEADER -->
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />

                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <!-- BODY -->
            <template v-slot:body="props">
              <!-- HAUPTZEILE -->
              <q-tr :props="props">
                <q-td auto-width>
                  <q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove"
                    @update:model-value="openPatient(props)" />
                </q-td>

                <!-- PATIENT_CD -->
                <q-td key="PATIENT_CD" :props="props">
                  {{ props.row.PATIENT_CD }}
                </q-td>
                <!-- AGE_IN_YEARS -->
                <q-td key="AGE_IN_YEARS" :props="props">
                  {{ props.row.AGE_IN_YEARS }}
                  <q-popup-edit v-model="props.row.AGE_IN_YEARS" buttons v-slot="scope">
                    <q-input v-model="scope.value" type="number" dense autofocus counter
                      @update:model-value="dataChanged(props.row)" />
                  </q-popup-edit>
                </q-td>
                <!-- PATIENT_CD -->
                <q-td key="SEX_CD" :props="props">
                  {{ props.row.SEX_RESOLVED }}
                  <q-popup-edit v-model="props.row" buttons v-slot="scope">
                    <q-select v-model="scope.value" :options="options_gender" dense autofocus counter
                      @blur="sexChanged(props.row, scope.value)" />
                  </q-popup-edit>
                </q-td>
              </q-tr>
              
              <!-- !!! EXPAND ITEM !!! -->
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="absolute-top-right z-top"><q-btn @click="removePatient(props.row)" flat size="sm"
                      icon="delete"><q-tooltip>Aus der Liste entfernen</q-tooltip></q-btn></div>
                  <div class="row" style="max-width: 70vw">

                    <div class="row q-gutter-md" v-if="props.row.OBSERVATIONS && Array.isArray(props.row.OBSERVATIONS)">
                      <!--  -->
                      <!-- CARD -->
                      <span  v-for="(obs, iindbs) in props.row.OBSERVATIONS" :key="iindbs + 'bservations'" >
                      <q-card v-if="!obs._deleted" class="q-pa-xs cursor-pointer" @click="editPatientObservation(props.row, obs)" style="max-width: 300px; overflow: hidden">
                        <div class="text-center text-caption" style="max-width: 120px; overflow: hidden">{{obs.START_DATE}}</div>
                        <q-card-section class="q-pa-none text-center text-bold">
                          {{ obs.CONCEPT_NAME_CHAR }}
                        </q-card-section>
                        <q-card-section class="q-pa-none text-center bg-grey-2">
                          <span v-if="obs.VALTYPE_CD === 'N'">{{ obs.NVAL_NUM }} {{ obs.UNIT_CD }}</span>
                          <span v-else-if="obs.VALTYPE_CD === 'F'">{{ obs.TVAL_RESOLVED }}</span>
                          <span v-else-if="obs.VALTYPE_CD === 'S'">{{ obs.TVAL_RESOLVED }}</span>
                          <span v-else>{{ obs.TVAL_CHAR }}</span>
                        </q-card-section>
                      </q-card>
                    </span>
                      <q-btn icon="add" @click="addPatientObservation(props.row)"><q-tooltip>Eine neue Observation hinzufügen</q-tooltip></q-btn>
                      <q-btn @click="loadPatientObservations(props.row)" icon="refresh"><q-tooltip>Neu Laden</q-tooltip></q-btn>

                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>

          </q-table>

        </div>

        <div class="col-12 text-center q-mt-lg" v-if="db_sync === false"><q-banner class="bg-red-3">DB Sync notwendig!</q-banner></div>

      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_save="something_changed || db_sync === false" @save="saveChangedData()" />
      </template>

    </MainSlot>

    <!-- DIALOGS -->
    <DIALOG_SELECT_PATIENT v-if="show_dialog_select_patient" :active="show_dialog_select_patient"
      @close="show_dialog_select_patient = false" @save="addPatient($event)" />

    <CONCEPT_SELECT_NEW :active="show_concept_dialog" @close="show_concept_dialog = false" @save="addConcept($event)" />
    <CONCEPT_SELECT_NEW :active="show_add_observation_dialog" @close="show_add_observation_dialog = false"
      @save="addObservation($event)" />

    <EDIT_OBSERVATION_DIALOG v-if="show_edit_observation_dialog" :active="show_edit_observation_dialog" :item="show_edit_observation_item" @close="show_edit_observation_dialog = false" @save="saveEditedObservation($event)" @delete="deleteEditedObservation($event)"/>
  </q-page>
</template>

<script>
import { uuidv4 } from 'app/../../survey3/src/tools/hhash'
import DIALOG_SELECT_PATIENT from 'src/components/Dialog_SelectPatient.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import EDIT_OBSERVATION_DIALOG from 'src/components/elements/EditObservationDialog.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import HEADING from 'src/components/elements/Heading.vue'
import CONCEPT_SELECT_NEW from 'src/components/elements/SelectConcept_New.vue'
import MainSlot from 'src/components/MainSlot.vue'
import { datenow_isostring } from 'src/tools/mydate'

export default {
  name: 'DBQueries_PatientMultiEdit',
  
  components: { HEADING, MainSlot, DIALOG_SELECT_PATIENT, FILTER_BOX, CONCEPT_SELECT_NEW, BOTTOM_BUTTONS, EDIT_OBSERVATION_DIALOG },

  data() {
    return {
      filter: null,
      PATIENTS: [],
      OBSERVATION_TYPES: [],
      show_dialog_select_patient: false,
      columns: [
      { name: 'PATIENT_CD', label: 'ID', align: 'center', field: 'PATIENT_CD', sortable: true },
      { name: 'AGE_IN_YEARS', label: 'Alter', align: 'center', field: 'AGE_IN_YEARS', sortable: true },
      { name: 'SEX_CD', label: 'Geschlecht', align: 'center', field: 'SEX_CD', sortable: true },
      ],
      expanded: [],
      expand_obs_filter: false,
      options_gender: [],
      show_concept_dialog: false,
      something_changed: false,
      session_changed: false,
      show_add_observation_dialog: false,
      show_add_observation_dialog_item : undefined,
      show_edit_observation_dialog: false,
      show_edit_observation_item: undefined,
      db_sync: true
    
    }
  },


  mounted() {
    this.loadSession()

    this.$store.dispatch('getGender').then(res => {
      this.options_gender = []
      res.forEach(r => this.options_gender.push({label: r.NAME_CHAR, value: r.CONCEPT_CD}))
    })
  },

  watch: {


  },

  computed: {
    PATIENTS_DATA() {
      if (this.PATIENTS.length === 0) return this.PATIENTS
      this.PATIENTS.forEach(item => {
        if (item.OBSERVATIONS && item.OBSERVATIONS.lenght > 0) item.OBSERVATIONS = item.OBSERVATIONS.sort((a,b) => (a.START_DATE > b.START_DATE) ? 1 : ((b.START_DATE > a.START_DATE) ? -1 : 0))

      })

      return this.PATIENTS
    }
    
  },

  methods: {
    addPatient(item) {
      if (!item) return
      let obj = this.PATIENTS.find(el => el.PATIENT_NUM === item.PATIENT_NUM)
      if (!obj) this.PATIENTS.push(item)
      else this.$q.notify('Element schon vorhanden')
      this.show_dialog_select_patient = false
      this.session_changed = true
    },

    addConcept(item) {
      let obj = this.OBSERVATION_TYPES.find(el => el.CONCEPT_CD === item.CONCEPT_CD)
      if (!obj) this.OBSERVATION_TYPES.push(item)
      else this.$q.notify('Element schon vorhanden')
      this.show_concept_dialog = false
      this.session_changed = true
    },

    saveSession() {
      this.$store.commit('SESSION_MULTI_EDIT_SET', {PATIENTS: this.PATIENTS, OBSERVATION_TYPES: this.OBSERVATION_TYPES, title: 'multi_edit', db_sync: this.something_changed === false})
      this.$q.notify('Session erfolgreich gespeichert')
      this.session_changed = false
      if (this.something_changed) this.db_sync = false
    },

    clearSession() {
      this.$store.commit('SESSION_MULTI_EDIT_CLEAR')
      this.PATIENTS = []
      this.OBSERVATION_TYPES = []
      this.$q.notify('Session erfolgreich geleert')
      this.session_changed = false
    },

    loadSession() {
      this.$store.commit('SESSION_MULTI_EDIT_LOAD')
      var state = this.$store.getters.SESSION_MULTIEDIT
      if (state && state.PATIENTS) {
        this.PATIENTS = state.PATIENTS
        this.OBSERVATION_TYPES = state.OBSERVATION_TYPES
        this.db_sync = state.db_sync
        this.$q.notify('Letzte Session erfolgreich geladen')
      }
      this.session_changed = false
    },

    sexChanged(item, val) {
      let obj = this.PATIENTS.find(el => el.PATIENT_CD === item.PATIENT_CD)
      if (!obj) return
      obj.SEX_RESOLVED = val.label
      obj.SEX_CD = val.value
      this.dataChanged(item)
    },

    dataChanged(item) {
      item._changed = true
      this.something_changed = true
      this.session_changed = true
    },

    removePatient(item) {
      var ind = this.PATIENTS.findIndex(el => el.PATIENT_CD === item.PATIENT_CD)
      if (ind > -1) {this.PATIENTS.splice(ind, 1); this.session_changed = true}
    },

    removeOBSERVATION_TYPE(item) {
      var ind = this.OBSERVATION_TYPES.findIndex(el => el.CONCEPT_CD === item.CONCEPT_CD)
      if (ind > -1) {this.OBSERVATION_TYPES.splice(ind, 1); this.session_changed = true}
    },

    async saveChangedData() {
      // loop through all data and change, if neccessary
      // PATIENTS
     for (let p of this.PATIENTS) {
      if (p._changed === true) {
        // await this.$store.dispatch('updateDB', {query_string: {where: {PATIENT_NUM: p.PATIENT_NUM}, set: {AGE_IN_YEARS: p.AGE_IN_YEARS, SEX_CD: p.SEX_CD}}, table: 'PATIENT_DIMENSION'})
        p._changed = false        
      }
      let INDEX_TO_DELETE = []
      let cc = -1
      for (let obs of p.OBSERVATIONS) {
        cc ++
          if (obs._changed === true) {
            if (!obs.OBSERVATION_ID) {
              let res_obs_add = await this.$store.dispatch('addDB', {query_string: obs, table: 'OBSERVATION_FACT'})
              obs.OBSERVATION_ID = res_obs_add.OBSERVATION_ID
              obs._changed === false
            } else {
              // UPDATE
              Object.keys(obs).forEach(oo => {
                if (oo === null) oo = "NULL"
              })
              let WHERE = {OBSERVATION_ID: obs.OBSERVATION_ID}
              let SET = JSON.parse(JSON.stringify(obs))
              delete SET.OBSERVATION_ID
              let res_obs_update = await this.$store.dispatch('updateDB', {query_string: {where: WHERE, set: SET}, table: 'OBSERVATION_FACT'})
            }
          } else if (obs._deleted === true) {
            if (obs.OBSERVATION_ID) await this.$store.dispatch('deleteDB', {query_string: {OBSERVATION_ID: obs.OBSERVATION_ID}, table: 'OBSERVATION_FACT'})
            INDEX_TO_DELETE.push(cc)
          }
        } //ende p.OBSERVATIONS
      
      // ENTFERNE NOCH DIE ELEMENTE, DIE GELÖSCHT WURDEN
       if (INDEX_TO_DELETE.length > 0) {
         INDEX_TO_DELETE.slice().reverse().forEach(ind => {
           p.OBSERVATIONS.splice(ind, 1)
         })
       }
     }

     this.something_changed = false
     this.db_sync = true
     this.saveSession()
     this.$q.notify('Speichern erfolgreich => Session wurde geupdated')
    },

    openPatient(props) {
      if (props.expand === false) {
        if (!props.row.OBSERVATIONS) this.loadPatientObservations(props.row)
      }
    },

    async loadPatientObservations(item) {
      //lade jetzt f. einen Patienten alle verfügbaren Observations, die in der OBSERVATION_TYPES liste sind
      const OBSERVATIONS = []
      for (let type of this. OBSERVATION_TYPES) {
        let res = await this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: item.PATIENT_NUM, CONCEPT_CD: type.CONCEPT_CD, _view: true}, table: 'OBSERVATION_FACT'})
        res.forEach(r => OBSERVATIONS.push(r))
      }
      
      item.OBSERVATIONS = OBSERVATIONS.sort((a,b) => (a.START_DATE > b.START_DATE) ? 1 : ((b.START_DATE > a.START_DATE) ? -1 : 0))
      this.session_changed = true
    },

    addPatientObservation(item) {
      this.show_add_observation_dialog = true
      this.show_add_observation_dialog_item = item
    },

    addObservation(item) {
      const OBS = {
        VALTYPE_CD: item.VALTYPE_CD,
        CONCEPT_CD: item.CONCEPT_CD,
        UNIT_CD: item.UNIT_CD,
        START_DATE: datenow_isostring(),
        CONCEPT_NAME_CHAR: item.NAME_CHAR,
        PATIENT_NUM: this.show_add_observation_dialog_item.PATIENT_NUM,
        _changed: true
      }

      if (this.show_add_observation_dialog_item && this.show_add_observation_dialog_item.OBSERVATIONS && this.show_add_observation_dialog_item.OBSERVATIONS.length > 0) {
        let lastElement = this.show_add_observation_dialog_item.OBSERVATIONS[this.show_add_observation_dialog_item.OBSERVATIONS.length-1]
        if (lastElement) {
          OBS.START_DATE = lastElement.START_DATE
          OBS.PROVIDER_ID = lastElement.PROVIDER_ID
          OBS.ENCOUNTER_NUM = lastElement.ENCOUNTER_NUM
        }

      }

      this.show_add_observation_dialog_item.OBSERVATIONS.push(OBS)
      this.show_add_observation_dialog = false
      this.show_add_observation_dialog_item = undefined
      this.addConcept(item)
    },

  editPatientObservation(PATIENT, OBS) {
    OBS._uid = uuidv4() //vergebe eine UUID um den Eintrag spaeter wieder zufinden
    this.show_edit_observation_item = {PATIENT: PATIENT, OBSERVATION: OBS}
    this.show_edit_observation_dialog = true
  },

  saveEditedObservation(val) {
    if (!val) return
    let obj_patient = this.PATIENTS.find(el => el.PATIENT_CD === val.PATIENT.PATIENT_CD)
    if (obj_patient) {
      let obj_obs = obj_patient.OBSERVATIONS.find(el => el._uid === val.OBSERVATION._uid)
      if (obj_obs) {
        if (val.OBSERVATION.NVAL_NUM) obj_obs.NVAL_NUM = val.OBSERVATION.NVAL_NUM
        if (val.OBSERVATION.CATEGORY_CHAR) obj_obs.CATEGORY_CHAR = val.OBSERVATION.CATEGORY_CHAR
        if (val.OBSERVATION.TVAL_CHAR) obj_obs.TVAL_CHAR = val.OBSERVATION.TVAL_CHAR
        if (val.OBSERVATION.TVAL_RESOLVED) obj_obs.TVAL_RESOLVED = val.OBSERVATION.TVAL_RESOLVED
        if (val.OBSERVATION.OBSERVATION_BLOB) obj_obs.OBSERVATION_BLOB = val.OBSERVATION.OBSERVATION_BLOB
        if (val.OBSERVATION.LOCATION_CD) obj_obs.LOCATION_CD = val.OBSERVATION.LOCATION_CD
        if (val.OBSERVATION.START_DATE) obj_obs.START_DATE = val.OBSERVATION.START_DATE
        if (val.OBSERVATION.ENCOUNTER_NUM) obj_obs.ENCOUNTER_NUM = val.OBSERVATION.ENCOUNTER_NUM
        obj_obs._changed = true
      }
    }
    
    console.log(obj_patient)
    this.show_edit_observation_dialog = false
    this.show_edit_observation_item = undefined
    this.something_changed = true
    this.session_changed = true
  },

  deleteEditedObservation(val) {
    if (!val) return
    let obj_patient = this.PATIENTS.find(el => el.PATIENT_CD === val.PATIENT.PATIENT_CD)
    if (obj_patient) {
      let obj_obs = obj_patient.OBSERVATIONS.find(el => el._uid === val.OBSERVATION._uid)
      obj_obs._deleted = true
    }
    this.show_edit_observation_dialog = false
    this.show_edit_observation_item = undefined
    this.something_changed = true
    this.session_changed = true
  }




  }

}
</script>
