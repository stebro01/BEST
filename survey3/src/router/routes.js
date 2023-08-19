import FinishedQuest from "pages/FinishedQuest.vue";

const routes = [{
  path: "/",
  component: () => import("layouts/MainLayout.vue"),
  children: [{
    path: "",
    name: "start",
    component: () => import("pages/Index.vue")
  },
  {
    path: "about",
    name: "about",
    component: () => import("pages/About.vue"),
  },
  {
    path: "changelog",
    name: "changelog",
    component: () => import("pages/Changelog.vue"),
  },
  {
    path: "select",
    name: "select",
    component: () => import("pages/SelectQ.vue"),
  },
  {
    path: "quest/:id",
    name: "quest/id",
    component: () => import("pages/Quest.vue"),
  },
  {
    path: "preset",
    component: () => import("pages/Preset.vue")
  },
  {
    path: "settings",
    name: "settings",
    component: () => import("pages/Settings.vue"),
  },
  {
    path: "encrypt",
    name: "encrypt",
    component: () => import("pages/Encrypt.vue"),
  },
  {
    path: "import_quest",
    name: "importQuest",
    component: () => import("pages/ImportQuest.vue"),
  },
  {
    path: "preset/:id",
    name: "preset/id",
    component: () => import("pages/Preset.vue"),
  },
  {
    path: "store_preset",
    name: "store_preset",
    component: () => import("pages/PresetStore.vue"),
  },
  {
    path: "storage",
    name: "storage",
    component: () => import("pages/Storage.vue"),
  },
  {
    path: "questman",
    name: "questman",
    component: () => import("pages/QuestManager.vue"),
  },
  {
    path: "questman/import",
    name: "questmanagerimport",
    component: () => import("pages/QuestManagerImport.vue"),
  },
  {
    path: "questman/create",
    name: "questmanagercreate",
    component: () => import("pages/QuestManagerCreate.vue"),
  },
  {
    path: "finished_quest",
    name: "FinishedScreen",
    component: FinishedQuest,
  },
  ],
},

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/Error404.vue')
  // }
];

export default routes;
