<template>
  <q-page class="non-selectable">
    <MainSlot :no_options="true" :no_footer="true">
      <template v-slot:header>
        <HEADING :title="'Über diese App'" :icon="'quiz'" />
      </template>

      <template v-slot:main>
        <div class="q-pa-lg">
          <div>
            Diese App ist eine Standalone-App zum Verwalten einer SQLITE-DB im
            lokalen Dateisystem.
          </div>
          <div>
            Es werden keinerlei Daten versendet. Es werden innerhalb der APP
            keine Einstellungen gespeichert.
          </div>

          <div>
            <div class="text-h6 q-mt-md">Verwendete Ressourcen:</div>
            <q-list dense style="max-width: 600px">
              <q-item v-for="(item, ind) in RESSOURCES" :key="ind + 'feature'">
                <q-item-section side class="cursor-pointer">
                  <q-icon name="link" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>

                  <q-item-label caption>License: {{ item.license }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="text-h6 q-mt-md">Features</div>
          <div>
            <q-list dense style="max-width: 600px">
              <q-item v-for="(item, ind) in FEATURES" :key="ind + 'feature'">
                <q-item-section side>
                  <q-icon v-if="item.status" name="check_box" color="green" />
                  <q-icon v-else name="check_box_outline_blank" />
                </q-item-section>
                <q-item-section>
                  {{ item.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="text-h6 q-mt-md">Changes</div>
          <div>
            <q-list dense style="max-width: 600px">
              <q-item v-for="(item, ind) in CHANGELOG" :key="ind + 'feature'">
                <q-item-section side>
                  <q-icon name="info" />
                </q-item-section>
                <q-item-section>
                  {{ item.value }}: {{ item.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </template>
    </MainSlot>
  </q-page>
</template>

<script>
import MainSlot from "src/components/MainSlot.vue";
import HEADING from "src/components/elements/Heading.vue";
export default {
  name: "AboutPage",

  components: { MainSlot, HEADING },

  data() {
    return {
      //
    };
  },

  computed: {
    FEATURES() {
      return this.$store.getters.ENV.features;
    },

    RESSOURCES() {
      return this.$store.getters.ENV.ressources;
    },

    CHANGELOG() {
      return this.$store.getters.ENV.app.changelog;
    },
  },

  methods: {},
};
</script>
