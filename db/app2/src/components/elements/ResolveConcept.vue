<template>
  <span>
    {{CONCEPT}}
  </span>

</template>


<script>

export default {
    name: 'ResolveConcept',

    props: ['item'],

    data() {
    return {
      CONCEPT: undefined
    }},

    watch: {
      item(val) {
        if (val && val.label) this.CONCEPT = val.label
      }
    },


    mounted() {
      if (this.item) {
        this.$store.dispatch('getConceptBy_CONCEPT_CD', this.item)
        .then(res => {
          this.CONCEPT = res.label
        })
      }
    }


}
</script>