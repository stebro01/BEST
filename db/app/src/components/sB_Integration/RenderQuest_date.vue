<template>
      <q-input filled v-model="val" :mask="mask_input" :rules="['01.01.1970']" :hint="'Format: '+ date_rule">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="val" :mask="mask_date" :default-view="default_view" default-year-month="1964/01" 
            navigation-min-year-month="1901/01"
            navigation-max-year-month="2022/01"
            @navigation="changedVal"
              >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

</template>

<script>

export default {
  name: 'RenderDate',
  props: ["ITEM"],
  data() {
    return {
      item: this.ITEM,
      val: null

    }
  },
  watch: {
    val(value) {
      this.$emit('emitValue', value)
    }
  },
  methods: {
    changedVal(value){
      if (this.ITEM.type === 'date_year') this.val = value.year
    }
  },
  computed: {
    date_rule() {
      if (this.ITEM.type === 'date_year') return '1970'
      return '01.01.1970'
    },
    mask_date() {
      if (this.ITEM.type === 'date_year') return 'YYYY'
      return 'DD.MM.YYYY'
    },
    mask_input() {
      if (this.ITEM.type === 'date_year') return '####'
      return '##.##.####'
    },
    default_view() {
      if (this.ITEM.type === 'date_year') return 'Years'
      return ''
    }
  }
  
}
</script>
