<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Neue Person hinzufügen
      </q-card-section>
      <q-card-section >
        <q-banner v-if="!data_loaded">Bereite Maske vor</q-banner>
        <q-form v-else>
          <div class="row justify-between bg-green-1 q-pa-sm relative-position">
            <div class="text-caption absolute-top-right text-grey-7" style="top:-8px">obligat</div>
          <q-input class="col-8" dense outlined v-model="localData.PATIENT_CD" label="ID" hint="Einzigartige ID, z.B. SAP Nummer"/>
          <q-select class="col-4" dense outlined v-model="localData.VITAL_STATUS_CD" :options="options.VITAL_STATUS_CD" label="Status"/>
          <q-input class="col-6" dense outlined v-model="localData.BIRTH_DATE" label="Geburtsdatum"  type="date"/>
          <q-select class="col-6" dense outlined v-model="localData.SEX_CD" :options="options.SEX_CD" label="Geschlecht" />
        </div>
          <div class="row justify-between q-pa-sm bg-grey-1 q-mt-sm relative-position">
            <div class="text-caption absolute-top-right text-grey-7" style="top:-8px">fakultativ</div>
          <q-input class="col-3" dense outlined v-model="localData.STATECITYZIP_PATH" label="PLZ" />
          <q-input class="col-5" dense outlined v-model="localData.PATIENT_NAME" label="Name" />
          <q-input class="col-4" dense outlined v-model="localData.PATIENT_SURNAME" label="Vorname" />
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

import { hri } from 'src/tools/db_tools'
import { datenow_isostring } from 'src/tools/mydate'

export default {
  name: 'Dialog_AddPerson',

  props: ['data'],

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
    if (!this.data) return
    if (this.data) this.show_dialog = true
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
      this.localData.PATIENT_CD = hri()

      this.options.SEX_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA')
      this.options.RACE_CD = await this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\46463-6\\LA')
      this.options.LANGUAGE_CD = await this.$store.dispatch('getConceptList', '\\LOINC\\ADMIN.DEMOG\\Patient\\54505-3\\LA\\')
      this.options.VITAL_STATUS_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\365860008\\LA')

      this.data_loaded = true
    },

    async saveObs() {
      // prepare the payload
      var PATIENT_NAME = undefined
      const payload = {
        PATIENT_CD: this.localData.PATIENT_CD,
        BIRTH_DATE: this.localData.BIRTH_DATE,
        SEX_CD: this.localData.SEX_CD.value,
        SOURCESYSTEM_CD: 'SNOMED-CT',
        PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID
      }
      if (this.localData.PATIENT_NAME) PATIENT_NAME = this.localData.PATIENT_NAME
      if (this.localData.PATIENT_SURNAME) PATIENT_NAME = PATIENT_NAME + ', ' + this.localData.PATIENT_SURNAME
      if (this.localData.STATECITYZIP_PATH) payload.STATECITYZIP_PATH = this.localData.STATECITYZIP_PATH
      if (this.localData.VITAL_STATUS_CD) payload.VITAL_STATUS_CD = this.localData.VITAL_STATUS_CD.value
      if (this.localData.RACE_CD) payload.RACE_CD = this.localData.RACE_CD.value
      if (this.localData.LANGUAGE_CD) payload.LANGUAGE_CD = this.localData.LANGUAGE_CD.value

      const res = await this.$store.dispatch('addDB', {table: 'PATIENT_DIMENSION', query_string: payload})
      if (res.PATIENT_NUM) {
        // also add an encounter
        const res_encounter = await this.$store.dispatch('addDB', {table: 'VISIT_DIMENSION', query_string: {PATIENT_NUM: res.PATIENT_NUM, START_DATE: datenow_isostring(), ACTIVE_STATUS_CD: 'SCTID: 55561003', SOURCESYSTEM_CD: 'SNOMED-CT'}})
        if (res_encounter && res_encounter.ENCOUNTER_NUM) {
          if (payload.SEX_CD) await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: {PATIENT_NUM: res.PATIENT_NUM, ENCOUNTER_NUM: res_encounter.ENCOUNTER_NUM, PROVIDER_ID: payload.PROVIDER_ID, CONCEPT_CD: 'SCTID: 263495000', TVAL_CHAR: payload.SEX_CD, SOURCESYSTEM_CD: 'SNOMED-CT', VALTYPE_CD: 'S'}})
          if (PATIENT_NAME) await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: {PATIENT_NUM: res.PATIENT_NUM, ENCOUNTER_NUM: res_encounter.ENCOUNTER_NUM, PROVIDER_ID: payload.PROVIDER_ID, CONCEPT_CD: 'SCTID: 371484003', TVAL_CHAR: PATIENT_NAME, SOURCESYSTEM_CD: 'SNOMED-CT', VALTYPE_CD: 'T'}})
          if (payload.BIRTH_DATE) await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: {PATIENT_NUM: res.PATIENT_NUM, ENCOUNTER_NUM: res_encounter.ENCOUNTER_NUM, PROVIDER_ID: payload.PROVIDER_ID, CONCEPT_CD: 'SCTID: 184099003', TVAL_CHAR: payload.BIRTH_DATE, SOURCESYSTEM_CD: 'SNOMED-CT', VALTYPE_CD: 'T'}})
        }
        this.$q.notify({
          message: 'Patient erfolgreich gespeichert',
          color: 'positive',
          position: 'bottom'
        })
        this.$emit('refresh')
      } else {
        this.$q.notify({
          message: 'Fehler beim Speichern. Existiert die ID bereits?',
          color: 'negative',
          position: 'bottom'
        })
      }

    }

  }


}
</script>
