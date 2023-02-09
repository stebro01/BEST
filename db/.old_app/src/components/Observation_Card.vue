<template>
    <div class="justify-center">
      
      <q-table v-if="this.rows"
        :rows="rows"
        :columns="columns"
        row-key="OBSERVATION_ID"
        class="cursor-pointer my-table"
        dense
      >

      <template v-slot:top>
        <q-list style="width: 100%">
        <q-item >
            <q-item-section avatar>
                <img src="~assets/general_icon.png" class="my-icon-size">
            </q-item-section>
            <q-item-section class="text-left q-ml-lg">
              <q-item-label class="text-h6">Observation</q-item-label>
              <q-item-label class="text-subtitle2">klinische Beobachtung</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-btn icon="add" no-caps flat rounded label="neue Observation" @click="this.$emit('addRow')" />
            <q-btn icon="add" no-caps flat rounded label="neue Studie/Scheme" @click="this.$router.push({name:'Scheme_Edit'})" />
            <q-btn icon="add" no-caps flat rounded label="importieren" @click="this.$router.push({name:'Observation_Import'})" />
          </q-item>
        </q-list>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="el in Object.keys(rows[0])" :key="el" :props="props"  @click="clickRow(props.row)">
            <!-- ANZEIGE IM TABLE -->
            <span v-if="!isResolveScheme(el)" >
                <span v-if="!notPrimaryKey(el)"> 🔑</span>
                {{ props.row[el] }} 
            </span>
            <span v-else-if="props.row[el]"> {{getResolvedValue(el, props.row[el])}}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    
    <!-- ENDE -->
    </div>
   

</template>


<script>
import myMixins from 'src/mixins/modes_VisitCard'

export default {
    name: 'Observation Card',
    mixins: [myMixins], //imports: searchPatient & deleteItem

    data() {
    return {
      SCHEME: undefined,
      RESOLVE: undefined,
      rows: undefined,
      columns: [
        // { name: 'OBSERVATION_ID', align: 'center', label: 'ID', field: 'OBSERVATION_ID',sortable: true },
        { name: 'CONCEPT_CD', align: 'center', label: 'CONCEPT_CD', field: 'CONCEPT_CD', sortable: true },
        { name: 'PROVIDER_ID', align: 'center', label: 'Untersucher', field: 'PROVIDER_ID', sortable: true },
        { name: 'START_DATE', align: 'center', label: 'Datum', field: 'START_DATE', sortable: true },
        { name: 'MODIFIER_CD', align: 'center', label: 'MODIFIER_CD', field: 'MODIFIER_CD', sortable: true },
        { name: 'VALTYPE_CD', align: 'center', label: 'type', field: 'VALTYPE_CD', sortable: true },
        { name: 'TVAL_CHAR', align: 'center', label: 'string', field: 'TVAL_CHAR', sortable: true, classes: 'overflow-hidden', style: 'max-width: 200px' },
        { name: 'NVAL_NUM', align: 'center', label: 'number', field: 'NVAL_NUM', sortable: true },
        { name: 'END_DATE', align: 'center', label: 'Ende', field: 'END_DATE', sortable: true },
        { name: 'LOCATION_CD', align: 'center', label: 'Ort', field: 'LOCATION_CD', sortable: true },

      ]
    }},

    mounted() {
      if (!this.$store.getters.VISIT_PINNED) return
      this.$store.dispatch('resolveCD', {"table":"OBSERVATION_FACT"}).then(res => {  
        this.SCHEME = res.scheme
        this.RESOLVE = res.resolve
        this.loadVisit()
      })
      
    },

    computed: {
     
    },

    methods: {
      // load data()
      async loadVisit()  {        
        this.rows = []
        if (!this.$store.getters.VISIT_PINNED) return
        this.$store.dispatch('searchDB', {query_string:{ENCOUNTER_NUM: this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM}, table: "OBSERVATION_FACT"})
        .then(res => {
          res.forEach(row => {
            let DATA = {}
            Object.keys(row).forEach(el => {
              if (!this.SCHEME._PRIVATE.includes(el)) {
                DATA[el] = row[el]
              }
            })
            this.rows.push(DATA)
          })
        })
        .finally(res => {
          //try to resolve some fields
          for (let i = 0; i<this.rows.length; i++){
            let item = this.rows[i]
            if (item.CONCEPT_CD) {
              this.$store.dispatch('searchDB', {query_string:{CONCEPT_CD: item.CONCEPT_CD}, table: "CONCEPT_DIMENSION"})
              .then(res => {
                if (res.length>0) this.rows[i].CONCEPT_CD = res[0].NAME_CHAR
              })
            } 
            
            if (item.PROVIDER_ID) {
              this.$store.dispatch('searchDB', {query_string:{PROVIDER_ID: item.PROVIDER_ID}, table: "PROVIDER_DIMENSION"})
              .then(res => {
                if (res.length>0) this.rows[i].PROVIDER_ID = res[0].NAME_CHAR
              })
            }
          }
        })
        
      },

      clickRow(el) {
        if (!el) return undefined
        this.$emit("rowClicked", el)

      },

      /**
       * IMPORTED FUNCTIONS FROM MIXINS
       * - notPrimaryKey(el)
       * - typeOfEl(el)
       * - isResolveScheme(el)
       * - getConcept(el)
       * - getResolvedValue(element, value)
       */
      

      
    }


}
</script>