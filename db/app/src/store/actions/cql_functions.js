import { exec } from "src/tools/cql"

export const execCQL = ({commit}, payload) => {
    commit('LOG', {method: 'action/execCQL'})

    const res = exec(payload)
    return res
}