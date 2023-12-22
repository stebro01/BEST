<template>
  <q-page class="page-size">
    <div class="column items-center" style="height: 100%">
      <!-- HEADING -->
      <div class="col-1 q-pt-md text-h6">
        Vorlagen
      </div>

      <!-- CONtENT -->
      <div class="col q-py-md" style="position: relative">
        <q-scroll-area class="shadow-1 my-form">
          <div class="row q-pa-md justify-around q-gutter-md">
            <q-item class="my-btn-item"
              v-for="(item, index) in $store.getters.PRESET_STORE" :key="item+'_'+index" flat bordered
            >
              <q-item-section>
                <q-item-label contenteditable @blur="actionStr($event, index)"
                      @keyup.enter="actionStr($event, index)"> {{item.label}}
                </q-item-label>
                <q-item-label caption>
                  <span v-for="(val, idx) in item.value" :key="val + idx">
                    {{val}}<span v-if="idx+1 < item.value.length">, </span>
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn v-if="needToSave[index] === true" class="gt-xs" size="12px" flat dense round icon="save" @click="save_item(index)"></q-btn>
                <div v-else class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="play_arrow" @click="start_preset(index)"/>
                  <q-btn size="12px" flat dense round icon="more_vert" data-cy="btn_options" >
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item  class="my-btn text-center" data-cy="back_root" clickable @click="edit_preset(index)">
                          <q-item-section avatar>
                            <q-icon :name="TEXT.btn.edit_new.icon" />
                          </q-item-section>
                          <q-item-section >{{TEXT.btn.edit_new.label}}</q-item-section>
                        </q-item>
                        <q-item  class="my-btn text-center" data-cy="back_root" clickable @click="delete_preset(index)">
                          <q-item-section avatar>
                            <q-icon :name="TEXT.btn.delete.icon" />
                          </q-item-section>
                          <q-item-section >{{TEXT.btn.delete.label}}</q-item-section>
                        </q-item>
                        
                      </q-list>
                    </q-menu>
                </q-btn>
                </div>
              </q-item-section>
            </q-item>

          </div>
        </q-scroll-area>
      </div>

      <!-- BUTTONS -->
      <div class="col-2 text-center">
        <MYBUTTON :label="TEXT.btn.make_preset" @click="$router.push('preset')" />
      </div>

    </div>
    <!-- BACKBUTTON -->
    <BACKBUTTON />

    <!-- MODALS -->
    <q-dialog v-model="PresetStoreEdit_show" >
        <PRESET_STORE_EDIT 
          :item="PresetStoreEdit_item"
          @save="updateItem($event)"
          @close="PresetStoreEdit_show = false; PresetStoreEdit_item = undefined" />
    </q-dialog>
    
  </q-page>
</template>

<script>
  // import Vue from 'vue'
  import myMixins from 'src/mixins/modes'
  import BACKBUTTON from 'src/components/BackButton.vue'
  import MYBUTTON from 'src/components/MyButton.vue'
  import PRESET_STORE_EDIT from 'src/components/PresetStore_Edit.vue'
  export default {
    name: 'PRESETSTORE',
    mixins: [myMixins],
    data() {
      return {
        TEXT: this.$store.state.TEXT,
        needToSave: [],
        PresetStoreEdit_item: undefined,
        PresetStoreEdit_show: false,
      }
    },
    mounted() {
      this.$store.dispatch('setProtectedMode', true);
    },
    components: {BACKBUTTON, MYBUTTON, PRESET_STORE_EDIT},
    methods: {
      actionStr(ev, index) {
        var text = ev.target.innerText.replace(/[\n\r]/g, '')
        this.$store.getters.PRESET_STORE[index].label = text
        ev.target.innerText = text
        this.needToSave[index] = true
      },
      start_preset(index) {
        var answer = window.confirm(this.TEXT.btn.confirm_start);
        if (!answer) return
        this.$router.push(
          `preset/${JSON.stringify({presets: this.$store.getters.PRESET_STORE[index].value, mode: 'protected'})}`)
      },
      delete_preset(index) {
        var answer = window.confirm(this.TEXT.btn.confirm_delete);
        if (answer) this.$store.dispatch('deletePreset', index);
      },
      // clear_preset() {
      //    var answer = window.confirm(this.TEXT.btn.confirm_delete);
      //   if (answer) this.$store.dispatch('clearPreset');
      // },

      edit_preset(index) {
        this.PresetStoreEdit_show = true
        this.PresetStoreEdit_item = this.$store.getters.PRESET_STORE[index]
      },

      save_item(index) {
        this.needToSave[index] = false
        this.$store.dispatch('updatePreset', {
          index: index,
          value: this.$store.getters.PRESET_STORE[index]
        });
      },

      updateItem(item) {
        var index = this.$store.getters.PRESET_STORE.findIndex((el) => el.label === item.label)
        this.$store.dispatch('updatePreset', {index: index, value: item});
        this.PresetStoreEdit_show = false
        this.PresetStoreEdit_item = undefined
      }
      // onInputLabel(event, index) {
      //   this.$store.getters.PRESET_STORE[index].label = event.target.innerText      
      //   Vue.set(this.needToSave, index,  true)
      // }
    }
  }

</script>
