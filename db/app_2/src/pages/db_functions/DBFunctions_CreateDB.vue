<template>
  <q-page>
    <MainSlot :no_footer="true" :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'reset-db-logo.png'" :icon="'add'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div v-if="!new_db" class="absolute-center text-center">
          <div class="q-pa-lg">
            <q-input v-model="path" dense hint="Zielverzeichnis auswählen" />
          </div>
          <q-btn v-if="path" class="my-btn" no-caps rounded color="black" @click="createDB()">{{
            TEXT.btn_create
          }}</q-btn>

          <q-banner class="bg-grey-3 q-mt-lg"><span v-html="TEXT.info_create"></span></q-banner>
        </div>
        <div v-else class="absolute-center text-center">
          <q-banner class="bg-green-3 q-mt-lg"><span v-html="TEXT.info_success"></span></q-banner>
          <q-chip>{{ new_db }}</q-chip>
          <div>
            <q-btn class="my-btn q-mt-lg" rounded no-caps @click="connectNewDB()">{{
              $store.getters.TEXT.btn.connect
            }}</q-btn>
          </div>
        </div>
      </template>

    </MainSlot>

  </q-page>
</template>

<script>

// import {splitVisits, beautify_data} from 'src/tools/formatdata'
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBFunctions_ResetDB',

  components: { HEADING, MainSlot },

  data() {
    return {
      path: null,
      new_db: undefined
    }
  },

  mounted() {
    this.path = this.HOME_DIR
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.create_db
    },

    HOME_DIR() {
      if (!window.electron.homedir) return '/home/user'
      else return window.electron.homedir
    }
  },

  methods: {
    async createDB() {
      if (!this.path) return
      this.$store.dispatch('createDB', this.path).then(res => {
        if (res.status) this.new_db = res.filename
        else this.$q.notify(res.error)
        
      })
      .catch(err => this.$q.notify(err))
    },

    connectNewDB() {
      this.$store.commit('SETTINGS_SET', {label: 'filename', value: {path: this.new_db, name: this.new_db}})
      this.$router.push({name: 'Start'})
    },

  }

}
</script>
