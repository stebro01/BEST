<template>
  <q-page data-cy="page_quest" class="page-size">
    <div class="column items-center">
      <!-- NO PARAMS -->
      <div v-if="noPARAMStxt !== undefined">
         <q-banner inline-actions class="text-white bg-red">
            {{this.noPARAMStxt}}
            <template v-slot:action>
            <q-btn flat color="white" :label="TEXT.btn.back" @click="$router.push('/')" />
            </template>
        </q-banner>
      </div>
      <!-- TITEL -->
      <!-- FORM -->
      <div v-if="status && QUEST_LABEL !== null && QUEST_LABEL !== undefined">
        <RenderQuest  @emitForm="questAction" @emitBack="gotoselect" :key="timenow" />
      </div>

      <!-- RETURN BUTTON -->
      <div v-else class="col text-center">
        <div>
          {{TEXT.quest.not_found}}: {{PARAMS}}
        </div>
      </div>
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON :ask="true" />
  </q-page>
</template>

<script>
import BACKBUTTON from 'src/components/BackButton.vue'
import RenderQuest from 'src/components/RenderQuest.vue'
export default {
  name: 'Questionnaire',
  components: {BACKBUTTON, RenderQuest},
  data() {
    return {
      TEXT: this.$store.state.TEXT,
      noPARAMStxt: undefined,
      timenow: Date.now(), 
      status: true
    }
  },
  mounted() {
    this.$store.state.leftDrawerOpen = false
    this.$store.state.PROTECTED_MODE = true
    this.$store.commit('EXPORT_CLEAR')
    this.loadQuest()
  },

  watch: {
    $route(){
      // this.loadQuest()
    }
  },

  methods: {
    loadQuest() {
      this.QUESTMAN.clear_preset()
      if (this.PARAMS === undefined || this.PARAMS.presets === undefined) return (this.noPARAMStxt = 'keine Parameter gesetzt!')
      this.QUESTMAN.presets = this.PARAMS.presets

      const status = this.QUESTMAN.next()
      if (!status) return
    },
    
    gotoselect() {
      this.$router.push('/select')
    },

    // HIER KOMMEN DIE DATEN AUS DER FORM
    questAction(val) {
      if (val !== undefined) {
        this.timenow = Date.now() // rerender renderquest
        this.$store.dispatch('storage_add', val)
        this.$q.notify({
          message: this.TEXT.quest.export_success,
          color: 'green'
        })
        // encrypted mode?
        if (this.PARAMS.mode === 'encrypted') this.export_encrypted()
        // next quest
        this.status = this.QUESTMAN.next()

        if (this.status !== true) this.$router.push({path: '/finished_quest'}).catch(err => this.$router.push('/finished_quest'))
        

      } else {
        this.$q.notify({
          message: this.TEXT.quest.export_failed,
          color: 'warning'
        })
      }
    },

    // EXPORT A QUEST IN ENCRYPTION MODE
    export_encrypted() {
      this.$store.dispatch('storage_encrypted_export', this.PARAMS)
    }
  },

  computed: {
    PARAMS() {
      if (this.$route.params.id === undefined) return undefined
      return JSON.parse(this.$route.params.id)
    },
    QUEST_LABEL() {
      return this.$store.getters.ACTIVE_QUEST_LABEL
    },
    QUESTMAN() {
      return this.$store.getters.QUESTMAN
    }
  }
}
</script>
