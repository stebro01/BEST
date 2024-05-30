<template>
  <q-option-group v-model="val" :options="ITEM.options" color="primary" :type="ITEM.type"
                :inline="ITEM.inline" data-cy="radio" />


</template>

<script>

export default {
  name: 'RenderRadio',
  props: ["ITEM"],
  data() {
    return {
      val: this.ITEM.value

    }
  },
  watch: {
    val(value) {
      this.$emit('emitValue', value)
    }
  }
  
}
</script>
