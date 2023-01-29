<template>
  <q-page class="column text-center q-pa-sm non-selectable" style="height: 100%">

      <div class="col-1 text-grey-7">
        <span > {{getaquote.quote}}</span>
        <span class="text-caption"> ({{getaquote.author}})</span>
      </div>

      <div class="col" >
        <div class="text-h6 bg-accent q-pa-md">Was willst Du machen?</div>

         
        <div class="row q-gutter-md q-pa-md justify-center">
          <q-card v-for="(item, ind) in SELECTION" :key="ind + 'sel'"
            style="width: 300px; height: 120px" flat bordered
            @click="this.$router.push({name: item.link})"
            class="cursor-pointer"
          >
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-h6">{{ item.title }}</div>
                <div class="text-caption text-grey">
                  {{item.description}}
                </div>
              </q-card-section>

              <q-card-section class="col-3 flex flex-center">
                <q-img
                  class="rounded-borders my-icon-size"
                  :src="item.img"
                />
              </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-actions align="center" class="q-pa-none">
              <q-btn class="fit" flat color="primary" icon="arrow_circle_right"
                @click="this.$router.push({name: item.link})"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

    <!-- LOGOUT BUTTON -->
    <div class="fixed-top-right q-mt-xl q-mr-md z-max">
    <q-btn v-show="$store.getters.CONNECTED" class="q-mt-xl" rounded color="black"  icon="logout" @click="closeDB()">
      <q-tooltip>Verbindung zur DB beenden. </q-tooltip>
    </q-btn>
  </div>

  </q-page>
</template>

<script>

import QUOTES from '../../public/quotes.json'

export default {
  name: 'Overview',

  data() {
    return {
      SELECTION: this.$store.getters.ENV.selection_index_page
    }
  },

  components: {  },

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
    },

    closeDB(){
      this.$store.commit('CONNECTED_SET', false)
      this.$store.commit('USER_SET', undefined)
      this.$router.push({name: 'Start'})
    }

  }

}
</script>
