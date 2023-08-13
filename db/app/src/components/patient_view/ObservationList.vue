<template>
    <div class="fit" v-if="param">

        <q-chip size="sm" dense class="absolute-bottom-right z-top"><q-icon name="subject"/>{{ OBSERVATIONS.length }}<q-tooltip>Anzahl der Listenelemente: {{ OBSERVATIONS.length }}</q-tooltip></q-chip>
        <q-scroll-area :style="`height: ${SIZE.height}px; max-width: ${SIZE.width}px;`" class="q-pa-md ">
            <!-- CONTEBNT -->
            <q-markup-table dense  separator="cell">
                <!-- HEADER -->
                <thead>
                    <tr>
                        <!-- EDIT_MODE -->
                        <th v-show="EDIT_MODE"><q-btn flat size="sm" icon="drag_indicator" @click="show_drop_list = true"><q-tooltip>Reihenfolge ändern</q-tooltip></q-btn></th>
                        <!-- VALUES -->
                        <th class="text-left">Messung</th>
                        <th class="text-left">Wert</th>
                        <th class="text-left">Einheit</th>
                        <th class="text-left">Kategorie</th>
                        <th class="text-right">Datum</th>
                    </tr>
                </thead>
                <!-- BODY -->
                
                <tbody >
                    <tr v-for="(item, index) in OBSERVATIONS" :key="index + 'obs'" :id="`box_${index}`" 
                       

                    >
                        <!-- EDIT MODE -->
                        <td v-show="EDIT_MODE">
                            <q-btn :icon="item._check === false ? 'visibility_off' : 'visibility'" round flat size="xs" @click="item._check = toggleValue(item._check); updateSort()"><q-tooltip>Sichtbarkeit ändern</q-tooltip></q-btn>
                            <q-btn icon="clear" round flat size="xs" @click="deleteItem(item)"><q-tooltip>Lösche den Wert aus der DB</q-tooltip></q-btn>
                        </td>
                        <!-- NORMAL VALUES -->
                        <td class="text-left" style="max-width: 250px; overflow: hidden">{{ item.CONCEPT_NAME_CHAR ||
                            item.CONCEPT_CD }}<q-tooltip>{{ item.CONCEPT_NAME_CHAR || item.CONCEPT_CD }}</q-tooltip></td>
                        <td class="text-left" style="max-width: 50px; overflow: hidden">{{ item.NVAL_NUM ||
                            item.TVAL_RESOLVED || item.TVAL_CHAR }}<q-tooltip>{{ item.NVAL_NUM || item.TVAL_RESOLVED ||
        item.TVAL_CHAR }}</q-tooltip></td>
                        <td class="text-left" style="max-width: 50px; overflow: hidden">{{ item.UNIT_RESOLVED ||
                            item.UNIT_CD }}<q-tooltip>{{ item.UNIT_RESOLVED || item.UNIT_CD }}</q-tooltip></td>
                        <td class="text-left" style="max-width: 50px; overflow: hidden">{{ item.CATEGORY_CHAR }}<q-tooltip>{{
                            item.CATEGORY_CHAR }}</q-tooltip></td>
                        <td class="text-right text-caption" style="max-width: 50px; overflow: hidden">{{ item.START_DATE }}
                        </td>
                    </tr>

                </tbody>
            </q-markup-table>

        </q-scroll-area>


        <!-- DROP LIST -->
        <DIALOG_DRAG_DROP v-if="show_drop_list" :active="show_drop_list" @close="show_drop_list = false"  @update_list="updateSort($event)" :list="OBSERVATIONS" />
    </div>
</template>

<script>
import DIALOG_DRAG_DROP from 'src/components/patient_view/PatientView_DialogDragDrop.vue'
import { my_confirm } from 'src/tools/my_dialog'
export default {
    name: 'PatientView_ObservationList',

    components: { DIALOG_DRAG_DROP },

    props: ['param'],

    data() {
        return {
            localData: {
                OBSERVATIONS: []
            },
            show_drop_list: false
        }
    },

    mounted() {
        if (this.ACTIVE_VISIT) this.loadData(this.ACTIVE_VISIT)
    },

    watch: {
        ACTIVE_VISIT(val) {
            if (val) this.loadData(val)
        },

        SORT_LIST(val) {
            // WENN DAS LAYOUT GEAENDERT WIRD, WIRD DIE VISABILITY ANGEPASST
            if (!val) return
            this.localData.OBSERVATIONS.forEach(obs => {
                obs._check = val.includes(obs.CONCEPT_NAME_CHAR || obs.CONCEPT_CD)
            })
        }
    },

    computed: {
        SIZE() {
            if (!this.param.observationlist_size) return { width: 100, height: 100 }
            return this.param.observationlist_size
        },

        ACTIVE_VISIT() {
            return this.$store.getters.VISIT_PINNED
        },

        OBSERVATIONS() {
            if (!this.localData.OBSERVATIONS) return []
            var obs = undefined
            if (!this.HIDE_MODE) obs = this.localData.OBSERVATIONS.filter(item => item._check !== false)
            else obs = this.localData.OBSERVATIONS
            if (this.SORT_LIST) {
                obs = obs.sort((a, b) => {
                    const a_index = this.SORT_LIST.indexOf(a.CONCEPT_NAME_CHAR || a.CONCEPT_CD)
                    const b_index = this.SORT_LIST.indexOf(b.CONCEPT_NAME_CHAR || b.CONCEPT_CD)
                    if (a_index < b_index) return -1
                    if (a_index > b_index) return 1
                    return 0
                })
            }
            return obs
        },

        HIDE_MODE() {
            return this.param.show_hide
        },

        EDIT_MODE() {
            return this.param.protected
        },

        SORT_LIST() {
            return this.param.layout.DATA
        }

    },

    methods: {
        onResize(size) {
            this.size = size
        },

        toggleValue(val) {
            if (val === false) return true
            if (val === true) return false
            return false
        },

        async loadData(val) {
            if (!val) return this.$q.notify({ message: 'No visit selected', color: 'red-5' })
            const res = await this.$store.dispatch('searchDB', { table: 'OBSERVATION_FACT', query_string: { ENCOUNTER_NUM: val.ENCOUNTER_NUM, _view: true } })
            this.localData.OBSERVATIONS = res
            if (this.SORT_LIST) {
                this.localData.OBSERVATIONS.forEach(obs => {
                    obs._check = this.SORT_LIST.includes(obs.CONCEPT_NAME_CHAR || obs.CONCEPT_CD)
                })
            }
        },

        async deleteItem(item) {
            if (!await my_confirm('Wirklich löschen?')) return
            const res = await this.$store.dispatch('deleteDB', { table: 'OBSERVATION_FACT', query_string: { OBSERVATION_ID: item.OBSERVATION_ID } })
            if (res) this.loadData(this.ACTIVE_VISIT)
            else this.$q.notify({ message: 'Error deleting item', color: 'red-5' })
        },

        updateSort(list) {
            if (!list) return

            // send the update
            this.$emit('update_layout', list)
        }

        // ENDE METHODS
    }


}
</script>

<style></style>