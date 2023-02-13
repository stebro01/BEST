<template>
   <!-- CONCEPT_PATH_DIALOG -->
    <q-dialog v-model="ACTIVE">
      <q-card class="my-card">
        <q-btn icon="close" round flat class="absolute-top-right z-top" v-close-popup />
        <q-card-section>Pick Path</q-card-section>
          <!-- SEARCHBOX -->
        <q-card-section>
          <div class="row">
            <div class="col-5 relative-position">
              <q-btn-dropdown color="primary" :label="options_CONCEPT_PATH_search_selected">
                <q-list>
                  <q-item v-for="(item, ind) in options_CONCEPT_PATH_search" :key="ind + 'options_conceptpath'"
                    v-close-popup clickable v-ripple @click="options_CONCEPT_PATH_search_selected = item">
                    {{ item }}
                  </q-item>
                </q-list>

              </q-btn-dropdown>

            </div>
            <div class="col">
              <q-form @submit="search_CONCEPT_PATH(CONCEPT_PATH_search_string, options_CONCEPT_PATH_search_selected)">
              <q-input v-model="CONCEPT_PATH_search_string" dense input-class="text-center">
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"
                    @click="search_CONCEPT_PATH(CONCEPT_PATH_search_string, options_CONCEPT_PATH_search_selected)" />
                </template>
              </q-input>
            </q-form>
            </div>
          </div>
        </q-card-section>
        <!-- RESULTS -->
        <q-card-section v-if="options_CONCEPT_PATH_search_results && options_CONCEPT_PATH_search_results.length > 0">
          <div>Results:</div>
          <div >
            <q-list>
              <q-item v-for="(item_concept, ind_concept) in options_CONCEPT_PATH_search_results"
                :key="ind_concept + 'concept'" clickable v-ripple @click="split_path(item_concept.CONCEPT_PATH)">
                <q-item-section side>
                  {{ item_concept.NAME_CHAR }}
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ item_concept.CONCEPT_CD }}</q-item-label>
                  <q-item-label caption>{{ item_concept.CONCEPT_PATH }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <!-- PATH -->
        <q-card-section>
          <q-markup-table>
            <tbody>
              <tr>
                <td>Pfad: </td>
                <td colspan="4" v-if="new_path && new_path.length > 0">
                  <span v-for="(item_path, ind_path) in new_path" :key="ind_path + 'path'">
                    \<q-chip dense :removable="ind_path > 0" @remove="remove_path_item(ind_path)">{{ item_path }}</q-chip>
                </span>
                  <!-- add -->
                  \<q-chip dense color="black" class="text-white cursor-pointer"> <q-icon name="add"/>
                    <q-popup-edit v-model="add_path_item" auto-save v-slot="scope">
                      <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @change="add_path(scope.value)"/>
                    </q-popup-edit>
                  </q-chip>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-actions align="center" v-if="something_changed">
          <q-btn rounded class="my-btn" @click="saveChanges()">übernehmen</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>


<script>

export default {
  name: 'PickPath',

  props: ['active', 'path'],


  data() {
    return {
      CONCEPT_PATH_search_string: null,
      options_CONCEPT_PATH_search: ['CONCEPT_PATH', 'CONCEPT_CD', 'NAME_CHAR'],
      options_CONCEPT_PATH_search_selected: 'NAME_CHAR',
      options_CONCEPT_PATH_search_results: [],
      new_path: undefined,
      add_path_item: null,
      something_changed: false
    }
  },

  mounted() {
    if (this.path) {
      this.new_path = JSON.parse(JSON.stringify(this.path))
      this.split_path(this.new_path)
      this.something_changed = false
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
    split_path(val) {
      if (!val) return false
      var tmp = val.split('\\')
      if (tmp.length > 0) {
        this.new_path = []
        tmp.forEach(t => {
          if (t && t !== '') this.new_path.push(t)
        })
      }
      this.options_CONCEPT_PATH_search_results = []
      this.something_changed = true
    },

    search_CONCEPT_PATH(val, type) {
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

    remove_path_item(ind) {
      if (ind === undefined || !this.new_path || this.new_path.length-1 < ind) return false
      this.new_path.splice(ind, 1)
      this.something_changed = true
    },

    add_path(item) {
      if (!item || !Array.isArray(this.new_path)) return
      this.new_path.push(item)
      this.something_changed = true
    },

    saveChanges() {
      var result = `\\${this.new_path.join('\\')}\\`
      this.$emit('save', result)
    }
  }






}
</script>