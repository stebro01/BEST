<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Person bearbeiten
      </q-card-section>
      <q-card-section >
        <q-banner v-if="!data_loaded">Bereite Maske vor</q-banner>
        <q-form v-else>
          <div class="row justify-between bg-green-1 q-pa-sm relative-position">
            <div class="text-caption absolute-top-right text-grey-7" style="top:-8px">obligat</div>
          <q-input disable class="col-8" dense outlined v-model="localData.PATIENT_CD" label="ID" hint="Einzigartige ID, z.B. SAP Nummer"/>
          <q-select class="col-4" dense outlined v-model="localData.VITAL_STATUS_CD" :options="options.VITAL_STATUS_CD" label="Status"/>
          <q-input class="col-6" dense outlined v-model="localData.BIRTH_DATE" label="Geburtsdatum"  type="date"/>
          <q-select class="col-6" dense outlined v-model="localData.SEX_CD" :options="options.SEX_CD" label="Geschlecht" />
        </div>
          <div class="row justify-between q-pa-sm bg-grey-1 q-mt-sm relative-position">
            <div class="text-caption absolute-top-right text-grey-7" style="top:-8px">fakultativ</div>
          <q-input class="col-3" dense outlined v-model="localData.STATECITYZIP_PATH" label="PLZ" />
          <q-select class="col-6" dense outlined v-model="localData.RACE_CD" :options="options.RACE_CD" label="Ethnische Gruppe" />
          <q-select class="col-6" dense outlined v-model="localData.LANGUAGE_CD" :options="options.LANGUAGE_CD" label="Sprache" />
          </div>


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

import { datenow_isostring } from 'src/tools/mydate'

export default {
  name: 'Dialog_EditPerson',

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
    if (!this.$store.getters.PATIENT_PINNED) {
      this.$q.notify({
        message: 'Kein Patient ausgewählt',
        color: 'warning',
        position: 'bottom'
      })
      this.$emit('close')
    }
    this.loadData()

  },

  computed: {
    OBLIGATE_DATE_SET() {
      if (!this.localData) return false
      if (!this.localData.PATIENT_CD) return false
      if (!this.localData.BIRTH_DATE) return false
      if (!this.localData.SEX_CD) return false
      return true
    }


  },

  methods: {
    async loadData() {

      // load the options
      this.options.SEX_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA')
      this.options.RACE_CD = await this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\46463-6\\LA')
      this.options.LANGUAGE_CD = await this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\54505-3\\LA\\')
      this.options.VITAL_STATUS_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\365860008\\LA')

      // prepare the local data
      const PATIENT_NUM = this.$store.getters.PATIENT_PINNED.PATIENT_NUM
      const res = await this.$store.dispatch('searchDB', {table: 'PATIENT_DIMENSION', query_string: {PATIENT_NUM}})
      const patient = res[0]

      this.localData.PATIENT_CD = patient.PATIENT_CD
      if (patient.BIRTH_DATE) this.localData.BIRTH_DATE = patient.BIRTH_DATE
      if (patient.STATECITYZIP_PATH) this.localData.STATECITYZIP_PATH = patient.STATECITYZIP_PATH
      if (patient.VITAL_STATUS_CD) this.localData.VITAL_STATUS_CD = this.options.VITAL_STATUS_CD.find(x => x.value === patient.VITAL_STATUS_CD)
      if (patient.SEX_CD) this.localData.SEX_CD = this.options.SEX_CD.find(x => x.value === patient.SEX_CD)
      if (patient.RACE_CD) this.localData.RACE_CD = this.options.RACE_CD.find(x => x.value === patient.RACE_CD)
      if (patient.LANGUAGE_CD) this.localData.LANGUAGE_CD = this.options.LANGUAGE_CD.find(x => x.value === patient.LANGUAGE_CD)

      this.show_dialog = true
      this.data_loaded = true
    },

    async saveObs() {
      // prepare the payload
      const WHERE = {PATIENT_NUM: this.$store.getters.PATIENT_PINNED.PATIENT_NUM}
      var SET = {
        PATIENT_CD: this.localData.PATIENT_CD,
        BIRTH_DATE: this.localData.BIRTH_DATE,
        SEX_CD: this.localData.SEX_CD.value,
        SOURCESYSTEM_CD: 'SNOMED-CT',
        PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID
      }
      if (this.localData.STATECITYZIP_PATH) SET.STATECITYZIP_PATH = this.localData.STATECITYZIP_PATH
      if (this.localData.VITAL_STATUS_CD) SET.VITAL_STATUS_CD = this.localData.VITAL_STATUS_CD.value
      if (this.localData.RACE_CD) SET.RACE_CD = this.localData.RACE_CD.value
      if (this.localData.LANGUAGE_CD) SET.LANGUAGE_CD = this.localData.LANGUAGE_CD.value

      const res = await this.$store.dispatch('updateDB', {table: 'PATIENT_DIMENSION', query_string: {where: WHERE, set: SET}})
      this.$store.commit('PATIENT_PINNED_SET', undefined)
      this.$q.notify({
        message: res,
        color: 'positive',
        position: 'bottom'
      })
      this.$emit('refresh')

    }

  }


}
</script>
