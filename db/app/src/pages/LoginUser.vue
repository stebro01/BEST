<template>
  <q-page class="column items-center">
   
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'login-logo.png'"/>

    <div class="absolute-center">
      <q-card class="shadow-1 my-card">
        <q-card-section>
          <q-form dense @submit="loginUser(formData)">
          <div class="row text-center">
            
            <!-- ID -->
            <div class="col-4 q-mt-md" ><span >{{TEXT.ID}}</span></div>
            <div class="col-8"><q-input dense filled v-model="formData.USER_CD" lazy-rules :rules="[ val => val && val.length > 0 || $store.getters.TEXT.alerts.must_not_be_empty]"/></div>
            <!-- PASSWORD -->
            <div class="col-4 q-mt-sm "><span >{{ TEXT.PW }}</span></div>
            <div class="col-8">
              <q-input dense v-model="formData.PASSWORD_CHAR" filled :type="isPwd ? 'password' : 'text'"
                  lazy-rules :rules="[ val => val && val.length > 0 || $store.getters.TEXT.alerts.must_not_be_empty]" >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
            </div>
            <div class="col-12 q-mt-md"><q-btn rounded no-caps class="my-btn" type="submit">{{ $store.getters.TEXT.btn.login }}</q-btn></div>
          </div>
        </q-form>
        </q-card-section>
      </q-card>

    </div>

        <!-- LOGOUT BUTTON -->
        <div class="fixed-top-right q-mt-xl q-mr-md z-max">
          <q-btn v-show="$store.getters.CONNECTED" class="q-mt-xl" rounded color="black"  icon="logout" @click="closeDB()">
            <q-tooltip>Verbindung zur DB beenden. </q-tooltip>
              </q-btn>
      </div>

  </q-page>
</template>

<script>

import HEADING from 'src/components/elements/Heading.vue'

export default {
  name: 'LoginUser',

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
      return this.$store.getters.TEXT.page.login
    }
  },  

  methods: {
    loginUser(val) {
      this.$store.dispatch('loginUser', val)
      .then(res => {
        this.$q.notify(res)
        this.$router.push({name: 'Index'})
      }).catch(err => this.$q.notify(err))
    },

    closeDB(){
      this.$store.commit('CONNECTED_SET', false)
      this.$store.commit('USER_SET', undefined)
      this.$router.push({name: 'Start'})
    }
  }

}
</script>
