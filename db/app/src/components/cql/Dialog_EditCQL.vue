<template>
   <!-- CONCEPT_PATH_DIALOG -->
    <q-dialog v-model="ACTIVE">
      <q-card class="my-card">
        <q-btn flat round icon="close" class="absolute-top-right z-top" color="primary" @click="$emit('close')" />
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-form @submit="$emit('save', formData)">
          <q-markup-table dense>
            <tbody>
              <!-- CODE -->
              <tr><td>CODE:</td><td><q-input filled dense v-model="formData.CODE_CD" :rules="[val => !!val || 'Field is required']"/></td></tr>
              <!-- NAME_CHAR -->
              <tr><td>Beschr.:</td><td><q-input filled dense v-model="formData.NAME_CHAR" :rules="[val => !!val || 'Field is required']"/></td></tr>
              <!-- CQL_BLOB -->
              <tr><td>Details:</td><td><q-input filled dense v-model="formData.CQL_BLOB" /></td></tr>
            </tbody>

          </q-markup-table>

        <q-card-actions align="center">
          <q-btn rounded class="my-btn" type="submit">speichern</q-btn>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
</template>


<script>

export default {
  name: 'Dialog_EditCQL',

  props: ['active', 'title', 'data'],


  data() {
    return {
      formData: {}
    }
  },

  mounted() {
    if (this.data) this.formData = JSON.parse(JSON.stringify(this.data))
    else this.formData = {}
  },

  computed: {
    ACTIVE: {
      get() {
        return this.active
      }, set(val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    

  }






}
</script>