<template>
    <div class="row">
      <!-- SUCHANFRAGE -->
      
      <div class="col-12 row">
        <div class="col-6 col-xs-3 text-center text-bold q-mt-sm" >
          <span >{{ SELECT_FROM }}</span>
        </div>
        <!-- TABLE -->
        <div class="col-6 col-xs-4" >
          <q-btn-dropdown :label="active_table" >
            <q-list>
              <q-item v-for="(table_item, table_ind) in TABLES" :key="table_ind + 'table'" clickable v-close-popup
                @click="selectTable(table_item)">
                {{ table_item }}
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!-- WHERE -->
        <div class="col-6 col-xs-1 text-center text-bold q-mt-sm" >
          <span >WHERE</span>
        </div>
        <!-- OPT -->
        <div class="col-6 col-xs-4 q-mt-sm" >
          {{ active_where }}
          <q-btn v-if="!show_add" icon="add" round flat size="sm" @click="addWhere()" />
        </div>
        
      </div>

      <!-- SHOW ADD -->
      <div class="col-12 row bg-grey-3 q-mt-sm" v-if="show_add">
        <div class="col">
          <q-option-group v-model="show_add_data.OPERATOR" :options="[
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
          ]" />
        </div>
        <div class="col">
          <q-option-group v-model="show_add_data.FIELD" :options="FIELD" />
        </div>
        <div class="col" style="position: relative">
          <span class="absolute-center text-bold">=</span>
        </div>
        <div class="col" style="position: relative">
          <q-input v-model="show_add_data.VALUE" dense hint="Wert" class="absolute-center"/>
        </div>
        <div class="col-2" style="position: relative">
          <div class="absolute-center row q-gutter-xs">
            <q-icon v-if="WHERE_IS_VALID" name="add" size="sm" class="cursor-pointer" @click="addWhereValue(show_add_data)" />
            <q-icon name="delete" size="sm" class="cursor-pointer" @click="
              show_add = false;
            show_add_data = {};
            " />
          </div>
        </div>
      </div>

      <!-- QUERY BTN -->
      <div class="col-12 text-center q-mt-sm">
        <q-btn rounded class="my-btn" @click="queryDB()">suchen</q-btn>
      </div>
    </div>

</template>

<script>
import { now } from 'src/tools/mydate';
import { TRANSFER_OPTIONS } from 'src/tools/db_datatransfer';

export default {
  name: "DataTransfer_Export_Query",

  components: {},

  data() {
    return {
      options: TRANSFER_OPTIONS,
      active_table: "CONCEPT_DIMENSION",
      active_where: undefined,
      SELECT_FROM: "SELECT * FROM",
      show_add: false,
      show_add_data: {},
    };
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT;
    },

    TABLES() {
      const res = [];
      this.options.forEach((o) => res.push(o.table));
      return res;
    },

    FIELD() {
      const res = []
      if (!this.active_table) return res
      const items = this.options.filter(el => el.table === this.active_table)
      if (items.length === 0) return res
      items[0].fields.forEach(f => res.push({label: f, value: f}))
      return res
    },

    LOOKUP() {
      const res = undefined
      if (!this.active_table) return res
      const items = this.options.filter(el => el.table === this.active_table)
      if (items.length === 0) return res
      return items[0].lookup
    },

    WHERE_IS_VALID() {
      if (!this.show_add_data) return false
      if (!this.show_add_data.OPERATOR || !this.show_add_data.VALUE || !this.show_add_data.FIELD) return false
      // else
      return true
    }
  },

  methods: {
    selectTable(table) {
      this.active_table = table;
      this.active_where = undefined;
      this.$emit('clear');
    },

    addWhere() {
      this.show_add = true;
      this.show_add_data = {};
    },

    addWhereValue(value) {
      const str = `${value.FIELD} LIKE '${value.VALUE}%'`
      if (this.active_where === undefined) this.active_where = str
      else this.active_where += ` ${value.OPERATOR} ${str}`
      this.show_add = false; this.show_add_data = {}

    },

    async queryDB() {
      var RESULT = undefined;
      this.show_add = false;
      this.show_add_data = {};
      var query = `${this.SELECT_FROM} ${this.active_table}`;
      if (this.active_where) query += ` WHERE ${this.active_where}`
      const res = await this.$store.dispatch("runQuery", query);
      if (!res.status) return this.$q.notify("Etwas ging schief");
      // else
      this.$q.notify(`${res.data.length} Einträge gefunden`);
      RESULT = { data: res.data, table: this.active_table, query: query, DOWNLOAD_DATE: now(), primarykey: this.FIELD[0].value, lookup: this.LOOKUP };
      this.$emit('query', RESULT)
    }

  },
};
</script>
