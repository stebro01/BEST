<template>
 

    <!-- CQL BUILD RULE -->
    <div class="row justify-center" v-if="selected_data">
      <q-card class="q-mb-xl my-item">
        <q-card-section>Assoziierte Concepts <span >: CQL_ID = {{ selected_data.CQL_ID }}</span></q-card-section>
        <q-card-section>
          <q-table :rows="cql_list" :columns="columns" row-key="CONCEPT_CQL_ID" selection="single"
            v-model:selected="selected_concept">

          </q-table>
        </q-card-section>
      </q-card>
    </div>

</template>

<script>

export default {
  name: 'Card_CQL_concepts',

  props: ['selected_data'],

  components: {  },

  data() {
    return {
      localData: undefined,
      cql_list: [],
      columns: [
        { name: 'CONCEPT_CQL_ID', align: 'center', label: 'ID', field: 'CONCEPT_CQL_ID', sortable: true },
        { name: 'CONCEPT_CD', align: 'center', label: 'CONCEPT_CD', field: 'CONCEPT_CD', sortable: true },
        { name: 'CONCEPT_NAME_CHAR', align: 'center', label: 'Beschr.', field: 'CONCEPT_NAME_CHAR', sortable: true },
      ],
      selected_concept: []

    }
  },

  mounted() {
    this.loadData(this.selected_data)
  },

  watch: {
    selected_data(val) {
      if (val) this.loadData(val)
    }

  },

  computed: {

  },

  methods: {
    async loadData(data) {
      if (!data) return
      this.cql_list = await this.$store.dispatch('searchDB', {table: 'CONCEPT_CQL_LOOKUP', query_string: {CQL_ID: data.CQL_ID, _view: true}})
      

    }
   
    
    
   

    //ende methods
  }

}
</script>
