<template>
 

    <!-- CQL BUILD RULE -->
    <div class="row justify-center" v-if="localData">
      <q-card class="q-mb-xl">
        <q-card-section class="q-pa-none text-center text-caption bg-grey-3">Erstelle/Bearbeite eine CQL Regel <span >: CQL_ID = {{ localData.CQL_ID }}</span></q-card-section>
        <q-card-section  class="text-center">
          <q-btn  v-if="localData._changed || !localData.JSON_CHAR" class="absolute-top-right q-mt-xs q-mr-xs" round icon="refresh"
            @click="queryAPI()"><q-tooltip>API (localhost:8082) abfragen und aus CQL -> JSON
              erzeugen</q-tooltip></q-btn>
          <q-btn-group push>
            <q-btn push label="CQL" :class="{ 'bg-grey-3': parameter_mode === 'CQL_CHAR' }"
              @click="parameter_mode = 'CQL_CHAR'" />
            <q-btn push label="JSON/EML" :class="{ 'bg-grey-3': parameter_mode === 'JSON_CHAR' }"
              @click="parameter_mode = 'JSON_CHAR'" />
          </q-btn-group>
          <div><q-input v-model="localData[parameter_mode]" type="textarea" filled input-class="my-code"
              :readonly="parameter_mode === 'JSON_CHAR'" lazy-rules @blur="localData._changed = true; this.$emit('changed', localData)"></q-input>
          </div>
        </q-card-section>


        <q-separator />
        <!-- DATEN TESTEN -->
        <div class="">
          <q-card-actions align="center">
            <q-btn  @click="execCQL()" rounded class="my-btn" no-caps>Ausführen
              <q-tooltip>Test die CQL Regel (JSON/EML) anhand der Parameter und gibt das Ergebnis aus.</q-tooltip>
            </q-btn>

          </q-card-actions>
          <q-card-section class="q-pa-none">
            <div class="text-center text-caption bg-grey-3">Parameter</div>
            <q-markup-table dense>
              <thead>
                <tr>
                  <td>Nr.</td>
                  <td>Wert</td>
                  <td>Typ</td>
                  <td style="max-width: 100px">Ergebnis CQL</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, ind) in parameter_value" :key="ind + 'param'">
                  <td>{{ ind+ 1}}</td>
                  <td><q-input dense v-if="item.type === 'number'" filled v-model.number="item.value"
                      :type="item.type" input-class="text-center" />
                    <q-input dense v-else filled v-model="item.value" :type="item.type"
                      input-class="text-center" />
                  </td>
                  <td><q-btn-dropdown split :label="item.type" no-caps style="width: 120px">
                      <q-list>
                        <q-item clickable v-close-popup @click="item.type = item_type.value"
                          v-for="(item_type, ind_type) in parameter_type" :key="ind_type + 'type'">
                          <q-item-section>{{ item_type.label }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown></td>
                  <td style="max-width: 100px; overflow: hidden" class="text-center"><span v-if="item.result">
                    <span v-if="item.result.check">✅</span><span v-else>❌</span>
                      <q-tooltip >{{
                    item.result.data
                  }}</q-tooltip>
                  </span></td>
                </tr>
              </tbody>

            </q-markup-table>
          </q-card-section>
        </div>
      </q-card>
    </div>

</template>

<script>

export default {
  name: 'Card_CQL_rules',

  props: ['selected_data'],

  components: {  },

  data() {
    return {
      localData: undefined,
      parameter_type: [{ value: 'number', label: 'Zahl' }, { value: 'date', label: 'Datum' }, { value: 'string', label: 'Text' }],
      parameter_value: [{ value: 12, type: 'number', result: null }, { value: '10', type: 'string', result: null }, { value: '2010-10-10', type: 'date', result: null }],
      parameter_mode: 'CQL_CHAR'
    }
  },

  mounted() {
    if (this.selected_data) this.localData = JSON.parse(JSON.stringify(this.selected_data))
  },

  watch: {
    selected_data(val) {
      if (val) this.localData = JSON.parse(JSON.stringify(val))
      this.parameter_value.forEach(p => p.result = undefined)
    }

  },

  computed: {

  },

  methods: {
   
    
    resetParam() {
      this.parameter_value.forEach(p => p.result = undefined)
    },

    async execCQL() {

      const lib = JSON.parse(this.localData.JSON_CHAR)
      for (let item of this.parameter_value) {
        let res = await this.$store.dispatch('execCQL', { parameters: { VALUE: item.value }, lib })
        item.result = {}
        if (!res.status) {
          item.result.data = res.error
          item.result.check = false
        }
        else {
          item.result = res.data
          console.log(JSON.stringify(res))
        }
      }

      return
    },

    async queryAPI() {
      const cql_lib = this.localData.CQL_CHAR
      if (!cql_lib || typeof (cql_lib) !== 'string' || cql_lib.length < 1) return this.$q.notify('CQL_CHAR invalid')
      const res = await this.$store.dispatch('query_CQLAPI', { cql: cql_lib })
      if (!res.status) {
        if (res.error.message) return this.$q.notify(res.error.message)
        else return this.$q.notify(res.error)
      }
      // else
      if (this.localData.JSON_CHAR !== JSON.stringify(res.data)) {
        this.localData.JSON_CHAR = JSON.stringify(res.data)
        this.localData._changed = true
        this.$q.notify('JSON/EML wurde geupdated.')
        this.resetParam()
        this.$emit('changed', this.localData)
      } else this.$q.notify('JSON/EML ist unverändert.')
      this.localData._changed = false
    },

   

    //ende methods
  }

}
</script>
