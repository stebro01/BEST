<template>
  <!-- FORM ENDE -->
  <q-card v-if="ITEM">
    <!-- TYPE -->
    <q-card-section class="my-form">
      <q-btn icon="close" class="absolute-top-right" round flat @click="closeIt()"/>
      <div class="text-h6">Edit Item</div>

    </q-card-section>
    <q-card-section>
      {{ item.label }}
    </q-card-section>
    <q-card-section>
      <q-list >
        <q-item v-for="(val, ind) of ITEM.value" :key="`${ind}_entry`"  class="bg-grey-1 q-mb-xs" dense>
          <q-item-section>{{ val }}</q-item-section>
          <q-item-section side>
            <div>
            <q-icon v-if="ind > 0" class="cursor-pointer" name="arrow_upward" @click="swapElements(ITEM.value, ind, ind - 1)"/>
            <q-icon v-if="ind + 1 < ITEM.value.length" class="cursor-pointer" name="arrow_downward" @click="swapElements(ITEM.value, ind, ind + 1)"/>
            <q-icon  class="cursor-pointer q-ml-md" name="delete" @click="ITEM.value.splice(ind,1)"/>
          </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="center">
      <MYBUTTON :label="TEXT.btn.save.label" @clicked="saveElement(ITEM)" />
    </q-card-actions>

  </q-card>
</template>


<script>

import MYBUTTON from '../components/MyButton.vue'

export default {
  name: 'CreateItem',
  props: ["item", "index"],
  components: {
    MYBUTTON
  },

  data() {
    return {
      TEXT: this.$store.state.TEXT,
      ITEM: undefined
    }
  },
  mounted() {
    this.ITEM = JSON.parse(JSON.stringify(this.item))
  },

  computed: {

  },
  methods: {
    closeIt() {
      this.$emit('close')
    },

    swapElements(arr, index1, index2) {
      let temp = arr[index1];
      arr[index1] = arr[index2];
      arr[index2] = temp;
    },

    saveElement(item) {
      this.$emit('save', item)
    }

  }
}
</script>
