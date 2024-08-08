<template>
  <div class="row justify-center q-mb-lg">
    <!-- PREVIEW PATIENT -->
    <PREVIEW_IMPORT_INFO v-if="mode_visits" :data_checked="data_checked" :patient_data="patient_data" :mode_visits="mode_visits"
      @updateMode="mode_visits = $event" @close="$emit('close')"
      @save="saveToDB()"
    />
    <!-- PREVIEW CONTENT -->
    <PREVIEW_IMPORT_DATA v-if="data_checked"
      :patient_data="patient_data" :total_errors_found="total_errors_found"
      @remove="removeItem($event)"
    />
    <div v-if="!data_checked" class="col-12 q-mb-lg text-center">
      <div  v-if="doing_check === false" >
        <q-btn no-caps rounded class="q-mt-md" @click="checkCQL_single(patient_data)">Daten mit CQL überprüfen</q-btn>
      </div>

    </div>
  </div>
</template>

<script>

import PREVIEW_IMPORT_INFO from './PreviewImportInfo.vue'
import PREVIEW_IMPORT_DATA from './PreviewImportData.vue'
import modes_import from 'src/mixins/modes_import'

export default {
  name: 'PreviewImport',

  components: { PREVIEW_IMPORT_DATA, PREVIEW_IMPORT_INFO },

  mixins: [modes_import],

  props: ['imported_data'],

  data() {
    return {
      mode_visits: undefined,
      data_checked: false,
      doing_check: false,
      total_errors_found: undefined,
      patient_data: undefined
    }
  },

  mounted(){
    if (this.imported_data) this.patient_data = JSON.parse(JSON.stringify(this.imported_data))
    //define the mode in which new Observations will be added: as 'new' visit or 'add' to existing one
    if (this.$store.getters.VISIT_PINNED !== undefined) this.mode_visits =  this.$store.getters.MODE_VISITS.add
    else this.mode_visits = this.$store.getters.MODE_VISITS.new
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT
    },


  },

  methods: {
    async checkCQL_single(data) {
      this.doing_check = true

      const ERRORS = await this.checkCQL(data)
      this.total_errors_found = ERRORS.total_errors_found
      this.doing_check = false
      this.data_checked = true
    },

    removeItem(item) {
      if (!item || typeof(item) !== 'object') return
      if (item.visit !== undefined) {
        if (!item.observation) {
          this.patient_data.VISITS.splice(item.visit,1)
          this.patient_data.OBSERVATIONS.splice(item.visit,1)
        }

      }
      this.data_checked = false
      this.$nextTick(() => this.data_checked = true)
    },

    saveToDB() {
      const data = this.patient_data
      if (!data) return;
      if (data.PATIENT) {
        data.PATIENT.PATIENT_CD = this.$store.getters.PATIENT_PINNED.PATIENT_CD;
        if (this.mode_visits === "add")
          data.FORCE_VISIT = this.$store.getters.VISIT_PINNED;

        this.$store
          .dispatch("saveHL7ObjectsToDB", data)
          .then((res) => {
            if (res.status) this.$q.notify(res.data);
            else if (res.error) this.$q.notify(res.error);
          })
          .catch((err) => this.$q.notify("Error: ", err))
          .finally(() => {
            this.$emit('close')
          });
      }
    },

  }

}
</script>
