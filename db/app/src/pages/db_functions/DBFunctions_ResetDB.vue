<template>
  <q-page>
    <MainSlot :no_footer="true" :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'reset-db-logo.png'" :icon="'restart_alt'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class=" text-center absolute-center q-gutter-lg">
        <div >
          <q-btn class="my-btn" no-caps rounded color="black" @click="resetDB()">{{ TEXT.btn_reset }}</q-btn>

          <q-banner class="bg-grey-3 q-mt-lg"><span v-html="TEXT.info_reset"></span></q-banner>
        </div>
        <div>
          <q-btn class="my-btn" no-caps rounded color="black" @click="resetViews()">Views aktualisieren</q-btn>
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
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'DBFunctions_ResetDB',

  components: { HEADING, MainSlot },

  data() {
    return {
      CONCEPTS: [],
      filter: undefined,
      filter_options: {T: true, N: true, S: true, F: true, A: false}
    }
  },


  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.reset_db
    }
  },

  methods: {
    async resetDB() {
      if (!await my_confirm(this.TEXT.confirm_reset)) return

      this.$store.dispatch('resetDB')
      .then(() => this.$q.notify(this.TEXT.msg_reset_complete))
      .catch(err => this.$q.notify({message: `${this.$store.getters.TEXT.alerts.some_sql_error}: ${err}`, timeout: 5000}))

    },

    // RESET VIEWS
    async resetViews() {
      if (!await my_confirm("Sind Sie sicher? Dieser Schritt laesst sich nicht rückgängig machen.")) return

      this.$store.dispatch('resetViews')
      .then(() => this.$q.notify(this.TEXT.msg_reset_complete))
      .catch(err => this.$q.notify({message: `${this.$store.getters.TEXT.alerts.some_sql_error}: ${err}`, timeout: 5000}))
    }


  }

}
</script>
