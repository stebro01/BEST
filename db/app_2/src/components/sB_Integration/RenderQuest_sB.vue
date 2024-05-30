<template>
  <!-- TITLE -->
  <q-card v-if="QUEST !== undefined" flat class="my-quest-form">
    <!-- HEADING -->
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6" data-cy="quest_title">{{ QUEST.title }}</div>
          <div class="absolute-right">v{{ QUEST.coding.version }}</div>
          <!-- <div class="text-subtitle2">{{ QUEST.description }}</div> -->
        </div>
      </div>
    </q-card-section>

    <!-- MANUAL -->
    <!-- <q-card-section v-html="QUEST.manual"></q-card-section> -->

    <!-- PID -->
    <q-card-section>
      <q-input
        data-cy="PID"
        filled
        v-model="subject_pid"
        label="PID"
        :disable="true"
        :rules="[(val) => (val && val.length > 0) || 'Gültige PID eingeben']"
      />
      <!-- INVISIBLE ELEMENT TO DO THE AUTOFOCUS -->
      <q-input style="height: 0px; width: 0px" autofocus />
      <q-item-label
        v-if="submit_clicked && CHECK_PID === false"
        class="text-red"
      >
        Bitte vervollständigen
      </q-item-label>
    </q-card-section>

    <!-- ITEMS -->
    <q-card-section>
      <!-- QUEST ITEMS -->
      <q-list bordered separator data-cy="list_entries">
        <q-item
          v-for="(item, indQ) in QUEST.items"
          :key="item.label + indQ + key_suffix"
          data-cy="item_entry"
        >
          <q-item-section>
            <!-- DESCRIPTION -->
            <q-item-label title><span v-html="item.label" /></q-item-label>
            <q-item-label
              v-if="item.caption !== null || item.type === 'separator'"
              caption
              ><span v-html="item.caption"
            /></q-item-label>

            <!-- ITEM -->
            <!-- RADIO OR CHECKBOX -->
            <q-item-label
              v-if="item.type === 'radio' || item.type === 'checkbox'"
            >
              <RenderRadio
                :ITEM="item"
                @emitValue="item.value = $event"
                data-cy="text"
              />
            </q-item-label>
            <!-- TEXT OR NUMBER -->
            <q-item-label
              v-else-if="item.type === 'text' || item.type === 'number'"
            >
              <RenderText
                :ITEM="item"
                @emitValue="item.value = $event"
                data-cy="text"
              />
            </q-item-label>
            <!-- date -->
            <q-item-label
              v-else-if="item.type === 'date' || item.type === 'date_year'"
            >
              <RenderDate
                :ITEM="item"
                @emitValue="item.value = $event"
                data-cy="slider"
              />
            </q-item-label>
            <!-- time -->
            <q-item-label v-else-if="item.type === 'time'">
              <RenderTime
                :ITEM="item"
                @emitValue="item.value = $event"
                data-cy="slider"
              />
            </q-item-label>
            <!-- SLIDER -->
            <q-item-label v-else-if="item.type === 'slider'">
              <RenderSlider
                :ITEM="item"
                @emitValue="item.value = $event"
                data-cy="slider"
              />
            </q-item-label>

            <q-item-label v-else-if="item.type === 'multiple_radio'">
              <RenderMultipleRadio
                :ITEM="item"
                :VALUE="QUEST.items[indQ].value"
                @emitValue="updateData('multiple_radio', indQ, $event)"
                data-cy="multiple_radio"
              />
            </q-item-label>

            <q-item-label v-else-if="item.type === 'image'">
              <span v-for="(img, imgind) of item.value" :key="imgind + 'img'">
                <img
                  :src="`img/${img}`"
                  alt=""
                  :style="`width: ${item.width}px`"
                />
              </span>
            </q-item-label>
            <!-- ENDE ITEM -->

            <!-- COMPLETE? -->
            <q-item-label
              v-if="
                submit_clicked &&
                CHECK_FORM !== true &&
                CHECK_FORM[indQ] === false
              "
              class="text-red"
            >
              Bitte vervollständigen
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- FORM BUTTON -->
    <q-card-section>
      <div class="text-center q-pb-xl">
        <q-btn
          rounded
          label="abschließen"
          type="submit"
          color="primary"
          @click="emitEvent()"
          data-cy="submitquest"
          class="my-btn"
        />
      </div>
    </q-card-section>
  </q-card>

  <div v-else class="q-ma-xl text-center">QUEST: undefined</div>

  <!-- FORM ENDE -->
</template>

<script>
import RenderSlider from "./RenderQuest_slider.vue";
import RenderMultipleRadio from "./RenderQuest_multipleradio.vue";
import RenderDate from "./RenderQuest_date.vue";
import RenderTime from "./RenderQuest_time.vue";
import RenderText from "./RenderQuest_text.vue";
import RenderRadio from "./RenderQuest_radio.vue";

import { QuestMan } from "src/classes/QuestMan_class";
import * as CDA from "../../../EXTERN/CDA_H7_JSON";
import { uuidv4, generateKeys } from "../../../EXTERN/hhash";

import myMixins from "src/mixins/modes_msg";

export default {
  name: "RenderQuest",
  components: {
    RenderSlider,
    RenderMultipleRadio,
    RenderDate,
    RenderTime,
    RenderText,
    RenderRadio,
  },
  props: ["PREVIEWQUEST", "PID"],
  mixins: [myMixins],

  data() {
    return {
      submit_clicked: false,
      check_form: null,
      key_suffix: Date.now(),
      QUESTMAN: undefined,
      CDA: undefined,
    };
  },

  mounted() {
    console.log("QUEST mounted");
    const QUESTMAN = new QuestMan({ init: false });
    QUESTMAN._activeQuest = {
      value: this.PREVIEWQUEST,
      date_start: Date.now(),
      label: this.PREVIEWQUEST.short_title,
    };
    this.QUESTMAN = QUESTMAN;
  },

  computed: {
    QUEST() {
      if (this.CDA !== undefined) return undefined;
      if (this.PREVIEWQUEST !== undefined) return this.PREVIEWQUEST;
      // else
      return undefined;
    },

    CHECK_PID() {
      if (this.subject_pid === null) return false;
      return this.subject_pid.length > 0;
    },

    CHECK_FORM() {
      return this.check_form;
    },

    subject_pid() {
      return this.PID;
    },
  },
  methods: {
    updateData(action, index, value) {
      switch (action) {
        case "multiple_radio":
          this.QUEST.items[index]["value"] = value;
          break;
        default:
          console.log(`updateData: ${action} not found!`);
          return;
      }
    },

    emitEvent() {
      this.submit_clicked = true;
      this.key_suffix = Date.now();
      this.check_form = this.QUESTMAN.check_activeQuest();
      var str = "";
      if (this.CHECK_PID === false) str += "PID fehlt. ";
      if (this.check_form !== true) str += "Fragebogen nicht komplett. ";
      if (str.length > 0) return this._error_msg(str);

      // ELSE STORE THE DATA
      const document = CDA.import_quest({
        data: {
          PID: this.subject_pid,
          quest: this.QUESTMAN.summary,
        },
        investigator: {
          uid: `${this.$store.getters.USER.USER_CD}-${uuidv4()}`,
          keyPair: generateKeys(), // to sign the document
        },
      });
      this.$emit("emitValue", document);
    },
  },
};
</script>
