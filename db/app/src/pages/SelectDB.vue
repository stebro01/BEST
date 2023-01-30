<template>
  <q-page class="">

    <div v-if="!$store.getters.ELECTRON_MODE" class="flex flex-center">
      Zugriff auf das lokale Dateisystem nur als Electron/App möglich
    </div>
    <MainSlot v-else :no_footer="true">
      <template v-slot:header>
        <div class="text-h6">DB laden</div>
      </template>

      <template v-slot:main>
        <div class="column items-center" style="height: 50vh">
          <div v-if="!FNAME" class="col-5">
            <q-file v-model="filename" label="wähle DB aus" input-class="text-center" accept=".db"
              style="position: relative; top: 50%" />
          </div>

          <div v-else class="col-12 text-center">
            <div class="row q-gutter-y-xl">
              <div class="col-12">
                <q-chip v-if="FNAME" removable @remove="clearFNAME()" color="primary" text-color="white" icon="file">
                  {{ FNAME.name }}
                </q-chip>
              </div>

              <q-btn class="col-12 my-list-btn" rounded no-caps @click="loadDB">lade DB</q-btn>

              <div class="col-12">
                <q-btn flat rounded no-caps class="my-btn q-mt-xl"
                  @click="$router.push({ name: 'DBFunctions_CreateDB' })">neue DB
                  anlegen</q-btn>
              </div>
            </div>
          </div>


        </div>

      </template>

    </MainSlot>

  </q-page>
</template>

<script>

import { Notify } from 'quasar'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'SelectDB',

  components: {MainSlot},

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
