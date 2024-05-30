<template>
  <q-card class="my-card q-mt-xl">
    <q-separator class="q-mx-sm" />
    <q-card-section class="q-pa-md">
      <q-file v-model="file_to_read" :accept="accept" :label="label" :multiple="MULTIPLE">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-icon v-if="file_to_read" name="close" @click="file_to_read = undefined" class="cursor-pointer" />
        </template>
      </q-file>
    </q-card-section>

    <q-separator class="q-mx-sm" v-if="file_to_read" />
    <q-card-actions class="q-pa-md row justify-center">
      <q-btn v-if="file_to_read" no-caps align="around" rounded icon="upload_file" class="my-btn"
        @click="$emit('save', file_to_read)">{{ $store.getters.TEXT.btn.load }} <q-tooltip>{{
          $store.getters.TEXT.btn.tooltip.load }}</q-tooltip></q-btn>
    </q-card-actions>
  </q-card>
</template>


<script>
export default {
  name: 'SelectFile',

  props: ['label', 'accept', 'multiple'],

  components: {},

  data() {
    return {
      file_to_read: undefined
    }
  },

  watch: {
    accept(val) {
      if (val) this.file_to_read = undefined
    }
  },

  computed: {
    MULTIPLE() {
      if (this.multiple) return true
      else return false
    } 
  }






}
</script>