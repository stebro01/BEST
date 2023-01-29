<template>
  <!-- FORM ENDE -->
  <q-card v-if="item_copy !== undefined">
    <!-- TYPE -->
    <q-card-section>
      <!-- HEADER -->
      <div class="row">
        <q-input :data-cy="`item_label_${INDEX}`" class="col-10" v-model="item_copy.label" @blur="updateItem('label')" dense label="Label" />
        <q-input v-if="!ISSEP" class="col-2" input-class="text-center" v-model="item_copy.id" @blur="updateItem('id')" type="number" readonly dense label="ID" />
        <q-input v-if="!ISSEP" class="col-8" v-model="item_copy.coding.display" @blur="updateItem('coding')" dense label="Coding: Tag" />
        <q-input v-if="!ISSEP" class="col-4" v-model="item_copy.coding.code" @blur="updateItem('coding')" dense label="Coding: Code" />
        <q-input v-if="!ISSEP" class="col-12" v-model="item_copy.coding.system" @blur="updateItem('coding')" dense label="Coding: System" />
      </div>
      <!-- SOME OPTIONS -->
      <q-checkbox v-if="!ISSEP" class="col-4" v-model="item_copy.inline" label="inline" @click.native="updateItem('inline')" />
      <q-checkbox v-if="!ISSEP" class="col-4" v-model="item_copy.force" label="force" @click.native="updateItem('force')" />
      <q-checkbox v-if="!ISSEP" class="col-4" v-model="item_copy.ignore_for_result" label="ignore" @click.native="updateItem('ignore_for_result')" />
      <!-- TYPE -->
      <q-btn-dropdown  class="col-12 text-left" color="dark" flat :label="`Type: ${item.type || 'bitte auswählen'}`">
        <q-list>
          <q-item 
            v-for="(type, indtype) in ITEMTYPES" :key="indtype+Date.now()"
            clickable v-close-popup @click="onTypeClick(type)"
          >
            <q-item-section>
              <q-item-label>{{type}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- OPTIONS -->
      <div v-if="item_copy.options !== undefined" class="bg-grey-1">
        OPTIONS: 
        <!-- CHECKBOX&RADIO -->
        <div v-if="item_copy.type === 'radio' || item_copy.type === 'checkbox'">
          <q-btn icon="add" round @click="addOption()"></q-btn>
          <div class="row text-left" v-for="(opt, indopt) in item_copy.options" :key="indopt+date_str">
              <q-input class="col-9" v-model="opt.label" @blur="changeOpt(opt, indopt)" dense label="Label" />
              <q-input class="col-2" input-class="text-center" v-model="opt.value" @blur="changeOpt(opt, indopt)" dense label="Value" />
              <q-btn class="col-1" flat rounded size="md" icon="highlight_off" @click="removeOpt(indopt)"/>
          </div>
        </div>
        <!-- SLIDER -->
        <div v-else-if="item_copy.type === 'slider'">
          <div class="class row">
            <!-- TOP -->
            <q-input class="col-9" v-model="item_copy.options.top.label" @blur="updateItem('options')" dense label="TOP" />
            <q-input class="col-3" type="number" input-class="text-center"  v-model.number="item_copy.options.top.value" @blur="updateItem('options')" dense label="Value" />
            <!-- BOTTOM -->
            <q-input class="col-9" v-model="item_copy.options.bottom.label" @blur="updateItem('options')" dense label="BOTTOM" />
            <q-input class="col-3" type="number" input-class="text-center" v-model.number="item_copy.options.bottom.value" @blur="updateItem('options')" dense label="Value" />
            <!-- ... -->
            <q-input class="col-6" type="number" input-class="text-center"  v-model.number="item_copy.options.steps" @blur="updateItem('options')" dense label="STEPS" />
            <q-checkbox class="col-6" v-model="item_copy.vertical" label="vertical" @click.native="updateItem('vertical')" />
          </div>
        </div>
        <!-- MULTIPLE_RADIO -->
        <div v-else-if="item_copy.type === 'multiple_radio'">
          <!-- ANTWORTEN -->
          <div>
            <div class="row">
              <div class="col">
                Antworten: <q-btn icon="add" round @click="addMultiAnswer()" />
              </div>
              <q-checkbox v-if="item_copy.options.answers !== undefined" class="col-5" v-model="item_copy.longanswers" label="überlange Antworten" @click.native="updateItem('longanswers')" />
            </div>
            
            <div class="row" v-for="(optansw, indoptansw) in item_copy.options.answers" :key="indoptansw+date_str">
              <q-input class="col-9" v-model="optansw.label" @blur="changeOptAnsw(optansw, indoptansw)" dense label="Label" />
              <q-input class="col-2" input-class="text-center" v-model="optansw.value" @blur="changeOptAnsw(optansw, indoptansw)" dense label="Value" />
              <q-btn class="col-1" flat rounded size="md" icon="highlight_off" @click="removeOptAnsw(indoptansw)"/>
            </div>
 
          </div>
          <!-- FRAGEN -->
          <div>
            Fragen: <q-btn icon="add" round @click="addMultiQuest()" />
            <div class="row" v-for="(optquest, indoptquest) in item_copy.options.questions" :key="indoptquest+date_str">
              <q-input class="col-8" v-model="optquest.label" @blur="changeOptQuest(optquest, indoptquest)" dense label="Label" />
              <q-input class="col-2" input-class="text-center" v-model="optquest.value" @blur="changeOptQuest(optquest, indoptquest)" dense label="Value" />
              <q-input readonly class="col-1" input-class="text-center" v-model="optquest.id" @blur="changeOptQuest(optquest, indoptquest)" dense label="ID" />
              <q-btn class="col-1" flat rounded size="md" icon="highlight_off" @click="removeOptQuest(indoptquest)"/>
            </div>
          </div>

        </div>
      <!-- ENDE OPTIONS -->
      </div>

    </q-card-section>

  </q-card>
</template>


<script>
import {item_types, item_template} from 'assets/questionnaires/list_quest'

export default {
  name: 'CreateItem',
  props: ["item", "index"],

  data() {
    return {
      TEXT: this.$store.state.TEXT,
      date_str: Date.now(),
      item_copy: undefined
    }
  },
  mounted() {
    this.item_copy = JSON.parse(JSON.stringify(this.item))
    if (this.item_copy.coding === undefined) {
      this.item_copy.coding = item_template.coding
      if (this.item_copy.tag !== undefined) this.item_copy.coding.display = this.item_copy.tag
    }
  },

  computed: {
    ITEMTYPES() {
      return item_types
    },
    INDEX() {
      return this.index
    },
    ISSEP() {
      if (this.item_copy.type === 'separator') return true
      else return false
    }
  },
  methods: {
    updateItem(tag) {
      if (this.item_copy === undefined) return false
      this.$emit('updateItem', {field: tag, value: this.item_copy[tag]})
      
    },
    onTypeClick(val) {
      this.$emit('updateItem', {field: 'type', value: val})
      switch(val) {
        case "multiple_radio":
          this.$emit('updateItem', {field: 'value', value: []})
          this.$emit('updateItem', {field: 'options', value: {}})
          break
        case "radio":
          this.$emit('updateItem', {field: 'value', value: null})
          this.$emit('updateItem', {field: 'options', value: []})
          break
        case "checkbox":
          this.$emit('updateItem', {field: 'value', value: []})
          this.$emit('updateItem', {field: 'options', value: []})
          break
        case "slider":
          this.$emit('updateItem', {field: 'vertical', value: true})
          this.$emit('updateItem', {field: 'options', value: {
                "top": {"value": 100, "label": "Bester denkbarer Gesundheitszustand"},
                "bottom": {"value": 0, "label": "Schlechtest denkbarer Gesundheitszustand"},
                "steps": 10
            }})
          break
        case "separator":
        case "number":
        case "date":
        case "time":
        case "text":
        default: 
          this.$emit('updateItem', {field: 'options', value: undefined})
          this.$emit('updateItem', {field: 'value', value: null})
          break
      }
    },
    addOption() {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      const num = options.length
      options.push({label: `Frage ${num+1}`, value: num+1})
      this.$emit('updateItem', {field: 'options', value: options})
    },
    addMultiAnswer() {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      if (options.answers === undefined) options.answers = []
      const num = options.answers.length
      options.answers.push({label: `Answer ${num+1}`, value: num+1})
      this.$emit('updateItem', {field: 'options', value: options})
    },
    addMultiQuest() {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      if (options.questions === undefined) options.questions = []
      const num = options.questions.length
      options.questions.push({label: `Frage ${num+1}`, tag: `a${num+1}`, id: null})
      this.$emit('updateItem', {field: 'options', value: options, updateID: true})
    },
    removeOpt(index) {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      options.splice(index, 1)
      this.$emit('updateItem', {field: 'options', value: options})
    },
    removeOptQuest(index) {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      if (options.questions === undefined) return false
      options.questions.splice(index, 1)
      this.$emit('updateItem', {field: 'options', value: options, updateID: true})
    },
    removeOptAnsw(index) {
      const options = this.item_copy.options
      if (options === undefined || options === null) return false
      if (options.answers === undefined) return false
      options.answers.splice(index, 1)
      this.$emit('updateItem', {field: 'options', value: options})
    },
    changeOpt(opt, ind) {
      const options = this.item_copy.options
      options[ind] = opt
      this.$emit('updateItem', {field: 'options', value: options})
    },
    changeOptAnsw(opt, ind) {
      const options = this.item_copy.options
      options.answers[ind] = opt
      this.$emit('updateItem', {field: 'options', value: options})
    },
    changeOptQuest(opt, ind) {
      const options = this.item_copy.options
      options.questions[ind] = opt
      this.$emit('updateItem', {field: 'options', value: options})
    }

  }
}
</script>
