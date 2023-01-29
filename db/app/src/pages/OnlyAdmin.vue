<template>
  <q-page class="column items-center">
   
    <HEADING :title="TEXT.title"  :img="'login-logo.png'"/>

    <div class="absolute-center">
      <q-banner class="bg-red">Zugriff nur für ADMIN</q-banner>
      <div class="q-mt-lg text-center">
        <q-btn no-caps rounded class="my-btn" @click="relogin()">{{ TEXT.btn_relogin }}</q-btn>
      </div>
    </div>

  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'

export default {
  name: 'OnlyAdmin',

  components: {HEADING },

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
