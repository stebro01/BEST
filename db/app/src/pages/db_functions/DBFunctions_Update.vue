<template>
  <q-page>
    <MainSlot :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'reset-db-logo.png'" :icon="'restart_alt'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="text-center">
          <div class="text-h6">
            {{ db_status_text }}
          </div>
          <div>
            Datenbank ist aktuell:
            <q-badge v-if="db_is_uptodate" color="green">{{
              db_is_uptodate
            }}</q-badge>
            <q-badge v-else color="red">{{ db_is_uptodate }}</q-badge>
          </div>

          <div>
            <q-card class="q-ma-xl" v-if="!show_data_import">
              <q-card-section>DB Aktualisieren</q-card-section>
              <q-separator />
              <q-card-section>ADMIN: {{ $store.getters.ISADMIN }}</q-card-section>
              <q-card-section>
                <div v-if="!$store.getters.ISADMIN">
                  <q-banner class="bg-red" inline-actions>ADMIN notwendig zum Aktualisieren
                    <template v-slot:action>
                      <q-btn flat color="primary" label="zur Anmeldung" no-caps @click="relogin()" />
                    </template>
                  </q-banner>
                </div>
                <q-btn v-else class="my-btn" no-caps rounded @click="updateDB()">Aktualisieren</q-btn>
              </q-card-section>
            </q-card>
            <div v-if="show_data_import">
              <div class="q-pt-lg text-caption">Wähle das Template aus, es sollte so heissen: export_dbBEST_2023XXXX</div>
              <DATATRANSFER_IMPORT  />
            </div>
          </div>
        </div>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_back="true" @back="this.$router.push({ name: 'Start' })" />
      </template>
    </MainSlot>

  </q-page>
</template>

<script>
// import {splitVisits, beautify_data} from 'src/tools/formatdata'
import HEADING from "src/components/elements/Heading.vue";
import MainSlot from "src/components/MainSlot.vue";
import DATATRANSFER_IMPORT from "src/components/import/DataTransfer_Import.vue";
import BOTTOM_BUTTONS from "src/components/elements/BottomButtons.vue";

export default {
  name: "DBFunctions_Update",

  components: { HEADING, MainSlot, DATATRANSFER_IMPORT, BOTTOM_BUTTONS },

  data() {
    return {
      CONCEPTS: [],
      db_is_uptodate: false,
      db_status_text: undefined,
      show_data_import: false,
    };
  },

  mounted() {
    this.check_db_date();
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_functions_update;
    },
  },

  methods: {
    check_db_date() {
      // get the db version
      this.$store
        .dispatch("searchDB", {
          table: "CODE_LOOKUP",
          query_string: { CODE_CD: "DB_VERSION", _columns: ["NAME_CHAR"] },
        })
        .then((res) => {
          if (res && res.length > 0) {
            const db_version = res[0].NAME_CHAR;
            const app_version = this.$store.getters.ENV.app.version;
            this.db_status_text = `DB-Version: ${db_version} (App-Version: ${app_version})`;
            if (db_version === app_version) this.db_is_uptodate = true;
            else this.db_is_uptodate = false;
          }
        });
    },

    relogin() {
      this.$store.commit("USER_SET", undefined);
      this.$router.push({ name: "LoginUser" });
    },

    updateDB() {
      // console.log(this.$store.getters.ENV.app.templates.TEMPLATE_JSON);
      this.show_data_import = true;
    },
  },
};
</script>
