<template>
  <q-popup-edit v-model="VALUE" auto-save buttons v-slot="scope">
    <q-select v-model="scope.value" dense autofocus counter :options="OPTIONS" @change="this.$emit('change')"/>
  </q-popup-edit>
</template>


<script>

export default {
    name: 'PopupConcept',

    props: ['item', 'concept_string', 'value_string'],
    

    data() {
    return {
      local_options: [0]
    }},

    mounted(){
      this.$store.dispatch('searchDB', {query_string: {CONCEPT_CD: this.CONCEPT_CD}, table: 'CONCEPT_DIMENSION'})
      .then(res_concept => {
        if (res_concept.length > 0) {
          let VALTYPE_CD = res_concept[0].VALTYPE_CD
          let CONCEPT_PATH = res_concept[0].CONCEPT_PATH

          if (VALTYPE_CD === 'S') CONCEPT_PATH +='\\LA'
          else CONCEPT_PATH = '\\SNOMED-CT\\362981000\\260245000\\' //standard pfad f. F
          this.$store.dispatch('getConceptList', CONCEPT_PATH)
          .then(options => this.local_options = options)
          
        }
      })
    },

 
    computed: {
      OPTIONS() {
        return this.local_options
      },

      VALUE: {
        get() {
          return this.item[this.value_string]
        },
        set(val) {
          this.$emit('update', val)
        }
        
      },
      CONCEPT_CD() {
        return this.item[this.concept_string]
      }
    }

  


}
</script>