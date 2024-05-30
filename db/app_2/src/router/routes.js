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
      { path: 'visits', name: 'DBQueries_PatientView', component: () => import('src/pages/PatientView.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old', name: 'Visits', component: () => import('src/pages/visits/Visits.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/view', name: 'VisitsView', component: () => import('src/pages/visits/Visits_View.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/new', name: 'Visits_New', component: () => import('src/pages/visits/Visits_New.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/edit', name: 'Visits_Edit', component: () => import('src/pages/visits/Visits_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/observation/new', name: 'Observation_New', component: () => import('src/pages/visits/Observation_New.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/observation/edit', name: 'Observation_Edit', component: () => import('src/pages/visits/Observation_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'visits_old/observation/scheme', name: 'Scheme_Continue', component: () => import('src/pages/visits/Scheme_Continue.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'observation/import', name: 'Observation_Import', component: () => import('src/pages/visits/Edit_Import.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'observation/import/raw:FILE_PATH', name: 'Observation_Import_RAW', component: () => import('src/pages/visits/Edit_Import_RAW.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'observation/xlsview', name: 'Observations_View_XLS', component: () => import('src/pages/visits/ObservationsView_XLS.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_queries', name: 'DBQueries', component: () => import('src/pages/DBQueries/DBQueries.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_queries/patient/csv_export', name: 'DBQueries_PatientCSVExport', component: () => import('src/pages/DBQueries/DBQueries_PatientCSVExport.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions', name: 'DBFunctions', component: () => import('src/pages/db_functions/DBFunctions.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/import', name: 'DBFunctions_Import', component: () => import('src/pages/db_functions/DBFunctions_Import.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/schemes', name: 'DBFunctions_EditSchemes', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/schemes/new', name: 'DBFunctions_EditSchemes_New', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes_New.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/schemes/edit/:id', name: 'DBFunctions_EditSchemes_Edit', component: () => import('src/pages/db_functions/DBFunctions_EditSchemes_Edit.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/concepts', name: 'DBFunctions_EditConcepts', component: () => import('src/pages/db_functions/DBFunctions_EditConcepts.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/reset_db', name: 'DBFunctions_ResetDB', component: () => import('src/pages/db_functions/DBFunctions_ResetDB.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/create_db', name: 'DBFunctions_CreateDB', component: () => import('src/pages/db_functions/DBFunctions_CreateDB.vue')},
      { path: 'db_functions/manage_users', name: 'DBFunctions_ManageUsers', component: () => import('src/pages/db_functions/DBFunctions_ManageUsers.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/locations', name: 'DBFunctions_EditLocation', component: () => import('src/pages/db_functions/DBFunctions_EditLocation.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/datatransfer', name: 'DBFunctions_DataTransfer', component: () => import('src/pages/db_functions/DBFunctions_DataTransfer.vue'), beforeEnter: beforeEnterFuncAll_ADMIN_ONLY },
      { path: 'db_functions/cql', name: 'DBFunctions_CQL_Edit', component: () => import('src/pages/db_functions/DBFunctions_CQL_Edit.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'db_functions/update_db', name: 'DBFunctions_Update', component: () => import('src/pages/db_functions/DBFunctions_Update.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'surveyBEST_Integration', name: 'surveyBEST_Integration', component: () => import('src/pages/surveyBEST_Integration/sB_Integration_Main.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'surveyBEST_Integration/manage', name: 'surveyBEST_Integration_Manage', component: () => import('src/pages/surveyBEST_Integration/sB_Integration_Manage.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'surveyBEST_Integration/search', name: 'surveyBEST_Integration_Search', component: () => import('src/pages/surveyBEST_Integration/sB_Integration_Search.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'surveyBEST_Integration/fill/:id', name: 'surveyBEST_Integration_Fill', component: () => import('src/pages/surveyBEST_Integration/sB_Integration_Fill.vue'), beforeEnter: beforeEnterFuncAll },
      { path: 'notes', name: 'Notes', component: () => import('src/pages/Notes.vue'), beforeEnter: beforeEnterFuncAll },
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
