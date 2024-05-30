<template>
    <q-markup-table class=" text-center my-table overflow-hidden">
      <thead>

        <tr>
          <th >Untersucher <div class="my-small-text">POVIDER_ID</div></th>
          <th >Untersuchungsort <div class="my-small-text">LOCATION_CD</div></th>
          <th >Datum Untersuchung <div class="my-small-text">START_DATE</div></th>
          <th >Ende Untersuchung<div class="my-small-text">END_DATE</div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- PROVIDER -->
          <td class="cursor-pointer">
            <span v-if="typeof(formData.PROVIDER_ID) === 'object'" class="my-small-text">{{formData.PROVIDER_ID.label}}</span>
            <span v-else class="my-small-text">{{formData.PROVIDER_ID}}</span>
            <EDIT_ICON />
            <q-popup-edit v-model="formData.PROVIDER_ID" buttons auto-save v-slot="scope">
              <q-select dense v-model="scope.value" :options="options.PROVIDER_ID" @blur="dataChanged({PROVIDER_ID: scope.value})"/>
            </q-popup-edit>
          </td>
          <!-- LOCATION_CD -->
          <td class="cursor-pointer">
            <span v-if="typeof(formData.LOCATION_CD) === 'object'" class="my-small-text">{{formData.LOCATION_CD.label}}</span>
            <span v-else class="my-small-text">{{formData.LOCATION_CD}}</span>
            <EDIT_ICON />
            <q-popup-edit v-model="formData.LOCATION_CD" buttons auto-save v-slot="scope">
              <q-select dense v-model="scope.value" :options="options.LOCATION_CD" @blur="dataChanged({LOCATION_CD: scope.value})"/>
            </q-popup-edit>
          </td>
          <!-- START DATE -->
          <td class="cursor-pointer"> {{formData.START_DATE}}<EDIT_ICON />
            <q-popup-edit v-model="formData.START_DATE" auto-save buttons v-slot="scope">
              <q-input v-model="scope.value" dense  type="date" @keyup.enter="scope.set" @blur="dataChanged({START_DATE: scope.value})"/>
            </q-popup-edit>
          </td>
          <!-- END_DATE -->
          <td class="cursor-pointer">{{formData.END_DATE}}<EDIT_ICON />
            <q-popup-edit v-model="formData.END_DATE" auto-save buttons v-slot="scope">
              <q-input v-model="scope.value" dense  type="date" @keyup.enter="scope.set" @blur="dataChanged({END_DATE: scope.value})"/>
            </q-popup-edit>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
</template>


<script>

import EDIT_ICON from 'src/components/elements/EditIcon.vue'

export default {
    name: 'ObservationTable_Short',

    props: ['input_data', 'title'],

    components: {EDIT_ICON },

    data() {
      return {
        formData: {},
        options: {},
        label: null
      }
    },

    mounted() {
      //prepare formData
      // use input_data
      // console.log(this.input_data)
      if (this.input_data) this.formData = JSON.parse(JSON.stringify(this.input_data))
      else { //use globale settings instead
        if (this.$store.getters.VISIT_PINNED) {
        const VISIT = this.$store.getters.VISIT_PINNED
        if (VISIT.LOCATION_CD) this.formData.LOCATION_CD = VISIT.LOCATION_CD
        if (VISIT.START_DATE) this.formData.START_DATE = VISIT.START_DATE
        if (VISIT.END_DATE) this.formData.END_DATE = VISIT.END_DATE
        }
        if (this.$store.getters.PROVIDER_PINNED) {
          const PROVIDER = this.$store.getters.PROVIDER_PINNED
          if (PROVIDER.PROVIDER_ID) this.formData.PROVIDER_ID = PROVIDER.PROVIDER_ID
        }
        // this.$emit('changed', this.formData)
      }

      // prepare options
      this.$store.dispatch('searchDB', {query_string:{PROVIDER_PATH: 'U', _like: true},table: "PROVIDER_DIMENSION"})
      .then(res => {
        if (res) {
          const PROVIDER = []
          res.forEach(r => {
            PROVIDER.push({label: r.NAME_CHAR, value: r.PROVIDER_ID, description: r.CONCEPT_BLOB})
          })
          this.options.PROVIDER_ID = PROVIDER
        }
      })
      this.$store.dispatch('searchDB', {query_string:{COLUMN_CD: 'LOCATION_CD', _like: true},table: "CODE_LOOKUP"})
      .then(res => {
        if (res) {
          const LOCATION = []
          res.forEach(r => {
            LOCATION.push({label: r.NAME_CHAR, value: r.CODE_CD})
          })
          this.options.LOCATION_CD = LOCATION
        }
      })
    },

    watch: {

    },  

    computed: {
     
    },

    methods: {
      dataChanged(val) {
        if (val && val.LOCATION_CD) this.formData.LOCATION_CD = val.LOCATION_CD //damit daten sofort aktualisiert weitergeben werden
        if (val && val.PROVIDER_ID) this.formData.PROVIDER_ID = val.PROVIDER_ID
        if (val && val.START_DATE) this.formData.START_DATE = val.START_DATE
        if (val && val.END_DATE) this.formData.END_DATE = val.END_DATE
        this.$emit('changed', this.formData)
        
      }
    
    }


}
</script>