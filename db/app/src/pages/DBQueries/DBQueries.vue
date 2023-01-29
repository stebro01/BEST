<template>
  <q-page class="column items-center">
    <HEADING :title="TEXT.title" :description="TEXT.description" :img="'db-queries-logo.png'"/>
      <!-- HEADING -->
      <div class="col q-mt-xl">
        <q-card class="my-card q-mt-xl">
          <q-separator class="q-mx-sm" />
          <q-card-section class="text-center">
            <q-btn-dropdown no-caps color="primary" class="fit" :label="SHOW_LABEL">
              <q-list>
                <q-item v-for="(item, ind) in options" :key="ind + 'opt'"
                  clickable v-close-popup @click="options_id = item"
                >
                  <q-item-section>
                    <q-item-label>{{item.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
        </q-card>
      </div>

      <BOTTOM_BUTTONS v-if="options_id" 
        :show_execute="true"
        @execute="startSelection()"
      />
    
  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import BOTTOM_BUTTONS from 'src/components/elements/BottomButtons.vue'

export default {
  name: 'DBQueries',

  data() {
    return {
      options_id: undefined,
      options: this.$store.getters.ENV.options_db_queries
    }
  },

  components: { HEADING, BOTTOM_BUTTONS },
  // mixins: [myMixins], //imports: searchPatient & deleteItem

  mounted() {
  },

  watch: {


  },

  computed: {
    SHOW_LABEL() {
      if (this.options_id) return this.options_id.label
      return '<auswählen>'
    },

    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    }
  },

  methods: {
    startSelection() {
      this.$router.push({name: this.options_id.link})

    }
   
  }

}
</script>
