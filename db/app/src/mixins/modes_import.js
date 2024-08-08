
export default {
  data() {
    return {


    }
  },

    computed: {

    },

    methods: {
      //called by PreviewImport.vue und PrevieMultipleImport.vue
      async checkCQL(data) {
        //checke die Visiten
        const ERRORS = {
          visits: 0,
          observations: 0,
          total_checks: 0
        }

        for (let visit of data.VISITS) {
          //CHECK START_DATE
          visit._check = undefined
          let tmp = {VALTYPE_CD: 'D', TVAL_CHAR: visit.START_DATE}
          visit._check = this.updateCheck(visit._check, await this.$store.dispatch('checkCQLRule', tmp), ERRORS)

          //count errors
          if (!visit._check.status) ERRORS.visits ++
        }

        //checke die Observations

        for (let OBS of data.OBSERVATIONS) {
           // CHECK FOR DOUBLES
           OBS = await this.$store.dispatch('checkDoubles', OBS)

          for (let obs_key of Object.keys(OBS)) {
            let obs = OBS[obs_key]
            let CHECK = undefined
            if (typeof(obs.ENCOUNTER_NUM) === 'string') obs.ENCOUNTER_NUM = parseInt(obs.ENCOUNTER_NUM)
            if (typeof(obs.PATIENT_NUM) === 'string') obs.PATIENT_NUM = parseInt(obs.PATIENT_NUM)
            // CHECKE DIE REGEL
            CHECK = this.updateCheck(CHECK, await this.$store.dispatch('checkCQLRule', obs), ERRORS)
            //checke noch das START_DATE
            let tmp = {VALTYPE_CD: 'D', TVAL_CHAR: obs.START_DATE}
            CHECK = this.updateCheck(CHECK, await this.$store.dispatch('checkCQLRule', tmp), ERRORS, 'START_DATE')

            //count errors
            if (!CHECK.status) ERRORS.observations ++
            if (typeof(obs.CONCEPT_CD) === 'object') ERRORS.observations++
            if (obs._double_found === true) ERRORS.observations++
            obs._check = CHECK
          }

        }

        //errors:
        this.$q.notify(`${ERRORS.total_checks} Checks erfolgt: Fehler gefunden: Visiten ${ERRORS.visits} und Observations ${ERRORS.observations}`)
        ERRORS.total_errors_found = ERRORS.observations + ERRORS.visits
        return ERRORS
      },

      updateCheck(CHECK, check, ERRORS, info) {
        ERRORS.total_checks ++
        if (!CHECK) return {status: check.status, data: [check]}
        //else
        if (check.status === false) CHECK.status = false
        if (!info) CHECK.data.push(check)
        else CHECK.data.push({...check, info: info})
        return CHECK
      },

    }
}
