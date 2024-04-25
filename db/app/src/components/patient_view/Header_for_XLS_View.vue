<template template>

  <!-- HEADER -->
  <div class="col-1 row items-center">
    <div class="col-6 row items-center">
      <div class="col-4">
        <q-btn rounded color="dark" icon="tune" @click="editView()"><q-tooltip>Spalten ein-/ausblenden</q-tooltip></q-btn>
      </div>
      <div class=" col text-grey-7">
        {{ACTIVE_LAYOUT}}
      </div>
    </div>
    <div class="col-4 text-center row">
      <q-btn rounded color="dark" icon="filter_alt" @click="filterData()"><q-tooltip>Filter / Suchen</q-tooltip></q-btn>
      <div class="row">
        <q-btn icon="arrow_left" flat dense @click="PATIENTS_INDEX--" />
        <q-input :disable="$store.getters.SHOW_SPINNER" v-model.number.lazy="PATIENTS_INDEX" dense type="text" style="max-width: 60px" input-class="text-center" label="Page" />
        <q-btn icon="arrow_right" flat dense @click="PATIENTS_INDEX++" />
      </div>
      <q-input :disable="$store.getters.SHOW_SPINNER" v-model.number.lazy="PATIENTS_LIMIT" dense type="number" style="max-width: 80px" input-class="text-center" label="Pat./Page">
        <template v-slot:prepend>
          <q-icon name="info" size="xs"><q-tooltip>Große Werte beeinflussen die Ladezeit negativ </q-tooltip></q-icon>
        </template>
      </q-input>
    </div>
    <!-- CHANGE FONTSIZE -->
    <div class="col-2 text-right">
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
    },

    PATIENTS_LIMIT: {
      get() {
        return this.$store.getters.PATIENT_XLS_VIEWS.offset
      },
      set(val) {
        val = parseInt(val)
        if (val < 1 || val > this.$store.getters.PATIENT_XLS_VIEWS.count) return
        this.$store.getters.PATIENT_XLS_VIEWS.offset = val
        this.$store.getters.PATIENT_XLS_VIEWS.index = 0
        this.$emit('update_patients_info')
      }
    },

    PATIENTS_INDEX: {
      get() {
        return this.$store.getters.PATIENT_XLS_VIEWS.index + 1
      },
      set(val) {
        val = parseInt(val)
        if (val < 1 || (val * this.$store.getters.PATIENT_XLS_VIEWS.offset)> this.$store.getters.PATIENT_XLS_VIEWS.count) return
        this.$store.getters.PATIENT_XLS_VIEWS.index = val - 1
        this.$emit('update_patients_info')
      }
    }

  },

  methods: {
    // METHODS

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
