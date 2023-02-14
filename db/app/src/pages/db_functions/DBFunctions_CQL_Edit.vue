<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description"  :img="'concept-import-logo.png'" :icon="'rule'"/>
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_right>
        <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <!-- TABLE -->
        <div class="row justify-center ">
          <q-table :rows="localData" :columns="columns" :filter="filter" row-key="CQL_ID" selection="single" v-model:selected="selected">

          </q-table>
          <div v-if="selected.length > 0" class=" col-12 text-center q-mt-md">
            CQL_ID: {{ selected[0].CQL_ID }}
          </div>


          <!-- CQL BUILD RULE -->
        <div class="col-12 q-mt-md row justify-center">
          <q-card class="my-card">
            <q-card-section>Erstelle/Bearbeite eine CQL Regel</q-card-section>

            <q-card-section v-if="selected.length > 0" class="text-center">
              <q-btn-group push>
                <q-btn push label="CQL" :class="{'bg-grey-3':parameter_mode === 'CQL_CHAR'}" @click="parameter_mode = 'CQL_CHAR'"/>
                <q-btn push label="JSON/EML" :class="{'bg-grey-3':parameter_mode === 'JSON_CHAR'}" @click="parameter_mode = 'JSON_CHAR'"/>
              </q-btn-group>
              <div><q-input v-model="selected[0][parameter_mode]" type="textarea" filled :readonly="parameter_mode === 'JSON_CHAR'"></q-input></div>
            </q-card-section>
           
            <q-card-section >
              <div class="text-center text-caption">Parameter</div>
              <div><q-input v-model="parameter_value" type="textarea" filled></q-input></div>
            </q-card-section>

          </q-card>

          <div class="col-12 text-center" v-if="selected.length > 0"><q-btn @click="execCQL()" rounded class="my-btn">Ausführen</q-btn></div>

        </div>

        <!-- CQL QUERY API -->
        <div class="col-12 q-mt-md row justify-center">
          <q-card class="my-card">
            <q-card-section>Query API</q-card-section>
          </q-card>

        </div>
        
      </div>
      </template>
    </MainSlot>

   
  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'

export default {
  name: 'DBFunctions_CQL_Edit',

  components: {HEADING, MainSlot, FILTER_BOX},

  data() {
    return {
      selected: [],
      filter: undefined,
      localData: [],
      columns: [
        { name: 'CQL_ID', align: 'center', label: 'ID', field: 'CQL_ID', sortable: true },
        { name: 'CODE_CD', align: 'center', label: 'Code', field: 'CODE_CD', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'Beschr.', field: 'NAME_CHAR', sortable: true },
        { name: 'CONCEPT_CD', align: 'center', label: 'Concept', field: 'CONCEPT_CD', sortable: true },
        { name: 'CQL_BLOB', align: 'center', label: 'Details', field: 'CQL_BLOB', sortable: true },
        // { name: 'CQL_CHAR', align: 'center', label: 'cql', field: 'CQL_CHAR', style: 'max-width: 100px; overflow: hidden', sortable: true },
        // { name: 'JSON_CHAR', align: 'center', label: 'eml/json', field: 'JSON_CHAR', style: 'max-width: 100px; overflow: hidden', sortable: true },
    ], 
      parameter_value: JSON.stringify({ "A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47' }),
      parameter_mode: 'CQL_CHAR'

    }
  },

  mounted() {
    this.loadData()
  },

  watch: {


  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_functions_cql
    }
  },

  methods: {
    async loadData() {
      const res = await this.$store.dispatch('searchDB', {table: 'CQL_FACT', query_string: {'CODE_CD': '%', _like: true}})
      this.localData = res
    },

    async execCQL() {
      const parameters = JSON.parse(this.parameter_value)
      const lib = JSON.parse(this.selected[0].JSON_CHAR)
      
      const res = await this.$store.dispatch('execCQL', {parameters, lib})
      console.log(res)
    }

    //ende methods
  }

}
</script>
