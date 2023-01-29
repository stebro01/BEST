<template>
  <div>
    <q-item class="my-btn-item" :class="{ 'bg-grey-4': checked }">
      <!-- CHECKBOX -->
      <q-item-section avatar>
        <q-checkbox
          v-model="checked"
          @blur="changeSel(checked)"
          :data-cy="'check_' + index"
        />
      </q-item-section>
      <q-item-section no-wrap>
        <q-item-label>
          <span class="text-caption">PID: </span>
          {{ item.cda.subject.display }}
          <q-badge
            v-if="item.exported"
            color="green"
            :data-cy="'exported_' + index"
            >{{ TEXT.storage.export_finished }}</q-badge
          >
          <q-badge v-else color="warning" size="xs">{{
            TEXT.storage.export_open
          }}</q-badge>
        </q-item-label>
        <q-item-label caption class="overflow-hidden" style="max-height: 2.8em">
          <span class="text-caption">Fragebogen: </span>
          {{ item.info.title }}
        </q-item-label>
        <q-item-label
          caption
          style="font-size: 10px; max-height: 1em"
          class="overflow-hidden"
        >
          {{ item.cda.date }}
        </q-item-label>

        <q-item-label
          caption
          style="font-size: 10px; max-height: 1em"
          class="overflow-hidden"
        >
          {{ item.info.uid }}
        </q-item-label>
      </q-item-section>

      <!-- RECHTS -->
      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            flat
            dense
            round
            icon="preview"
            @click="view_item(index)"
            :data-cy="'btn_preview_' + index"
          >
            <q-tooltip>{{ TEXT.btn.preview }}</q-tooltip>
          </q-btn>
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="more_vert"
            data-cy="btn_options"
          >
            <q-menu cover auto-close>
              <q-list>
                <!-- EXPORT -->
                <q-item
                  class="my-btn text-center"
                  data-cy="back_root"
                  clickable
                  @click="export_item(index)"
                >
                  <q-item-section avatar>
                    <q-icon :name="TEXT.btn.export.icon" />
                  </q-item-section>
                  <q-item-section>{{ TEXT.btn.export.label }}</q-item-section>
                </q-item>
                <!-- EXPORT -->
                <q-item
                  class="my-btn text-center"
                  data-cy="back_root"
                  clickable
                  @click="export_item_encrypted(index)"
                >
                  <q-item-section avatar>
                    <q-icon :name="TEXT.btn.export.icon2" />
                  </q-item-section>
                  <q-item-section
                    >{{ TEXT.btn.export.label }} ({{
                      TEXT.btn.export.encrypt
                    }})</q-item-section
                  >
                </q-item>
                <!-- EXPORT CLOUD/NOTION -->
                <q-item
                  v-if="$store.getters.SETTINGS.use_notion"
                  class="my-btn text-center"
                  data-cy="back_root"
                  clickable
                  @click="export_cloud(index)"
                >
                  <q-item-section avatar>
                    <q-icon name="cloud" />
                  </q-item-section>
                  <q-item-section>{{ TEXT.btn.export_cloud }}</q-item-section>
                </q-item>
                <q-separator></q-separator>
                <!-- DELETE -->
                <q-item
                  class="my-btn text-center"
                  data-cy="back_root"
                  clickable
                  @click="remove(index)"
                >
                  <q-item-section avatar>
                    <q-icon :name="TEXT.btn.delete.icon" />
                  </q-item-section>
                  <q-item-section>{{ TEXT.btn.delete.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  props: ["index", "item", "selected"],
  name: "StorageCard",
  data() {
    return {
      checked: false,
      TEXT: this.$store.getters.TEXT,
    };
  },
  watch: {
    selected(val) {
      if (val !== this.checked) this.checked = val;
    },
  },
  mounted() {
    // console.log(this.item)
  },

  methods: {
    changeSel(val) {
      this.$emit("change_selection", !val);
    },
    export_cloud(index) {
      this.$emit("export_cloud", index);
    },
    export_item(index) {
      this.$emit("export_item", index);
    },
    export_item_encrypted(index) {
      this.$emit("export_item_encrypted", index);
    },
    remove(index) {
      this.$emit("remove", index);
    },
    view_item(index) {
      this.$emit("view_item", index);
    },
  },
};
</script>
