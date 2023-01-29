<template>
 <q-dialog v-model="state">
   <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
        <div class="text-h6">Nutzer importieren</div>
        <div class="text-subtitle2">bitte die Nutzerinformationen als JSON/Text einfügen</div>
        <div class="text-caption">
          Der bestehende Nutzer wird überschrieben!
        </div>
    </q-card-section>

    <q-card-section>
       <q-input
          v-model="json_text"
          filled
          type="textarea"
        />
        
    </q-card-section>
     

    <!-- CLOSE BUTTON -->
    <q-card-actions align="right" class="bg-white text-teal">
       <q-btn flat label="Abbrechen" v-close-popup />
       <q-btn flat label="OK" @click="import_data" />
     </q-card-actions>

   </q-card>
 </q-dialog>

</template>

<script>

export default {
    props: [ "view_import"],
    data() {
    return {
      state: this.view_import,
      json_text: null
    }
  },
  watch: {
    MED(val) {
      this.state = val
    },
    state(val) {
      if (val === false) this.$emit('closeClick')
    }
  },
  methods: {
    import_data() {
      if (this.json_text === null) this.$emit('closeClick')
      else this.$emit('clickImportData', this.json_text)
    }
  }
 
}
</script>

<style>

</style>