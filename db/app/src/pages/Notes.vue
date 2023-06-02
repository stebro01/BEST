<template>
  <q-page class="">
    <MainSlot :no_options="true" :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'Notizen und Feedback'" :description="'verwalten und anzeigen'" :img="'patient-color-logo.png'"
          :icon="'message'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table" :rows="results" :columns="columns" :filter="filter" selection="single" dense
          row-key="NOTE_ID" v-model:selected="selected">
          <template v-slot:top>
            <!-- BUTTONS -->
            <BOTTOM_DROPDOWN :show_add="true" @add="show_new_patient = true; show_new_patient_data = {}"
              :show_remove="SELECTION > 0" @remove="deleteNote(selected)" />
            <q-space />
            <!-- FILTERBOX -->
            <FILTER_BOX :filter="filter" @update="filter = $event" />
          </template>

        </q-table>
      </template>
    </MainSlot>

    <!-- FORM -->
    <q-dialog v-model="show_new_patient">
      <q-card>
        <q-btn class="float-right z-top" round flat icon='close' v-close-popup />
        <q-card-section>Neuen Eintrag</q-card-section>
        <q-card-section>
          <q-form @submit="saveNewNote(show_new_patient_data)">
            <q-markup-table dense>
              <tbody>
                <!-- ID -->
                <tr>
                  <td>Kategorie</td>
                  <td><q-input dense filled v-model="show_new_patient_data.CATEGORY_CHAR" /></td>
                </tr>
                <tr>
                  <td>Titel</td>
                  <td><q-input dense filled v-model="show_new_patient_data.NAME_CHAR"
                      :rules="[val => !!val || 'Field is required']" /></td>
                </tr>
                <tr>
                  <td>Text</td>
                  <td><q-input dense filled v-model="show_new_patient_data.NOTE_BLOB" type="textarea"
                      :rules="[val => !!val || 'Field is required']" /></td>
                </tr>

              </tbody>
            </q-markup-table>
            <div class="text-center">
              <q-btn type="submit" rounded class="my-btn q-mt-lg">{{ $store.getters.TEXT.btn.save }}</q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import FILTER_BOX from "src/components/elements/FilterBox.vue";
import MainSlot from "src/components/MainSlot.vue";
import BOTTOM_DROPDOWN from "src/components/elements/BottomDropDown.vue";
import { my_confirm } from "src/tools/my_dialog";
export default {
  name: "NotePage",
  components: { HEADING, FILTER_BOX, MainSlot, BOTTOM_DROPDOWN },
  data() {
    return {
      filter: null,
      show_new_patient: false,
      show_new_patient_data: {},
      selected: [],
      results: [],
      columns: [

        {
          name: "CATEGORY_CHAR",
          required: true,
          label: "Kategorie",
          align: "center",
          field: "CATEGORY_CHAR",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "NAME_CHAR",
          required: true,
          label: "Titel",
          align: "center",
          field: "NAME_CHAR",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "NOTE_BLOB",
          required: true,
          label: "Text",
          align: "center",
          field: "NOTE_BLOB",
          sortable: true,
          style: "width: 20px",
        },
        {
          name: "IMPORT_DATE",
          required: true,
          label: "Datum",
          align: "center",
          field: "IMPORT_DATE",
          sortable: true,
          style: "width: 20px",
        }
      ]
    };
  },

  mounted() {
    this.loadData(); //lade den Patienten
  },

  computed: {
    SELECTION() {
      return this.selected.length;
    },
  },

  methods: {
    loadData() {
      //load patients
      this.$store
        .dispatch("searchDB", {
          query_string: { NOTE_ID: 0, _greater: true, _view: true },
          table: "NOTE_FACT",
        })
        .then((res) => {
          this.results = res;
          this.selected = [];
        });
    },

    async saveNewNote(data) {
      this.show_new_patient = false
      const res = await this.$store.dispatch('addDB', { table: 'NOTE_FACT', query_string: data })
      this.loadData()
    },

    async deleteNote(data) {
      if (! await my_confirm(`Soll der Eintrag wirklich gelöscht werden?`)) return

      for (let d of data) {
        let res = await this.$store.dispatch('deleteDB', { table: 'NOTE_FACT', query_string: { NOTE_ID: d.NOTE_ID } })
      }

      this.$q.notify('Aktion erfolgreich')
      this.loadData()
    }
  },
};
</script>
