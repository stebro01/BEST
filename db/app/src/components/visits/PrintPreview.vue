<template>
  <div class="row justify-center q-mt-xl">
    <div class="col-12 text-center">
      DRUCK VORSCHAU
      <q-btn
        round
        flat
        size="lg"
        @click="printDiv('myPrintDiv')"
        icon="picture_as_pdf"
        ><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.pdf }}</q-tooltip></q-btn
      >

      <q-btn
        icon="close"
        round
        flat
        class="float-right"
        @click="$emit('close')"
      ></q-btn>
    </div>
    <div
      class="col-12 text-caption q-mb-xl row justify-center"
      v-if="PREVIEW_DATA"
    >
      <q-card style="width: 80%" id="myPrintDiv">
        <q-card-section class="text-h6">Zusammenfassung</q-card-section>
        <q-card-section>Visiten: {{ PREVIEW_DATA.length }}</q-card-section>

        <div class="row">
          <q-card
            v-for="(item, ind) in PREVIEW_DATA"
            :key="ind + 'visitscontent'"
            class="overflow-hidden"
            :class="{ 'html2pdf__page-break': ind + 1 < PREVIEW_DATA.length }"
          >
            <!-- INFO -->
            <q-card-section class="text-h5">
              Visite: {{ item.info.ENCOUNTER_NUM }}
            </q-card-section>
            <!-- OBSERVATION -->
            <q-card-section>
              <div class="row q-gutter-xs">
                <q-card
                  v-for="(obs, ind_obs) in item.observation"
                  :key="ind_obs + '_' + ind + 'obs'"
                  dense
                  class="q-pa-xs"
                >
                  <q-card-section class="q-pa-none text-bold">{{
                    obs.CONCEPT_NAME_CHAR
                  }}</q-card-section>
                  <q-card-section class="q-pa-none">
                    <span v-if="obs.NVAL_NUM"
                      >{{ obs.NVAL_NUM }}
                      <span v-if="obs.UNIT_CD">{{ obs.UNIT_CD }}</span></span
                    >
                    <span v-else-if="obs.TVAL_RESOLVED">{{
                      obs.TVAL_RESOLVED
                    }}</span>
                    <span v-else>{{ obs.TVAL_CHAR }}</span>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>

            <!-- SURVEYS -->
            <q-card-section v-if="item.surveybest.length > 0">
              <div class="html2pdf__page-break"></div>
              <div
                v-for="(item_survey, ind_survey) in item.surveybest"
                :key="ind + '_' + ind_survey + 'surv'"
              >
                <SURVEY_BEST_PREVIEW
                  v-if="true"
                  :item="item_survey.OBSERVATION_BLOB"
                  :mode="'multiple'"
                  :class="{
                    'html2pdf__page-break':
                      ind_survey + 1 < item.surveybest.length,
                  }"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="text-right my-small-text">
          Dies ist ein digitales Dokument und auch ohne Unterschrift gültig.
          <br />{{ new Date() }}
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import SURVEY_BEST_PREVIEW from "src/components/visits/SurveyBestPreview.vue";

export default {
  name: "PrintPreview",

  props: ["formData"],

  components: { SURVEY_BEST_PREVIEW },

  data() {
    return {
      PREVIEW_DATA: undefined,
    };
  },

  mounted() {
    if (this.formData) this.prepareData(this.formData);
  },

  computed: {},

  methods: {
    async prepareData(data) {
      this.$store.commit("LOG", { message: "prepareData" });
      const VISITS = [];
      const ENCOUNTERS = Array.from(
        new Set(data.map((item) => item.ENCOUNTER_NUM))
      );
      for (let ENCOUNTER_NUM of ENCOUNTERS) {
        let OBJ = data.filter((el) => el.ENCOUNTER_NUM === ENCOUNTER_NUM);
        if (OBJ) {
          let V = {
            observation: [],
            surveybest: [],
            info: { ENCOUNTER_NUM: ENCOUNTER_NUM },
          };
          for (let obj of OBJ) {
            if (obj.CATEGORY_CHAR === "surveyBEST") V.surveybest.push(obj);
            else V.observation.push(obj);
          }
          VISITS.push(V);
        }
      }

      // ENDE
      this.PREVIEW_DATA = VISITS;
    },

    printDiv(val) {
      var div = document.getElementById(val);
      const filename = `print_preview.pdf`;
      html2pdf(div, { margin: 1, filename: filename });
    },
  },
};
</script>
