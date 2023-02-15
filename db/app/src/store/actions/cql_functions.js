import { exec, query_api } from "src/tools/cql"

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