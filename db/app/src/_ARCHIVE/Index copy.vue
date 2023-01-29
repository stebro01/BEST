<template>
  <q-page class="flex flex-center">
    <div class="column text-center my-list-item">

      <div class="col text-h6">Startseite</div>

      <div class="col">
        <div> {{getaquote.quote}}</div>
        <div class="text-caption"> ({{getaquote.author}})</div>
      </div>

      <div class="col q-my-lg">
        <q-select v-model="active_user" :options="options_users" label="Nutzerprofil wählen" @blur="selectUser()"/>
      </div>

      <div class="col q-gutter-xl">
        <q-btn v-if="$store.getters.SETTINGS.user_type > 0" color="primary" no-caps @click="$router.push({name: 'Patients'})">Patienten suchen und eine Viste planen</q-btn>
      </div>
      
    </div>
    
  </q-page>
</template>

<script>

import QUOTES from '../../public/quotes.json'


export default {
  name: 'Index',

  data() {
    return {
      queryresult: {},
      users_list: undefined,
      datenow: Date.now(),
      active_user: this.$store.getters.SETTINGS.user || null
    }
  },

  components: {  },

  mounted() {
    // this.$store.dispatch('queryDB', 'SELECT label, password, type FROM users').then(res => {
    //   this.users_list = res
    // })
  },

  computed: {
    options_users() {
      if (!this.users_list) return []
      const users = []
      this.users_list.forEach(u => {
        users.push(u.label)
      })
      return users
    },

    getaquote() {
      const num = Math.floor((Math.random()*QUOTES.quotes.length));
      return QUOTES.quotes[num]
    }
  },

  methods: {
    commingSoon() {
      this.$q.notify('Comming soon ...')
    },

    selectUser() {
      this.$q.dialog({
        title: 'Passwort eingeben',
        message: `Bitte Passwort für '${this.active_user}' eingeben`,
        prompt: {
          model: '',
          type: 'password' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        var user = this.users_list.find(obj => {
          return obj.label === this.active_user
        })
        if (user.password === data) {
          this.$q.notify('Passwort korrekt')
          
          this.$store.commit('SETTINGS_SET', {label: 'user', value: this.active_user})
          this.$store.commit('SETTINGS_SET', {label: 'user_type', value: user.type})
          return
        } else {
          this.active_user = null
          this.$q.notify('Passwort korrekt')
          this.$store.commit('SETTINGS_SET', {label: 'user', value: null})
          this.$store.commit('SETTINGS_SET', {label: 'user_type', value: null})
          return
        }

      }).onCancel(() => {
        this.active_user = null
        this.$store.commit('SETTINGS_SET', {label: 'user', value: null})
        this.$store.commit('SETTINGS_SET', {label: 'user_type', value: null})
      })
    }
  }

}
</script>
