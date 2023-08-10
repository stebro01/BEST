<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'concept-import-logo.png'" :icon="'group'"/>
      </template>

      <template v-slot:options_right>
      <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- ADMIN -->
      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table q-mt-xl" :rows="USER" :columns="columns" row-key="USER_ID" dense
          :rows-per-page-options="[10, 25, 50, 100]" :filter="filter" selection="multiple" v-model:selected="selected">
        </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS :show_edit="selected.length === 1" :show_delete="selected.length > 0"
          :show_add="selected.length === 0" @edit="editUser(selected[0])" @delete="delectUser(selected)"
          @add="addUser()" />
      </template>

    </MainSlot>

    <DIALOG_USER_ADD v-if="show_add_user" :active="show_add_user" :mode="'add'" @close="show_add_user = false"
      @save="submitAddUser($event)" />

    <DIALOG_USER_ADD v-if="show_edit_user" :active="show_edit_user" :mode="'edit'" :USER_ID="selected[0].USER_ID"
      @close="show_edit_user = false" @save="submitUpdateUser($event)" />

  </q-page>
</template>

<script>

import MainSlot from 'src/components/MainSlot.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import FILTER_BOX from 'src/components/elements/FilterBox.vue'
import DIALOG_USER_ADD from 'src/components/user_management/Dialog_UserAdd.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'DBFunctions_ManageUsers',

  components: { BOTTOM_BUTTONS, HEADING, FILTER_BOX, DIALOG_USER_ADD, MainSlot },

  data() {
    return {
      USER: [],
      filter: undefined,
      selected: [],
      columns: [
        { name: 'COLUMN_CD', align: 'center', label: 'Gruppe', field: 'COLUMN_CD', sortable: true },
        { name: 'USER_CD', align: 'center', label: 'ID', field: 'USER_CD', sortable: true },
        { name: 'NAME_CHAR', align: 'center', label: 'Name', field: 'NAME_CHAR', sortable: true },
        { name: 'CONCEPT_BLOB', align: 'center', label: 'Beschr.', field: 'CONCEPT_BLOB', sortable: true },
      ],

      show_add_user: false,
      show_edit_user: false    }
  },

  mounted() {
    this.loadData() 
  },

  watch: {
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.manage_users
    }
  },

  methods: {
    loadData() {
      const query_string = "SELECT PROVIDER_DIMENSION.PROVIDER_ID as PROVIDER_ID, PROVIDER_DIMENSION.NAME_CHAR as NAME_CHAR, PROVIDER_DIMENSION.PROVIDER_PATH as PROVIDER_PATH, PROVIDER_DIMENSION.CONCEPT_BLOB as CONCEPT_BLOB, USER_MANAGEMENT.USER_ID as USER_ID, USER_MANAGEMENT.COLUMN_CD as COLUMN_CD, USER_MANAGEMENT.USER_CD as USER_CD, USER_MANAGEMENT.PASSWORD_CHAR as PASSWORD_CHAR FROM USER_MANAGEMENT LEFT JOIN PROVIDER_DIMENSION ON USER_MANAGEMENT.USER_CD = PROVIDER_DIMENSION.PROVIDER_ID;"
      this.$store.dispatch('runQuery', query_string)
      .then(res => {
        this.USER = res.data
        console.log(res.data)
      })
    },

    editUser() {
      this.show_edit_user = true
    },

    submitUpdateUser(val) {
      if (!val && !val.USER_ID) return this.$q.notify('Ungültige Daten')
      this.show_edit_user = false
      
      const where = {USER_ID: val.USER_ID}
      const set = val
      delete val.USER_ID
      
      this.$store.dispatch('updateUser', {set, where})
      .then(res => {
        this.selected = []
        this.loadData()
        this.$q.notify(this.$store.getters.TEXT.msg.save_successful)
      }).catch(err => this.$q.notify(err))

      
    },  

    async delectUser() {
      if (!await confirm(`Sollen die ausgewählte(n) Nutzer wirklich gelöscht werden?`)) return
      const promises = []
      this.selected.forEach(s => {
        if (s.USER_CD === 'admin') this.$q.notify('<<admin>> kann nicht gelöscht werden')
        else {
          promises.push(this.$store.dispatch('deleteUser', {USER_ID: s.USER_ID}))
        }
      })
      Promise.all(promises).finally(() => {
        this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
        this.loadData()
        this.selected = []
      })
    },

    // ADD USER
    addUser() {
      this.show_add_user = true
    },

    submitAddUser(val) {
      if (!val || !val.USER_CD || !val.NAME_CHAR || !val.PASSWORD_CHAR) return this.$q.notify('Daten sind unvollständig')
      this.$store.dispatch('addUser', val)
      .then(res => {
        if (res.status) {
          this.show_add_user = false
          this.$q.notify(this.$store.getters.TEXT.msg.save_successful)
          this.loadData()
        } else this.$q.notify(res.error)
      }).catch(err => this.$q.notify(err))

    }
  }

}
</script>
