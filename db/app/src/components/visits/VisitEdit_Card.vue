<template>
  <!-- results -->
  <div v-if="visit !== undefined">
    <div v-if="mode === 'new' && !visit.ACTIVE_STATUS_CD" class="q-mb-md">
      <q-banner dense class="bg-info">Neue Visite anlegen: bitte den <b>Status</b> auswählen</q-banner>
    </div>
    <q-markup-table flat bordered dense >
      <thead v-if="mode !== 'new'">
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">{{ visit.ENCOUNTER_NUM }}</th>
        </tr>
      </thead>
      <tbody class="text-weight-regular">
        <!-- STATUS -->
        <tr>
          <td class="text-center" :class="{ 'text-bold': !visit.ACTIVE_STATUS_CD }">
            Status
          </td>
          <td class="bg-grey-3 text-center cursor-pointer">
            <RESOLVE_CONCEPT :item="visit.ACTIVE_STATUS_CD" />
            <q-popup-edit v-model="visit.ACTIVE_STATUS_CD" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_status" @blur="dataChanged()"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
        <!-- DATUM -->
        <tr>
          <td class="text-center">Datum</td>
          <td class="bg-grey-3 text-center cursor-pointer">
            {{ visit.START_DATE
            }}<q-popup-edit v-model="visit.START_DATE" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
        <!-- ENDE DATUM -->
        <tr>
          <td class="text-center">Ende</td>
          <td class="bg-grey-3 text-center cursor-pointer">
            {{ visit.END_DATE }}
            <q-icon v-if="ALERT_END_DATUM" name="warning" color="red"><q-tooltip>Das End-Datum liegt vor dem Start-Datum!</q-tooltip></q-icon>
            <q-popup-edit v-model="visit.END_DATE" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
        <!-- LOCATION -->
        <tr>
          <td class="text-center">Ort</td>
          <td class="bg-grey-3 text-center cursor-pointer">
            <span v-if="visit.LOCATION_CD && visit.LOCATION_CD.label">{{
              visit.LOCATION_CD.label
            }}</span>
            <span v-else>{{ visit.LOCATION_CD }}</span>
            <q-popup-edit v-model="visit.LOCATION_CD" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_location" @blur="dataChanged()"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
        <!-- INOUT -->
        <tr>
          <td class="text-center">INOUT</td>
          <td class="bg-grey-3 text-center cursor-pointer">
            {{ visit.INOUT_CD }}
            <q-popup-edit v-model="visit.INOUT_CD" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
        <!-- BESCHREIBUNG -->
        <tr>
          <td class="text-center">Beschreibung</td>
          <td class="bg-grey-3 text-center cursor-pointer">
            {{ visit.VISIT_BLOB
            }}<q-popup-edit v-model="visit.VISIT_BLOB" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set"
                @change="dataChanged()" />
            </q-popup-edit>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <!-- ACTION BUTTONS -->
    <BOTTOM_BUTTONS  :show_save="data_changed === true" @save="saveData()" />
  </div>
</template>

<script>
import { beautify_data } from "src/tools/formatdata.js";
import RESOLVE_CONCEPT from "src/components/elements/ResolveConcept.vue";
import BOTTOM_BUTTONS from "src/components/elements/BottomButtons.vue";

export default {
  name: "VisitCard",

  props: ["item", "title", "mode"],

  components: { RESOLVE_CONCEPT, BOTTOM_BUTTONS },

  data() {
    return {
      visit: undefined,
      data_changed: false,
      options_location: [],
      options_status: [],
    };
  },

  mounted() {
    if (!this.item) this.visit = undefined;
    else this.loadData();
  },

  computed: {
    ALERT_END_DATUM() {
      if (!this.visit || !this.visit.END_DATE) return false
      if (this.visit.END_DATE < this.visit.START_DATE) return true
      return false
    }
  },

  methods: {
    dataChanged() {
      this.data_changed = true;
    },

    loadData() {
      this.visit = JSON.parse(JSON.stringify(this.item));
      this.$store
        .dispatch("resolveCD", { table: "VISIT_DIMENSION" })
        .then((res) => {
          res.resolve.LOCATION_CD.forEach((location) => {
            this.options_location.push({
              value: location.CODE_CD,
              label: location.NAME_CHAR,
            });
            if (location.CODE_CD === this.visit.LOCATION_CD)
              this.visit.LOCATION_CD = {
                value: location.CODE_CD,
                label: location.NAME_CHAR,
              };
          });
        });
      // resolve status
      this.$store
        .dispatch(
          "getConceptList",
          "\\SNOMED-CT\\138875005\\362981000\\272099008\\106232001\\"
        )
        .then((res) => {
          this.options_status = res;
        });
        
      this.data_changed = this.visit._create_new === true;
    },

    saveData() {
      const data = beautify_data(this.visit);
      if (this.mode === "new" && !data.ENCOUNTER_NUM) {
        this.$store
          .dispatch("addDB", { query_string: data, table: "VISIT_DIMENSION" })
          .then((res) => {
            this.$emit('save')
            //get new visit
            this.visit.ENCOUNTER_NUM = res.ENCOUNTER_NUM;
            this.$store
              .dispatch("searchDB", {
                query_string: res,
                table: "VISIT_DIMENSION",
              })
              .then((res_visit) => {
                this.$store.commit("VISIT_PINNED_SET", res_visit[0]);
                this.$q.notify("Speichern erfolgreich");
                this.data_changed = false;
              });
          })
          .catch((err) => this.$q.notify(err));
      } else {
        // UPDATE
        const where = { ENCOUNTER_NUM: data.ENCOUNTER_NUM };
        delete data.ENCOUNTER_NUM;
        this.$store
          .dispatch("updateDB", {
            query_string: { where: where, set: data },
            table: "VISIT_DIMENSION",
          })
          .then((res) => {
            const new_visit = { ...data, ENCOUNTER_NUM: where.ENCOUNTER_NUM };
            this.$store.commit("VISIT_PINNED_SET", new_visit);
            this.$q.notify("Speichern erfolgreich");
            this.data_changed = false;
          })
          .catch((err) => this.$q.notify(err));
      }
    },

    /**
     * IMPORTED from MIXINS
     * - notPrimaryKey(el)
     * - typeOfEl(el)
     * - isResolveScheme(el)
     * - getResolvedValue(element, value)
     * - deleteData(item)
     */
  },
};
</script>
