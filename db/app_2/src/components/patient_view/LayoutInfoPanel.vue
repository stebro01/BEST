<template>
    <div class="bg-white shadow-1 z-max row ">
        <!-- LAYOUTS -->
        <div class="col-3" v-if="LAYOUTS" style="min-width: 150px; max-width: 250px">
            <q-btn-dropdown size="sm" dense flat no-caps :label="LAYOUT_LABEL" class="bg-accent q-ml-xs q-mt-xs">
                <q-list>
                    <q-item v-for="(item, ind) of LAYOUTS" :key="ind + item.value" clickable v-close-popup
                        >

                        <q-item-section side>
                            <div class="row" v-if="item.value !== null">
                            <q-btn @click="removeLayout(item)" size="sm" dense flat rounded icon="delete"><q-tooltip>Entferne das Layout</q-tooltip></q-btn>
                            <q-btn @click="renameLayout(item)" size="sm" dense flat rounded icon="edit"><q-tooltip> Layout umbenennen</q-tooltip></q-btn>
                        </div>

                        </q-item-section>
                        <!-- seperator -->
                        <!-- <q-separator vertical /> -->

                        <q-item-section @click="selectLayout(item)"> {{ item.label }} </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <!-- LAYOUT BTNS -->
            <span class="q-ml-x q-gutter-x-xs" v-if="LAYOUT_CHANGED">

                <q-btn v-if="ACTIVE_LAYOUT" size="sm" dense no-caps flat class="bg-positive" @click="btnUpdateLayout()">update</q-btn>
                <q-btn size="sm" dense no-caps flat class="bg-positive" @click="btnSaveLayout()">neu</q-btn>
                <q-btn size="sm" dense @click="undoLayoutChanges()" flat icon="close"><q-tooltip>Änderungen nicht
                        übernehmen</q-tooltip></q-btn>
            </span>
        </div>

        <!-- PROTECTED MODE -->
        <div class="col">
            <q-toggle size="sm" v-model="PROTECTED_MODE" checked-icon="lock_open"
                unchecked-icon="lock"><q-tooltip>Bearbeiten an / aus</q-tooltip>
            </q-toggle>
        </div>
        <!-- SHOW HIDEN -->
        <div class="col">
            <q-toggle size="sm" v-model="HIDEN_MODE" checked-icon="visibility"
                unchecked-icon="visibility_off"><q-tooltip>Verstecke Elemente anzeigen / nicht anzeigen</q-tooltip>
            </q-toggle>
        </div>
        <!-- LISTE -->
        <div class="col">
            <q-chip size="sm" dense class="q-mt-sm"><q-icon name="subject" />{{ observations }}<q-tooltip>Anzahl der
                    Listenelemente: {{ observations }}</q-tooltip></q-chip>
        </div>
    </div>
</template>

<script>
import { unstringify } from 'src/classes/sqltools'
import { my_prompt, my_confirm } from 'src/tools/my_dialog'

export default {
    name: 'LayoutInfoPanel',

    components: {},

    props: ['observations', 'param'],

    data() {
        return {
            layout: {
                show_update_btn: false,
                show_save_btn: false,
                value: undefined,
                DATA: undefined
            },
            layout_options: [{ value: '1', label: 'NOT LOADED' }],
        }
    },

    watch: {
        // ACTIVE_LAYOUT(val) {
        //   if (!val || val === '1') return
        //   this.loadLayout(val)
        // }

    },

    mounted() {
        // check the LAYOUTS
        if (!this.LAYOUTS) this.initLayouts()
    },



    computed: {
        PROTECTED_MODE: {
            get() {
                return this.$store.getters.PATIENT_VIEW.protected_mode
            },
            set(val) {
                this.$store.commit('PATIENT_VIEW_PROTECTED_MODE_SET', val)
            }
        },

        HIDEN_MODE: {
            get() {
                return this.$store.getters.PATIENT_VIEW.hiden_mode
            },
            set(val) {
                this.$store.commit('PATIENT_VIEW_HIDEN_MODE_SET', val)
            }
        },

        LAYOUTS() {
            return this.$store.getters.PATIENT_VIEW.LAYOUTS
        },

        LAYOUT_CHANGED: {
            get() {
                return this.$store.getters.PATIENT_VIEW.layout_changed
            },
            set(val) {
                this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", val)
            }
        },


        LAYOUT_LABEL() {
            if (!this.LAYOUTS) return 'Layout auswählen'
            return this.LAYOUTS.find(item => item.value === this.ACTIVE_LAYOUT).label
        },

        ACTIVE_LAYOUT() {
            return this.$store.getters.PATIENT_VIEW.active_layout_value
        },

        ACTIVE_LAYOUT_DATA() {
            return this.$store.getters.PATIENT_VIEW.active_layout
        }




    },

    methods: {

        initLayouts() {
            this.$store.dispatch('searchDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', _columns: ['CODE_CD', 'NAME_CHAR'] } })
                .then(res => {
                    if (res && res.length > 0) {
                        res = res.map(item => {
                            return { value: item.CODE_CD, label: item.NAME_CHAR }
                        })
                        res.unshift({ value: null, label: 'Alles anzeigen' })
                        this.$store.commit('PATIENT_VIEW_LAYOUTS_SET', res)
                        this.selectLayout(res[0])
                    }
                })
        },

        selectLayout(item) {
            this.$store.commit('PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET', item.value)
            this.loadLayout(item.value)
        },

        //  // LAYOUT
        async loadLayout(val) {
            if (val === null) {
                this.$store.commit("PATIENT_VIEW_ACTIVE_LAYOUT_SET", undefined)
                return
            }
            const res = await this.$store.dispatch('searchDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: val, _columns: ["LOOKUP_BLOB"] } })
            if (res && res.length > 0) {
                this.$store.commit("PATIENT_VIEW_ACTIVE_LAYOUT_SET", JSON.parse(unstringify(res[0].LOOKUP_BLOB)))
                this.$q.notify({ type: 'positive', message: 'Layout erfolgreich geladen' })
            } else {
                this.$q.notify({ type: 'negative', message: 'Layout konnte nicht geladen werden' })
            }
        },

        undoLayoutChanges() {
            this.loadLayout(this.ACTIVE_LAYOUT)
            this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
        },


        async btnUpdateLayout() {
            const res = await this.$store.dispatch('updateLayout', { value: this.ACTIVE_LAYOUT, DATA: this.ACTIVE_LAYOUT_DATA })

            if (res && res.status) this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
            else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })

            this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
        },

        async btnSaveLayout() {
            const answ = await my_prompt(`Bitte Bezeichnung für neues Layout eingeben`)
            if (!answ || answ.lengh === 0) return

            console.log('SAVE LAYOUT', answ, this.$store.getters.PATIENT_VIEW)


            const res = await this.$store.dispatch('saveLayout', { value: answ, DATA: this.ACTIVE_LAYOUT_DATA })

            if (res && res.status) {
                this.$q.notify({ type: 'positive', message: 'Layout erfolgreich gespeichert' })
                this.initLayouts()
            }
            else this.$q.notify({ type: 'negative', message: 'Layout konnte nicht gespeichert werden' })

            this.$store.commit("PATIENT_VIEW_LAYOUT_CHANGED_SET", false)
        },

        async removeLayout(item) {
            if (!await my_confirm(`Wirklich Layout ${item.label} löschen?`)) return
            const res = await this.$store.dispatch('deleteDB', { table: 'CODE_LOOKUP', query_string: { COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: item.value } })
            this.initLayouts()
        },

        async renameLayout(item) {
            const answ = await my_prompt(`Bitte neue Bezeichnung für Layout eingeben`)
            if (!answ || answ.lengh === 0) return
            const res = await this.$store.dispatch('updateDB', { table: 'CODE_LOOKUP', query_string: { where: {COLUMN_CD: 'VIEW_LAYOUT', CODE_CD: item.value }, set: { NAME_CHAR: answ }}  })
            this.initLayouts()
        }

        // ENDE METHODS
    }


}
</script>

<style></style>
