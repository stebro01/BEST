<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Neue Visite hinzufügen
      </q-card-section>
      <q-card-section >
        <q-banner v-if="!data_loaded">Bereite Maske vor</q-banner>
        <q-form v-else class="row">
          <!-- <q-input class="col-8" dense outlined disable="" v-model="localData.PATIENT_CD" label="ID" /> -->
          <q-input class="col-12" dense outlined v-model="localData.VISIT_BLOB"  label="Beschreibung"/>
          <q-input class="col-6" dense outlined v-model="localData.START_DATE" label="Startdatum" type="date"/>
          <q-input class="col-6" dense outlined v-model="localData.END_DATE" label="Enddatum" type="date"/>

          <q-select class="col-12" dense outlined v-model="localData.LOCATION_CD" :options="options.LOCATION_CD" label="Ort"/>

          <q-select class="col-6" dense outlined v-model="localData.ACTIVE_STATUS_CD" :options="options.ACTIVE_STATUS_CD" label="Status"/>

        </q-form>

      </q-card-section>
      <q-card-actions align="between">
        <q-btn label="Abbrechen" no-caps  rounded @click="$emit('close')"/>
        <q-btn :disable="!OBLIGATE_DATE_SET" label="Speichern" no-caps color="primary" rounded @click="saveObs()"><q-tooltip><span v-if="!OBLIGATE_DATE_SET">ID, Geb.Datum und Geschlecht auswählen</span><span v-else>Speichere in der DB</span></q-tooltip></q-btn>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script>

export default {
  name: 'Dialog_EditVisit',

  props: [],

  components: {},

  data() {
    return {
      show_dialog: false,
      data_loaded: false,
      localData: {},
      options: {}
    }
  },

  mounted() {
    this.loadData()

  },

  computed: {
    OBLIGATE_DATE_SET() {
      if (!this.localData) return false
      if (!this.localData.ENCOUNTER_NUM) return false
      if (!this.localData.START_DATE) return false
      return true
    }


  },

  methods: {
    async loadData() {
      // prepare the options
      // ACTIVE_STATUS_CD
      this.options.ACTIVE_STATUS_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\138875005\\362981000\\272099008\\106232001\\')

      // LOCATION_CD
      const res_location = await this.$store.dispatch("resolveCD", { table: "VISIT_DIMENSION" })
      this.options.LOCATION_CD = []
      if (res_location && res_location.resolve && res_location.resolve.LOCATION_CD) {
        res_location.resolve.LOCATION_CD.forEach((location) => {
          this.options.LOCATION_CD.push({
            value: location.CODE_CD,
            label: location.NAME_CHAR,
          });
        });
      }

      // prepare the localData
      const visit = this.$store.getters.VISIT_PINNED
      this.localData = {}
      this.localData.ENCOUNTER_NUM = visit.ENCOUNTER_NUM
      this.localData.START_DATE = visit.START_DATE
      if (visit.END_DATE) this.localData.END_DATE = visit.END_DATE
      if (visit.ACTIVE_STATUS_CD) this.localData.ACTIVE_STATUS_CD = this.options.ACTIVE_STATUS_CD.find((item) => item.value === visit.ACTIVE_STATUS_CD)
      if (visit.VISIT_BLOB) this.localData.VISIT_BLOB = visit.VISIT_BLOB
      if (visit.LOCATION_CD) this.localData.LOCATION_CD = this.options.LOCATION_CD.find((item) => item.value === visit.LOCATION_CD)

      this.data_loaded = true
      this.show_dialog = true
    },

    async saveObs() {
      // prepare the payload
      const WHERE = {ENCOUNTER_NUM: this.localData.ENCOUNTER_NUM}
      const payload = {
        START_DATE: this.localData.START_DATE,
      }
      if (this.localData.END_DATE) payload.END_DATE = this.localData.END_DATE
      if (this.localData.ACTIVE_STATUS_CD) payload.ACTIVE_STATUS_CD = this.localData.ACTIVE_STATUS_CD.value
      if (this.localData.VISIT_BLOB) payload.VISIT_BLOB = this.localData.VISIT_BLOB
      if (this.localData.LOCATION_CD) payload.LOCATION_CD = this.localData.LOCATION_CD.value

      const res = await this.$store.dispatch('updateDB', {table: 'VISIT_DIMENSION', query_string: {where: WHERE, set: payload}})
      this.$store.commit('VISIT_PINNED_SET', undefined)
      this.$q.notify({type: 'positive', message: res})
      this.$emit('refresh')


    }

  }


}
</script>
