<template>
  <div class="">
      <q-markup-table class="text-center my-table overflow-hidden">
        <thead>
          <tr style="height: 30px">
          <th colspan="5">
            <div class="row no-wrap items-center">
              <q-img
                :ratio="1"
                class="rounded-borders my-icon-size"
                src="~assets/detail_icon.png"
              />
              <div class="text-h6 q-ml-md ">{{title}}</div>
            </div>
          </th>
        </tr>

          <tr>
            <th>Eintrag</th>
            <th>Datentyp</th>
            <th>Wert</th>
            <th>Einheit</th>
            <th>Bemerkung</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(el, ind) in formData" :key="ind+'resolved'">
            <!-- NAME_CHAR -->
            <td v-if="formData[ind]">
              {{formData[ind].NAME_CHAR}} 
              <div v-if="formData[ind].CONCEPT_CD" class="my-small-text">CONCEPT_CD: {{formData[ind].CONCEPT_CD}}</div> 
              <div v-else-if="formData[ind].MODIFIER_CD" class="my-small-text">MODIFIER_CD: {{formData[ind].MODIFIER_CD}}</div> 
            </td>
            <!-- VALTYPE_CD -->
            <td v-if="formData[ind]">{{formData[ind].VALTYPE_CD}}</td>
            <!-- VALUE -->
            <td v-if="formData[ind]" class="cursor-pointer overflow-hidden text-caption" style="max-width: 100px">
              <!-- TYPE: N -->
              <span v-if="(formData[ind].VALTYPE_CD === 'N')">
                {{formData[ind].NVAL_NUM}}📝
                <q-popup-edit v-model="formData[ind].NVAL_NUM" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="number" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <!-- TYPE: T -->
              <span v-else-if="formData[ind].VALTYPE_CD === 'T'">
                {{formData[ind].TVAL_CHAR}}📝
                <q-popup-edit v-model="formData[ind].TVAL_CHAR" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <span v-else-if="formData[ind].VALTYPE_CD === 'D'">
                {{formData[ind].TVAL_CHAR}}📝
                <q-popup-edit v-model="formData[ind].TVAL_CHAR" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <!-- TYPE: S -->
              <span v-else-if="(formData[ind].VALTYPE_CD === 'S' || scheme.resolved[ind].selection) || formData[ind].VALTYPE_CD === 'F'">
                
                <!-- SCHEME.RESOLVED[INDEX].selection ist vorhanden > auswahl anzeigen -->
                <span v-if="formData[ind].VALTYPE_CD === 'F'">
                  <span v-if="formData[ind].TVAL_CHAR && formData[ind].TVAL_CHAR.label">{{formData[ind].TVAL_CHAR.label}}</span>
                  <span v-else>{{formData[ind].TVAL_CHAR}}</span>
                  📝
                  <q-popup-edit v-model="formData[ind].TVAL_CHAR" buttons auto-save v-slot="scope">
                    <q-select :options="optons_finding" dense v-model="scope.value" @blur="dataChanged()" @change="dataChanged()"/>
                  </q-popup-edit>
                </span>
                <span v-else-if="scheme.resolved[ind].selection">
                  <span v-if="formData[ind].TVAL_CHAR">
                    <!-- multi modus -->
                    <span v-if="Array.isArray(formData[ind].TVAL_CHAR)">
                      <div v-for="(val, ind) in formData[ind].TVAL_CHAR" :key="(ind+val.label)" class="my-small-text">{{val.label}}</div>
                    </span>
                    <!-- single modus -->
                    <span v-else>{{formData[ind].TVAL_CHAR.label}}</span>
                  </span> 📒
                 <q-popup-edit v-model="formData[ind].TVAL_CHAR" buttons auto-save v-slot="scope">
                    <q-select :multiple="scheme.resolved[ind].multiselection" dense v-model="scope.value" :options="options[ind]" @blur="dataChanged()" @change="dataChanged()"/>
                  </q-popup-edit>
                </span>
                <!-- SCHEME.RESOLVED[INDEX].selection nicht vorhanden > text eingeben -->
                <span v-else>
                  {{formData[ind].TVAL_CHAR}}📝
                  <q-popup-edit v-model="formData[ind].TVAL_CHAR" auto-save v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
                  </q-popup-edit>
                </span>
              </span>
            </td>

            <!-- UNIT_CD -->
            <td  v-if="formData[ind]">
              <span v-if="formData[ind].VALTYPE_CD === 'N'" class="cursor-pointer">
                {{formData[ind].UNIT_CD}}📝
                <q-popup-edit v-model="formData[ind].UNIT_CD" title="Bitte nur im Ausnahmefall ändern!" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
              </span>
              <span v-else>∅</span>
            </td>

            <!-- OBSERVATION_BLOB -->
            <td class="cursor-pointer" v-if="formData[ind]">
              {{formData[ind].OBSERVATION_BLOB}}📝
              <q-popup-edit v-model="formData[ind].OBSERVATION_BLOB" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
              </q-popup-edit>
              <q-tooltip v-if="longText(formData[ind].OBSERVATION_BLOB)">{{formData[ind].OBSERVATION_BLOB}}</q-tooltip>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

  </div>
</template>


<script>

export default {
    name: 'SchemeTable',

    props: ['scheme', 'title'],

    data() {
      return {
        formData: [],
        options: [],
        label: null,
        optons_finding: [
          {value: 'SCTID: 373066001', label: 'Yes'},
          {value: 'SCTID: 373067005', label: 'No'},
          {value: 'SCTID: 373068000', label: 'unknown'}
        ]
      }
    },

    mounted() {
      //prepare formData
      if (this.scheme.resolved) {
        this.formData = []
        this.options = []
        this.scheme.resolved.forEach(el => {
          this.formData.push({CONCEPT_CD: el.CONCEPT_CD, MODIFIER_CD: el.MODIFIER_CD, NAME_CHAR: el.NAME_CHAR, VALTYPE_CD: el.VALTYPE_CD, UNIT_CD: el.UNIT_CD, TVAL_CHAR: null, NVAL_NUM: null, OBSERVATION_BLOB: null})
          // PREPARE OPTIONS
          if (!el.selection) this.options.push({})
          else {
            const opt = []
            el.selection.forEach(o => {
              opt.push({label: o.NAME_CHAR, value: o.CONCEPT_CD})
            })
            this.options.push(opt)
          }
        })
      }
      
    },

    watch: {

    },  

    computed: {
     
    },

    methods: {
      longText(el) {
        if (!el) return false
        if (el.length > 10) return true
        return false
      },

      dataChanged() {
        this.$emit('changed', this.formData)
      }
    
    }


}
</script>