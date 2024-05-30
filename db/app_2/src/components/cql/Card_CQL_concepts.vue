<template><!-- CQL BUILD RULE -->
  <div class="row justify-center" v-if="selected_data">
    <q-card class="q-mb-xl my-item">
      <q-card-section class="text-caption text-center q-pa-none bg-grey-3">Assoziierte Concepts <span>: CQL_ID = {{ selected_data.CQL_ID }}</span></q-card-section>
      <q-card-section class="q-pa-none">
        <q-table dense :rows="cql_list" :columns="columns" row-key="CONCEPT_CQL_ID" selection="multiple"
          v-model:selected="selected_concept" :filter="filter">

          <template v-slot:top>
            <BOTTOM_DROPDOWN 
              :show_add="selected_concept.length === 0" @add="show_select_concepts = true"
              :show_remove="selected_concept.length > 0" @remove="removeRule(selected_concept)"
            />
            <q-space />
            <FILTER_BOX :filter="filter" @update="filter = $event" style="max-width: 150px"/>
          </template>

        </q-table>
      </q-card-section>
    </q-card>
    <!-- SELECT COMPONENTS -->
    <SELECT_CONCEPT :active="show_select_concepts" @close="show_select_concepts = false" @save="addRule($event)"/>
  </div>
</template>

<script>
import SELECT_CONCEPT from '../elements/SelectConcept_New.vue'
import BOTTOM_DROPDOWN from '../elements/BottomDropDown.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'Card_CQL_concepts',

  props: ['selected_data'],

  components: {SELECT_CONCEPT, BOTTOM_DROPDOWN, FILTER_BOX},

  data() {
    return {
      localData: undefined,
      filter: null,
      cql_list: [],
      columns: [
        { name: 'CONCEPT_CQL_ID', align: 'center', label: 'ID', field: 'CONCEPT_CQL_ID', sortable: true },
        { name: 'CONCEPT_CD', align: 'center', label: 'CONCEPT_CD', field: 'CONCEPT_CD', sortable: true },
        { name: 'CONCEPT_NAME_CHAR', align: 'center', label: 'Beschr.', field: 'CONCEPT_NAME_CHAR', sortable: true },
      ],
      selected_concept: [],
      show_select_concepts: false

    }
  },

  mounted() {
    this.loadData(this.selected_data)
  },

  watch: {
    selected_data(val) {
      if (val) this.loadData(val)
    }

  },

  computed: {

  },

  methods: {
    async loadData(data) {
      if (!data) return
      this.cql_list = await this.$store.dispatch('searchDB', { table: 'CONCEPT_CQL_LOOKUP', query_string: { CQL_ID: data.CQL_ID, _view: true } })
    },

    async addRule(item){
      if (!item) return

      // CHECK
      let res_exists = await this.$store.dispatch('searchDB', {table: 'CONCEPT_CQL_LOOKUP', query_string: {CQL_ID: this.selected_data.CQL_ID, CONCEPT_CD: item.CONCEPT_CD}})
      if (res_exists.length < 1) {
        // ADD THE RULE
        let res = await this.$store.dispatch('addDB', {table: 'CONCEPT_CQL_LOOKUP', query_string: {CQL_ID: this.selected_data.CQL_ID, CONCEPT_CD: item.CONCEPT_CD}})
        console.log(res)
        this.loadData(this.selected_data)
      } else this.$q.notify('Regel existiert schon')
      this.show_select_concepts = false
    },
    
    async removeRule(item) {
      if ( !item || await !my_confirm(`Soll der Eintrag wirklich gelöscht werden?`)) return 
      for (let val of item) {
        await this.$store.dispatch('deleteDB', {table: 'CONCEPT_CQL_LOOKUP', query_string: {CONCEPT_CQL_ID: val.CONCEPT_CQL_ID}})
      }
      this.loadData(this.selected_data)
      this.$q.notify('Aktion erfolgreich')
    }





    //ende methods
  }

}
</script>
