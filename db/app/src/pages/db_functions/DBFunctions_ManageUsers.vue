<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'concept-import-logo.png'" :icon="'group'" />
      </template>

      <template v-slot:options_right>
        <FILTER_BOX :filter="filter" @update="filter = $event" />
      </template>

      <!-- ADMIN -->
      <!-- MAIN -->
      <template v-slot:main>
        <q-table class="my-table q-mt-xl non-selectable" :rows="USER" :columns="columns" row-key="USER_ID" dense
          :rows-per-page-options="[10, 25, 50, 100]" :filter="filter">
          <!-- CONTENT -->
          <template v-slot:body="props">

            <q-tr :props="props">
              <!-- ACTION -->
              <q-td >
                <q-btn size="sm" dense flat round icon="edit" @click="editUser(props.row)" />
                <q-btn size="sm" dense flat round icon="delete" @click="deleteUser(props.row)" />
              </q-td>

              <!-- COLUMN_CD -->
              <q-td key="COLUMN_CD" :props="props">
                <q-chip size="sm" dense>{{ props.row.COLUMN_CD }}</q-chip>
              </q-td>
              <!-- USER_CD -->
              <q-td key="USER_CD" :props="props">
                {{ props.row.USER_CD }}
              </q-td>
              <!-- NAME_CHAR -->
              <q-td key="NAME_CHAR" :props="props" >
                {{ props.row.NAME_CHAR }} 
              </q-td>

              <!-- PROVIDER_PATH -->
              <q-td key="PROVIDER_PATH" :props="props" >
                {{ props.row.PROVIDER_PATH }} 
              </q-td>

              <!-- CONCEPT_BLOB -->
              <q-td key="CONCEPT_BLOB" :props="props">
                {{ props.row.CONCEPT_BLOB }}
              </q-td>

            </q-tr>

          </template>


        </q-table>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>
        <BOTTOM_BUTTONS
          :show_add="true" @add="addUser()" />
      </template>

    </MainSlot>

    <DIALOG_USER_ADD v-if="show_add_user" :active="show_add_user" :mode="'add'" @close="show_add_user = false"
      @save="submitAddUser($event)" />

    <DIALOG_USER_ADD v-if="show_edit_user" :active="show_edit_user" :mode="'edit'" :USER_ID="selected_user.USER_ID"
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
      selected_user: undefined,
      columns: [
      { name: 'action', align: 'center', label: '', field: 'action', sortable: true },
        { name: 'COLUMN_CD', align: 'center', label: 'Gruppe', field: 'COLUMN_CD', sortable: true },
        { name: 'USER_CD', align: 'left', label: 'ID', field: 'USER_CD', sortable: true },
        { name: 'NAME_CHAR', align: 'left', label: 'Name', field: 'NAME_CHAR', sortable: true },
        { name: 'PROVIDER_PATH', align: 'left', label: 'Zuordnung', field: 'PROVIDER_PATH', sortable: true },
        { name: 'CONCEPT_BLOB', align: 'left', label: 'Beschr.', field: 'CONCEPT_BLOB', sortable: true },
      ],

      show_add_user: false,
      show_edit_user: false
    }
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
        })
    },

    editUser(item) {
      this.selected_user = item
      this.show_edit_user = true
    },

    submitUpdateUser(item) {
      if (!item && !item.USER_ID) return this.$q.notify('Ungültige Daten')
      this.show_edit_user = false

      this.$store.dispatch('updateUser', item)
        .then(res => {
          if (res.status) {
            this.selected_user = []
            this.loadData()
            this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
          } 
          else this.$q.notify(res.data)
        }).catch(err => this.$q.notify(`err: ${err}`))
    },

    async deleteUser(item) {
      if (!await my_confirm(`Sollen die ausgewählte(n) Nutzer wirklich gelöscht werden?`)) return
      if (item.USER_CD === 'admin') this.$q.notify('<<admin>> kann nicht gelöscht werden')
      else this.$store.dispatch('deleteUser', { USER_CD: item.USER_CD, USER_ID: item.USER_ID })
        .then(res => {
          this.loadData()
          this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
        }).catch(err => {
          this.$q.notify(err)})
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
