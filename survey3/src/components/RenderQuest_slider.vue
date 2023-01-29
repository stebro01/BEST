<template>
  <div class="column items-center">
    <div class="col q-ma-md">
      <q-badge color="green">
      {{item.options.top.label}}
    </q-badge>
    </div>
    <div class="col q-ma-md "> <q-slider
      v-model="val"
      color="black"
      markers
      snap
      :min="min"
      :max="max"
      :vertical="item.vertical"
      :step="parseInt(item.options.steps)"
      label
      label-always
      label-color="yellow"
      label-text-color="black"
      reverse
      :label-value="meinWert"
      style=""
    />
    </div>
    <div class="col q-ma-md">
      <q-badge color="blue">
      {{item.options.bottom.label}}
    </q-badge>
    </div>
     
    </div>
   
</template>

<script>

export default {
  name: 'RenderSlider',
  props: ["ITEM"],
  data() {
    return {
      val: null,
      item: this.ITEM,
      max: parseInt(this.ITEM.options.top.value),
      min: parseInt(this.ITEM.options.bottom.value)
    }
  },
  mounted() {
    // this.val = Math.round(this.item.options.top.value / 2)
  },
  watch: {
    val(value) {
      this.$emit('emitValue', value)
    }
  },
  computed: {
    meinWert() {
      if (this.val === null) return "bitte einen Wert auswählen"
      else return "Mein Wert: " + this.val
    }
  },
}
</script>
