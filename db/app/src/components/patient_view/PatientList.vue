<template>
    <div v-if="PATIENTS" :style="`height: ${SIZE}`">
        <div class="q-px-sm q-py-xs" style="height: 50px">
            <q-input input-class="text-caption" dense filled v-model="filter_patient">
                <template v-slot:prepend>
                    <q-icon name="search" size="xs" />
                </template>
                <template v-slot:append>
                    <q-icon name="clear" size="xs" @click="filter_patient = null" />
                </template>
            </q-input>

        </div>

        <q-virtual-scroll :style="`height: ${LIST_SIZE}`" :items="PATIENTS" separator v-slot="{ item, index }">
            <q-item :key="index" dense
            clickable v-ripple
                @click="setActivePatient(item)" :class="{ 'bg-grey-4': active_patient === item.PATIENT_CD }"
            >
                <q-item-section class="text-caption">{{ item.PATIENT_CD }}</q-item-section>
            </q-item>
        </q-virtual-scroll>
    </div>
</template>

<script>
export default {
    name: 'PatientView_PatientList',

    props: ['patients', 'size'],

    data() {
        return {
            filter_patient: null,
        }
    },

    // mixins: [myMixins], //imports: searchPatient & deleteItem


    computed: {
        PATIENTS() {
            if (!this.patients) return []
            return this.patients.filter(item => {
                if (!this.filter_patient) return true
                return item.PATIENT_CD.includes(this.filter_patient)
            })
        },

        active_patient() {
            if (!this.$store.getters.PATIENT_PINNED) return null
            else return this.$store.getters.PATIENT_PINNED.PATIENT_CD
        },

        SIZE() {
            if (!this.size) return '100%'
            else return this.size.height+'px'
        },
        LIST_SIZE() {
            if (!this.size) return '100%'
            else return this.size.height-50+'px'
        }
    },

    methods: {
        setActivePatient(item) {
            this.$emit('clicked', item)
        }

        // ENDE METHODS
    }


}
</script>

<style></style>