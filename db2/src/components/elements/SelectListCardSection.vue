<template>
      <q-card-section class="q-pa-none">
        <div class="text-center text-caption">{{ list.length }} {{ TEXT.found }}</div>
        <q-scroll-area style="height: 300px; width: 100%">
          <q-list dense separator>
            <q-item v-for="(item, ind) in list" :key="ind + 'pat'" clickable v-ripple
              @click="$emit('save', item)">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ item.PATIENT_CD }}
                </q-item-label>
                <q-item-label class="text-caption">
                  lfdN: {{ item.PATIENT_NUM }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label> Alter: {{ item.AGE_IN_YEARS }} </q-item-label>
                <q-item-label> Sex: {{ item.SEX_RESOLVED }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
</template>


<script>
export default {
  name: 'SelectListCardSection',

  props: ['list'],

  components: {  },

  data() {
    return {
      file_to_read: undefined
    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.dialog.select_patient
    }, 
  }






}
</script>