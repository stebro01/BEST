<template>
    <q-dialog v-model="ACTIVE">
      <q-card >
        <q-btn icon="close" class="absolute-top-right z-top" flat round @click="$emit('close')"/>
        <q-card-section>Concept auswählen</q-card-section>
        <q-card-section>
          
          <q-form @submit="searchCONCEPT(CONCEPT_PATH_search_string, options_CONCEPT_PATH_search_selected)">
              <q-input v-model="CONCEPT_PATH_search_string" dense input-class="text-center">
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"
                    @click="searchCONCEPT(CONCEPT_PATH_search_string, options_CONCEPT_PATH_search_selected)" />
                </template>
              </q-input>
            </q-form>
            <div class="text-center q-mt-md">
              <q-btn-dropdown color="primary" :label="options_CONCEPT_PATH_search_selected">
                <q-list>
                  <q-item v-for="(item, ind) in options_CONCEPT_PATH_search" :key="ind + 'options_conceptpath'"
                    v-close-popup clickable v-ripple @click="options_CONCEPT_PATH_search_selected = item">
                    {{ item }}
                  </q-item>
                </q-list>

              </q-btn-dropdown>
            </div>
        </q-card-section>
        <q-card-section v-if="options_CONCEPT_PATH_search_results && options_CONCEPT_PATH_search_results.length > 0">
          <div>Results:</div>
          <div >
            <q-list>
              <q-item v-for="(item_concept, ind_concept) in options_CONCEPT_PATH_search_results"
                :key="ind_concept + 'concept'" clickable v-ripple @click="selectItem(item_concept)">
                <q-item-section side>
                  {{ item_concept.VALTYPE_CD }}
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ item_concept.NAME_CHAR }}</q-item-label>
                  <q-item-label caption>{{ item_concept.CONCEPT_CD }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>


<script>
export default {
  name: 'SelectConcept_New',

  props: ['active'],

  components: {  },

  data() {
    return {
      CONCEPT_PATH_search_string: null,
      options_CONCEPT_PATH_search: ['CONCEPT_PATH', 'CONCEPT_CD', 'NAME_CHAR'],
      options_CONCEPT_PATH_search_selected: 'NAME_CHAR',
      options_CONCEPT_PATH_search_results: []
    }
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
    selectItem(item) {
      this.$emit('save', item)
    },

    searchCONCEPT(val, type) {
      if (!val || !type) return
      this.$store.dispatch('searchDB', {query_string: {[type]: val, _like: true}, table: 'CONCEPT_DIMENSION'})
      .then(res => {
        if (res.length > 0) {
          this.options_CONCEPT_PATH_search_results = []
          res.forEach(r => {
            this.options_CONCEPT_PATH_search_results.push(r)
          })
        }
      })
    },


  }






}
</script>