<template>
    <q-dialog v-model="ACTIVE">
            <q-card style="min-width: 350px">
                <q-btn class="absolute-top-right z-top" icon="close" flat round @click="$emit('close')"/>
                <q-card-section class="text-h6">Liste sortieren</q-card-section>
                <q-card-section>
                    <q-scroll-area style="height: 90vh">
                <draggable
                    v-model="LIST"
                    item-key="name"
                    :move="checkMove"
                    @start="dragging = true"
                    @end="dragging = false"
                >
                    <template #item="{ element }">
                    <q-item dense clickable v-ripple class="q-mb-xs shadow-1 q-pa-xs">
                        <q-item-section avatar><q-icon name="drag_handle"/></q-item-section>
                        <q-item-section >{{ element.CONCEPT_NAME_CHAR }}</q-item-section>
                    </q-item>
                    </template>
                </draggable>
                </q-scroll-area>
                </q-card-section>
            </q-card>
        </q-dialog>
</template>

<script>
import draggable from "vuedraggable";

export default {
    name: 'PatientView_DialogDragDrop',

    components: { draggable },

    props: ['active', 'list'],

    data() {
        return {

        }
    },

    mounted() {

    },



    computed: {
        ACTIVE: {
            get() {
                return this.active

            },
            set(val) {
                this.$emit('close', val)
            }
        },

        LIST: {
            get() {
                if (!this.list) return []
                // only use the elements CONCEPT_NAME_CHAR AND CONCEPT_CD
                // result should look like: [{CONCEPT_NAME_CHAR: "Diastolic Blood Pressure", CONCEPT_CD: "DIASBP"}, ...]
                return this.list.map(item => {
                    return {
                        CONCEPT_NAME_CHAR: item.CONCEPT_NAME_CHAR,
                        CONCEPT_CD: item.CONCEPT_CD
                    }
                })

            },
            set(val) {
                this.$store.commit("PATIENT_VIEW_ACTIVE_LAYOUT_SET", val)
                this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", true)
            }
        }

    },

    methods: {

        checkMove: function(e) {
            // window.console.log("Future index: " + e.draggedContext.futureIndex);
        }



        // ENDE METHODS
    }


}
</script>

<style></style>
