<template>

  <div :data-cy="'quest_'+QUEST.short_title">

  <!-- PROTECTED -->
  <q-chip v-if="PARAMS.mode === 'encrypted'" icon="lock" class="absolute-top-left z-top" />
  <!-- TITLE -->
  <q-card v-if="QUEST !== undefined" flat  class="my-quest-form">
    <!-- HEADING -->
    <q-card-section>
      <div class="row items-center no-wrap">

        <div class="col-auto" v-if="$store.getters.DEBUG_MODE || subject_pid==='DEMO'">
          <q-btn  color="grey-7" round flat icon="more_vert" data-cy="btn_hidden_options">
            <q-menu cover auto-close>
              <q-list>

                <q-item  class="my-btn text-center" data-cy="btn_random_fill" clickable @click="randomFill()">
                  <q-item-section >random_fill</q-item-section>
                </q-item>
                <q-separator/>
                <q-item  class="my-btn text-center" data-cy="btn_reload_quest" clickable @click="rebuildQuests()">
                  <q-item-section >rebuild</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <div class="col">
          <div class="text-h6" data-cy="quest_title"> {{ QUEST.title }} </div>
          <!-- <div class="text-subtitle2">{{ QUEST.description }}</div> -->
        </div>

      </div>
    </q-card-section>

    <!-- MANUAL -->
    <q-card-section v-html="QUEST.manual"></q-card-section>

    <!-- PID -->
    <q-card-section>
      <q-input data-cy="PID" filled v-model="subject_pid" :label="TEXT.quest.pid" :hint="PID_HINT_TEXT"
        :rules="[ val => val && val.length > 0 || TEXT.quest.pid_hint]" :disable="PARAMS.PID !== undefined" />
        <!-- INVISIBLE ELEMENT TO DO THE AUTOFOCUS -->
        <q-input style="height: 0px; width: 0px" autofocus />
    </q-card-section>

    <!-- ITEMS -->
    <q-card-section>

      <!-- QUEST ITEMS -->
      <q-list bordered separator data-cy="list_entries">

        <q-item v-for="(item, indQ) in QUEST.items" :key="item.label + indQ + key_suffix" data-cy="item_entry">
          <q-item-section>
            <!-- DESCRIPTION -->
            <q-item-label title><span v-html="item.label"/></q-item-label>
            <q-item-label v-if="item.caption !== null || item.type === 'separator'" caption><span v-html="item.caption"/></q-item-label>

<!-- ITEM -->
            <!-- RADIO OR CHECKBOX -->
            <q-item-label v-if="(item.type === 'radio') || (item.type === 'checkbox')">
              <RenderRadio :ITEM="item" @emitValue="item.value = $event" data-cy="text"/>
            </q-item-label>
            <!-- TEXT OR NUMBER -->
            <q-item-label v-else-if="(item.type === 'text') || (item.type === 'number') ">
              <RenderText :ITEM="item" @emitValue="item.value = $event" data-cy="text"/>
            </q-item-label>
            <!-- date -->
            <q-item-label v-else-if="(item.type === 'date' ||item.type === 'date_year')">
              <RenderDate :ITEM="item" @emitValue="item.value = $event" data-cy="slider"/>
            </q-item-label>
            <!-- time -->
            <q-item-label v-else-if="(item.type === 'time')">
              <RenderTime :ITEM="item" @emitValue="item.value = $event" data-cy="slider"/>
            </q-item-label>
            <!-- SLIDER -->
            <q-item-label v-else-if="(item.type === 'slider')">
              <RenderSlider :ITEM="item" @emitValue="item.value = $event" data-cy="slider"/>
            </q-item-label>

            <q-item-label v-else-if="(item.type === 'multiple_radio')">
              <RenderMultipleRadio :ITEM="item" :VALUE="QUEST.items[indQ].value" @emitValue="updateData('multiple_radio', indQ, $event)" data-cy="multiple_radio" />
            </q-item-label>

            <q-item-label v-else-if="(item.type === 'image')">
              <span v-for="(img, imgind) of item.value" :key="imgind+'img'">
              <img :src="`img/${img}`" alt="" :style="`width: ${item.width}px`">
              </span>
            </q-item-label>

<!-- ENDE ITEM -->

            <!-- COMPLETE? -->
            <q-item-label v-if="submit_clicked && CHECK_FORM !== true && CHECK_FORM[indQ] === false"
              class="text-red"
            >
              {{TEXT.quest.please_complete}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- FORM BUTTON -->
    <q-card-section v-if="PREVIEWQUEST === undefined">
      <div class="text-center q-pb-xl">
          <q-btn rounded :label="TEXT.btn.submit" type="submit" color="primary" @click="emitEvent()" data-cy="submitquest" class="my-btn" />
      </div>
    </q-card-section>

    <!-- CHECK ERROR -->
    <span v-if="submit_clicked && (CHECK_FORM !== true || CHECK_PID !== true)" data-cy="check_error_banner"></span>
    <!-- CHECK SUCCESS -->
    <span v-if="CHECK_PID && CHECK_FORM" data-cy="check_sucess"></span>
  </q-card>
  <div v-else class="q-ma-xl text-center">
    QUEST: undefined
  </div>

  </div>

  <!-- FORM ENDE -->

</template>


<script>
import RenderSlider from './RenderQuest_slider.vue'
import RenderMultipleRadio from './RenderQuest_multipleradio.vue'
import RenderDate from './RenderQuest_date.vue'
import RenderTime from './RenderQuest_time.vue'
import RenderText from './RenderQuest_text.vue'
import RenderRadio from './RenderQuest_radio.vue'

export default {
  name: 'RenderQuest',
  components: { RenderSlider, RenderMultipleRadio, RenderDate, RenderTime, RenderText, RenderRadio },
  props: ["QUEST_LABEL", "saved", "PID", "PREVIEWQUEST"],

  data() {
    return {
      TEST: 0,
      TEXT: this.$store.state.TEXT,
        check_pid: false,
        check_form: undefined,
        submit_clicked: false,
      subject_pid: '',
      age: null,
      key_suffix: Date.now()
    }
  },

  mounted() {
    console.log('QUEST mounted')
    if (this.PARAMS.PID !== undefined) this.subject_pid = this.PARAMS.PID
  },

  computed: {
    PID_HINT_TEXT() {
      if (this.PARAMS.PID !== undefined) return ''
      return this.TEXT.quest.pid_hint
    },
    PARAMS() {
      if (this.PREVIEWQUEST !== undefined) return {}
      if (this.$route.params.id === undefined) return undefined
      return JSON.parse(this.$route.params.id)
    },
    QUEST() {
      if (this.PREVIEWQUEST !== undefined) return this.PREVIEWQUEST
      return this.$store.getters.ACTIVE_QUEST
    },
    CHECK_PID() {
      return (this.subject_pid.length > 0)
    },
    CHECK_FORM() {
      return this.check_form
    }
  },
  methods: {
    updateData(action, index, value) {
      switch (action) {
        case 'multiple_radio':
          this.QUEST.items[index]['value'] = value
          break
        default:
          console.log(`updateData: ${action} not found!`)
          return
      }

    },

    randomFill() {
      this.$store.state.QuestMan.random_fill()
      // refresh
      this.subject_pid = this.subject_pid || Date.now().toString()
      this.key_suffix = this.subject_pid
    },
    rebuildQuests() {
      const answ = confirm(this.TEXT.btn.reset_confirm)
      if (!answ) return
      //else
      this.$store.getters.QUESTMAN._init()
    },
    emitEvent() {
      // FIRST CHECK THE FORM

      this.submit_clicked = true;
      this.check_form = this.$store.getters.QUESTMAN.check_activeQuest();
      this.key_suffix = Date.now() //update the quest for
      var str = ''

      // console.log(this.$store.getters.QUESTMAN.summary)

      if (this.CHECK_PID === false) str += this.TEXT.quest.PID_missing;
      if (this.check_form !== true) str += this.TEXT.quest.check_failed;
      if (str.length > 0) {this.$q.notify({
          message: str,
          color: 'warning'
        })
        return false
      }

      this.$emit('emitForm', {
        "PID": this.subject_pid,
        "quest": this.$store.getters.QUESTMAN.summary
      })
    }

  }
}
</script>
