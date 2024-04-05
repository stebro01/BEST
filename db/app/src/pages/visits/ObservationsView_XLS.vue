<template>
  <q-page class="">

    <MainSlot :no_options="true" :no_footer="true">
      <!-- HEADING -->
      <template v-slot:header>
        <HEADING :title="'XLS View'" :img="'db-queries-logo.png'" :icon="'wysiwyg'" />
      </template>

      <!-- MAIN -->
      <template v-slot:main>
        <div class="column" :style="STYLE_DIV">
          <!-- HEADER -->
          <div class="col-1 ">
            <div class="q-mt-xs fit bg-grey-3 flex flex-center ">HEADER</div>
            <!-- CHANGE FONTSIZE -->
            <div class="absolute-top-right q-mt-md">
              <q-btn size="md" dense icon="zoom_in" flat @click="font_size++" />
              <q-btn size="md" dense icon="zoom_out" flat @click="font_size--" />
            </div>
          </div>
          <!-- CONTENT -->
          <div class="col-10 flex flex-center bg-white">
            <q-scroll-area :style="STYLE_CONTENT" class=" q-mt-xs">
              <q-markup-table dense>
                <thead class="bg-grey-2">
                  <tr >
                    <th class="text-left" :style="TD_STYLE" >ID</th>
                    <th class="text-right" :style="TD_STYLE">Calories</th>
                    <th class="text-right" :style="TD_STYLE">Fat (g)</th>
                    <th class="text-right" :style="TD_STYLE">Carbs (g)</th>
                    <th class="text-right" :style="TD_STYLE">Protein (g)</th>
                    <th class="text-right" :style="TD_STYLE">Sodium (mg)</th>
                    <th class="text-right" :style="TD_STYLE">Calories</th>
                    <th class="text-right" :style="TD_STYLE">Fat (g)</th>
                    <th class="text-right" :style="TD_STYLE">Carbs (g)</th>
                    <th class="text-right" :style="TD_STYLE">Protein (g)</th>
                    <th class="text-right" :style="TD_STYLE">Sodium (mg)</th>
                    <th class="text-right" :style="TD_STYLE">Calories</th>
                    <th class="text-right" :style="TD_STYLE">Fat (g)</th>
                    <th class="text-right" :style="TD_STYLE">Carbs (g)</th>
                    <th class="text-right" :style="TD_STYLE">Protein (g)</th>
                    <th class="text-right" :style="TD_STYLE">Sodium (mg)</th>
                    <th class="text-right" :style="TD_STYLE">Calories</th>
                    <th class="text-right" :style="TD_STYLE">Fat (g)</th>
                    <th class="text-right" :style="TD_STYLE">Carbs (g)</th>
                    <th class="text-right" :style="TD_STYLE">Protein (g)</th>
                    <th class="text-right" :style="TD_STYLE">Sodium (mg)</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- LOOP -->
                  <tr v-for="(item, ind) in [1,2,3,4,5,7,8,9,10,11,12]" :key="ind+'row'">
                    <td class="text-left" :style="TD_STYLE">Frozen Yogurt {{ item }}</td>
                    <td class="text-right" :style="TD_STYLE">159</td>
                    <td class="text-right" :style="TD_STYLE">6</td>
                    <td class="text-right" :style="TD_STYLE">24lkfsdf sdfedsfesajlkdfjalekjflaekjflkaejfelk</td>
                    <td class="text-right" :style="TD_STYLE">4</td>
                    <td class="text-right" :style="TD_STYLE">87</td>
                    <td class="text-right" :style="TD_STYLE">159</td>
                    <td class="text-right" :style="TD_STYLE">6</td>
                    <td class="text-right" :style="TD_STYLE">24</td>
                    <td class="text-right" :style="TD_STYLE">4</td>
                    <td class="text-right" :style="TD_STYLE">87</td>
                    <td class="text-right" :style="TD_STYLE">159</td>
                    <td class="text-right" :style="TD_STYLE">6</td>
                    <td class="text-right" :style="TD_STYLE">24lkfsdf sdfedsfesajlkdfjalekjflaekjflkaejfelk</td>
                    <td class="text-right" :style="TD_STYLE">4</td>
                    <td class="text-right" :style="TD_STYLE">87</td>
                    <td class="text-right" :style="TD_STYLE">159</td>
                    <td class="text-right" :style="TD_STYLE">6</td>
                    <td class="text-right" :style="TD_STYLE">24</td>
                    <td class="text-right" :style="TD_STYLE">4</td>
                    <td class="text-right" :style="TD_STYLE">87</td>
                  </tr>
                </tbody>



              </q-markup-table>


            </q-scroll-area>
          </div>
          <!-- FOOTER -->
          <div class="col-1">
            <div class="q-mt-xs fit flex flex-center bg-grey-3">FOOTER</div>

          </div>
        </div>
      </template>



    </MainSlot>

  </q-page>
</template>

<script>
import HEADING from 'src/components/elements/Heading.vue'
import MainSlot from 'src/components/MainSlot.vue'

export default {
  name: 'ObservationsView_XLS',

  components: { HEADING, MainSlot },

  data() {
    return {
      font_size: 10
    }
  },

  mounted() {

  },


  computed: {
    TEXT() {
      return this.$store.getters.TEXT.page.db_queries
    },

    STYLE_DIV() {
      return `width: 100%; height: ${this.$q.screen.height - 280*((this.$q.screen.height/this.$q.screen.height*0.90))}px`
    },

    STYLE_CONTENT() {
      return "width: 100%; height: 100%"
    },

    TD_STYLE() {
      return `font-size: ${this.font_size}pt; padding: 5px; border: 0.1px solid #ccc;overflow: hidden;max-width: 100px`
    }


  },


  methods: {





    // ENDE METHODS
  }


}
</script>
