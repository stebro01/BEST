<template>
    <div v-if="PATIENTS" class="fit">
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

        <q-virtual-scroll style="height: calc(100% - 50px)" :items="PATIENTS" separator v-slot="{ item, index }">
            <q-item :key="index" dense
            clickable v-ripple
                @click="setActivePatient(item)" :class="{ 'bg-grey-4': active_patient === item.PATIENT_CD }"
            >
                <q-item-section class="text-caption"><div>{{ item.PATIENT_CD }} <q-icon v-if="item.USER_ID === $store.getters.PUBLIC_ID" name="visibility"/></div></q-item-section>
            </q-item>
        </q-virtual-scroll>

        <!-- some info -->
        <q-chip v-if="PATIENTS" class="absolute-bottom-left z-top" size="sm"> <q-icon name="list"/>{{ PATIENTS.length }}</q-chip>
    </div>
</template>

<script>
export default {
    name: 'PatientView_PatientList',

    props: ['patients', 'size', 'auto_load'],

    data() {
        return {
            filter_patient: null,
            local_patients: undefined
        }
    },

    // mixins: [myMixins], //imports: searchPatient & deleteItem

    mounted() {
        if (this.auto_load) {
            // load data at mount
            this.$store.dispatch("searchDB", { query_string: { PATIENT_NUM: 0, _greater: true, _view: true}, table: "PATIENT_DIMENSION"
            }).then(res => {
                this.local_patients = res
            })
        }
    },

    computed: {
        PATIENTS() {
            if (this.local_patients) return this.local_patients.filter(item => {
                if (!this.filter_patient) return true
                return item.PATIENT_CD.includes(this.filter_patient)
            })
            // else
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
