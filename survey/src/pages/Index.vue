<template>
  <q-page data-cy="page_index" class="page-size">
    <div class="column items-center justify-around" style="height: 100%">
      <!-- QUESTS -->
      <div class="col-2">
          <q-item data-cy="btn_quest" clickable v-ripple class="my-btn-item q-my-sm" @click="$store.state.leftDrawerOpen = false, $router.push('select')">
            <q-item-section avatar>
              <q-icon name="summarize" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{TEXT.index.btn_select}}</q-item-label>
              <q-item-label caption>{{TEXT.index.text_select}}</q-item-label>
            </q-item-section>
          </q-item>
      </div>

      <!-- PRESETS -->
      <div class="col-2">
          <q-item data-cy="btn_presets" clickable v-ripple class="my-btn-item q-my-sm" @click="$store.state.leftDrawerOpen = false, $router.push('store_preset')">
            <q-item-section avatar>
              <q-icon name="archive" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{TEXT.index.btn_preset}}</q-item-label>
              <q-item-label caption>{{TEXT.index.text_preset}}</q-item-label>
            </q-item-section>
          </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
  import myMixins from 'src/mixins/modes'

  export default {
    name: 'PageIndex',
    mixins: [myMixins],
    data() {
      return {
        TEXT: this.$store.state.TEXT
      }
    },
    mounted() {
      this.$store.dispatch('setProtectedMode', false);
    }
  }
</script>
