<template>

  <q-dialog v-model="ACTIVE">
    <q-card>
      <q-btn icon="close" class="absolute-top-right z-top" flat round @click="$emit('close')" />
      <q-card-section>Neue Visite</q-card-section>
      <q-card-section>
        <q-form>
          <q-markup-table v-if="localData" dense>
            <tbody>
              <!-- ID -->
              <tr><td>PATIENT_NUM</td><td>{{ localData.PATIENT_NUM }}</td></tr>
              <tr><td>ACTIVE_STATUS_CD</td><td><q-select v-model="localData.ACTIVE_STATUS_CD" :options="options_ACTIVE_STATUS_CD" dense filled /></td></tr>
              <tr><td>START_DATE</td><td ><q-input dense filled v-model="localData.START_DATE" type="date"/></td></tr>
              <tr><td>END_DATE</td><td><q-input dense filled v-model="localData.END_DATE" type="date"/></td></tr>
              <tr><td>LOCATION_CD</td><td><q-select v-model="localData.LOCATION_CD" :options="options_LOCATION_CD" dense filled /></td></tr>
              <tr><td>Beschreibung</td><td ><q-input dense filled v-model="localData.VISIT_BLOB" type="text"/></td></tr>

              <!-- SOURCESYSTEM_CD -->
              <tr><td>SOURCESYSTEM_CD</td><td>{{ localData.SOURCESYSTEM_CD }}</td></tr>

            </tbody>
          </q-markup-table>
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn no-caps rounded class="my-btn" @click="saveItem">{{ $store.getters.TEXT.btn.save }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>


<script>
export default {
  name: 'NewVisitDialog',

  props: ['active', 'item'],

  components: {  },

  data() {
    return {
      localData: undefined,
      options_LOCATION_CD: [],
      options_ACTIVE_STATUS_CD: []
    }
  },

  mounted() {
    if (!this.item) return
    this.localData = {
      SOURCESYSTEM_CD: 'SNOMED-CD',
      START_DATE: this.item.START_DATE,
      END_DATE: this.item.END_DATE,
      PATIENT_NUM: this.item.PATIENT_NUM,
      ACTIVE_STATUS_CD: undefined,
      LOCATION_CD: undefined,
      VISIT_BLOB: undefined
    }
    this.loadAnswers()
   
  },

  computed: {
    ACTIVE: {
      get() {
        return this.active
      }, set(val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    async loadAnswers() {
      // LOCATIONS
      const opt_loc = await this.$store.dispatch('searchDB', {query_string: {COLUMN_CD: 'LOCATION_CD'}, table: 'CODE_LOOKUP'})
      opt_loc.forEach(o => {
        this.options_LOCATION_CD.push({value: o.CODE_CD, label: o.NAME_CHAR})
      })
      // STATUS
      const concept_status = await this.$store.dispatch('searchDB', {query_string: {CONCEPT_CD: 'SCTID: 106234000'}, table: 'CONCEPT_DIMENSION'})
      const opt_concept = await this.$store.dispatch('searchDB', {query_string: {CONCEPT_PATH: `${concept_status[0].CONCEPT_PATH}\\`, _like: true}, table: 'CONCEPT_DIMENSION'})
      opt_concept.forEach(o => {
        this.options_ACTIVE_STATUS_CD.push({value: o.CONCEPT_CD, label: o.NAME_CHAR})
      })
    },

  
    async saveItem() {
      if (this.localData.LOCATION_CD && typeof(this.localData.LOCATION_CD) === 'object') this.localData.LOCATION_CD =this.localData.LOCATION_CD.value
      if (this.localData.ACTIVE_STATUS_CD && typeof(this.localData.ACTIVE_STATUS_CD) === 'object') this.localData.ACTIVE_STATUS_CD =this.localData.ACTIVE_STATUS_CD.value

      if (!this.localData.START_DATE || !this.localData.LOCATION_CD || !this.localData.ACTIVE_STATUS_CD) return this.$q.notify('Bitte Daten komplett ausfuellen')
      const res = await this.$store.dispatch('addDB', {query_string: this.localData, table: 'VISIT_DIMENSION'})
      if (!res) return this.$q.notify('etwas ging schief/ DB gespeert?')
      this.localData.ENCOUNTER_NUM = res.ENCOUNTER_NUM
      this.$emit('save', this.localData)
    },
 
  }






}
</script>