<template template>

  <!-- FOOTER -->
  <div class="col-1 row items-center q-pt-sm">
    <div class="col-4 q-gutter-x-md">
      <q-btn icon="person_add" rounded color="dark" @click="show_add_person = true"><q-tooltip>Neuen Patienten hinzufügen</q-tooltip></q-btn>
      <q-btn icon="create_new_folder" rounded color="dark" @click="addVisit()"><q-tooltip>Neue Visite hinzufügen</q-tooltip></q-btn>
      <q-btn icon="post_add" rounded color="dark" @click="show_add_column = true"><q-tooltip>Neue Spalte hinzufügen</q-tooltip></q-btn>

      <q-btn icon="more_vert" rounded color="dark" class="q-ml-xl">
        <q-menu fit>
          <q-list style="min-width: 100px">
            
            <!-- VISITE BEARBEITEN -->
            <q-item clickable v-close-popup @click="commingSoon()">
              <q-item-section side><q-icon name="edit"/></q-item-section>
              <q-item-section>Aktive Visite bearbeiten</q-item-section>
            </q-item>

            <!-- Patienten BEARBEITEN -->
            <q-item clickable v-close-popup @click="commingSoon()">
              <q-item-section side><q-icon name="edit"/></q-item-section>
              <q-item-section>Aktiven Patienten bearbeiten</q-item-section>
            </q-item>

            <q-separator />

            <!-- VISITE LÖSCHEN -->
            <q-item clickable v-close-popup @click="commingSoon()">
              <q-item-section side><q-icon name="delete"/></q-item-section>
              <q-item-section>Visite löschen</q-item-section>
            </q-item>

            <!-- Patienten LÖSCHEN -->
            <q-item clickable v-close-popup @click="commingSoon()">
              <q-item-section side><q-icon name="delete"/></q-item-section>
              <q-item-section>Patienten löschen</q-item-section>
            </q-item>

            <q-separator />

            <!-- DATEN HERUNTERLADEN -->
            <q-item clickable v-close-popup @click="commingSoon()">
              <q-item-section side><q-icon name="download"/></q-item-section>
              <q-item-section>Export in CSV</q-item-section>
            </q-item>
          </q-list> 
        </q-menu>
      </q-btn>

    </div>

    <div class="col-4 text-center">
      <q-btn :icon="FULL_MODE ? 'fullscreen' : 'fullscreen_exit'" color="dark" rounded @click="FULL_MODE = !FULL_MODE"><q-tooltip>Vollbild umschalten</q-tooltip></q-btn>
    </div>

    <div class="col-4 text-left">
      <div class="text-caption text-grey-8" style="line-height: 10px;">
        Patients: {{ localData ? localData.length : 0 }} | Visits: {{ localData ? localData.reduce((acc, item) => acc +
          item.VISITS.length, 0) : 0 }} | Observations: {{ localData ? localData.reduce((acc, item) => acc +
          item.VISITS.reduce((acc, item) => acc + item.OBSERVATIONS.length, 0), 0) : 0 }}
          | Spalten: {{ col_count }}
        <div v-if="hide_col_keys.length > 0">
          | Versteckt: {{ hide_col_keys.length }}
          <q-btn class="text-black" size="xs" dense icon="visibility" flat
            @click="$emit('clear_hide_cols')"><q-tooltip>Zeige
              alle Spalten an</q-tooltip></q-btn>
        </div>
      </div>
    </div>
    <!-- ENDE FOOTER -->

    <!-- DIALOGS -->
    <ADD_PERSON_DIALOG v-if="show_add_person" :data="show_add_person" @close="show_add_person = false" @refresh="show_add_person = false; this.$emit('refresh')"/>

    <ADD_COL_DIALOG v-if="show_add_column" :data="show_add_column" @close="show_add_column = false" @col_selected="colSelected($event)"/>

    <ADD_VISIT_DIALOG v-if="show_add_visit" :data="show_add_visit" @close="show_add_visit = false" @refresh="show_add_visit = false; this.$emit('refresh')"/>
  </div>

</template>

<script>

import ADD_PERSON_DIALOG from 'src/components/patient_view/AddPerson_Dialog.vue'
import ADD_COL_DIALOG from 'src/components/patient_view/AddCol_Dialog.vue'
import ADD_VISIT_DIALOG from 'src/components/patient_view/AddVisit_Dialog.vue'

export default {
  name: 'Footer_for_XLS_View',

  props: ['localData', 'hide_col_keys', 'col_count', 'full_mode'],
  components: { ADD_PERSON_DIALOG, ADD_COL_DIALOG, ADD_VISIT_DIALOG },

  data() {
    return {
      show_add_person: false,
      show_add_visit: false,
      show_add_column: false
      
    }
  },

  mounted() {
  },

  computed: {
    FULL_MODE:{
      get() {
        return this.full_mode
      },
      set(val) {
        this.$emit('toggleFullScreen', val)
      }
    }
  },

  methods: {
    // METHODS
    colSelected(item) {
      if (!item) return
      this.$emit('addColumn', {label: item.NAME_CHAR, value: item.CONCEPT_CD})
      this.show_add_column = false; 
    },

    addVisit() {
      this.show_add_visit = false
      if (!this.$store.getters.PATIENT_PINNED) {
        this.$q.notify({type: 'warning', message: 'Bitte wählen Sie einen Patienten aus! (Klicken Sie auf die ID des Patienten in der Tabelle)'})
        return
      }
      this.show_add_visit = true
    },

    commingSoon() {
      this.$q.notify({
        message: 'In Kürze verfügbar',
        type: 'warning',
        position: 'bottom',
        timeout: 1000
      })
    }

    // ENDE METHODS
  }

}
</script>
