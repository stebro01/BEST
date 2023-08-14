<template>
    <div class="fit" v-if="param">
        <div class="absolute-bottom-right z-top q-pa-xs">
            <LAYOUT_INFO_PANEL :observations="OBSERVATIONS.length"/>
        </div>
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
                    <tr v-for="(item, index) in OBSERVATIONS" :key="index + 'obs'" :id="`box_${index}`">
                        <!-- EDIT MODE -->
                        <td v-show="EDIT_MODE">
                            <q-btn :icon="item._check === false ? 'visibility_off' : 'visibility'" round flat size="xs" @click="item._check = toggleValue(item._check);"><q-tooltip>Sichtbarkeit ändern</q-tooltip></q-btn>
                            <q-btn icon="clear" round flat size="xs" @click="deleteItem(item)"><q-tooltip>Lösche den Wert aus der DB</q-tooltip></q-btn>
                        </td>
                        <!-- NORMAL VALUES -->
                        <!-- CONCEPT -->
                        <td class="text-left" style="max-width: 250px; overflow: hidden">{{ item.CONCEPT_NAME_CHAR ||
                            item.CONCEPT_CD }}<q-tooltip>{{ item.CONCEPT_NAME_CHAR || item.CONCEPT_CD }}</q-tooltip></td>
                        <!-- DATA -->
                        <td class="text-left" :class="{'bg-blue-1': EDIT_MODE}" @click="item._edit_val = true" style="max-width: 50px; overflow: hidden">{{ item.NVAL_NUM ||
                            item.TVAL_RESOLVED || item.TVAL_CHAR }}<q-tooltip>{{ item.NVAL_NUM || item.TVAL_RESOLVED || item.TVAL_CHAR }}</q-tooltip>
                            <POPUP_DATA v-if="EDIT_MODE && item._edit_val" :item="item"
                                @update="updateValue($event, item)" @close="item._edit_val = false" />
                        </td>
                        <!-- UNIT -->
                        <td class="text-left" :class="{'bg-blue-1': EDIT_MODE}" @click="item._edit_unit = true" style="max-width: 50px; overflow: hidden">{{ item.UNIT_RESOLVED ||
                            item.UNIT_CD }}<q-tooltip>{{ item.UNIT_RESOLVED || item.UNIT_CD }}</q-tooltip>
                             <POPUP_UNIT v-if="EDIT_MODE && item._edit_unit" :item="item"
                                @update="updateUnit($event, item)" @close="item._edit_unit = false" />    
                        </td>
                        <!-- CATEGORY -->
                        <td class="text-left" :class="{'bg-blue-1': EDIT_MODE}" @click="item._edit_cat = true" style="max-width: 50px; overflow: hidden">{{ item.CATEGORY_CHAR }}
                            <q-tooltip>{{ item.CATEGORY_CHAR }}</q-tooltip>
                            <POPUP_CATEGORY v-if="EDIT_MODE && item._edit_cat" :item="item.CATEGORY_CHAR"
                                @update="updateCategory($event, item)" @close="item._edit_cat = false" />                            
                        </td>
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
import LAYOUT_INFO_PANEL from 'src/components/patient_view/LayoutInfoPanel.vue'
import POPUP_CATEGORY from 'src/components/patient_view/PopupCategory.vue'
import POPUP_UNIT from 'src/components/patient_view/PopupUnit.vue'
import POPUP_DATA from 'src/components/patient_view/PopupData.vue'

import { my_confirm } from 'src/tools/my_dialog'

export default {
    name: 'PatientView_ObservationList',

    components: { DIALOG_DRAG_DROP, LAYOUT_INFO_PANEL, POPUP_CATEGORY, POPUP_UNIT, POPUP_DATA },

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
            return this.$store.getters.PATIENT_VIEW.hiden_mode
        },

        EDIT_MODE() {
            return this.$store.getters.PATIENT_VIEW.protected_mode
        },

        SORT_LIST() {
            return this.$store.getters.PATIENT_VIEW.active_layout
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

        // EDIT AND UPDATE VALUES
        updateCategory(val, item) {
            item._edit_cat = false
            this.$store.dispatch('updateDB',  { table: 'OBSERVATION_FACT', query_string: { where: {OBSERVATION_ID: item.OBSERVATION_ID }, set: { CATEGORY_CHAR: val } }})
                .then(res => {
                    item.CATEGORY_CHAR = val
                    if (res) this.$q.notify({ message: 'Item updated', color: 'green-5' })
                    else this.$q.notify({ message: 'Error updating item', color: 'red-5' })
                })
        },

        // EDIT AND UPDATE VALUES
        updateUnit(val, item) {
            item._edit_unit = false
            var UNIT_CD = ''
            if (val.value) UNIT_CD = val.value
            else UNIT_CD = val

            this.$store.dispatch('updateDB',  { table: 'OBSERVATION_FACT', 
                query_string: { 
                    where: {OBSERVATION_ID: item.OBSERVATION_ID }, 
                    set: { UNIT_CD: UNIT_CD } }})
                .then(res => {
                    item.UNIT_CD = UNIT_CD
                    if (res) this.$q.notify({ message: 'Item updated', color: 'green-5' })
                    else this.$q.notify({ message: 'Error updating item', color: 'red-5' })
                })
        },

        updateValue(val, item) {
            item._edit_val = false
            const where = {OBSERVATION_ID: val.OBSERVATION_ID }
            const set = {}
            if (item.VALTYPE_CD === 'N') {
                set.NVAL_NUM = val.NVAL_NUM
                item.NVAL_NUM = val.NVAL_NUM
            }
            else {
                set.TVAL_CHAR = val.TVAL_CHAR
                item.TVAL_CHAR = val.TVAL_CHAR
                if (val.TVAL_RESOLVED) item.TVAL_RESOLVED = val.TVAL_RESOLVED

            }
            this.$store.dispatch('updateDB',  { table: 'OBSERVATION_FACT', query_string: { where, set }})
                .then(res => {
                    if (res) this.$q.notify({ message: 'Item updated', color: 'green-5' })
                    else this.$q.notify({ message: 'Error updating item', color: 'red-5' })
                })
        }

        // ENDE METHODS
    }


}
</script>

<style></style>