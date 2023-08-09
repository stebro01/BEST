<template>
  <q-page class="">
    <q-resize-observer @resize="onResize" />

    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Patienten bearbeiten / Modern View'"  :img="'db-queries-logo.png'" :icon="'wysiwyg'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="bg-red" :style="MAIN_STYLE">
          hi
        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <div class="row justify-center text-center">
          <!-- TOGGLE SHOW HIDEN -->
          <div class="col-1">
            <q-toggle size="xs" v-model="param.show_hide" checked-icon="visibility" unchecked-icon="visibility_off"><q-tooltip>Verstecke Elemente anzeigen / nicht anzeigen</q-tooltip> </q-toggle>
          </div>
          <!-- BTN SELECT LAYOUT -->
          <div class="col-1">
            <q-btn-dropdown size="sm" dense flat no-caps :label="LAYOUT_LABEL" class="bg-accent q-pt-sm">
              <q-list>
                <q-item v-for="(item, ind) of LAYOUTS" :key="ind + item.value" clickable v-close-popup @click="selectLayout(item)">
                  <q-item-section>
                    <q-item-label>{{item.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <!-- SAVE -->
          <div class="col-1"><q-btn v-if="param.layout.show_save_btn" dense no-caps flat class="bg-positive">speichern</q-btn></div>
        </div>
      </template>

    </MainSlot>

  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBQueries_PatientView',

  data() {
    return {
      options: this.$store.getters.ENV.options_db_queries,
      param: {
        show_hide: false,
        layout: {
          show_save_btn: false,
          value: undefined
        },
        main_size: undefined
      }
    }
  },

  components: { HEADING, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
  },

  watch: {


  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    },
    LAYOUTS() {
      return [{value: '1', label: 'Layout 1'}, {value: '2', label: 'Layout 2'}]
    },
    LAYOUT_LABEL() {
      if (!this.param.layout.value) return 'Layout auswählen'
      return this.LAYOUTS.find(item => item.value === this.param.layout.value).label
    },

    MAIN_STYLE() {
      if (!this.param.main_size) return `width: 100%; height: 200px`
      return `width: 100%; height: ${this.param.main_size.height/ 11 * 7.9 }px`
       
    }
  },

  methods: {
    selectLayout(item) {
      this.param.layout.value = item.value
    },

    onResize(size) {
      this.param.main_size = size
    }
  }

}
</script>
