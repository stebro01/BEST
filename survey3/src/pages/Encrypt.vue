<template>
  <q-page data-cy="page_settigns">
    <div class="column items-center">
      <!-- TITLE -->
      <div class="col q-ma-md text-caption">
        Nachrichten ver- und entschlüsseln
        <table>
          <tr><td>Motivation:</td><td>RSA mit priv/pub Key nur für kleine Nachrichten sinnvoll</td></tr>
          <tr><td>Prinzip:</td><td>1. erzeuge eine AES Key (128bit) 2. Verschluessele Nachricht mit AES Key 3. Verschluessele AES Key mit RSA-public Key 4. zum Enschluesseln muss dann der AES-Key mit RSA-priv entschlüsselt werden; dann kann mit dem AES Key die Nachricht enschlüsselt werdne</td></tr>
        </table>
      </div>

      <!-- Verschluesseln -->
      <div class="col text-center shadow-1 q-pa-md my-form">
        <div class="text-caption">unverschlüsselte Nachricht</div>
        <q-input dense v-model="data" input-class="text-center"/>
      </div>

      <div class="col q-mt-md">
        <q-btn flat @click="do_encrypt">ENCRYPT</q-btn>
      </div>

      <!-- Encrypted Text -->
      <div class="col text-center shadow-1 q-pa-md my-form q-mt-md">
        
        <q-input dense v-model="encrypted_data" input-class="text-center" hint="verschlüsselte Nachricht (mit AES Key - 128 BIT)" />
        
        <q-input dense v-model="encrypted_key" input-class="text-center" hint="verschlüsselte AES Key mit RSA encryption (publicKey)" />
      </div>

      <div class="col q-mt-md">
        <q-btn flat @click="do_decrypt">DECRYPT</q-btn>
      </div>

        <!-- decrypted Text -->
      <div class="col text-center shadow-1 q-pa-md my-form q-mt-md">
        <div class="text-caption">entschlüsselte Nachricht</div>
        <q-input dense readonly v-model="decrypted_text" input-class="text-center" hint="enschlüsselt mit durch RSA-decrypt entschlüsselten AES Key" />
        
      </div>

      <!-- PICK A FILE -->
      <div class="col q-mt-md" style="width: 300px">
        <q-file
          v-model="file"
          label="Pick one file"
          filled
          style="max-width: 300px"
        />
        <q-btn v-if="file !== null" @click="loadFile()">
          LOAD
        </q-btn>
      </div>
    
    </div>

    <!-- BACKBUTTON -->
    <BACKBUTTON :go_back="true" />

  </q-page>
</template>

<script>
  import {encrypt, decrypt} from 'src/tools/hhash'
  import BACKBUTTON from 'src/components/BackButton.vue'

  export default {
    components: {BACKBUTTON},
    data() {
      return {
        TEXT: this.$store.getters.TEXT,
        file: null,
        data: 'some text ...',
        encrypted_data: '',
        encrypted_key: '',
        decrypted_text: ''
      }
    },
    computed: {
      keyPair() {
        if (this.$store.getters.SETTINGS.user_keyPair === undefined) this.$store.getters.SETTINGS._USER.create()
        return this.$store.getters.SETTINGS.user_keyPair
      }
    },
    methods: {
      do_encrypt() {
        const enc = encrypt(this.data, this.keyPair.publicKey)
        this.encrypted_key = enc.encrypted_key
        this.encrypted_data = enc.encrypted_data
      },
      do_decrypt() {
        this.decrypted_text = decrypt({encrypted_data: this.encrypted_data, encrypted_key: this.encrypted_key}, this.keyPair.privateKey)
      },
      loadFile() {
        const reader = new FileReader();
        reader.onload = (e) => {
          let txt = e.target.result
          let json = JSON.parse(txt)
          this.decrypted_text = decrypt({encrypted_data: json.encrypted_data, encrypted_key: json.encrypted_key}, this.keyPair.privateKey)
        }
        reader.readAsText(this.file);

      }
    }
  }

</script>
