<template>
  <q-page class="flex flex-center">
    <div class="column my-list-item">
      <div class="col text-h6">
        Über diese App
      </div>

      <div class="col">
        Diese App ist eine Standalone-App zum Verwalten einer SQLITE-DB im lokalen Dateisystem.
        <br>
        Es werden keinerlei Daten versendet.
      </div>

      <div class="col">
        Es werden innerhalb der APP keine Einstellungen gespeichert.
      </div>

      <div class="col">
        Verwendete Ressourcen:
        <div class="text-left">
        <q-list dense style="max-width: 600px">
          <q-item v-for="(item, ind) in RESSOURCES" :key="ind +'feature'">
            <q-item-section avatar>
              <q-icon name="star"/>
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
            <q-item-section>
              License: {{ item.license }}
            </q-item-section>
            <q-item-section side class="cursor-pointer">
              <q-icon name="link" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      </div>
      <div class="col items-center">
        <div class="text-h6">Features</div>
        <div class="text-left">
        <q-list dense style="max-width: 600px">
          <q-item v-for="(item, ind) in FEATURES" :key="ind +'feature'">
            <q-item-section side>
             <q-icon v-if="item.status" name="check_box" color="green"/>
             <q-icon v-else name="check_box_outline_blank"/>
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      </div>

    </div>
    
  </q-page>
</template>

<script>

export default {
  name: 'About',

  data() {
    return {
      //
    }
  },

  computed: {
    FEATURES() {
      return this.$store.getters.ENV.features
    },

    RESSOURCES() {
      return this.$store.getters.ENV.ressources
    }
  },

  methods: {
    
  }

}
</script>
