<template>
  <q-page data-cy="selectquest" class="page-size">
    <div class="column items-center" style="height: 100%">
      <div class="col-1 text-h6 q-pa-md">
        {{ TEXT.select_quest.label }}
      </div>

      <div class="col-1" style="min-height: 50px">
        <!-- FILTER -->
        <FilterQuest @emitValue="setFilter($event)" />
      </div>
      <div class="col">
        <!-- AUSWAHL FRAGEBÖGEN -->
        <q-scroll-area class="q-ma-xs shadow-1 my-form">
          <q-list
            v-if="FILTERED_LIST !== undefined && FILTERED_LIST !== null"
            bordered
            separator
            class="quest_list"
            data-cy="questlistRoot"
          >
            <div
              v-for="(item, index) in FILTERED_LIST"
              :key="item + index + date_str"
            >
              <q-item
                :class="{ 'bg-grey-4': INDEX[index] }"
                clickable
                v-ripple
                :data-cy="'questlist' + index"
                @click="set_index(index)"
              >
                <q-item-section side top>
                  <q-checkbox v-model="INDEX[index]" />
                </q-item-section>
                <q-item-section :data-cy="'quest_' + index">
                  <q-item-label>{{ QUESTMAN.get(item).title }}</q-item-label>
                  <q-item-label caption>{{
                    QUESTMAN.get(item).description
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-scroll-area>
      </div>
      <div class="col-2 items-center row justify-around" style="width: 100%">
        <!-- PROCEED ZUM Fragebogen -->
        <span
          v-if="count_selected === 0"
          class="text-grey text-center"
          v-html="TEXT.select_quest.empty"
        ></span>
        <!-- DESELCT -->
        <MYBUTTON
          v-if="count_selected > 0"
          :label="TEXT.btn.deselect.label"
          @click="deselectAll"
          data-cy="deselect"
        />
        <!-- GOTOQUEST -->
        <MYBUTTON
          v-if="count_selected === 1"
          :label="TEXT.btn.toquest"
          @click="gotoquest"
          data-cy="btn_gotoquest"
        />
        <!-- GOTOPRESET -->
        <MYBUTTON
          v-if="count_selected > 1"
          data-cy="btn_gotopreset"
          :label="TEXT.btn.make_preset"
          @click="gotopreset()"
        />
      </div>

      <!-- END COLUMN -->
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON />
  </q-page>
</template>

<script>
// import Vue from 'vue'
import myMixins from "src/mixins/modes";
import BACKBUTTON from "src/components/BackButton.vue";
import FilterQuest from "src/components/Filter.vue";
import MYBUTTON from "src/components/MyButton.vue";

export default {
  name: "SelectQuestionnaire",
  components: { BACKBUTTON, FilterQuest, MYBUTTON },
  mixins: [myMixins],
  props: ["MODE"],
  data() {
    return {
      TEXT: this.$store.getters.TEXT,
      filter_value: null,
      date_str: Date.now(),
      INDEX: [],
    };
  },
  mounted() {
    this.$store.dispatch("setProtectedMode", true);
    for (let i = 0; i < this.QUEST_LIST.length; i++) {
      this.INDEX[i] = false;
    }
  },
  computed: {
    QUEST_LIST() {
      return this.$store.getters.QUEST_LIST;
    },
    FILTERED_LIST() {
      return this.QUESTMAN.quest_list_filtered(this.filter_value);
    },
    QUESTMAN() {
      return this.$store.getters.QUESTMAN;
    },
    count_selected() {
      var count = 0;
      this.INDEX.forEach((val) => {
        if (val === true) count++;
      });
      return count;
    },
  },

  methods: {
    setFilter(val) {
      this.filter_value = val;
      this.date_str = Date.now();
    },
    set_index(index) {
      this.INDEX[index] = !this.INDEX[index];
    },
    deselectAll() {
      for (let i = 0; i < this.INDEX.length; i++) {
        this.INDEX[i] = false;
      }
    },
    gotopreset() {
      const presets = [];
      for (let i = 0; i < this.INDEX.length; i++)
        if (this.INDEX[i] === true) presets.push(this.FILTERED_LIST[i]);
      // this.$router.push(`preset/${JSON.stringify({presets: presets, mode: "new_preset"})}`)
      this.$router.push({
        name: "preset/id",
        params: {
          id: JSON.stringify({ presets: presets, mode: "new_preset" }),
        },
      });
    },
    gotoquest() {
      var quest_label = "";
      for (let i = 0; i < this.INDEX.length; i++)
        if (this.INDEX[i] === true) {
          quest_label = this.FILTERED_LIST[i];
        }
      this.$router.push(
        `/quest/${encodeURIComponent(
          JSON.stringify({ presets: quest_label, mode: "single" })
        )}`
      );
    },
  },
};
</script>
