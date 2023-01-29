import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const store =  new Vuex.Store({
  namespaced: true,
  getters,
  mutations,
  actions,
  state
})

export default store

// MAKE store accessible if Cypress is active
if (window.Cypress) window._store = store