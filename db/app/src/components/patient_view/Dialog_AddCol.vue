<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Neue Spalten (Observations) hinzufügen
      </q-card-section>
      <q-card-section >

          <q-form class="row justify-center" @submit="searchDB(search_string)">
            <q-input class="col-8" input-class="text-center" filled dense v-model="search_string" hint="wähle einen neuen Observation-Type (CONCEPT_CD), z.B. 'Age'"/>
            <q-btn class="col-1" icon="search" flat @click="searchDB(search_string)"/>
          </q-form>
      </q-card-section>
      <q-card-section>
        <div class="shadow-1">
        <div class="text-caption text-center text-grey-7">Ergebnisse: {{ COUNT_RESULTS }}</div>
          <q-scroll-area style="width: 100%; height: 200px" >
            <q-list v-if="SEARCH_RESULTS" dense class="non-selectable">
              <q-item v-for="item in SEARCH_RESULTS" :key="item.CONCEPT_CD" clickable
                @click="this.selected_item = item"
                v-on:dblclick="$emit('col_selected', item)"
                :class="{'bg-grey-4': selected_item && item.CONCEPT_CD === selected_item.CONCEPT_CD}" >
                <q-item-section>
                  <q-item-label>{{ item.NAME_CHAR }}</q-item-label>
                  <q-item-label caption>{{ item.CONCEPT_CD }}</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-item-label caption>Type: {{ item.VALTYPE_CD }} <span v-if="item.UNITS_CD">| Units: {{ item.UNITS_CD }}</span> | Sourcesystem: {{ item.SOURCESYSTEM_CD }}</q-item-label>
                </q-item-section>

              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn label="Abbrechen" no-caps  rounded @click="$emit('close')"/>
        <q-btn :disable="!IS_COL_SELECTED" label="Speichern" no-caps color="primary" rounded @click="$emit('col_selected', selected_item)"></q-btn>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>
import { searchDB } from 'src/store/actions'


export default {
  name: 'AddCol_Dialog',

  props: ['data'],

  components: {},

  data() {
    return {
      show_dialog: false,
      search_string: null,
      search_results: undefined,
      selected_item: undefined
    }
  },

  mounted() {
    if (!this.data) return
    if (this.data) this.show_dialog = true
    this.loadData()

  },

  computed: {
    IS_COL_SELECTED() {
      if (!this.selected_item) return false
      else return true
    },

    COUNT_RESULTS() {
      if (this.search_results) return this.search_results.length
      return 0
    },

    SEARCH_RESULTS() {
      if (this.search_results) return this.search_results
      return this.$store.getters.FAVORITE_CONCEPTS
    }


  },

  methods: {
    async loadData() {

    },

    async searchDB(search_string) {
      if (!search_string) return
      const statement = `SELECT * FROM CONCEPT_DIMENSION WHERE NAME_CHAR LIKE '${search_string}%' AND VALTYPE_CD <> 'A';
`
      const res = await this.$store.dispatch('runQuery', statement)
      if (res && res.status) {
        this.search_results = res.data
      } else this.$q.notify({ type: 'negative', message: res.error })
    }

  }


}
</script>
