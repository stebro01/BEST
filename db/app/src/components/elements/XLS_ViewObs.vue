<template>
  <span v-if="ITEM !== undefined" @click="$emit('editObservation', item.OBSERVATION_ID)">
    {{ITEM}}
    <q-tooltip>{{ TOOLTIP }}</q-tooltip>
  </span>
  <q-chip v-else-if="CHIP" :label="CHIP" dense size="sm" color="primary" text-color="white" @click="loadObservation(item)" clickable>
    <q-tooltip>{{ TOOLTIP }}</q-tooltip>
  </q-chip>
  <span v-else>
    {{ item.OBSERVATION_ID }}
    <q-tooltip>{{ item }}</q-tooltip>
  </span>

</template>


<script>

export default {
    name: 'XLS_ViewObs',

    props: ['item'],

    data() {
    return {
      
    }},

    computed: {
      ITEM() {
        if (this.item.VALTYPE_CD === 'N') return this.item.NVAL_NUM
        if (this.item.VALTYPE_CD === 'D' || this.item.VALTYPE_CD === 'T') return this.item.TVAL_CHAR
        if (this.item.VALTYPE_CD === 'S' || this.item.VALTYPE_CD === 'F') return this.item.TVAL_RESOLVED || this.item.TVAL_CHAR
        return undefined
      },

      CHIP() {
        if (this.item.VALTYPE_CD) return undefined
        // else
        const out_str = this.item.TVAL_RESOLVED || this.item.TVAL_CHAR
        return out_str.length > 10 ? out_str.slice(0, 10) + '...' : out_str
      },

      TOOLTIP() {
        var out_string = ''
        Object.keys(this.item).forEach(key => {
          if (this.item[key] !== null && this.item[key] !== undefined) out_string += key + ': ' + this.item[key] + '\n'
        })

        return out_string
      }
      
    },

    methods: {
      loadObservation(item) {
        this.$emit('loadObservation', item.OBSERVATION_ID)
      }
    }


}
</script>