<template>
  <q-page class="column text-center q-pa-sm non-selectable" style="height: 100%">

      <div class="col-1 text-grey-7">
        <span > {{getaquote.quote}}</span>
        <span class="text-caption"> ({{getaquote.author}})</span>
      </div>

      <div class="col" >
        <div class="text-h6 bg-accent q-pa-md">Was willst Du machen?</div>

         
        <div  class="absolute-center q-gutter-y-xl">
          <q-btn  color="primary" rounded class="my-list-btn" label="Datenbank verbinden" @click="this.$router.push({name: 'selectDB'})" />

          <q-btn  class="my-list-btn text-black" rounded label="neue DB erstellen" @click="this.$router.push({name: 'DBFunctions_CreateDB'})" />
        </div>
      </div>
    


  </q-page>
</template>

<script>

import QUOTES from '../../public/quotes.json'

export default {
  name: 'Index',

  data() {
    return {
      SELECTION: this.$store.getters.ENV.selection_index_page
    }
  },

  components: {  },

  mounted() {
    
  },

  computed: {
    db_is_connected() {
      if (!this.$store.getters.CONNECTED) return false
      else return true
      
    },

    getaquote() {
      const num = Math.floor((Math.random()*QUOTES.quotes.length));
      return QUOTES.quotes[num]
    }
  },

  methods: {
  }

}
</script>
