<template>
  <div class="row justify-center">
  <q-markup-table v-if="formData" class="text-center q-pa-md my-table" dense>
        <thead>
          <tr v-if="title">
          <th colspan="6">
            <div class="row no-wrap items-center">
              <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="~assets/general_icon.png"
              />

              <div>
                <div class="text-h6 q-ml-md">{{title}}</div>
                <div class="text-subtitle2 q-ml-md">Bearbeiten</div>
              </div>

            </div>
          </th>
        </tr>
          <tr>
            <th>Eintrag</th>
            <th>Datentyp</th>
            <th>Wert</th>
            <th >Einheit</th>
            <th>Bemerkung</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="(item, ind) in formData" :key="ind + 'localForm'" >
            <td class="my-cell-entry text-left cursor-pointer" @click="editConcept(item, ind)">
              <VALUE_ITEM :value="item.CONCEPT_CD" :label="item.CONCEPT_NAME_CHAR"/> 
              <EDIT_ICON class="absolute-right bg-white q-mt-sm"/>
            </td>
            <td >{{item.VALTYPE_CD}}
              <q-tooltip v-if="item.VALTYPE_CD === 'T'">Text (string)</q-tooltip>
              <q-tooltip v-else-if="item.VALTYPE_CD === 'N'">Zahl (numeric)</q-tooltip>
              <q-tooltip v-else-if="item.VALTYPE_CD === 'D'">Datum (date)</q-tooltip>
              <q-tooltip v-else-if="item.VALTYPE_CD === 'S'">Auswahl (selection)</q-tooltip>
              <q-tooltip v-else-if="item.VALTYPE_CD === 'F'">Finding (Merkmal vorhanden: yes, no, unknown)</q-tooltip>
            </td>
            <!-- VALUE -->
            <td v-if="item.VALTYPE_CD === 'N'">{{item.NVAL_NUM}} <EDIT_ICON class="absolute-right q-mt-sm"/>
                <q-popup-edit v-model="item.NVAL_NUM" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="number" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
            </td>
            <td v-else-if="item.VALTYPE_CD === 'D'">{{item.TVAL_CHAR}} <EDIT_ICON class="absolute-right q-mt-sm"/>
                <q-popup-edit v-model="item.TVAL_CHAR" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
            </td>
            <td v-else-if="item.VALTYPE_CD === 'S' || item.VALTYPE_CD === 'F'" style="max-width: 200px; overflow: hidden">
              <VALUE_ITEM :value="item.TVAL_CHAR" :label="item.TVAL_RESOLVED"/><EDIT_ICON class="absolute-right q-mt-sm"/>
              <POPUP_CONCEPT v-if="item" :item="item" :value_string="'TVAL_RESOLVED'" :concept_string="'CONCEPT_CD'" 
                @update="item.TVAL_CHAR = $event.value; item.TVAL_RESOLVED = $event.label; dataChanged()"
              />
                
            </td>
            <td v-else style="max-width: 200px; overflow: hidden">{{item.TVAL_CHAR}} <EDIT_ICON class="absolute-right q-mt-sm" />
                <q-popup-edit v-model="item.TVAL_CHAR" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
            </td>
            <!-- UNIT_CD -->
            <td >
              <span v-if="item.VALTYPE_CD === 'N'" >{{item.UNIT_CD}} <EDIT_ICON class="absolute-right q-mt-sm"/>
                <q-popup-edit v-model="item.UNIT_CD" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <q-icon v-else name="block"/>
            </td>
            <!-- OBSERVATION -->
            <td class="my-cell-entry">
              <span v-if="item.OBSERVATION_BLOB && item.OBSERVATION_BLOB.indexOf('resourceType') > 0">
                surveyBEST <q-icon name="preview" class="cursor-pointer" @click="previewSurveyBest(item.OBSERVATION_BLOB)"/>
              </span>
              <span v-else>
              {{item.OBSERVATION_BLOB}} <EDIT_ICON class="absolute-right q-mt-sm"/>
              <q-popup-edit v-model="item.OBSERVATION_BLOB" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @blur="dataChanged()" @change="dataChanged()"/>
              </q-popup-edit>
              <q-tooltip v-if="item.OBSERVATION_BLOB && item.OBSERVATION_BLOB.length > 20">{{item.OBSERVATION_BLOB}}</q-tooltip>
            </span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="my-table my-small-text">
        <q-icon v-if="!show_import_details" name="info" @click="show_import_details = true" class="cursor-pointer"/>
        <span v-else><q-icon name="close" @click="show_import_details = false" class="cursor-pointer"/>{{ formData }} 
        </span>
      </div>

    <!-- CONCEPT DIALOG -->
    <q-dialog v-model="show_concept_dialog" style="max-height: 100%">
      <CONCEPT_SELECTION @close="(show_concept_dialog = false); edit_concept = undefined" @clear="clearConcept()" @clicked="conceptSelected($event)" :table="edit_concept.table" :CONCEPT_CD="edit_concept.item.CONCEPT_CD"/>>
    </q-dialog>


    <div v-if="preview_survey_best_item" class="row justify-center" style="max-width: 90%" id="mySurveyDIV">
    <div class="col-12 overflow-hidden" >
      <q-icon class="float-right z-top cursor-pointer" @click="printDiv('mySurveyDIV')" name="picture_as_pdf" size="md" />
      <q-card class="q-ma-md">
        <!-- SUMMARY -->
        <q-card-section v-if="preview_survey_best_item.SUMMARY">
          <q-item-label v-for="(item, ind) in Object.keys(preview_survey_best_item.SUMMARY)" :key="ind + 'summary'"
            :class="{'text-h6': ind === 0, 'text-right': ind > 0}"
          >
            {{ preview_survey_best_item.SUMMARY[item].label }} {{ preview_survey_best_item.SUMMARY[item].value }}
          </q-item-label>
        </q-card-section>
        <!-- DESCRIPTION -->
        <div class="row">
          <div class="col-6">
        <q-card-section v-if="preview_survey_best_item.DESCRIPTION">
          <q-item-label v-for="(item, ind) in Object.keys(preview_survey_best_item.DESCRIPTION)" :key="ind + 'DESCRIPTION'">
            {{ preview_survey_best_item.DESCRIPTION[item].label }} {{ preview_survey_best_item.DESCRIPTION[item].value }}
          </q-item-label>
        </q-card-section>
      </div>
        <!-- SUBJECT -->
        <div class="col-6">
        <q-card-section v-if="preview_survey_best_item.SUBJECT">
          <q-item-label v-for="(item, ind) in Object.keys(preview_survey_best_item.SUBJECT)" :key="ind + 'SUBJECT'"
           :class="{'text-bold': preview_survey_best_item.SUBJECT[item].label === 'Subject:'}"
          >
            {{ preview_survey_best_item.SUBJECT[item].label }} {{ preview_survey_best_item.SUBJECT[item].value }}
          </q-item-label>
        </q-card-section>
      </div>
      </div>
        <!-- RESULTS -->
        <q-card-section v-if="preview_survey_best_item.RESULTS">
          <q-table  hide-header hide-bottom grid dense :rows="preview_survey_best_item.RESULTS.filter(el => el.label !== 'PID' && el.label !== 'quest' && el.label !== 'date')"
          :rows-per-page-options="[100]"
          >
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3">
                <q-card dense :class="{'text-bold': props.row.label === 'sum'}">
                  <q-card-section class="text-center q-pa-none overflow-hidden">
                    {{props.row.label}}
                    
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
        <q-card-section v-if="preview_survey_best_item.EVALUATION" class="text-bold">
          <q-item-label v-for="(item, ind) in Object.keys(preview_survey_best_item.EVALUATION)" :key="ind + 'EVALUATION'">
            {{ preview_survey_best_item.EVALUATION[item].label }}: {{ preview_survey_best_item.EVALUATION[item].value }}
          </q-item-label>
        </q-card-section>
        
      </q-card>
    </div>
    <div class="col-12 text-center q-mt-xl">
      Dies ist ein digital erzeugtes Dokument das konform ist nach HL7 Standard (v.2019)
    </div>
    </div>
  </div>
</template>

<script>

import VALUE_ITEM from 'src/components/elements/ValueItem.vue'
import EDIT_ICON from 'src/components/elements/EditIcon.vue'
import CONCEPT_SELECTION from 'src/components/elements/ConceptSelect.vue'
import POPUP_CONCEPT from 'src/components/elements/PopupConcept.vue'

import html2pdf from "html2pdf.js"

export default {
    name: 'ObservationTable',

    props: ['input_data', 'title'],

    components: {VALUE_ITEM, EDIT_ICON, CONCEPT_SELECTION, POPUP_CONCEPT },

    data() {
      return {
        formData: undefined,
        options: {},
        label: null,
        show_concept_dialog: false,
        edit_concept: undefined,
        show_import_details: false,
        preview_survey_best_show: false,
        preview_survey_best_item: undefined,
        
      }
    },

    mounted() {
      //prepare formData
      // use input_data
    
      if (this.input_data) {
        this.formData = JSON.parse(JSON.stringify(this.input_data))
        
      }
      
    },

    watch: {

    },  

    computed: {
     
    },

    methods: {
      dataChanged() {
        this.$emit('changed', this.formData)
      },

      editConcept(item, ind) {
        this.edit_concept = {item: item, ind: ind, table: 'CONCEPT_DIMENSION'}
        this.show_concept_dialog = true
      },

      clearConcept() {
        this.show_concept_dialog = false
        this.edit_concept = undefined
        this.$q.notify('Nicht unterstützt in dieser Ansicht')
      },

      conceptSelected(CONCEPT) {
        if (!CONCEPT || !CONCEPT.CONCEPT_CD) this.$q.notify('Etwas ging schief: <conceptSelected>')
        this.formData[this.edit_concept.ind].CONCEPT_CD = CONCEPT.CONCEPT_CD
        this.formData[this.edit_concept.ind].CONCEPT_NAME_CHAR = CONCEPT.NAME_CHAR

        this.formData[this.edit_concept.ind].VALTYPE_CD = CONCEPT.VALTYPE_CD
        if (CONCEPT.VALTYPE_CD === 'N') {
          this.formData[this.edit_concept.ind].TVAL_CHAR = undefined
          if (CONCEPT.UNIT_CD) this.formData[this.edit_concept.ind].UNIT_CD = CONCEPT.UNIT_CD
        } else {
          this.formData[this.edit_concept.ind].NVAL_NUM = undefined
          this.formData[this.edit_concept.ind].UNIT_CD = undefined
        }
        this.$emit('changed', this.formData)

        //reset the form
        this.edit_concept = undefined
        this.show_concept_dialog = false
      },

      previewSurveyBest(val) {
        // this.preview_survey_best_show = true
        val = val.replace(/'/g, '"')
        val = val.replace(/\\"/g, '\'')
        val = val.replace(/\\/g, '_')   
        val = JSON.parse(val)     
        if (val.text)this.preview_survey_best_item = this.prepare_data_survey(val.text.div)
        else this.preview_survey_best_item = undefined
      },

      prepare_data_survey(val) {
        // CREATE AN ELEMENT
        var div = document.createElement('div');
        div.innerHTML = val.trim();
        var div2 = div.children[0]
        
        // SUMMARY
        const SUMMARY = this._extract_div(div2, 'summary_table', 'row')

        // DESCRIPTION
        const DESCRIPTION = this._extract_div(div2, 'description_table', 'row')

        // SUBJECT
        const SUBJECT = this._extract_div(div2, 'subjects_table', 'row')

        // RESULTS
        const RESULTS = this._extract_div(div2, 'results_table', 'col')

        // EVALUATION
        const EVALUATION = this._extract_div(div2, 'evaluation_div', 'div')

        return  {SUMMARY, DESCRIPTION, SUBJECT, RESULTS, EVALUATION}
      },

      _extract_div(div, id, mode) {
        var div_results = undefined
        for (let d of div.children) {
          if (d.getAttribute('id') === id) div_results = d
        }
        if (!div_results) return undefined
        // 
        var tbody = div_results.children[0]
        const RESULTS = []

        // MODE COL
        if (mode === 'col') {
          var trow1 = tbody.children[0]
          var trow2 = tbody.children[1]

          // console.log(trow1.children.length)
          for (let i = 0; i < trow1.children.length; i++) {
            RESULTS.push({label: trow1.children[i].innerHTML, value: trow2.children[i].innerHTML})
          }
        } else if (mode === 'row') 
        {  
          for (let i = 0; i < tbody.children.length; i++) {
            let tr = tbody.children[i]
            RESULTS.push({label: tr.children[0].innerHTML, value: tr.children[1].innerHTML})
          }
        } else if (mode === 'div') {
          RESULTS.push({label: 'Evaluation', value: div_results.innerHTML})
        }

        return RESULTS

      },

      printDiv(val) {
        console.log(val)
        var div = document.getElementById(val)
        console.log(this.preview_survey_best_item)
        const filename = `${this.preview_survey_best_item.RESULTS[0].value}_${this.preview_survey_best_item.RESULTS[1].value}.pdf`
        html2pdf(div, {margin: 1, filename: filename})
      }
    
    }


}
</script>
