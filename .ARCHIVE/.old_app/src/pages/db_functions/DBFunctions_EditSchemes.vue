<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'concept-import-logo.png'" :icon="'dashboard_customize'"/>
      </template>

      <template v-slot:options_right>
        <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table" :rows="SCHEMES" row-key="CODE_CD" :columns="columns" dense
          :rows-per-page-options="[10, 25, 50, 100]" :filter="filter" v-model:expanded="expanded">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />

              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove" @update:model-value="edit_mode = false"/>
              </q-td>

              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
            <q-tr v-if="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left text-bold"> {{ props.row.LOOKUP_JSON.title }}</div>
                <div class="text-left text-caption"> {{ props.row.LOOKUP_JSON.description }}</div>
                <div class="row q-gutter-md" :class="{'justify-between': props.row.LOOKUP_JSON.data.length > 4}">
                  <q-card v-for="(item, ind) in props.row.LOOKUP_JSON.data" :key="ind + 'scheme'" dense>
                    <q-card-section>
                      <q-item-label><RESOLVE_CONCEPT :item="item.CONCEPT_CD"/></q-item-label>
                      <q-item-label caption>{{ item.CONCEPT_CD }}</q-item-label>
                     
                    </q-card-section>
                  </q-card>
                </div>

              </q-td>
            </q-tr>
          </template>

        </q-table>

      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS v-if="SCHEMES" :show_edit="expanded.length === 1" :show_delete="expanded.length > 0"
          :show_add="expanded.length === 0" @edit="editData(expanded[0])" @delete="deleteData(expanded)"
          @add="addData()" />
      </template>

    </MainSlot>
  </q-page>
</template>

<script>


import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import MainSlot from 'src/components/MainSlot.vue'
import RESOLVE_CONCEPT from 'src/components/elements/ResolveConcept.vue'

import { unstringify } from 'src/classes/sqltools'
export default {
  name: 'DBFunctions_EditSchemes',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, MainSlot, RESOLVE_CONCEPT },

  data() {
    return {
      SCHEMES: [],
      filter: undefined,
      expanded: [],
      columns: [
      { name: 'CODE_CD',required: true,label: 'ID',align: 'center',field: 'CODE_CD',sortable: true},
      { name: 'NAME_CHAR',required: true,label: 'Bez.',align: 'left',field: 'NAME_CHAR',sortable: true},
      ],
    }
  },

  mounted() {
   this.loadLocalData()
  },

  watch: {


  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.schemes_edit
    }
  },

  methods: {
    loadLocalData() {
      this.$store.dispatch('searchDB', { query_string: {COLUMN_CD: 'SCHEME_CD'}, table: "CODE_LOOKUP"})
      .then(res => this.formatResult(res))
    },

    formatResult(res) {
      this.SCHEMES = res
      this.SCHEMES.forEach(s => {
        s.LOOKUP_JSON = JSON.parse(unstringify(s.LOOKUP_BLOB))
      })
    },

    addData() {
      this.$router.push({name: 'DBFunctions_EditSchemes_New'})
    },

    editData(val) {
      this.$router.push({name: 'DBFunctions_EditSchemes_Edit', params: {id: val}})
    },

    deleteData(val) {
      if (!confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      const promises = []
      val.forEach(item => {
        let obj = this.SCHEMES.find(el => el.CODE_CD === item)
        promises.push(this.$store.dispatch('deleteDB', {query_string: {CODE_CD: obj.CODE_CD}, table: 'CODE_LOOKUP'}))
      })

      Promise.all(promises).finally(() => {
        this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
        this.expanded = []
        this.loadLocalData()
      })
      
    }
  }

}
</script>
