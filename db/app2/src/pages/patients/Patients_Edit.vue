<template>
  <q-page>
    <MainSlot :no_options="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'Patient'" :description="'bearbeiten'" :img="'patient-color-logo.png'" :icon="'person'"/>
    </template>

    <!-- MAIN -->
      <template v-slot:main>
    <div v-if="patient !== undefined" >
      <q-markup-table flat bordered dense class="my-table">
      
      <tbody class="">
          <tr v-for="(el, ind) in Object.keys(PATIENT_DATA)" :key="ind+ 'patient'">
            <td class="text-left">
              <q-icon v-if="el === 'PATIENT_CD'" name="info" class="q-mr-xs"><q-tooltip>Eindeutiger Code zum Identifizieren des Patienten, z.B. Hospital-ID / SAP ID</q-tooltip></q-icon>
              <span v-if="RELABEL[el]">{{RELABEL[el]}}<q-tooltip>{{el}}</q-tooltip></span>
              <span v-else>{{el}}</span>
             
            </td>
            <td class="text-center bg-grey-3" >
              <span v-if="PATIENT_DATA[el] && PATIENT_DATA[el].label">{{PATIENT_DATA[el].label}}</span>
              <span v-else>{{PATIENT_DATA[el]}}</span>
            </td>

            <!-- EDIT -->
            <td>
               <!-- TEXTEDIT -->
              <span v-if="['PATIENT_BLOB', 'STATECITYZIP_PATH', 'PATIENT_CD'].includes(el)" class="cursor-pointer"><q-icon class="q-ml-sm" size="xs" name="edit" />
                 <q-popup-edit v-model="this.patient[el]" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <!-- NUMBER -->
              <span v-if="['AGE_IN_YEARS'].includes(el)" class="cursor-pointer"><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="this.patient[el]" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="number" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <!-- DATE -->
              <span v-if="['BIRTH_DATE', 'DEATH_DATE'].includes(el)" class="cursor-pointer"><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="this.patient[el]" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <!-- SELECT -->
              <span v-if="['VITAL_STATUS_CD', 'SEX_CD', 'LANGUAGE_CD', 'RACE_CD', 'MARITAL_STATUS_CD', 'SOURCESYSTEM_CD', 'RELIGION_CD'].includes(el) && options[el]" class="cursor-pointer">
                  <q-icon size="xs" name="edit" class="" />
                  <q-popup-edit v-model="this.patient[el]" buttons v-slot="scope">
                    <q-select dense v-model="scope.value" :options="options[el]" @blur="dataChanged()" @change="dataChanged()"/>
                  </q-popup-edit>
                  
              </span>
              <span v-if="['VITAL_STATUS_CD', 'LANGUAGE_CD', 'RACE_CD', 'MARITAL_STATUS_CD', 'RELIGION_CD'].includes(el) && this.patient[el]">
                <q-icon class="absolute-right q-mt-xs cursor-pointer" size="xs" name="delete" @click="this.patient[el] = null; dataChanged()" />
              </span>
            </td>
          </tr>
      </tbody>
    </q-markup-table>

    <div class="q-mt-xl">
          <q-btn-dropdown v-if="MORE_PROPS && MORE_PROPS.length > 0" color="primary" label="Mehr Eigenschaften">
          <q-list>
            <q-item v-for="(el, ind) in MORE_PROPS" :key="ind+'props'"
              clickable v-close-popup @click="onMorePropsClick(el)">
              <q-item-section>
                <q-item-label>{{el.label}}</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>

       <div>
        <!-- TABELE MIT ADD DATA -->
           <q-markup-table>
              <thead>
                <tr>
                  <th class="text-center">Details</th>
                  <th class="text-center">Wert</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(el, ind) in MORE_PROPS_SELECTED" :key="ind+'moreprops'">
                  <td class="text-center">{{el.label}} <q-tooltip>{{el.value}}</q-tooltip></td>
                  <td class="text-center">{{el.data}}
                    <span  class="cursor-pointer"><q-icon class="q-ml-sm" size="xs" name="edit" />
                      <q-popup-edit v-model="el.data" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                      </q-popup-edit>
                    </span>
                  </td>
                </tr>
              </tbody>
           </q-markup-table>
       </div>

    </div>

    </div>
    </template>

    <!-- FOOTER -->
    <template v-slot:footer>
    <BOTTOM_BUTTONS  
      :show_save="change_detected" :show_back="true"
      @save="saveEntry()" @back="$router.go(-1)"
    />
    </template>

  </MainSlot>
  </q-page>
</template>

<script>

import {SCHEME_PATIENT_DIMENSION} from 'src/classes/Scheme_patient_dimension'
import {beautify_data} from 'src/tools/formatdata'
import HEADING from 'src/components/elements/Heading.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'Patients_Edit',
  components: {BOTTOM_BUTTONS, HEADING, MainSlot},
  data() {
    return {
      patient: [],
      options: {},
      change_detected: false, 
      SCHEME_PATIENT_DIMENSION: SCHEME_PATIENT_DIMENSION,
      RELABEL: {PATIENT_CD: 'Code', SEX_CD: 'Geschlecht', BIRTH_DATE: 'Geb.Datum', DEATH_DATE: 'Todesdatum', VITAL_STATUS_CD: 'Vitalstatus', AGE_IN_YEARS: 'Alter', LANGUAGE_CD: 'Sprache', RACE_CD: 'Ethnische Herkunft', MARITAL_STATUS_CD: 'Status', RELIGION_CD: 'Religion', STATECITYZIP_PATH: 'PLZ', PATIENT_BLOB: 'Beschreibung', SOURCESYSTEM_CD: 'Codierung'},
      MORE_PROPS: [{label: 'Name', value: 'SCTID: 371484003', data: undefined}, {label: 'Adresse', value: 'SCTID: 397635003', data: undefined}, {label: 'Hospital ID', value: 'SCTID: 184107009', data: undefined}],
      MORE_PROPS_SELECTED: [], 
      HIDDEN_ENCOUNTER: undefined
    }
  },

  mounted() {
    this.reloadEntry()    

    this.$store.dispatch('getConceptList', '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA').then(res => this.options.SEX_CD = res)
    this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\46463-6\\LA').then(res => this.options.RACE_CD = res)
    this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.PATIENT.DEMOG\\Patient\\45404-1\\LA').then(res => this.options.MARITAL_STATUS_CD = res)
    this.$store.dispatch('getConceptList', '\\CONCEPT\\LA').then(res => this.options.SOURCESYSTEM_CD = res)
    this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\54505-3\\LA\\').then(res => this.options.LANGUAGE_CD = res)
    this.$store.dispatch('getConceptList', '\\SNOMED-CT\\160538000\\LA').then(res => this.options.RELIGION_CD = res)
    this.$store.dispatch('getConceptList', '\\SNOMED-CT\\365860008\\LA').then(res => this.options.VITAL_STATUS_CD = res)
    
  },

  computed: {

    PATIENT_DATA() {
      if (!this.patient) return undefined
      const ptemp = {}
      Object.keys(this.patient).forEach(p => {
        if (p !== 'PATIENT_NUM' && !this.SCHEME_PATIENT_DIMENSION._PRIVATE.includes(p)) ptemp[p] = this.patient[p]
      })
      return ptemp
    }
  },

  methods: {
      reloadEntry() {
        if (this.$route.params.PATIENT_NUM) this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: this.$route.params.PATIENT_NUM}, table: 'PATIENT_DIMENSION'})
            .then(res => {
              this.patient = res[0]
              this.$store.commit('PATIENT_PINNED_SET', this.patient)
              //resolve values
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.RACE_CD).then(res => this.patient.RACE_CD = res)
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.MARITAL_STATUS_CD).then(res => this.patient.MARITAL_STATUS_CD = res)
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.SEX_CD).then(res => this.patient.SEX_CD = res)
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.LANGUAGE_CD).then(res => this.patient.LANGUAGE_CD = res)
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.RELIGION_CD).then(res => this.patient.RELIGION_CD = res)
              this.$store.dispatch('getConceptBy_CONCEPT_CD', this.patient.VITAL_STATUS_CD).then(res => this.patient.VITAL_STATUS_CD = res)
            })

        if (this.$route.params.PATIENT_NUM) {
          this.MORE_PROPS.forEach(el => {
            this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: this.$route.params.PATIENT_NUM, CONCEPT_CD: el.value}, table: 'OBSERVATION_FACT'})
            .then(res => {
              if (res.length > 0) {
                let item = {value: el.value, label: el.label, data: res[0].TVAL_CHAR}
                this.MORE_PROPS_SELECTED.push(item)
                var index = this.MORE_PROPS.findIndex(item => item.value === el.value);
                this.MORE_PROPS.splice(index,1)
              }
            })
          })
        }
        this.change_detected = false
      },

      saveEntry() {
        if (!this.patient) return

        const data = beautify_data(this.patient)
        const PATIENT_NUM = data.PATIENT_NUM
        delete data.PATIENT_NUM

        //SPEICHERE zunächst den Patienten
        this.$store.dispatch('updateDB', {query_string: {where: {PATIENT_NUM: PATIENT_NUM}, set: data}, table:"PATIENT_DIMENSION"})
        .then(res => this.$q.notify('speichern erfolgreich'))
        .catch(err =>{
          let msg = err
          if (err === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: PATIENT_DIMENSION.PATIENT_CD') msg = 'Fehler: Patient Code bereits vergeben!'
          this.$q.notify({message: msg, timeout: 5000 })
        })

        //dann speichere die OBSERVATION
        if (this.MORE_PROPS_SELECTED.length === 0) {}
        else {
          this.MORE_PROPS_SELECTED.forEach(el => {
            if (el.data !== undefined && el.data !== null && el.data !== '') {
              //gibt es den Eintrag schon?
              this.$store.dispatch('searchDB', {query_string: {PATIENT_NUM: this.$route.params.PATIENT_NUM, CONCEPT_CD: el.value}, table: 'OBSERVATION_FACT'})
              .then(res => {
                if (res.length >0 ) this.$store.dispatch('updateDB', {query_string: {set: {TVAL_CHAR: el.data}, where: {OBSERVATION_ID: res[0].OBSERVATION_ID}}, table: 'OBSERVATION_FACT'})
                
                else {
                  //erste eine Visite erzeugen: 
                  if (!this.HIDDEN_ENCOUNTER) this.$store.dispatch('addDB', {query_string: {PATIENT_NUM: this.$route.params.PATIENT_NUM, VISIT_BLOB: this.$store.getters.SYSTEM_ID}, table: 'VISIT_DIMENSION'})
                  .then(res2 => {
                    this.HIDDEN_ENCOUNTER = res2.ENCOUNTER_NUM
                    this.$store.dispatch('addDB', {query_string: {ENCOUNTER_NUM: res2.ENCOUNTER_NUM, PATIENT_NUM: this.$route.params.PATIENT_NUM, PROVIDER_ID: this.$store.getters.SYSTEM_ID , CONCEPT_CD: el.value, TVAL_CHAR: el.data, OBSERVATION_BLOB: '<SPECIFIC PATIENT DATA>'}, table: 'OBSERVATION_FACT'})
                  })
                  else this.$store.dispatch('addDB', {query_string: {ENCOUNTER_NUM: this.HIDDEN_ENCOUNTER, PATIENT_NUM: this.$route.params.PATIENT_NUM, PROVIDER_ID: this.$store.getters.SYSTEM_ID , CONCEPT_CD: el.value, TVAL_CHAR: el.data, OBSERVATION_BLOB: '<SPECIFIC PATIENT DATA>'}, table: 'OBSERVATION_FACT'})

                }
              })
            }
          })
        }

        this.change_detected = false
      },

      dataChanged() {
          this.change_detected = true
      },

      onMorePropsClick(el) {
        this.MORE_PROPS_SELECTED.push(JSON.parse(JSON.stringify(el)))
        //no remove the object
        var index = this.MORE_PROPS.findIndex(item => item.value === el.value);
        this.MORE_PROPS.splice(index,1)
      }

  }

}
</script>
