<template>
    <q-popup-proxy @hide="$emit('close')">
        <q-card style="min-width: 300px; min-height: 300px">
            <q-btn class="absolute-top-right z-top" icon="close" flat round @click="$emit('close')" v-close-popup />
            <q-card-section>
                Wert bearbeiten
            </q-card-section>
            <!--  VALUES -->
            <!-- VALTYPE_CD === 'N' -->
            <q-card-section v-if="DATA.VALTYPE_CD === 'N'">
                <q-input dense filled type="number" v-model.number="value" hint="Zahl"
                    @blur="localData.NVAL_NUM = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'N' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'T'">
                <q-input dense filled type="text" v-model="value" hint="Text"
                    @blur="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'D' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'D'">
                <q-input dense filled type="date" v-model="value" hint="Zahl"
                    @change="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'F' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'F'">
                <q-option-group dense filled v-model="value" :options="answers"
                    @update:model-value="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'S' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'S'">
                <q-option-group dense filled v-model="value" :options="answers"
                    @update:model-value="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>

            <!-- BEMERKUNGEN
            <q-card-section>
                <q-input dense filled type="text" v-model="DATA.OBSERVATION_BLOB" label="Bemerkungen" />
            </q-card-section> -->

            <!-- ACTION BUTTONS -->
            <q-card-actions align="center">
                <span v-if="this.check">
                    <q-icon v-if="this.check.status" name="check_circle" color="green"><q-tooltip>CQL Check
                            valid</q-tooltip></q-icon>
                    <q-icon v-else name="report_problem" color="red"><q-tooltip>CQL Rule violated: {{ check.data
                    }}</q-tooltip></q-icon>
                </span>
                <q-btn v-if="SAVE_DETECTED" dense no-caps flat class="my-btn" 
                    @click="updateValue(value, localData)">save</q-btn>
            </q-card-actions>


        </q-card>
    </q-popup-proxy>
</template>

<script>

export default {
    name: 'PopupData',

    components: {},

    props: ['item'],

    data() {
        return {
            localData: undefined,
            value: undefined,
            answers: undefined,
            check: undefined,
            close_popup: false
        } 
    },

    watch: {
        ITEM(val) {
            this.loadData(val)
        }
    },

    mounted() {
        if (!this.item) this.$emit('close')
        this.loadData(this.item)

    },

    computed: {
        DATA() {
            return this.localData
        },

        ITEM() {
            return this.item
        },

        SAVE_DETECTED() {
            if (this.DATA.VALTYPE_CD === 'N' && this.value !== this.item.NVAL_NUM) return true
            if (this.DATA.VALTYPE_CD === 'D' && this.value !== this.item.TVAL_CHAR) return true
            if (this.DATA.VALTYPE_CD === 'T' && this.value !== this.item.TVAL_CHAR) return true
            if (this.DATA.VALTYPE_CD === 'F' && this.value !== this.item.TVAL_CHAR) return true
            if (this.DATA.VALTYPE_CD === 'S' && this.value !== this.item.TVAL_CHAR) return true

            return false
        }

    },


    methods: {
        loadData(item) {
            this.localData = JSON.parse(JSON.stringify(item))

        // 
        if (this.localData.VALTYPE_CD === 'N') {
            this.value = this.localData.NVAL_NUM
        }
        else if (this.localData.VALTYPE_CD === 'D') {
            this.value = this.localData.TVAL_CHAR
        }
        else if (this.localData.VALTYPE_CD === 'T') {
            this.value = this.localData.TVAL_CHAR
        }
        else if (this.localData.VALTYPE_CD === 'F') {
            this.$store.dispatch('getAnswers', { VALTYPE_CD: 'F', CONCEPT_CD: this.localData.CONCEPT_CD }).then((res) => {
                this.answers = res
                this.value = this.localData.TVAL_CHAR
            })
        }
        else if (this.localData.VALTYPE_CD === 'S') {
            this.$store.dispatch('getAnswersForObservation', { VALTYPE_CD: 'S', CONCEPT_CD: this.localData.CONCEPT_CD })
                .then((res) => {
                    this.value = this.localData.TVAL_CHAR
                    this.answers = res
                })
        }

        this.cql_check_data(item)
        },


        async cql_check_data(item) {
            this.check = await this.$store.dispatch('checkCQLRule', item)
        },

        updateValue(item, localData) {
            const result = { OBSERVATION_ID: localData.OBSERVATION_ID, VALTYPE_CD: localData.VALTYPE_CD }
            if (item === undefined) return
            if (result.VALTYPE_CD === 'N') result.NVAL_NUM = item
            else if (result.VALTYPE_CD === 'D') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'T') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'F') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'S') result.TVAL_CHAR = item
            if (result.VALTYPE_CD === 'F' || result.VALTYPE_CD === 'S') result.TVAL_RESOLVED = this.answers.find(answer => answer.value === item).label
            this.close_popup = true
            this.$emit('update', result)
        }

        // ENDE METHODS
    }


}
</script>

<style></style>