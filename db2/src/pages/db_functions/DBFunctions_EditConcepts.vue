<template>
  <q-page>
    <MainSlot>
     <!-- HEADING -->
     <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.concept_edit.title" :img="'concept-import-logo.png'" :icon="'format_list_bulleted'"/>
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_left>
        <q-btn icon="add" no-caps class="my-btn" rounded align="around" @click="$router.push({name: 'DBFunctions_ImportConcepts'})">import <q-tooltip>Importiert Konzepte von einem CSV / Excel-File</q-tooltip></q-btn>
      </template>
      <template v-slot:options_right>
        <div style="position: relative">
            <FILTER_BOX :filter="filter" @update="filter = $event"/>
          <div class="q-gutter-xs z-top" style="position: absolute; right: 0px"> 
            <q-checkbox dense v-model="filter_options.T" label="T" @blur="valtypeSelected('T')"/>
            <q-checkbox dense v-model="filter_options.N" label="N" @blur="valtypeSelected('N')" />
            <q-checkbox dense v-model="filter_options.S" label="S" @blur="valtypeSelected('S')" />
            <q-checkbox dense v-model="filter_options.F" label="F" @blur="valtypeSelected('F')"/>
            <q-checkbox dense v-model="filter_options.A" label="A" @blur="valtypeSelected('A')"/>
            <q-tooltip>VALTYPE_CD: T-Text, N-Number, S-Selection, F-Finding, A-Answer</q-tooltip>
          </div>
        </div>
        </template>
      <!-- MAIN -->
      <template v-slot:main>
      <q-table
        class="my-table q-mt-xl"
        :rows="CONCEPTS_TOSHOW"
        row-key="CONCEPT_CD"
        dense
        :rows-per-page-options="[10, 25, 50, 100]"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected"
      >
      
      </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
      <BOTTOM_BUTTONS v-if="selected.length > 0" 
        :show_edit="selected.length === 1" :show_delete="true" :show_export="true"
        @edit="editConcept(selected[0])"
        @delete="deleteConcept(selected)"
        @export="exportConcept(selected)"
      />
      </template>
    </MainSlot>

    <!-- EDIT CONCEPT -->
    <EDIT_CONCEPT v-if="show_edit_concept" :item="selected[0]" :active="show_edit_concept" @close="show_edit_concept = false; selected = []" @save="updateCONCEPT($event)"/>
  </q-page>
</template>

<script>


import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'
import EDIT_CONCEPT from 'src/components/elements/EditConcept.vue'

export default {
  name: 'DBFunctions_EditConcepts',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, MainSlot, EDIT_CONCEPT },

  data() {
    return {
      CONCEPTS: [],
      filter: undefined,
      filter_options: {T: true, N: true, S: true, F: true, A: false},
      selected: [],
      show_edit_concept: false
    }
  },

  mounted() {
   this.loadData()
  },

  watch: {


  },

  computed: {
    CONCEPTS_TOSHOW() {
      return this.CONCEPTS.filter(item => this.OPTIONS_ARRAY.includes(item.VALTYPE_CD) )
    },

    OPTIONS_ARRAY() {
      const el = []
      Object.keys(this.filter_options).forEach(f => {
        if (this.filter_options[f] === true) el.push(f)
      })
      return el
    }
  },

  methods: {
    loadData() {
      this.$store.dispatch('searchDB', { query_string: {CONCEPT_PATH: '\\', _like: true}, table: "CONCEPT_DIMENSION"})
    .then(res => this.formatConceptResult(res))
    },

    formatConceptResult(res) {
      this.CONCEPTS = res
    },

    valtypeSelected(val) {
      this.selected = []
    },

    editConcept() {
      this.show_edit_concept = true
    },

    updateCONCEPT(val) {
      if (!val) return
      console.log(val)
      this.$store.dispatch('searchDB', {query_string: {CONCEPT_CD: val.CONCEPT_CD}, table: 'CONCEPT_DIMENSION'})
      .then(res_concept => {
        if (res_concept.length > 0) {
          // updating
          var WHERE = {CONCEPT_CD: val.CONCEPT_CD}
          var SET = val
          delete SET.CONCEPT_CD
          this.$store.dispatch('updateDB', {query_string: {where: WHERE, set: SET}, table: 'CONCEPT_DIMENSION'})
          .then(res_update => {
            this.$q.notify(res_update)
            this.loadData()
            this.show_edit_concept = false
            this.selected = []
          })
        } else {
          // neuen Eintrag
          this.$store.dispatch('addDB', {query_string: val, table: 'CONCEPT_DIMENSION'})
          .then(res => {
            
            if (confirm(`PRIMARY_KEY: CONCEPT_CD wurde geändert und ein neuer Datensatz wude angelegt.\nSoll der ursprüngliche Datensatz gelöscht werden?`)) {
              this.$store.dispatch('deleteDB', {query_string: {CONCEPT_CD: this.selected[0].CONCEPT_CD}, table: 'CONCEPT_DIMENSION'})
              .then(res => this.loadData())
            } else this.loadData()
            
            this.show_edit_concept = false
            this.selected = []
          })
        }
      })
    },  

    async deleteConcept(val) {
      if (!val) return
      
      if (!confirm(`Sollen ${val.length} Einträge wirklich gelöscht werden?\nDieser Schritt kann nicht rückgängig gemacht werden!`)) return
      for (let item of val) {
        await this.$store.dispatch('deleteDB', {query_string: {CONCEPT_CD: item.CONCEPT_CD}, table: 'CONCEPT_DIMENSION'})
      }
      this.loadData()

      this.selected = []
    },

    exportConcept(val) {
      this.$q.notify(this.$store.getters.TEXT.msg.comming_soon)
      this.selected = []
    }
  }

}
</script>
