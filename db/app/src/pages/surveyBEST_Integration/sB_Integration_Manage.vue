<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'surveyBEST Integration / Manage'" :img="'provider-color-logo.png'" :icon="'summarize'" />
      </template>
      <!-- MAIN -->

      <!-- FILTER -->
      <template v-slot:options_right>
        <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table" :rows="QUESTS" row-key="CODE_CD" :columns="columns" dense
          :rows-per-page-options="[10, 25, 50, 100]" :filter="filter">
        </q-table>

      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <!-- LOCATOIN_CD -->
        <BOTTOM_BUTTONS
          :show_delete="true" :show_add="true"
          
          @delete="comming_soon()"
          
        />
      </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

import { unstringify } from 'src/classes/sqltools'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'surveyBEST_Integration_Manage',

  data() {
    return {
      QUESTS: [],
      filter: undefined,
      columns: [
        { name: 'CODE_CD', required: true, label: 'ID', align: 'center', field: 'CODE_CD', sortable: true },
        { name: 'NAME_CHAR', required: true, label: 'Bez.', align: 'left', field: 'NAME_CHAR', sortable: true },
      ],
    }
  },

  components: { HEADING, MainSlot,FILTER_BOX, BOTTOM_BUTTONS },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.loadLocalData()
  },

  watch: {


  },

  computed: {

  },

  methods: {
    comming_soon() {
      this.$q.notify({
        message: 'Coming Soon',
        color: 'warning',
        icon: 'warning',
        position: 'bottom',
        timeout: 1000
      })
    },

    loadLocalData() {
      this.$store.dispatch('searchDB', { query_string: { COLUMN_CD: 'SURVEY_BEST' }, table: "CODE_LOOKUP" })
        .then(res => this.formatResult(res))
    },

    formatResult(res) {
      this.QUESTS = res
      this.QUESTS.forEach(s => {
        s.LOOKUP_JSON = JSON.parse(unstringify(s.LOOKUP_BLOB))
      })
      console.log(this.QUESTS)
    },

  }

}
</script>
