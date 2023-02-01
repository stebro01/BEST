<template>
        <!-- results -->

    <div class="col-12 row justify-center" v-if="obs !== undefined">
    <q-card class="my-card">
      <q-card-section class="text-h6">Neue Untersuchung hinzufügen</q-card-section>
      <q-card-section>
        <q-markup-table  flat bordered>
          <tbody>
            <!-- DATUM -->
            <tr>
              <td>Datum:</td>
              <td colspan="2">von: <q-btn :class="{'bg-red-3': obs.START_DATE === undefined || obs.START_DATE === ''}">{{ obs.START_DATE }}
              <q-popup-edit v-model="obs.START_DATE" auto-save v-slot="scope">
                <q-input v-model="scope.value" type="date" dense autofocus counter @keyup.enter="scope.set" @blur="dataChanged()"/>
              </q-popup-edit>
            </q-btn>
              bis: <q-btn>{{ obs.END_DATE }}
              <q-popup-edit v-model="obs.END_DATE" auto-save v-slot="scope">
                <q-input v-model="scope.value" type="date" dense autofocus counter @keyup.enter="scope.set" @blur="dataChanged()"/>
              </q-popup-edit>
            </q-btn></td>
            </tr>
            <!-- Untersucher -->
            <tr>
              <td>Untersucher</td>
              <td class="text-center" colspan="2">
                <span v-if="obs.PROVIDER_ID">
                <VALUE_ITEM  :item="obs.PROVIDER_ID" />
                <q-btn round flat size="xs" icon="clear" @click="obs.PROVIDER_ID = undefined; dataChanged()"/>
              </span>
                <span v-else>
                <q-btn :class="{'bg-red-3': obs.PROVIDER_ID === undefined || obs.PROVIDER_ID === ''}" @click="show_provider_dialog=true">...</q-btn>
              </span>
              </td>
            </tr>
             <!-- Ort -->
             <tr>
              <td>Ort</td>
              <td class="text-center" colspan="2">
                <span v-if="obs.LOCATION_CD">
                <VALUE_ITEM  :item="obs.LOCATION_CD" />
                <q-btn round flat size="xs" icon="clear" @click="obs.LOCATION_CD = undefined; dataChanged()"/>
              </span>
                <span v-else>
                <q-btn :class="{'bg-red-3': obs.LOCATION_CD === undefined || obs.LOCATION_CD === ''}" @click="show_location_dialog=true">...</q-btn>
              </span>
                
                </td>
            </tr>
            <!-- Untersuchung -->
            <tr>
              <td>Untersuchung</td>
              <td class="text-center" colspan="2">
                <span v-if="obs.CONCEPT_CD">
                <VALUE_ITEM  :item="obs.CONCEPT_CD" />
                <q-btn v-if="obs.CONCEPT_CD" round flat size="xs" icon="clear" @click=" obs.CONCEPT_CD = undefined; obs.UNIT_CD = undefined; obs.TVAL_CHAR = undefined; obs.NVAL_NUM = undefined; obs.VALTYPE_CD = undefined; options_concept_selection = []; dataChanged();"/>
              </span>
                <span v-else>
                <q-btn :class="{'bg-red-3': obs.CONCEPT_CD === undefined || obs.CONCEPT_CD === ''}" @click="showConceptDialog('CONCEPT_DIMENSION')">...</q-btn>
              </span>
                                
              </td>
            </tr>
            <!-- WERT -->
            <tr v-if="obs.CONCEPT_CD">
              <td>Wert</td>
              <td v-if="obs.VALTYPE_CD === 'N'" colspan="2"><q-input dense v-model="obs.NVAL_NUM" type="number" @blur="dataChanged()"/>{{ obs.UNIT_CD }}</td>
              <td v-else-if="obs.VALTYPE_CD === 'T'" colspan="2"><q-input dense v-model="obs.TVAL_CHAR" @blur="dataChanged()" />{{ obs.UNIT_CD }}</td>
              <td v-else-if="options_concept_selection">
                <q-option-group
                  v-model="obs.TVAL_CHAR"
                  :options="options_concept_selection"
                  @update:model-value="dataChanged()"
                />
              </td>
            </tr>
            <!-- BESCHREIBUNG -->
            <tr >
              <td>Beschreibung</td>
              <td colspan="2"><q-input dense v-model="obs.OBSERVATION_BLOB" @blur="dataChanged()"></q-input></td>
            </tr>
          </tbody>
        </q-markup-table>
        </q-card-section>
       
    </q-card>
  

   

    <!-- CONCEPT DIALOG -->
    <q-dialog v-model="show_concept_dialog" style="max-height: 100%">
      <CONCEPT_SELECTION @close="(show_concept_dialog = false); show_concept_dialog_table = undefined" @clear="clearConcept()" @clicked="conceptSelected($event)" :table="show_concept_dialog_table" :CONCEPT_CD="obs.CONCEPT_CD"/>>
    </q-dialog>

    <!-- DIALOG LOCATION -->
    <SELECT_LIST v-if="show_location_dialog" :active="show_location_dialog" @close="show_location_dialog = false" :title="'Ort auswählen'" :list="options_location" @save="selectLocation($event)"/>
    <SELECT_LIST v-if="show_provider_dialog" :active="show_provider_dialog" @close="show_provider_dialog = false" :title="'Untersucher auswählen'" :list="options_provider" @save="selectProvider($event)"/>

    <!-- SURVEY -->
    <div v-if="obs && obs.CATEGORY_CHAR==='quest_surveyBEST'">
      <q-markup-table flat bordered dense class="my-table" v-html="obs.TVAL_CHAR"></q-markup-table>
    </div>



  </div>

</template>


<script>

import VALUE_ITEM from 'src/components/elements/ValueItem.vue'
import CONCEPT_SELECTION from 'src/components/elements/ConceptSelect.vue'
import SELECT_LIST from 'src/components/elements/SelectList.vue'

export default {
    name: 'ObservationEditCard',

    props: ['item', 'import_mode'],

    components: {VALUE_ITEM, CONCEPT_SELECTION, SELECT_LIST},

    data() {
    return {
      obs: undefined,
      data_changed: false,
      options_location: [],
      options_provider: [],
      options_concept_selection: [],
      show_concept_dialog: false,
      show_concept_dialog_table: undefined,
      show_location_dialog: false,
      show_provider_dialog: false
    }},

    mounted() {
      if (!this.item) this.obs = undefined
      else this.loadData()

      if (this.import_mode) this.data_changed = true
      
      
    },
 

    computed: {
     
    },

    methods: {
      dataChanged() {
        this.$emit('change', this.obs)
      },

      loadData() {
        this.obs = JSON.parse(JSON.stringify(this.item))
        // resolve data
        if (this.obs.CONCEPT_CD) this.$store.dispatch('getConceptBy_CONCEPT_CD', this.obs.CONCEPT_CD).then(res => this.obs.CONCEPT_CD = res)
        if (this.obs.TVAL_CHAR) this.$store.dispatch('getConceptBy_CONCEPT_CD', this.obs.TVAL_CHAR).then(res => this.obs.TVAL_CHAR = res)
        if (this.obs.LOCATION_CD) this.$store.dispatch('getLookupBy_CODE_CD', this.obs.LOCATION_CD).then(res => this.obs.LOCATION_CD = res)
        if (this.obs.PROVIDER_ID) this.$store.dispatch('getProviderBy_PROVIDER_ID', this.obs.PROVIDER_ID).then(res => this.obs.PROVIDER_ID = res)

        // PREPARE OPTIONS
        this.options_location = []
        this.$store.dispatch('searchDB', {query_string: {COLUMN_CD: 'LOCATION_CD'}, table: "CODE_LOOKUP"})
        .then(res => res.forEach(r => {
          this.options_location.push({value: r.CODE_CD, label: r.NAME_CHAR})
        }))

        this.options_provider = []
        this.$store.dispatch('searchDB', {query_string: {PROVIDER_PATH: 'U', _like: true}, table: "PROVIDER_DIMENSION"})
        .then(res => res.forEach(r => {
          this.options_provider.push({value: r.PROVIDER_ID, label: r.NAME_CHAR})
        }))
          
        //lode CONCEPT_SELECTION
        this.loadConceptSelection()

        this.data_changed = false
      },


      showConceptDialog(modus) {
        this.show_concept_dialog = true
        this.show_concept_dialog_table = modus
      },

      loadConceptSelection() {
        if (this.obs.VALTYPE_CD === 'S' && this.obs.CONCEPT_CD) {
          this.options_concept_selection = []
          //get concept path
          var CONCEPT_CD = this.obs.CONCEPT_CD
          if (CONCEPT_CD.value) CONCEPT_CD = CONCEPT_CD.value
          this.$store.dispatch('searchDB', {query_string: {"CONCEPT_CD": CONCEPT_CD},table: "CONCEPT_DIMENSION"})
          .then(res => {
            if (res.length > 0) this.$store.dispatch('getConceptList', `${res[0].CONCEPT_PATH}\\LA`).then(res => this.options_concept_selection = res)
          })
        } else if (this.obs.VALTYPE_CD === 'F' && this.obs.CONCEPT_CD) this.$store.dispatch('getConceptList', '\\SNOMED-CT\\362981000\\260245000\\').then(res => this.options_concept_selection = res)
          
      },


      clearConcept() {
        if (this.show_concept_dialog_table === 'CONCEPT_DIMENSION') this.obs.CONCEPT_CD = null
        if (this.show_concept_dialog_table === 'MODIFIER_DIMENSION') this.obs.MODIFIER_CD = null
        this.obs.VALTYPE_CD = null
        this.obs.NVAL_NUM = null
        this.obs.TVAL_CHAR = null

        this.show_concept_dialog = false
        this.show_concept_dialog_table = undefined
        this.data_changed = true
      },

      conceptSelected(item) {
        this.show_concept_dialog = false
        this.show_concept_dialog_table = undefined

        if (item.CONCEPT_CD) {
          this.obs.CONCEPT_CD =  {value: item.CONCEPT_CD, label: item.NAME_CHAR}
          this.obs.MODIFIER_CD = null
          this.obs.VALTYPE_CD = item.VALTYPE_CD
          this.obs.UNIT_CD = item.UNIT_CD
          this.obs.SOURCESYSTEM_CD = item.SOURCESYSTEM_CD
          this.obs.TVAL_CHAR = null
          this.obs.NVAL_NUM = null
          this.dataChanged()
        } 
        else this.$q.notify('unexpected result')

        if (this.obs.VALTYPE_CD) this.loadConceptSelection()
        this.data_changed = true
      },

      selectLocation(item) {
        if (item) {
          this.obs.LOCATION_CD = item
          this.dataChanged()
        }
        this.show_location_dialog = false
      },

      selectProvider(item) {
        if (item) {
          this.obs.PROVIDER_ID = item
          this.dataChanged()
        }
        this.show_provider_dialog = false
      }


      /**
       * IMPORTED from MIXINS
       * - notPrimaryKey(el)
       * - typeOfEl(el) 
       * - isResolveScheme(el)
       * - getResolvedValue(element, value)
       * - deleteData(item)
       */

    
    }


}
</script>
<style>
h1 {
  font-size: 1.3em;
}

h2 {
  font-size: 1.2em;
}
</style>