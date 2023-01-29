<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header  v-if="!$store.getters.PROTECTED_MODE" class="bg-grey-2 " bordered >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="black"
          icon="menu"
          aria-label="Menu"
          @click="$store.state.leftDrawerOpen = !$store.state.leftDrawerOpen"
          data-cy="main_drawer"
        />

        <q-toolbar-title @click="$router.push('/').catch(()=>{})" class="text-black">
          {{ TEXT.label }}
        </q-toolbar-title>

        <div @click="$router.push('about').catch(()=>{})" class="text-grey-6"> {{ app_version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="$store.state.leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >

      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <!-- Essential Links -->
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :data-cy="'link_'+link.title"
        />

      </q-list>

      <div class="fixed-bottom text-center q-mb-xl" style="opacity: 0.5;">
        <q-img 
            src="~assets/favicon.svg"
            style="height: 100px; width: 100px; "
            @click="$store.state.leftDrawerOpen = false, $router.push({name: 'about'}).catch(() => {})"
          />

      </div>

    </q-drawer>
    <q-page-container :class="bodysize">
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
  mounted() {
    this.$store.state.leftDrawerOpen = false
  },
  data() {
    return {
      TEXT: this.$store.state.TEXT,
      essentialLinks: this.$store.state.TEXT.essentialLinks,
      app_title: this.$store.getters.ENV.APP_NAME,
      app_version: `${this.$store.getters.ENV.APP_VERSION}-${this.$store.getters.ENV.APP_UPDATED}`
    }
  },
  computed: {
    bodysize() {
      return {
        'body-normal': this.$store.getters.SETTINGS.size === 'normal',
        'body-bigger': this.$store.getters.SETTINGS.size === 'bigger',
        'body-biggest': this.$store.getters.SETTINGS.size === 'biggest'
      }
    }
  }
}
</script>
