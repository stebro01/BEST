<template>
    <!-- VISITEN LISTE -->
    <div class="row" v-if="$store.getters.VISIT_PINNED">
        <!-- DROP DOWN BTN -->
        <div class="col-2 flex flex-center">
            <q-card class="q-pa-none">
                <q-card-section class="q-pa-none my-small-text text-center">
                    Visiten <span v-if="VISITEN">({{ VISITEN.length }})</span>
                </q-card-section>
                <q-card-section class="q-pa-none">
                    <q-btn-dropdown class="fit" size="sm" dense flat color="primary" :label="VISITEN_BUTTON">
                <q-list>
                    <q-item clickable v-close-popup @click="selectVisit(item)" v-for="(item, index) in VISITEN"
                        :key="index + 'btn'">
                        <q-item-section>
                            <q-item-label>{{ item.START_DATE }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
                </q-card-section>
            </q-card>

        </div>
        <!-- TAB MIT VISITEN -->
        <div class="col-10 q-pa-xs ">

            <q-tabs v-model="ACTIVE_VISIT_TAB" dense no-caps :breakpoint="0" align="justify"
                class="bg-grey-4 text-black shadow-1">
                <q-tab v-for="(item, index) in VISITEN" :key="index + 'tab'" :name="item.ENCOUNTER_NUM"
                    :label="`(${index + 1}) ${item.START_DATE}`"
                />
                
            </q-tabs>

        </div>
    </div>
</template>

<script>
export default {
    name: 'PatientView_VisitList',

    props: [],

    data() {
        return {
            localData: {
                VISITS: []
            }
        }
    },

    mounted() {
        if (this.PATIENT) this.loadVisits();
    },

    watch: {
        PATIENT: function (newVal, oldVal) {
            if (newVal) this.loadVisits();
        }
    },

    computed: {
        PATIENT() {
            return this.$store.getters.PATIENT_PINNED;
        },

        VISITEN() {
            if (!this.localData.VISITS.length) return undefined;
            return this.localData.VISITS
        },

        VISITEN_BUTTON() {
            if (!this.$store.getters.VISIT_PINNED) return 'bitte auswählen';
            else return this.$store.getters.VISIT_PINNED.START_DATE;
        },

        ACTIVE_VISIT_TAB: {
            get() {
                if (!this.$store.getters.VISIT_PINNED) return undefined;
                return this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM;
            },
            set(val) {
                if (!this.$store.getters.VISIT_PINNED) return;
                this.$store.commit('VISIT_PINNED_SET', this.localData.VISITS.find(item => item.ENCOUNTER_NUM === val))
            }
        }
    },

    methods: {
        async loadVisits() {
            if (!this.PATIENT) return;
            const res = await this.$store.dispatch('searchDB', {
                table: 'VISIT_DIMENSION',
                query_string: {
                    PATIENT_NUM: this.PATIENT.PATIENT_NUM
                }
            });
            if (res) {
                // but filter elements with VISIT_BLOB: '<SYSTEM>'
                this.localData.VISITS = res.filter(item => item.VISIT_BLOB !== '<SYSTEM>')    
                if (!this.$store.getters.VISIT_PINNED && this.localData.VISITS.length) this.$store.commit('VISIT_PINNED_SET', this.localData.VISITS[0])
            }
            else this.$q.notify({ type: 'negative', message: 'Fehler beim Laden der Visiten' });
        },

        selectVisit(item) {
            this.$store.commit('VISIT_PINNED_SET', item)
        }

        // ENDE METHODS
    }


}
</script>

<style></style>