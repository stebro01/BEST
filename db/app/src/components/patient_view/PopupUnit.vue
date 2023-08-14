<template>
    <q-popup-proxy @hide="$emit('close')">
        <q-card style="height: 350px">

            <q-card-section>
                <q-input dense filled v-model="VALUE" hint="UNIT_CD" />
            </q-card-section>

            <q-card-section v-if="UNIT_CD" class="q-pa-none">
                <q-scroll-area style="height: 200px; max-width: 300px;">
                <q-list dense class="shadow-1">
                    <q-item v-for="(cat, cat_ind) in UNIT_CD" :key="cat_ind + 'cat'" v-ripple clickable @click="VALUE = cat">
                        {{ cat.label }}
                    </q-item>
                </q-list>
            </q-scroll-area>
            </q-card-section>

            <q-card-actions align="center" v-show="tmp">
                <q-btn dense no-caps flat class="my-btn" @click="saveValue(tmp)">save</q-btn>
            </q-card-actions>

           
        </q-card>
    </q-popup-proxy>
</template>

<script>

export default {
    name: 'PopupUnit',

    components: {},

    props: ['item'],

    data() {
        return {
            tmp: undefined,
        }
    },

    mounted() {
        if(!this.UNIT_CD) {
            this.$store.dispatch('getConceptList', '\\SNOMED-CT\\767525000\\LA')
            .then(res => {
                this.$store.commit('PATIENT_VIEW_EDIT_UNITCD_SET', res)
            })
        }
    },

    computed: {
        VALUE: {
            get() {
                if (!this.tmp) return (this.item.UNIT_CD || this.item.UNIT_RESOLVED)
                else return (this.tmp.label || this.tmp)
            }, set(val) {
                this.tmp = val
            }
        },

        UNIT_CD() {
            // but exlude the value of this.VALUE
            return this.$store.getters.PATIENT_VIEW.EDIT.UNIT_CD
        }

    },

    methods: {
        saveValue(val) {
            this.$emit('update', val)
        }

        // ENDE METHODS
    }


}
</script>

<style></style>