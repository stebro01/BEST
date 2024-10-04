<template>
  <q-page>
    <MainSlot
      :no_options="true"
      :no_footer="true"
      @resize="main_slot_size = $event"
    >
      <!-- HEADING -->
      <template v-slot:header>
        <div class="">
          <div>
            <HEADING
              :title="'Patienten bearbeiten / Modern View'"
              :img="'db-queries-logo.png'"
              :icon="'wysiwyg'"
            />
          </div>
          <div class="row q-mt-md">DDD</div>
        </div>

        <div class="absolute-top-right z-max">
          <q-btn icon="close" flat round size="lg" @click="closePatient()"
            ><q-tooltip>Patienten schließen</q-tooltip></q-btn
          >
        </div>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="row" :style="STYLE_DIV">
          <!-- HEADER -->
          <div class="col-12 q-pa-sm" :style="`height: ${SIZE_TOP}`">
            <div class="row">
              <div class="col-1">
                <q-btn
                  @click="show_sql_query = !show_sql_query"
                  round
                  flat
                  size="md"
                  :icon="SHOW_SQL_QUERY ? 'filter_list_off' : 'filter_list'"
                  ><q-tooltip>SQL Statement anzeigen</q-tooltip></q-btn
                >
              </div>
              <div v-if="SHOW_SQL_QUERY" class="col-8">
                <q-input
                  dense
                  input-class="text-left"
                  input-style="font-family: 'Courier', monospace;"
                  filled
                  :readonly="query_sql_locked"
                  v-model="SQL_QUERY"
                  label="SQL Statement"
                >
                  <template v-slot:prepend>
                    <q-icon
                      :name="query_sql_locked ? 'lock' : 'lock_open'"
                      size="xs"
                      @click="query_sql_locked = !query_sql_locked"
                      ><q-tooltip
                        >Speeren und Entspeeren der Eingabe; ACHTUNG: nur für
                        fortgeschrittene Nutzer!</q-tooltip
                      ></q-icon
                    >
                  </template>
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      icon="clear"
                      @click="
                        query_obs_elements = [];
                        resetSQLQuery();
                      "
                    />
                  </template>
                  <q-tooltip>{{ SQL_QUERY }}</q-tooltip>
                </q-input>
                <div>
                  <!-- CHIP WITH SQL SEARCH ELEMENTS -->
                  <q-chip
                    v-for="(q_el, q_ind) of query_obs_elements"
                    :key="q_ind + 'indelq'"
                    dense
                    size="sm"
                    removable
                    @remove="removeSqlEl(q_ind)"
                    clickable
                  >
                    {{ q_el.CONCEPT_NAME_CHAR }}={{
                      q_el.TVAL_RESOLVED || q_el.NVAL_NUM || q_el.TVAL_CHAR
                    }}
                    <q-tooltip>Anklicken, um Wert zu ändern</q-tooltip>
                    <!-- POP CHANGE VALUE -->
                    <POPUP_DATA
                      :item="q_el"
                      @update="updateSQL_El_value($event, q_ind)"
                    />
                  </q-chip>
                </div>
              </div>
              <div v-if="SHOW_SQL_QUERY" class="col">
                <q-btn
                  class="q-ml-md my-btn"
                  @click="runSQLStatement(SQL_QUERY)"
                  >laden</q-btn
                >
              </div>
            </div>
          </div>
          <!-- MAIN -->
          <div
            class="col-12 q-mt-md"
            :style="`height: calc(100% - ${SIZE_TOP})`"
          >
            <div class="row justify-center fit">
              <!-- PATIENTLIST -->
              <div class="col-3 full-height">
                <PATIENT_LIST
                  :patients="localData.PATIENTS"
                  :size="param.patientlist_size"
                  @clicked="patientClicked($event)"
                />
              </div>
              <!-- MAIN LEFT-->
              <div
                class="col-9 row"
                style="height: 100%"
                v-if="$store.getters.PATIENT_PINNED"
              >
                <!-- VISITE UND GLOBAL -->
                <div class="col-12" :style="`height: ${SIZE_VISIT}`">
                  <VISIT_LIST />
                  <GLOBAL_OBSERVATIONS
                    @add_sql="addElementToQuery($event)"
                    v-if="$store.getters.VISIT_PINNED"
                  />
                </div>

                <!-- OBSErVATION_LIST -->
                <div
                  class="col-12"
                  :style="`min-height: calc(100% - ${SIZE_VISIT})`"
                >
                  <OBSERVATION_LIST
                    :param="param"
                    v-if="$store.getters.VISIT_PINNED"
                  />
                  <div v-else class="fit flex flex-center">
                    <q-banner class="bg-info">Keine Visite gefunden</q-banner>
                  </div>
                </div>
              </div>

              <!-- ADD DATA BTN -->
              <ADD_DATA_BTN />
            </div>
          </div>
        </div>

        <!-- TESTING -->
        <div class="fixed-bottom-center">
          <q-btn
            class="my-btn"
            rounded
            @click="$router.push({ name: 'Observations_View_XLS' })"
            >NEW XLS VIEW</q-btn
          >
        </div>
        <!-- ENDE TESTING -->
      </template>

      <!-- FOOTER -->
      <template v-slot:footer> </template>
    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import MainSlot from "src/components/MainSlot.vue";
import PATIENT_LIST from "src/components/patient_view/PatientList.vue";
import VISIT_LIST from "src/components/patient_view/VisitList.vue";
import OBSERVATION_LIST from "src/components/patient_view/ObservationList.vue";
import ADD_DATA_BTN from "src/components/patient_view/AddDataBtn.vue";

import GLOBAL_OBSERVATIONS from "src/components/patient_view/GlobalObservations.vue";
import POPUP_DATA from "src/components/patient_view/PopupData.vue";

export default {
  name: "DBQueries_PatientView",

  components: {
    HEADING,
    MainSlot,
    PATIENT_LIST,
    VISIT_LIST,
    OBSERVATION_LIST,
    ADD_DATA_BTN,
    GLOBAL_OBSERVATIONS,
    POPUP_DATA,
  },

  data() {
    return {
      show_sql_query: false,
      main_slot_size: undefined,
      options: this.$store.getters.ENV.options_db_queries,
      param: {
        filter_patient: undefined,
        main_size: undefined,
        patientlist_size: undefined,
        observationlist_size: undefined,
      },
      localData: {
        PATIENTS: undefined,
      },
      query_obs_elements: [],
      query_sql_locked: true,
    };
  },

  mounted() {
    if (!this.SQL_QUERY) this.resetSQLQuery();
    else this.runSQLStatement(this.SQL_QUERY);
  },

  computed: {
    SHOW_SQL_QUERY() {
      return this.show_sql_query;
    },

    TEXT() {
      return this.$store.getters.TEXT.page.db_queries;
    },
    STYLE_DIV() {
      if (!this.main_slot_size)
        return `width: 100%; height: ${
          this.$q.screen.height -
          300 * ((this.$q.screen.height / this.$q.screen.height) * 0.9)
        }px`;
      // else
      return `width: 100%; height: ${
        (this.main_slot_size.height / 12) * 10 - 50
      }px`;
    },

    SIZE_TOP() {
      return "80px";
    },

    SIZE_VISIT() {
      return "120px";
    },

    PATIENTS() {
      if (!this.localData.PATIENTS) return [];
      return this.localData.PATIENTS.filter((item) => {
        if (!this.param.filter_patient) return true;
        return item.PATIENT_CD.includes(this.param.filter_patient);
      });
    },

    SQL_QUERY: {
      get() {
        return this.$store.getters.PATIENT_VIEW_SQL_STATEMENT;
      },
      set(val) {
        this.$store.commit("PATIENT_VIEW_SQLSTATEMENT_SET", val);
      },
    },

    // ENDE COMPUTED
  },

  methods: {
    onResize(size, field) {
      this.param[field] = size;
    },

    // LOAD THE DATA
    async runSQLStatement(sql_query) {
      this.$store.commit("VISIT_PINNED_SET", undefined);
      // this.$store.commit('PATIENT_PINNED_SET', undefined)
      const res = await this.$store.dispatch("runQuery", sql_query);
      if (res.status) {
        // remove doubles, this might occure if a patient has more than one user assigned
        let uniqueByPatientCD = res.data.reduce((acc, item) => {
          delete item.USER_ID;
          if (!acc.some((accItem) => accItem.PATIENT_CD === item.PATIENT_CD)) {
            acc.push(item);
          }
          return acc;
        }, []);
        // success
        this.localData.PATIENTS = uniqueByPatientCD;
        this.$q.notify({
          type: "positive",
          message: "Daten erfolgreich geladen",
        });
      } else {
        this.$q.notify({
          type: "negative",
          message: "Daten konnten nicht geladen werden",
        });
      }
    },

    // QUERY FUNCTIONS
    resetSQLQuery() {
      this.$store.commit("PATIENT_PINNED_SET", undefined);
      var sql = undefined;
      if (this.query_obs_elements.length === 0)
        sql = `${this.$store.getters.ENV.app.env.patient_view.sql_statement} WHERE USER_ID=${this.$store.getters.USER.USER_ID} OR USER_ID=${this.$store.getters.PUBLIC_ID}`;
      else {
        // SELECT * FROM patient_list pl WHERE (pl.USER_ID = 14 OR pl.USER_ID = 0) AND EXISTS (SELECT 1 FROM OBSERVATION_FACT of WHERE pl.PATIENT_NUM = of.PATIENT_NUM AND of.CONCEPT_CD = 'age');
        const CONCEPTS = this.query_obs_elements
          .map((el) => {
            if (el.VALTYPE_CD === "N") {
              return `(of.CONCEPT_CD = '${el.CONCEPT_CD}' AND of.NUM_VAL=${el.NVAL_NUM})`;
            } else {
              return `(of.CONCEPT_CD = '${el.CONCEPT_CD}' AND of.TVAL_CHAR='${el.TVAL_CHAR}')`;
            }
          })
          .join(" OR ");

        const and = ` AND EXISTS (SELECT 1 FROM OBSERVATION_FACT of WHERE pl.PATIENT_NUM = of.PATIENT_NUM AND (${CONCEPTS})`;
        sql = `${this.$store.getters.ENV.app.env.patient_view.sql_statement} pl WHERE (pl.USER_ID = ${this.$store.getters.USER.USER_ID} OR pl.USER_ID = ${this.$store.getters.PUBLIC_ID}) ${and} )`;
      }

      this.$store.commit("PATIENT_VIEW_SQLSTATEMENT_SET", sql);
      this.runSQLStatement(sql);
      // go back to PatientList
    },

    closePatient() {
      this.$store.commit("PATIENT_PINNED_SET", undefined);
      this.$router.push({ name: "Patients" });
    },

    addElementToQuery(el) {
      if (
        !this.query_obs_elements.some(
          (element) => element.CONCEPT_CD === el.CONCEPT_CD
        )
      ) {
        this.query_obs_elements.push(el);
        this.resetSQLQuery();
      }
    },

    removeSqlEl(ind) {
      this.query_obs_elements.splice(ind, 1);
      this.resetSQLQuery();
    },

    updateSQL_El_value(val, ind) {
      if (!val || ind < 0) return;
      // find val in query_obs_elements and update
      if (val.VALTYPE_CD === "N")
        this.query_obs_elements[ind].NVAL_NUM = val.NVAL_NUM;
      else {
        this.query_obs_elements[ind].TVAL_CHAR = val.TVAL_CHAR;
        if (val.TVAL_RESOLVED)
          this.query_obs_elements[ind].TVAL_RESOLVED = val.TVAL_RESOLVED;
      }
      this.resetSQLQuery();
    },

    // PATIENT CLICKED
    patientClicked(patient) {
      // check if patient is already pinned
      if (
        this.$store.getters.PATIENT_PINNED &&
        this.$store.getters.PATIENT_PINNED.PATIENT_NUM === patient.PATIENT_NUM
      )
        return;
      // set patient pinned
      this.$store.commit("PATIENT_PINNED_SET", patient);
      this.$store.commit("VISIT_PINNED_SET", undefined);
    },

    // ENDE METHODS
  },
};
</script>
