<template>
   <!-- CONCEPT_PATH_DIALOG -->
    <q-dialog v-model="ACTIVE">
      <q-card class="my-card">
        <q-btn icon="close" round flat class="absolute-top-right z-top" v-close-popup />
        <q-card-section>Edit Answers</q-card-section>
          <!-- SEARCHBOX -->
        <q-card-section>
          CONTENT
        </q-card-section>
        <!-- ACTIONS -->
        <q-card-actions align="center" v-if="something_changed">
          <q-btn rounded class="my-btn" @click="saveChanges()">übernehmen</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>


<script>

export default {
  name: 'EditConcept_Answers',

  props: ['active', 'CONCEPT'],


  data() {
    return {
      something_changed: false
    }
  },

  mounted() {

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
    
  }

}
</script>