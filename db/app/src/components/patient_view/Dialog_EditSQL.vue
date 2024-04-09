<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        Bearbeite Suche / SQL Statement
      </q-card-section>

      <!--  -->
      <q-card-section>
        <q-input dense input-style="font-size: 0.8em" v-model="SQL_STATEMENT" label="SQL Statement" type="textarea" rows=3 />

      </q-card-section>

      <!--  -->

      <q-card-section>
      
      </q-card-section>

      <q-card-actions align="between">
        <q-btn label="Schließen" no-caps rounded @click="$emit('close')" />
        <q-btn label="Anwenden" no-caps color="primary" rounded @click="$emit('update_sql')"></q-btn>
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
    }

  },

  methods: {
   

    async loadData() {

      this.show_dialog = true
    },

  }
}
</script>
