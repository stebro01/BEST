<template>
    <q-page-sticky class="z-max" position="bottom-right" :offset="fabPos">
        <q-fab v-model="fab_status" color="dark" icon="add" direction="up" :disable="draggingFab" v-touch-pan.prevent.mouse="moveFab">
            <q-fab-action v-if="this.$store.getters.VISIT_PINNED" external-label label-position="left" class="my-observation-color"  @click="onAddObservation()" :icon="OBSERVATION_TAB.icon" label="+ Observation"/>
            <q-fab-action v-if="this.$store.getters.VISIT_PINNED" external-label label-position="left" class="my-observation-color" @click="onImportClick()" icon="file_download" label="+ Import"/>
            <q-fab-action v-if="this.$store.getters.PATIENT_PINNED" external-label label-position="left" class="my-visit-color" @click="onClickVisit()" :icon="VISIT_TAB.icon" label="+ Visite"/>
            <q-fab-action class="my-patient-color" external-label label-position="left" @click="onClickPatient()" :icon="PATIENT_TAB.icon" label="+ Patient"/>

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
            fabPos: [10, 10],
            fab_status: false

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

        onAddObservation() {
            this.$router.push({name: 'Observation_New'})
            
        },

        onClickVisit() {
            this.$router.push({name: 'Visits_New'})
        },

        onClickPatient() {
            this.$router.push({name: 'Patients'})
        },

        onImportClick() {
            this.$router.push({name: 'Observation_Import'})
        }
    }


}
</script>

<style></style>