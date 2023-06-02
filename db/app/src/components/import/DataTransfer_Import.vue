<template>
  <div>


    <!-- SELECT FILE -->
    <div class="col-12 text-center">
      <SELECT_FILE :accept="'.json'" :label="`${TEXT.select_file} (.json)`"
        @save="importData($event)" />
      <div v-if="show_spinner">
        <q-spinner size="md"></q-spinner>
      </div>
    </div>


  </div>
</template>

<script>
import SELECT_FILE from "src/components/elements/SelectFile.vue";

export default {
  name: 'DataTransfer_Import',

  components: {SELECT_FILE},

  data() {
    return {
      show_spinner: false
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    },

  },

  methods: {
    importData(file) {
      console.log(file)
      this.$q.notify('comming soon')
    }
  }

}
</script>