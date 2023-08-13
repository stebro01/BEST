<template>
  <q-page class="">
    <q-resize-observer @resize="onResize($event, 'main_size')" />

    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Patienten bearbeiten / Modern View'" :img="'db-queries-logo.png'" :icon="'wysiwyg'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="column" :style="MAIN_STYLE">
          <!-- HEADER -->
          <div class="col-2 q-pa-sm">
            <div class="row ">
              <div class="col-8"><q-input dense input-class="text-left" input-style="font-family: 'Courier', monospace;"
                  filled v-model="param.sql_query" label="SQL Statement" /></div>
              <div class="col"><q-btn class="q-ml-md my-btn" @click="runSQLStatement(param.sql_query)">laden</q-btn></div>
            </div>
          </div>
          <!-- MAIN -->
          <div class="col">
            <div class="row justify-center fit">
              <!-- PATIENTLIST -->
              <div class="col-3" >
                <q-resize-observer @resize="onResize($event, 'patientlist_size')" />
                <PATIENT_LIST :patients="localData.PATIENTS" :size="param.patientlist_size" @clicked="patientClicked($event)" />
              </div>
              <!-- MAIN -->
              <div class="col-9 column" v-if="$store.getters.PATIENT_PINNED">
                <div class="col-2" >
                  <VISIT_LIST />
                </div>
                <div class="col-10">
                  <q-resize-observer @resize="onResize($event, 'observationlist_size')" />
                  <OBSERVATION_LIST :param="param" @update_layout="updateLayout($event)"/>
                </div>
              </div>

            </div>
          </div>
        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <div class="row float-right fit q-mt-xs">
          <!-- TOGGLE PROTECTED -->
          <div class="col-1" style="min-width: 50px">
            <q-toggle size="xs" v-model="param.protected" checked-icon="lock_open"
              unchecked-icon="lock"><q-tooltip>Bearbeiten an / aus</q-tooltip>
            </q-toggle>
          </div>
          <!-- TOGGLE SHOW HIDEN -->
          <div class="col-1" style="min-width: 50px">
            <q-toggle size="xs" v-model="param.show_hide" checked-icon="visibility"
              unchecked-icon="visibility_off"><q-tooltip>Verstecke Elemente anzeigen / nicht anzeigen</q-tooltip>
            </q-toggle>
          </div>

          <!-- BTN SELECT LAYOUT -->
          <div class="col-5" v-if="LAYOUTS">
            <q-btn-dropdown size="sm" dense flat no-caps :label="LAYOUT_LABEL" class="bg-accent q-pt-sm">
              <q-list>
                <q-item v-for="(item, ind) of LAYOUTS" :key="ind + item.value" clickable v-close-popup
                  @click="selectLayout(item)">
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <span class="q-gutter-x-md">
              <q-btn v-if="param.layout.show_update_btn" dense no-caps flat class="bg-positive" @click="btnUpdateLayout()">update</q-btn>
              <q-btn v-if="param.layout.show_save_btn" dense no-caps flat class="bg-positive" @click="btnSaveLayout()">neu</q-btn>
              <q-btn v-if="param.layout.show_update_btn || param.layout.show_save_btn" @click="param.layout.show_save_btn = false; param.layout.show_update_btn = false" flat icon="close"><q-tooltip>Änderungen nicht übernehmen</q-tooltip></q-btn>
            </span>
          </div>
          
        </div>
      </template>

    </MainSlot>

  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import PATIENT_LIST from 'src/components/patient_view/PatientList.vue'
import VISIT_LIST from 'src/components/patient_view/VisitList.vue'
import OBSERVATION_LIST from 'src/components/patient_view/ObservationList.vue'

import { unstringify } from 'src/classes/sqltools'
import {my_prompt} from 'src/tools/my_dialog'

export default {
  name: 'DBQueries_PatientView',

  components: { HEADING, MainSlot, PATIENT_LIST, VISIT_LIST, OBSERVATION_LIST },

  data() {
    return {
      options: this.$store.getters.ENV.options_db_queries,
      param: {
        show_hide: false,
        protected: false,
        layout: {
          show_update_btn: false,
          show_save_btn: false,
          value: undefined,
          DATA: undefined
        },
        layout_options: [{value: '1', label: 'NOT LOADED'}],
        sql_query: 'SELECT * FROM PATIENT_DIMENSION',
        filter_patient: undefined,
        main_size: undefined,
        patientlist_size: undefined,
        observationlist_size: undefined
      },
      localData: {
        PATIENTS: undefined
      }
    }
  },

  mounted() {
    this.runSQLStatement(this.param.sql_query)
    this.param.layout.value = this.LAYOUTS[0].value

    // load the layouts
    this.initLayouts()
  },

  watch: {
    ACTIVE_LAYOUT(val) {
      if (!val || val === '1') return
      this.loadLayout(val)
    }

  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    },
    LAYOUTS() {
      if (!this.param.layout_options) return undefined
      return this.param.layout_options
    },
    LAYOUT_LABEL() {
      if (!this.param.layout.value) return 'Layout auswählen'
      return this.LAYOUTS.find(item => item.value === this.param.layout.value).label
    },

    ACTIVE_LAYOUT() {
      return this.param.layout.value
    },

    MAIN_STYLE() {
      if (!this.param.main_size) return `width: 100%; height: 200px`
      return `width: 100%; height: ${this.param.main_size.height / 11 * 7.9}px`
    },

    PATIENTS() {
      if (!this.localData.PATIENTS) return []
      return this.localData.PATIENTS.filter(item => {
        if (!this.param.filter_patient) return true
        return item.PATIENT_CD.includes(this.param.filter_patient)
      })
    }
  },

  methods: {
    initLayouts() {
      this.$store.dispatch('searchDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', _columns: ['CODE_CD', 'NAME_CHAR'] } })
      .then(res => {
        if (res && res.length > 0 ) {
          this.param.layout_options = res.map(item => {
            return { value: item.CODE_CD, label: item.NAME_CHAR }
          })
          this.param.layout.value = this.param.layout_options[0].value
        }
      })
    },

    selectLayout(item) {
      this.param.layout.value = item.value
    },

    onResize(size, field) {
      this.param[field] = size
    },

    // LOAD THE DATA
    async runSQLStatement(sql_query) {
      const res = await this.$store.dispatch('runQuery', sql_query)
      if (res.status) {
        this.localData.PATIENTS = res.data
        this.$q.notify({ type: 'positive', message: 'Daten erfolgreich geladen' })
      } else {
        this.$q.notify({ type: 'negative', message: 'Daten konnten nicht geladen werden' })
      }
    },

    // PATIENT CLICKED
    patientClicked(patient) {
      // lade die Visiten
      this.$store.commit('PATIENT_PINNED_SET', patient)
      this.$store.commit('VISIT_PINNED_SET', undefined)
    },

    // LAYOUT
    async loadLayout(val) {
      const res = await this.$store.dispatch('searchDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: val , _columns: ["LOOKUP_BLOB"]} })
      if (res && res.length > 0) {
        this.param.layout.DATA = JSON.parse(unstringify(res[0].LOOKUP_BLOB))
        this.$q.notify({ type: 'positive', message: 'Layout erfolgreich geladen' })
      } else {
        this.$q.notify({ type: 'negative', message: 'Layout konnte nicht geladen werden' })
      }
    },

    updateLayout(layout) {
      if (layout) this.param.layout.DATA = layout
      this.param.layout.show_update_btn = true
      this.param.layout.show_save_btn = true
    },

    async btnUpdateLayout() {
      const res = await this.$store.dispatch('updateLayout', this.param.layout)
      
      if (res && res.status) this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
      else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })

      this.param.layout.show_update_btn = false
      this.param.layout.show_save_btn = false
    },

    async btnSaveLayout() {
      const answ = await my_prompt(`Bitte Bezeichnung für neues Layout eingeben`)
      if (!answ || answ.lengh === 0) return
    
      const res = await this.$store.dispatch('saveLayout', {value: answ, DATA: this.param.layout.DATA})

      if (res && res.status) {
        this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
        this.initLayouts()
      }
      else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })

      await this.initLayouts()
      
      this.param.layout.show_update_btn = false
      this.param.layout.show_save_btn = false
    }


    // ENDE METHODS
  }


}
</script>
