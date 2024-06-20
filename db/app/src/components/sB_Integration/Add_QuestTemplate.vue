<template>
  <q-dialog v-model="ACTIVE">
    <q-card class="q-pa-xs z-max">
      <q-btn
        flat
        round
        class="absolute-top-right z-top"
        icon="close"
        @click="$emit('close')"
      />

      <q-card-section>
        <SELECT_FILE
          :label="TEXT.add_file_dialog"
          :accept="'.json'"
          @save="loadFile($event)"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import SELECT_FILE from "src/components/elements/SelectFile.vue";
import { stringify } from "src/classes/sqltools";

export default {
  name: "Add_QuestTemplate",

  props: ["active"],

  components: { SELECT_FILE },

  data() {
    return {};
  },

  mounted() {},

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.surveyBEST_Integration;
    },

    ACTIVE: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("close");
      },
    },
  },

  methods: {
    loadFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => this.readjson(e);
      reader.readAsText(file);
    },

    readjson(e) {
      let txt = e.target.result;

      try {
        const JSON_DATA = JSON.parse(txt);
        if (
          !JSON_DATA.short_title ||
          !JSON_DATA.title ||
          JSON_DATA.description === undefined
        )
          throw new Error("Fehlerhafter Fragebogen");
        this.saveQuestToDB(JSON_DATA);
      } catch (error) {
        this._error_msg("Fehler beim Lesen der Datei");
      }
    },

    saveQuestToDB(JSON_DATA) {
      const new_quest = {
        COLUMN_CD: "SURVEY_BEST",
        TABLE_CD: "SURVEY_BEST",
        CODE_CD: `quest_${JSON_DATA.short_title}`,
        NAME_CHAR: `${JSON_DATA.title} / ${JSON_DATA.description}`,
        LOOKUP_BLOB: JSON_DATA,
      };

      this.$store
        .dispatch("addDB", { table: "CODE_LOOKUP", query_string: new_quest })
        .then((res) => {
          this.$q.notify({ message: "Datei erfolgreich gespeichert" });
          this.$emit("close");
        })
        .catch((err) => {
          this._error_msg(err);
        });
    },

    _error_msg(msg) {
      this.$q.notify({
        message: msg,
        color: "negative",
        icon: "report_problem",
        timeout: 2000,
      });
      this.$emit("close");
    },
  },
};
</script>
