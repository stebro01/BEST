<template>
  <!-- FORM ENDE -->
    <q-scroll-area class="fit"  >
      <RENDERQUEST :PREVIEWQUEST="CONTENT" />
    </q-scroll-area>
</template>

<script>
import RENDERQUEST from 'src/components/RenderQuest.vue'

export default {
  name: 'PreviewItem',
  props: ["content", "content_single_item"],
  components: {RENDERQUEST},
  data() {
    return {
      TEXT: this.$store.state.TEXT
    }
  },
  computed: {
    CONTENT() {
      if (this.content_single_item !== undefined && this.content_single_item !== null) return this.content_single_item
      return this.content
    }
  }
}
</script>
