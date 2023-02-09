<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  mounted() {
    this.$store.dispatch('initApp', {electron: this.$q.platform.is.electron})

  }


})
</script>
