<template>
  <q-page >
    <MainSlot :no_footer="true">
       <!-- HEADING -->
       <template v-slot:header>
    <HEADING :title="'Funktion wählen'" :img="'provider-color-logo.png'"/>
    </template>
     <!-- MAIN -->
     <template v-slot:main>

      <q-list>
            <q-item v-for="(item, ind) in options" :key="ind + 'item'" 
              clickable v-ripple
              @click="$router.push({name: item.link})"
              class="bg-accent q-ma-xs"
              :disable="$q.platform.is.win && (item.link === 'DBFunctions_ResetDB' || item.link === 'DBFunctions_CreateDB')"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ item.label }}
                </q-item-label>
              </q-item-section>
              <q-tooltip>{{ item.caption }}</q-tooltip>
            </q-item>
          </q-list>
     </template>

    </MainSlot>
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'DBFunctions',

  data() {
    return {
      options: this.$store.getters.ENV.options_db_functions
    }
  },

  components: { HEADING, MainSlot },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {

  },

  watch: {


  },

  computed: {

  },

  methods: {

   
  }

}
</script>
