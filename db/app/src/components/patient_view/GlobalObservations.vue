<template>
    <div class="row q-pa-sm">
        <!-- DATA TO SHOW -->
        <div v-if="DATA_TO_SHOW" class="col">
            <q-icon name="info" class="q-pa-xs"><q-tooltip>Globale Variablen: </q-tooltip></q-icon>
            <q-chip v-for="(el, ind_el) of DATA_TO_SHOW" :key="ind_el + 'el'" dense clickable @click="$emit('add_sql', {CONCEPT_CD: el.CONCEPT_CD, CONCEPT_NAME_CHAR: el.CONCEPT_NAME_CHAR, NUM_VAL: el.NUM_VAL, TVAL_CHAR: el.TVAL_CHAR, TVAL_RESOLVED: el.TVAL_RESOLVED, VALTYPE_CD: el.VALTYPE_CD})">
                <div class="my-small-text q-mr-xs my-el">{{ el.CONCEPT_NAME_CHAR }}: </div>
                <div v-if="el.VALTYPE_CD === 'N'" class="my-el">{{ el.NVAL_NUM }} <span v-if="el.UNIT_CD"
                        class="my-small-text my-el">{{ el.UNIT_CD }}</span></div>
                <div v-else-if="el.VALTYPE_CD === 'T' || el.VALTYPE_CD === 'D'" class="my-el">{{ el.TVAL_CHAR }}</div>
                <div v-else class="my-el">{{ el.TVAL_RESOLVED }}</div>
                <q-tooltip>
                    {{ el.CONCEPT_NAME_CHAR }} ({{ el.CONCEPT_CD }}):
                    <div v-if="el.VALTYPE_CD === 'N'">{{ el.NVAL_NUM }} <span v-if="el.UNIT_CD">{{ el.UNIT_CD }}</span>
                    </div>
                    <div v-else-if="el.VALTYPE_CD === 'T'">{{ el.TVAL_CHAR }}</div>
                    <div v-else>{{ el.TVAL_RESOLVED }}</div>
                </q-tooltip>
            </q-chip>
        </div>

        <!-- MISSING DATA -->
        <div class="col" v-if="MISSING_ELEMENTS && MISSING_ELEMENTS.length > 0">
            <q-icon name="warning" color="red"><q-tooltip>Folgende Werte wurden nicht gefunden</q-tooltip> </q-icon>
            <q-chip v-for="(el_missing, ind_el_missing) of MISSING_ELEMENTS" :key="ind_el_missing + 'missing'" dense
                class="bg-red-2" size="sm" clickable @click="addData(el_missing)">
                {{ el_missing.label }}
                <q-tooltip>Anklicken zum Hinzufügen; der Wert wird der aktuellen Visite zugeordnet</q-tooltip>
            </q-chip>

        </div>


        <!-- ENTER MISSING DATA DIALOG -->
        <!-- NEW ENTER DATA DIALOG -->
        <q-dialog v-model="show_new_obs_dialog">
            <ENTER_NEW_DATA_DIALOG v-if="show_new_obs_dialog_data" :item="show_new_obs_dialog_data"
                @close="show_new_obs_dialog = false; show_new_obs_dialog_data = undefined"
                @save="updateObservationsFromSaveDialog($event)" />
        </q-dialog>

    </div>
</template>

<script>
import { datenow_isostring } from 'src/tools/mydate'
import ENTER_NEW_DATA_DIALOG from 'src/components/patient_view/EnterNewDataDialog.vue'

export default {
    name: 'GlobalObservations',

    components: { ENTER_NEW_DATA_DIALOG },


    data() {
        return {
            localData: undefined,
            show_new_obs_dialog: false,
            show_new_obs_dialog_data: undefined,
        }
    },

    mounted() {
        if (this.ACTIVE_PATIENT) this.loadGlobalObservations(this.ACTIVE_PATIENT, this.ELEMENTS_TO_SHOW)
    },

    watch: {
        ACTIVE_PATIENT() {
            if (this.ACTIVE_PATIENT) this.loadGlobalObservations(this.ACTIVE_PATIENT, this.ELEMENTS_TO_SHOW)
        }
    },

    computed: {
        ELEMENTS_TO_SHOW() {
            return [{ value: 'SCTID: 184099003', label: 'Geb.-Datum' }, { value: 'SCTID: 371484003', label: 'Name' }, { value: 'SCTID: 263495000', label: 'Gender' }, { value: 'SCTID: 246261001', label: 'Gruppe' }, { label: 'Hauptdiagnose', value: 'SCTID: 8319008' }]
        },

        ACTIVE_PATIENT() {
            return this.$store.getters.PATIENT_PINNED
        },

        DATA_TO_SHOW() {
            if (!this.localData) return undefined
            else return this.localData
        },

        MISSING_ELEMENTS() {
            // ELEMENTS that are in ELEMENTS_TO_SHOW but not in DATA_TO_SHOW
            if (!this.DATA_TO_SHOW) return this.ELEMENTS_TO_SHOW
            else {
                const TMP = []
                for (let el of this.ELEMENTS_TO_SHOW) {
                    let res = this.DATA_TO_SHOW.filter(el2 => el2.CONCEPT_CD === el.value)
                    if (res.length === 0) TMP.push(el)
                }
                return TMP
            }
        }

    },

    methods: {
        async loadGlobalObservations(patient, elements) {
            const TMP = []
            for (let el of this.ELEMENTS_TO_SHOW) {
                let res = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { PATIENT_NUM: patient.PATIENT_NUM, CONCEPT_CD: el.value, _view: true } })
                if (res.length > 0) TMP.push(res[0])
            }
            if (TMP.length > 0) this.localData = TMP
        },

        async addData(item) {
            const res = await this.$store.dispatch('searchDB', { table: 'CONCEPT_DIMENSION', query_string: { CONCEPT_CD: item.value } })
            if (!res || res.length === 0) return this.$q.notify({ message: 'Error loading concept', color: 'red-5' })

            const NEW_OBS = {
                ENCOUNTER_NUM: this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM,
                PATIENT_NUM: this.$store.getters.VISIT_PINNED.PATIENT_NUM,
                PROVIDER_ID: this.$store.getters.PROVIDER_PINNED.PROVIDER_ID,
                START_DATE: datenow_isostring(),
                CONCEPT_CD: res[0].CONCEPT_CD,
                CONCEPT_NAME_CHAR: item.label,
                VALTYPE_CD: res[0].VALTYPE_CD,
                UNIT_CD: res[0].UNIT_CD,
                SOURCESYSTEM_CD: res[0].SOURCESYSTEM_CD
            }

            this.show_new_obs_dialog = true
            this.show_new_obs_dialog_data = NEW_OBS
        },

        updateObservationsFromSaveDialog(obs) {
            this.show_new_obs_dialog = false
            this.show_new_obs_dialog_data = undefined
            if (obs) this.localData.push(obs)
        },

        // ENDE METHODS
    }


}
</script>

<style></style>