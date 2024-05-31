<template>
  <q-layout view="lHh lpR fFf">
    <!-- HEADER -->
    <q-header bordered class="bg-white text-primary non-selectable">
      <q-toolbar>
        <PINNED_ELEMENTS
          :drawer_open="leftDrawerOpen"
          @clicked="changeDrawer($event)"
        />
        <q-toolbar-title class="text-center">
          <q-avatar>
            <q-icon name="poll" />
          </q-avatar>
          {{ $store.getters.ENV.app.title }}
          <span class="text-caption">{{ $store.getters.ENV.app.version }}</span>
        </q-toolbar-title>

        <q-btn
          v-if="showHomeButton"
          flat
          rounded
          class="absolute-top-right q-mt-sm"
          icon="arrow_back_ios"
          @click="this.$router.go(-1)"
        />
        <q-btn
          v-else
          flat
          rounded
          class="absolute-top-right q-mt-sm"
          icon="info"
          @click="this.$router.push({ name: 'About' })"
        />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      show-if-above
      :mini="true"
      mini-to-overlay
      :breakpoint="500"
      bordered
      class="bg-grey-9"
    >
      <div class="column fit q-pb-lg">
        <div class="col-10">
          <q-list padding>
            <q-item
              v-for="(item, ind) in essentialLinks"
              :key="ind + 'link'"
              clickable
              v-ripple
              @click="$router.push({ name: item.link })"
              :class="{ 'bg-dark': $route.path.indexOf(item.path) > -1 }"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" color="grey-4" />
                <q-tooltip>{{ item.label }}</q-tooltip>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-space />
          </q-list>
        </div>
        <div class="col-1">
          <q-item clickable v-ripple @click="$router.push({ name: 'Notes' })">
            <q-item-section avatar>
              <q-icon name="message" color="grey-4" />
              <q-tooltip>Notizen und Feedback</q-tooltip>
            </q-item-section>
          </q-item>
        </div>

        <div class="col-1">
          <q-item clickable v-ripple @click="closeDB">
            <q-item-section avatar>
              <q-icon name="logout" color="grey-4" />
              <q-tooltip>Logout</q-tooltip>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <!-- FOOTER -->
    <q-footer bordered class="bg-grey-2 text-primary text-center">
      <div class="row text-center text-caption">
        <div class="col-2">{{ ROUTE_PATH }}</div>
        <div v-if="$store.getters.ELECTRON_MODE" class="col">standard-mode</div>
        <div v-else class="col-7">debug-mode (no electron found)</div>
        <!-- USER BADGE -->
        <q-badge
          style="z-index: 10"
          :class="{ 'bg-orange-3': $store.getters.USER }"
        >
          <span v-if="$store.getters.USER">
            <q-icon name="account_circle"> </q-icon>
            {{ $store.getters.USER.USER_CD }}
          </span>
        </q-badge>
        <!-- CONNECTION BADGE -->
        <q-badge
          v-if="this.$store.getters.SETTINGS"
          class="text-grey-8"
          style="z-index: 10"
          :class="{ 'bg-green-4': CONNECTED, 'bg-grey-3': !CONNECTED }"
        >
          <span class="q-mr-xs">
            <span v-if="CONNECTED">
              <q-icon name="link">
                <q-tooltip>{{ $store.getters.SETTINGS_FILENAME }}</q-tooltip>
              </q-icon>
            </span>
            <q-icon v-else name="link_off">
              <q-tooltip> keine Datenbank geladen </q-tooltip>
            </q-icon>
          </span>
        </q-badge>
        <!-- DB IS UPT TO DATE -->
        <q-badge v-if="db_status_text && CONNECTED" color="white"
          ><q-icon v-if="db_is_uptodate" color="green" name="check" /><q-icon
            v-else
            class="cursor-pointer"
            @click="$router.push({ name: 'DBFunctions_Update' })"
            color="red"
            name="warning"
          /><q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            >{{ db_status_text }}</q-tooltip
          ></q-badge
        >
      </div>
    </q-footer>

    <!-- PAGE CONTAINER -->
    <q-page-container>
      <!-- ROUTER -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import PINNED_ELEMENTS from "src/components/elements/PinnedElements.vue";

export default {
  name: "MainLayout",

  components: { PINNED_ELEMENTS },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: this.$store.getters.ENV.essentialLinks,
      db_is_uptodate: false,
      db_status_text: undefined,
    };
  },
  watch: {
    CONNECTED(val) {
      if (val) this.check_db_date();
    },
  },

  computed: {
    showHomeButton() {
      if (this.$route.name === "Index") return false;
      else return true;
    },

    ROUTE_PATH() {
      var txt = this.$route.path;
      var index = txt.indexOf("[");
      if (index != -1) txt = txt.substring(0, index);
      return txt;
    },
    CONNECTED() {
      return this.$store.getters.CONNECTED;
    },
  },

  mounted() {
    this.$store.commit("LOG", { method: "MainLayout", message: "mounted" });
    this.$store.dispatch("initApp");
    if (this.$store.getters.ENV.app.autologin) {
      if (this.$store.getters.SETTINGS)
        this.$store
          .dispatch("connectDB")
          .then(() => {
            this.$store
              .dispatch("loginUser", {
                USER_CD: this.$store.getters.ENV.app.autologin_data.name,
                PASSWORD_CHAR:
                  this.$store.getters.ENV.app.autologin_data.password,
              })
              .then(() => {
                this.$router.push({ name: "Start" });
              });
          })
          .catch((err) => {});
    }

    this.check_db_date();
  },

  methods: {
    closeDB() {
      this.$q
        .dialog({
          title: "Nutzer abmelden",
          message: "Wollen Sie sich abmelden?",
          cancel: true,
        })
        .onOk(() => {
          this.$store.commit("USER_SET", undefined);
          this.$store.commit("CONNECTED_SET", false);
          this.$router.push({ name: "Start" });
        })
        .onCancel(() => {}); //do nothing
      // console.log(window.electron
    },

    changeDrawer(val) {
      this.leftDrawerOpen = val;
    },

    // check if db is up to date
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
            const db_app_version = this.$store.getters.ENV.app.db_version;
            this.db_status_text = `Exptected DB-Version: ${db_app_version}; Current DB-Version: ${db_version}`;
            if (db_version === db_app_version) this.db_is_uptodate = true;
            else this.db_is_uptodate = false;
          } else {
            this.db_status_text = "DB-Version unbekannt";
            this.db_is_uptodate = false;
          }
        });
    },
  },
};
</script>
