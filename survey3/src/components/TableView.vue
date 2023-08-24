<template>
  <q-dialog v-model="state">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="my-table">
        <div v-html="QUEST.cda.text.div"></div>
      </q-card-section>


      <!-- CLOSE BUTTON -->
      <q-card-actions align="between" class="bg-white text-teal">
        <q-btn flat rounded label="check" @click="checkQuest" />
        <q-btn flat rounded label="OK" v-close-popup />
      </q-card-actions>


    </q-card>
  </q-dialog>
</template>

<script>

export default {
  props: ["QUEST", "medium"],
  data() {
    return {
      state: this.medium,
      results: null
    }
  },

  mounted() {
    // console.log(this.QUEST.cda.text.div)
  },

  watch: {
    state(val) {
      if (val === false) this.$emit('closeClick')
    }
  },
  methods: {
    checkQuest() {
      this.$store.dispatch('verify_quest_signature', this.QUEST)
        .then(res => this.$q.notify({
          message: "Das Dokument ist valide.",
          color: 'green'
        }))
        .catch(err => this.$q.notify({
          message: `Überprüfung nicht erfolgreich: ${err}`,
          color: 'warning'
        }))
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.my-table {
  font-size: 0.8em;
}

.my-table>>>h2 {
  margin-top: -20px;
  margin-bottom: -10px;
}

.my-table>>>h1 {
  margin-top: -30px;
  margin-bottom: -10px;
}

.my-table>>>td {
  border: 0.8px solid grey;
}


.my-table>>>table {
  table-layout: auto;
  width: 100%;
  overflow: auto;
  /* word-wrap: break-word; */
  ;
}
</style>
