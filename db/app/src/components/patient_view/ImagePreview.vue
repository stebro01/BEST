<template>
  <q-dialog v-model="preview_survey_best_show">
    <q-card>
      <q-icon v-if="mode !== 'multiple'" class="float-right z-top cursor-pointer q-ml-md" @click="$emit('close')"
        name="close" size="md"><q-tooltip>{{ $store.getters.TEXT.btn.tooltip.close }}</q-tooltip></q-icon>
      <q-card-section>
        <q-icon name="preview"/>
        Vorschau

      </q-card-section>

      <q-card-section v-if="image_data">
        {{ image_data.filename }} /
        {{ Math.round(image_data.sizeKB) }} KB
      </q-card-section>

      <q-card-section v-if="image_src">
        <img :src="image_src" @load="revokeURL(image_src)" style="width: 100%; height: 100%;" />

      </q-card-section>
    </q-card>

  </q-dialog>
</template>


<script>


export default {
  name: 'ImagePreview',

  props: ['input_data', 'mode'],

  components: {},

  data() {
    return {
      preview_survey_best_item: undefined,
      preview_survey_best_show: false,
      image_src: undefined,
      image_data: undefined,
    }
  },

  mounted() {
    if (!this.input_data) return
    if (this.input_data) this.preview_survey_best_show = true

    this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: this.input_data.OBSERVATION_ID, _columns: ['OBSERVATION_BLOB', 'TVAL_CHAR'] } })
      .then(res => {

        if (res.length > 0) this.previewImage(res[0])
      })
  },

  computed: {

  },

  methods: {

    previewImage(val) {
      if (val) {
        // OBJECT DATA
        this.image_data = JSON.parse(val.TVAL_CHAR)
        //  BLOB DATA
        let blob = new Blob([val.OBSERVATION_BLOB], { type: 'image/png' });

        let imageUrl = URL.createObjectURL(blob);
        this.image_src = imageUrl;

      }
    },

    revokeURL(url) {
      URL.revokeObjectURL(url);
    }




  }


}
</script>
