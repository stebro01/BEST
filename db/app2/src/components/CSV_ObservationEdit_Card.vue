<template>
        <!-- results -->
    <div class="column justify-center" v-if="ITEM">
        <q-card>
          <q-card-section v-for="(visite, ind_visite) in ITEM.VISITS" :key="ind_visite + 'visite'" class="q-pa-none q-mb-md bg-grey-3">
              <q-card-section>
                Visite: {{ ind_visite + 1 }}
              </q-card-section>
                <OBSERVATION_TABLE_SHORT :title="`Visite ${ind_visite+1}`" :input_data="ITEM.VISIT_INFO[ind_visite]" @changed="(ITEM.VISIT_INFO[ind_visite] = $event);" />
                <OBSERVATION_TABLE_EDIT :input_data=" visite" @changed="ITEM.VISITS[ind_visite] = $event"/>
          </q-card-section>
        </q-card>
      <!-- BUTTON -->
      <div class=" col q-my-lg">
        <q-btn icon="save" rounded flat class="my-btn" @click="saveCSVObservation(ITEM)">Speichern</q-btn>
      </div>
    
  </div>   

</template>


<script>

// import CONCEPT_SELECTION from 'src/components/ConceptSelect.vue'
import OBSERVATION_TABLE_SHORT from 'src/components/ObservationTable_short.vue'
import OBSERVATION_TABLE_EDIT from 'src/components/ObservationTable_edit.vue'

import { beautify_data } from 'src/tools/formatdata'

export default {
    name: 'CSV_ObservationEdit_Card',

    props: ['item', 'import_mode'],

    // components: {VALUE_ITEM, CONCEPT_SELECTION},
    components: {OBSERVATION_TABLE_SHORT, OBSERVATION_TABLE_EDIT },

    data() {
    return {
      ITEM: undefined,
      change_detected: false
    }},

    mounted() {
      // PATIENT & VISIT SELECTED, COMMENT FOR DEBUGGING
      // if (!this.$store.getters.VISIT_PINNED || !this.$store.getters.PATIENT_PINNED) {
      //   this.$router.push({name: 'Visits'})
      //   return
      // }

      //first extract globalForm data
      if (this.item) {
        this.ITEM = this.item
        
      }
    },


    computed: {
    },

    methods: {
      saveCSVObservation(PATIENT) {
        if (!this.$store.getters.PATIENT_PINNED) {
          this.$q.notify('Kein Patient aktiv')
          this.$router.push({name: 'VisitsView'})
          return
        }
        PATIENT.PATIENT_NUM = this.$store.getters.PATIENT_PINNED.PATIENT_NUM
        PATIENT.PATIENT_CD = this.$store.getters.PATIENT_PINNED.PATIENT_CD
        //resolve the VISIT_INFO
        for (let i = 0; i < PATIENT.VISIT_INFO.length; i++ ) {
          PATIENT.VISIT_INFO[i] = beautify_data(PATIENT.VISIT_INFO[i])
        }
        
        //save date
        this.$store.dispatch('saveVisitObservation_to_Patient', PATIENT).then(res => {
          this.$q.notify(res)
          this.$router.push({name: "VisitsView"})
        }).catch(err => this.$q.notify(`Fehler: ${err}`))
        
      }

  

    
    }


}
</script>
<style>
h1 {
  font-size: 1.3em;
}

h2 {
  font-size: 1.2em;
}
</style>