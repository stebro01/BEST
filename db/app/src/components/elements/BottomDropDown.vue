<template>
  <q-btn-dropdown dense flat icon="pending">
    <q-list dense>
      <!-- ADD BUTTON -->
      <q-item v-if="show_add" clickable v-close-popup @click="$emit('add')">
        <q-item-section avatar><q-icon name="add" /></q-item-section>
        <q-item-section>add</q-item-section>
      </q-item>

      <!-- EDIT BUTTON -->
      <q-item v-if="show_edit" clickable v-close-popup @click="$emit('edit')">
        <q-item-section avatar><q-icon name="edit" /></q-item-section>
        <q-item-section>edit</q-item-section>
      </q-item>

      <!-- REMOVE BUTTON -->
      <q-item v-if="show_remove" clickable v-close-popup @click="$emit('remove')">
        <q-item-section avatar><q-icon name="delete" /></q-item-section>
        <q-item-section>remove</q-item-section>
      </q-item>

    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  name: 'BottomDropDown',

  props: ['show_add', 'show_remove', 'show_edit'],

  components: {},

  data() {
    return {

    }
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.btn
    }
  }

}
</script>