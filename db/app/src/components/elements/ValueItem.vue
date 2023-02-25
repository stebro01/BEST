<template>
  <span>
    <span v-if="value">
      <span v-if="label">
        ✅
        {{label}} <q-tooltip>{{ value }}</q-tooltip>
      </span>
      <span v-else>
        ❌ {{value}} <q-tooltip>Werte wurde nicht korrekt zugeordnet: {{ value }}</q-tooltip>
      </span>
    </span>
    <span v-else-if="item && item.label">{{item.label}} <q-tooltip>{{item.value}}</q-tooltip></span>
    <span v-else> {{item}}</span>
  </span>

</template>

<script>

export default {
    name: 'ValueItem',

    props: ['item', 'value', 'label'],
    
    data() {
    return {
    
    }},

}
</script>