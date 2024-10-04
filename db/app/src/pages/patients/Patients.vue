<template>
  <q-page class="">
    <MainSlot :no_options="true" :no_footer="false">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING
          :title="'Patienten'"
          :description="'verwalten und anzeigen'"
          :img="'patient-color-logo.png'"
          :icon="'person'"
        />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="row full-width">
          <!-- FILTER -->
          <div class="col-12 row bg-white q-py-sm items-center justify-center">
            <div class="col-5">
              <FILTER_BOX
                :filter="filter"
                @update="filter = $event"
                class="q-px-md"
              />
            </div>
            <div class="col-2">
              <q-btn class="my-btn" rounded no-caps>Suchen</q-btn>
            </div>
          </div>
        </div>

        <q-table
          class="my-table q-mt-sm q-pa-md"
          :rows="results"
          :columns="columns"
          :filter="filter"
          dense
          row-key="PATIENT_NUM"
        >
          <!-- PROPS -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width class="cursor-pointer" v-if="SHOW_CHECKBOX">
                <q-icon
                  v-if="SELECTION === 0"
                  name="check_box_outline_blank"
                  size="sm"
                  @click="setSelection(true)"
                />
                <q-icon
                  v-else
                  name="indeterminate_check_box"
                  size="sm"
                  @click="setSelection(false)"
                />
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>

              <q-th auto-width>
                <!-- empty -->
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              @click="row_clicked(props.row.PATIENT_NUM)"
              class="cursor-pointer"
            >
              <q-td class="text-center" v-if="SHOW_CHECKBOX">
                <q-checkbox
                  v-model="selected[props.row.PATIENT_NUM].selected"
                />
              </q-td>
              <q-td
                v-for="el in FIELDS"
                :key="el"
                :props="props"
                class="text-center"
                style="overflow: hidden; white-space: nowrap"
              >
                <!-- ANZEIGE IM TABLE -->
                {{ props.row[el] }}
                <q-tooltip v-if="el === 'PATIENT_CD'">
                  <div>LfdN: {{ props.row.PATIENT_NUM }}</div>
                  <div>Alter: {{ props.row.AGE_IN_YEARS }}</div>
                  <div>Geschlecht: {{ props.row.SEX_RESOLVED }}</div>
                  <div>Sprache: {{ props.row.LANGUAGE_RESOLVED }}</div>
                  <div>Ethnicity: {{ props.row.RACE_RESOLVED }}</div>
                  <div>Status: {{ props.row.MARITAL_STATUS_RESOLVED }}</div>
                  <div>Religion: {{ props.row.RELIGION_RESOLVED }}</div>
                </q-tooltip>
              </q-td>
              <q-td class="text-center">
                <div class="q-gutter-md">
                  <!-- PUBLIC? -->
                  <q-icon
                    v-if="props.row.USER_ID === public_id"
                    class="text-grey"
                    name="visibility"
                    ><q-tooltip
                      >Public (jeder kann diesen Patienten sehen)</q-tooltip
                    ></q-icon
                  >
                  <q-icon v-else class="text-grey" name="visibility_off"
                    ><q-tooltip
                      >Privat (nur der Ersteller kann diesen Patienten sehen)
                    </q-tooltip></q-icon
                  >
                  <!-- EDIT -->
                  <q-icon
                    v-if="SHOW_CHECKBOX"
                    class="text-black"
                    name="edit_note"
                    size="xs"
                    flat
                    dense
                    @click="editPatient(props.row)"
                  >
                    <q-tooltip>Bearbeiten</q-tooltip>
                  </q-icon>
                  <!-- OPEN DATA -->
                  <q-icon
                    v-if="!SHOW_CHECKBOX"
                    name="folder"
                    size="sm"
                    flat
                    dense
                    @click="visitePatient(props.row)"
                  >
                    <q-tooltip>Datenviewer öffnen</q-tooltip>
                  </q-icon>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <div class="row full-width text-center">
          <div>
            <q-btn
              icon="edit"
              class="text-white absolute-bottom-left"
              :class="SHOW_CHECKBOX === true ? 'bg-black' : 'bg-grey'"
              style="bottom: 30px; left: 30px"
              no-caps
              rounded
              @click="toogleCheckbox()"
              ><q-tooltip>Editiermodus einschalten</q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="SELECTION === 0 && SHOW_CHECKBOX === false"
            class="col-12 full-width text-right"
          >
            <q-btn
              icon="add"
              class="my-btn-220 q-ma-sm"
              no-caps
              rounded
              @click="newPatient()"
              >Neuen Patienten anlegen</q-btn
            >
          </div>
          <div v-else class="col-12 row justify-center">
            <q-btn
              icon="delete"
              class="q-ma-sm bg-black text-white"
              no-caps
              rounded
              @click="deletePatient()"
              ><q-tooltip>Ausgewählte Patienten löschen</q-tooltip></q-btn
            >
            <q-separator class="q-mx-xl" vertical inset />
            <q-btn
              icon="visibility"
              class="q-ma-sm bg-black text-white"
              size="sm"
              rounded
              @click="makePublic()"
              ><q-tooltip
                >Ausgewählte Patienten für alle sichtbar machen</q-tooltip
              ></q-btn
            >
            <q-btn
              icon="visibility_off"
              class="q-ma-sm bg-black text-white"
              size="sm"
              rounded
              @click="makePrivate()"
              ><q-tooltip
                >Ausgewählte Patienten nur für aktuellen Nutzer sichtbar
                machen</q-tooltip
              ></q-btn
            >
          </div>
        </div>
      </template>
    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import FILTER_BOX from "src/components/elements/FilterBox.vue";
import MainSlot from "src/components/MainSlot.vue";
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: "PatientsPage",
  components: { HEADING, FILTER_BOX, MainSlot },
  data() {
    return {
      filter: null,
      public_id: this.$store.getters.PUBLIC_ID,
      show_checkbox: false,
      selected: {},
      results: [],
      FIELDS: [
        "PATIENT_CD",
        "IMPORT_DATE",
        "VITAL_STATUS_RESOLVED",
        "BIRTH_DATE",
        "SEX_RESOLVED",
        "AGE_IN_YEARS",
      ],
      columns: [
        {
          name: "PATIENT_CD",
          required: true,
          label: "ID",
          align: "center",
          field: "PATIENT_CD",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "IMPORT_DATE",
          required: true,
          label: "Erstellt",
          align: "center",
          field: "IMPORT_DATE",
          sortable: true,
          style: "width: 60px; font-size: 0.8em",
        },
        {
          name: "VITAL_STATUS_RESOLVED",
          required: true,
          label: "Status",
          align: "center",
          field: "VITAL_STATUS_RESOVED",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "BIRTH_DATE",
          required: true,
          label: "Geb.Datum",
          align: "center",
          field: "BIRTH_DATE",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "SEX_RESOLVED",
          required: true,
          label: "Geschlecht",
          align: "center",
          field: "SEX_RESOLVED",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "AGE_IN_YEARS",
          required: true,
          label: "Alter",
          align: "center",
          field: "AGE_IN_YEARS",
          sortable: true,
          style: "width: 20px",
        },
      ],
      options_gender: [],
    };
  },

  mounted() {
    this.loadPatient(); //lade den Patienten
  },

  computed: {
    SHOW_CHECKBOX() {
      return this.show_checkbox;
    },

    SELECTION() {
      var cc = 0;
      const keys = Object.keys(this.selected);
      keys.forEach((el) => {
        if (this.selected[el].selected) cc++;
      });

      return cc;
    },
  },

  methods: {
    loadPatient() {
      //load patients
      this.$store
        .dispatch("searchDB", {
          query_string: { PATIENT_NUM: 0, _greater: true, _view: true },
          table: "PATIENT_DIMENSION",
        })
        .then((res) => {
          this.results = res;
          this.selected = {};
          this.results.forEach((e) => {
            this.selected[e.PATIENT_NUM] = {
              PATIENT_NUM: e.PATIENT_NUM,
              selected: false,
            };
          });
        });
    },

    toogleCheckbox() {
      this.show_checkbox = !this.show_checkbox;
      if (!this.show_checkbox) this.setSelection(false);
    },

    row_clicked(val) {
      if (this.SHOW_CHECKBOX) {
        this.selected[val].selected = !this.selected[val].selected;
      } else {
        this.visitePatient(this.selected[val]);
      }
    },

    setSelection(val) {
      const keys = Object.keys(this.selected);
      keys.forEach((el) => (this.selected[el].selected = val));
    },

    newPatient() {
      this.$store
        .dispatch("addDB", {
          query_string: { SOURCESYSTEM_CD: "LOINC" },
          table: "PATIENT_DIMENSION",
        })
        .then((res) => {
          this.$q.notify(`neuer Patient: <<${res.PATIENT_NUM}>>`);
          this.$router.push({
            name: "Patients_Edit",
            params: { PATIENT_NUM: res.PATIENT_NUM },
          });
        })
        .catch((err) => this.$q.notify("Etwas ging schief: " + err));
    },

    visitePatient(PATIENT) {
      this.$store
        .dispatch("searchDB", {
          query_string: { PATIENT_NUM: PATIENT.PATIENT_NUM },
          table: "PATIENT_DIMENSION",
        })
        .then((res) => {
          this.$store.commit("PATIENT_PINNED_SET", res[0]);
          this.$store.commit("VISIT_PINNED_SET", undefined);
          this.$store.commit("OBSERVATION_PINNED_SET", undefined);
          this.$store.commit(
            "PATIENT_VIEW_SQLSTATEMENT_SET",
            this.$store.getters.PATIENT_VIEW_SQL_STATEMENT_RAW
          );
          this.$router.push({ name: "DBQueries_PatientView" });
        });
    },

    editPatient(item) {
      return this.$router.push({
        name: "Patients_Edit",
        params: { PATIENT_NUM: item.PATIENT_NUM },
      });
    },

    getSelected_PATIENT_NUM() {
      const keys = Object.keys(this.selected);
      var PATIENT_NUM = undefined;
      keys.forEach((el) => {
        if (this.selected[el].selected)
          PATIENT_NUM = this.selected[el].PATIENT_NUM;
      });
      return PATIENT_NUM;
    },

    async deletePatient() {
      if (
        !(await my_confirm(
          `Sollen ausgewählte Patienten wirklich gelöscht werden?\nAlle zugehörigen Visten und Daten werden auch entfernt.\n(Dieser Schritt kann nicht rückgängig gemacht werden!)`
        ))
      )
        return;
      const keys = Object.keys(this.selected);
      const promises = [];
      let cc = 0;
      keys.forEach((el) => {
        if (this.selected[el].selected) {
          cc++;
          promises.push(
            this.$store.dispatch("deleteDB", {
              query_string: { PATIENT_NUM: this.selected[el].PATIENT_NUM },
              table: "PATIENT_DIMENSION",
            })
          );
          // PATIENT WILL BE REMOVED from VISIT_DIMENSION and OBSERVATION_FACT via: TRIGGER delete_patient_cascade

          //unlike_
          if (
            this.$store.getters.PATIENT_PINNED &&
            this.selected[el].PATIENT_NUM ===
              this.$store.getters.PATIENT_PINNED.PATIENT_NUM
          ) {
            this.$store.commit("PATIENT_PINNED_SET", undefined);
            this.$store.commit("VISIT_PINNED_SET", undefined);
            this.$store.commit("OBSERVATION_PINNED_SET", undefined);
          }
        }
      });

      Promise.all(promises)
        .then((res) => {})
        .catch((err) => this.$q.notify(err))
        .finally(() => {
          this.loadPatient();
          this.$q.notify(`Löschen erfolgreich: ${cc} Patienten entfernt`);
        });
    },

    async makePublic() {
      for (let ind in this.selected) {
        let item = this.selected[ind];
        if (item.selected) {
          let res = await this.$store.dispatch("changePatientVisibility", {
            PATIENT_NUM: item.PATIENT_NUM,
            USER_ID: this.$store.getters.PUBLIC_ID,
          });
          // remove all other visibility
          if (res.status)
            await this.$store.dispatch("cleanPatientVisibility", {
              PATIENT_NUM: item.PATIENT_NUM,
              USER_ID: this.$store.getters.PUBLIC_ID,
            });
        }
      }

      this.loadPatient();
      this.$q.notify(this.$store.getters.TEXT.msg.action_successful);
    },

    async makePrivate() {
      // get the USER_ID first
      let PROVIDER = this.$store.getters.PROVIDER_PINNED;
      let USER = await this.$store.dispatch("searchDB", {
        query_string: { USER_CD: PROVIDER.PROVIDER_ID },
        table: "USER_MANAGEMENT",
      });
      let USER_ID = USER[0].USER_ID;
      for (let ind in this.selected) {
        let item = this.selected[ind];
        if (item.selected) {
          let res = await this.$store.dispatch("changePatientVisibility", {
            PATIENT_NUM: item.PATIENT_NUM,
            USER_ID: USER_ID,
          });
          // remove all other visibility
          if (res.status)
            await this.$store.dispatch("cleanPatientVisibility", {
              PATIENT_NUM: item.PATIENT_NUM,
              USER_ID: USER_ID,
            });
        }
      }

      this.loadPatient();
      this.$q.notify(this.$store.getters.TEXT.msg.action_successful);
    },
  },
};
</script>
