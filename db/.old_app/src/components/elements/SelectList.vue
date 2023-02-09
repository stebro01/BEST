<template>
    <q-dialog v-model="ACTIVE">
      <q-card v-if="list">
        <q-btn icon="close" class="absolute-top-right z-top" flat round @click="$emit('close')"/>
        <q-card-section>{{ title }}</q-card-section>
        <q-card-section>
          <q-list>
            <q-item v-for="(item, ind) in list" :key="ind + 'item'" clickable v-ripple @click="selectItem(item)">
              {{item.label}}
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>


<script>
export default {
  name: 'SelectList',

  props: ['active', 'title', 'list'],

  components: {  },

  data() {
    return {
    }
  },

  computed: {
    ACTIVE: {
      get() {
        return this.active
      }, set(val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('save', item)
    }
  }






}
</script>