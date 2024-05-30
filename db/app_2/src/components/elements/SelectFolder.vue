<template>
  <q-card class="my-card">
    <q-separator class="q-mx-sm" />
    <q-card-section class="q-pa-sm text-center">
      Ordner zum Speichern auswählen
      <q-btn class="absolute-top-right" icon="close" round flat @click="$emit('close')" />
    </q-card-section>
    <q-separator dense/>
    <q-card-section class="q-pa-xs">
      <div class="row justify-center bg-dark" v-if="DIR_INFO">
        <q-btn v-for="(drive, ind) of DIR_INFO.availableDrives" :key="ind + 'drive'" rounded no-caps align="around"  
          @click="switchFolder(drive)" class="q-ma-xs" color="grey-4" text-color="black">{{ drive }} </q-btn>
      </div>
    </q-card-section>
    <q-card-section v-if="DIR_INFO" class="q-pa-xs">
      <!-- CURRENTFOLDER -->
      <q-item>
        <q-item-section avatar class="cursor-pointer" @click="goLevelUp()"><q-icon name="drive_folder_upload"><q-tooltip>Einen Ordner nach oben</q-tooltip></q-icon></q-item-section>
        <q-item-section class="bg-grey-3">{{ DIR_INFO.currentPath }}
            <!-- EDIT -->
            <q-popup-edit v-model="DIR_INFO.currentPath" auto-save v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>

        </q-item-section>
        <q-item-section side ><q-btn @click="selectFolder" color="dark" rounded icon="back_hand"><q-tooltip>Diesen Ordner auswählen</q-tooltip></q-btn></q-item-section>
      </q-item>
      <!-- directoryContents -->
      <q-scroll-area class="my-card" style="height: 250px; width: 99%">
      <q-list bordered separator dense class="text-caption text-grey-8">
        <q-item v-for="(item, ind) of DIR_INFO.directoryContents" :key="ind + 'entry'" clickable @click="switchFolder(item)">
          <q-item-section avatar>
            <q-icon name="folder_open"></q-icon>
          </q-item-section>
          <q-item-section>{{ item }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
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
import { FileExplorer} from 'src/tools/FileExplorer.js'
const explorer = new FileExplorer(window.electron.path, window.electron.fs)

export default {
  name: 'SelectFolder',

  props: ['label', 'root_dir'],

  components: {},

  data() {
    return {
      folder_selected: undefined,
      DIR_INFO: undefined
    }
  },

  watch: {
    CURRENTPATH(val, old) {
      if (val && old) this.editPathManually(val, old)  
    }
  },

  mounted() {
    this.viewFolder().then(res => {
      if (this.root_dir && this.root_dir !== this.DIR_INFO.currentPath) this.editPathManually(this.root_dir, this.DIR_INFO.currentPath)
    })
    
  },

  computed: {
    CURRENTPATH() {
      if (!this.DIR_INFO) return undefined
      return this.DIR_INFO.currentPath
    }
  },

  methods: {

    selectFolder() {
      this.$emit('save', this.DIR_INFO.currentPath)
    },

    switchFolder(folder) {
      explorer.setCurrentPath(folder)
      this.viewFolder()
    },

    goLevelUp() {
      explorer.goUpOneLevel()
      this.viewFolder()
    },

    async editPathManually(new_path, old_path) {
      if (await explorer.checkPath(new_path)) {
        explorer.setCurrentPath(new_path)
        this.viewFolder()
        return
      } else {
        this.$q.notify({
          message: 'Der Pfad existiert nicht',
          color: 'red',
          icon: 'warning',
          timeout: 2000
        })
        this.DIR_INFO.currentPath = old_path
      }
      
    },

    async viewFolder() {
      this.DIR_INFO = await explorer.info()
    },
  }






}
</script>