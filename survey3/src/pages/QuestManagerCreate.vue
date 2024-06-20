<template>
  <q-page data-cy="questman_create" class="page-size">
    <div class="column items-center" style="height: 100%">
      <div class="col-1 q-pt-md text-h6">
       {{ TEXT.settings.questman.create.label }}
      </div>

      <div v-if="content !== null" class="col q-py-md text-center">
        <!-- AUSWAHL FRAGEBÖGEN -->
        <div class="text-caption text-grey">{{ TEXT.settings.questman.create.description }}</div>
        <q-scroll-area class="shadow-1 my-form" >
          <q-list bordered separator class="quest_list" data-cy="questlistRoot">
            <!-- DESCRIPITON -->
            <q-expansion-item
              data-cy="btn_description"
              expand-separator
              icon="description"
              :label="content.title || TEXT.settings.questman.create.please_fill"
              :caption="TEXT.settings.questman.create.general_information"
              class="bg-grey-1 q-pa-sm"
            >
              <q-input data-cy="quest_title" v-model="content.title" dense label="Titel" />
              <q-input  v-model="content.short_title" dense label="Kurzer Titel (Klein, keine Sonderzeichen / Leerzeichen)" />
              <q-input  v-model="content.description" dense label="Beschreibung" />
              <q-input  v-model="content.manual" dense label="Anleitung" />
              <q-input  v-model="content.keywords" dense label="Schlüsselworte / Suchworte" />
              <q-input  v-model="content.ref" dense label="Verweis auf Literatur: i.e. Pubmed-Link" />
              <q-input readonly dense label="Coding System">
                <template v-slot:append>
              <q-btn-dropdown no-caps color="dark" flat :label="content.coding.system">
                <q-list>
                  <q-item clickable v-close-popup @click="content.coding.system = 'http://snomed.info/sct'">
                    <q-item-section>
                      <q-item-label>http://snomed.info/sct</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="content.coding.system = 'http://loinc.org'">
                    <q-item-section>
                      <q-item-label>http://loinc.org</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn flat round icon="search" size="xs" @click="open_coding(content.coding.system)"/>
              </template>
              </q-input>
              <q-input  v-model="content.coding.code" dense label="Coding Code" />
              <q-input  v-model="content.coding.display" dense label="Coding Anzeige" />
            </q-expansion-item>

            <!-- ITEMS -->
            <q-expansion-item
              expand-separator
              icon="border_color"
              :label="`Items (${content.items.length})`"
              :caption="TEXT.settings.questman.create.single_items"
              class="bg-grey-1"
              data-cy="btn_items"
            >
              <!-- ALL ELEMENTS -->
              <div  class="q-pa-md row items-center q-y-gutter-sm" v-for="(item, inditem) in content.items" :key="inditem+date_str">
                <div class="col-11">
                  <q-expansion-item
                    :data-cy="`item_expanse_${inditem}`"
                    class="bg-grey-3"
                    v-model="expanded[inditem]"
                    :icon="return_icon_quest(item.type)"
                    :label="item.label"
                    :caption="item.type"
                  >
                  <CREATEITEM :item="item" :index="inditem" @updateItem="updateItem($event, item)" />
                  </q-expansion-item>
                </div>
                <div class="col-1">
                  <q-btn  color="grey-7" round flat icon="more_vert" data-cy="btn_options">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item v-if="inditem > 0" class="my-btn text-center" data-cy="back_root" clickable @click="moveItem('up', inditem)">
                          <q-item-section >{{TEXT.btn.up.label}}</q-item-section>
                        </q-item>
                        <q-separator/>
                        <q-item  class="my-btn text-center" data-cy="back_root" clickable @click="removeItem(inditem)">
                          <q-item-section >{{TEXT.btn.delete.label}}</q-item-section>
                        </q-item>
                        <q-item  class="my-btn text-center" data-cy="back_root" clickable @click="copyItem(inditem)">
                          <q-item-section >{{TEXT.btn.duplicate.label}}</q-item-section>
                        </q-item>
                        <q-item  class="my-btn text-center" data-cy="back_root" clickable @click="previewItem(item)">
                          <q-item-section >{{TEXT.btn.preview.label}}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>

              <!-- ADD BUTTON -->
              <q-btn data-cy="btn_items_add" class="q-my-md" icon="add" @click="addItem()" />

            </q-expansion-item>

            <!-- RESULTS -->
            <q-expansion-item
              expand-separator
              icon="poll"
              :label="TEXT.settings.questman.create.results"
              :caption="TEXT.settings.questman.create.results_details"
              class="bg-grey-1"
            >
              <CREATERESULTS :results="content.results" @updateResult="updateResult($event)"/>

            <!-- ENDE RESULTS -->
            </q-expansion-item>

          <!-- ENDE SCROLL AREA -->
          </q-list>
        </q-scroll-area>
      </div>

      <!-- ACTIONBTTNS -->
      <div class="col-2 text-center q-gutter-md justify-around" style="width: 100%">
          <MYBUTTON data-cy="btn_preview" :icon="TEXT.btn.preview.icon"  @click="preview" :label="TEXT.btn.preview.label" />
          <br>
          <MYBUTTON @click="saveQuest()" :label="TEXT.btn.save.label" />
          <MYBUTTON @click="exportQuest()" :label="TEXT.btn.export.label_short" />
      </div>

      <!-- END COLUMN -->
    </div>

    <!-- PREVIEW -->
    <q-dialog
      v-model="show_preview"
      persistent
      maximized
    >
      <div class="column items-center bg-white ">
        <div class="col" style="width: 100%;">
          <PREVIEWITEM :content="content" :content_single_item="content_single_item"/>
        </div>

        <div class="col-1">
           <MYBUTTON :label="TEXT.btn.close.label" @click="show_preview = false" />
        </div>

      </div>
    </q-dialog>

    <!-- EXPORT -->
        <!-- PREVIEW -->
    <q-dialog
      v-model="show_export"
      persistent
      maximized
    >
      <q-card>
        <q-card-section class="relative">
          <div class="text-h6">Fragebogen export</div>
          <div class="text-caption">zum Exportieren in die Zwischenablage kopieren</div>
          <q-btn icon="save" @click="saveJson()" class="absolute-top-right q-mt-md q-mr-md"><q-tooltip>Speichere als JSON ab.</q-tooltip></q-btn>
        </q-card-section>
        <q-card-section>
          <q-input filled autogrow v-model="content_export" readonly />
        </q-card-section>
        <q-card-actions>
          <MYBUTTON :label="TEXT.btn.close.label" @click="show_export = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- BACKBUTTON -->
    <BACKBUTTON :go_back="true" />

  </q-page>
</template>

<script>

import { quest_template, item_template } from 'assets/questionnaires/list_quest'
import { uuidv4 } from 'src/tools/hhash'
import {log} from 'src/tools/Logger'
import myMixins from 'src/mixins/modes'

import BACKBUTTON from 'src/components/BackButton.vue'
import CREATEITEM from 'src/components/CreateItem.vue'
import CREATERESULTS from 'src/components/CreateResults.vue'
import PREVIEWITEM from 'src/components/PreviewItem.vue'
import MYBUTTON from 'src/components/MyButton.vue'


export default {
  name: 'QuestManagerCreate',
  mixins: [myMixins],
  components: {BACKBUTTON, CREATEITEM, CREATERESULTS, PREVIEWITEM, MYBUTTON},
  data () {
    return {
      TEXT: this.$store.getters.TEXT,
      content: null,
      content_single_item: null,
      content_export: null,
      show_preview: false,
      show_export: false,
      date_str: Date.now(),
      expanded: []
    }
  },
  mounted() {
    this.$store.dispatch('setProtectedMode', true);
    if (this.$store.state.editquest === undefined) {
      this.content = JSON.parse(JSON.stringify(quest_template))
      this.$store.state.editquest = this.content
    } else this.content = this.$store.state.editquest

  },
  computed: {

  },
// METHODS
  methods: {
    open_coding(val){
      var link = undefined
      switch(val) {
        case 'http://snomed.info/sct':
          link = 'https://browser.ihtsdotools.org/?perspective=full&conceptId1=450741005&edition=MAIN/2021-01-31&release=&languages=en'
          break
        case 'http://loinc.org':
          link = 'https://loinc.org/search/'
          break
        default:
          //do nothing
          break
      }
      if (link === undefined) return
      // else
      window.open(link, '_blank');
    },
    return_icon_quest(type) {
      switch(type) {
        case 'radio':
        case 'multiple_radio':
          return 'radio_button_checked'
        case 'checkbox':
          return 'check_box_outline_blank'
        case 'separator':
          return 'minimize'
        default:
          return 'text_snippet'
      }
    },
    preview() {
      this.content_single_item = null
      this.show_preview = true
    },
    previewItem(item) {
      this.content_single_item = JSON.parse(JSON.stringify(this.content))
      this.content_single_item.items = []
      this.content_single_item.items.push(item)
      this.show_preview = true
    },

    updateID() { //loop through the quest and update the ID for each questions
      var id = 1
      this.content.items.forEach(item => {
        switch(item.type) {
          case 'separator':
            item['id'] = undefined
            item['coding'] = undefined
            break
          case 'multiple_radio':
            let local_id = []
            if (item.options !== undefined && item.options.questions !== undefined) {
              item.options.questions.forEach(q => {
                q['id'] = id
                local_id.push(id)
                id ++
              })
              item['id'] = JSON.stringify(local_id)
            }
            break
          default:
            item['id'] = id
            id ++
            break
        }
      });
    },
    addItem() {
      const item = JSON.parse(JSON.stringify(item_template))
      item.label = uuidv4()
      item.id = undefined
      item.force = false
      this.content.items.push(item)
      // update id
      this.updateID()
    },
    removeItem(index) {
      this.content.items.splice(index,1)
      // update id
      this.updateID()
    },
    copyItem(index) {
      if (index === undefined) return false
      const item = JSON.parse(JSON.stringify(this.content.items[index]))
      item.id = -1
      this.content.items.push(item)
      // update id
      this.updateID()
    },
    updateItem(payload, item) {
      item[payload.field] = payload.value
      this.date_str = Date.now()
      // update id (nur wenn updateID == true >> sollte nur durch CreateItem>Add/Remove MultiQuest ausgelöst werden)
      if (payload.updateID) this.updateID()
    },
    updateResult(payload) {
      this.content[payload.field] = payload.value
      this.date_str = Date.now()

    },
    saveQuest() {
      if (this.content.short_title === null || this.content.short_title === "") {confirm("ShortTitle muss vergeben werden!"); log({error: 'kein Shorttitle'});return}

      // check if short_title exists
      if (this.$store.getters.QUEST_LIST.includes(this.content.short_title)) {
        const answ = confirm("Fragebogen/ShortTitle existiert schon. Vorhandenen überschreiben?")
        if (!answ) return
        this.$store.getters.QUESTMAN.remove_by_name(this.content.short_title)
      }

      this.$store.getters.QUESTMAN.add(JSON.stringify(this.content))
      this.$q.notify({ message: this.TEXT.quest.export_success, color: 'green' })
    },
    exportQuest() {
      this.content_export = JSON.stringify(this.content)
      this.show_export = true
    },
    moveItem(action, index) {
      if (index === undefined || index === 0) return
      switch (action) {
        default:
          const tmp = this.content.items[index]
          this.content.items[index] = this.content.items[index-1]
          this.content.items[index-1] = tmp
          break
      }
      this.date_str = Date.now() //this triggers an update of the v-for
    },

    saveJson() {
      // save the JSON to the local file system
      const jsonContent = JSON.stringify(this.content, null, 2); // Das zweite Argument `null` ist der replacer und das dritte Argument `2` gibt die Anzahl der Leerzeichen an, die für die Einrückung verwendet werden.
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quest_${this.content.short_title}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
}
</script>
