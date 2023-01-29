<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $store.getters.ENV.app.title }}
        </q-toolbar-title>

        <div>{{ $store.getters.ENV.app.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Aktionen
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- PAGE CONTAINER -->
    <q-page-container>

    <!-- INFO BADGE -->
    <q-badge v-if="this.$store.getters.SETTINGS" 
      class="absolute-top-right q-mt-xl  text-grey-8" style="z-index: 10"
      :class="{'bg-green-4': $store.getters.CONNECTED, 'bg-grey-3': !$store.getters.CONNECTED}"
      @click="connectDB()"
      >
        <span class="q-mr-xs">
        <q-icon v-if="$store.getters.CONNECTED" name="link"/>
        <q-icon v-else name="link_off"/>
        </span>

        <span>{{this.$store.getters.SETTINGS.filename}}</span>
        
        
      </q-badge>
      <!-- ROUTER -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'


export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

    data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: this.$store.getters.ENV.linksList
    }
  },

  mounted() {
    this.$store.commit('LOG', {method: 'MainLayout', message: 'mounted'})
    if (this.$store.getters.SETTINGS) this.$store.dispatch('connectDB').catch(err => {})
  },

  methods: {
      toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      connectDB() {
        if (!this.$store.getters.CONNECTED) this.$store.dispatch('connectDB').catch(err => this.$q.notify(err))
        else this.$store.dispatch('closeDB')
      }

  }

}
</script>
