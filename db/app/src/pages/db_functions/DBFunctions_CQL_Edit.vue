<template>
  <q-page>
    <MainSlot :no_footer="SOMETHING_CHANGED !== true" :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'concept-import-logo.png'" :icon="'rule'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <!-- TABLE -->
        <div class="row  q-mt-md justify-center ">
          <q-table dense :rows="localData" :columns="columns" :filter="filter" row-key="CQL_ID" selection="multiple"
            v-model:selected="selected">
            <!-- OPTIONS -->
            <template v-slot:top>
              <BOTTOM_DROPDOWN :show_add="selected.length === 0" @add="show_new = true" :show_remove="selected.length > 0"
                @remove="delectCQL(selected)" :show_edit="selected.length === 1" @edit="show_edit = true" 
                />
              <q-space />
              <FILTER_BOX :filter="filter" @update="filter = $event" />
            </template>
          </q-table>

          <!-- CQL OPTION -->
          <div class="col-12 text-center q-my-sm" v-if="selected.length > 0">
            <q-btn-toggle v-model="show_mode" toggle-color="primary" :options="show_mode_options" />
          </div>
          <!-- CQL BUILD RULE -->
          <CARD_CQL_RULES v-if="selected.length === 1 && show_mode === 'RULES'" :selected_data="selected[0]"
            @changed="updateCQL_Data($event)" />
          <CARD_CQL_CONCEPTS v-else-if="selected.length === 1 && show_mode === 'CONCEPTS'" :selected_data="selected[0]" />
          <div v-else class="col-12 text-center">
            <q-icon class="text-center cursor-pointer q-mt-lg" size="sm" name="info" @click="show_info = true" />
          </div>
        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_save="SOMETHING_CHANGED" @save="this.save_UpdatedCQL_Data()" :show_back="true" @back="this.loadData()" />
      </template>

    </MainSlot>

    <!-- SOME MODALS / DIALOGE -->
    <DIALOG_INFO_CQL :active="show_info" @close="show_info = false" />
    <!-- ADD CQL -->
    <DIALOG_CQL_EDIT :active="show_new" :title="'Erstelle eine CQL Regel'" @close="show_new = false"
      @save="addCQL($event)" />
    <DIALOG_CQL_EDIT v-if="show_edit" :data="selected[0]" :active="show_edit" :title="'Berarbeite eine CQL Regel'"
      @close="show_edit = false" @save="saveCQL($event)" />

  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import DIALOG_CQL_EDIT from 'src/components/cql/Dialog_EditCQL.vue'
import DIALOG_INFO_CQL from 'src/components/cql/Dialog_InfoCQL.vue'
import CARD_CQL_RULES from 'src/components/cql/Card_CQL_rules.vue'
import CARD_CQL_CONCEPTS from 'src/components/cql/Card_CQL_concepts.vue'
import BOTTOM_DROPDOWN from 'src/components/elements/BottomDropDown.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import { my_confirm } from "src/tools/my_dialog";

import { exportFile } from 'quasar'

import { stringify_char, stringify_json, unstringify_char, unstringify_json } from 'src/classes/sqltools'

export default {
  name: 'DBFunctions_CQL_Edit',

  components: { BOTTOM_BUTTONS, HEADING, MainSlot, FILTER_BOX, DIALOG_CQL_EDIT, DIALOG_INFO_CQL, CARD_CQL_RULES, CARD_CQL_CONCEPTS, BOTTOM_DROPDOWN },

  data() {
    return {
      selected: [],
      filter: undefined,
      localData: [],
      show_info: false,
      show_pick_path: false,
      show_new: false,
      show_edit: false,
      show_mode: 'RULES',
      show_mode_options: [{ label: "CQL-Regeln", value: 'RULES' }, { label: 'Concepts', value: 'CONCEPTS' }],
      columns: [
        { name: 'CQL_ID', align: 'center', label: 'ID', field: 'CQL_ID', sortable: true },
        { name: 'CODE_CD', align: 'center', label: 'Code', field: 'CODE_CD', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'Beschr.', field: 'NAME_CHAR', sortable: true },

        { name: 'CQL_BLOB', align: 'center', label: 'Details', field: 'CQL_BLOB', sortable: true },
        // { name: 'CQL_CHAR', align: 'center', label: 'cql', field: 'CQL_CHAR', style: 'max-width: 100px; overflow: hidden', sortable: true },
        // { name: 'JSON_CHAR', align: 'center', label: 'eml/json', field: 'JSON_CHAR', style: 'max-width: 100px; overflow: hidden', sortable: true },
      ],
      SOMETHING_CHANGED: false

    }
  },

  mounted() {
    this.loadData()
  },


  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_functions_cql
    },

  },

  methods: {
    async loadData() {
      const res = await this.$store.dispatch('searchDB', { table: 'CQL_FACT', query_string: { 'CODE_CD': '%', _like: true } })
      this.localData = res
      this.localData.forEach(d => {
        if (d.CQL_CHAR) d.CQL_CHAR = unstringify_char(d.CQL_CHAR)
        if (d.JSON_CHAR) d.JSON_CHAR = unstringify_json(d.JSON_CHAR)
      })
      this.selected = []
      this.SOMETHING_CHANGED = false
    },


    updateCQL_Data(val) {
      if (!val || !this.selected[0]) return false
      let ind = this.localData.findIndex(el => el.CQL_ID === val.CQL_ID)
      if (ind !== undefined) {
        this.localData[ind].JSON_CHAR = val.JSON_CHAR || ''
        this.localData[ind].CQL_CHAR = val.CQL_CHAR || ''
        this.localData[ind]._changed = true
        this.SOMETHING_CHANGED = true
      }
    },

    async save_UpdatedCQL_Data() {
      for (let item of this.localData) {
        if (item._changed === true) {
          let WHERE = { CQL_ID: item.CQL_ID }
          let SET = { CQL_CHAR: stringify_char(item.CQL_CHAR), JSON_CHAR: stringify_json(item.JSON_CHAR) }
          let res = await this.$store.dispatch('updateDB', { table: 'CQL_FACT', query_string: { set: SET, where: WHERE } })
        }
        item._changed = false
      }
      this.SOMETHING_CHANGED = false
      this.$q.notify('Speichern erfolgreich')
    },

    async addCQL(data) {
      if (!data || !data.CODE_CD) return
      data.CQL_CHAR = stringify_char(`library ${data.CODE_CD} version '1'\nparameter VALUE default 10\ncontext Unfiltered\ndefine AGE: VALUE > 0 and VALUE < 200`)
      let res = await this.$store.dispatch('addDB', { table: 'CQL_FACT', query_string: data })
      this.loadData()

      this.show_new = false
    },

    async delectCQL(DATA) {
      if (!DATA || ! await my_confirm(`Sollen ${DATA.length} Einträge wirklich gelöscht werden?`)) return
      // else
      for (let data of DATA) await this.$store.dispatch('deleteDB', { table: 'CQL_FACT', query_string: { CQL_ID: data.CQL_ID } })
      this.loadData()
    },

    async saveCQL(data) {
      if (!data || !data.CODE_CD) return
      const WHERE = { CQL_ID: data.CQL_ID }
      const SET = { CODE_CD: data.CODE_CD, NAME_CHAR: data.NAME_CHAR, CQL_BLOB: data.CQL_BLOB }
      let res = await this.$store.dispatch('updateDB', { table: 'CQL_FACT', query_string: { set: SET, where: WHERE } })
      this.loadData()
      console.log(data)

      this.show_edit = false
    },

    //ende methods
  }

}
</script>
