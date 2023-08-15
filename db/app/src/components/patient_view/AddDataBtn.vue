<template>
    <q-page-sticky position="bottom-right" :offset="fabPos">
        <q-fab v-model="fab_status" color="dark" icon="add" direction="up" :disable="draggingFab" v-touch-pan.prevent.mouse="moveFab">
                <div v-if="this.$store.getters.VISIT_PINNED" >
                    <q-btn @click="fab_status = true" round class="my-observation-color" icon="file_download"><q-tooltip>Daten importieren</q-tooltip></q-btn>
                    <q-btn @click="fab_status = true" round class="my-observation-color" icon="add" ><q-tooltip>Observation hinzufügen</q-tooltip></q-btn>
                </div>
            <q-fab-action v-if="this.$store.getters.PATIENT_PINNED" external-label label-position="right" class="my-visit-color" @click="onClickVisit()" :icon="VISIT_TAB.icon" label="Visite"/>
            <q-fab-action class="my-patient-color" external-label label-position="right" @click="onClickPatient()" :icon="PATIENT_TAB.icon" label="Patient"/>

        </q-fab>
        
    </q-page-sticky>
</template>

<script>

export default {
    name: 'AddDataBtn',

    components: {},

    props: [],

    data() {
        return {
            draggingFab: false,
            fabPos: [150, 0],
            fab_status: true

        }
    },

    mounted() {


    },

    computed: {
        OBSERVATION_TAB() {
            return this.$store.getters.ENV.essentialLinks.find((el) => {
                if (el.label === 'Abfragen') return el
            }) 
        },

        VISIT_TAB() {
            return this.$store.getters.ENV.essentialLinks.find((el) => {
                if (el.label === 'Visiten') return el
            }) 
        },

        PATIENT_TAB() {
            return this.$store.getters.ENV.essentialLinks.find((el) => {
                if (el.label === 'Patients') return el
            }) 
        }
    },


    methods: {
        moveFab(ev) {
            this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

            this.fabPos = [
                this.fabPos[0] - ev.delta.x,
                this.fabPos[1] - ev.delta.y
            ]

            // if (this.fabPos[1] > 400) this.fabPos[1] = 0
        },

        onClickObservation() {
            console.log(this.obs_tab)
            
        },

        onClickVisit() {
            this.$q.notify('COmming soon')
        },

        onClickPatient() {
            this.$q.notify('COmming soon')
        }
    }


}
</script>

<style></style>