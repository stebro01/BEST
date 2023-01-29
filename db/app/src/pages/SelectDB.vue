<template>
  <q-page class="">
    <div v-if="!$store.getters.ELECTRON_MODE" class="flex flex-center">
      Zugriff auf das lokale Dateisystem nur als Electron/App möglich
    </div>

    <div v-else class="column items-center q-mt-xl text-center" style="height: 80vh">
      <div v-if="!FNAME" class="col-10">
        <q-file  v-model="filename" label="wähle DB aus" input-class="text-center" accept=".db"  style="position: relative; top: 50%"/>
      </div>

      <div v-else class="col-10" >
        <div style="position: relative; top: 50%">
          <div>
            <q-chip v-if="FNAME" removable @remove="clearFNAME()" color="primary" text-color="white" icon="file">
              {{ FNAME.name }}
            </q-chip>
          </div>
          <div>

            <q-btn class="q-mt-lg my-list-btn" rounded no-caps @click="loadDB">lade DB</q-btn>
          </div>
        </div>
      </div>

      <div class="col-2">
        <q-btn style="top: 50%" flat rounded no-caps class="my-btn" @click="$router.push({ name: 'DBFunctions_CreateDB' })">neue DB
          anlegen</q-btn>
      </div>
    </div>



  </q-page>
</template>

<script>

import { Notify } from 'quasar'

export default {
  name: 'SelectDB',

  data() {
    return {
      filename: undefined
    }
  },

  mounted() {
    if (this.$store.getters.CONNECTED) this.$router.push({name: 'Index'})
  },  

  watch: {
    filename(val) {
      if (val === undefined) {
        this.$store.commit('SETTINGS_SET', {label: 'filename', value: undefined})
      } else {
        this.$store.commit('SETTINGS_SET', {label: 'filename', value: {path: this.filename.path, name: this.filename.name}})
      }
    }
  },

  computed: {
    FNAME() {
      return this.$store.getters.SETTINGS.filename
    }
  },  

  methods: {
    loadDB () {
      //  filename ist stored in SETTINGS_SET.filename
      this.$store.dispatch('connectDB')
      .then(res => {
        Notify.create(res)
        this.$router.push({name: 'Index'})

      })
      .catch(err => {
        Notify.create(`Es ist ein Fehler aufgetreten: ${err}`)
      })

    },

    clearFNAME() {
      this.$store.commit('SETTINGS_SET', {label: 'filename', value: undefined})
      this.filename = undefined
    }
  }

}
</script>
