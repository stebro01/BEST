<template>
  <div>
    <q-separator class="q-my-lg"
      v-if="title === 'separator'"
    />
    <q-item
    v-else
    clickable
    tag="a"
    target="_blank"
    @click="reroute"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>

  </div>
  
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }, 
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    reroute() {
      this.$store.state.leftDrawerOpen = false
      this.$router.push({name: this.name}).catch(() => {})
    }
  },
}
</script>
