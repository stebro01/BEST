<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :img="'concept-import-logo.png'" :icon="'dashboard_customize'"/>
</template>

         <!-- MAIN -->
      <template v-slot:main>
      <q-card class="my-card shadow-1">
       
        <q-card-section>
          <div class="row q-gutter-y-sm">
            <!-- TITLE -->
            <div class="col-4 relative-position"><span class="absolute-center">Name🔑</span></div>
            <q-input class="col-8" dense filled v-model="formData.title"/>
            <!-- Beschreibung -->
            <div class="col-4 relative-position"><span class="absolute-center">Beschreibung</span></div>
            <q-input class="col-8" dense filled v-model="formData.description"/>
          </div>
        </q-card-section>
        <!-- SEPARATOR -->
        <q-separator/>
        <!-- ELEMENTE -->
        <q-card-section v-if="formData.data">
          <q-list dense bordered separator>
            <q-item v-for="(item, ind) in formData.data" :key="ind + 'item'"
               v-ripple
            >
            <q-item-section avatar>
              {{item.VALTYPE_CD}}
            </q-item-section>
              <q-item-section>
                {{ item.NAME_CHAR }}
              </q-item-section>
              <q-item-section side class="cursor-pointer" @click="removeItem(ind)"><q-icon name="close"/></q-item-section>
            </q-item>
        </q-list>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn color="primary"  round icon="add" @click="addItem()"/>
        </q-card-actions>
        
    </q-card>
    </template>

    <!-- FOOTER -->
    <template v-slot:footer>
      <BOTTOM_BUTTONS 
        :show_back="true" :show_save="FORM_VALID"
        @back="$router.push({name: 'DBFunctions_EditSchemes'})"
        @save="saveScheme(formData)"
      />
      </template>
    
    </MainSlot>

      <q-dialog v-model="show_select_concept" style="max-height: 100%">
      <CONCEPT_SELECT v-if="show_select_concept"
        :table="show_concept_dialog_table"
        @close="show_select_concept = false; show_concept_dialog_table = undefined"
        @clicked="conceptSelected($event)"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'
import HEADING from 'src/components/elements/Heading.vue'
import CONCEPT_SELECT from 'src/components/elements/ConceptSelect.vue'
import MainSlot from 'src/components/MainSlot.vue'

import { stringify } from 'src/classes/sqltools'
export default {
  name: 'DBFunctions_EditSchemes_New',

  components: { BOTTOM_BUTTONS, HEADING, CONCEPT_SELECT, MainSlot },

  data() {
    return {
      formData: {
        title: null, 
        description: null,
        data: []
      },
      show_select_concept: false,
      show_concept_dialog_table: undefined
     
    }
  },

  mounted() {
    
  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.schemes_new
    },

    FORM_VALID() {
      if (this.formData.title === null) return false
      if (this.formData.description === null) return false
      if (this.formData.data.length < 1) return false
      return true
    }
  },

  methods: {
    addItem() {
      this.show_select_concept = true
      this.show_concept_dialog_table = 'CONCEPT_DIMENSION'
    },

    removeItem(ind) {
      this.formData.data.splice(ind,1)
    },

    saveScheme(val) {
      var valid = true
      if (!val.title) valid = false
      if (!val.description) valid = false
      if (!val.data.length > 0) valid = false
      if (!valid) return this.$q.notify(this.$store.getters.TEXT.alerts.form_not_valid)
      //else
      const data = []
      val.data.forEach(d => data.push({CONCEPT_CD: d.CONCEPT_CD}))
      const SCHEME = {
        COLUMN_CD: 'SCHEME_CD',
        TABLE_CD: 'SCHEME_CD', 
        CODE_CD: val.title,
        NAME_CHAR: val.description,
        LOOKUP_BLOB: stringify({
          title: val.title,
          description: val.description,
          data: data
        })
      }

      this.$store.dispatch('addDB', {query_string: SCHEME, table: 'CODE_LOOKUP'})
      .then(res => {
        this.$q.notify(this.$store.getters.TEXT.msg.action_successful)
        this.$router.push({name: 'DBFunctions_EditSchemes'})
      }).catch(err => this.$q.notify(err))

    },

    conceptSelected(val) {
      let obj = this.formData.data.find(el => el.CONCEPT_CD === val.CONCEPT_CD)
      if (!obj) this.formData.data.push({CONCEPT_CD: val.CONCEPT_CD, NAME_CHAR: val.NAME_CHAR, VALTYPE_CD: val.VALTYPE_CD})
      else this.$q.notify(this.$store.getters.TEXT.msg.does_exist)
      this.show_concept_dialog_table = undefined
      this.show_select_concept = false
    }

  }

}
</script>
