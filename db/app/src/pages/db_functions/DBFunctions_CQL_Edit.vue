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
          <q-card class="">
            {{ SOMETHING_CHANGED }}
            <q-card-section>Erstelle/Bearbeite eine CQL Regel</q-card-section>
            <q-btn v-if="selected.length > 0" class="absolute-top-right q-mt-xs q-mr-xs" round icon="refresh" @click="queryAPI()"><q-tooltip>API (localhost:8082) abfragen und aus CQL -> JSON erzeugen</q-tooltip></q-btn>
            <q-card-section v-if="selected.length > 0" class="text-center">
              <q-btn-group push>
                <q-btn push label="CQL" :class="{'bg-grey-3':parameter_mode === 'CQL_CHAR'}" @click="parameter_mode = 'CQL_CHAR'"/>
                <q-btn push label="JSON/EML" :class="{'bg-grey-3':parameter_mode === 'JSON_CHAR'}" @click="parameter_mode = 'JSON_CHAR'"/>
              </q-btn-group>
              <div><q-input v-model="selected[0][parameter_mode]" type="textarea" filled :readonly="parameter_mode === 'JSON_CHAR'" lazy-rules @blur="selected[0]._changed = true"></q-input></div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn no-caps rounded class="my-btn" @click="updateData()">speichern</q-btn>
              <q-btn no-caps rounded class="my-btn" @click="loadData()">zrücksetzen</q-btn>
            </q-card-actions>
           
            <q-separator />
            <!-- DATEN TESTEN -->
            <div class="bg-grey-1">
            <q-card-actions align="center">
              <q-btn v-if="selected.length > 0" @click="execCQL()" rounded class="my-btn">Ausführen</q-btn>

            </q-card-actions>
            <q-card-section >
              <div class="text-center text-caption">Parameter</div>
              <q-markup-table dense>
                <thead>
                  <tr>
                    <td>Nr.</td><td>Wert</td><td>Typ</td><td>Ergebniss CQL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, ind) in parameter_value" :key="ind + 'param'">
                    <td>{{ ind+1}}</td>
                    <td><q-input dense filled v-model="item.value" :type="item.type" input-class="text-center"/></td>
                    <td><q-btn-dropdown split :label="item.type" no-caps style="width: 120px">
                      <q-list> 
                        <q-item clickable v-close-popup @click="item.type = item_type.value"
                          v-for="(item_type, ind_type) in parameter_type" :key="ind_type + 'type'"
                        >
                        <q-item-section>{{ item_type.label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown></td>
                    <td>{{ item.result }}</td>
                  </tr>
                </tbody>

              </q-markup-table>
            </q-card-section>
          </div>
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
import { stringify, unstringify } from 'src/classes/sqltools'
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
      parameter_type: [{value: 'number', label: 'Zahl'}, {value: 'date', label: 'Datum'}, {value: 'string', label: 'Text'}],
      parameter_value: [{value: 10, type: 'number', result: null}, {value: '10', type: 'string', result: null}, {value: '2010-10-10', type: 'date', result: null}],
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
    },
    SOMETHING_CHANGED(){
        if (!this.localData) return false
        var change = false
        this.localData.forEach(d => {
          if (d._changed === true) change = true
        })
        return change
      }

  },

  methods: {
    async loadData() {
      const res = await this.$store.dispatch('searchDB', {table: 'CQL_FACT', query_string: {'CODE_CD': '%', _like: true}})
      this.localData = res
      this.localData.forEach(d => {
        // if (d.CQL_CHAR) d.CQL_CHAR = unstringify(d.CQL_CHAR)
        // if (d.JSON_CHAR) d.JSON_CHAR = unstringify(d.JSON_CHAR)
      })
      this.selected = []
    },

    async execCQL() {

      const lib = JSON.parse(this.selected[0].JSON_CHAR)
      for (let item of this.parameter_value) {
        let res = await this.$store.dispatch('execCQL', {parameters: JSON.stringify({VALUE: item.value}), lib})
        if (!res.status) item.result = res.error
        else item.result = res.data
      }

      return
    },

    async queryAPI() {
      const cql_lib = this.selected[0].CQL_CHAR
      if (!cql_lib || typeof(cql_lib) !== 'string' || cql_lib.length < 1) return this.$q.notify('CQL_CHAR invalid')
      const res = await this.$store.dispatch('query_CQLAPI', {cql: cql_lib})
      if (!res.status) {
        if (res.error.message) return this.$q.notify(res.error.message)
        else return this.$q.notify(res.error)
      }
      // else
      this.selected[0].JSON_CHAR = JSON.stringify(res.data)
      this.$q.notify('JSON/EML wurde geupdated')
    },

    async updateData() {
      if (!this.localData) return false
      for (let item of this.localData) {
        if (item._changed === true) {
          let WHERE = {CQL_ID: item.CQL_ID}
          let SET = {CODE_CD: item.CODE_CD, NAME_CHAR: item.NAME_CHAR, CQL_CHAR: stringify(item.CQL_CHAR), JSON_CHAR: stringify(item.JSON_CHAR), CQL_BLOB: item.CQL_BLOB}
          let res = await this.$store.dispatch('updateDB', {table: 'CQL_FACT', query_string: {set: SET, where: WHERE}})
        }
        // item._changed = false
      }

      this.$q.notify('Speichern erfolgreich')
    }

    //ende methods
  }

}
</script>
