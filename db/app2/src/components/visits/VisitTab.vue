<template>
    <q-toolbar v-if="VISITS.length >= 0" class="bg-orange-1 shadow-1 my-list-item">
        <q-toolbar-title class="text-subtitle2">
            Visiten
        </q-toolbar-title>
        <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows active-color="primary" indicator-color="primary"
            style="width: 75%" dense>
            <q-tab :class="{ 'my-visit-color': tab === 'all' }" style="max-width: 100px" name="all" icon="apps"
                @click="tabClicked('all')" no-caps>Alle</q-tab>
            <q-tab v-for="(visit, ind_visit) in VISITS" :key="ind_visit + 'VISIT'"
                :name="`visite_${visit.ENCOUNTER_NUM}`" @click="tabClicked(visit)" no-caps style="max-width: 110px">
                <q-item class="shadow-1" style="max-width: 110px">
                    <q-item-section class="q-mt-xs">
                        <q-item-label caption>
                            <RESOLVE_CONCEPT :item="visit.ACTIVE_STATUS_CD" /> <span>.</span>
                        </q-item-label>
                        <q-item-label style="overflow: hidden"> {{ visit.START_DATE }}</q-item-label>
                        <q-item-label caption>(ID {{ visit.ENCOUNTER_NUM }})</q-item-label>
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

        <q-space />
        <q-tabs class="full-height">
            <q-tab style="max-width: 40px" @click="$router.push({ name: 'Visits_New' })"><q-icon name="add"
                    size="sm" /><q-tooltip>Neue Visite anlegen</q-tooltip></q-tab>
        </q-tabs>
        <q-separator v-if="tab !== 'all'" vertical inset />
        <q-fab v-if="tab !== 'all'" icon="more_vert" direction="down" flat>
            <q-fab-action color="orange-3" text-color="black" @click="$router.push({ name: 'Visits_Edit' })"
                icon="edit"><q-tooltip>Visite bearbeiten</q-tooltip></q-fab-action>
            <q-fab-action color="orange-3" text-color="black" @click="deleteVisite(tab)" icon="delete"><q-tooltip>Visite
                    löschen</q-tooltip></q-fab-action>
        </q-fab>

    </q-toolbar>
</template>

<script>

import RESOLVE_CONCEPT from 'src/components/elements/ResolveConcept.vue'

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

    watch:{
        ACTIVE_VISIT(val) {
            if (val === undefined)  {
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
            this.$store.dispatch('searchDB', { query_string: {PATIENT_NUM:this.PATIENT_NUM}, table: "VISIT_DIMENSION"})
            .then(res => {
                this.VISITS = []
                res.forEach(r => {
                    if (r.VISIT_BLOB !== '<SYSTEM>') this.VISITS.push(r)
                })
                if (this.$store.getters.VISIT_PINNED) this.tab = `visite_${this.$store.getters.VISIT_PINNED.ENCOUNTER_NUM}`
            })
        },

        deleteVisite(item) {
            if (!item) return
            const a = item.split('_')
            if (a.length < 2) return
            const ENCOUNTER_NUM = parseInt(a[1])
            if (!confirm(`Soll Visite <<${ENCOUNTER_NUM}>> wirklich gelöscht werden? Wichtig: Alle zugehörigen Observations werden auch gelöscht.`)) return    
            this.$store.dispatch('deleteDB', {query_string: {ENCOUNTER_NUM: ENCOUNTER_NUM}, table: "VISIT_DIMENSION"})
            .then(() => {
                this.$store.dispatch('deleteDB', {query_string: {ENCOUNTER_NUM: ENCOUNTER_NUM, _force: true}, table: "OBSERVATION_FACT"})
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