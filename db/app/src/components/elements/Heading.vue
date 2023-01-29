<template>
  <div>
    <PINNED_ELEMENTS />
        <q-card class="my-card q-mt-sm ">
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