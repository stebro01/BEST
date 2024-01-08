<template>
  <q-page data-cy="questman" class="page-size">
    <div class="column items-center" style="height: 100%">
      <div class="col-1 q-pt-md text-h6">
        {{ TEXT.settings.questman.label }}
      </div>

      <div class="col q-py-md">
        <!-- AUSWAHL FRAGEBÖGEN -->
        <q-scroll-area class="shadow-1 my-form">
          <q-list bordered separator class="quest_list" data-cy="questlistRoot">
            <div v-for="(item, index) in QUEST_LIST" :key="item + index">
              <q-item :class="{ 'bg-grey-4': INDEX[index] }" clickable v-ripple :data-cy="'questlist' + index"
                @click="set_index(index)">
                <q-item-section side top>
                  <q-checkbox v-model="INDEX[index]" />
                </q-item-section>
                <q-item-section :data-cy="'quest_' + index">
                  <q-item-label>{{ QUESTMAN.get(item).title }}</q-item-label>
                  <q-item-label caption>{{ QUESTMAN.get(item).description }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-scroll-area>

      </div>

      <!-- ACTIONBTTNS -->
      <div class="col-2 text-center q-gutter-md  justify-around" style="width: 100%">
        <!-- deleteSelected -->
        <MYBUTTON v-if="count_selected > 0" @clicked="deleteSelected()" :label="TEXT.btn.delete.label" />
        <!-- deselectAll -->
        <MYBUTTON v-if="count_selected > 0" @clicked="deselectAll()" :label="TEXT.btn.deselect2" />
        <!-- editSelected -->
        <MYBUTTON v-if="count_selected === 1" @clicked="editSelected()" :label="TEXT.btn.edit" />
        <!-- importQuest -->
        <MYBUTTON v-if="count_selected === 0" @clicked="importQuest()" :label="TEXT.btn.import" />
        <!-- createQuest -->
        <MYBUTTON v-if="count_selected === 0" @clicked="createQuest()" :label="TEXT.btn.create" />
        <!-- resetQuest -->
        <MYBUTTON v-if="count_selected === 0" @clicked="resetQuest()" :label="TEXT.btn.reset" />
      </div>
      <!-- END COLUMN -->
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON :go_back="true" />
  </q-page>
</template>

<script>
// import Vue from 'vue'
import myMixins from 'src/mixins/modes'
import BACKBUTTON from 'src/components/BackButton.vue'
import MYBUTTON from 'src/components/MyButton.vue'

export default {
  name: 'QuestManager',
  mixins: [myMixins],
  components: { BACKBUTTON, MYBUTTON },
  props: ["MODE"],
  data() {
    return {
      TEXT: this.$store.getters.TEXT,
      INDEX: []
    }
  },
  mounted() {
    this.$store.dispatch('setProtectedMode', true);
    for (let i = 0; i < this.QUEST_LIST.length; i++) {
      this.INDEX[i] = false
    }
  },
  computed: {
    QUEST_LIST() {
      return this.$store.getters.QUEST_LIST
    },
    QUESTMAN() {
      return this.$store.getters.QUESTMAN
    },
    count_selected() {
      var count = 0
      this.INDEX.forEach(val => {
        if (val === true) count++
      })
      return count
    }
  },

  methods: {
    set_index(index) {
      this.INDEX[index] = !this.INDEX[index]
    },
    deselectAll() {
      for (let i = 0; i < this.INDEX.length; i++) {
        this.INDEX[i] = false
      }
    },
    deleteSelected() {
      const answ = confirm(this.TEXT.btn.confirm_delete)
      if (!answ) return
      // else
      var idx = this.INDEX.indexOf(true)
      while (idx > -1) {
        this.INDEX.splice(idx, 1)
        this.QUESTMAN.remove_by_index(idx)
        idx = this.INDEX.indexOf(true)
      }
    },
    importQuest() {
      this.$router.push({ name: "questmanagerimport" })
    },
    createQuest() {
      this.$store.state.editquest = undefined
      this.$router.push({ name: "questmanagercreate" })
    },
    editSelected() {
      var idx = this.INDEX.indexOf(true)
      this.$store.state.editquest = JSON.parse(JSON.stringify(this.QUESTMAN.get(this.QUEST_LIST[idx])))
      this.$router.push({ name: "questmanagercreate" })
    },
    resetQuest() {
      const answ = confirm(this.TEXT.btn.reset_confirm)
      if (!answ) return
      //else
      this.QUESTMAN._init()
    }
  }
}
</script>
