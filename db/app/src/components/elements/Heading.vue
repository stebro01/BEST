<template>
  <div>
    <q-card class="my-card q-mt-sm">
      <q-item>
        <q-item-section avatar>
          <q-icon :name="ICON" size="md" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6 text-center">{{ title }}</q-item-label>
          <q-item-label v-if="description" class="text-caption text-center">{{
            description
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-img :src="IMG" class="my-icon-size" />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "HeadingElements",

  props: ["title", "img", "description", "icon"],

  components: {},

  data() {
    return {};
  },

  computed: {
    IMG() {
      return this.img;
    },
    ICON() {
      if (this.icon) return this.icon;
      else return "settings";
    },
  },
};
</script>
