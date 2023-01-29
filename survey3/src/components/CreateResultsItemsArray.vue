<template>
  <!-- FORM ENDE -->
    <div v-if="item_copy !== undefined" class="text-center" >
      <q-input v-model="ITEM" :label="type" :input-class="{'text-red': error}" />
    </div>

  <!-- ENDE MAINDIV -->
</template>

<script>

export default {
  name: 'CreateResultsItems',
  props: ["item", "type"],

  data() {
    return {
      TEXT: this.$store.state.TEXT,
      date_str: Date.now(),
      item_copy: undefined,
      error: false
    }
  },
  mounted() {
    this.item_copy = JSON.parse(JSON.stringify(this.item))

  },

  computed: {
    ITEM:{
      get(){
        if (this.item_copy === []) return '[]'
        return JSON.stringify(this.item_copy)
      },
      set(val) {
        try {
          this.item_copy = JSON.parse(val)
          this.error = false
          this.$emit('updateItem', this.item_copy)
        } catch {
          this.error = true
        }
      }
    }

  },
  methods: {

  }
}
</script>
