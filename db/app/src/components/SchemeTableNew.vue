<template>
  <div class="q-pb-xl" style="width: 80vw">

    <q-scroll-area style="width: 100%; height: 50vh">
      <!-- <div>{{ scheme }}</div> -->

      <q-splitter v-model="splitterModel" style="height: 50vh; width: 100%;">

        <template v-slot:before>
          <div class="q-pa-md" v-if="LEFT_TREE && data_is_prepared">
            <q-tree default-expand-all dense :nodes="LEFT_TREE" node-key="label" selected-color="green" v-model:selected="selected"
            no-selection-unset
            />
          </div>
        </template>

        <template v-slot:after>
          <div><q-linear-progress size="15px" :value="GET_CHECKED_DATA_COUNT / formData.length" color="grey-6">
              <div class="absolute-full flex flex-center"> <q-badge color="transparent" text-color="black"
                  :label="`${GET_CHECKED_DATA_COUNT} / ${formData.length} ausgefüllt`" /></div>
            </q-linear-progress>
            <span class="absolute-top-right q-mt-md z-top">{{ ACTIVE_POSITION_STRING }}</span>
            <div class="absolute-bottom-right z-top">
              <q-btn icon="arrow_back_ios" flat rounded :disable="ACTIVE_INDEX === -1" @click="selectTab(-1)" />
              <q-btn icon="arrow_forward_ios" flat rounded :disable="ACTIVE_INDEX >= formData.length - 1"
                @click="selectTab(1)" />
              <div class="text-center my-small-text text-grey-7">Tasten links und rechts zum Navigieren</div>
            </div>
          </div>

          <q-tab-panels v-if="selected" v-model="selected" animated transition-prev="jump-up" transition-next="jump-up">
            <q-tab-panel :name="SCHEME.NAME_CHAR">
              <div class="text-h4 q-mb-md">{{ SCHEME.NAME_CHAR }}</div>
              <div>CODE: {{ SCHEME.CODE_CD }}</div>
              <div>Beschreibung: {{ SCHEME.description }}</div>
              <div></div>

            </q-tab-panel>
            <q-tab-panel v-for="(item, ind) in formData" :key="ind + 'tab'" :name="item.NAME_CHAR">
              <div class="text-h4 q-mb-md">{{ item.NAME_CHAR }}</div>
              <div class="float float-right" v-if="item._checkcql">
                <span v-if="item._checkcql.status">✅ <q-tooltip>CQL Check: ok</q-tooltip></span>
                <span v-else>❌ <q-tooltip>CQL-Check: failed {{ item._checkcql.data.filter(el => el.check === true).length
                }}/{{ item._checkcql.data.length }}</q-tooltip> </span>
              </div>
              <div v-if="item.VALTYPE_CD === 'N'">
                <q-input v-model.number="item.NVAL_NUM" autofocus type="number" input-class="text-center"
                  :hint="`${item.UNIT_CD || 'Wert'}`" @change="dataChanged(item, ind, true)" />
              </div>
              <div v-else-if="item.VALTYPE_CD === 'D'">
                <q-input v-model="item.TVAL_CHAR" type="date" autofocus input-class="text-center" hint="Datum"
                  @change="dataChanged(item, ind, true)" />
              </div>
              <div v-else-if="item.VALTYPE_CD === 'T'">
                <q-input v-model="item.TVAL_CHAR" type="text" autofocus input-class="text-center" hint="Text"
                  @change="dataChanged(item, ind, true)" />
              </div>
              <div v-else-if="item.VALTYPE_CD === 'S'">
                <q-option-group dense autofocus v-model="item.TVAL_CHAR" :options="options[ind]" color="primary"
                  @update:model-value="dataChanged(item, ind, true)" />
              </div>
              <div v-else-if="item.VALTYPE_CD === 'F'">
                <q-option-group dense autofocus v-model="item.TVAL_CHAR" :options="optons_finding" color="primary"
                  @update:model-value="dataChanged(item, ind, true)" />
              </div>

              <div>
                <q-input v-model="item.OBSERVATION_BLOB" hint="Beschreibung/Bemerkungen"
                  @change="dataChanged(item, ind, false)" />
              </div>

            </q-tab-panel>

          </q-tab-panels>
        </template>
      </q-splitter>

    </q-scroll-area>
  </div>
</template>


<script>
import { unstringify } from 'src/classes/sqltools'
export default {
  name: 'SchemeTableNew',

  props: ['scheme'],
  components: {},

  data() {
    return {
      splitterModel: 30,
      selected: null,
      simple: [],
      formData: [],
      data_is_prepared: false,
      options: [],
      label: null,
      optons_finding: [
        { value: 'SCTID: 373066001', label: 'Yes' },
        { value: 'SCTID: 373067005', label: 'No' },
        { value: 'SCTID: 373068000', label: 'unknown' }
      ]
    }
  },

  mounted() {
    this.prepareData()
    //keypress
    document.addEventListener("keydown", (e) => {
      e = e || window.event;
      if (e.keyCode === 37) {
        this.selectTab(-1)
      } else if (e.keyCode === 39) {
        this.selectTab(1)
      }
    });

  },

  watch: {

  },

  computed: {
    LEFT_TREE() {
      const data = {
        label: 'LEFT_TREE',
        children: []
      }
      if (this.scheme && this.formData) {
        data.label = this.scheme.scheme.NAME_CHAR
        data.caption = this.scheme.scheme.CODE_CD
        this.formData.forEach(res => {
          if (res.NAME_CHAR) {
            if (!res.check) data.children.push({ label: res.NAME_CHAR, icon: 'check_box_outline_blank' })
            else data.children.push({ label: res.NAME_CHAR, icon: 'check_box' })
          }
        })
      }
      return [data]
    },

    ACTIVE_POSITION_STRING() {
      if (!this.LEFT_TREE || this.ACTIVE_INDEX === -1) return ''
      return `${this.ACTIVE_INDEX + 1}/${this.LEFT_TREE[0].children.length}`
    },

    ACTIVE_INDEX() {
      if (!this.LEFT_TREE || !this.selected) return -1
      let index = this.LEFT_TREE[0].children.findIndex(p => p.label === this.selected)
      return index
    },

    GET_CHECKED_DATA_COUNT() {
      var cc = 0
      this.formData.forEach(f => {
        if (f.check) cc++
      })
      return cc
    },

    SCHEME() {
      if (!this.scheme) return undefined
      const tmp = this.scheme.scheme
      const json = JSON.parse(unstringify(tmp.LOOKUP_BLOB))
      tmp.description = json.description
      return tmp
    }
  },

  methods: {
    async prepareData() {
      //prepare formData
      if (!this.scheme) return
      if (this.scheme.scheme) {
        this.selected = this.scheme.scheme.NAME_CHAR
      }
      
      if (this.scheme.resolved) {
        this.formData = []
        this.options = []
        for (let el of this.scheme.resolved) {
          if (el.OBSERVATION_ID) this.formData.push({ ...el, check: true, _checkcql: await this.$store.dispatch('checkCQLRule', el) }) //übernehme den kompletten Eintrag, wenn bereits eine Observation ID vorhanden ist
          else if (el.NAME_CHAR) this.formData.push({ CONCEPT_CD: el.CONCEPT_CD, NAME_CHAR: el.NAME_CHAR, VALTYPE_CD: el.VALTYPE_CD, UNIT_CD: el.UNIT_CD, TVAL_CHAR: null, NVAL_NUM: null, OBSERVATION_BLOB: null })
          // PREPARE OPTIONS
          if (!el.selection) this.options.push([])
          else {
            var opt = []
            el.selection.forEach(o => {
              let oo = { label: o.NAME_CHAR, value: o.CONCEPT_CD }
              if (!oo.label) oo.label = oo.value
              opt.push(oo)
            })
            if (opt.length > 0) opt = opt.sort((a, b) => (a.label.toLowerCase() < b.label.toLowerCase()) ? -1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? 1 : 0));
            this.options.push(opt)
          }
        }
      }

      this.data_is_prepared = true //die zeile brauche ich, damit die Option default-expand-all auch funktioniert!!!
    },

    selectTab(ind) {
      const new_ind = this.ACTIVE_INDEX + ind
      if (new_ind < 0) this.selected = this.SCHEME.NAME_CHAR
      else if (new_ind >= this.formData.length) this.selected = this.SCHEME.NAME_CHAR
      else {
        this.selected = this.formData[new_ind].NAME_CHAR
      }
    },

    async dataChanged(item, ind, val) {
      if (val) this.formData[ind].check = true
      this.formData[ind]._checkcql = await this.$store.dispatch('checkCQLRule', item)
      // if (val) this.selectTab(1)
      this.$emit('changed', this.formData)

    },


  }


}
</script>