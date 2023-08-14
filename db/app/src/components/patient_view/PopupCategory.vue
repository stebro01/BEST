<template>
    <q-popup-proxy @hide="$emit('close')">
        <q-card>
            
            <q-card-section>
                <q-input dense filled v-model="VALUE" hint="CATEGORY_CHAR" />
            </q-card-section>

            <q-card-section v-if="CATEGORIES">
                <q-list dense class="shadow-1">
                    <q-item v-for="(cat, cat_ind) in CATEGORIES" :key="cat_ind + 'cat'" v-ripple clickable @click="VALUE = cat">
                        {{ cat }}
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-actions align="center" v-if="tmp">
                <q-btn dense no-caps flat class="my-btn" @click="this.$emit('update', VALUE)">save</q-btn>
            </q-card-actions>
        </q-card>
    </q-popup-proxy>
</template>

<script>

export default {
    name: 'PopupCategory',

    components: {},

    props: ['item'],

    data() {
        return {
            tmp: undefined
        }
    },

    mounted() {
        if(!this.CATEGORIES) {
            const sql = "SELECT DISTINCT `CATEGORY_CHAR` FROM OBSERVATION_FACT"
            this.$store.dispatch('runQuery', sql)
            .then(res => {
                if (res.data.length > 0) {
                    const categories = res.data.map(item => item.CATEGORY_CHAR)
                    // remove null categories
                    if (categories.length) categories.splice(categories.indexOf(null), 1)

                    this.$store.commit('PATIENT_VIEW_EDIT_CATEGORIES_SET', categories)
                }
            })
        }
    },

    computed: {
        VALUE: {
            get() {
                return this.tmp || this.item
            }, set(val) {
                this.tmp = val
            }
        },

        CATEGORIES() {
            // but exlude the value of this.VALUE
            if (!this.$store.getters.PATIENT_VIEW.EDIT.CATEGORIES) return undefined
            return this.$store.getters.PATIENT_VIEW.EDIT.CATEGORIES.filter(item => item !== this.item)
        }

    },

    methods: {


        // ENDE METHODS
    }


}
</script>

<style></style>