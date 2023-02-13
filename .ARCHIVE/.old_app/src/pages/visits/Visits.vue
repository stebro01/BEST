<template>
  <q-page>
    <MainSlot :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'visit-color-logo.png'" :icon="'event'"/>
      </template>
      <!-- MAIN -->
      <template v-slot:main>
        <div class="row justify-center q-gutter-xl">
        <!-- UNTERSUCHER -->
          <q-card v-if="($store.getters.PROVIDER_PINNED === undefined)" class="my-card ">
            <q-item>
              <q-item-section avatar>
                <img src="~assets/provider-color-logo.png" class="my-icon-size"> </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Untersucher wählen</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-mx-sm" />

            <q-card-section>
              <q-select v-model=provider_id :options="provider_options">

              </q-select>
            </q-card-section>
          </q-card>

        <!-- SELECT PATIENT -->
          <q-card v-if="($store.getters.PATIENT_PINNED === undefined)" class="my-card">
            <q-item>
              <q-item-section avatar>
                <img src="~assets/patient-color-logo.png" class="my-icon-size"> </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Patienten auswählen</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-mx-sm" />

            <q-card-section>
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
          </q-card>
      </div>

      </template>

    </MainSlot>
    <!-- PATIENT SELECT -->
    <q-dialog v-model="select_patient_dialog">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Patienten</div>
        </q-card-section>

        <SELECT_LIST_CARD_SECTION :list="select_patient_list" @save="patientSelectedFromDialog($event)" />


        <q-card-actions align="right">
          <q-btn no-caps rounded flat :label="$store.getters.TEXT.btn.close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script>
// import myMixins from 'src/mixins/modes'
import HEADING from 'src/components/elements/Heading.vue'
import SELECT_LIST_CARD_SECTION from 'src/components/elements/SelectListCardSection.vue'
import MainSlot from 'src/components/MainSlot.vue'

// import {get_date_from_timeStamp} from 'src/classes/sqltools.js'

export default {
  name: 'Visits',

  data() {
    return {
      PATIENT: {},
      provider_id: undefined,
      provider_options: [],
      select_patient_dialog: false,
      select_patient_list: []
    }
  },

  components: {HEADING, SELECT_LIST_CARD_SECTION, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.$store.commit('VISIT_PINNED_SET', undefined)
    this.$store.commit('OBSERVATION_PINNED_SET', undefined)
    this.check_status()

    this.$store.dispatch('searchDB', {query_string:{PROVIDER_PATH: 'U', _like: true},table: "PROVIDER_DIMENSION"})
      .then(res => {
        res.forEach(r => {
          this.provider_options.push({label: r.NAME_CHAR, value: r.PROVIDER_ID, data: r})
        })
      })
  },

  watch: {
    provider_id(val) {
      if (val) this.$store.commit('PROVIDER_PINNED_SET', val.data)
      this.check_status()
    }

  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit
    }
  },

  methods: {
    //select a Patient
    selectPatient(PATIENT){
      if (!PATIENT) return
      var query_string = undefined
      if (PATIENT.PATIENT_CD) query_string = {PATIENT_CD: PATIENT.PATIENT_CD, _like: true}
      else if (PATIENT.PATIENT_NUM) {
        query_string = {PATIENT_NUM: PATIENT.PATIENT_NUM}
        if (PATIENT.PATIENT_NUM == 0) query_string = {...query_string, _greater: true, _view: true}
      }
      if (!query_string) return
      
      this.$store.dispatch('searchDB', {query_string: query_string,"table":"PATIENT_DIMENSION"})
      .then(res => {
        if (res.length === 1) {
          this.$store.commit('PATIENT_PINNED_SET', res[0])
          this.check_status()
        }
        else if (res.length > 1) {0
          this.select_patient_dialog = true
          this.select_patient_list = res
        }
        else this.$q.notify(`Patient mit << ${JSON.stringify(PATIENT)} >> nicht gefunden`)
      })
      .catch(err => this.$q.notify(err))
    },

    patientSelectedFromDialog(item) {
      this.select_patient_dialog = false
      this.select_patient_list = []
      this.$store.commit('PATIENT_PINNED_SET', item)
      this.check_status()
    },

    check_status() {
      if (this.$store.getters.PROVIDER_PINNED && this.$store.getters.PATIENT_PINNED) this.$router.push({name: 'VisitsView'})
    }

   
  }

}
</script>
