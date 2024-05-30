<template>
  <q-page>
    <MainSlot :no_options="true" :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="$store.getters.TEXT.page.concept_edit.title" :img="'concept-import-logo.png'"
          :icon="'format_list_bulleted'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div>
          <q-table class="my-table q-mt-xl" :rows="CONCEPTS_TOSHOW" row-key="CONCEPT_CD" dense
            :rows-per-page-options="[10, 25, 50, 100]" :filter="filter" selection="multiple" v-model:selected="selected"
            :columns="columns"
            >
            <!-- OPTIONS -->
            <template v-slot:top>
              <BOTTOM_DROPDOWN 
                :show_add="selected.length === 0" @add="showAddDialog()" :show_edit="selected.length === 1"
                @edit="editConcept(selected[0])" :show_remove="selected.length > 0" @remove="deleteConcept(selected)"
                 />
              <q-space />
              <div style="position: relative; width: 250px; height: 60px">
                <FILTER_BOX :filter="filter" @update="filter = $event" />
                <div class="q-gutter-xs z-top" style="position: absolute; right: 0px">
                  <q-checkbox size="xs" dense v-model="filter_options.T" label="T" @blur="valtypeSelected('T')" />
                  <q-checkbox size="xs" dense v-model="filter_options.N" label="N" @blur="valtypeSelected('N')" />
                  <q-checkbox size="xs" dense v-model="filter_options.D" label="D" @blur="valtypeSelected('D')" />
                  <q-checkbox size="xs" dense v-model="filter_options.S" label="S" @blur="valtypeSelected('S')" />
                  <q-checkbox size="xs" dense v-model="filter_options.F" label="F" @blur="valtypeSelected('F')" />
                  <q-checkbox size="xs" dense v-model="filter_options.A" label="A" @blur="valtypeSelected('A')" />
                  <q-checkbox size="xs" dense v-model="filter_options.R" label="R" @blur="valtypeSelected('R')" />
                  <q-tooltip>VALTYPE_CD: T-Text, N-Number, S-Selection, F-Finding, A-Answer, R-Rawdata</q-tooltip>
                </div>
              </div>
            </template>

          </q-table>
        </div>
      </template>
    </MainSlot>

    <!-- MORE OPTIONS -->

    <!-- EDIT CONCEPT -->
    <EDIT_CONCEPT v-if="show_edit_concept" :item="selected[0]" :active="show_edit_concept"
      @close="show_edit_concept = false; selected = []" @save="updateCONCEPT($event)" @modify="modifyConcept($event)"/>
    <!--  ADD CONCEPT -->
    <EDIT_CONCEPT v-if="show_add_concept" :item="show_add_concept_data" :active="show_add_concept"
      @close="saveNewConcept(undefined)" @save="saveNewConcept($event)" />
  </q-page>
</template>

<script>

import BOTTOM_DROPDOWN from 'src/components/elements/BottomDropDown.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'
import EDIT_CONCEPT from 'src/components/elements/EditConcept.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'DBFunctions_EditConcepts',

  components: { BOTTOM_DROPDOWN, HEADING, FILTER_BOX, MainSlot, EDIT_CONCEPT },

  data() {
    return {
      CONCEPTS: [],
      filter: undefined,
      filter_options: { T: true, N: true, D: true, S: true, F: true, A: false, R: false },
      selected: [],
      show_edit_concept: false,
      show_add_concept: false,
      show_add_concept_data: {},
      columns: [
        { name: 'CONCEPT_CD', align: 'left', label: 'CONCEPT_CD', field: 'CONCEPT_CD', sortable: true, style: "max-width: 150px; overflow: hidden; font-size: 0.6em" },
        { name: 'NAME_CHAR', align: 'left', label: 'NAME_CHAR', field: 'NAME_CHAR', sortable: true, style: "max-width: 150px; overflow: hidden; font-size: 0.8em" },
        { name: 'VALTYPE_CD', align: 'center', label: 'VALTYPE_CD', field: 'VALTYPE_CD', sortable: true, style: "max-width: 40px; overflow: hidden; font-size: 0.8em" },
        { name: 'UNIT_CD', align: 'center', label: 'UNIT_CD', field: 'UNIT_CD', sortable: true, style: "max-width: 40px; overflow: hidden; font-size: 0.8em" },
        { name: 'CONCEPT_PATH', align: 'left', label: 'CONCEPT_PATH', field: 'CONCEPT_PATH', sortable: true, style: "max-width: 150px; overflow: hidden; font-size: 0.5em" },
        { name: 'RELATED_CONCEPT', align: 'left', label: 'RELATED_CONCEPT', field: 'RELATED_CONCEPT', sortable: true, style: "max-width: 50px; overflow: hidden; font-size: 0.5em" },
        { name: 'CONCEPT_BLOB', align: 'left', label: 'CONCEPT_BLOB', field: 'CONCEPT_BLOB', sortable: true, style: "max-width: 150px; overflow: hidden; font-size: 0.5em" },
      ]
    }
  },

  mounted() {
    this.loadData()
  },

  watch: {


  },

  computed: {
    CONCEPTS_TOSHOW() {
      return this.CONCEPTS.filter(item => this.OPTIONS_ARRAY.includes(item.VALTYPE_CD))
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
      this.$store.dispatch('searchDB', { query_string: { CONCEPT_PATH: '\\', _like: true }, table: "CONCEPT_DIMENSION" })
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

    showAddDialog() {
      this.show_add_concept_data = {}
      this.show_add_concept = true
    },

    async saveNewConcept(val) {
      if (!val) { this.show_add_concept = false; this.show_add_concept_data = {}; return }
      const CHECK_DATA = ["SOURCESYSTEM_CD", "VALTYPE_CD", "NAME_CHAR"]
      const empty_fields = []
      CHECK_DATA.forEach(f => {
        if (!val[f]) empty_fields.push(f)
      })
      if (val.CONCEPT_CD.includes('undefined')) empty_fields.push('CONCEPT_CD')
      if (empty_fields.length > 0) return this.$q.notify(`Felder fehlen noch: ${empty_fields}`)

      const res_concept = await this.$store.dispatch('searchDB', { query_string: { CONCEPT_CD: val.CONCEPT_CD }, table: 'CONCEPT_DIMENSION' })
      if (res_concept.length > 0) return this.$q.notify(`CONCEPT_CD: <<${val.CONCEPT_CD}>> existiert schon`)
      // else
      const res_add_concept = await this.$store.dispatch('addDB', { table: 'CONCEPT_DIMENSION', query_string: val })
      if (res_add_concept) {
        if (res_add_concept.CONCEPT_CD === undefined) return this.$q.notify('Etwas ging schief. DB nicht erreichbar')
        else {
          this.$q.notify('Aktion erfolgreich')
          this.loadData()
        }
      }

      // ENDE
      this.show_add_concept = false; this.show_add_concept_data = {};
      return
    },

    updateCONCEPT(val) {
      if (!val) return
      this.$store.dispatch('searchDB', { query_string: { CONCEPT_CD: val.CONCEPT_CD }, table: 'CONCEPT_DIMENSION' })
        .then(res_concept => {
          if (res_concept.length > 0) {
            // updating
            var WHERE = { CONCEPT_CD: val.CONCEPT_CD }
            var SET = val
            delete SET.CONCEPT_CD
            this.$store.dispatch('updateDB', { query_string: { where: WHERE, set: SET }, table: 'CONCEPT_DIMENSION' })
              .then(res_update => {
                this.$q.notify(res_update)
                this.loadData()
                this.show_edit_concept = false
                this.selected = []
              })
          } else {
            // neuen Eintrag
            this.$store.dispatch('addDB', { query_string: val, table: 'CONCEPT_DIMENSION' })
              .then(res => {

                if (confirm(`PRIMARY_KEY: CONCEPT_CD wurde geändert und ein neuer Datensatz wude angelegt.\nSoll der ursprüngliche Datensatz gelöscht werden?`)) {
                  this.$store.dispatch('deleteDB', { query_string: { CONCEPT_CD: this.selected[0].CONCEPT_CD }, table: 'CONCEPT_DIMENSION' })
                    .then(res => this.loadData())
                } else this.loadData()

                this.show_edit_concept = false
                this.selected = []
              })
          }
        })
    },

    modifyConcept(CONCEPT) {
      this.saveNewConcept(CONCEPT); 
      this.show_edit_concept = false; 
      this.selected = []
      this.filter = CONCEPT.CONCEPT_CD
    },

    async deleteConcept(val) {
      if (!val) return

      if (!await my_confirm(`Sollen ${val.length} Einträge wirklich gelöscht werden?\nDieser Schritt kann nicht rückgängig gemacht werden!`)) return
      for (let item of val) {
        await this.$store.dispatch('deleteDB', { query_string: { CONCEPT_CD: item.CONCEPT_CD }, table: 'CONCEPT_DIMENSION' })
      }
      this.loadData()

      this.selected = []
    }
  }

}
</script>
