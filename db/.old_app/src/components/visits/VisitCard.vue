<template>
        <!-- results -->
    <div v-if="visit !== undefined" class="q-mt-xl">
      <q-markup-table flat bordered dense class="my-table">
      <thead >
        <tr>
          <th colspan="6">
            <div class="row no-wrap items-center">
              <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="~assets/visit-color-logo.png"
              />

              <div>
                <div class="text-h6 q-ml-md">Visite</div>
                <div class="text-subtitle2 q-ml-md">Bearbeiten und Anzeigen</div>
              </div>

            </div>
          </th>
        </tr>
        <tr>
          
          <th class="text-center">Status</th>
          <th class="text-center">Datum</th>
          <th class="text-center">Ort</th>
          <th class="text-center">Ende</th>
          <th class="text-center">Beschreibung</th>
          <th class="text-center" style="width: 10px"></th>
          <th class="text-center" style="width: 10px"></th>
        </tr>
      </thead>
      <tbody class="text-weight-regular">
        <tr>
          <th class="text-center"><VALUE_ITEM :item="visit.ACTIVE_STATUS_CD"/> </th>
          <th class="text-center" >{{visit.START_DATE}}</th>
          <th class="text-center overflow-hidden" style="max-width: 150px">{{visit.LOCATION_CD}}<q-tooltip v-if="visit.LOCATION_CD">{{visit.LOCATION_CD}}</q-tooltip></th>
          <th class="text-center">{{visit.END_DATE}}</th>
          <th class="text-center overflow-hidden" style="max-width: 150px">{{visit.VISIT_BLOB}}<q-tooltip v-if="visit.VISIT_BLOB">{{visit.VISIT_BLOB}}</q-tooltip></th>
          <th class="text-center cursor-pointer" @click="$emit('edit_clicked')"><q-icon class="q-ml-sm" size="xs" name="edit" /></th>
          <th class="text-center cursor-pointer" @click="$emit('delete_clicked')"><q-icon class="q-ml-sm" size="xs" name="delete" /></th>
        </tr>
         
      </tbody>
    </q-markup-table>
    </div>
    
    <!-- ACTION BUTTONS -->
    

   

</template>


<script>
import myMixins from 'src/mixins/modes_VisitCard'
import VALUE_ITEM from 'src/components/elements/ValueItem.vue'


export default {
    name: 'VisitCard',
    mixins: [myMixins], //imports: searchPatient & deleteItem

    props: ['item', 'VISIT_RESOLVED'],

    components: {VALUE_ITEM},

    data() {
    return {
      visit: undefined,
    }},

    mounted() {
      if (!this.item) this.visit = undefined
      else {
        this.visit = JSON.parse(JSON.stringify(this.item))        
        this.$store.dispatch('resolveCD', {"table":"VISIT_DIMENSION"}).then(res => {
          res.resolve.LOCATION_CD.forEach(location => {
            if (location.CODE_CD === this.visit.LOCATION_CD) this.visit.LOCATION_CD = location.NAME_CHAR
          })
        })
      }
      
      
    },

    computed: {
     
    },

    methods: {

      /**
       * IMPORTED from MIXINS
       * - notPrimaryKey(el)
       * - typeOfEl(el) 
       * - isResolveScheme(el)
       * - getResolvedValue(element, value)
       * - deleteData(item)
       */

    
    }


}
</script>