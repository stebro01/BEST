<template>
  <div>
    <div class="column q-mt-lg">
      <div class="row">
        <div class="col">
          <!-- EMPTY -->
        </div>
        <div class="col-2 row" :class="{'col-10': item.verylonganswers === true, 'col-8':  answers_only.length > 6,'col-6': item.longanswers === true ||answers_only.length > 4, 'col-4': answers_only.length > 2}">
          <div class="col text-caption text-center q-mb-sm " :class="{'rotate-text': item.rotate !== false, 'narrow-text': item.rotate === false}"
            v-for="(answ, indansw) in answers_only" :key="indansw + 'answersonly'">
            {{answ}}
          </div>
        </div>
      </div>
      <!-- QUESTIONS -->
      <div class="row" v-for="(question, index) in item.options.questions" :key="'item.tag' + question.tag">
        <div class="col q-mt-sm" >
          <span v-html="question.label"></span>
          <!-- {{question.label}} -->
        </div>
        <div class="col-2 row text-center q-mt-sm"
          :class="{'col-10': item.verylonganswers === true, 'col-8': answers_only.length > 6,'col-6': item.longanswers === true ||answers_only.length > 4, 'col-4': answers_only.length > 2}">

          <div class="col" v-for="(sa, indsa) in short_answers" :key="indsa + 'shortans'">
  
            <q-radio v-model="val[index]" :val="sa.value" @update:model-value="updateValue(val)">
               <q-tooltip anchor="top middle" self="center middle"> {{answers_only[indsa]}}</q-tooltip>
            </q-radio>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'RenderMultipleRadio',
  props: ["ITEM", "VALUE"],
  data() {
    return {
      item: this.ITEM,
      val: []

    }
  },
  mounted() {
    if (this.VALUE.length > 0) this.val = this.VALUE
    else this.ITEM.options.questions.forEach(r => this.val.push(null))

    if (this.ITEM.hasOwnProperty('example_value')) this.val = this.ITEM.example_value

  },
  
  computed: {
    short_answers() {
      var out = [];
      this.item.options.answers.forEach(v => {
        out.push({'label': '', "value": v.value})
      })

      return out
    },

    answers_only() {
      var out = [];
      this.item.options.answers.forEach(v => {
        out.push(v.label)
      })
      return out
    }
  },

  methods: {
    updateValue(value){
      this.$emit('emitValue', value)
    }
  }
}
</script>
