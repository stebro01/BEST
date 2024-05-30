<template>
  <q-dialog v-model="ACTIVE">
    <q-card class="my-card q-pa-lg z-max">
      <q-btn flat round class="absolute-top-right z-top" icon="close" @click="$emit('close')" />
      <q-card-section class="text-h6 q-pa-none">
        {{ TEXT.title }}
      </q-card-section>
      <q-card-section v-if="!select_patient_list" class="q-pa-none">
        <q-form @submit="selectPatient(PATIENT)" class="row justify-center">
          <!-- PATIENT_CD -->
          <q-input dense lazy-rules style="width: 250px" v-model="PATIENT.PATIENT_CD" type="text"
            input-class="text-center" label="Patient-ID (PATIENT_CD)">
            <template v-slot:append>
              <q-icon name="close" @click="PATIENT.PATIENT_CD = null" />
            </template>
          </q-input>

          <!-- PATIENT_NUM -->
          <q-input dense lazy-rules style="width: 250px" v-model="PATIENT.PATIENT_NUM" type="number"
            input-class="text-center" label="lfd. Nummer (PATIENT_NUM)">
            <template v-slot:append>
              <q-icon name="close" @click="PATIENT.PATIENT_NUM = null" />
            </template>
          </q-input>
          <!-- BUTTONS -->
          <div class="absolute-bottom-right">
            <q-btn flat round icon="search" type="submit" />
          </div>


        </q-form>
      </q-card-section>

      <SELECT_LIST_CARD_SECTION v-else  :list="select_patient_list" @save="$emit('save', $event)"/>

    </q-card>
  </q-dialog>
</template>

<script>

import SELECT_LIST_CARD_SECTION from 'src/components/elements/SelectListCardSection.vue'
export default {
  name: 'Dialog_SelectPatient',

  props: ['active'],

  components: { SELECT_LIST_CARD_SECTION },

  data() {
    return {
      select_patient_list: false,
      PATIENT: {}
    }
  },

  mounted() {
   
    
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.dialog.select_patient
    }, 

    ACTIVE: {
        get() {
            return this.active
        },
        set(val) {

            this.$emit('close')
        }
    }
  },

  methods: {
    selectPatient(PATIENT){
      if (!PATIENT) return
      var query_string = undefined
      if (PATIENT.PATIENT_CD) query_string = {PATIENT_CD: PATIENT.PATIENT_CD, _like: true, _view: true}
      else if (PATIENT.PATIENT_NUM) {
        query_string = {PATIENT_NUM: PATIENT.PATIENT_NUM}
        if (PATIENT.PATIENT_NUM == 0) query_string = {...query_string, _greater: true, _view: true}
      }
      if (!query_string) return
      
      this.$store.dispatch('searchDB', {query_string: query_string,"table":"PATIENT_DIMENSION"})
      .then(res => {
        if (res.length > 0) {0
          this.select_patient_list = res
        }
        else this.$q.notify(`Patient mit << ${JSON.stringify(PATIENT)} >> nicht gefunden`)
      })
      .catch(err => this.$q.notify('Error: ' + err))
    },
  }






}
</script>