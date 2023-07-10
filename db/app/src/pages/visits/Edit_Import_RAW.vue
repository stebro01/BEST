<template>
  <q-page>
    <MainSlot>
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="TEXT.title" :description="TEXT.description" :img="'general_icon.png'" :icon="'event'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <q-list v-if="FILE_PATH">
          <q-item v-for="(item, ind) of FILE_PATH" :key="ind + 'file'">
            <q-item-section class="text-caption">{{item}}</q-item-section>
            <q-item-section side><q-btn round flat icon="add" @click="addItem(item)"></q-btn></q-item-section>
          </q-item>
        </q-list>
      </template>
    </MainSlot>

   
  </q-page>
</template>

<script>
import HEADING from "src/components/elements/Heading.vue";
import MainSlot from "src/components/MainSlot.vue";

export default {
  name: "Edit_Import_RAW",

  components: {
    HEADING, MainSlot
  },

  data() {
    return {
      imported_data: undefined,
      debugging: true
    };
  },

  mounted() { 

  },

  computed: {
    
    TEXT() {
      return this.$store.getters.TEXT.page.visit_import_raw;
    },

    FILE_PATH() {
      if (this.debugging) return ["/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/OBS_MULTIPLE_PATIENTS_LARGE.csv"]
      else if (this.$route.params.FILE_PATH) return JSON.parse(this.$route.params.FILE_PATH)
      else return undefined
    }
  },

  methods: {
    
    addItem(item) {
      console.log('ADD: ', item)
    }



  },
};
</script>
