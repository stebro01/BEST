<template>
  <q-card class="my-card q-mt-xl">
    <q-separator class="q-mx-sm" />
    <q-card-section class="q-pa-md text-center">
      <q-btn @click="selectFolder()">select</q-btn>
    </q-card-section>

    <q-separator class="q-mx-sm" v-if="folder_selected" />
    <q-card-actions class="q-pa-md row justify-center">
      <q-btn v-if="folder_selected" no-caps align="around" rounded icon="upload_file" class="my-btn"
        @click="$emit('save', folder_selected)">{{ $store.getters.TEXT.btn.load }} <q-tooltip>{{
          $store.getters.TEXT.btn.tooltip.load }}</q-tooltip></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>

export default {
  name: 'SelectFolder',

  props: ['label', 'accept'],

  components: {},

  data() {
    return {
      folder_selected: undefined
    }
  },

  watch: {
    accept(val) {
      if (val) this.folder_selected = undefined
    }
  },

  computed: {

  },

  methods: {

    selectFolder(val) {
      console.log(window.electron)  
      
    }
  }






}
</script>