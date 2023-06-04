<template>
  <div>
    <!-- SELECT FILE -->
    <div v-if="!JSON_FN" class="col-12 text-center">
      <SELECT_FILE :accept="'.json'" :label="`${TEXT.select_file} (.json)`" @save="importData($event)" />
    </div>

    <!-- ELSE -->
    <div v-else class="q-mt-xl col-12 text-center row q-gutter-y-lg">
      <div class="col-12">
        <q-chip removable @remove="JSON_FN = undefined; show_spinner = false">{{ JSON_FN.name }}</q-chip>
      </div>
      <!-- IF SHOW_SPINNER -->
      <div v-if="show_spinner" class="col-12 text-center q-gutter-y-lg">
        <div><q-spinner-ios size="md"></q-spinner-ios></div>
        <div><q-banner class="bg-red">Import läuft, das kann einen Moment dauern.</q-banner></div>
      </div>
      <!-- ELSE IF -->
      <div class="col-12" v-else-if="DATA.length > 0">
        Preview
        <q-list dense>
          <q-item v-for="(item, ind) of DATA" :key="ind + 'import'" v-ripple clickable
            @click="item.selected = !item.selected">
            <q-item-section side>
              <q-checkbox v-model="item.selected" />
            </q-item-section>
            <q-item-section>
              {{ item.table }}
            </q-item-section>
            <q-item-section>
              Einträge: {{ item.data.length }}
            </q-item-section>
          </q-item>
        </q-list>

      </div>
      <div class="col-12" v-if="!show_spinner">
        <q-btn rounded class="my-btn" @click="importNow()">Importieren</q-btn>
      </div>

    </div>
  </div>
</template>

<script>
import SELECT_FILE from "src/components/elements/SelectFile.vue";

export default {
  name: 'DataTransfer_Import',

  components: { SELECT_FILE },

  data() {
    return {
      show_spinner: false,
      JSON_FN: undefined,
      DATA: []
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import
    },

  },

  methods: {
    importData(file) {
      if (file && file.path) {
        this.JSON_FN = file
        this.loadFile(this.JSON_FN)
      }

    },
    loadFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => this.readjson(e);
      reader.readAsText(file);
    },

    readjson(e) {
      let txt = e.target.result;
      this.DATA = JSON.parse(txt)
      this.DATA.forEach(d => d.selected = true)
    },

    importNow() {
      const TO_IMPORT = []
      this.DATA.forEach(d => {
        if (d.selected) TO_IMPORT.push(d)
      })
      this.show_spinner = true

      console.log(TO_IMPORT)

    }

  }

}
</script>