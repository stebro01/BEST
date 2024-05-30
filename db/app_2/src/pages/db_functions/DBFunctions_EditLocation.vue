<template>
  <q-page>
    <MainSlot :no_options="true">
     <!-- HEADING -->
     <template v-slot:header>
        <HEADING :title="'Locations bearbeiten'" :img="'concept-import-logo.png'" :icon="'person_pin'"/>
      </template>

      
      <!-- MAIN -->
      <template v-slot:main>
        <FILTER_BOX class="absolute-top-right" :filter="filter" @update="filter = $event"/>
        <!-- LOCATION -->
      <q-table
        title="Locations"
        class="my-table q-mt-xl"
        :rows="LOCATION_CD"
        row-key="CODE_CD"
        :columns="columns_LOCATION_CD"
        dense
        :rows-per-page-options="[10, 25, 50, 100]"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected_LOCATION_CD"
      >
      
      </q-table>

      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <!-- LOCATOIN_CD -->
      <BOTTOM_BUTTONS
        :show_edit="selected_LOCATION_CD.length === 1" :show_delete="selected_LOCATION_CD.length > 0" :show_add="selected_LOCATION_CD.length === 0"
        @edit="edit_LOCATION_CD()"
        @delete="delete_LOCATION_CD()"
        @add="add_LOCATION_CD()"
      />

      </template>
    </MainSlot>

    <!-- DIALOGs -->
    <!-- EDIT LOCATION -->
    <EDIT_LOCATION v-if="show_LOCATION_CD_dialog" :active="show_LOCATION_CD_dialog" @close="show_LOCATION_CD_dialog = false" :title="'Location bearbeiten'" :item="selected_LOCATION_CD[0]" :mode="'edit'" @save="save_LOCATION_CD($event)"/>
    <!-- ADD LOCATION -->
    <EDIT_LOCATION v-if="show_LOCATION_CD_dialog_new" :active="show_LOCATION_CD_dialog_new" @close="show_LOCATION_CD_dialog_new = false" :title="'Location neu'" :item="{}" :mode="'add'" @save="save_new_LOCATION_CD($event)"/>
  </q-page>
</template>

<script>


import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'
import EDIT_LOCATION from 'src/components/elements/EditLocation.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'DBFunctions_EditLocationProvider',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, MainSlot, EDIT_LOCATION },

  data() {
    return {
      tab: 'provider',
      filter: undefined,
      // LOCATION_CD
      selected_LOCATION_CD: [],
      LOCATION_CD: [],
      columns_LOCATION_CD: [
        { name: 'CODE_CD', align: 'center', label: 'ID', field: 'CODE_CD', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'Name', field: 'NAME_CHAR', sortable: true },
        { name: 'LOOKUP_BLOB', align: 'center', label: 'Details', field: 'LOOKUP_BLOB', sortable: true },
      ],
      show_LOCATION_CD_dialog: false,
      show_LOCATION_CD_dialog_new: false,

    }
  },

  mounted() {
   this.loadData_LOCATION_CD()
  },

  watch: {


  },

  computed: {
    
  },

  methods: {
    // LOCATION_CD
    loadData_LOCATION_CD() {
      this.$store.dispatch('searchDB', { query_string: {COLUMN_CD: 'LOCATION_CD'}, table: "CODE_LOOKUP"})
      .then(res => this.LOCATION_CD = res)
    },


    async delete_LOCATION_CD() {
      if (!await my_confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      for (let item of this.selected_LOCATION_CD) {
        await this.$store.dispatch('deleteDB', {query_string: {CODE_CD: item.CODE_CD}, table: 'CODE_LOOKUP'})
        this.selected_LOCATION_CD = []
      }

      // finally reload
      this.loadData_LOCATION_CD()

    },


    edit_LOCATION_CD() {
      this.show_LOCATION_CD_dialog = true
    },

    async save_LOCATION_CD(item) {
      if (!item || !item.NAME_CHAR || !item.CODE_CD) return
      const res = await this.$store.dispatch('updateDB', {query_string: {where: {CODE_CD: item.CODE_CD}, set: {NAME_CHAR: item.NAME_CHAR, LOOKUP_BLOB: item.LOOKUP_BLOB}}, table: 'CODE_LOOKUP'})
      this.loadData_LOCATION_CD()
      this.selected_LOCATION_CD = []
      this.show_LOCATION_CD_dialog = false
    },

    add_LOCATION_CD() {
      this.show_LOCATION_CD_dialog_new = true
    },

     save_new_LOCATION_CD(item) {
      if (!item || !item.NAME_CHAR || !item.CODE_CD) return
      this.$store.dispatch('addDB', {query_string: {...item, TABLE_CD: 'VISIT_DIMENSION', COLUMN_CD: 'LOCATION_CD'}, table: 'CODE_LOOKUP'})
      .then(() => {
        this.loadData_LOCATION_CD()
        this.show_LOCATION_CD_dialog_new = false
      }).catch(err => this.$q.notify('Etwas ging schief, DB vermutlich nicht erreichbar / gespeert'))
        
    },

    
  }

}
</script>
