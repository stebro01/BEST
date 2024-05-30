<template>
  <div class="columns items-center" style="height: 100%">
    <div class="col q-pa-md" style="position: relative;">
      <div class="text-h6">1. Definiere Suchanfrage für Export</div>
      <DATATRANSFER_EXPORT_QUERY @query="queryDB($event)" @clear="RESULT = undefined" />
      <q-btn class="absolute-bottom-right" flat round icon="done_all" @click="addAllToBasket()"><q-tooltip>Alle Tables zum Basket</q-tooltip></q-btn>
    </div>


    <div class="col q-pa-md">
      <div class="text-h6">
        2. Schaue das Ergebnis der Suchanfrage an und füge die Daten dem Export-Basket hinzu
        <q-btn v-if="PREVIEW" round flat class="float-right" icon="delete"
          @click="RESULT = undefined; active_where = undefined" />
      </div>
      <div v-if="PREVIEW && PREVIEW.data" class="row justify-center">
        <q-table title="Results" :rows="PREVIEW.data" dense class="my-table" :filter="filter"
          selection="multiple" v-model:selected="selected"  :row-key="PREVIEW.primarykey" :columns="PREVIEW.columns"
        >
          <template v-slot:top>
            <q-btn v-if="selected.length === 0" class="my-btn" rounded no-caps @click="add_to_basket(undefined)">Alles zum Export-Basket hinzufügen</q-btn>
            <q-btn v-else class="my-btn" rounded no-caps @click="add_to_basket(selected)">Auswahl zum Export-Basket hinzufügen</q-btn>
            <q-space />
            <!-- FILTERBOX -->
            <FILTER_BOX :filter="filter" @update="filter = $event" class="float-right" />
          </template>
        </q-table>
      </div>
    </div>

    <!-- EXPORT BASKET -->
    <div class="col q-pa-md">
      <div class="text-h6">3. Export-Basket anschauen und ggf. Einträge entfernen</div>
      <q-list v-if="BASKET.length > 0" bordered="">
        <q-item v-for="(basket_item, basket_index) in BASKET" :key="basket_index + 'bask'" clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="folder" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ basket_item.table }}</q-item-label>
            <q-item-label caption>{{ basket_item.query }}</q-item-label>
          </q-item-section>
          <q-item-section>Einträge: {{ basket_item.data.length }}</q-item-section>
          <q-item-section side> <q-btn icon="delete" flat round
              @click="removeFromBasket(BASKET, basket_index)"><q-tooltip>Aus Basket
                entfernen</q-tooltip></q-btn></q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col q-pa-md">
      <div class="text-h6">4. Exportiere in ein JSON File</div>
      <div class="text-center" v-if="BASKET.length > 0">
        <q-btn class="my-btn" rounded @click="exportData()">EXPORT</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { exportFile } from 'quasar'
import DATATRANSFER_EXPORT_QUERY from 'src/components/import/DataTransfer_Export_Query.vue'
import FILTER_BOX from "src/components/elements/FilterBox.vue";
import { my_confirm } from 'src/tools/my_dialog';
import { now } from 'src/tools/mydate';
import { TRANSFER_OPTIONS } from 'src/tools/db_datatransfer';

export default {
  name: "DataTransfer_Export",

  components: { DATATRANSFER_EXPORT_QUERY, FILTER_BOX },

  data() {
    return {

      RESULT: undefined,
      BASKET: [],
      filter: undefined,
      selected: []

    };
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT;
    },

    PREVIEW() {
      if (!this.RESULT || !this.RESULT.data) return undefined
      const columns = []
      Object.keys(this.RESULT.data[0]).forEach(key => {
        columns.push({name: key, label: key, field: key, sortable: true})
      })      
      return {...this.RESULT, columns};
    }
  },

  methods: {
    queryDB(data) {
      this.RESULT = data
    },

    async add_to_basket(val) {
      this.$store.commit('SPINNER_SET', true)
      var DATA = undefined
      if (val === undefined) DATA = {DOWNLOAD_DATE: this.RESULT.DOWNLOAD_DATE, query: this.RESULT.query, table: this.RESULT.table, data: this.RESULT.data}
      else DATA = {DOWNLOAD_DATE: this.RESULT.DOWNLOAD_DATE, query: this.RESULT.query, table: this.RESULT.table, data: val}

      if (this.RESULT.lookup !== undefined) {
        //jetzt muss ich LOOKUPs noch raussuchen => gesetzt wird das Feld in DataTransfer_Export_Query.vue => computed()-> LOOKUP
        const key_from = this.RESULT.lookup.key_from
        const key_to = this.RESULT.lookup.key_to
        const table_to = this.RESULT.lookup.table
        for (let data of DATA.data) {
          let res = await this.$store.dispatch('searchDB', {table: table_to, query_string: {[key_from]: data[key_from]}})
          if (res.length > 0) {
            let lookup = {key_from: key_from, key_to: key_to, table_from: DATA.table, table_to: table_to, data: []}
            res.forEach(r => lookup.data.push(r[key_to]))
            data.lookup = lookup
          }
          
        }
      }

      // GIBT ES SO EIN FELD SCHON?
      const el = this.BASKET.filter(el => el.table === DATA.table)
      if (el.length < 1) {
        this.BASKET.push(DATA)
        this.RESULT = undefined
        this.selected = []
      } else {
        this._merge_arr(el[0].data, DATA.data)
        el[0].DOWNLOAD_DATE = DATA.DOWNLOAD_DATE
        el[0].query += '; ' + DATA.query
        this.RESULT = undefined
        this.selected = []
      }
      this.$store.commit('SPINNER_SET', false)
    },

    _merge_arr(arrayX, arrayY) {
      let setX = new Set(arrayX.map(JSON.stringify));
      arrayY
        .filter(objY => !setX.has(JSON.stringify(objY)))
        .forEach(objY => arrayX.push(objY));
    },

    async addAllToBasket() {
      this.$store.commit('SPINNER_SET', true)
      for (let TABLE of TRANSFER_OPTIONS) {
        let query = `SELECT * FROM ${TABLE.table}`
        let res = await this.$store.dispatch('runQuery', query)
        if (res.status && res.data.length > 0) {
          this.RESULT = { data: res.data, table: TABLE.table, query: query, DOWNLOAD_DATE: now(), primarykey:TABLE.fields[0], lookup: TABLE.lookup };
          await this.add_to_basket(undefined)
        }
      }
      this.RESULT = undefined
      this.$store.commit('SPINNER_SET', false)

    },

    async removeFromBasket(ARR, ind) {
      if (!await my_confirm(`Sollen der Eintrag wirklich entfernt werden?`)) return
      ARR = ARR.splice(ind, 1)
    },

    async exportData() {

      const status = exportFile(`export_dbBEST_${Date.now()}.json`, JSON.stringify(this.BASKET))

      if (status === true) {
        this.$q.notify('Export erfolgreich')
      }
      else {
        // browser denied it
        this.$q.notify('Error: ' + status)
      }
    },

  },
};
</script>
