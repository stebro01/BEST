<template>
  <q-page class="">
    <MainSlot :no_options="true" :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Patienten'" :description="'verwalten und anzeigen'" :img="'patient-color-logo.png'"
          :icon="'person'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table" :rows="results" :columns="columns" :filter="filter" selection="single" dense
          row-key="PATIENT_NUM">

          <template v-slot:top>
            <!-- BUTTONS -->
            <BOTTOM_DROPDOWN :show_add="true" @add="newPatient()" :show_edit="SELECTION === 1" @edit="editPatient()"
              @make_private="makePrivate()" @make_public="makePublic()"
              :show_remove="SELECTION > 0" @remove="deletePatient()" :show_make_public="SELECTION > 0" :show_make_private="SELECTION > 0" 
            />
            <q-space />
            <!-- FILTERBOX -->
            <FILTER_BOX :filter="filter" @update="filter = $event" />
          </template>

          <!-- PROPS -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th>
                <!-- empty -->
              </q-th>
              <q-th auto-width class="cursor-pointer">
                <q-icon v-if="SELECTION === 0" name="check_box_outline_blank" size="sm" @click="setSelection(true)" />
                <q-icon v-else name="indeterminate_check_box" size="sm" @click="setSelection(false)" />
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>


              <q-th class="text-center">
                <q-icon class="q-ml-xs" size="xs" name="preview"><q-tooltip>Sichtbarkeit</q-tooltip></q-icon>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click="
              selected[props.row.PATIENT_NUM].selected =
              !selected[props.row.PATIENT_NUM].selected
              " class="cursor-pointer">
                            <q-td><q-btn icon="event" flat dense @click="visitePatient(props.row)"> <q-tooltip>Visten
                    öffnen</q-tooltip> </q-btn>
              </q-td>
              <q-td>
                <q-checkbox v-model="selected[props.row.PATIENT_NUM].selected" />
              </q-td>
              <q-td v-for="el in Object.keys(results[0])" :key="el" :props="props" class="text-center"
                style="overflow: hidden; white-space: nowrap">
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
                <q-icon v-if="props.row.USER_ID === public_id" name="visibility"><q-tooltip>Public (jeder kann diesen
                    Patienten sehen)</q-tooltip></q-icon>
                <q-icon v-else name="visibility_off"><q-tooltip>Privat (nur der Ersteller kann diesen Patienten sehen)
                  </q-tooltip></q-icon>

              </q-td>
            </q-tr>
          </template>
        </q-table>
      </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import FILTER_BOX from "src/components/elements/FilterBox.vue";
import MainSlot from "src/components/MainSlot.vue";
import BOTTOM_DROPDOWN from 'src/components/elements/BottomDropDown.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: "PatientsPage",
  components: { HEADING, FILTER_BOX, MainSlot, BOTTOM_DROPDOWN },
  data() {
    return {
      filter: null,
      public_id: this.$store.getters.ENV.app.env.public_id,
      selected: {},
      results: [],
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
        // {
        //   name: "PATIENT_BLOB",
        //   required: true,
        //   label: "BLOB",
        //   align: "center",
        //   field: "PATIENT_BLOB",
        //   sortable: true,
        //   style: "width: 120px",
        // }
      ],
      options_gender: [],
    };
  },

  mounted() {
    this.loadPatient(); //lade den Patienten
  },

  computed: {
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

    setSelection(val) {
      const keys = Object.keys(this.selected);
      keys.forEach((el) => this.selected[el].selected = val);
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
          this.$router.push({ name: "Visits" });
        });
    },

    editPatient() {
      return this.$router.push({
        name: "Patients_Edit",
        params: { PATIENT_NUM: this.getSelected_PATIENT_NUM() },
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
        !await my_confirm(
          `Sollen ausgewählte Patienten wirklich gelöscht werden?\nAlle zugehörigen Visten und Daten werden auch entfernt.\n(Dieser Schritt kann nicht rückgängig gemacht werden!)`
        )
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
        .then((res) => { })
        .catch((err) => this.$q.notify(err))
        .finally(() => {
          this.loadPatient();
          this.$q.notify(`Löschen erfolgreich: ${cc} Patienten entfernt`);
        });
    },

    async makePublic() {
      for (let ind in this.selected) {
        let item = this.selected[ind]
        if(item.selected) {
          await this.$store.dispatch("changePatientVisibility", {
            PATIENT_NUM: item.PATIENT_NUM,
            USER_ID: this.$store.getters.ENV.app.env.public_id
          })
        }
      }

      this.loadPatient();
      this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
    },

    async makePrivate() {
      // get the USER_ID first
      let PROVIDER = this.$store.getters.PROVIDER_PINNED
      let  USER =  await this.$store.dispatch("searchDB", {
        query_string: { USER_CD: PROVIDER.PROVIDER_ID },
        table: "USER_MANAGEMENT",
      })
      let USER_ID = USER[0].USER_ID
      for (let ind in this.selected) {
        let item = this.selected[ind]
        if(item.selected) {
          await this.$store.dispatch("changePatientVisibility", {
            PATIENT_NUM: item.PATIENT_NUM,
            USER_ID: USER_ID
          })
        }
      }

      this.loadPatient();
      this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
    },
    
  },
};
</script>
