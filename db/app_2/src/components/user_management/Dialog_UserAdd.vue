<template>
    <q-dialog v-model="ACTIVE">
        <q-card class="my-card q-pa-lg z-max">
          <q-btn flat round class="absolute-top-right z-top" icon="close" @click="$emit('close')"/>
          <q-card-section class="text-h6 q-pa-none">
            <span v-if="mode === 'add'">{{ TEXT.add_title }}</span>
            <span v-if="mode === 'edit'">{{ TEXT.edit_title }}</span>  
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-form @submit="$emit('save', formData)">
              <div class="row">
                <!-- TYP -->
                <div class="q-mt-sm col-4 text-center justify-center">Typ:</div>
                <div class="col-8 "><q-select filled dense v-model="formData.COLUMN_CD" :options="TEXT.options_type" lazy-rules :rules="[ val => val && val.length > 1 || 'Bitte einen Typ auswählen']"/></div>
                  <!-- ID -->
                <div class="q-mt-sm col-4 text-center justify-center">ID:</div>
                <div class="col-8 "><q-input filled dense v-model="formData.USER_CD" lazy-rules :rules="[ val => val && val.length > 2 || 'Mindestens 5 Zeichen']"/></div>
                <!-- NAME -->
                  <div class="q-mt-sm col-4 text-center justify-center">Name:</div>
                <div class="col-8 "><q-input filled dense v-model="formData.NAME_CHAR" lazy-rules :rules="[ val => val && val.length > 3 || 'Mindestens 5 Zeichen']"/></div>
                  <!-- PATH -->
                  <div class="q-mt-sm col-4 text-center justify-center">Zuordnung:</div>
                <div class="col-8 "><q-input filled dense v-model="formData.PROVIDER_PATH" lazy-rules :rules="[ val => val && val.length > 3 || 'Mindestens 5 Zeichen']"/></div>
                  <!-- BESCHREIBUNG -->
                <div class="q-mt-sm col-4 text-center justify-center">Beschreibung:</div>
                <div class="col-8 "><q-input filled dense v-model="formData.USER_BLOB"/></div>
                  <!-- PASW -->
                <div class="q-mt-lg col-4 text-center justify-center">Passwort:</div>
                <div v-if="mode==='add' || resetPwd" class="q-mt-md col-8 shadow-1">
                  <q-input dense v-model="formData.PASSWORD_CHAR" filled :type="isPwd ? 'password' : 'text'"
                  lazy-rules :rules="[ val => val && val.length > 4 || 'Mindestens 5 Zeichen']" >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div v-else-if="mode === 'edit' && !resetPwd">
                  <q-btn class="q-mt-md shadow-1" no-caps rounded flat @click="resetPwd = true">Passwort zurücksetzen</q-btn>
                </div>
                <!-- UPDATE -->
                <div class="col-12 q-mt-lg text-center">
                  <q-btn class="my-btn" no-caps rounded type="submit">{{$store.getters.TEXT.btn.save}}</q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
</template>


<script>
export default {
  name: 'Dialog_UserAdd',

  props: ['active', 'mode', 'USER_ID'],

  components: {  },

  data() {
    return {
      formData: {},
      isPwd: true,
      resetPwd: false
    }
  },

  mounted() {
    if (this.mode === 'edit' && this.USER_ID) this.loadUser(this.USER_ID)
    
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.manage_users
    }, 

    ACTIVE: {
        get() {
            return this.active
        },
        set(val) {

            this.$emit('close')
        }
    }
  },

  methods: {
    async loadUser(USER_ID) { 
      const res_user = await this.$store.dispatch('searchDB', {query_string: {USER_ID: USER_ID}, table: 'USER_MANAGEMENT'})
      if (!res_user || res_user.length === 0) return this.$q.notify({type: 'negative', message: 'User nicht gefunden'})
      const res_provider = await this.$store.dispatch('searchDB', {query_string: {PROVIDER_ID: res_user[0].USER_CD}, table: 'PROVIDER_DIMENSION'})
      
      this.formData = {USER_ID: res_user[0].USER_ID, USER_CD: res_user[0].USER_CD, NAME_CHAR: res_provider[0].NAME_CHAR, USER_BLOB: res_provider[0].CONCEPT_BLOB, COLUMN_CD: res_user[0].COLUMN_CD, PROVIDER_PATH: res_provider[0].PROVIDER_PATH}      
    }
  }






}
</script>