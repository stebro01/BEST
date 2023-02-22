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

       <!-- PLAYIST BUTTON -->
       <q-item v-if="show_play_playlist" clickable v-close-popup @click="$emit('playlist_play')">
        <q-item-section avatar><q-icon name="playlist_play" /></q-item-section>
        <q-item-section>Scheme beginnen / wieder aufnehmen</q-item-section>
      </q-item>

      <!-- REMOVE BUTTON -->
      <q-item v-if="show_remove" clickable v-close-popup @click="$emit('remove')">
        <q-item-section avatar><q-icon name="delete" /></q-item-section>
        <q-item-section>remove</q-item-section>
      </q-item>

      <!-- IMPORT BUTTON -->
      <q-item v-if="show_import" clickable v-close-popup @click="$emit('import')">
        <q-item-section avatar><q-icon name="file_upload" /></q-item-section>
        <q-item-section>Daten importieren</q-item-section>
      </q-item>

      <!-- EXPORT BUTTON -->
      <q-item v-if="show_export" clickable v-close-popup @click="$emit('export')">
        <q-item-section avatar><q-icon name="file_download" /></q-item-section>
        <q-item-section>Daten exportieren</q-item-section>
      </q-item>

    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  name: 'BottomDropDown',

  props: ['show_add', 'show_remove', 'show_edit', 'show_import', 'show_export', 'show_play_playlist'],

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