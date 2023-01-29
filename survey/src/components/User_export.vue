<template>
 <q-dialog v-model="state">
   <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
        <div class="text-h6">Nutzer exportieren</div>
        <div class="text-subtitle2">bitte den Text als JSON abspeichern</div>
    </q-card-section>

    <q-card-section class="bg-grey-3">
        {{DATA.export()}}
    </q-card-section>
     

    <!-- CLOSE BUTTON -->
    <q-card-actions align="right" class="bg-white text-teal">
       <q-btn flat label="OK" v-close-popup />
     </q-card-actions>

   </q-card>
 </q-dialog>

</template>

<script>

export default {
    props: ["DATA", "view_export"],
    data() {
    return {
      state: this.view_export,
      results: null
    }
  },
  watch: {
    MED(val) {
      this.state = val
    },
    state(val) {
      if (val === false) this.$emit('closeClick')
    }
  }
 
}
</script>

<style>

</style>