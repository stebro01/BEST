<template>

  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-ma-md no-shadow my-card" v-if="show_dialog">
      <q-icon class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')" name="close"
        size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        Bearbeite Layout / Views
      </q-card-section>
      <q-card-section>
        <q-form class="row justify-center">
          <q-select class="col-10 q-my-xs" filled dense v-model="selected_view" :options="options_view"
            label="View-Layouts" @update:model-value="selectLayout(selected_view)"/>
          <q-btn class="col-2" icon="clear" dense flat @click="selected_view = undefined; selectLayout(undefined)" />
        </q-form>
      </q-card-section>

      <q-card-section>
        All Cols:
        {{ LIST_WITH_COLS }}
      </q-card-section>

      <q-card-section>
        Hidden Cols:
        {{ LIST_WITH_HIDE_COLS }}
      </q-card-section>

      <q-card-actions align="between">
        <q-btn label="Abbrechen" no-caps rounded @click="$emit('close')" />
        <q-btn label="Speichern" no-caps color="primary" rounded @click="updateView()"></q-btn>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>


<script>


export default {
  name: 'Dialog_EditView',

  props: ['data'],

  components: {},

  data() {
    return {
      show_dialog: false,
      selected_view: undefined,
      options_view: []
    }
  },

  mounted() {
    if (!this.data) return this.$emit('close')
    if (this.data) this.show_dialog = true
    this.loadData()

  },

  computed: {
    LIST_WITH_COLS() {
      return this.data.col_keys.map(item => item.label).join(', ')
    },
    LIST_WITH_HIDE_COLS() {
      return this.data.hide_col_keys.join(', ')
    }


  },

  methods: {
    async loadData() {
      const res_layouts = this.$store.getters.PATIENT_VIEW.LAYOUTS
      //but only the 1:end values
      if (res_layouts && res_layouts.length > 0) this.options_view = res_layouts.slice(1)
      else {
        await this.$store.dispatch('initLayout')
        console.log(this.$store.getters.PATIENT_VIEW.LAYOUTS)
      }

      if (this.$store.getters.PATIENT_VIEW.active_layout_value) {
        //finde im array mit werten {label, value} den index des aktiven layouts
        const val = this.options_view.find(item => item.value === this.$store.getters.PATIENT_VIEW.active_layout_value)
        this.selected_view = val
      }


    },

    selectLayout(item) {
      if (!item) this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', undefined)
      else this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', item.value)
    },

    updateView() {
      console.log(this.data)
      console.log(this.$store.getters.PATIENT_VIEW)
    }



  }


}
</script>
