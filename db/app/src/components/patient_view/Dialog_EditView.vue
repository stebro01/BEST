<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Bearbeite Layout / Views
      </q-card-section>
      <q-card-section>
        <q-form class="row justify-center">
          <!-- BTN CLEAR -->
          <q-btn class="col-2" icon="clear" dense flat @click="resetView()" />
          <!-- SELECT VIEW -->
          <q-select v-if="options_view.length > 0" class="col-8 q-my-xs" filled dense v-model="selected_view"
            :options="options_view" label="View-Layouts" @update:model-value="selectLayout(selected_view)" />
          <!-- BTN ADD -->
          <div class="col-2" style="position: relative">
            <q-btn class="absolute-center" color="primary" icon="more_vert" dense flat>
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <!-- UPDATE -->
                  <q-item
                    v-if="LAYOUT_CHANGED && LIST_FILTERED.length > 0 && $store.getters.PATIENT_VIEW.active_layout_value"
                    clickable v-close-popup @click="updateLayout()">
                    <q-item-section side><q-icon name="save" /></q-item-section>
                    <q-item-section>Speichere Layout</q-item-section>
                  </q-item>
                  <!-- NEW -->
                  <q-item v-if="LIST_FILTERED.length > 0" clickable v-close-popup @click="addLayout()">
                    <q-item-section side><q-icon name="add" /></q-item-section>
                    <q-item-section>Neues Layout erstellen</q-item-section>
                  </q-item>

                  <q-separator />

                  <!-- RENAME -->
                  <q-item v-if="$store.getters.PATIENT_VIEW.active_layout_value" clickable v-close-popup
                    @click="renameLayout()">
                    <q-item-section side><q-icon name="edit" /></q-item-section>
                    <q-item-section>Umbenennen</q-item-section>
                  </q-item>

                  <!-- DELETE -->
                  <q-item v-if="$store.getters.PATIENT_VIEW.active_layout_value" clickable v-close-popup
                    @click="deleteLayout()">
                    <q-item-section side><q-icon name="delete" /></q-item-section>
                    <q-item-section>Löschen</q-item-section>
                  </q-item>

                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-form>

      </q-card-section>

      <q-card-section>
        <div class="text-caption text-center bg-grey-2">Observations: {{ LIST_FILTERED.length }}</div>
        <q-scroll-area style="width: 100%; height: 300px;" class="shadow-1">
          <q-list dense>
            <q-item v-for="(item, ind_item) in LIST_FILTERED" :key="item.value" v-ripple>
              <q-item-section side>
                <!-- BUttoN UM EIN ELEMENT NACH UNTEN ZU BEWEGEN -->
                <q-btn v-if="ind_item > 0" icon="arrow_upward" dense size="sm" flat @click="moveItemUp(item)" />
                <q-btn v-if="LIST_FILTERED.length - 1 > ind_item" icon="arrow_downward" dense size="sm" flat
                  @click="moveItemDown(item)" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label v-if="item.value !== item.label" caption>{{ item.value }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn icon="clear" flat @click="removeItem(item.label)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn label="Schließen" no-caps rounded @click="$emit('close')" />
        <q-btn v-if="LAYOUT_CHANGED" label="Anwenden" no-caps color="primary" rounded @click="updateView(); $emit('close')"></q-btn>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>

import { unstringify } from 'src/classes/sqltools'
import { my_confirm, my_prompt } from 'src/tools/my_dialog'

export default {
  name: 'Dialog_EditView',

  props: ['data'],

  components: {},

  data() {
    return {
      show_dialog: false,
      localData: undefined,
      selected_view: undefined,
      options_view: [],
      selected_view_cols: undefined,
    }
  },

  mounted() {
    if (!this.data) return this.$emit('close')
    this.loadData()

  },

  computed: {

    LIST_FILTERED() {
      return this.LIST_WITH_COLS.filter(item => !this.BLOCKED_ITEMS.includes(item.value))
    },

    LIST_WITH_COLS() {
      if (!this.selected_view_cols) return this.localData.col_keys
      return this.selected_view_cols
    },

    LAYOUT_CHANGED: {
            get() {
                return this.$store.getters.PATIENT_VIEW.layout_changed
            },
            set(val) {
                this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", val)
            }
        },

    BLOCKED_ITEMS() {
      return ['PATIENT_CD', 'BIRTH_DATE', 'ENCOUNTER_NUM', 'START_DATE', 'VISIT_BLOB']
    }

  },

  methods: {
    resetView() {
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
      this.selected_view = undefined;
      this.selectLayout(undefined)
      this.localData = JSON.parse(JSON.stringify(this.data))
    },

    async loadData() {
      this.localData = JSON.parse(JSON.stringify(this.data))
      const res_layouts = this.$store.getters.PATIENT_VIEW.LAYOUTS
      if (res_layouts && res_layouts.length > 0) this.options_view = res_layouts.slice(1)
      else {
        await this.$store.dispatch('initLayout')
        this.options_view = this.$store.getters.PATIENT_VIEW.LAYOUTS.slice(1)
      }

      if (this.$store.getters.PATIENT_VIEW.active_layout_value) {
        //finde im array mit werten {label, value} den index des aktiven layouts
        const val = this.options_view.find(item => item.value === this.$store.getters.PATIENT_VIEW.active_layout_value)
        this.selected_view = val
        if (!this.$store.getters.PATIENT_VIEW.active_layout || this.$store.getters.PATIENT_VIEW.active_layout.length < 1) await this.selectLayout(this.selected_view)
        else {
          this.selected_view_cols = JSON.parse(JSON.stringify(this.$store.getters.PATIENT_VIEW_COLUMNS))
          const ACTIVE_LAYOUT_REMAPPED = this.$store.getters.PATIENT_VIEW.active_layout.map(item => {
            return { label: item.CONCEPT_NAME_CHAR, value: item.CONCEPT_CD }
          })
          this.selected_view_cols = [...this.selected_view_cols, ...ACTIVE_LAYOUT_REMAPPED]
        }
      }
      this.show_dialog = true
    },

    async selectLayout(item) {
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
      if (!item) {
        this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', undefined)
        this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_SET', [])
        this.selected_view_cols = undefined
      }
      else {
        this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', item.value)
        await this.loadViewFromDB(item)
        var NEW_COLS = JSON.parse(JSON.stringify(this.$store.getters.PATIENT_VIEW_COLUMNS))
        const ACTIVE_LAYOUT_REMAPPED = this.$store.getters.PATIENT_VIEW.active_layout.map(item => {
          return { label: item.CONCEPT_NAME_CHAR, value: item.CONCEPT_CD }
        })

        NEW_COLS = [...NEW_COLS, ...ACTIVE_LAYOUT_REMAPPED]
        this.selected_view_cols = NEW_COLS
      }

      this.updateView()
    },

    async loadViewFromDB(item) {
      const res = await this.$store.dispatch('searchDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: item.value, _columns: ['CODE_CD', 'LOOKUP_BLOB'] } })
      if (res && res.length > 0) this.$store.commit("PATIENT_VIEW_ACTIVE_LAYOUT_SET", JSON.parse(unstringify(res[0].LOOKUP_BLOB)))
    },

    removeItem(item) {
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", true)
      if (this.selected_view_cols) this.selected_view_cols = this.selected_view_cols.filter(col => col.label !== item)
      else this.localData.col_keys = this.localData.col_keys.filter(col => col.label !== item)
    },

    moveItemDown(item) {
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", true)

      if (!this.selected_view_cols) this.moveDown(this.localData.col_keys, item)
      else this.moveDown(this.selected_view_cols, item)
    },

    moveDown(cols, item) {
      let index = cols.indexOf(item)
      if (index < cols.length - 1) {
        let temp = cols[index]
        cols[index] = cols[index + 1]
        cols[index + 1] = temp
      }
    },

    moveItemUp(item) {
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", true)
      if (!this.selected_view_cols) this.moveUp(this.localData.col_keys, item)
      else this.moveUp(this.selected_view_cols, item)
    },

    moveUp(cols, item) {
      let index = cols.indexOf(item)
      if (index > 0) {
        let temp = cols[index]
        cols[index] = cols[index - 1]
        cols[index - 1] = temp
      }
    },

    updateView() {
      const layout = this.LIST_WITH_COLS
      this.$emit('updateView', layout)
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
    },

    // LAYOUTS
    // rename
    async renameLayout() {
      if (!this.$store.getters.PATIENT_VIEW.active_layout_value) return this.$q.notify({ type: 'warning', message: 'Kein Layout ausgewählt' })
      // ELSE
      var answ = await my_prompt(`Bitte neuen Namen eingeben`)
      if (!answ || answ.length < 1) return this.$q.notify({ type: 'warning', message: 'Kein Name eingegeben' })
      // ELSE
      const res = await this.$store.dispatch('updateDB', { table: 'CODE_LOOKUP', query_string: { where: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: this.$store.getters.PATIENT_VIEW.active_layout_value }, set: { NAME_CHAR: answ.trim() } } })
      if (res) {
        await this.$store.dispatch('initLayout')
        this.options_view = this.$store.getters.PATIENT_VIEW.LAYOUTS.slice(1)
        this.$q.notify({ type: 'positive', message: 'Layout erfolgreich umbenannt' })
        this.selected_view = this.options_view.find(item => item.value === this.$store.getters.PATIENT_VIEW.active_layout_value)
      }
      else {
        this.$q.notify({ type: 'negative', message: 'Fehler beim Umbenennen des Layouts' })
      }
    },

    // delete
    async deleteLayout() {
      if (!this.$store.getters.PATIENT_VIEW.active_layout_value) return this.$q.notify({ type: 'warning', message: 'Kein Layout ausgewählt' })
      // ELSE
      if (!await my_confirm('Sind Sie sicher, dass Sie das Layout löschen möchten?')) return

      const res = await this.$store.dispatch('deleteDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: this.$store.getters.PATIENT_VIEW.active_layout_value } })
      if (res) {
        await this.$store.dispatch('initLayout')
        this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', undefined)
        this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_SET', [])
        this.options_view = this.$store.getters.PATIENT_VIEW.LAYOUTS.slice(1)
        this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gelöscht' })
        this.selected_view = undefined
        this.selectLayout(undefined)
      }
      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)

    },

    // update
    async updateLayout() {
      if (!this.$store.getters.PATIENT_VIEW.active_layout_value) return this.$q.notify({ type: 'warning', message: 'Kein Layout ausgewählt' })
      if (!await my_confirm('Sind Sie sicher, dass Sie das Layout speichern möchten?')) return
      // ELSE
      // MAP {label, value} to {CONCEPT_NAME_CHAR, CONCEPT_CD}
      const active_layout_value = this.LIST_FILTERED.map(item => { return { CONCEPT_NAME_CHAR: item.label, CONCEPT_CD: item.value } })

      const res = await this.$store.dispatch('updateLayout', { value: this.$store.getters.PATIENT_VIEW.active_layout_value, DATA: active_layout_value })

      if (res && res.status) this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
      else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })
      // update layout
      await this.$store.dispatch('initLayout')

      this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)

    },

    // add
    async addLayout() {
      var answ = await my_prompt(`Bitte neuen Namen eingeben`)
      if (!answ || answ.length < 1) return this.$q.notify({ type: 'warning', message: 'Kein Name eingegeben' })

      // MAP {label, value} to {CONCEPT_NAME_CHAR, CONCEPT_CD}
      const active_layout_value = this.LIST_FILTERED.map(item => { return { CONCEPT_NAME_CHAR: item.label, CONCEPT_CD: item.value } })
      const res = await this.$store.dispatch('updateLayout', { value: answ.trim(), DATA: active_layout_value })

      if (res && res.status) this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
      else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })
      // update layout
      await this.$store.dispatch('initLayout')
      this.options_view = this.$store.getters.PATIENT_VIEW.LAYOUTS.slice(1)

    }

  }


}
</script>
