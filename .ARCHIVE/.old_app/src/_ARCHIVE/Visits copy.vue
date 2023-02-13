<template>
  <q-page class="flex flex-center">
    <div class="column text-center my-list-item">

      <div class="col q-mb-xl text-h6">Visiten anzeigen und durchführen</div>

      <div class="col">
        <div class="row">
                <div class="col-12 bg-grey-3">Aktiver Patient</div>
                <div class="col-1 q-pa-xs"><q-input disable type="number" dense hint="ID" v-model.number=queryresult_patient.id /></div>
                <div class="col-3 q-pa-xs"><q-input disable dense hint="Nachname" v-model="queryresult_patient.name" /></div>
                <div class="col-2 q-pa-xs"><q-input disable dense hint="Vorname" v-model="queryresult_patient.first_name" /></div>
                <div class="col-1 q-pa-xs"><q-input disable dense hint="Gender" v-model="queryresult_patient.gender" /></div>
                <div class="col-3 q-pa-xs"><q-input disable dense hint="Geb.Datum" v-model="queryresult_patient.birthdate" /></div>
                <div class="col-2 q-pa-xs"><q-btn no-caps @click="$router.go(-1)">zurück ...</q-btn></div>
         </div>
      </div>

      <!-- VISITS -->
      <div class="col">
          <TABLE_LIST 
          :data="queryresult_visits" :datenow="datenow" :title="`Visiten (${queryresult_visits.length})`"
          :no_add="true"
          :show_lock="true"
          :mode="'visits'"
          @setProtected="setProtected($event)"
          @refresh="loadPatient()"
          @deleteItem="deleteVisit($event)"
          @editItem="editVisit($event)"
          />
      </div>

      <div class="col q-mt-lg">
        <q-btn no-caps color="primary" @click="newVisit()">Eine neue Visite anlegen und durchführen</q-btn>

      </div>
      
    </div>
    
  </q-page>
</template>

<script>
import myMixins from 'src/mixins/modes'
import TABLE_LIST from 'src/components/TableList.vue'
// import {get_date_from_timeStamp} from 'src/classes/sqltools.js'

export default {
  name: 'Visits',

  data() {
    return {
      queryresult_patient: [],
      queryresult_visits: [],
      datenow: Date.now(),
      patient_id: undefined
    }
  },

  components: {TABLE_LIST },
  mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.patient_id = this.$route.params.id
    this.loadPatient()
  },

  computed: {

  },

  methods: {
    loadPatient() {
      if (!this.patient_id) return this.$q.notify(this.$store.getters.ENV.text.alerts.no_patient_loaded)
      this.searchSQL({id: this.patient_id}, 'patients', 'ORDER BY name')
      .then(res => {
        if (res.length > 0) this.queryresult_patient = res[0]  
        // now load the visits
        this.searchSQL({patient_id: this.patient_id}, 'visits', 'ORDER BY created_time DESC')
        .then(res => {
          this.queryresult_visits = res
          this.$q.notify(this.$store.getters.ENV.text.alerts.visits_loaded)
        })
      })
    },

    setProtected(payload) {
      if (payload.protected === false && !this.$store.getters.ISADMIN) return this.$q.notify(this.$store.getters.ENV.text.alerts.only_admin_reset)
      const sqlquery = `UPDATE visits SET protected=${payload.protected} WHERE id=${payload.id}`
      this.$store.dispatch('runUpdateDB', sqlquery)
      .then(res => {
        this.$q.notify(res)
        this.queryresult_visits[payload.ind].protected = payload.protected
      })
    },

    newVisit() {
      const patient_id = this.patient_id
      if (!patient_id)return this.$q.notify(this.$store.getters.ENV.text.alerts.no_patient_loaded)
      let sqlquery = `INSERT INTO visits DEFAULT VALUES`
      this.$store.dispatch('runUpdateDB', sqlquery)
      .then(res => {
        
        const visit_id = res.data
        if (!visit_id) return this.$q.notify(this.$store.getters.ENV.text.alerts.some_sql_error)
        sqlquery = `UPDATE visits SET patient_id=${patient_id}, date_start='${get_date_from_timeStamp(Date.now())}' WHERE id=${visit_id}`
        this.$store.dispatch('runUpdateDB', sqlquery)
        .then(res => {
          this.$q.notify(res)
          this.$router.push({name: 'EditVisit', params: {id: visit_id}})
        })
        
      })
      .catch(err => {
        this.$q.notify(this.$store.getters.ENV.text.alerts.some_sql_error)
        console.error(err)
      })
    },

    deleteVisit(payload) {
      console.log('delete', payload)
      this.deleteItem({table: 'visits', id: payload.id}) //call from mixins
      .then(res => {     
        this.$q.notify(res)
        this.loadPatient()
      })
      .catch(err => this.$q.notify(err))
    },

    editVisit(payload) {
      this.$router.push({name: 'EditVisit', params: {id: payload.id}})
    }
  }

}
</script>
