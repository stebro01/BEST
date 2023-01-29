<template>
<div class="row">
  <div class="col-12">
    <q-input v-if="filter_on" data-cy="filter_input" v-model="filter_str" label="Filter">
      <template v-slot:before>
        <q-btn round dense flat icon="close" @click="filter_str = null; filter_on = false" />
      </template>
    </q-input>
    <q-btn v-else data-cy="filter_btn" class="my-btn" flat icon="filter_list" @click="filter_on = !filter_on" />
  </div>
</div>
</template>

<script>
  export default {
    name: 'FilterQuest',
    props: ["ITEM"],
    data() {
      return {
        filter_on: false,
        filter_str: null
      }
    },
    watch: {
      FILTER(val){
        this.$emit('emitValue', val)
      }
    },
    computed: {
      FILTER() {
        if (this.filter_on === false) return null
        return this.filter_str
      }
    }
  }
</script>