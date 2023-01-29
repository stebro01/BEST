<template>
  <div class="absolute-top-right q-mr-sm" :class="margintop">
    <q-btn color="grey-7" round flat icon="more_vert" data-cy="btn_options">
      <q-menu cover auto-close>
        <q-list>
          <q-item class="my-btn text-center" data-cy="back_root" clickable @click="quitForm">
            <q-item-section>{{TEXT.btn.back.label}}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>


<script>

export default {
  name: 'BACKBUTTON',
  props: ["ask", "go_back", "go_location"],

  data() {
    return {
      TEXT: this.$store.state.TEXT,
    }
  },

  computed: {
    margintop() {
      // console.log(this.$q.platform.is)
      if (this.$q.platform.is.iphone) return 'q-mt-xl'
      if (this.$q.platform.is.cordova) return 'q-mt-lg'
      return 'q-mt-md'
    }
  },

  methods: {
  
    quitForm() {
      if (this.go_location !== undefined) this.$router.push(this.go_location)
      if (this.go_back === true) return this.$router.go(-1)

      // else
      if (this.ask === true) {
        var answer = window.confirm("Wirklich abbrechen?");
        if (!answer) return
      }

      this.$store.state.PROTECTED_MODE = false;
      this.$router.push('/')
    }


  }
}
</script>
