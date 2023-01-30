<template>
  <q-page>
    <MainSlot>
     <!-- HEADING -->
     <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.concept_edit.title" :img="'concept-import-logo.png'"/>
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
        @delete="exportConcept(selected)"
        @export="deleteConcept(selected)"
      />
      </template>
        
    </MainSlot>
  </q-page>
</template>

<script>


import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBFunctions_EditConcepts',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, MainSlot },

  data() {
    return {
      CONCEPTS: [],
      filter: undefined,
      filter_options: {T: true, N: true, S: true, F: true, A: false},
      selected: []
    }
  },

  mounted() {
    this.$store.dispatch('searchDB', { query_string: {CONCEPT_PATH: '\\', _like: true}, table: "CONCEPT_DIMENSION"})
    .then(res => this.formatConceptResult(res))
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
    formatConceptResult(res) {
      this.CONCEPTS = res
    },

    valtypeSelected(val) {
      this.selected = []
    },

    editConcept(val) {
      this.$q.notify(this.$store.getters.TEXT.msg.comming_soon)
      this.selected = []
    },

    deleteConcept(val) {
      this.$q.notify(this.$store.getters.TEXT.msg.comming_soon)
      this.selected = []
    },

    exportConcept(val) {
      this.$q.notify(this.$store.getters.TEXT.msg.comming_soon)
      this.selected = []
    }
  }

}
</script>
