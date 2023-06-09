<template>
  <q-page data-cy="page_presets" class="page-size">
    <div class="column items-center" style="height: 100%">
      <div v-if="ISENCRYPTED" class="text-center">
         <a :href="CURRENTROUT" ><q-chip > ENCRYPTED ROUTE </q-chip></a>
         <div v-if="PARAMS.email" class="text-caption">Fragebögen werden gesendet an: {{PARAMS.email}}</div>
      </div>
     
      <!-- PARAMETER WURDEN FEFINIERT -->
      <div class="col-1 text-center q-ma-md text-h6">
        {{TEXT.quest.presets}}
      </div>

      <div class="col">
        <q-scroll-area class="q-ma-xs shadow-1 my-form">
          <div v-if="PARAMS !== undefined && PARAMS.presets !== undefined">
            <q-item class="bg-grey-1 q-ma-xs" v-for="(quest, index) in PARAMS.presets" :key="quest + '_'+ index">
              <q-item-section :data-cy="'quest_'+QUESTMAN.get(quest).short_title">
                {{QUESTMAN.get(quest).title}}
                <br>
                <span class="text-caption">{{QUESTMAN.get(quest).description}}</span>
              </q-item-section>
            </q-item>
          </div>
        </q-scroll-area>
      </div>

      <div class="col-4 q-gutter-xl q-mt-md q-mb-xl">
        <q-card>
          <q-card-section class="my-card">
            <q-input :disable="ISENCRYPTED" data-cy="PID" filled v-model="subject_pid" :label="PID_HINT_TEXT"
              :rules="[ val => val && val.length > 0 || TEXT.quest.pid_hint]" />
          </q-card-section>
        </q-card>
        <MYBUTTON :colored="true" data-cy="btn_preset_start"  @click="startQuest" :label="TEXT.btn.start_preset"/>
                
        <div v-if="!ISPROTECTED" class="col-1 text-center q-mt-md">
          <q-btn v-if="show_store_btn" flat size="xl" icon="save" color="primary" @click="save_preset" />
          <span class="text-caption text-grey-7">{{TEXT.btn.preset_save}}</span>
        </div>
      </div>

      <!-- ENDE COLUMN -->
    </div>

    <!-- ENCRYPTED ROUTE -->
    <q-page-sticky v-if="subject_pid !== null && !ISENCRYPTED" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="lock" color="dark" @click="make_route_encrypted">
        <q-tooltip>encrypted Route erzeugen</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- BACKBUTTON -->
    <BACKBUTTON />

  </q-page>
</template>

<script>
import myMixins from 'src/mixins/modes'
import BACKBUTTON from 'src/components/BackButton.vue'
import MYBUTTON from 'src/components/MyButton.vue'

export default {
  name: 'Preset',
  mixins: [myMixins],
  components: {BACKBUTTON, MYBUTTON},
  data() {
    return {
      TEXT: this.$store.state.TEXT,
      subject_pid: null,
      show_store_btn: true
    }
  },
  mounted() {
    // WURDE EINE PRESET ANGEGEBEN?
    this.$store.dispatch('setProtectedMode', true);
    this.$store.state.leftDrawerOpen = false
    if (this.PARAMS === null || this.PARAMS === undefined) return this.$router.push({name: 'select'})
    // PROTECTED MODE?
    if (this.PARAMS.PID !== undefined) this.subject_pid = this.PARAMS.PID
  },
  // COMPUTED
  computed: {
    PID_HINT_TEXT() {
      if (this.ISENCRYPTED) return ''
      return this.TEXT.quest.pid
    },
    QUESTMAN() {
      return this.$store.getters.QUESTMAN
    },
    PARAMS() {
      if (this.$route.params.id === undefined) return undefined
      else return JSON.parse(this.$route.params.id)
    },
    CURRENTROUT() {
      return location.origin + location.pathname+ '#'+ this.$route.path
    },
    ISPROTECTED() {
      if (this.PARAMS === undefined) return false
      return (this.PARAMS.mode === 'protected' || this.PARAMS.mode === 'encrypted')
    },
    ISENCRYPTED() {
      if (this.PARAMS === undefined) return false
      if (this.PARAMS.PID === undefined) return false
      return this.PARAMS.mode === 'encrypted'
      
    }
  },
  
  methods: {
    save_preset(){
      this.$q.dialog({
        // title: 'Preset',
        message: this.TEXT.quest.save_preset,
        prompt: {
          model: 'Preset 1',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(label => {
        this.$store.dispatch('storePreset', {label: label, value: this.PARAMS.presets});
        this.show_store_btn = false
        this.$q.notify({
          message: this.TEXT.quest.save_success,
          color: 'green'
        }) 
      })
    },
    startQuest() {
      if (this.subject_pid === null) {
        this.$q.notify({
          message: this.TEXT.quest.PID_missing,
          color: 'warning'
        })
        return false
      }

      // COLLECT DATA
      const params = this.PARAMS
      params.PID = this.subject_pid

      // ENTER THE QUEST
      this.$router.push(`/quest/${encodeURIComponent(JSON.stringify(params))}`)
    },

    make_route_encrypted() {
      var params = this.PARAMS
      params.mode = 'encrypted';
      params.PID = this.subject_pid
      params.email = this.$store.state.SETTINGS.email_export
      params.pubKey = this.$store.state.SETTINGS.user_keyPair.publicKey
      this.$router.push(`/preset/${encodeURIComponent(JSON.stringify(params))}`)
    }
  }
}
</script>
