<template>
  <span v-if="colored === true">
    <q-btn
      data-cy="btn_preset_start"
      class="my-btn q-ma-md"
      rounded
      color="primary"
      @click="clicked()"
      :label="label"
    />
  </span>
  <span v-else-if="icon !== undefined">
    <q-btn
      align="between"
      :icon="icon"
      flat
      no-caps
      class="my-btn-md q-ma-xs"
      @click="clicked()"
      :label="label"
    />
  </span>
  <span v-else>
    <q-btn
      flat
      no-caps
      class="my-btn-sm q-ma-xs"
      @click="clicked()"
      :label="label"
    />
  </span>
</template>

<script>
export default {
  name: "MyButton",
  props: ["label", "icon", "colored"],

  data() {
    return {
      // TEXT: this.$store.state.TEXT,
    };
  },

  mounted() {
    // console.log("mybtn");
  },

  methods: {
    clicked() {
      // console.log('click')
      this.$emit("click");
      this.$emit("clicked");
    },
  },
};
</script>
