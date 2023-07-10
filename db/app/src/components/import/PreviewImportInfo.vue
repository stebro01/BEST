<template>
     <q-card v-if="patient_data" class="my-card text-center">
      <q-card-section>
        <q-banner dense inline-actions class="bg-green-3">Daten gefunden
          <template v-slot:action>
            <q-btn round flat color="black" icon="close" @click="$emit('close')"><q-tooltip>Zum Abbrechen hier klicken</q-tooltip></q-btn>
          </template>
        </q-banner>
        <q-banner v-if="info_patientcd_doesnot_match" dense inline-actions class="bg-red-1">
          <span class="text-caption">
            PATIENT_CD vom Import stimmt nicht mit aktuellem Patienten
            überein. Wenn Sie fortfahren, wird der Datensatz dem aktuellen
            Patienten hinzugefügt.
          </span>
          <template v-slot:action>
            <q-btn round flat color="black" icon="close" @click="ignore_info = true"><q-tooltip>Hier Klicken um Meldung auszublenden.</q-tooltip> </q-btn>
          </template>
        </q-banner>
      </q-card-section>
      <q-card-section v-if="patient_data.PATIENT" class="q-pa-none" :class="{'text-red': info_patientcd_doesnot_match}">
        PATIENT_CD: {{ patient_data.PATIENT.PATIENT_CD }}
      </q-card-section>
      <q-card-section v-if="data_checked">
        <div> Speichermodus: 
          <q-btn-toggle no-caps v-model="MODE_VISITS" toggle-color="primary" :options="options_mode_visits" />
          <div class="col-12 my-small-text" v-if="MODE_VISITS==='new'">Visiten werden als neue Visiten hinzugefügt</div>
          <div class="col-12 my-small-text" v-else-if="MODE_VISITS==='add'">Observations werden der aktuellen Visite hinzugefügt</div>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn v-if="data_checked" class="my-btn" rounded no-caps @click="$emit('save')">
          in DB speichern
          <q-tooltip v-if="MODE_VISITS === 'new'">Die Daten werden als neue Visite(n) hinzugefügt</q-tooltip>
          <q-tooltip v-else>Die Daten werden der aktuellen Visite hinzugefügt</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
</template>


<script>
export default {
  name: 'PreviewImportInfo',

  props: ['patient_data', 'mode_visits', 'data_checked'],

  components: {  },

  data() {
    return {
      ignore_info: false
    }
  },

  computed: {
    options_mode_visits() {
      const options = [{ label: "Neu", value: this.$store.getters.MODE_VISITS.new }];
      if (this.$store.getters.VISIT_PINNED)
        options.push({ label: "Hinzufügen", value: this.$store.getters.MODE_VISITS.add });
      return options;
    },

    MODE_VISITS: {
      get() {
        return this.mode_visits
      },
      set(val) {
        this.$emit('updateMode', val)
      }
    },

    info_patientcd_doesnot_match() {
      if (this.ignore_info || !this.$store.getters.PATIENT_PINNED || !this.patient_data) return false
      return this.patient_data.PATIENT.PATIENT_CD !== this.$store.getters.PATIENT_PINNED.PATIENT_CD
    }
  },

  methods: {
   

  }






}
</script>