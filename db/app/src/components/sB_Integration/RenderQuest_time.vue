<template>
      <q-input filled v-model="val" :mask="mask_input" :rules="['01.01.1970']" :hint="'Format: '+ date_rule">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
           <q-time v-model="val"
              @navigation="changedVal"
              format24h
            >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
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
      if (this.ITEM.type === 'time') this.val = value.year
    }
  },
  computed: {
    date_rule() {
      if (this.ITEM.type === 'time') return '12:00'
      return '12:00'
    },
    mask_date() {
      if (this.ITEM.type === 'time') return 'HH:MM'
      return 'HH:MM'
    },
    mask_input() {
      if (this.ITEM.type === 'time') return '##:## Uhr'
      return '##:##'
    },
    default_view() {
      if (this.ITEM.type === 'time') return 'Years'
      return ''
    }
  }
  
}
</script>
