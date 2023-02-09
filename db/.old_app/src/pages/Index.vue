<template>
  <q-page class="text-center non-selectable">
    <MainSlot :no_footer="true">
      <template v-slot:header>
        <div class="col-12 text-caption q-mt-sm" style="line-height: 1em">
          <span> {{ getaquote.quote }}</span>
          <span > ({{ getaquote.author }})</span>
        </div>
        <div class="col-12 text-h6">Was willst Du machen?</div>
      </template>
      <template v-slot:main>
        <div class="q-pa-md">
          <q-list>
            <q-item v-for="(item, ind) in SELECTION" :key="ind + 'item'" 
              clickable v-ripple
              @click="$router.push({name: item.link})"
              class="bg-accent q-ma-xs my-item"
            >
              <q-item-section avatar><q-icon :name="item.icon" size="md"/></q-item-section>
              
              <q-item-section>
                <q-item-label>
                  {{ item.title }}
                </q-item-label>
                <q-item-label caption>
                  {{ item.description }}
                </q-item-label>

              </q-item-section>
              <q-item-section side>
                <q-img class="rounded-borders my-icon-size" :src="item.img" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:footer>
        
      </template>
    </MainSlot>
  </q-page>
</template>

<script>

import QUOTES from '../../public/quotes.json'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'Overview',

  data() {
    return {
      SELECTION: this.$store.getters.ENV.selection_index_page
    }
  },

  components: { MainSlot },

  mounted() {
    
  },

  computed: {
    getaquote() {
      const num = Math.floor((Math.random()*QUOTES.quotes.length));
      return QUOTES.quotes[num]
    }
  },

  methods: {
    commingSoon() {
      this.$q.notify('Comming soon ...')
    }

  }

}
</script>
