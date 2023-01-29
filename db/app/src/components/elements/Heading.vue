<template>
  <div>
    <PINNED_ELEMENTS />
    <div class="fixed-top row justify-center q-pa-sm q-mt-xl my-transparent-bg">
        <q-card class="my-card ">
          <q-item>
            <q-item-section avatar>
                <q-img :src="IMG" class="my-icon-size" />            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 text-center">{{title}}</q-item-label>
              <q-item-label v-if="description" class="text-caption text-center">{{ description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
</template>

<script>
import PINNED_ELEMENTS from 'src/components/elements/PinnedElements.vue'
export default {
  name: 'Heading',

  props: ['title', 'img', 'description'],

  components: { PINNED_ELEMENTS },

  data() {
    return {

    }
  },

  computed: {
    IMG() {
      return this.img
    }
  }






}
</script>