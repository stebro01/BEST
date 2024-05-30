<template>
   <!-- CONCEPT_PATH_DIALOG -->
    <q-dialog v-model="ACTIVE">
      <q-card class="my-card">
        <q-btn icon="close" round flat class="absolute-top-right z-top" v-close-popup />
        <q-card-section>Edit Answers</q-card-section>
          <!-- SEARCHBOX -->
        <q-card-section v-if="ANSWERS && ANSWERS.length > 0">
          <q-list dense>
            <!-- HEADER -->
            <q-item class="my-small-text bg-grey-2">
              <q-item-section>Wert</q-item-section>
              <q-item-section>CONCEPT_CD</q-item-section>
              <q-item-section side></q-item-section>
            </q-item>
            <!-- CONTENT -->
            <q-item v-for="(item, ind) in ANSWERS.filter(el => el._delete !== true)" :key="ind + 'answers'">
              <q-item-section>{{ item.NAME_CHAR }}
                <q-popup-edit v-model="item.NAME_CHAR" buttons v-slot="scope">
                  <q-input v-model="scope.value" input-style="width: 400px" dense autofocus counter @keyup.enter="scope.set" @change="something_changed = true; item._update = true"/>
                </q-popup-edit>
              </q-item-section>
              <q-item-section class="my-small-text">
                {{item.SOURCESYSTEM_CD}}: {{ item.SHORT_CONCEPT }}
                <q-popup-edit v-model="item.SHORT_CONCEPT" buttons v-slot="scope">
                  <q-input v-model="scope.value" input-style="width: 400px" input-class="my-small-text" dense autofocus counter @keyup.enter="scope.set" @change="something_changed = true; item._update = true"/>
                </q-popup-edit>
              </q-item-section>
              <q-item-section side>
                <div>
                  <q-icon v-if="item.SOURCESYSTEM_CD === 'SNOMED-CT'" class="cursor-pointer" name="search" @click="queryAPI(item)"><q-tooltip>fragt die Snomed-API ab</q-tooltip></q-icon>
                  <q-icon class="cursor-pointer" name="content_copy" @click="duplicateItem(item)"><q-tooltip>Kopiert den Eintrag</q-tooltip></q-icon>
                <q-icon class="cursor-pointer" name="delete" @click="removeItem(item)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <!-- ADD / SPINNER -->
        <q-card-section>
          <div class="my-small-text text-center q-mt-sm">Zum Editieren Wert anclicken.</div>
          <div class="text-center">
            <q-spinner-ios v-if="$store.getters.SHOW_SPINNER" size="md"/>
            <q-btn v-else icon="add" round flat @click="addItem()"><q-tooltip>Neuen Eintrag hinzufügen</q-tooltip></q-btn>
          </div>
        </q-card-section>
        <!-- ACTIONS -->
        <q-card-actions align="center" v-if="something_changed">
          <q-btn rounded class="my-btn" @click="saveChanges()">speichern</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>


<script>
import { my_confirm } from "src/tools/my_dialog";

export default {
  name: 'EditConcept_Answers',

  props: ['active', 'CONCEPT'],


  data() {
    return {
      something_changed: false,
      ANSWERS: []
    }
  },

  mounted() {
    if (this.CONCEPT) this.loadAnswers(this.CONCEPT)
  },

  computed: {
    ACTIVE: {
      get() {
        return this.active
      }, set(val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    async loadAnswers(payload) {
      this.ANSWERS = await this.$store.dispatch('searchDB', {table: "CONCEPT_DIMENSION", query_string: {CONCEPT_PATH: `${payload.CONCEPT_PATH}\\${payload.CONCEPT_CD}\\LA`, _like: true}})
      for (let item of this.ANSWERS) {
        item._old_CONCEPT_CD = item.CONCEPT_CD
        // SPLIT by SOURCESYSTEM_CD
        let val = item.CONCEPT_CD.split(':')
        if (val.length === 2) item.SHORT_CONCEPT = val[1].trim()
        else item._invalid = true
      }
      this.something_changed = false
    },
    
    async removeItem(item) {
      if (!await my_confirm(`Sollen der Eintrag gelöscht werden? Änderung wird erst nach Speichern wirksam.`)) return
      item._delete = true
      this.something_changed = true

    },

    duplicateItem(item) {
      const new_item = JSON.parse(JSON.stringify(item))
      new_item.CONCEPT_CD += '_COPY'
      new_item.SHORT_CONCEPT += '_COPY'
      new_item.NAME_CHAR += '_COPY'
      new_item._new = true
      this.ANSWERS.push(new_item)
      this.something_changed = true
    },

    async addItem() {
      const OPTIONS = await this.$store.dispatch('getConceptList', `\\CONCEPT\\LA`)
      this.$q.dialog({
        title: 'Neuer Eintrag',
        message: 'Bitte wählen Sie das Koncept:',
        options: {
          type: 'radio',
          model: 'CUSTOM',
          // inline: true
          items: OPTIONS
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        const new_item = {
          SHORT_CONCEPT: 'NEW_VALUE',
          CONCEPT_CD: `${data}: NEW_VALUE`,
          CONCEPT_PATH: undefined,
          NAME_CHAR: 'NEW_VALUE',
          SOURCESYSTEM_CD: data,
          VALTYPE_CD: 'A',
          _new: true
        }
        this.ANSWERS.push(new_item)
        this.something_changed = true
      })
    },

    async queryAPI(item) {
      this.$q.dialog({
        dark: true,
        title: 'SNOMED API',
        message: 'Suchstring eingeben',
        prompt: {
          model: item.NAME_CHAR,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.querySNOMED_API_byName(data, item)
      })
    },

    async querySNOMED_API_byName(SNOMED_NAME, item) {
      if (!SNOMED_NAME) return this.$q.notify("Ungültige ID");
      const query = await this.$store.dispatch(
        "query_SNOMED_API_byName",
        SNOMED_NAME
      );
      if (!query || !query.items) return;

      //prepare dialog
      const items = [];
      query.items.forEach((i) => {
        items.push({
          label: i.term,
          value: { term: i.term, concept: i.concept.conceptId },
        });
      });

      this.$q
        .dialog({
          title: "SNOMED Abfrage",
          message: `Es wurden ${query.items.length} Einträge gefunden.`,
          options: {
            type: "radio",
            // model: 'opt1',
            // inline: true
            items: items,
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          if (data) {
            item.NAME_CHAR = data.term
            item.SHORT_CONCEPT = data.concept
            item._update = true
            this.something_changed = true
          }
          
        });
    },

    async saveChanges() {
      if (!await my_confirm(`Sollen die Änderungen so übernommen werden?`)) return
      const ERRORS = [] // f¨lle das mit FEHLER NAchrichten
      for (let item of this.ANSWERS) {
        // * ADD
        if (item._new && !item._delete) {
          item = this._update_item(item, this.CONCEPT)
          let res = await this._add_to_db(item)
          if (res !== undefined) ERRORS.push(res)
        }
        // * REMOVE
        else if (item._delete && !item._new) {
          let res = await this._delete_from_db(item) 
          if (res !== undefined) ERRORS.push(res)
        // * UPDATE
        } else if (item._update && !item._delete) {
          // UPDATE ELEMENT
          item = this._update_item(item, this.CONCEPT)
          let res = await this._update_db(item) 
          if (res !== undefined) ERRORS.push(res)
        }
      }
      if (ERRORS.length === 0) this.$q.notify('Aktion erfolgreich')
      else this.$q.dialog({
        title: 'Achtung, es sind Fehler / Warnungen aufgetreten',
        message: ERRORS.join('\n')
      })
      this.loadAnswers(this.CONCEPT)
    },

    _update_item(item, CONCEPT) {
      item.SHORT_CONCEPT = item.SHORT_CONCEPT.toUpperCase()
      var SOURCESYSTEM_CD = item.SOURCESYSTEM_CD
      if (SOURCESYSTEM_CD === 'LOINC') SOURCESYSTEM_CD = "LID"
      if (SOURCESYSTEM_CD === 'SNOMED-CT') SOURCESYSTEM_CD = "SCTID"
      item.CONCEPT_CD = `${SOURCESYSTEM_CD}: ${item.SHORT_CONCEPT}`
      // REMOVE '\\' at the end of CONCEPT.CONCEPT_PATH
      if (CONCEPT.CONCEPT_PATH.endsWith("\\")) CONCEPT.CONCEPT_PATH = CONCEPT.CONCEPT_PATH.slice(0, -1);
      item.CONCEPT_PATH = `${CONCEPT.CONCEPT_PATH}\\${CONCEPT.CONCEPT_CD}\\LA\\${item.SHORT_CONCEPT}`
      return item
    },

    async _add_to_db(item) {
      console.log('ADD: ', item)
      try {
        const res = await this.$store.dispatch('addDB', {table: 'CONCEPT_DIMENSION', query_string: item})
        if (res) return undefined
        else return `ADD "${item.CONCEPT_CD}": unbekannter Fehler`
      } catch (e) {
        return `ADD "${item.CONCEPT_CD}": ${e}`
      } 
    },

    async _update_db(item) {
      console.log('UPDATE: ', item)
      try {
        const res = await this.$store.dispatch('updateDB', {table: 'CONCEPT_DIMENSION', query_string: {
          where: {CONCEPT_CD: item._old_CONCEPT_CD}, set: item
        }})
        if (res) {
          if (item.CONCEPT_CD !== item._old_CONCEPT_CD) return `ACHTUNG: UPDATE "${item._old_CONCEPT_CD}" => "${item.CONCEPT_CD}": beim Ändern des Primary-Keys können bereits bestehende DB Einträge ungültig werden.`
          else return undefined
        }
        else return `UPDATE "${item.CONCEPT_CD}": unbekannter Fehler`
      } catch (e) {
        return `UPDATE "${item.CONCEPT_CD}": ${e}`
      } 
    },

    async _delete_from_db(item) {
      console.log('REMOVE: ', item)
      try {
        const res = await this.$store.dispatch('deleteDB', {table: 'CONCEPT_DIMENSION', query_string: {CONCEPT_CD: item.CONCEPT_CD}})
        if (res) return undefined
        else return `REMOVE "${item.CONCEPT_CD}": unbekannter Fehler`
      } catch (e) {
        return `REMOVE "${item.CONCEPT_CD}": ${e}`
      } 
    }
  }

}
</script>