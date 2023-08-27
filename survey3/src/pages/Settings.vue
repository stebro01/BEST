<template>
  <q-page data-cy="page_settigns" class="page-size">
    <div class="column items-center" style="height: 100%">
      <!-- TITLE -->
      <div class="col-1 q-py-md text-h6">
        {{ TEXT.storage.settings }}
      </div>

      <div class="col">
        <q-scroll-area class="my-form">
          <div class="row q-pa-md justify-around q-gutter-sm">
            <!-- FONT -->
            <q-expansion-item data-cy="btn_description" expand-separator :icon="TEXT.settings.font.icon"
              :label="TEXT.settings.font.label" :caption="`Größe: ${$store.getters.SETTINGS.size}`"
              class="my-settings-item">
              <div class="row text-center">
                <div class="col">
                  <q-btn-toggle v-model="$store.getters.SETTINGS.size" flat :options="[
                    { label: 'normal', value: 'normal' },
                    { label: 'größer', value: 'bigger' },
                    { label: 'sehr groß', value: 'biggest' },
                  ]" />
                </div>
              </div>
              <div class="q-ma-sm text-center">
                "{{ TEXT.settings.font.sample }}"
              </div>
            </q-expansion-item>

            <!-- EXPORT -->
            <q-expansion-item data-cy="btn_description" expand-separator :icon="TEXT.settings.export.icon"
              :label="TEXT.settings.export.label" :caption="`Format: ${export_format}`" class="my-settings-item">
              <div class="row text-center">
                <div class="col-12">
                  <q-btn-toggle flat v-model="export_format" toggle-color="primary"
                    :options="TEXT.settings.export.options" />
                </div>
                <div class="col-12 text-caption">
                  <span v-if="export_format === 'html'">{{
                    TEXT.settings.export.description.html
                  }}</span>
                  <span v-else-if="export_format === 'json'">{{
                    TEXT.settings.export.description.json
                  }}</span>
                  <span v-else-if="export_format === 'CDA'">{{
                    TEXT.settings.export.description.cda
                  }}</span>
                </div>
              </div>
            </q-expansion-item>

            <!-- USER SETTINGS -->
            <q-expansion-item data-cy="btn_description" expand-separator :icon="TEXT.settings.user.icon"
              :label="TEXT.settings.user.label" :caption="`eMail: ${$store.getters.SETTINGS.email_export || ''} `"
              class="my-settings-item">
              <!-- MAIL -->
              <div class="row q-pa-xs">
                <q-input class="col-12" dense v-model="$store.getters.SETTINGS.email_export" input-class="text-center"
                  label="eMail" />
                <!-- CHECK THE EMAIL CLIENT -->
                <div class="">

                  <q-icon v-if="!email_server_available || email_server_available.error" name="warning" color="red"><q-tooltip>der Email-Server ist NICHT
                      erreichbar: {{ email_server_available }}</q-tooltip></q-icon>
                  <q-icon v-else name="check"><q-tooltip>der Email-Server ist erreichbar</q-tooltip></q-icon>

                </div>

                <div class="col-12 text-center q-my-md">
                  <q-toggle v-model="user_details" class="text-caption" color="green" data-cy="show_user_details"
                    :label="TEXT.btn.more_details" />
                </div>
              </div>
              <!-- MORE DETAILS` -->
              <div v-if="user_details" class="row q-ma-xs shadow-1 q-pa-sm">
                <div class="text-caption my-annotation-text" v-html="TEXT.settings.user.uid_description"></div>
                <q-input class="col-12" dense disable borderless v-model="$store.getters.SETTINGS.user_uid"
                  input-class="text-center" label="uid" />
                <q-input class="col-12" dense readonly borderless v-model="keyPair.privateKey"
                  :type="isPwd_priv ? 'true' : 'password'" label="privateKey" input-class="text-center"
                  data-cy="notion_input_token">
                  <template v-slot:append>
                    <q-icon :name="isPwd_priv ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd_priv = !isPwd_priv" />
                  </template>
                </q-input>
                <q-input class="col-12" dense readonly borderless v-model="keyPair.publicKey"
                  :type="isPwd_pub ? 'true' : 'password'" label="publicKey" input-class="text-center"
                  data-cy="notion_input_token">
                  <template v-slot:append>
                    <q-icon :name="isPwd_pub ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd_pub = !isPwd_pub" />
                  </template>
                </q-input>
              </div>

              <!-- USE NOTION? -->
              <div v-if="user_details" class="row q-ma-xs shadow-1 q-pa-sm">
                <div class="col-12 text-center">
                  <q-toggle v-model="$store.getters.SETTINGS.use_notion" color="green" data-cy="notion_use"
                    :label="TEXT.storage.use_notion" />
                </div>

                <div v-if="$store.getters.SETTINGS.get('use_notion')" class="col-12">
                  <q-input v-model="$store.getters.SETTINGS.notion_db" label="db" input-class="text-center"
                    data-cy="notion_input_db" />
                  <q-input v-model="$store.getters.SETTINGS.notion_token" :type="isPwd_notion ? 'true' : 'password'"
                    label="token" input-class="text-center" data-cy="notion_input_token">
                    <template v-slot:append>
                      <q-icon :name="isPwd_notion ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd_notion = !isPwd_notion" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- IMPORT&EXPORT -->
              <div v-if="user_details" class="row justify-right text-grey-8 q-mt-md">
                <q-btn no-caps icon="file_upload" flat size="xs" class="col" @click="view_import = true">{{
                  TEXT.btn.user.label_import }}</q-btn>
                <q-btn no-caps icon="refresh" flat size="xs" class="col" @click="user_new()">{{ TEXT.btn.user.label_new
                }}</q-btn>
                <q-btn no-caps icon="file_download" flat size="xs" class="col" @click="view_export = true">{{
                  TEXT.btn.user.label_export }}</q-btn>
              </div>
            </q-expansion-item>

            <!-- SEPARATOR -->
            <q-separator class="my-settings-separator" />

            <!-- QUESTMANAGER -->
            <q-item clickable v-ripple class="my-settings-item" @click="$router.push({ name: 'questman' })">
              <q-item-section avatar>
                <q-icon :name="TEXT.settings.questman.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ TEXT.settings.questman.label }}</q-item-label>
                <q-item-label caption>{{
                  TEXT.settings.questman.description
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <!-- SEPARATOR -->
            <q-separator class="my-settings-separator" />

            <!-- ENCRYPT -->
            <q-item clickable v-ripple class="my-settings-item" @click="$router.push({ name: 'encrypt' })">
              <q-item-section avatar>
                <q-icon :name="TEXT.settings.encryption.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  TEXT.settings.encryption.label
                }}</q-item-label>
                <q-item-label caption>{{
                  TEXT.settings.encryption.description
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <!-- ENDEROW -->
          </div>
        </q-scroll-area>
      </div>

      <!-- ENDE COLUMN -->
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON />

    <!-- USEREXPORT -->
    <USEREXPORT v-if="view_export === true" :DATA="$store.getters.SETTINGS._USER" :view_export="view_export"
      @closeClick="view_export = false" />

    <!-- USERIMPORT -->
    <USERIMPORT v-if="view_import === true" :view_import="view_import" @closeClick="view_import = false"
      @clickImportData="doImportData($event)" />
  </q-page>
</template>

<script>
import myMixins from "src/mixins/modes";
import BACKBUTTON from "src/components/BackButton.vue";
import USEREXPORT from "src/components/User_export.vue";
import USERIMPORT from "src/components/User_import.vue";
import { checkMail } from "src/tools/mail";

export default {
  name: "Settings",
  components: { BACKBUTTON, USEREXPORT, USERIMPORT },
  mixins: [myMixins],
  data() {
    return {
      TEXT: this.$store.getters.TEXT,
      isPwd_notion: false,
      isPwd_priv: false,
      isPwd_pub: false,
      user_details: false,
      view_export: false,
      view_import: false,
      val: "normal",
      email_server_available: false,
    };
  },
  mounted() {
    this.$store.dispatch("setProtectedMode", true);

    // CHECK IF MAIL SERVER IS AVAILABLE
    checkMail(this.$store.getters.SETTINGS.email_export).then((res) => {
      this.email_server_available = res;
    });
  },
  computed: {
    keyPair() {
      if (this.$store.getters.SETTINGS.user_keyPair === undefined)
        this.$store.getters.SETTINGS._USER.create();
      return this.$store.getters.SETTINGS.user_keyPair;
    },

    export_format: {
      get() {
        return this.$store.getters.SETTINGS.export_format;
      },
      set(val) {
        this.$store.commit("SETTINGS_SET", {
          field: "export_format",
          value: val,
        });
      },
    },
  },
  methods: {
    user_new() {
      const answ = confirm(this.TEXT.btn.confirm.new_user);
      if (!answ) return;
      this.$store.getters.SETTINGS._USER.create();
    },
    doImportData(data) {
      this.view_import = false;
      if (data === null || data === undefined) return;

      try {
        const json = JSON.parse(data);
        if (json === undefined || json === null) return;
        this.$store.getters.SETTINGS._USER.import(data);
      } catch {
        this.$q.notify({
          message: this.TEXT.error.format_wrong,
          color: "warning",
        });
      }
    },
  },
};
</script>

<style></style>
