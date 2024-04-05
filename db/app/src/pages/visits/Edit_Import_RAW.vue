<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'general_icon.png'" :icon="'event'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div v-if="!$store.getters.VISIT_PINNED" class="text-center">
          <q-banner class="bg-red">Keine Visite ausgewählt!</q-banner>
          <q-banner class="bg-red q-mt-lg" v-if="!$store.getters.PATIENT_PINNED">Kein Patient ausgewählt!</q-banner>
          <q-btn v-else no-caps rounded class="my-btn q-mt-lg" @click="createVisit()">Neue Visite erzeugen</q-btn>
        </div>
        <div v-else>
          <div>
            Daten werden hinzugefügt zu:
            <q-chip dense class="my-patient-color">{{ $store.getters.PATIENT_PINNED.PATIENT_CD }}</q-chip>
            <q-chip dense class="my-visit-color">Visite {{ $store.getters.VISIT_PINNED.ENCOUNTER_NUM }}</q-chip>
            <span>by <q-chip dense class="my-provider-color"> {{ $store.getters.PROVIDER_PINNED.NAME_CHAR }}</q-chip></span>
          </div>
          <!-- BANNER -->
          <div v-if="SOME_CONCEPT_STILL_UNDEFINED" class="text-center q-pa-md">
            <q-banner class="bg-warning" dense>Bitte jede Datei einem RAW-Concept zuordnen.</q-banner>
          </div>
          <q-markup-table v-if="FILE_PATH" class="q-mt-sm">
            <q-tr v-for="(item, ind) of FILE_PATH" :key="ind + 'file'">
              <q-td>
                <q-icon name="done_all" color="green" v-if="item.imported" />
                <q-btn v-else-if="item.CONCEPT_CD === undefined" round flat icon="info" class="text-warning" @click="show_concept_select = true; show_add_concept_data = item"><q-tooltip>Ordne die Datei einem Konzept zu</q-tooltip></q-btn>
                <q-btn v-else round flat icon="check" class="text-positive" @click="show_concept_select = true; show_add_concept_data = item"><q-tooltip>Aktuelles Konzept: {{ item.CONCEPT_CD }}</q-tooltip></q-btn>
                <!-- <q-btn v-else-if="item.show_force_btn" round flat icon="add_circle" color="red" @click="addItem(item, true)"><q-tooltip>Fügt Daten trotz Warnung ein.</q-tooltip></q-btn> -->
                <!-- <q-btn v-else round flat icon="add" @click="addItem(item, false)"><q-tooltip>Fügt die Daten der DB hinzu</q-tooltip></q-btn> -->
              </q-td>
              <q-td class="text-caption overflow-hidden">
                <q-icon v-if="item.is_image" name="image"><q-tooltip>Image detected</q-tooltip></q-icon>
                {{ item.value }} <q-tooltip>{{ item.CONCEPT_CD }}</q-tooltip>
              </q-td>
              <q-td class="text-caption cursor-pointer">{{ item.START_DATE }}
                <q-popup-edit v-model="item.START_DATE" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </q-markup-table>
          <div class="text-center q-mt-md" v-if="!SOME_CONCEPT_STILL_UNDEFINED && FILE_PATH &&!ALL_CONCEPTS_ARE_IMPORTED">
            <q-btn class="my-btn" rounded @click="addItems()">Hinzufügen</q-btn>
          </div>
          <div class="text-center q-mt-md" v-else-if="ALL_CONCEPTS_ARE_IMPORTED">
            <q-banner class="bg-positive" dense>Alle Daten wurden erfolgreich hinzugefügt</q-banner>
          </div>

        </div>
      </template>

           <!-- FOOTER -->
     <template v-slot:footer>
        <BOTTOM_BUTTONS :show_back="true" @back="$router.go(-1)" />
      </template>
    </MainSlot>

    <!-- DIALOG for a new visit-->
    <q-dialog v-model="show_new_visit">
      <q-card>
        <q-btn flat icon="close" round v-close-popup class="absolute-top-right z-max" />
        <q-card-section>Neue Visite anlegen</q-card-section>
        <q-card-section>
          <VISIT_EDIT_CARD :item="new_visit" :mode="'new'" @save="show_new_visit = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG FOR CONCEPT_SELECT -->
    <q-dialog v-model="show_concept_select">
      <q-card>
        <q-btn flat icon="close" round v-close-popup class="absolute-top-right z-max" />
        <q-card-section>Wähle ein Konzept aus</q-card-section>
        <q-card-section>
          <q-list bordered separator dense>
            <q-item v-for="(item, ind) in CONCEPTS_TOSHOW" :key="ind" clickable v-ripple @click="selectConcept(item)">
              <q-item-section>
                <q-item-label>{{ item.NAME_CHAR }}</q-item-label>
                <q-item-label caption>{{ item.CONCEPT_CD }}</q-item-label>

              </q-item-section>
              <q-item-section side>
                <q-btn flat round dense icon="add" @click="selectConcept(item)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import MainSlot from "src/components/MainSlot.vue";
import VISIT_EDIT_CARD from "src/components/visits/VisitEdit_Card.vue";
import { datenow_isostring } from "src/tools/mydate";
import BOTTOM_BUTTONS from "src/components/elements/BottomButtons.vue";
import { error_codes } from "src/tools/logger";

export default {
  name: "Edit_Import_RAW",

  components: {
    HEADING,
    MainSlot,
    VISIT_EDIT_CARD, BOTTOM_BUTTONS
  },

  data() {
    return {
      imported_data: undefined,
      debugging: false,
      show_new_visit: false,
      new_visit: undefined,
      IMPORT_FN: [],
      show_concept_select: false,
      show_concept_select_data: undefined,
      CONCEPTS_TOSHOW: []
    };
  },

  mounted() {
    this.IMPORT_FN = this.prepare_IMPORT_FN();
    // get all concepts
    this.initData()
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import_raw;
    },

    FILE_PATH() {
      return this.IMPORT_FN;
    },

    SOME_CONCEPT_STILL_UNDEFINED() {
      if (!this.IMPORT_FN) return false
      return this.IMPORT_FN.some(item => item.CONCEPT_CD === undefined)
    },

    ALL_CONCEPTS_ARE_IMPORTED() {
      if (!this.IMPORT_FN) return false
      return this.IMPORT_FN.every(item => item.imported)
    }
  },

  methods: {
    async initData() {
      // LOAD RAW CONCEPTS
      const res = await this.$store.dispatch('searchDB', { query_string: {VALTYPE_CD: 'R'}, table: "CONCEPT_DIMENSION"})
      this.CONCEPTS_TOSHOW = res.filter(item => item.CONCEPT_PATH.includes("\\CUSTOM\\RAW"))


      this.IMPORT_FN.forEach(item => {
        // CHECK IF DATA IS A IMAGE
        if (item.value.endsWith(".png") || item.value.endsWith(".jpg") || item.value.endsWith(".jpeg") || item.value.endsWith(".gif")) {
          item.CONCEPT_CD = this.CONCEPTS_TOSHOW.find(item => item.CONCEPT_PATH.includes("\\CUSTOM\\RAW\\IMAGE")).CONCEPT_CD
          // item.imported = true
          item.is_image = true
        }


        else if (item.value.endsWith(".txt") || item.value.endsWith(".csv")) {
          // Monetary Incentive Delay (MID)
          let path = window.electron.path
          //split the item.value by the path seperator
          let splitted = item.value.split(path.sep)
          // last element should contain 'MID_Teil2' in lower case
          if (splitted[splitted.length - 1].toLowerCase().includes('mid_teil2')) {
            item.CONCEPT_CD = this.CONCEPTS_TOSHOW.find(item => item.CONCEPT_CD.includes("CUSTOM: RAW_MID_PART_2")).CONCEPT_CD
            // if the last element contains something like '..._2022-01-01_...' extract the date
            if (splitted[splitted.length - 1].includes('_')) {
              let date = splitted[splitted.length - 1].split('_')[2]
              //if the date is a valid date, set it as START_DATE
              if (new Date(date) !== "Invalid Date" && !isNaN(new Date(date))) {
                item.START_DATE = new Date(date).toISOString().split('T')[0]
              }
            }

          } else if (splitted[splitted.length - 1].toLowerCase().includes('mid_teil1')) {
            item.CONCEPT_CD = this.CONCEPTS_TOSHOW.find(item => item.CONCEPT_CD.includes("CUSTOM: RAW_MID_PART_1")).CONCEPT_CD
          }
        }

        console.log(item)
      })



    },

    prepare_IMPORT_FN() {
      // simple debuging
      if (this.debugging)
        return [
          {
            imported: false,
            value:
              "/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/OBS_MULTIPLE_PATIENTS_LARGE.csv",
            START_DATE: datenow_isostring(),
          },
        ];
      // real data from the Route
      else if (this.$route.params.FILE_PATH) {
        const TMP = JSON.parse(this.$route.params.FILE_PATH);
        const DATA = [];
        // now fill DATA with elements of TMP using forEach
        TMP.forEach((item) => {
          DATA.push({
            imported: false,
            value: item,
            START_DATE: datenow_isostring(),
            CONCEPT_CD: undefined
          });
        });
        return DATA;
      }
      // return undefined, if something goes wrong
      else return undefined;
    },

    createVisit() {
      console.log("VISIT");
      this.show_new_visit = true;
      this.new_visit = {
        PATIENT_NUM: this.$store.getters.PATIENT_PINNED.PATIENT_NUM,
        START_DATE: datenow_isostring(),
      };
    },

    selectConcept(item) {
      this.show_concept_select = false;
      this.show_add_concept_data.CONCEPT_CD = item.CONCEPT_CD;
    },

    async addItems() {
      for (let item of this.IMPORT_FN) {
        if (item.CONCEPT_CD === undefined) {
          this.$q.notify("Bitte ordne alle Dateien einem Konzept zu");
          return;
        }
        await this.addItem(item, false);
      }
    },

    async addItem(item, force) {
      if (!this.$store.getters.PATIENT_PINNED)
        return this.$q.notify("Kein Patient ausgewählt");
      if (!this.$store.getters.VISIT_PINNED)
        return this.$q.notify("Keine Visite ausgewählt");
      if (!this.$store.getters.PROVIDER_PINNED)
        return this.$q.notify("Kein Provider ausgewählt");
      //else
      const payload = {
        raw_fn: item.value,
        START_DATE: item.START_DATE,
        PATIENT_NUM: this.$store.getters.PATIENT_PINNED.PATIENT_NUM,
        ENCOUNTER_NUM: this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM,
        PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID,
        CONCEPT_CD: item.CONCEPT_CD,
        _force: force
      };

      const res = await this.$store.dispatch(
        "importRAWdata_from_file",
        payload
      );
      if (res.status) item.imported = true;
      else {
        this.$q.notify(res.error);
        if (res.error === error_codes.data_already_exists) item.show_force_btn = true;
      }
    },
  },
};
</script>
