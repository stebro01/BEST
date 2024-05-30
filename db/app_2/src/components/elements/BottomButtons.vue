<template>
    <div class="q-gutter-x-md q-pa-xs text-center">
        <q-btn v-if="show_like" no-caps rounded @click="$emit('like')" class="my-bg" icon="star" align="around" >  <q-tooltip>{{ TEXT.tooltip.like }}</q-tooltip></q-btn>
        <q-btn v-if="show_edit" no-caps rounded @click="$emit('edit')" class="my-bg" icon="edit" align="around" >  <q-tooltip>{{ TEXT.tooltip.edit }}</q-tooltip></q-btn>
        <q-btn v-if="show_delete" no-caps rounded @click="$emit('delete')" class="my-bg" icon="delete" align="around"><q-tooltip>{{ TEXT.tooltip.delete }}</q-tooltip></q-btn>
        <q-btn v-if="show_export" no-caps rounded @click="$emit('export')" class="my-btn" icon="file_download" align="around">{{ TEXT.export }}<q-tooltip>{{ TEXT.tooltip.export }}</q-tooltip></q-btn>
        <q-btn v-if="show_execute" no-caps rounded @click="$emit('execute')" class="my-btn" icon="forward" align="around">{{ TEXT.execute }}<q-tooltip>{{ TEXT.tooltip.execute }}</q-tooltip></q-btn>

        <q-btn v-if="show_save" icon="save" class="my-bg"  rounded @click="$emit('save')"><q-tooltip>{{ TEXT.tooltip.save }}</q-tooltip></q-btn>
        <q-btn v-if="show_back" icon="undo" class="my-bg" rounded @click="$emit('back')"><q-tooltip>{{ TEXT.tooltip.back }}</q-tooltip></q-btn>

        <q-btn v-if="show_add" icon="add" class="my-bg" rounded @click="$emit('add')"><q-tooltip>Neuen Eintrag erstellen</q-tooltip></q-btn>
        <q-btn v-if="show_play_playlist" icon="playlist_play" class="my-bg" rounded @click="$emit('playlist_play')"><q-tooltip>Scheme beginnen / wieder aufnehmen </q-tooltip></q-btn>
        <q-btn v-if="show_import" icon="file_upload" class="my-bg" rounded @click="$emit('import')"><q-tooltip>Daten importierenn</q-tooltip></q-btn>
    </div>
</template>

<script>
export default {
  name: 'BottomButtons',

  props: ['show_add', 'show_play_playlist', 'show_import', 'show_save', 'show_back', 'show_like', 'show_edit', 'show_export', 'show_delete', 'show_execute'],

  components: {  },

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