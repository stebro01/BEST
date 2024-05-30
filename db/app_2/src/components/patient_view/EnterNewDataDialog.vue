<template>
        <q-card style="min-width: 300px; min-height: 300px" v-if="localData">
            <q-btn class="absolute-top-right z-top" icon="close" flat round @click="$emit('close')" v-close-popup />
            <q-card-section class="text-bold">
                Neuer Wert
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
                <q-input dense filled type="date" v-model="value" hint="Datum"
                    @change="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'F' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'F' && answers">
                <q-option-group dense filled v-model="value" :options="answers"
                    @update:model-value="localData.TVAL_CHAR = value; cql_check_data(localData)" />
            </q-card-section>
            <!-- VALTYPE_CD === 'S' -->
            <q-card-section v-else-if="DATA.VALTYPE_CD === 'S' && answers">
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
</template>

<script>

export default {
    name: 'EnterNewDataDialog',

    components: {},

    props: ['item'],

    data() {
        return {
            localData: undefined,
            value: null,
            answers: undefined,
            check: undefined
        }
    },

    mounted() {
        if (!this.item) this.$emit('close')
        this.localData = JSON.parse(JSON.stringify(this.item))
        //
        if (this.localData.VALTYPE_CD === 'N') {
            // this.value = this.localData.NVAL_NUM
        }
        else if (this.localData.VALTYPE_CD === 'D') {
            // this.value = this.localData.TVAL_CHAR
        }
        else if (this.localData.VALTYPE_CD === 'T') {
            // this.value = this.localData.TVAL_CHAR
        }
        else if (this.localData.VALTYPE_CD === 'F') {
            this.$store.dispatch('getAnswers', { VALTYPE_CD: 'F', CONCEPT_CD: this.localData.CONCEPT_CD }).then((res) => {
                this.answers = res
                this.answers.push(this.$store.getters.ANSWER_ABSENT)
            })
        }
        else if (this.localData.VALTYPE_CD === 'S') {
            this.$store.dispatch('getAnswersForObservation', { VALTYPE_CD: 'S', CONCEPT_CD: this.localData.CONCEPT_CD })
                .then((res) => {
                    this.value = undefined
                    this.answers = res
                    this.answers.push(this.$store.getters.ANSWER_ABSENT)
                })
        }

        // this.cql_check_data(this.item)

    },

    computed: {
        DATA() {
            return this.localData
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
        async cql_check_data(item) {
            this.check = await this.$store.dispatch('checkCQLRule', item)
        },

        async updateValue(item, localData) {
            const result = localData
            if (!item) return
            if (result.VALTYPE_CD === 'N') result.NVAL_NUM = item
            else if (result.VALTYPE_CD === 'D') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'T') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'F') result.TVAL_CHAR = item
            else if (result.VALTYPE_CD === 'S') result.TVAL_CHAR = item
            if (result.VALTYPE_CD === 'F' || result.VALTYPE_CD === 'S') result.TVAL_RESOLVED = this.answers.find(answer => answer.value === item).label

            const res = await this.$store.dispatch('addDB', {table: 'OBSERVATION_FACT', query_string: result})
            if (res) {
                result.OBSERVATION_ID = res.OBSERVATION_ID
                this.$q.notify({ type: 'positive', message: 'Wert erfolgreich gespeichert' })

                this.$emit('save', result)
            } else {
                this.$q.notify({ type: 'negative', message: 'Wert konnte nicht gespeichert werden' })
                this.$emit('close')
            }
        }

        // ENDE METHODS
    }


}
</script>

<style></style>
