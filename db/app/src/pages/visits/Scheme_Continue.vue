<template>
  <q-page>
    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Scheme fortsetzen'" :img="'general_icon.png'" :icon="'event'" />
      </template>
      <!-- MAIN -->
      <template v-slot:main>
        <!-- ALLGEMEIN -->
        <OBSERVATION_TABLE_SHORT @changed="(localGlobalData = $event); changeDetected = true" />

        <div v-if="!active_scheme.resolved">
          <!-- AUSWAHL BUTTON -->
          <q-card class="my-list-item">
            <q-card-section>
              <q-table dense :rows="option_schemes" :columns="option_columns" title="Scheme auswählen">
                <!-- OPTIONS -->
                <template v-slot:top-right>
                  <FILTER_BOX :filter="filter" @update="filter = $event" />
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props" class="cursor-pointer" @click="onSelectScheme(props.row)">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                      {{ col.value }}
                    </q-td>
                    <q-td auto-width>
                      <q-btn size="sm" round flat dense icon="folder" />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <!-- ANZEIGE INHALT -->
        <div v-if="active_scheme.resolved" class="q-mt-md">

          <!-- ITEMS -->
          <SCHEME_TABLE_NEW :scheme="active_scheme" @changed="(localFormData = $event); changeDetected = true" />

        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_save="(changeDetected && localFormData.length > 0 && localGlobalData)"
          @save="saveScheme()" :show_back="true" @back="$router.go(-1)" />
      </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import OBSERVATION_TABLE_SHORT from 'src/components/ObservationTable_short.vue'
import SCHEME_TABLE_NEW from 'src/components/SchemeTableNew.vue'
import MainSlot from 'src/components/MainSlot.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
  name: 'Scheme_Continue',

  components: { HEADING, OBSERVATION_TABLE_SHORT, BOTTOM_BUTTONS, SCHEME_TABLE_NEW, MainSlot, FILTER_BOX },

  data() {
    return {
      option_schemes: [],
      changeDetected: false,
      active_scheme: {},
      localGlobalData: {},
      localFormData: [],
      filter: null,
      option_columns: [
        { name: 'CODE_CD', field: 'CODE_CD', label: 'ID', sortable: true, align: 'left', style: 'max-width: 150px; overflow: hidden' },
        { name: 'NAME_CHAR', field: 'NAME_CHAR', label: 'Beschr.', sortable: true, align: 'left', style: 'max-width: 250px; overflow: hidden' },
      ]

    }
  },

  // components: {VISIT_CARD_NOEDIT },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    //LOAD THE SCHEMES
    this.$store.dispatch('searchDB', { query_string: { COLUMN_CD: 'SCHEME_CD' }, table: 'CODE_LOOKUP' })
      .then(res => {
        this.option_schemes = res
      })
    //ÜBERNEHME EINIGE GLOBALE DATEN
    if (this.VISIT.LOCATION_CD) this.localGlobalData.LOCATION_CD = this.VISIT.LOCATION_CD
    if (this.VISIT.START_DATE) this.localGlobalData.START_DATE = this.VISIT.START_DATE
    if (this.VISIT.END_DATE) this.localGlobalData.END_DATE = this.VISIT.END_DATE
  },

  computed: {
    SCHEME() {
      if (!this.active_scheme) return undefined
      const json = this.active_scheme.LOOKUP_BLOB.replace(/'/g, "\"")
      return JSON.parse(json)
    },

    VISIT() {
      if (!this.$store.getters.VISIT_PINNED) return {}
      else return this.$store.getters.VISIT_PINNED
    }
  },

  methods: {
    async onSelectScheme(el) {
      this.$store.commit('LOG', { method: 'SchemeEdit->onSelectScheme' })
      if (!this.$store.getters.VISIT_PINNED) return this.$q.notify('Keine Visite ausgewählt')
      let res = await this.$store.dispatch('obs_schemeResolve', { CODE_CD: el.CODE_CD })
      if (res) {
        //fill data
        let resolved_obs = await this.loadObservations(this.$store.getters.VISIT_PINNED, res)
        this.active_scheme = { scheme: el, resolved: resolved_obs }
      }
    },

    async loadObservations(VISIT, RESOLVED) {
      const OBSERVATIONS = []
      if (!VISIT) return OBSERVATIONS
      const obs = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { ENCOUNTER_NUM: VISIT.ENCOUNTER_NUM } })
      if (obs.length === 0) return OBSERVATIONS
      for (let r of RESOLVED) {
        let obj = obs.find(el => el.CONCEPT_CD === r.CONCEPT_CD)
        if (obj) {
          //diese Felder werden jetzt übernommen
          r.OBSERVATION_ID = obj.OBSERVATION_ID
          if (obj.NVAL_NUM) r.NVAL_NUM = obj.NVAL_NUM
          if (obj.TVAL_CHAR) r.TVAL_CHAR = obj.TVAL_CHAR
          if (obj.UNIT_CD) r.UNIT_CD = obj.UNIT_CD
          if (obj.OBSERVATION_BLOB) r.OBSERVATION_BLOB = obj.OBSERVATION_BLOB
        }
        //wird auf jeden fall zur Ausgabe hinzugefuegt!
        OBSERVATIONS.push(r)
      }
      return OBSERVATIONS
    },

    //this will merge the data
    async saveScheme() {
      // this.$store.commit('LOG', {method: 'SchemeEdit->saveScheme', data: {global: this.localGlobalData, form: this.localFormData}})
      if (!this.localFormData || !this.localGlobalData) return this.$q.notify('Daten sind leer')
      if (!this.$store.getters.VISIT_PINNED) return this.$q.notify('Keine Visite ausgewählt!')
      if (!this.$store.getters.PATIENT_PINNED) return this.$q.notify('Kein Patient ausgewählt!')
      //first check the data
      //check globalData
      if (!this._checkFormData(this.localGlobalData, ['PROVIDER_ID', 'LOCATION_CD', 'START_DATE'])) {
        var missing_data = []
        if (!this.localGlobalData.PROVIDER_ID) missing_data.push('Untersucher')
        if (!this.localGlobalData.LOCATION_CD) missing_data.push('Untersuchungsort')
        if (!this.localGlobalData.START_DATE) missing_data.push('Datum der Untersuchung')
        this.$q.notify('Allgemeine Daten sind nicht vollständig: ' + missing_data.join(','))
        return
      }
      // checke lokale Daten
      let error_found = false
      this.localFormData.forEach(f => {
        if (f.VALTYPE_CD === 'N' && (f.NVAL_NUM === undefined || f.NVAL_NUM === null)) error_found = true
        else if (f.VALTYPE_CD !== 'N' && (f.TVAL_CHAR === undefined || f.TVAL_CHAR === null)) error_found = true
      })
      if (error_found) {
        if (!confirm('Einträge nicht vollständig, wirklich fortfahren?')) return
      }

      // prepare clean data
      const DATA_CLEAN = []
      this.localFormData.forEach(d => {
        let temp = JSON.parse(JSON.stringify(d))
        console.log(d)
        // fill Allgemeine Daten
        temp.LOCATION_CD = this._get_value(this.localGlobalData.LOCATION_CD)
        temp.PROVIDER_ID = this._get_value(this.localGlobalData.PROVIDER_ID)
        temp.ENCOUNTER_NUM = this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM
        temp.PATIENT_NUM = this.$store.getters.PATIENT_PINNED.PATIENT_NUM
        temp.START_DATE = this.localGlobalData.START_DATE
        if (this.localGlobalData.END_DATE) temp.END_DATE = this.localGlobalData.END_DATE

        // checke jetzt die Daten
        let valid_data_found = false
        if (temp.VALTYPE_CD === 'N' && temp.NVAL_NUM !== undefined && temp.NVAL_NUM !== null) valid_data_found = true
        else if (temp.TVAL_CHAR !== undefined && temp.TVAL_CHAR !== null) valid_data_found = true
        if (valid_data_found) {
          if (temp.VALTYPE_CD === 'N') DATA_CLEAN.push(temp)
          else if (!Array.isArray(temp.TVAL_CHAR)) {
            temp.TVAL_CHAR = this._get_value(temp.TVAL_CHAR)
            DATA_CLEAN.push(temp)
          } else if (Array.isArray(temp.TVAL_CHAR)) {
            temp.TVAL_CHAR.forEach(t => {
              const temp2 = JSON.parse(JSON.stringify(temp))
              temp2.TVAL_CHAR = this._get_value(t)
              DATA_CLEAN.push(temp2)
            })
          }
        }
      })

      // daten sollten jtzt in einem schönen format vorliegen, ich entferne aber noch allen mist
      DATA_CLEAN.forEach(d => {
        Object.keys(d).forEach(k => {
          if (d[k] === null) delete d[k]
        })
        if (d.check) delete d.check
        if (d.selection) delete d.selection
      })

      const errors = []
      try {
        for (let data of DATA_CLEAN) {
          if (!data.OBSERVATION_ID) {
            let res = await this.$store.dispatch('addDB', { query_string: data, table: "OBSERVATION_FACT" })
            // update jetzt die daten
            let obj = this.localFormData.find(el => el.CONCEPT_CD === data.CONCEPT_CD)
            obj.OBSERVATION_ID = res.OBSERVATION_ID
          }
          else {
            // update
            let WHERE = { OBSERVATION_ID: data.OBSERVATION_ID }
            let SET = data
            delete SET.OBSERVATION_ID
            let res = await this.$store.dispatch('updateDB', { table: 'OBSERVATION_FACT', query_string: { where: WHERE, set: SET } })
          }
        }
        this.$q.notify('Aktion erfolgreich')
        this.changeDetected = false
      } catch (err) {
        console.error(err)
        this.$q.notify(err.message)
      }

    },

    _get_value(val) {
      if (typeof (val) === 'object') return val.value
      else return val
    },

    _checkFormData(data, fields) {
      if (!data || !fields) return false
      for (let i = 0; i < fields.length; i++) {
        if (data[fields[i]] === undefined) return false
      }
      return true
    },

    // // FOR TESTING ONLY
    // loadMockData() {
    //   console.log('loadMockData')
    //   const data = {"global":{"LOCATION_CD":{"label":"PRIVATE ADRESS","value":"27a9fea6-81b4-4b48-b383-3c1938e08610"},"START_DATE":"2022-12-10","END_DATE":"2022-12-09","PROVIDER_ID":"s02840"},"form":[{"CONCEPT_CD":"LID: 63900-5","NAME_CHAR":"Age","VALTYPE_CD":"N","UNIT_CD":"years","TVAL_CHAR":null,"NVAL_NUM":"1","OBSERVATION_BLOB":null},{"CONCEPT_CD":"LID: 46463-6","NAME_CHAR":"Race or Ethnicity ","VALTYPE_CD":"S","UNIT_CD":null,"TVAL_CHAR":{"label":"White","value":"LID: LA4457-3"},"NVAL_NUM":null,"OBSERVATION_BLOB":"nothin"},{"MODIFIER_CD":"SCTID: 447634004","NAME_CHAR":"ICD-10 Diagnose","VALTYPE_CD":null,"UNIT_CD":null,"TVAL_CHAR":[{"label":"Mild cognitive disorder","value":"ICD10: F06.7"},{"label":"Hypertensive heart disease with (congestive) heart failure","value":"ICD10: I11.0"}],"NVAL_NUM":null,"OBSERVATION_BLOB":null}]}
    //   this.localFormData = data.form
    //   this.localGlobalData = data.global
    // }

    /**
     * IMPORTED from MIXINS
     * - deleteData(item)
     */


  }

}
</script>
