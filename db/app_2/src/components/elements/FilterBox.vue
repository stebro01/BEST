<template>
    <q-input dense debounce="300" color="primary" v-model="FILTER" input-class="text-center">
        <template v-slot:append>
              <q-icon name="search" size="xs"/>
        </template>
        <template v-slot:prepend>
          <q-icon name="clear" @click="FILTER = undefined" size="xs" class="cursor-pointer"/>
        </template>
    </q-input>
</template>


<script>
export default {
  name: 'FilterBox',

  props: ['filter'],

  components: {  },

  data() {
    return {
    }
  },

  computed: {
    FILTER: {
        get() {
            return this.filter
        },
        set(val) {

            this.$emit('update', val)
        }
    }
  }






}
</script>