<template>
<div class="row">
  <div class="col-12">
    <div v-if="filter_on" class="row">
      <!-- INPUT -->
      <q-input  data-cy="filter_input" v-model="filter_str" label="Filter" class="col-8">
        <template v-slot:before>
          <q-btn round dense flat icon="close" @click="filter_str = null; filter_on = false" />
        </template>
      </q-input>
      <!-- AUSWAHL -->
      <div class="col-4">
        <q-btn-dropdown color="dark" :label="ACTIVE_FILTER.order.label">
          <q-list>
            <q-item clickable v-close-popup @click="clicked(ind)" v-for="(item, ind) in filter_button_options" :key="`${ind}_option`">
              <q-item-section>
                <q-item-label>{{item.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <q-btn v-else data-cy="filter_btn" class="my-btn" flat icon="filter_list" @click="filter_on = !filter_on" />
  </div>
</div>
</template>

<script>
  const filter_options = [{label: 'Datum↑', value: 'date_up'}, {label: 'Datum↓', value: 'date_down'}, {label: 'PID↑', value: 'pid_up'}, {label: 'PID↓', value: 'pid_down'}, {label: 'export open', value: 'export_open'}]
  export default {
    name: 'FilterStorage',
    data() {
      return {
        filter_on: false,
        filter_str: null,
        filter_button_options: filter_options
      }
    },
    watch: {
      FILTER(val){
        this.$store.commit('SETTINGS_SET', {field: 'filter_storage', value: {order: this.ACTIVE_FILTER.order, text: val}})
        if (val === null) this.$emit('filterCleared')
        else this.$emit('filterSet')
      }

    },
    computed: {
      FILTER() {
        if (this.filter_on === false) return null
        return this.filter_str
      },

      ACTIVE_FILTER() {
        const AF = this.$store.getters.SETTINGS.get('filter_storage')
        if (AF && AF.order) return AF
        else return {text: null, order: filter_options[0]}
      }
    },

    methods: {
      clicked(val) {
        this.$store.commit('SETTINGS_SET', {field: 'filter_storage', value: {order: this.filter_button_options[val], text: this.filter_str}})
        this.$emit('filterSet')
      }
    }
  }
</script>