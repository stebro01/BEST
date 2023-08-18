<template>
   
  
      <!-- SELECT A FOLDER -->
      <q-dialog v-model="show_data_explorer">
          <SELECT_FOLDER v-if="show_data_explorer" :label="'Ordner zum Speichern auswählen'" :root_dir="last_selected_folder" 
            @close="$emit('close')"
            @save="downloadRAW($event, show_data_explorer_item)"
          />
      </q-dialog>
  
  </template>
  
  <script>
  
import SELECT_FOLDER from 'src/components/elements/SelectFolder.vue'
  
  export default {
    name: 'DownloadData',
  
    props: ['input_data', 'title'],
  
    components: { SELECT_FOLDER },
  
    data() {
      return {
        show_data_explorer: false,
        show_data_explorer_item: undefined,
        last_selected_folder: undefined,
  
      }
    },
  
    mounted() {
      if (!this.input_data) return
        this.show_data_explorer = true
        this.show_data_explorer_item = this.input_data
    },
  
    watch: {
  
    },
  
    computed: {
  
    },
  
    methods: {
 
  
      downloadRAW(folder, item) {
        this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: item.OBSERVATION_ID, _columns: ['OBSERVATION_BLOB', 'TVAL_CHAR', 'CATEGORY_CHAR', 'START_DATE'] } })
          .then(res => {
            var TMP_JSON = undefined
            if (res[0].CATEGORY_CHAR === 'RAW') TMP_JSON = JSON.parse(res[0].TVAL_CHAR)
            else TMP_JSON = {filename: `surveyBEST_${res[0].TVAL_CHAR}_${res[0].START_DATE}.json`}
            const payload = {
              filename: TMP_JSON.filename,
              dir: folder,
              buffer: res[0].OBSERVATION_BLOB
            }

            this.$store.dispatch('exportRAWdata_to_file', payload)
            .then(res => {
              this.$q.notify({
                message: `Datei erfolgreich gespeichert: ${payload.dir}/${payload.filename}`,
                color: 'positive',
                icon: 'cloud_done',
              })
            })
          })
          // CLOSE EVERYTING
          this.last_selected_folder = folder
          this.show_data_explorer = false
          this.show_data_explorer_item = undefined
          this.$emit('close')
      }
  
      // ENDE METHODS
    }
  
  
  }
  </script>
  