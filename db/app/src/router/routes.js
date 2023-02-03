import store from "src/store/index"

//enter with db and login
function beforeEnterFuncAll (to, from, next) {
  if (store.getters.CONNECTED !== true) next({ name: 'selectDB' })
  else if (store.getters.USER === undefined) next({ name: 'LoginUser' })
  else next()
}

//ADMIN ONLY
function beforeEnterFuncAll_ADMIN_ONLY (to, from, next) {
  if (!store.getters.CONNECTED) return next({ name: 'selectDB' })
  else if (!store.getters.USER) return next({ name: 'LoginUser' })
  else if (store.getters.USER.COLUMN_CD !== 'admin') return next({ name: 'OnlyAdmin' })
  else next()
}

function checkLogin(to, from, next) {
  if (store.getters.CONNECTED !== true) next({name: 'selectDB'})
  else if (store.getters.USER === undefined) next({name: 'LoginUser'})
  else if (to.name !== 'Index') next({name: 'Index'}) //no redirect index=>index
  else next()
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Start', component: () => import('src/pages/Start.vue'), beforeEnter: checkLogin },
      { path: 'overview', name: 'Index', component: () => import('src/pages/Index.vue'), beforeEnter: checkLogin },
      { path: 'login', name: 'LoginUser', component: () => import('src/pages/LoginUser.vue') },
      { path: 'onlyadmin', name: 'OnlyAdmin', component: () => import('src/pages/OnlyAdmin.vue') },
      { path: 'patients', name: 'Patients', component: () => import('src/pages/patients/Patients.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'patients/edit/:PATIENT_NUM', name: 'Patients_Edit', component: () => import('src/pages/patients/Patients_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits', name: 'Visits', component: () => import('src/pages/visits/Visits.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/view', name: 'VisitsView', component: () => import('src/pages/visits/Visits_View.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/new', name: 'Visits_New', component: () => import('src/pages/visits/Visits_New.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/edit', name: 'Visits_Edit', component: () => import('src/pages/visits/Visits_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/observation/new', name: 'Observation_New', component: () => import('src/pages/visits/Observation_New.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/observation/edit', name: 'Observation_Edit', component: () => import('src/pages/visits/Observation_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/observation/scheme', name: 'Scheme_Edit', component: () => import('src/pages/visits/Edit_Scheme.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits/observation/import', name: 'Observation_Import', component: () => import('src/pages/visits/Edit_Import.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_queries', name: 'DBQueries', component: () => import('src/pages/DBQueries/DBQueries.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_queries/patient/csv_export', name: 'DBQueries_PatientCSVExport', component: () => import('src/pages/DBQueries/DBQueries_PatientCSVExport.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_queries/patient/multiedit', name: 'DBQueries_PatientMultiEdit', component: () => import('src/pages/DBQueries/DBQueries_PatientMultiEdit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions', name: 'DBFunctions', component: () => import('src/pages/db_functions/DBFunctions.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/csvimport', name: 'DBFunctions_CSVImport', component: () => import('src/pages/db_functions/DBFunctions_CSVImport.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/hl7import', name: 'DBFunctions_HL7Import', component: () => import('src/pages/db_functions/DBFunctions_HL7Import.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/schemes', name: 'DBFunctions_EditSchemes', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/schemes/new', name: 'DBFunctions_EditSchemes_New', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes_New.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/schemes/edit/:id', name: 'DBFunctions_EditSchemes_Edit', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes_Edit.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/concepts', name: 'DBFunctions_EditConcepts', component: () => import('src/pages/db_functions/DBFunctions_EditConcepts.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/concepts/import', name: 'DBFunctions_ImportConcepts', component: () => import('src/pages/db_functions/DBFunctions_ConceptsImport.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/reset_db', name: 'DBFunctions_ResetDB', component: () => import('src/pages/db_functions/DBFunctions_ResetDB.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/create_db', name: 'DBFunctions_CreateDB', component: () => import('src/pages/db_functions/DBFunctions_CreateDB.vue')},
      { path: 'db_functions/manage_users', name: 'DBFunctions_ManageUsers', component: () => import('src/pages/db_functions/DBFunctions_ManageUsers.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/provider&locations', name: 'DBFunctions_EditLocationProvider', component: () => import('src/pages/db_functions/DBFunctions_EditLocationProvider.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'selectdb', name: 'selectDB', component: () => import('pages/SelectDB.vue') },
      { path: 'about', name: 'About', component: () => import('pages/About.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
