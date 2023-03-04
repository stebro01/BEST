<template>
  <q-card class="my-list-item" dense>
    <span v-if="!add_concept">
      <q-card-section>Suche nach Concepts: {{concept_search.table}}</q-card-section>
      <q-separator />
      <q-card-section v-if="!disable_search_box">
        <q-form
          @submit="submitSearchForm(concept_search_string, concept_search_group, concept_search)"
          @reset="resetForm()"
          class="q-gutter-md"
        >
          <q-input autofocus dense v-model="concept_search_string" input-class="text-center" filled type="search" label="Search" :rules="[val => (val && val.length > 0) || 'Please type something']">
            
            <template v-slot:append>
              <q-btn icon="search" flat @click="submitSearchForm(concept_search_string, concept_search_group, concept_search)"/>
              <q-btn icon="clear" flat @click="resetForm()"/>
            </template>
          </q-input>
          <q-option-group class="text-center text-concept" style="margin-top: -10px"
            v-model="concept_search_group"
            :options="concept_search.options"
            inline dense
          />
        </q-form>
      </q-card-section>
      <!-- results -->
      <q-card-section>
        <q-chip v-if="search_nothing_found" color="red" text-color="white" >nichts gefunden</q-chip>
        <q-chip v-else-if="search_toomuch_found" color="red" text-color="white" >zu viele Ergebnisse, Suche bitte einschränken </q-chip>
      
        <q-btn v-if="search_nothing_found" icon="add" flat rounded @click="addConcept()"><q-tooltip>Neu anlegen</q-tooltip></q-btn>
          <q-list v-if="(search_results && search_results.length>0)" bordered separator dense class="overflow-hidden ">
            <q-item-label header>Results ({{search_results.length}})</q-item-label>
            <q-scroll-area style="height: 230px; width: 100%;">
            <q-item v-for="(res, resind) in search_results" :key="resind + 'result'" clickable v-ripple 
            :class="{'bg-grey-4': resind === concept_selected.index}"
            @click="(concept_selected = {index: resind, value: res})"
            @dblclick="this.conceptSelect(concept_selected)"
            >
              <q-item-section >
                <!-- NAME  -->
                <q-item-label>{{res.NAME_CHAR}}</q-item-label>
                <!-- ID -->
                <q-item-label>ID: 
                    <span v-if="res.CONCEPT_CD">{{res.CONCEPT_CD}}</span>
                    <span v-else-if="res.PROVIDER_ID">{{res.PROVIDER_ID}}</span>
                    <span v-else-if="res.CODE_CD">{{res.CODE_CD}}</span>
                </q-item-label>
                <!-- PATH -->
                <q-item-label caption class="overflow-hidden my-card">
                  <span v-if="res.CONCEPT_PATH">{{res.CONCEPT_PATH}}</span>
                  <span v-else-if="res.PROVIDER_PATH">{{res.PROVIDER_PATH}}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption><span v-if="res.VALTYPE_CD">Type: {{res.VALTYPE_CD}}</span> <span v-if="res.UNIT">/ Unit: {{res.UNIT_CD}}</span></q-item-label>
                <q-item-label caption><span v-if="res.CONCEPT_BLOB">Blob: {{res.CONCEPT_BLOB}}</span></q-item-label>
                <q-item-label caption>{{res.SOURCESYSTEM_CD}}</q-item-label>
                
              </q-item-section>
              <q-tooltip>{{res}}</q-tooltip>
            </q-item>
            </q-scroll-area>
          </q-list>
          <div v-if="(search_results && search_results.length>0)" class="text-center text-caption">Doppelclick zur Auswahl</div>
      </q-card-section>
      <!-- ACTIONS -->
      <q-separator />
      <q-card-actions class="justify-between">
        <q-btn flat rounded @click="$emit('close')">beenden</q-btn>
        <q-btn v-if="concept_selected.value" flat rounded @click="conceptSelect(concept_selected)">übernehmen</q-btn>
        <q-btn v-else icon="delete" flat rounded @click="$emit('clear')"><q-tooltip>Setzt das Feld zurück</q-tooltip></q-btn>
      </q-card-actions>
    </span>
      <!-- ADD CONCEPT -->
      <q-card-section v-else>
        Concept hinzufügen
        <q-separator />
        <q-card-section>
          
          <q-form @submit.prevent.stop="saveNewConcept">
            <q-select dense type="text" v-model="add_concept_object.SOURCESYSTEM_CD" label="Datentyp (VALTYPE_CD)" :options="SOURCESYSTEM_CD_LIST" :rules="[val => !!val || 'Field is required']" @blur="updateCONCEPT_PATH()">
              <template v-slot:append> <q-icon name="info"><q-tooltip>[PFLICHTFELD] Code-System auswählen</q-tooltip> </q-icon></template>
            </q-select>
            <q-input dense type="text" v-model="add_concept_object.CONCEPT_PATH" label="Pfad (UID) (CONCEPT_PATH)" :rules="[val => !!val || 'Field is required']">
              <template v-slot:append> <q-icon name="info"><q-tooltip>[PFLICHTFELD und UID] z.B.: \SNOMED-CT\365860008</q-tooltip> </q-icon></template>
            </q-input>
            <q-input dense type="text" v-model="add_concept_object.CONCEPT_CD" label="Code (CONCEPT_CD)" :rules="[val => !!val || 'Field is required']">
              <template v-slot:append> <q-icon name="info"><q-tooltip>[PFLICHTFELD] z.B.: SCTID: 1148423001</q-tooltip> </q-icon></template>
            </q-input>
            <q-input dense type="text" v-model="add_concept_object.NAME_CHAR" label="Title (NAME_CHAR)" :rules="[val => !!val || 'Field is required']">
                <template v-slot:append> <q-icon name="info"><q-tooltip>[PFLICHTFELD] Dieser Title wird angezeigt, wenn die Eigenschaft ausgewählt wurde.</q-tooltip> </q-icon></template>
            </q-input>
            <q-select dense type="text" v-model="add_concept_object.VALTYPE_CD" label="Datentyp (VALTYPE_CD)" :options="OPTIONS_VALTYPE_CD" :rules="[val => !!val || 'Field is required']">
              <template v-slot:append> <q-icon name="info"><q-tooltip>[PFLICHTFELD] Datentyp auswählen</q-tooltip> </q-icon></template>
            </q-select>
            <q-input v-if="add_concept_object.VALTYPE_CD && add_concept_object.VALTYPE_CD.value === 'N'" dense type="text" v-model="add_concept_object.UNIT_CD" label="Einheit (UNIT_CD)">
                <template v-slot:append> <q-icon name="info"><q-tooltip>[OPTIONAL] z.B.: mmol/l</q-tooltip> </q-icon></template>
            </q-input>
            <q-input dense type="text" v-model="add_concept_object.CONCEPT_BLOB" label="Beschreibung (CONCEPT_BLOB)">
                <template v-slot:append> <q-icon name="info"><q-tooltip>[OPTIONAL] Detailierte Beschreibung</q-tooltip> </q-icon></template>
            </q-input>

            <div class="q-mt-md my-small-text">
              {{add_concept_object}}
            </div>

            <div class="row justify-between q-mt-md">
              <q-btn type="submit" icon="save" flat rounded/>
              <q-btn @click="closeAddConcept()" icon="close" flat rounded/>
            </div>
          </q-form>
        </q-card-section>
      </q-card-section>      
    </q-card>
   

</template>


<script>

export default {
    name: 'ConceptSelect',

    props: ['table', 'CONCEPT_CD'],

    data() {
    return {
      
      concept_search_string: '%',
      concept_search_group: 'NAME_CHAR',
      search_nothing_found: false,
      search_toomuch_found: false,
      search_results: [],
      concept_selected: {},
      disable_search_box: false,
      add_concept: false,
      add_concept_object: undefined,
      SOURCESYSTEM_CD_LIST: undefined,
      OPTIONS_VALTYPE_CD: undefined

    }},

    mounted() {
      if (this.CONCEPT_CD && this.CONCEPT_CD.label) this.concept_search_string = this.CONCEPT_CD.label
    },

    computed: {
      concept_search() {
        if (this.table === 'CONCEPT_DIMENSION') return {table: 'CONCEPT_DIMENSION', value: 'CODE_CD', label: 'NAME_CHAR', path: "CONCEPT_PATH", options: [{label: 'Name', value: 'NAME_CHAR'}, {label: 'Concept', value: 'CONCEPT_CD'}, {label: 'Pfad', value: 'CONCEPT_PATH'}]} 
        return undefined
      }
    },

    methods: {
      resetForm() {
        this.concept_search_string = undefined
        this.search_nothing_found = false
        this.search_toomuch_found = false
        this.search_results = []
        this.concept_selected = {}
      },

      conceptSelect(concept) {
        this.$emit('clicked', concept.value)
      },

      updateCONCEPT_PATH() {
        this.add_concept_object.CONCEPT_PATH = `\\${this.add_concept_object.SOURCESYSTEM_CD.value}\\`
        if (this.add_concept_object.CONCEPT_CD) {
          if (this.add_concept_object.CONCEPT_CD.indexOf(':') < 0) this.add_concept_object.CONCEPT_PATH +=  this.add_concept_object.CONCEPT_CD
          else {
            let stmp = this.add_concept_object.CONCEPT_CD.split(':')
            this.add_concept_object.CONCEPT_PATH += stmp[1]
          }
        }
      },

      submitSearchForm(search_string, search_group, search_concept) {
        if (!search_string || search_string === '') return
        this.search_nothing_found = false
        this.search_toomuch_found = false
        this.search_results = []
        this.concept_selected = {}
        //perform search
        this.$store.dispatch('searchDB', {"query_string":{[search_group]: search_string, _like: true},table: search_concept.table})
        .then(res => {
          if (res.length === 0) {this.search_nothing_found = true; return}
          else if (res.length > 100) {this.search_toomuch_found = true; return}
          else this.search_results = res
        })
      },

      addConcept() {
        this.add_concept = true
        this.add_concept_object = {}
        if (this.CONCEPT_CD) {
          this.add_concept_object.CONCEPT_CD = this.CONCEPT_CD.value
          this.add_concept_object.NAME_CHAR = this.CONCEPT_CD.label
        } else if (!this.add_concept_object.NAME_CHAR) this.add_concept_object.NAME_CHAR = this.search_string
        // load the SOURCESYSTEM_CDs
        if (this.SOURCESYSTEM_CD_LIST === undefined) this.$store.dispatch('getConceptList', '\\CONCEPT\\LA').then(res => this.SOURCESYSTEM_CD_LIST = res)
        if (this.OPTIONS_VALTYPE_CD === undefined) this.$store.dispatch('getCodeLookupList', {COLUMN_CD: 'VALTYPE_CD'}).then(res => this.OPTIONS_VALTYPE_CD = res)
      },

      closeAddConcept() {
        this.add_concept = false; 
        this.add_concept_object = undefined
      },

      saveNewConcept() {
        //remove empty elements and replace {value, label}
        Object.keys(this.add_concept_object).forEach(key => {
          if (this.add_concept_object[key] === undefined || this.add_concept_object[key] === null) delete this.add_concept_object[key]
          else if (this.add_concept_object[key].value) this.add_concept_object[key] = this.add_concept_object[key].value          
        })

        this.$store.dispatch('addDB', {query_string: this.add_concept_object, table: 'CONCEPT_DIMENSION'})
        .then(res => {
          this.closeAddConcept()
          this.$q.notify(`CONCEPT_CD hinzugefügt: ${JSON.stringify(res)}`)
        })
        .catch(err => this.$q.notify(err))
      }
    
    }


}
</script>