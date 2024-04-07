<template template>

  <!-- HEADER -->
  <div class="col-1 row items-center">
            <div class="col-4 q-gutter-x-md">
              <q-btn rounded color="dark" icon="filter_alt" @click="commingSoon()"><q-tooltip>Filter / Suchen</q-tooltip></q-btn>
              <q-btn rounded color="dark" icon="tune" @click="commingSoon()"><q-tooltip>Spalten ein-/ausblenden</q-tooltip></q-btn>
            </div>
            <div class="col-4 text-center">
              <!-- NO LABEL -->
            </div>
            <!-- CHANGE FONTSIZE -->
            <div class="col-4 text-right">
              <q-btn size="md" dense icon="zoom_in" flat @click="$emit('zoom_in')" />
              <q-btn size="md" dense icon="zoom_out" flat @click="$emit('zoom_out')" />
            </div>
          </div>
  <!-- HEADER -->

</template>

<script>


export default {
  name: 'Header_for_XLS_View',

  props: [],
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
    commingSoon() {
      this.$q.notify({
        message: 'In Kürze verfügbar',
        type: 'warning',
        position: 'bottom',
        timeout: 1000
      })
    }

    // ENDE METHODS
  }


}
</script>
