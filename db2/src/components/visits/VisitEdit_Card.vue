<template>
        <!-- results -->
    <div v-if="visit !== undefined" class="q-mt-xl">
      <q-markup-table flat bordered dense class="my-table">
      <thead >
       
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">{{visit.ENCOUNTER_NUM}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="text-weight-regular">
        <!-- STATUS -->
        <tr>
          <td class="text-center">Status</td>
          <td class="bg-grey-3 text-center"><RESOLVE_CONCEPT :item="visit.ACTIVE_STATUS_CD"/></td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="visit.ACTIVE_STATUS_CD" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_status" @blur="dataChanged()" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
        <!-- DATUM -->
        <tr>
          <td class="text-center">Datum</td>
          <td class="bg-grey-3 text-center">{{visit.START_DATE}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="visit.START_DATE" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
          </td>
        </tr>
        <!-- ENDE DATUM -->
        <tr>
          <td class="text-center">Ende</td>
          <td class="bg-grey-3 text-center">{{visit.END_DATE}}</td>
          <td class="cursor-pointer" ><q-icon size="xs" name="edit" />
                 <q-popup-edit v-model="visit.END_DATE" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus counter type="date" @keyup.enter="scope.set" @change="dataChanged()"/>
                </q-popup-edit>
          </td>
        </tr>
        <!-- LOCATION -->
        <tr>
          <td class="text-center">Ort</td>
          <td class="bg-grey-3 text-center">
            <span v-if="visit.LOCATION_CD && visit.LOCATION_CD.label">{{visit.LOCATION_CD.label}}</span>
            <span v-else>{{visit.LOCATION_CD}}</span>
          </td>
           <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="visit.LOCATION_CD" buttons v-slot="scope">
              <q-select dense v-model="scope.value" :options="options_location" @blur="dataChanged()" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
        <!-- INOUT -->
         <tr>
          <td class="text-center">INOUT</td>
          <td class="bg-grey-3 text-center">{{visit.INOUT_CD}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="visit.INOUT_CD" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
        <!-- BESCHREIBUNG -->
        <tr>
          <td class="text-center">Beschreibung</td>
          <td class="bg-grey-3 text-center">{{visit.VISIT_BLOB}}</td>
          <td class="cursor-pointer"><q-icon size="xs" name="edit" />
            <q-popup-edit v-model="visit.VISIT_BLOB" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter type="text" @keyup.enter="scope.set" @change="dataChanged()"/>
            </q-popup-edit>
          </td>
        </tr>
         
      </tbody>
    </q-markup-table>

      <!-- ACTION BUTTONS -->
      <BOTTOM_BUTTONS :show_back="true" :show_save="data_changed === true"
        @back="$emit('close')"
        @save="saveData()"
      />

    </div>
    
    

   

</template>


<script>

import {beautify_data} from 'src/tools/formatdata.js'
import RESOLVE_CONCEPT from 'src/components/elements/ResolveConcept.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
    name: 'VisitCard',

    props: ['item', 'title', 'mode'],

    components: {RESOLVE_CONCEPT, BOTTOM_BUTTONS},

    data() {
    return {
      visit: undefined,
      data_changed: false,
      options_location: [],
      options_status: []
    }},

    mounted() {
      if (!this.item) this.visit = undefined
      else this.loadData()
      
      
    },

    computed: {
     
    },

    methods: {
      dataChanged() {
        this.data_changed = true
      },

      loadData() {
        this.visit = JSON.parse(JSON.stringify(this.item))
        this.$store.dispatch('resolveCD', {"table":"VISIT_DIMENSION"}).then(res => {
          res.resolve.LOCATION_CD.forEach(location => {
            this.options_location.push({value: location.CODE_CD, label: location.NAME_CHAR})
            if (location.CODE_CD === this.visit.LOCATION_CD) this.visit.LOCATION_CD = {value: location.CODE_CD, label: location.NAME_CHAR}
          })
        })
        // resolve status
        this.$store.dispatch('getConceptList', '\\SNOMED-CT\\138875005\\362981000\\272099008\\106232001\\').then(res => {
          this.options_status = res
        })
        this.data_changed = false
      },

      saveData() {
        const data = beautify_data(this.visit)
        if (this.mode === 'new' && !data.ENCOUNTER_NUM) {
          this.$store.dispatch('addDB', {query_string: data, table:"VISIT_DIMENSION"})
          .then(res => {
            //get new visit
            this.visit.ENCOUNTER_NUM = res.ENCOUNTER_NUM
            this.$store.dispatch('searchDB', {query_string: res, table:"VISIT_DIMENSION"})
            .then(res_visit => {
              
              this.$store.commit('VISIT_PINNED_SET', res_visit[0])
              this.$q.notify('Speichern erfolgreich')
              this.data_changed = false
            })
          }).catch(err => this.$q.notify(err))

        } else {
          // UPDATE
          const where = {ENCOUNTER_NUM: data.ENCOUNTER_NUM}
          delete data.ENCOUNTER_NUM
          this.$store.dispatch('updateDB', {query_string: {where: where, set: data}, table:"VISIT_DIMENSION"})
          .then(res => {
            const new_visit = {...data, ENCOUNTER_NUM: where.ENCOUNTER_NUM}
            this.$store.commit('VISIT_PINNED_SET', new_visit)
            this.$q.notify('Speichern erfolgreich')
            this.data_changed = false
          }).catch(err => this.$q.notify(err))
        }

      }


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