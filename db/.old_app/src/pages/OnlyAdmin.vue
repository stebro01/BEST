<template>
  <q-page>
    <MainSlot :no_footer="true" :no_options="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'login-logo.png'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="absolute-center">
          <q-banner class="bg-red">Zugriff nur für ADMIN</q-banner>
          <div class="q-mt-lg text-center">
            <q-btn no-caps rounded class="my-btn" @click="relogin()">{{ TEXT.btn_relogin }}</q-btn>
          </div>
        </div>
      </template>
    </MainSlot>
  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'OnlyAdmin',

  components: {HEADING, MainSlot },

  data() {
    return {
      formData: {},
      isPwd: true
    }
  },

  watch: {
    
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.only_admin
    }
  },  

  methods: {
    relogin() {
      this.$store.commit('USER_SET', undefined)
      this.$router.push({name: 'LoginUser'})
    }
  }

}
</script>
