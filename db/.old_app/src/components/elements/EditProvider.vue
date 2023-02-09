<template>
    <q-dialog v-model="ACTIVE">
      <q-card v-if="localData" class="my-card">
        <q-btn icon="close" class="absolute-top-right z-top" flat round @click="$emit('close')"/>
        <q-card-section>{{ title }}</q-card-section>
        <q-card-section>
          <q-form>
            <q-markup-table>
              <tbody>
                <!-- PROVIDER_ID -->
                <tr><td>PROVIDER_ID</td><td colspan="3"><q-input :disable="mode === 'edit'" dense v-model="localData.PROVIDER_ID" @blur="dataChanged()"/> </td></tr>
                <!-- PROVIDER_PATH -->
                <tr><td>PROVIDER_PATH</td><td colspan="3"><q-input  dense v-model="localData.PROVIDER_PATH" @blur="dataChanged()"/> </td></tr>
                 <!-- NAME_CHAR -->
                 <tr><td>Name</td><td colspan="3"><q-input dense v-model="localData.NAME_CHAR" @blur="dataChanged()"/> </td></tr>
                 <!-- Details -->
                 <tr><td>Details</td><td colspan="3"><q-input dense v-model="localData.CONCEPT_BLOB" @blur="dataChanged()"/> </td></tr>
              </tbody>
            </q-markup-table>
          </q-form>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn v-if="something_changed" lat rounded class="my-btn" @click="saveItem">{{ $store.getters.TEXT.btn.save }}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>


<script>
export default {
  name: 'EditProvider',

  props: ['active', 'title', 'item', 'mode'],

  components: {  },

  data() {
    return {
      something_changed: false,
      localData: undefined
    }
  },

  mounted() {
    if (this.mode === 'add') {
      this.localData = {}
    }
    // else
    if (!this.item) return
    this.localData = JSON.parse(JSON.stringify(this.item))
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
    saveItem() {
      this.$emit('save', this.localData)
    },

    dataChanged() {
      this.something_changed = false
      if (!this.localData || !this.localData.PROVIDER_ID || !this.localData.PROVIDER_PATH || !this.localData.NAME_CHAR) return
      this.something_changed = true
    }

  }






}
</script>