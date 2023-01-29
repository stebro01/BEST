<template>
   <div class="fixed-top q-mt-xl text-left z-max" style="z-index: 10">
      <q-fab
        v-if="$store.getters.PROVIDER_PINNED || $store.getters.PATIENT_PINNED"
        v-model="fab_model"
        label="Actions"
        external-label
        flat
        vertical-actions-align="left"
        class="text-black bg-white q-mt-md"
        icon="more_vert"
        active-icon="more_horiz"
        direction="down"
        :hide-label="hideLabels"
        
      >
        <span v-for="(item, ind) in BUTTON_ROW" :key="ind + 'btn'">
        <q-fab v-if="item.data"
          :class="item.class" class="q-ml-xs q-mb-sm" round flat padding="xs"
          @click="onClick(item.code)" :icon="item.icon"  
        >
          <q-chip :class="item.class" class="q-px-lg" removable @remove="chipRemove(item.code)" text-color="white" icon="face">
            <div class="q-px-md text-center"><div class="my-small-text">{{ item.label }}</div> {{item.data[item.field]}}</div>
          </q-chip>          
        </q-fab>
        </span>
      </q-fab>

   </div>
</template>


<script>
export default {
    name: 'PinnedElements',

    props: ['show_scheme_chip', 'show_import_chip', 'show_observations'],

    data() {
    return {
      hideLabels: true,
      fab_model: true
    }
  },

    computed: {
      BUTTON_ROW() {
        const data = [
          {code:'provider', label: 'Provider', class: 'my-provider-color', icon: 'face', data: this.$store.getters.PROVIDER_PINNED, field: 'NAME_CHAR' },
          {code:'patient', label: 'Aktiver Patient', class: 'my-patient-color', icon: 'personal_injury', data: this.$store.getters.PATIENT_PINNED, field: 'PATIENT_CD' },
          {code:'visit', label: 'Visite', class: 'my-visit-color', icon: 'event', data: this.$store.getters.VISIT_PINNED, field: 'START_DATE' },
          {code:'observation', label: 'Observation', class: 'my-observation-color', icon: 'event', data: this.$store.getters.OBSERVATION_PINNED, field: undefined }

        ]

        return data
      }
    },

    methods: {
      onClick(val) {
        // console.log('hi')
      },

      chipRemove(val) {

        switch(val) {
          case 'provider':
            if (this.$route.fullPath.indexOf('/visits')>= 0) this.$router.push({name: 'Visits'})
            this.$store.commit('PROVIDER_PINNED_SET', undefined);
            this.$emit('provider_removed')
            break
          case 'patient':
            this.$store.commit('PATIENT_PINNED_SET', undefined)
            this.$store.commit('VISIT_PINNED_SET', undefined)
            this.$store.commit('OBSERVATION_PINNED_SET', undefined)
            if (this.$route.fullPath.indexOf('/visits')>= 0) this.$router.push({name: 'Visits'})
            this.$emit('patient_removed')
            break
          case 'visit': 
            this.$store.commit('VISIT_PINNED_SET', undefined)
            this.$store.commit('OBSERVATION_PINNED_SET', undefined)
            this.$emit('visit_removed')
            if (this.$route.fullPath.indexOf('/visits/')>= 0) this.$router.push({name: 'VisitsView'})
            break
          case 'observation': 
            this.$store.commit('OBSERVATION_PINNED_SET', undefined)
            this.$emit('observation_removed')
            if (this.$route.fullPath.indexOf('/visits/')>= 0) this.$router.push({name: 'VisitsView'})
            break
          default:
            console.log('do nothing')
            break
        }
        // 
      }
    }


}
</script>