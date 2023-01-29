<template>
  <q-input filled v-model="val" :label="ITEM.hint" :type="ITEM.type" data-cy="number" />

</template>

<script>

export default {
  name: 'RenderText',
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
