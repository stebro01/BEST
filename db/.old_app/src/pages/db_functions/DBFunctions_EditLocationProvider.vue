<template>
  <q-page>
    <MainSlot>
     <!-- HEADING -->
     <template v-slot:header>
        <HEADING :title="'Locations und Provider bearbeiten'" :img="'concept-import-logo.png'" :icon="'person_pin'"/>
      </template>

      <!-- OPTIONS -->
      <template v-slot:options_left>
        <div class="float float-right">
        <q-tabs
          v-model="tab"
        >
        <q-tab name="locations" icon="place" label="Locations" />
      </q-tabs>
    </div>
      </template>
      <template v-slot:options_right>
        <div class="float float-left">
          <q-tabs v-model="tab" >
            <q-tab name="provider" icon="person_pin_circle" label="Untersucher" />
          </q-tabs>
        </div>
      </template>
      <!-- MAIN -->
      <template v-slot:main>
        <FILTER_BOX class="absolute-top-right" :filter="filter" @update="filter = $event"/>
        <!-- LOCATION -->
      <q-table v-if="tab==='locations'"
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

       <!-- PROVIDER -->
       <q-table v-if="tab==='provider'"
        title="Untersucher"
        class="my-table q-mt-xl"
        :rows="PROVIDER_DIMENSION"
        row-key="PROVIDER_ID"
        :columns="columns_PROVIDER_DIMENSION"
        dense
        :rows-per-page-options="[10, 25, 50, 100]"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected_PROVIDER_DIMENSION"
      >
      
      </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <!-- LOCATOIN_CD -->
      <BOTTOM_BUTTONS  v-if="tab==='locations'"
        :show_edit="selected_LOCATION_CD.length === 1" :show_delete="selected_LOCATION_CD.length > 0" :show_export="selected_LOCATION_CD.length > 0" :show_add="selected_LOCATION_CD.length === 0"
        @edit="edit_LOCATION_CD()"
        @delete="delete_LOCATION_CD()"
        @export="export_LOCATION_CD()"
        @add="add_LOCATION_CD()"
      />
      <!-- PROVIDER -->
      <BOTTOM_BUTTONS  v-if="tab==='provider'"
        :show_edit="selected_PROVIDER_DIMENSION.length === 1" :show_delete="selected_PROVIDER_DIMENSION.length > 0" :show_export="selected_PROVIDER_DIMENSION.length > 0" :show_add="selected_PROVIDER_DIMENSION.length === 0"
        @edit="edit_PROVIDER_DIMENSION()"
        @delete="delete_PROVIDER_DIMENSION()"
        @export="export_PROVIDER_DIMENSION()"
        @add="add_PROVIDER_DIMENSION()"
      />
      </template>
    </MainSlot>

    <!-- DIALOGs -->
    <!-- EDIT LOCATION -->
    <EDIT_LOCATION v-if="show_LOCATION_CD_dialog" :active="show_LOCATION_CD_dialog" @close="show_LOCATION_CD_dialog = false" :title="'Location bearbeiten'" :item="selected_LOCATION_CD[0]" :mode="'edit'" @save="save_LOCATION_CD($event)"/>
    <!-- ADD LOCATION -->
    <EDIT_LOCATION v-if="show_LOCATION_CD_dialog_new" :active="show_LOCATION_CD_dialog_new" @close="show_LOCATION_CD_dialog_new = false" :title="'Location neu'" :item="{}" :mode="'add'" @save="save_new_LOCATION_CD($event)"/>
    <!-- ADD PROVIDER -->
    <EDIT_PROVIDER v-if="show_PROVIDER_DIMENSION_dialog_new" :active="show_PROVIDER_DIMENSION_dialog_new" @close="show_PROVIDER_DIMENSION_dialog_new = false" :title="'Provider neu'" :item="{}" :mode="'add'" @save="save_new_PROVIDER_DIMENSION($event)"/>
    <!-- EDIT Provider -->
    <EDIT_PROVIDER v-if="show_PROVIDER_DIMENSION_dialog" :active="show_PROVIDER_DIMENSION_dialog" @close="show_PROVIDER_DIMENSION_dialog = false" :title="'Provider bearbeiten'" :item="selected_PROVIDER_DIMENSION[0]" :mode="'edit'" @save="save_PROVIDER_DIMENSION($event)"/>

  </q-page>
</template>

<script>


import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'
import EDIT_LOCATION from 'src/components/elements/EditLocation.vue'
import EDIT_PROVIDER from 'src/components/elements/EditProvider.vue'
export default {
  name: 'DBFunctions_EditLocationProvider',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, MainSlot, EDIT_LOCATION, EDIT_PROVIDER },

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
      // PROVIDER_DIMENSION
      selected_PROVIDER_DIMENSION: [],
      PROVIDER_DIMENSION: [],
      columns_PROVIDER_DIMENSION: [
        { name: 'PROVIDER_ID', align: 'center', label: 'ID', field: 'PROVIDER_ID', sortable: true },
        { name: 'PROVIDER_PATH', align: 'center', label: 'Path', field: 'PROVIDER_PATH', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'Name', field: 'NAME_CHAR', sortable: true },
        { name: 'CONCEPT_BLOB', align: 'center', label: 'Beschreibung', field: 'CONCEPT_BLOB', sortable: true },
      ],
      show_PROVIDER_DIMENSION_dialog: false,
      show_PROVIDER_DIMENSION_dialog_new: false,
    }
  },

  mounted() {
   this.loadData_LOCATION_CD()
   this.loadData_PROVIDER_DIMENSION()
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

    // PROVIDER_DIMENSION
    loadData_PROVIDER_DIMENSION() {
      this.$store.dispatch('searchDB', { query_string: {PROVIDER_PATH: '%', _like:true}, table: "PROVIDER_DIMENSION"})
      .then(res => this.PROVIDER_DIMENSION = res)
    },

    async delete_LOCATION_CD() {
      if (!confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      for (let item of this.selected_LOCATION_CD) {
        await this.$store.dispatch('deleteDB', {query_string: {CODE_CD: item.CODE_CD}, table: 'CODE_LOOKUP'})
        this.selected_LOCATION_CD = []
      }

      // finally reload
      this.loadData_LOCATION_CD()

    },

    async delete_PROVIDER_DIMENSION() {
      if (!confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      for (let item of this.selected_PROVIDER_DIMENSION) {
        await this.$store.dispatch('deleteDB', {query_string: {PROVIDER_ID: item.PROVIDER_ID}, table: 'PROVIDER_DIMENSION'})
        this.selected_PROVIDER_DIMENSION = []
      }

      // finally reload
      this.loadData_PROVIDER_DIMENSION()

    },

    export_LOCATION_CD() {
      this.$q.notify(this.$store.getters.TEXT.msg.comming_soon)
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

    add_PROVIDER_DIMENSION() {
      this.show_PROVIDER_DIMENSION_dialog_new = true
    },

     save_new_PROVIDER_DIMENSION(item) {
      if (!item || !item.NAME_CHAR || !item.PROVIDER_ID) return
      this.$store.dispatch('addDB', {query_string: item, table: 'PROVIDER_DIMENSION'})
      .then(() => {
        this.loadData_PROVIDER_DIMENSION()
        this.show_PROVIDER_DIMENSION_dialog_new = false
      }).catch(err => {
        if (typeof(err) === 'string') this.$q.notify(err)
        else this.$q.notify('Etwas ging schief, DB vermutlich nicht erreichbar / gespeert')
      })
        
    },

    edit_PROVIDER_DIMENSION() {
      this.show_PROVIDER_DIMENSION_dialog = true
    },

    async save_PROVIDER_DIMENSION(item) {
      if (!item || !item.NAME_CHAR || !item.PROVIDER_ID) return
      if (!item.CONCEPT_BLOB || item.CONCEPT_BLOB === '' || item.CONCEPT_BLOB === null) item.CONCEPT_BLOB = 'NULL'
      const res = await this.$store.dispatch('updateDB', {query_string: {where: {PROVIDER_ID: item.PROVIDER_ID}, set: {PROVIDER_PATH: item.PROVIDER_PATH, NAME_CHAR: item.NAME_CHAR, CONCEPT_BLOB: item.CONCEPT_BLOB, SOURCESYSTEM_CD: "NULL"}}, table: 'PROVIDER_DIMENSION'})
      this.loadData_PROVIDER_DIMENSION()
      this.selected_PROVIDER_DIMENSION = []
      this.show_PROVIDER_DIMENSION_dialog= false
    },


    
  }

}
</script>
