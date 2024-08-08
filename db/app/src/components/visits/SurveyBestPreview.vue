<template>
  <div
    v-if="preview_survey_best_item"
    class="row justify-center"
    style="max-width: 90%"
    id="mySurveyDIV"
  >
    <div class="col-12 overflow-hidden">
      <q-icon
        v-if="mode !== 'multiple'"
        class="float-right z-top cursor-pointer q-ml-md"
        @click="$emit('close')"
        name="close"
        size="md"
        ><q-tooltip>{{
          $store.getters.TEXT.btn.tooltip.close
        }}</q-tooltip></q-icon
      >
      <q-icon
        v-if="mode !== 'multiple'"
        class="float-right z-top cursor-pointer q-ml-md"
        @click="printDiv('mySurveyDIV')"
        name="picture_as_pdf"
        size="md"
        ><q-tooltip>{{
          $store.getters.TEXT.btn.tooltip.pdf
        }}</q-tooltip></q-icon
      >
      <q-icon
        v-if="mode !== 'multiple'"
        class="float-right z-top cursor-pointer q-ml-md"
        @click="save_to_disk()"
        name="download"
        size="md"
        ><q-tooltip>Speichere lokal</q-tooltip></q-icon
      >
      <q-card class="q-ma-md no-shadow">
        <!-- SUMMARY -->
        <q-card-section v-if="preview_survey_best_item.SUMMARY">
          <q-item-label
            v-for="(item, ind) in Object.keys(preview_survey_best_item.SUMMARY)"
            :key="ind + 'summary'"
            :class="{ 'text-h6': ind === 0, 'text-right': ind > 0 }"
          >
            <span v-if="ind > 0">{{
              preview_survey_best_item.SUMMARY[item].label
            }}</span>
            {{ preview_survey_best_item.SUMMARY[item].value }}
          </q-item-label>
        </q-card-section>
        <!-- DESCRIPTION -->
        <div class="row">
          <div class="col-6">
            <q-card-section v-if="preview_survey_best_item.DESCRIPTION">
              <q-item-label
                v-for="(item, ind) in Object.keys(
                  preview_survey_best_item.DESCRIPTION
                )"
                :key="ind + 'DESCRIPTION'"
              >
                {{ preview_survey_best_item.DESCRIPTION[item].label }}
                {{ preview_survey_best_item.DESCRIPTION[item].value }}
              </q-item-label>
            </q-card-section>
          </div>
          <!-- SUBJECT -->
          <div class="col-6">
            <q-card-section v-if="preview_survey_best_item.SUBJECT">
              <q-item-label
                v-for="(item, ind) in Object.keys(
                  preview_survey_best_item.SUBJECT
                )"
                :key="ind + 'SUBJECT'"
                :class="{
                  'text-bold':
                    preview_survey_best_item.SUBJECT[item].label === 'Subject:',
                }"
              >
                {{ preview_survey_best_item.SUBJECT[item].label }}
                {{ preview_survey_best_item.SUBJECT[item].value }}
              </q-item-label>
            </q-card-section>
          </div>
        </div>
        <!-- RESULTS -->
        <q-card-section v-if="preview_survey_best_item.RESULTS">
          <q-table
            hide-header
            hide-bottom
            grid
            dense
            :rows="
              preview_survey_best_item.RESULTS.filter(
                (el) =>
                  el.label !== 'PID' &&
                  el.label !== 'quest' &&
                  el.label !== 'date'
              )
            "
            :rows-per-page-options="[100]"
          >
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3">
                <q-card
                  dense
                  :class="{ 'text-bold': props.row.label === 'sum' }"
                  class="no-shadow bg-grey-1"
                >
                  <q-card-section class="text-center q-pa-none overflow-hidden">
                    {{ props.row.label }}
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="flex flex-center q-pa-none">
                    {{ props.row.value }}
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card-section>
        <!-- EVALUATION -->
        <q-card-section
          v-if="preview_survey_best_item.EVALUATION"
          class="text-bold"
        >
          <q-item-label
            v-for="(item, ind) in Object.keys(
              preview_survey_best_item.EVALUATION
            )"
            :key="ind + 'EVALUATION'"
          >
            {{ preview_survey_best_item.EVALUATION[item].label }}:
            {{ preview_survey_best_item.EVALUATION[item].value }}
          </q-item-label>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="mode !== 'multiple'" class="col-12 text-center q-mt-xl">
      Dies ist ein digital erzeugtes Dokument und beruht auf einem HL7 konformen
      Format (v.2019)
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import { exportFile } from "quasar";

export default {
  name: "SurveyBestPreview",

  props: ["item", "mode"],

  components: {},

  data() {
    return {
      preview_survey_best_item: undefined,
    };
  },

  mounted() {
    if (this.item) this.previewSurveyBest(this.item);
  },

  computed: {},

  methods: {
    previewSurveyBest(val) {
      // this.preview_survey_best_show = true
      val = val.replace(/'/g, '"');
      val = val.replace(/\\"/g, "'");
      val = val.replace(/\\/g, "_");
      val = JSON.parse(val);
      if (val.text)
        this.preview_survey_best_item = this.prepare_data_survey(val.text.div);
      else this.preview_survey_best_item = undefined;
    },

    prepare_data_survey(val) {
      // CREATE AN ELEMENT
      var div = document.createElement("div");
      div.innerHTML = val.trim();
      var div2 = div.children[0];

      // SUMMARY
      const SUMMARY = this._extract_div(div2, "summary_table", "row");

      // DESCRIPTION
      const DESCRIPTION = this._extract_div(div2, "description_table", "row");

      // SUBJECT
      const SUBJECT = this._extract_div(div2, "subjects_table", "row");

      // RESULTS
      const RESULTS = this._extract_div(div2, "results_table", "col");

      // EVALUATION
      const EVALUATION = this._extract_div(div2, "evaluation_div", "div");

      return { SUMMARY, DESCRIPTION, SUBJECT, RESULTS, EVALUATION };
    },

    _extract_div(div, id, mode) {
      var div_results = undefined;
      for (let d of div.children) {
        if (d.getAttribute("id") === id) div_results = d;
      }
      if (!div_results) return undefined;
      //
      var tbody = div_results.children[0];
      const RESULTS = [];

      // MODE COL
      if (mode === "col") {
        var trow1 = tbody.children[0];
        var trow2 = tbody.children[1];

        // console.log(trow1.children.length)
        for (let i = 0; i < trow1.children.length; i++) {
          RESULTS.push({
            label: trow1.children[i].innerHTML,
            value: trow2.children[i].innerHTML,
          });
        }
      } else if (mode === "row") {
        for (let i = 0; i < tbody.children.length; i++) {
          let tr = tbody.children[i];
          RESULTS.push({
            label: tr.children[0].innerHTML,
            value: tr.children[1].innerHTML,
          });
        }
      } else if (mode === "div") {
        RESULTS.push({ label: "Evaluation", value: div_results.innerHTML });
      }

      return RESULTS;
    },

    printDiv(val) {
      var div = document.getElementById(val);
      const filename = `${this.preview_survey_best_item.RESULTS[0].value}_${this.preview_survey_best_item.RESULTS[1].value}.pdf`;
      html2pdf(div, { margin: 1, filename: filename });
    },

    save_to_disk() {
      const filename = `PID_${this.$store.getters.PATIENT_PINNED.PATIENT_CD}_SURVEYBEST_${this.preview_survey_best_item.RESULTS[1].value}_DATE_${this.preview_survey_best_item.RESULTS[2].value}.json`;
      const status = exportFile(filename, this.item, "application/json");
      if (!status === true)
        this.$q.notify({
          type: "negative",
          message: "Datei konnte nicht gespeichert werden",
        });
    },
  },
};
</script>
