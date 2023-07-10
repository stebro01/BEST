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
          <q-btn no-caps rounded class="my-btn q-mt-lg" @click="createVisit()">Neue Visite erzeugen</q-btn>
        </div>
        <div v-else>
          <q-markup-table v-if="FILE_PATH">

            <q-tr v-for="(item, ind) of FILE_PATH" :key="ind + 'file'">
              <q-td>
                <q-icon name="done" color="green" v-if="item.imported" />
                <q-btn v-else round flat icon="add" @click="addItem(item, ind)"></q-btn>
              </q-td>
              <q-td class="text-caption overflow-hidden">{{ item.value }}</q-td>
              <q-td class="text-caption cursor-pointer">{{ item.START_DATE }}
                <q-popup-edit v-model="item.START_DATE" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set"
                   />
              </q-popup-edit>
              </q-td>
            </q-tr>
          </q-markup-table>
        </div>
      </template>
    </MainSlot>

    <q-dialog v-model="show_new_visit">
      <q-card>
        <q-btn flat icon="close" round v-close-popup class="absolute-top-right z-max" />
        <q-card-section>Neue Visite anlegen</q-card-section>
        <q-card-section>
          <VISIT_EDIT_CARD :item="new_visit" :mode="'new'" @save="show_new_visit = false" />
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

export default {
  name: "Edit_Import_RAW",

  components: {
    HEADING,
    MainSlot,
    VISIT_EDIT_CARD,
  },

  data() {
    return {
      imported_data: undefined,
      debugging: true,
      show_new_visit: false,
      new_visit: undefined,
      IMPORT_FN: [],
    };
  },

  mounted() { },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import_raw;
    },

    FILE_PATH() {
      if (this.debugging)
        return [
          {
            imported: false,
            value:
              "/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/OBS_MULTIPLE_PATIENTS_LARGE.csv",
            START_DATE: datenow_isostring(),
          },
        ];
      else if (this.$route.params.FILE_PATH)
        return JSON.parse(this.$route.params.FILE_PATH);
      else return undefined;
    },
  },

  methods: {
    createVisit() {
      console.log("VISIT");
      this.show_new_visit = true;
      this.new_visit = {
        PATIENT_NUM: this.$store.getters.PATIENT_PINNED.PATIENT_NUM,
        START_DATE: datenow_isostring(),
      };
    },

    async addItem(item) {
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
      };

      const res = await this.$store.dispatch(
        "importRAWdata_from_file",
        payload
      );
      if (res.status) 
    },
  },
};
</script>
