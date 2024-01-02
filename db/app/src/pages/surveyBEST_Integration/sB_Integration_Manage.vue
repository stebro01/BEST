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
          :rows-per-page-options="[10, 25, 50, 100]" :filter="filter"
          v-model:selected="selected_SB"
          selection="single"
          >
        </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <!-- LOCATOIN_CD -->
        <BOTTOM_BUTTONS
          :show_delete="selected_SB.length > 0" :show_add="selected_SB.length === 0" :show_execute="selected_SB.length > 0"
          @add="show_add_quest = true"
          @delete="deleteItem(selected_SB[0])"
          @execute="fillQuest(selected_SB[0].CODE_CD)"
        />
      </template>

    </MainSlot>

    <!-- ADD -->
    <ADD_QUEST_TEMPLATE v-if="show_add_quest" :active="show_add_quest" @close="closeAndupdate()" />
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import ADD_QUEST_TEMPLATE from 'src/components/sB_Integration/Add_QuestTemplate.vue'

import { unstringify } from 'src/classes/sqltools'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'surveyBEST_Integration_Manage',

  data() {
    return {
      QUESTS: [],
      filter: undefined,
      selected_SB: [],
      columns: [
        { name: 'CODE_CD', required: true, label: 'ID', align: 'center', field: 'CODE_CD', sortable: true },
        { name: 'NAME_CHAR', required: true, label: 'Bez.', align: 'left', field: 'NAME_CHAR', sortable: true },
      ],
      show_add_quest: false,
    }
  },

  components: { HEADING, MainSlot,FILTER_BOX, BOTTOM_BUTTONS, ADD_QUEST_TEMPLATE },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
    this.loadLocalData()
  },

  watch: {


  },

  computed: {

  },

  methods: {
    /**
     * Load all data from DB
     */
    loadLocalData() {
      this.$store.dispatch('searchDB', { query_string: { COLUMN_CD: 'SURVEY_BEST' }, table: "CODE_LOOKUP" })
        .then(res => this.formatResult(res))
    },

    formatResult(res) {
      this.QUESTS = res
      this.QUESTS.forEach(s => {
        try {
          s.LOOKUP_JSON = JSON.parse(unstringify(s.LOOKUP_BLOB))
        } catch (error) {
          s.LOOKUP_JSON = {}
        }
      })
    },

    /**
     * Delete selected item from DB
     * @param {object} item 
     */
    async deleteItem(item) {
      if (!await my_confirm(this.$store.getters.TEXT.msg.confirm_delete)) return
      await this.$store.dispatch('deleteDB', {query_string: {CODE_CD: item.CODE_CD, COLUMN_CD: 'SURVEY_BEST'}, table: 'CODE_LOOKUP'})
      this.selected_SB = []

      // finally reload
      this.loadLocalData()
    },

    closeAndupdate() {
      this.show_add_quest = false
      this.loadLocalData()
    },

    fillQuest(quest) {
      this.$router.push({name: 'surveyBEST_Integration_Fill', params: {id: quest}})
    }
    

  }

}
</script>
