import { my_confirm } from "src/tools/my_dialog";

export default {
  data() {
    return {
      showConceptDialog: false, //trigger for the concept modal
      showConceptDialog_table: undefined //welcher Table im Modal verwendet werden soll
    }
  },

    computed: {
        
    },

    methods: {
        // checks something
      notPrimaryKey(el) {
        if (!this.SCHEME) return true
        return this.SCHEME._PRIMARY_KEY !== el
      },

      // checks something
      typeOfEl(el) {
        if (!this.SCHEME) return undefined
        return this.SCHEME._FIELDS[el]
      },

      // checks something
      isResolveScheme(el) {
        if (!this.RESOLVE) return undefined
        return Object.keys(this.RESOLVE).includes(el)
      },

      //returns the concept for the option in the q-select box
      getConcept(el) {
        if (!el || !this.RESOLVE) return []
        const concept = this.RESOLVE[el]
        const options = []
        concept.forEach(c => {
            if (typeof(c) === 'string') {
                options.push({label: c, value: c})
            } else if (typeof(c) === 'object') {
                if (c.CONCEPT_CD) options.push({label: c.NAME_CHAR, value: c.CONCEPT_CD})
                else options.push({label: c.NAME_CHAR, value: c.CODE_CD})
            }
        })
        return options
      },

      //returns a resolved value for a given element
      getResolvedValue(element, value) {
        if (!this.RESOLVE) return undefined
        if (!this.RESOLVE[element]) return value
        if (typeof(value) === 'object') return value.label
        // FALL: ['YD', ...]
        if (typeof(this.RESOLVE[element][0]) === 'string') return value
        else { // FALL [{CODE_CD: 'ukj', NAME_CHAR: 'Hans berger ...'}, ...]
          var index_CODE_CD = this.RESOLVE[element].findIndex(item => item.CODE_CD === value)
          if (index_CODE_CD >= 0) return  this.RESOLVE[element][0].NAME_CHAR
          var index_CONCEPT_CD = this.RESOLVE[element].findIndex(item => item.CONCEPT_CD === value)
          if (index_CONCEPT_CD >= 0) return  this.RESOLVE[element][0].NAME_CHAR
        }
        
        //fallback
        return value
      },

      //LOESCHE EINEN EINTRAG
      //ie: deleteData({table: 'VISIT_DIMENSION', value: item.ENCOUNTER_NUM, label: 'ENCOUNTER_NUM'})
      async deleteData(item){
        if (!await my_confirm('Soll der Eintrag wirklich gelöscht werden? Ggf. werden alle abhängigen Daten auch gelöscht ')) return
        this.$store.dispatch('deleteDB', {query_string:{[item.label]:item.value},table:item.table})
        .then(res => {
          this.$q.notify('Löschen erfolgreich: ' + res)
          if (item.table === 'VISIT_DIMENSION') {
            
            //lösche jetzt noch die Observations
            this.$store.dispatch('deleteDB', {query_string:{ENCOUNTER_NUM:item.value, _force: true},table: "OBSERVATION_FACT"})
            .then(res => this.$q.notify('Löschen Visite und Observations erfolgreich: ' + res))

            //unpinnen der Visite

          } else this.$q.notify('Löschen erfolgreich: ' + res)
          this.$router.go(-1)
        })
        .catch(err => this.$q.notify(err))
      },

      //starts the concept dialog
      selectConcept(el) {
        this.showConceptDialog_table = el
        this.showConceptDialog = true
      },
    }
}