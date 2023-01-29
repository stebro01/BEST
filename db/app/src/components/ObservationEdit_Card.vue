<template>
        <!-- results -->
    <div v-if="obs !== undefined" class="q-mt-xl">
      <q-markup-table flat bordered dense class="my-table q-mt-lg">
      <thead >
        <tr >
          <th class="text-center">ID</th>
          <th class="text-center">{{obs.OBSERVATION_ID}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="text-weight-regular">
         <!-- DATUM -->
        <tr>
          <td class="text-center">Datum</td>
          <td class="bg-grey-3 text-center">{{obs.START_DATE}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="obs.START_DATE" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
          </td>
        </tr>
        <!-- ENDDATUM -->
        <tr>
          <td class="text-center">Ende</td>
          <td class="bg-grey-3 text-center">{{obs.END_DATE}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="obs.END_DATE" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
          </td>
        </tr>

        <!-- LOCATION_CD -->
        <tr>
          <td class="text-center">Ort</td>
          <td class="bg-grey-3 text-center"><VALUE_ITEM :item="obs.LOCATION_CD"/></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.LOCATION_CD" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_location" @blur="dataChanged()" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- PROVIDER_ID -->
        <tr>
          <td class="text-center">Untersucher</td>
          <td class="bg-grey-3 text-center"><VALUE_ITEM :item="obs.PROVIDER_ID" /></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.PROVIDER_ID" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_provider" @blur="dataChanged()" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
        
        <!-- Kategorie -->
        <tr>
          <td class="text-center">Kategorie</td>
          <td class="bg-grey-3 text-center">{{obs.CATEGORY_CHAR}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.CATEGORY_CHAR" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- BESCHREIBUNG -->
        <tr >
          <td class="text-center">Beschreibung</td>
          <td class="bg-grey-3 text-center overflow-hidden" style="max-width: 300px">{{obs.OBSERVATION_BLOB}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.OBSERVATION_BLOB" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- Konzept -->
        <tr>
          <td class="text-center">Konzept</td>
          <td class="bg-blue-2 text-center"><VALUE_ITEM :item="obs.CONCEPT_CD" /></td>
          <td class="cursor-pointer" @click="showConceptDialog('CONCEPT_DIMENSION')"><q-icon size="xs" name="edit" /></td>
        </tr>

        <!-- MODIFIER_CD -->
        <tr v-if="obs.CONCEPT_CD === undefined || obs.CONCEPT_CD === null">
          <td class="text-center">Modifier</td>
          <td class="bg-blue-2 text-center"><VALUE_ITEM :item="obs.MODIFIER_CD" /></td>
          <td class="cursor-pointer" @click="showConceptDialog('MODIFIER_DIMENSION')"><q-icon size="xs" name="edit" /></td>
        </tr>

        <!-- TVAL_CHAR => SELECTION -->
        <tr v-if="obs.VALTYPE_CD === 'S' || obs.VALTYPE_CD === 'F'">
          <td class="text-center">Wert (Type: {{obs.VALTYPE_CD}})</td>
          <td td class="text-center overflow-hidden" style="max-width: 300px" :class="{'bg-red-1': obs.TVAL_CHAR === null }"><VALUE_ITEM :item="obs.TVAL_CHAR"/></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.TVAL_CHAR" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_concept_selection" @blur="dataChanged()" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- TVAL_CHAR => Text -->
        <tr v-if="obs.VALTYPE_CD === 'T'">
          <td class="text-center">Wert (Type: {{obs.VALTYPE_CD}})</td>
          <td class="bg-grey-2 text-center"><VALUE_ITEM :item="obs.TVAL_CHAR"/></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.TVAL_CHAR" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- TVAL_CHAR => Date -->
        <tr v-if="obs.VALTYPE_CD === 'D'">
          <td class="text-center">Wert (Type: {{obs.VALTYPE_CD}})</td>
          <td class="bg-grey-2 text-center"><VALUE_ITEM :item="obs.TVAL_CHAR"/></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.TVAL_CHAR" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>

        <!-- NVAL_NUM -->
        <tr v-if="obs.VALTYPE_CD === 'N' || obs.CATEGORY_CHAR === 'quest_surveyBEST'">
          <td class="text-center">Wert (Zahl)</td>
          <td class="text-center" :class="{'bg-red-1': obs.NVAL_NUM === null }">{{obs.NVAL_NUM}} {{obs.UNIT_CD}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="obs.NVAL_NUM" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="number" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
         
      </tbody>
    </q-markup-table>

    <!-- CONCEPT DIALOG -->
    <q-dialog v-model="show_concept_dialog" style="max-height: 100%">
      <CONCEPT_SELECTION @close="(show_concept_dialog = false); show_concept_dialog_table = undefined" @clear="clearConcept()" @clicked="conceptSelected($event)" :table="show_concept_dialog_table" :CONCEPT_CD="obs.CONCEPT_CD"/>>
    </q-dialog>

    <!-- SURVEY -->
    <div v-if="obs && obs.CATEGORY_CHAR==='quest_surveyBEST'">
      <q-markup-table flat bordered dense class="my-table" v-html="obs.TVAL_CHAR"></q-markup-table>
    </div>

    <!-- BUTTONS -->
    <BOTTOM_BUTTONS 
      :show_back="true" @back="$emit('close')"
      :show_save="data_changed === true" @save="saveData()"
    />

  </div>   

</template>


<script>

import {beautify_data} from 'src/tools/formatdata.js'
import VALUE_ITEM from 'src/components/elements/ValueItem.vue'
import CONCEPT_SELECTION from 'src/components/elements/ConceptSelect.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
    name: 'ObservationEditCard',

    props: ['item', 'import_mode'],

    components: {VALUE_ITEM, CONCEPT_SELECTION, BOTTOM_BUTTONS},

    data() {
    return {
      obs: undefined,
      data_changed: false,
      options_location: [],
      options_provider: [],
      options_concept_selection: [],
      show_concept_dialog: false,
      show_concept_dialog_table: undefined
    }},

    mounted() {
      if (!this.item) this.obs = undefined
      else this.loadData()

      if (this.import_mode) this.data_changed = true
      
      
    },

    watch: {
      item(val) {
        if (this.import_mode) {
          this.obs = val
          return
        }
      }
    },  

    computed: {
     
    },

    methods: {
      dataChanged() {
        this.data_changed = true
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

      saveData() {
        const data = beautify_data(this.obs)
        if (data.OBSERVATION_ID) {
          const where = {OBSERVATION_ID: data.OBSERVATION_ID}
          delete data.OBSERVATION_ID
          this.$store.dispatch('updateDB', {query_string: {where: where, set: data}, table:"OBSERVATION_FACT"})
          .then(res => {
            this.$q.notify('Speichern erfolgreich')
            this.data_changed = false
          }).catch(err => this.$q.notify(err))
        } else {
          this.$store.dispatch('addDB', {query_string: data, table:"OBSERVATION_FACT"})
          .then(res => {
            this.obs.OBSERVATION_ID = res.OBSERVATION_ID
            this.$emit('updateData', res)
            this.$q.notify('Speichern erfolgreich')
          })
          .catch(err => this.$q.notify(err))
          this.data_changed = false
        }
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
        } else if (item.MODIFIER_CD) {
          this.obs.MODIFIER_CD =  {value: item.MODIFIER_CD, label: item.NAME_CHAR}
          this.obs.CONCEPT_CD = null
          this.obs.VALTYPE_CD = item.VALTYPE_CD
          this.obs.UNIT_CD = item.UNIT_CD
          this.obs.SOURCESYSTEM_CD = item.SOURCESYSTEM_CD
          this.obs.TVAL_CHAR = null
          this.obs.NVAL_NUM = null
        }
        else this.$q.notify('unexpected result')

        if (this.obs.VALTYPE_CD) this.loadConceptSelection()
        this.data_changed = true
      },


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