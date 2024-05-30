<template>
  <q-dialog v-model="isactive">
        <q-card>
            <q-btn class="absolute-top-right z-top" icon="close" round flat @click="$emit('close')"/>
            <q-card-section class="text-subtitle2">
                Hilfe zum CSV Import
            </q-card-section>
            <q-card-section class="text-caption">
                <q-card-section>
                    <span v-if="no_limit">CSV muss als UTF-8 kodiert sein und es darf nur eine Person / Visite hinterlegt sein.</span>
                    <q-markup-table separator="vertical" flat bordered >
                        <thead >
                            <tr>
                                <th class="text-left" colspan="11">Beispiel</th>
                            </tr>
                            <tr class="bg-grey-3">
                            <th class="text-center text-bold">FIELD_NAME</th>
                            <th class="text-center">PATIENT_NUM</th>
                            <th class="text-center">PATIENT_CD</th>
                            <th class="text-center">ENCOUNTER_NUM</th>
                            <th class="text-center">START_DATE</th>
                            <th class="text-center">PROVIDER_ID</th>
                            <th class="text-center">LOCATION_CD</th>
                            <th class="text-center">LID: 63900-5</th>
                            <th class="text-center">SCTID: 263495000</th>
                            <th class="text-center">SCTID: 184099003</th>
                            <th class="text-center">SCTID: 1148423001</th>
                            <th class="text-center">SCTID: LID: 2085-9</th>
                            </tr>
                        </thead>
                        <tbody class="">
                            <tr class="bg-grey-3">
                                <td class="text-center text-bold">VALTYPE_CD</td>
                                <td class="text-center">numeric</td>
                                <td class="text-center">text</td>
                                <td class="text-center">numeric</td>
                                <td class="text-center">date</td>
                                <td class="text-center">text</td>
                                <td class="text-center">text</td>
                                <td class="text-center">numeric</td>
                                <td class="text-center">text</td>
                                <td class="text-center">date</td>
                                <td class="text-center">numeric</td>
                                <td class="text-center">numeric</td>
                            </tr>
                            <tr class="bg-grey-3">
                                <td class="text-center text-bold">UNIT_CD</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">years</td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center"></td>
                                <td class="text-center">mmol/l</td>
                            </tr>
                            <tr class="bg-grey-3">
                                <td class="text-center text-bold">NAME_CHAR</td>
                                <td class="text-center">Patient</td>
                                <td class="text-center">Patienten-ID</td>
                                <td class="text-center">Visite</td>
                                <td class="text-center">Datum</td>
                                <td class="text-center">Untersucher</td>
                                <td class="text-center">Ort</td>
                                <td class="text-center">Age</td>
                                <td class="text-center">Gender</td>
                                <td class="text-center">Date of birth</td>
                                <td class="text-center">MoCA -  Montreal Cognitive Assessment version 8.1 </td>
                                <td class="text-center">HDL-Cholesterin</td>
                            </tr>
                            <tr>
                                <td class="text-center text-bold"></td>
                                <td class="text-center">1</td>
                                <td class="text-center">100172892</td>
                                <td class="text-center">1</td>
                                <td class="text-center">2022-12-15</td>
                                <td class="text-center">sb</td>
                                <td class="text-center">ukj</td>
                                <td class="text-center">45</td>
                                <td class="text-center">Male</td>
                                <td class="text-center">1960-01-02</td>
                                <td class="text-center">27</td>
                                <td class="text-center">4.5</td>
                            </tr>
                         
                        </tbody>
                        </q-markup-table>
                </q-card-section>
                

            </q-card-section>
            <q-separator />
            <q-card-actions align="center">
                <q-btn @click="exporData()" class="my-btn" flat no-caps rounded>Tabelle exportieren</q-btn>
            </q-card-actions>
        </q-card>  

    </q-dialog>
</template>

<script>
import { exportFile } from 'quasar'
const CSV_TEMPLATE = 'FIELD_NAME;PATIENT_NUM;ENCOUNTER_NUM;START_DATE;PROVIDER_ID;LOCATION_CD;LID: 63900-5;SCTID:263495000;SCTID: 184099003;SCTID: 1148423001;LID: 2085-9\nVALTYPE_CD;numeric;numeric;date;text;text;numeric;text;date;numeric;numeric\nUNIT_CD;;;;;;years;;;;mmol/l\nNAME_CHAR;Patient;Visite;Datum;Untersucher;Ort;Age;Gender;Date of birth;MoCA -  Montreal Cognitive Assessment version 8.1;HDL-Cholesterin\n;1;1;2022-12-15;sb;ukj;45;Male;1960-01-02;27;4,50'

export default {
    name: 'Help_CSV_Import',

    props: ['active', 'no_limit'],

    data() {
        return {
            
        }
    },

    mounted() {

    },

    watch:{

    },

    computed: {
        isactive: {
            get() {
                return this.active
            },
            set(val){
                //
            }
        }
    },
    methods: {
        exporData() {
            const status = exportFile(
          'table-export.csv',
          CSV_TEMPLATE,
          'text/csv'
        )

        if (status !== true) {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
        }
    }


}
</script>