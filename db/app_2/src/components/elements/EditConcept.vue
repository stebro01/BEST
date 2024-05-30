<template>
  <q-dialog v-model="ACTIVE">
    <q-card style="width: 50vw">
      <q-btn icon="close" class="absolute-top-right z-top" flat rounded @click="$emit('close')" />
      <q-card-section>Edit Concept</q-card-section>
      <q-card-section v-if="localData">
        <q-markup-table>
          <tbody>
            <!-- SOURCESYSTEM_CD -->
            <tr>
              <td>SOURCESYSTEM_CD</td>
              <td class="text-center bg-grey-2">
                {{ localData.SOURCESYSTEM_CD }}
                <q-icon class="float-right cursor-pointer" size="sm" name="search"
                  @click="show_SOURCESYSTEM_CD_list = true" />
              </td>
            </tr>
            <!-- CONCEPT_PATH -->
            <tr>
              <td>CONCEPT_PATH</td>
              <td class="bg-grey-2 row">
                <div class="col-12">
                  <q-input dense v-model="localData.CONCEPT_PATH" input-class="text-center text-caption"
                    @blur="something_changed = true">
                    <template v-slot:append>
                      <q-icon name="search" class="cursor-pointer" @click="show_CONCEPT_PATH_dialog = true" />
                    </template>
                  </q-input>
                </div>
              </td>
            </tr>
            <!-- CONCEPT_CD-->
            <tr>
              <td>CONCEPT_CD</td>
              <td class="bg-grey-2 row">
                <div class="col relative-position">
                  <span class="absolute-center"><span v-if="localData.SOURCESYSTEM_CD === 'SNOMED-CT'">SCTID</span><span
                      v-else>{{ localData.SOURCESYSTEM_CD }}</span>:</span>
                </div>
                <div class="col-8">
                  <q-input dense v-model="localData.CONCEPT_CD" @blur="something_changed = true">
                    <template v-slot:append>
                      <q-icon v-if="localData.SOURCESYSTEM_CD === 'SNOMED-CT'" name="manage_search" @click="querySNOMED_API(localData.CONCEPT_CD)" class="cursor-pointer">
                        <q-tooltip>Frage SNOMED API ab</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </td>
            </tr>
            <!-- NAME_CHAR -->
            <tr>
              <td>NAME_CHAR</td>
              <td class="bg-grey-2 row">
                <div class="col-12">
                  <q-input dense v-model="localData.NAME_CHAR" input-class="text-center" @blur="something_changed = true">
                    <template v-slot:append>
                      <q-icon v-if="localData.SOURCESYSTEM_CD === 'SNOMED-CT'" name="manage_search" @click="querySNOMED_API_byName(localData.NAME_CHAR)"
                        class="cursor-pointer">
                        <q-tooltip>Frage SNOMED API ab</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </td>
            </tr>
            <!-- VALTYPE_CD -->
            <tr>
              <td>VALTYPE_CD</td>
              <td class="text-center bg-grey-2">
                {{ localData.VALTYPE_CD }}
                <q-icon class="float-right cursor-pointer" size="sm" name="search" @click="show_VALTYPE_CD_list = true" />
              </td>
            </tr>

            <!-- SELECTION OR MOD? -->
            <tr v-if="localData.VALTYPE_CD === 'S'" class="text-center bg-white">
              <td>Answers</td>
              <td v-if="SELECTION_ANSWERS">
                {{ SELECTION_ANSWERS }}
                <q-icon v-if="SELECTION_ANSWERS.includes('link:')" name="close" class="cursor-pointer"
                  @click="unlinkAnswer(localData)" />
                <span v-else-if="localData._answers_count > 0">
                  {{ localData._answers_count }} items
                  <q-icon size="sm" name="edit" class="cursor-pointer" @click="show_edit_answers = true" />
                </span>
                <span v-else>
                  <q-icon size="sm" name="add" class="cursor-pointer q-mr-md" @click="show_edit_answers = true" />
                  <q-icon size="sm" name="link" class="cursor-pointer" @click="linkAnswer(localData)" />
                </span>
              </td>
            </tr>

            <!-- UNIT_CD -->
            <tr>
              <td>UNIT_CD</td>
              <td class="bg-grey-2 row">
                <div class="col-12">
                  <q-input dense v-model="localData.UNIT_CD" input-class="text-center" @blur="something_changed = true">
                    <template v-slot:append>
                      <q-icon name="search" class="cursor-pointer" @click="show_UNIT_CD_list = true" />
                    </template>
                  </q-input>
                </div>
              </td>
            </tr>
            <!-- CONCEPT_BLOB-->
            <tr>
              <td>CONCEPT_BLOB</td>
              <td class="bg-grey-2 row">
                <div class="col-12">
                  <q-input dense v-model="localData.CONCEPT_BLOB" input-class="text-center"
                    @blur="something_changed = true" />
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <!-- ADD MODIFIKATION -->
        <q-btn v-if="VALID_FORM" flat round icon="auto_fix_normal" class="absolute-bottom-left q-mt-xl"
          @click="createModifikation()"><q-tooltip>Modifikation
            erzeugen</q-tooltip></q-btn>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn no-caps rounded class="my-btn" @click="$emit('close')">abbrechen</q-btn>
        <q-btn v-if="something_changed" no-caps rounded class="my-btn" @click="saveConcept()">speichern</q-btn>
        <q-btn v-if="localData.CONCEPT_CD && localData.CONCEPT_PATH" rounded color="black" icon="preview" @click="show_preview()"><q-tooltip>Vorschau</q-tooltip></q-btn>
      </q-card-actions>
    </q-card>

    <!-- DIALOGS -->
    <SELECT_LIST v-if="show_UNIT_CD_list" :active="show_UNIT_CD_list" :title="'Auswahl'" :list="options_UNIT_CD"
      @close="show_UNIT_CD_list = false" @save="save_UNIT_CD($event)" />
    <SELECT_LIST v-if="show_SOURCESYSTEM_CD_list" :active="show_SOURCESYSTEM_CD_list" :title="'Auswahl'"
      :list="options_SOURCESYSTEM_CD" @close="show_SOURCESYSTEM_CD_list = false" @save="save_SOURCESYSTEM_CD($event)" />
    <SELECT_LIST v-if="show_VALTYPE_CD_list" :active="show_VALTYPE_CD_list" :title="'Auswahl'" :list="options_VALTYPE_CD"
      @close="show_VALTYPE_CD_list = false" @save="save_VALTYPE_CD($event)" />

    <!-- CONCEPT_PATH_DIALOG -->
    <PICK_PATH v-if="show_CONCEPT_PATH_dialog" :active="show_CONCEPT_PATH_dialog"
      @close="show_CONCEPT_PATH_dialog = false" :path="localData.CONCEPT_PATH" @save="udpate_CONCEPT_PATH($event)" />

    <!-- PREVIE -->
    <q-dialog v-model="show_preview_dialog">
      <q-card>
        <q-btn flat rounded class="absolute-top-right z-top" icon="close" v-close-popup />
        <q-card-section>Vorschau</q-card-section>
        <q-card-section>{{ show_preview_dialog_data }}</q-card-section>
      </q-card>
    </q-dialog>

    <!-- EDIT ANSWERS -->
    <EDIT_CONCEPT_ANSWERS v-if="show_edit_answers" :active="show_edit_answers" @close="show_edit_answers = false"
      :CONCEPT="localData" />

  </q-dialog>
</template>

<script>
import SELECT_LIST from "src/components/elements/SelectList.vue";
import PICK_PATH from "src/components/elements/PickPath.vue";
import EDIT_CONCEPT_ANSWERS from "src/components/elements/EditConcept_Answers.vue"
import { datenow_isostring } from "src/tools/mydate";
import { my_confirm } from "src/tools/my_dialog";
import {my_uid} from "src/tools/db_tools"

export default {
  name: "EditConcept",

  props: ["active", "item"],

  components: { SELECT_LIST, PICK_PATH, EDIT_CONCEPT_ANSWERS },

  data() {
    return {
      localData: undefined,
      options_UNIT_CD: [],
      options_VALTYPE_CD: [],
      options_SOURCESYSTEM_CD: [],
      show_UNIT_CD_list: false,
      show_SOURCESYSTEM_CD_list: false,
      show_VALTYPE_CD_list: false,
      show_CONCEPT_PATH_dialog: false,
      show_preview_dialog: false,
      show_preview_dialog_data: undefined,
      show_edit_answers: false,
      something_changed: false,
    };
  },

  mounted() {
    if (this.item) this.localData = JSON.parse(JSON.stringify(this.item));
    this.fill_options_UNIT_CD();
    this.fill_options_VALTYPE_CD();
    this.fill_options_SOURCESYSTEM_CD();
    this.split_CONCEPT_CD();
    this.split_CONCEPT_PATH(); //muss nach split_CONCEPT_CD ausgeführt werden!!!

    if (this.localData.VALTYPE_CD === 'S' && this.localData.CONCEPT_PATH) {
      this.$store.dispatch('getConceptList', `${this.localData.CONCEPT_PATH}\\${this.localData.CONCEPT_CD}\\LA`)
        .then(res => {
          this.localData._answers_count = res.length
        })
    }

  },

  computed: {
    ACTIVE: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("close");
      },
    },

    SELECTION_ANSWERS() {
      if (!this.localData || this.localData.VALTYPE_CD !== "S")
        return undefined;
      if (this.localData.RELATED_CONCEPT)
        return `link: ${this.localData.RELATED_CONCEPT}`;
      else return " ";
    },

    VALID_FORM() {
      if (!this.localData) return false
      if (!this.localData.CONCEPT_CD) return false
      if (!this.localData.CONCEPT_PATH) return false
      if (!this.localData.NAME_CHAR) return false
      if (!this.localData.SOURCESYSTEM_CD) return false

      return true
    }
  },
  methods: {
    saveConcept() {
      var CONCEPT = this.prepare_final_data(this.localData);
      this.$emit("save", CONCEPT);
    },

    split_CONCEPT_CD() {
      if (!this.localData || !this.localData.CONCEPT_CD) return;
      var sd = this.localData.CONCEPT_CD.split(":");
      if (sd.length !== 2) {
        this.$q.notify("CONCEPT_CD ist ungültig, bitte neu benennen!");
        this.localData.CONCEPT_CD = "<invalid>";
      } else {
        this.localData.CONCEPT_CD = sd[1];
        if (typeof (this.localData.CONCEPT_CD === "string"))
          this.localData.CONCEPT_CD = this.localData.CONCEPT_CD.trim();
        if (
          sd[0] !== this.localData.SOURCESYSTEM_CD &&
          this.localData.SOURCESYSTEM_CD !== "LOINC"
        )
          this.$q.notify(
            "SOURCESYSTEM_CD und CONCEPT_CD passen nicht zueinander! Wird beim Speichern korrigiert."
          );
      }
    },

    split_CONCEPT_PATH() {
      if (
        !this.localData ||
        !this.localData.CONCEPT_CD ||
        !this.localData.CONCEPT_PATH
      )
        return;
      var ind = this.localData.CONCEPT_PATH.indexOf(this.localData.CONCEPT_CD);
      if (ind > -1) {
        this.localData.CONCEPT_PATH = this.localData.CONCEPT_PATH.substring(
          0,
          ind
        );
        if (this.localData.CONCEPT_PATH.endsWith("\\")) this.localData.CONCEPT_PATH = this.localData.CONCEPT_PATH.slice(0,-1)
      }
    },

    fill_options_UNIT_CD() {
      this.$store
        .dispatch("findPath", {
          query_string: { CONCEPT_CD: "SCTID: 767525000" },
          table: "CONCEPT_DIMENSION",
        })
        .then((res_units) => {
          if (res_units && res_units.length > 0) {
            this.options_UNIT_CD = [];
            res_units.forEach((r) => {
              this.options_UNIT_CD.push({ label: r.NAME_CHAR });
            });
          }
        });
    },

    fill_options_VALTYPE_CD() {
      this.$store
        .dispatch("searchDB", {
          query_string: { COLUMN_CD: "VALTYPE_CD" },
          table: "CODE_LOOKUP",
        })
        .then((res_type) => {
          if (res_type && res_type.length > 0) {
            this.options_VALTYPE_CD = [];
            res_type.forEach((r) => {
              this.options_VALTYPE_CD.push({
                label: r.NAME_CHAR,
                value: r.CODE_CD,
              });
            });
          }
        });
    },

    fill_options_SOURCESYSTEM_CD() {
      this.$store
        .dispatch("findPath", {
          query_string: { CONCEPT_CD: "GENERAL_CONCEPT" },
          table: "CONCEPT_DIMENSION",
        })
        .then((res_system) => {
          if (res_system && res_system.length > 0) {
            this.options_SOURCESYSTEM_CD = [];
            res_system.forEach((r) => {
              this.options_SOURCESYSTEM_CD.push({ label: r.NAME_CHAR });
            });
          }
        });
    },

    save_UNIT_CD(val) {
      if (val) this.localData.UNIT_CD = val.label;
      this.show_UNIT_CD_list = false;
      this.something_changed = true;
    },
    save_SOURCESYSTEM_CD(val) {
      if (val) {
        if (this.localData.SOURCESYSTEM_CD !== val.label) {
          this.localData.SOURCESYSTEM_CD = val.label;
          this.localData.CONCEPT_PATH = `\\${val.label}\\`;
        }
      }
      this.show_SOURCESYSTEM_CD_list = false;
      this.something_changed = true;
    },
    save_VALTYPE_CD(val) {
      if (val) this.localData.VALTYPE_CD = val.value;
      this.show_VALTYPE_CD_list = false;
      this.something_changed = true;
    },

    udpate_CONCEPT_PATH(val) {
      if (!val) return;
      this.localData.CONCEPT_PATH = val;
      this.show_CONCEPT_PATH_dialog = false;
      this.something_changed = true;
    },
    show_preview() {
      this.show_preview_dialog_data = this.prepare_final_data(this.localData);
      this.show_preview_dialog = true;
    },

    prepare_final_data(data) {
      var result = JSON.parse(JSON.stringify(data));
      result.CONCEPT_CD = result.CONCEPT_CD.trim().toUpperCase()
      result.UPDATE_DATE = datenow_isostring();
      result.CONCEPT_PATH = `${result.CONCEPT_PATH}\\${result.CONCEPT_CD}`.toUpperCase();
      result.CONCEPT_PATH = result.CONCEPT_PATH.replace(/\\\\/g, "\\");
      if (result.SOURCESYSTEM_CD === "LOINC")
        result.CONCEPT_CD = `LID: ${result.CONCEPT_CD}`;
      else if (result.SOURCESYSTEM_CD !== "SNOMED-CT")
        result.CONCEPT_CD = `${result.SOURCESYSTEM_CD}: ${result.CONCEPT_CD}`;
      else result.CONCEPT_CD = `SCTID: ${result.CONCEPT_CD}`;
      
      Object.keys(result).forEach((r) => {
        if (result[r] === null || result[r] === "null") result[r] = "NULL";
      });
      return result;
    },

    async querySNOMED_API(SNOMED_VAL) {
      const SNOMED_ID = parseInt(SNOMED_VAL);
      if (!SNOMED_ID) return this.$q.notify("Ungültige ID");
      const query = await this.$store.dispatch("query_SNOMED_API", SNOMED_ID);
      if (!query) return;
      // else
      this.localData.SOURCESYSTEM_CD = "SNOMED-CT";
      this.localData.NAME_CHAR = query.pt.term;
      const res = await this.$store.dispatch("resolve_SNOMED_API", SNOMED_ID);
      if (!res) return;
      //else => entferne jetzt das letzte Element
      const tmp = res.split("\\");
      if (tmp.length > 0) tmp.splice(tmp.length - 1, 1);
      else return;
      //
      this.localData.CONCEPT_PATH = tmp.join("\\");
      this.$q.notify("SNOMED Abfrage war erfolgreich");
    },

    async querySNOMED_API_byName(SNOMED_NAME) {
      if (!SNOMED_NAME) return this.$q.notify("Ungültige ID");
      const query = await this.$store.dispatch(
        "query_SNOMED_API_byName",
        SNOMED_NAME
      );
      if (!query || !query.items) return;

      //prepare dialog
      const items = [];
      query.items.forEach((i) => {
        items.push({
          label: i.term,
          value: { term: i.term, concept: i.concept.conceptId },
        });
      });

      this.$q
        .dialog({
          title: "SNOMED Abfrage",
          message: `Es wurden ${query.items.length} Einträge gefunden.`,
          options: {
            type: "radio",
            // model: 'opt1',
            // inline: true
            items: items,
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          //fill in the values
          this.localData.CONCEPT_CD = data.concept;
          this.querySNOMED_API(data.concept);
        });
    },

    async unlinkAnswer(data) {
      if (!(await my_confirm(`Verknüpfung wirklich aufheben?`))) return;
      data.RELATED_CONCEPT = null;
    },

    async linkAnswer() {
      this.$q
        .dialog({
          title: "Mit einem Konzept verlinken",
          message: "CONCEPT_CD oder NAME_CHAR eingeben",
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
        })
        .onOk((data) => {
          this._query_concepts_to_link(data);
          this.something_changed = true
        });
    },
    async _query_concepts_to_link(data) {
      const query = `SELECT * FROM CONCEPT_DIMENSION WHERE VALTYPE_CD = 'S' AND (NAME_CHAR like '${data}%' OR CONCEPT_CD like '${data}%');`;
      const res = await this.$store.dispatch("runQuery", query);
      if (!res.data) return;
      const items = [];
      res.data.forEach((r) => {
        items.push({ label: `${r.NAME_CHAR}/${r.CONCEPT_CD}`, value: r });
      });

      this.$q
        .dialog({
          title: "Folgende Einträge wurden gefunden",
          message: "Eintrag zum Verlinken auswählen",
          options: {
            type: "radio",

            // inline: true
            items: items,
          },
          cancel: true,
          persistent: true,
        })
        .onOk((item) => {
          this.localData.RELATED_CONCEPT = item.CONCEPT_CD;
        });
    },

    createModifikation() {
      this.$q.dialog({
        title: 'Modifikation erstellen',
        message: 'Wollen Sie eine Kopie erstellen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        var CONCEPT = this.prepare_final_data(this.localData);
        const UID = my_uid()
        CONCEPT.CONCEPT_PATH = `${CONCEPT.CONCEPT_PATH}\\MOD\\${UID}`
        CONCEPT.CONCEPT_CD = `${CONCEPT.CONCEPT_CD}_MOD_${UID}`
        console.log(CONCEPT)
        this.$emit("modify", CONCEPT);
      })

    }


  },
};
</script>
