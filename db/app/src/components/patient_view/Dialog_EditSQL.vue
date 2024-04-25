<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section class="text-bold">
        Bearbeite Suche / SQL Statement
      </q-card-section>

      <!--  -->
      <q-card-section>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption>SQL Statement</q-item-label>
            <q-item-label style="font-size: 0.6em; font-family: 'Courier New', Courier, monospace;">{{ SQL_STATEMENT
              }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <!--  -->
      <q-card-section v-if="OPTIONS">
        <q-scroll-area style="width: 100%; height: 250px">
          <q-list  bordered style="width: 100%">
            <!-- PATIENT -->
            <q-expansion-item icon="perm_identity" label="Patienten-Eigenschaften" class="bg-green-1 q-mb-sm" dense>
              <div class="row items-center">
                <div class="col-6 q-pa-xs row items-center">
                  <div class="col-2"><q-checkbox v-model="props.patient.PATIENT_CD.check" dense /></div>
                  <div class="col-10"><q-input v-model="props.patient.PATIENT_CD.value" hint="ID" dense
                      input-class="text-center" /></div>

                </div>
                <div class="col-6 q-pa-xs row items-center">
                  <div class="col-2"><q-checkbox v-model="props.patient.SEX_CD.check" dense /></div>
                  <div class="col-10"><q-select v-model="props.patient.SEX_CD.value" dense :options="OPTIONS.SEX_CD"
                      hint="Geschlecht" /></div>

                </div>
                <div class="col-12 q-pa-xs row items-center">
                  <div class="col-1"><q-checkbox v-model="props.patient.BIRTH_DATE.check" dense /></div>
                  <div class="col-1 text-caption">von: </div>
                  <div class="col-4"><q-input v-model="props.patient.BIRTH_DATE.start" hint="Geburtsdatum von" dense
                      type="date" /></div>
                  <div class="col-2 text-caption text-right">bis: </div>
                  <div class="col-4"><q-input v-model="props.patient.BIRTH_DATE.end" hint="Geburtsdatum bis" dense
                      type="date" /></div>
                </div>
              </div>
            </q-expansion-item>

            <!-- VISITE -->
            <q-expansion-item icon="event_note" label="Visiten-Eigenschaften" class="bg-orange-1 q-mb-sm" dense>
              <div class="row">
                <div class="col-12 q-pa-xs row items-center">
                  <div class="col-1"><q-checkbox v-model="props.visit.START_DATE.check" dense /></div>
                  <div class="col-1 text-caption">von: </div>
                  <div class="col-4"><q-input v-model="props.visit.START_DATE.start" hint="Startdatum von" dense
                      type="date" /></div>
                  <div class="col-2 text-caption text-right">bis: </div>
                  <div class="col-4"><q-input v-model="props.visit.START_DATE.end" hint="Startdatum bis" dense
                      type="date" /></div>
                </div>
              </div>
              <div class="col-6 q-pa-xs row items-center">
                <div class="col-2"><q-checkbox v-model="props.visit.VISIT_BLOB.check" dense /></div>
                <div class="col-10"><q-input v-model="props.visit.VISIT_BLOB.value" hint="Beschreibung" dense
                    input-class="text-center" /></div>

              </div>

            </q-expansion-item>

            <!-- OBSERVATIONS -->
            <q-expansion-item icon="event_note" label="Observations" class="bg-blue-1" dense>
              <div class=row>
                <div class="col-12">
                  <q-banner style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;"> to be
                    continued ... </q-banner>
                </div>
              </div>

            </q-expansion-item>

          </q-list>

        </q-scroll-area>
      </q-card-section>


      <q-card-actions align="between">
        <q-btn label="Schließen" no-caps rounded @click="$emit('close')" />
        <q-btn label="Anwenden" no-caps color="primary" rounded @click="prepareSQL()"></q-btn>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>


export default {
  name: 'Dialog_EditSQL',

  props: ['data'],

  components: {},

  data() {
    return {
      show_dialog: false,

      options: {}
    }
  },

  mounted() {
    this.loadData()

  },

  computed: {
    SQL_STATEMENT: {
      get() {
        return this.$store.getters.PATIENT_VIEW.SQL_STATEMENT
      },
      set(value) {
        this.$store.commit('PATIENT_VIEW_SQLSTATEMENT_SET', value)
      }
    },

    OPTIONS() {
      if (!this.options || this.options.length < 1) return undefined
      return this.options
    },

    props() {
      return this.$store.getters.PATIENT_VIEW_SQL_OPTIONS
    }
  },

  methods: {
    async loadData() {
      this.options.SEX_CD = await this.$store.dispatch('getConceptList', '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA')

      this.show_dialog = true
    },

    prepareSQL() {
      let sql = this.$store.getters.PATIENT_VIEW_SQL_STATEMENT_RAW_JOIN
      if (this.props.patient.PATIENT_CD.check) {
        sql += ` AND pl.PATIENT_CD like '%${this.props.patient.PATIENT_CD.value}%'`
      }
      if (this.props.patient.BIRTH_DATE.check && this.props.patient.BIRTH_DATE.start && this.props.patient.BIRTH_DATE.end) {
        sql += ` AND pl.BIRTH_DATE BETWEEN '${this.props.patient.BIRTH_DATE.start}' AND '${this.props.patient.BIRTH_DATE.end}'`
      }
      if (this.props.patient.SEX_CD.check) {
        sql += ` AND pl.SEX_CD = '${this.props.patient.SEX_CD.value.value}'`
      }

      if (this.props.visit.START_DATE.check && this.props.visit.START_DATE.start && this.props.visit.START_DATE.end) {
        sql += ` AND vd.START_DATE BETWEEN '${this.props.visit.START_DATE.start}' AND '${this.props.visit.START_DATE.end}'`
      }

      if (this.props.visit.VISIT_BLOB.check) {
        sql += ` AND vd.VISIT_BLOB like '%${this.props.visit.VISIT_BLOB.value}%'`
      }

      console.log(sql)

      this.$store.commit('PATIENT_VIEW_SQLSTATEMENT_SET', sql)
      this.$store.getters.PATIENT_XLS_VIEWS.index = 0

      this.$emit('update_sql')
    }

  }
}
</script>
