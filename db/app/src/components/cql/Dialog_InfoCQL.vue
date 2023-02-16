<template>
   <!-- CONCEPT_PATH_DIALOG -->
   <q-dialog v-model="ACTIVE">
      <q-card>
        <q-card-section>
          <div class="text-h6">Erstelle/Bearbeite eine CQL Regel</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          CQL ist eine standardisierte Sprache zur Überprüfung von Werten mit Hilfe einer Logik. <br>
          Die Syntax ist definiert und kann von CQL-Interpretern verstanden werden. <br>
          Diese Anwendung verwendet intern die Bibliothek <b>cql-execution`</b>. Diese ist in der Lage,
          cql/json-eml-Anweisungen zu interpretieren.
          <br>Daher ist es notwendig, dass CQL Anweisungen zunächst in JSON/EML Anweisungen umgewandelt werden. Hierfür
          stehen derzeit nur JAVA-Bibliotheken zur Verfügung.
          <br>Deswegen gibt es für diese APP einen Docker-container, der, wenn gestartet, eine API unter
          http://localhost:8082/cql/translator mit POST Requests zur Verfügung stellt.

          <br>Um diesen zu starten, muss folgendes getan werden

          <ul>
            <li>GIT Repository herunterladen unter: <em>https://github.com/stebro01/BEST.git</em></li>
            <li>im Ordner: <em>./BEST/db/cql/cql-translation</em> den Docker starten mit <b>`docker-compose up`</b></li>
          </ul>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>


<script>

export default {
  name: 'Dialog_InfoCQL',

  props: ['active'],


  data() {
    return {
    }
  },

  mounted() {

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