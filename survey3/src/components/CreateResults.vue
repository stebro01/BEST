<template>
  <!-- FORM ENDE -->
  <div v-if="results_copy !== undefined">
    <!-- info -->
    <div class="text-caption text-grey" style="font-size: 0.6em; line-height: 1em">
      <b>Achtung:</b> <br>
      Bei Auswahl einer neuen Methode wird die vorherige komplett gelöscht.<br>
      Die IDs werden bei Änderung der Fragen-Items nicht automatisch angepasst!
    </div>
    <!-- SELECT THE METHOD -->
    <q-btn-dropdown color="dark" flat :label="`Methode: ${results_copy.method || 'bitte auswählen'}`">
      <q-list>
        <q-item 
          v-for="(type, indtype) in RESULT_TYPES" :key="type+indtype+date_str"
          clickable v-close-popup @click="onMethodClick(type)">
          <q-item-section>
            <q-item-label>{{type}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div v-if="results_copy.scoring !== undefined">
      <RESULTSITEM :items="results_copy.scoring" :type="'scoring'" @updateItem="updateItem($event)"/>
    </div>
    <div v-if="results_copy.domaine !== undefined">
      <RESULTSITEM :items="results_copy.domaine" :type="'domaine'" @updateItem="updateItem($event)"/>
    </div>
    <div v-if="results_copy.evaluation !== undefined">
      <RESULTSITEM :items="results_copy.evaluation" :type="'evaluation'" @updateItem="updateItem($event)"/>
    </div>
    <div v-if="results_copy.targets !== undefined">
      <RESULTSITEM :items="results_copy.targets" :type="'targets'" @updateItem="updateItem($event)"/>
    </div>

  <!-- ENDE MAINDIV -->
  </div>
</template>

<script>
import {result_types} from 'assets/questionnaires/list_quest'
import RESULTSITEM from 'src/components/CreateResultsItems.vue'

export default {
  name: 'CreateResults',
  props: ["results", "index"],
  components: {RESULTSITEM},
  data() {
    return {
      TEXT: this.$store.state.TEXT,
      date_str: Date.now(),
      results_copy: undefined
    }
  },
  mounted() {
    this.results_copy = JSON.parse(JSON.stringify(this.results))

  },

  computed: {
    INDEX() {
      return this.index
    },
    RESULT_TYPES() {
      return result_types
    }
  },
  methods: {
    onMethodClick(val) {
      switch (val) {
        case 'nothing':
          this.results_copy = {}
          break
        case 'ids':
          this.results_copy = {
            method: val,
            scoring: [],
            domaine: [],
            evaluation: []
          }
          break
        case 'count_targets':
          this.results_copy = {
            method: val,
            targets: []
          }
          break
        case 'sum':
        case 'avg':
        case 'count':
        default: 
          this.results_copy = {
            method: val
          }
          break
      }
      this.$emit('updateResult', {field: 'results', value: this.results_copy})
    },
    updateItem(payload) {
      this.results_copy[payload.field] = payload.value
      // update the parent > QuestManagerCreate
      this.$emit('updateResult', {field: 'results', value: this.results_copy})
    }

  }
}
</script>
