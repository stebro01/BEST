<template>
  <!-- FORM ENDE -->
    <div v-if="items_copy !== undefined" class="q-mb-lg">
      <!-- HEADER -->
      <div class="row">
        <div class="col-10">{{TYPE}}: {{items_copy.length}}</div>
        <div class="col-2"><q-btn round icon="add" @click="addElement(TYPE)"/></div>
      </div>
      <!-- CONTENt -->
      <div class="row" v-for="(item, inditem) in items_copy" :key="'targ'+inditem+date_str">
        <q-btn class="col-2" flat rounded size="md" icon="highlight_off" @click="removeElement(TYPE, inditem)"/>
        <!-- LABEL -->
        <q-input v-if="TYPE === 'targets' || TYPE === 'domaine' || TYPE === 'evaluation'" :class="{'col-4': TYPE !== 'evaluation'}" v-model="item.label" label="label" @blur="updateItems()"/>
        <!-- ID -->
        <div v-if="TYPE === 'scoring' || TYPE === 'domaine'" class="col-3">
          <ITEMARRAY :item="item.id" :type="'id'" @updateItem="updateArray($event, inditem, 'id')"/>
        </div>
        <!-- VALUE > targets -->
        <q-input v-if="TYPE === 'targets'" class="col-3" v-model.number="item.value" type="number" label="value" input-class="text-center" @blur="updateItems()"/>
        <!-- VALUE > scoring -->
        <div v-if="TYPE === 'scoring'" class="col-3">
          <ITEMARRAY :item="item.value" :type="'value'" @updateItem="updateArray($event, inditem, 'value')"/>
        </div>
        <!-- SCORE > targets-->
        <q-input v-if="TYPE === 'targets'" class="col-3" v-model.number="item.score" type="number" label="score" input-class="text-center" @blur="updateItems()"/>
        <!-- SCORE > scoring -->
        <div v-if="TYPE === 'scoring'" class="col-3">
          <ITEMARRAY :item="item.score" :type="'score'" @updateItem="updateArray($event, inditem, 'score')"/>
        </div>
        <!-- RANGE -->
        <div v-if="TYPE === 'evaluation'" class="col-4">
          <div class="row">
            <q-input  class="col-6" v-model.number="item.range[0]" type="number" label="range_from" input-class="text-center" @blur="updateItems()"/>
            <q-input  class="col-6" v-model.number="item.range[1]" type="number" label="range_to" input-class="text-center" @blur="updateItems()"/>
          </div>
        </div>
        <!-- METHOD -->
        <q-btn-dropdown v-if="TYPE === 'domaine'" no-caps flat dense class="col-3" >
          <template v-slot:label>
            <div style="line-height: 0.8em"><span class="text-caption">method</span><br>{{item.method}}</div>
          </template>
          <q-list>
            <q-item 
              v-for="(m, ii) in METHODS" :key="m+ii+date_str"
              clickable v-close-popup @click="onMethodClick(inditem, m)">
              <q-item-section>
                <q-item-label>{{m}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

  <!-- ENDE MAINDIV -->
</template>

<script>
import {result_method_templates} from 'assets/questionnaires/list_quest'
import ITEMARRAY from 'src/components/CreateResultsItemsArray.vue'

export default {
  name: 'CreateResultsItems',
  props: ["items", "type"],
  components: {ITEMARRAY},
  data() {
    return {
      TEXT: this.$store.state.TEXT,
      date_str: Date.now(),
      items_copy: undefined,
      METHODS: ["sum", "avg"]
    }
  },
  mounted() {
    this.items_copy = JSON.parse(JSON.stringify(this.items))

  },

  computed: {
    TYPE() {
      return this.type
    }
  },
  methods: {
// REMOVE ELEMENT
    removeElement(action, ind) {
      switch(action) {
        case "targets":
        case "scoring":
        case "domaine":
        case "evaluation":
          this.items_copy.splice(ind,1)
          break
        default:
          console.log(`nicht unterstützt: ${action}`)
          break
      }
      // update parent
      this.$emit('updateResult', {field: this.type, value: this.items_copy})
    },
// ADD NEW ELEMENT
    addElement(action) {
      switch(action) {
        case "targets":
          this.items_copy.push(JSON.parse(JSON.stringify(result_method_templates.targets)))
          break
        case "scoring":
          this.items_copy.push(JSON.parse(JSON.stringify(result_method_templates.scoring)))
          break
        case "domaine":
          this.items_copy.push(JSON.parse(JSON.stringify(result_method_templates.domaine)))
          break
        case "evaluation":
          this.items_copy.push(JSON.parse(JSON.stringify(result_method_templates.evaluation)))
          break
        default:
          console.log(`nicht unterstützt: ${action}`)
          break
      }
      // update parent > CreateResults
      this.$emit('updateItem', {field: this.type, value: this.items_copy})
    },
// UPDATE ELEMENTS TO PARENT
    updateItems() {
      this.$emit('updateResult', {field: this.TYPE, value: this.items_copy})
    },
// ONMETHODCLICK
    onMethodClick(index, m){
      this.items_copy[index].method = m
      this.$emit('updateResult', {field: this.TYPE, value: this.items_copy})
    },
// UPDATEARRAY
    updateArray(val, index, tag) {
      this.items_copy[index][tag] = val
      this.updateItems()
    }

  }
}
</script>
