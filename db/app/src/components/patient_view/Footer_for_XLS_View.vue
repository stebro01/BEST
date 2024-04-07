<template template>

  <!-- FOOTER -->
  <div class="col-1 row items-center q-pt-sm">
  <div class="col-4 text-left">
    <div class="text-caption text-grey-8" style="line-height: 5px;">
      Patients: {{ localData ? localData.length : 0 }} | Visits: {{ localData ? localData.reduce((acc, item) => acc +
      item.VISITS.length, 0) : 0 }} | Observations: {{ localData ? localData.reduce((acc, item) => acc +
      item.VISITS.reduce((acc, item) => acc + item.OBSERVATIONS.length, 0), 0) : 0 }}
      <div v-if="hide_col_keys.length > 0">
        | Versteckt: {{ hide_col_keys.length }}
        <q-btn class="text-black" size="xs" dense icon="visibility" flat @click="$emit('clear_hide_cols')"><q-tooltip>Zeige
            alle Spalten an</q-tooltip></q-btn>
      </div>
    </div>
  </div>
  <div class="col-4 text-center">
    FOOTER
  </div>
  <div class="col-4">

  </div>
</div>
  <!-- ENDE FOOTER -->

</template>

<script>


export default {
  name: 'Footer_for_XLS_View',

  props: ['localData', 'hide_col_keys'],
  components: {},

  data() {
    return {

    }
  },

  mounted() {
  },


  computed: {

  },


  methods: {
    // METHODS

    // ENDE METHODS
  }


}
</script>
