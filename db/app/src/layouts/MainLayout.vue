<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header bordered class="bg-white text-primary non-selectable">
      <q-toolbar>

        <q-toolbar-title class="text-center">
          <q-avatar>
            <q-icon name="poll" />
          </q-avatar>
          {{ $store.getters.ENV.app.title }}
          <span class="text-caption">{{ $store.getters.ENV.app.version }}</span>
        </q-toolbar-title>

        <q-btn v-if="showHomeButton" flat rounded class="absolute-top-right q-mt-sm" icon="home" @click="this.$router.push({name: 'Start'})"/>
        <q-btn v-else flat rounded class="absolute-top-right q-mt-sm" icon="info" @click="this.$router.push({name: 'About'})"/>

        <q-btn v-if="showHomeButton && $route.name.includes('_')" icon="arrow_back_ios" flat rounded class="absolute-top-right q-mt-sm" style="right: 50px" @click="this.$router.go(-1)"/>
      </q-toolbar>
    </q-header>


    <!-- FOOTER -->
    <q-footer bordered class="bg-grey-2 text-primary text-center">
      <div class="row text-center text-caption">
        <div class="col-2">{{$route.path}}</div>
        <div v-if="$store.getters.ELECTRON_MODE" class="col">standard-mode</div>
        <div v-else class="col-7">debug-mode (no electron found)</div>
        <!-- USER BADGE -->
        <q-badge style="z-index: 10" :class="{'bg-orange-3': $store.getters.USER}">
          <span v-if="$store.getters.USER">
            <q-icon name="account_circle" > </q-icon>
            {{ $store.getters.USER.USER_CD }}
            <q-icon name="close" class="cursor-pointer" @click="logoutUser()">
              <q-tooltip>Abmeldung</q-tooltip>
            </q-icon>
          </span>
          <span v-else>
            <q-icon name="no_accounts" class="cursor-pointer" @click="$router.push({name: 'LoginUser'})">
              <q-tooltip>Anmeldung</q-tooltip>
            </q-icon>
          </span>
        </q-badge>
        <!-- CONNECTION BADGE -->
        <q-badge v-if="this.$store.getters.SETTINGS" class="text-grey-8" style="z-index: 10"
          :class="{'bg-green-4': $store.getters.CONNECTED, 'bg-grey-3': !$store.getters.CONNECTED}">
          <span class="q-mr-xs">
            <span v-if="$store.getters.CONNECTED">
            <q-icon  name="link">
              <q-tooltip>{{ $store.getters.SETTINGS_FILENAME }}</q-tooltip>
            </q-icon>

            </span>
            <q-icon v-else name="link_off">
              <q-tooltip> keine Datenbank geladen </q-tooltip>
            </q-icon>
          </span>
        </q-badge>
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


export default {
  name: 'MainLayout',

  components: {
    // EssentialLink
  },

    data() {
    return {
      leftDrawerOpen: false,
      // essentialLinks: this.$store.getters.ENV.linksList
    }
  },

  computed: {
    showHomeButton() {
      if (this.$route.name === 'Index') return false
      else return true
    }
  },

  mounted() {
    this.$store.commit('LOG', {method: 'MainLayout', message: 'mounted'})
    //detect the platform on first start
    this.$store.commit('ELECTRON_SET', this.$q.platform.is.electron )

    if (this.$store.getters.SETTINGS) this.$store.dispatch('connectDB')
    .then(() => {this.$store.dispatch('loginUser', {USER_CD: 'db', PASSWORD_CHAR: '123'})})
    .catch(err => {})
    
  },

  methods: {
    logoutUser() {
      if (!confirm(`Nutzer wirklich abmelden?`)) return
      this.$store.commit('USER_SET', undefined)
      this.$router.push({name: 'Start'})

    }

  }

}
</script>
