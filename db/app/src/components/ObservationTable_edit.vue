<template>
  <div class="row justify-center">
    <q-markup-table v-if="formData" class="text-center q-pa-md my-table" dense>
      <thead>
        <tr v-if="title">
          <th colspan="6">
            <div class="row no-wrap items-center">
              <q-img style="width: 70px" :ratio="1" class="rounded-borders" src="~assets/general_icon.png" />

              <div>
                <div class="text-h6 q-ml-md">{{ title }}</div>
                <div class="text-subtitle2 q-ml-md">Bearbeiten</div>
              </div>

            </div>
          </th>
        </tr>
        <tr>
          <th>Eintrag</th>
          <th>Datentyp</th>
          <th>Wert</th>
          <th>Einheit</th>
          <th>Bemerkung</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, ind) in formData" :key="ind + 'localForm'">
          <td class="my-cell-entry text-left">
            <VALUE_ITEM :value="item.CONCEPT_CD" :label="item.CONCEPT_NAME_CHAR" />
          </td>
          <td>{{ item.VALTYPE_CD }}
            <q-tooltip v-if="item.VALTYPE_CD === 'T'">Text (string)</q-tooltip>
            <q-tooltip v-else-if="item.VALTYPE_CD === 'N'">Zahl (numeric)</q-tooltip>
            <q-tooltip v-else-if="item.VALTYPE_CD === 'D'">Datum (date)</q-tooltip>
            <q-tooltip v-else-if="item.VALTYPE_CD === 'S'">Auswahl (selection)</q-tooltip>
            <q-tooltip v-else-if="item.VALTYPE_CD === 'F'">Finding (Merkmal vorhanden: yes, no, unknown)</q-tooltip>
            <q-tooltip v-else-if="item.VALTYPE_CD === 'R'">Rohdaten</q-tooltip>
          </td>
          <!-- VALUE -->
          <td>
            <q-tooltip>{{ item.TVAL_CHAR || item.NVAL_NUM}}</q-tooltip>
            <span v-if="item.VALTYPE_CD === 'N'"><CQL_CHECK :value=item.check />{{ item.NVAL_NUM }}
            <EDIT_ICON class="absolute-right q-mt-sm" />
            <q-popup-edit v-model="item.NVAL_NUM" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="number" @keyup.enter="scope.set"
                @change="dataChanged(ind, $event)" />
            </q-popup-edit>
            </span>
          <span v-else-if="item.VALTYPE_CD === 'D'"><CQL_CHECK :value=item.check />{{ item.TVAL_CHAR }}
            <EDIT_ICON class="absolute-right q-mt-sm" />
            <q-popup-edit v-model="item.TVAL_CHAR" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set"
                @change="dataChanged(ind)" />
            </q-popup-edit>
          </span>
          <span v-else-if="item.VALTYPE_CD === 'S' || item.VALTYPE_CD === 'F'" style="max-width: 200px; overflow: hidden">
            <VALUE_ITEM :value="item.TVAL_CHAR" :label="item.TVAL_RESOLVED" />
            <EDIT_ICON class="absolute-right q-mt-sm" />
            <POPUP_CONCEPT v-if="item" :item="item" :value_string="'TVAL_RESOLVED'" :concept_string="'CONCEPT_CD'"
              @update="item.TVAL_CHAR = $event.value; item.TVAL_RESOLVED = $event.label; dataChanged(ind)" />

          </span>
          <span v-else >
            <div style="max-width: 300px; overflow: hidden; box-sizing: border-box;">
              {{ item.TVAL_CHAR }}
            </div>
            <!-- <EDIT_ICON class="absolute-right q-mt-sm" />
            <q-popup-edit v-model="item.TVAL_CHAR" buttons="" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set"
                @change="dataChanged(ind, $event)" />
            </q-popup-edit> -->
          </span>
          </td>
          <!-- UNIT_CD -->
          <td>
            <span v-if="item.VALTYPE_CD === 'N'">{{ item.UNIT_CD }}
              <EDIT_ICON class="absolute-right q-mt-sm" />
              <q-popup-edit v-model="item.UNIT_CD" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set"
                  @change="dataChanged(ind, scope.value)" />
              </q-popup-edit>
            </span>
            <q-icon v-else name="block" />
          </td>
          <!-- OBSERVATION_BLOB -->
          <td class="my-cell-entry">
            <span v-if="item.CATEGORY_CHAR === 'surveyBEST'">
              <q-icon name="preview" class="cursor-pointer" @click="loadSurvey(item)"><q-tooltip>Vorschau</q-tooltip></q-icon> surveyBEST 
            </span>
            <span v-else-if="item.VALTYPE_CD === 'R'">
              <q-icon name="file_download" class="cursor-pointer" @click="show_data_explorer = true; show_data_explorer_item = item"><q-tooltip>Daten herunterladen</q-tooltip></q-icon>RAW
            </span>
            <span v-else>
              {{ item.OBSERVATION_BLOB }}
              <EDIT_ICON class="absolute-right q-mt-sm" />
              <q-popup-edit v-model="item.OBSERVATION_BLOB" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set"
                  @blur="dataChanged()" @change="dataChanged()" />
              </q-popup-edit>
              <q-tooltip v-if="item.OBSERVATION_BLOB && item.OBSERVATION_BLOB.length > 20">{{ item.OBSERVATION_BLOB
              }}</q-tooltip>
            </span>
          </td>
          <!-- DATE -->
          <td class="my-cell-entry">
            <!-- START DATE -->
            <span class="cursor-pointer">{{ item.START_DATE }}
              <q-popup-edit v-model="item.START_DATE" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set"
                  @blur="dataChanged()" @change="dataChanged()" />
              </q-popup-edit>
            </span> 
            <!-- END DATE? -->
            <span v-if="item.END_DATE">
            / {{ item.END_DATE }}
            </span>
          </td>
        </tr>
      </tbody>
    </q-markup-table>​

    <div class="my-table my-small-text">
      <q-icon v-if="!show_import_details" name="info" @click="show_import_details = true" class="cursor-pointer" />
      <span v-else><q-icon name="close" @click="show_import_details = false" class="cursor-pointer" />{{ formData }}
      </span>
    </div>

    <!-- SELECT A FOLDER -->
    <q-dialog v-model="show_data_explorer">
        <SELECT_FOLDER v-if="show_data_explorer" :label="'Ordner zum Speichern auswählen'" :root_dir="last_selected_folder" 
          @close="show_data_explorer = false; show_data_explorer_item = undefined"
          @save="downloadRAW($event, show_data_explorer_item)"
        />
    </q-dialog>

  </div>
</template>

<script>

import VALUE_ITEM from 'src/components/elements/ValueItem.vue'
import EDIT_ICON from 'src/components/elements/EditIcon.vue'
import POPUP_CONCEPT from 'src/components/elements/PopupConcept.vue'
import CQL_CHECK from "./cql/CQLCheck.vue";
import SELECT_FOLDER from 'src/components/elements/SelectFolder.vue'

export default {
  name: 'ObservationTable',

  props: ['input_data', 'title'],

  components: { VALUE_ITEM, EDIT_ICON, POPUP_CONCEPT, CQL_CHECK, SELECT_FOLDER },

  data() {
    return {
      formData: undefined,
      options: {},
      label: null,
      edit_concept: undefined,
      show_import_details: false,
      preview_survey_best_show: false,
      preview_survey_best_item: undefined,
      show_data_explorer: false,
      show_data_explorer_item: undefined,
      last_selected_folder: undefined,

    }
  },

  mounted() {
    //prepare formData
    // use input_data

    if (this.input_data) {
      this.formData = JSON.parse(JSON.stringify(this.input_data))
      for (let i = 0; i < this.formData.length; i++) this.checkData(i)
    }

  },

  watch: {

  },

  computed: {

  },

  methods: {
    dataChanged(ind, val) {
      this.$emit('changed', this.formData)
      if (ind !== undefined) this.checkData(ind, val)
    },

    async checkData(ind, val) {
      if (val !== undefined) { //das ist etwas eckig, aber durch den Popup-Proxy muss ich die Aenderung des Feldes manuell weiterreichen
        if (this.formData[ind].VALTYPE_CD === 'N') {
          if (typeof(val) === 'string') val = parseInt(val)
          this.formData[ind].NVAL_NUM = val
        }
        else this.formData[ind].TVAL_CHAR = val
      }
      this.formData[ind].check = await this.$store.dispatch('checkCQLRule', this.formData[ind])
    },

    loadSurvey(item) {
      this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: item.OBSERVATION_ID, _columns: ['OBSERVATION_BLOB'] } })
        .then(res => this.$emit('previewSurvey', res[0].OBSERVATION_BLOB))
    },

    downloadRAW(folder, item) {
      this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: item.OBSERVATION_ID, _columns: ['OBSERVATION_BLOB', 'TVAL_CHAR'] } })
        .then(res => {
          const TMP_JSON = JSON.parse(res[0].TVAL_CHAR)
          const payload = {
            filename: TMP_JSON.filename,
            dir: folder,
            buffer: res[0].OBSERVATION_BLOB
          }
          this.$store.dispatch('exportRAWdata_to_file', payload)
          .then(res => {
            this.$q.notify({
              message: `Datei erfolgreich gespeichert: ${payload.dir}/${payload.filename}`,
              color: 'positive',
              icon: 'cloud_done',
            })
          })
        })
        // CLOSE EVERYTING
        this.last_selected_folder = folder
        this.show_data_explorer = false
        this.show_data_explorer_item = undefined
    }

    // ENDE METHODS
  }


}
</script>
