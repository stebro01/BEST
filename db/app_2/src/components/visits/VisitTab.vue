<template>
    <q-toolbar v-if="VISITS.length >= 0" class="bg-orange-1 shadow-1 my-list-item">
        <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows active-color="primary" indicator-color="primary"
            style="width: 90%; height: 70px;" dense class="bg-orange-1">
            <q-tab class="shadow-1 q-pa-xs" name="all" @click="tabClicked('all')" no-caps style="max-width: 80px; height: 65px">
                <q-item class="shadow-1 fit">
                    <q-icon name="apps" size="md" class="q-mt-md"></q-icon>
                    <q-chip v-if="tab === 'all'" class="my-visit-color  absolute-top z-top" style="top: -10px"
                        size="xs">
                        alle Visiten
                    </q-chip>
                    <q-chip v-else color="orange-2" class="absolute-top z-top" style="top: -10px" size="xs">
                        alle Visiten </q-chip>
                </q-item>
            </q-tab>
            <q-tab v-for="(visit, ind_visit) in VISITS" :key="ind_visit + 'VISIT'" class="bg-orange-1 q-pa-xs"
                :name="`visite_${visit.ENCOUNTER_NUM}`" @click="tabClicked(visit)" no-caps style="max-width: 110px; height: 65px">
                <q-item class="shadow-1" style="max-width: 110px">
                    <q-item-section class="q-mt-xs">
                        <q-item-label caption>
                            <RESOLVE_CONCEPT :item="visit.ACTIVE_STATUS_CD" /> <span>.</span>
                        </q-item-label>
                        <q-item-label style="overflow: hidden"> {{ visit.START_DATE }}</q-item-label>
                        <q-chip v-if="tab === `visite_${visit.ENCOUNTER_NUM}`"
                            class="my-visit-color q-px-md absolute-top z-top" style="top: -10px" size="xs">Visiten-Tab:
                            {{ ind_visit + 1}}</q-chip>
                        <q-chip v-else color="orange-2" class="q-px-md absolute-top z-top" style="top: -10px"
                            size="xs">Visiten-Tab: {{ ind_visit + 1}}</q-chip>
                    </q-item-section>
                </q-item>
                <q-tooltip>
                    <div class="row">
                        <div class="col-3">ID: </div>
                        <div class="col-9">{{ visit.ENCOUNTER_NUM }}</div>
                        <div class="col-3">Status: </div>
                        <div class="col-9">{{ visit.ACTIVE_STATUS_CD }}</div>
                        <div class="col-3">Ort: </div>
                        <div class="col-9">{{ visit.LOCATION_CD }}</div>
                        <div class="col-3">Datum: </div>
                        <div class="col-9">{{ visit.START_DATE }} - {{ visit.END_DATE }}</div>
                        <div class="col-3">Details: </div>
                        <div class="col-9">{{ visit.VISIT_BLOB }}</div>
                    </div>
                </q-tooltip>
            </q-tab>
        </q-tabs>
        <!-- SPACE -->
        <q-space />
        <!-- BTNS -->
        <q-btn v-if="tab === 'all'" round flat icon="add" @click="$router.push({ name: 'Visits_New' })"><q-tooltip>Neue
                Visite anlegen</q-tooltip></q-btn>
        <q-fab v-else icon="more_vert" direction="down" flat>
            <q-fab-action color="orange-3" text-color="black" @click="$router.push({ name: 'Visits_New' })"
                icon="add"><q-tooltip>Neue Visite anlegen</q-tooltip></q-fab-action>
            <q-fab-action color="orange-3" text-color="black" @click="$router.push({ name: 'Visits_Edit' })"
                icon="edit"><q-tooltip>Visite bearbeiten</q-tooltip></q-fab-action>
            <q-fab-action color="orange-3" text-color="black" @click="deleteVisite(tab)" icon="delete"><q-tooltip>Visite
                    löschen</q-tooltip></q-fab-action>
        </q-fab>
    </q-toolbar>
</template>

<script>

import RESOLVE_CONCEPT from 'src/components/elements/ResolveConcept.vue'
import { my_confirm } from "src/tools/my_dialog";

export default {
    name: 'VisitTab',

    props: ['PATIENT'],

    components: { RESOLVE_CONCEPT },

    data() {
        return {
            VISITS: [],
            tab: 'all'
        }
    },

    mounted() {
        if (this.PATIENT_NUM) this.loadVisits()
    },

    watch: {
        ACTIVE_VISIT(val) {
            if (val === undefined) {
                //visite wurde abgewählt, sende Event 'all' an Parent 
                this.tab = 'all'
                return this.tabClicked('all')
            }
        }
    },

    computed: {
        PATIENT_NUM() {
            if (!this.PATIENT) return undefined
            else return this.PATIENT.PATIENT_NUM
        },
        ACTIVE_VISIT() {
            return this.$store.getters.VISIT_PINNED
        }
    },
    methods: {
        tabClicked(item) {
            this.$emit('clicked', item)
        },

        loadVisits() {
            //load visits
            this.$store.dispatch('searchDB', { query_string: { PATIENT_NUM: this.PATIENT_NUM, _sort: "START_DATE" }, table: "VISIT_DIMENSION" })
                .then(res => {
                    this.VISITS = []
                    res.forEach(r => {
                        if (r.VISIT_BLOB !== '<SYSTEM>') this.VISITS.push(r)
                    })
                    if (this.$store.getters.VISIT_PINNED) this.tab = `visite_${this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM}`
                })
        },

        async deleteVisite(item) {
            if (!item) return
            const a = item.split('_')
            if (a.length < 2) return
            const ENCOUNTER_NUM = parseInt(a[1])
            if (!await my_confirm(`Soll Visite <<${ENCOUNTER_NUM}>> wirklich gelöscht werden? Wichtig: Alle zugehörigen Observations werden auch gelöscht.`)) return
            this.$store.dispatch('deleteDB', { query_string: { ENCOUNTER_NUM: ENCOUNTER_NUM }, table: "VISIT_DIMENSION" })
                .then(() => {
                    this.$store.dispatch('deleteDB', { query_string: { ENCOUNTER_NUM: ENCOUNTER_NUM, _force: true }, table: "OBSERVATION_FACT" })
                        .then(() => {
                            this.$q.notify('erfolgreich')
                            this.$store.commit('VISIT_PINNED_SET', undefined)
                            this.tabClicked('all')
                            this.loadVisits()
                        })
                        .catch(e => this.$q.notify(e))


                }).catch(err => this.$q.notify(err))
        },


    }


}
</script>