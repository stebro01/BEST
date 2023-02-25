import { exec, query_api, checkRule } from "src/tools/cql"
import { dtypes } from "src/classes/more/dtypes";
import {getTable} from 'src/store/actions'

export const execCQL = ({commit}, payload) => {
    commit('LOG', {method: 'action/execCQL'})

    const res = exec(payload)
    return res
}

export const query_CQLAPI = async ({commit}, payload) =>  {
    commit('LOG', {method: 'action/query_CQLAPI'})

    const res = query_api(payload)
    return res
}

export const checkCQLRule = async ({commit, state}, payload) =>  {
    commit('LOG', {method: 'action/checkRule', data: payload})

    const data = {type: undefined, value: undefined, CONCEPT_CD: payload.CONCEPT_CD}
      if (typeof(data.CONCEPT_CD) === 'object') data.CONCEPT_CD = data.CONCEPT_CD.value
      if (payload.VALTYPE_CD === 'N') {
        data.type = dtypes.numeric
        data.value = payload.NVAL_NUM
      } else if (payload.VALTYPE_CD === 'D') {
        data.type = dtypes.date
        data.value = payload.TVAL_CHAR
      }
      else {
        data.type = dtypes.string
        data.value = payload.TVAL_CHAR
      }

    //prepare the views
    const VIEW_CQL = getTable('CQL_FACT', state)
    const VIEW_CONCEPT_CQL_LOOKUP = getTable('CONCEPT_CQL_LOOKUP', state)
    // check the rule
    const res = await checkRule({data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP})
    return res
}