<template template>

  <!-- HEADER -->
  <div class="col-1 row items-center">
    <div class="col-6 q-gutter-x-md row items-center">

      <q-btn rounded color="dark" icon="tune" @click="editView()"><q-tooltip>Spalten ein-/ausblenden</q-tooltip></q-btn>
      <div class="text-grey-7">
        {{ACTIVE_LAYOUT}}
      </div>
    </div>
    <div class="col-1 text-center">
      <q-btn rounded color="dark" icon="filter_alt" @click="filterData()"><q-tooltip>Filter / Suchen</q-tooltip></q-btn>
    </div>
    <!-- CHANGE FONTSIZE -->
    <div class="col-5 text-right">
      <q-btn size="md" dense icon="restart_alt" flat class="q-mr-md" @click="$emit('reset')"><q-tooltip>Lade Daten neu
          und stelle Standardsichten wieder her</q-tooltip></q-btn>
      <q-btn size="md" dense icon="zoom_in" flat @click="$emit('zoom_in')" />
      <q-btn size="md" dense icon="zoom_out" flat @click="$emit('zoom_out')" />
    </div>

    <!-- DIALOGS  -->
    <DIALOG_EDIT_VIEW v-if="show_edit_view" @close="show_edit_view = false" :data="localData" @updateView="updateView($event)"/>

    <DIALOG_EDIT_SQL v-if="show_edit_sql" @close="show_edit_sql = false" @update_sql="$emit('update_sql')"/>

  </div>
  <!-- HEADER -->

</template>

<script>

import DIALOG_EDIT_VIEW from 'src/components/patient_view/Dialog_EditView.vue'
import DIALOG_EDIT_SQL from 'src/components/patient_view/Dialog_EditSQL.vue'

export default {
  name: 'Header_for_XLS_View',

  props: ['col_keys', 'hide_col_keys'],
  components: { DIALOG_EDIT_VIEW, DIALOG_EDIT_SQL },

  data() {
    return {
      localData: {},
      show_edit_view: false,
      show_edit_sql: false
    }
  },

  mounted() {
    this.loadData()
  },

  computed: {
    ACTIVE_LAYOUT() {
      if (!this.$store.getters.PATIENT_VIEW.active_layout_value) return 'alle Spalten aktiv'
      //
      //find the entry in the LAYOUTS
      let layout = this.$store.getters.PATIENT_VIEW.LAYOUTS.find(l => l.value === this.$store.getters.PATIENT_VIEW.active_layout_value)
      if (layout) return `Layout: ${layout.label}`
      return ''
    }

  },


  methods: {
    // METHODS
    commingSoon() {
      this.$q.notify({
        message: 'In Kürze verfügbar',
        type: 'warning',
        position: 'bottom',
        timeout: 1000
      })
    },

    async loadData() {


    },

    editView() {
      this.localData = {
        col_keys: this.col_keys,
        hide_col_keys: this.hide_col_keys
      }
      this.show_edit_view = true
    },

    updateView(layout) {
      // this.show_edit_view = false
      this.$emit('updateView', layout)
    },

    filterData() {
      this.show_edit_sql = true
    }

    // ENDE METHODS
  }


}
</script>
