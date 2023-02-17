<template><!-- CQL BUILD RULE -->
  <div class="row justify-center" v-if="selected_data">
    <q-card class="q-mb-xl my-item">
      <q-card-section>Assoziierte Concepts <span>: CQL_ID = {{ selected_data.CQL_ID }}</span></q-card-section>
      <q-card-section>
        <q-table :rows="cql_list" :columns="columns" row-key="CONCEPT_CQL_ID" selection="single"
          v-model:selected="selected_concept" :filter="filter">

          <template v-slot:top>
            <q-btn-dropdown dense flat  icon="pending">
              <q-list dense>
                <q-item clickable v-close-popup @click="addRule()">
                  <q-item-section avatar><q-icon name="add"/></q-item-section>
                  <q-item-section>add</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-space />
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>

export default {
  name: 'Card_CQL_concepts',

  props: ['selected_data'],

  components: {},

  data() {
    return {
      localData: undefined,
      filter: null,
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
      this.cql_list = await this.$store.dispatch('searchDB', { table: 'CONCEPT_CQL_LOOKUP', query_string: { CQL_ID: data.CQL_ID, _view: true } })
    },

    addRule(){
      this.$q.notify('comming soon')
    }





    //ende methods
  }

}
</script>
