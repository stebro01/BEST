<template>
  <span>
    <span v-if="value">
      <span v-if="value.status">
        ✅
        <q-tooltip>CQL Check: {{ value.data.length }} Regel(n) ohne Fehler</q-tooltip>
      </span>
      <span v-else>
        ❌ <q-tooltip>CQL Check: Fehler: {{ JSON.stringify(value.data) }}</q-tooltip>
      </span>
    </span>
  </span>

</template>


<script>

export default {
    name: 'CQL_Check',

    props: ['value'],

}
</script>