<template template>

  <!-- HEADER -->
  <div class="col-1 row items-center">
            <div class="col-4">
              <!-- empty -->
            </div>
            <div class="col-4 text-center">HEADER</div>
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

    // ENDE METHODS
  }


}
</script>
