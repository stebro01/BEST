<template>
  <q-page class="page-size">
    <div class="column items-center" style="height: 100%">
      <!-- HEADING -->
      <div class="col-1 q-pt-md text-h6">
        {{ TEXT.storage.label }}
      </div>

      <div class="col-1" style="max-height: 50px">
        <FILTERSTORAGE @filterSet="filterDO('set')" @filterCleared="filterDO('cleared')" />
      </div>

      <!-- <div>
        {{selected}}
      </div> -->

      <!-- CONTENT -->
      <div class="col q-py-md" style="position: relative">
        <q-scroll-area class="shadow-1 my-form">
          <div class="row q-pa-md justify-around q-gutter-md" data-cy="items">
            <div class="col-auto" v-for="(item, index) in QUEST_LIST" :key="'item_' + index" :data-cy="'item_' + index">
              <StorageCard v-if="FILTER_ON === false ||
                FILTER.text === null ||
                item.info.PID.includes(FILTER.text) > 0 ||
                item.info.title.includes(FILTER.text) > 0
                " :item="item" :index="index" :selected="selected.indexOf(item.info.uid) > -1"
                @change_selection="select_item($event, item.info.uid)" @export_cloud="export_cloud(item.info.uid)"
                @export_item="export_item(item.info.uid)" @export_item_encrypted="export_item_encrypted(item.info.uid)"
                @remove="deleteselection([item.info.uid])" @view_item="view_item(item.info.uid)" />
            </div>
          </div>
        </q-scroll-area>
      </div>

      <!-- ACTIONBTTNS -->
      <div v-if="QUEST_LIST.length > 0" class="col-3 col-md-2 text-center q-gutter-md justify-around" style="width: 100%">
        <!-- SELECTALL -->
        <MYBUTTON v-if="!somethingselected" :icon="TEXT.btn.select_all.icon" :label="TEXT.btn.select_all.label"
          @click="selectall(true)" />
        <MYBUTTON v-if="!somethingselected" :icon="TEXT.btn.import2.icon" :label="TEXT.btn.import2.label"
          @click="$router.push({ name: 'importQuest' })" />
        <!-- DESELECT -->
        <MYBUTTON v-if="somethingselected" :icon="TEXT.btn.deselect.icon" @click="selectall(false)"
          :label="TEXT.btn.deselect.label" />
        <!-- EXPORT SELECTION -->
        <MYBUTTON v-if="QUEST_LIST.length > 0 && somethingselected" :icon="TEXT.btn.selection_export.icon"
          @clicked="exportselection" data-cy="btn_export_all" :label="TEXT.btn.selection_export.label" />
        <!-- DELETE SELCTON -->
        <MYBUTTON v-if="QUEST_LIST.length > 0 && somethingselected" :icon="TEXT.btn.selection_delete.icon"
          @clicked="deleteselection(selected)" :label="TEXT.btn.selection_delete.label" />
        <!-- DEBUG PRINT  -->
        <MYBUTTON v-if="$store.state.debug" @click="printStorageToConsole" />
      </div>

      <!-- SOME FALLBACK message -->
      <div v-else class="col-2 text-center" data-cy="no_entry">
        <div class="text-grey">
          {{ TEXT.storage.no_entry }}
        </div>
        <div>
          <MYBUTTON :icon="TEXT.btn.import2.icon" :label="TEXT.btn.import2.label"
            @click="$router.push({ name: 'importQuest' })" />
        </div>
      </div>

      <!-- ENDE COLUMN -->
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON />

    <!-- DIALOG -->
    <TABLEVIEW v-if="view_QUEST !== undefined && medium === true" :QUEST="view_QUEST" :medium="medium"
      @closeClick="medium = false" />
  </q-page>
</template>

<script>
import { log } from "src/tools/Logger";
import myMixins from "src/mixins/modes";

import BACKBUTTON from "src/components/BackButton.vue";
import TABLEVIEW from "src/components/TableView.vue";
import StorageCard from "src/components/StorageCard.vue";
import MYBUTTON from "src/components/MyButton.vue";
import FILTERSTORAGE from "src/components/FilterStorage.vue";

export default {
  name: "PageStorage",
  mixins: [myMixins],
  components: { BACKBUTTON, TABLEVIEW, StorageCard, MYBUTTON, FILTERSTORAGE },
  data() {
    return {
      medium: false,
      selected: [],

      TEXT: this.$store.getters.TEXT,
      view_QUEST: undefined,
      FILTER_ON: false,
    };
  },
  mounted() {
    this.selected = [];
    this.$store.state.leftDrawerOpen = false;
    this.$store.commit('STORAGE_LOAD')
    this.$store.dispatch("setProtectedMode", true);
  },
  computed: {
    somethingselected() {
      return this.selected.length > 0;
    },

    FILTER() {
      return this.$store.getters.SETTINGS.get("filter_storage");
    },

    QUEST_LIST() {
      const LISTE = this.$store.getters.STORAGE.get();
      // first sort by the ORDERING SET
      const ORDERING = this.FILTER.order.value;
      switch (ORDERING) {
        case "date_up":
          LISTE.sort((a, b) => (a.info.date < b.info.date ? 1 : -1));
          break;

        case "date_down":
          LISTE.sort((a, b) => (a.info.date > b.info.date ? 1 : -1));
          break;

        case "pid_up":
          LISTE.sort((a, b) => (a.info.PID > b.info.PID ? 1 : -1));
          break;

        case "pid_down":
          LISTE.sort((a, b) => (a.info.PID < b.info.PID ? 1 : -1));
          break;
        case "export_open":
          LISTE.sort((a, b) => (a.exported > b.exported ? 1 : -1));
          break;
        default:
          // console.log(ORDERING)
          break;
      }

      return LISTE;
    },
  },
  methods: {
    printStorageToConsole() {
      log({
        message: "printStorageToConsole",
        data: this.$store.state.STORAGE.get(),
      });
    },
    // neu
    select_item(val, uid) {
      var index = this.selected.indexOf(uid);
      if (val) {
        if (index < 0) this.selected.push(uid);
      } else {
        if (index > -1) this.selected.splice(index, 1);
      }
    },
    // neu
    view_item(uid) {
      this.view_QUEST = this.$store.getters.STORAGE.get_by_uid(uid);
      this.medium = true;
    },
    export_cloud(uid) {
      // NOTION EXPORT
      this.$store.dispatch("storage_export_notion", uid).then((res) => {
        if (res)
          this.$q.notify({
            message: `${this.TEXT.quest.export_success}`,
            color: "green",
          });
        else {
          const err = this.$store.getters.STORAGE.error;
          this.$q.notify({
            message: `${err}`,
            color: "warning",
          });
        }
      });
    },

    export_item(uid) {
      this.$store
        .dispatch("storage_export", [uid])
        .then((val) => { })
        .catch((err) => {
          log({
            error: "export_item",
            data: err,
          });
        });
    },
    export_item_encrypted(uid) {
      const payload = {
        pubKey: this.$store.state.SETTINGS.user_keyPair.publicKey,
        document: this.$store.state.STORAGE.get_by_uid(uid),
      };
      this.$store
        .dispatch("storage_encrypted_export", payload)
        .then((val) => { })
        .catch((err) => {
          log({
            error: "export_item_encrypted",
            data: err,
          });
        });
    },
    exportselection() {
      if (this.selected.length < 1) return false;
      this.$store.dispatch("storage_export", this.selected);
      this.selected = [];
      this.$q.notify({
        message: `${this.TEXT.quest.export_success}`,
        color: "green",
      });
    },
    deleteselection(SELECTED_ITEMS) {
      if (SELECTED_ITEMS.length < 1) return false;
      const answ = confirm(this.TEXT.btn.confirm_delete);
      if (!answ) return;
      SELECTED_ITEMS.forEach((uid) => {
        this.$store.commit("STORAGE_REMOVE", uid);
        
      });
      this.selected = [];
    },


    selectall(val) {
      this.QUEST_LIST.forEach((q) => {
        this.select_item(val, q.info.uid);
      });
    },

    filterDO(mode) {
      switch (mode) {
        case "set":
          this.FILTER_ON = true;
          break;

        case "cleared":
        default:
          this.FILTER_ON = false;
          break;
      }
    },
  },
};
</script>
