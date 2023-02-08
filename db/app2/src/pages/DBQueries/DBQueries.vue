<template>
  <q-page class="">
    <MainSlot :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'db-queries-logo.png'" :icon="'assessment'"/>
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-list>
          <q-item v-for="(item, ind) in options" :key="ind + 'item'" clickable v-ripple
            @click="$router.push({ name: item.link })" class="bg-accent q-ma-xs">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ item.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <!-- FOOTER -->
      <template v-slot:footer>

      </template>

    </MainSlot>

  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBQueries',

  data() {
    return {
      options: this.$store.getters.ENV.options_db_queries
    }
  },

  components: { HEADING, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
  },

  watch: {


  },

  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    }
  },

  methods: {
   
  }

}
</script>
