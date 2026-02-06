import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/general/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/general/AboutView.vue"),
  },
  {
    path: "/contact-us",
    name: "contact",
    component: () => import("../views/general/contact-us.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/AdminView.vue"),
  },
  {
    path: "/enterdb",
    name: "enterdb",
    component: () => import("../views/admin/EnterDB.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/individual",
    name: "individual",
    component: () => import("../views/person/IndividualView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/widows",
    name: "widows",
    component: () => import("../views/person/WidowsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/orphans",
    name: "orphans",
    component: () => import("../views/person/OrphansView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/family",
    name: "family",
    component: () => import("../views/family/FamilyView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/assistance",
    name: "assistance",
    component: () => import("../views/assistance/AssistanceView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-person",
    name: "add-person",
    component: () => import("../views/person/AddPerson.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-person/:id",
    name: "edit-person",
    component: () => import("../views/person/EditPerson.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-person/:id",
    name: "view-person",
    component: () => import("../views/person/ViewPerson.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-family",
    name: "add-family",
    component: () => import("../views/family/AddFamily.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-family/:id",
    name: "edit-family",
    component: () => import("../views/family/EditFamily.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-family/:id",
    name: "view-family",
    component: () => import("../views/family/ViewFamily.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/assistance-types",
    name: "assistance-types",
    component: () => import("../views/assistance/AssistanceTypeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-assistance",
    name: "add-assistance",
    component: () => import("../views/assistance/AddAssistance.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-assistance/:id",
    name: "edit-assistance",
    component: () => import("../views/assistance/EditAssistance.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-assistance/:id",
    name: "view-assistance",
    component: () => import("../views/assistance/ViewAssistance.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-assistance-type/:id",
    name: "view-assistance-type",
    component: () => import("../views/assistance/ViewAssistanceType.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/files",
    name: "files",
    component: () => import("../views/admin/FilesView.vue"),
    meta: { requiresAuth: true },
  },
  { path: "/redirect", redirect: "/" },
  {
    path: "/add-assistance-type",
    name: "add-assistance-type",
    component: () => import("../views/assistance/AddAssistanceType.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-assistance-type/:id",
    name: "edit-assistance-type",
    component: () => import("../views/assistance/EditAssistanceType.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Navigation guard to check authentication for protected routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in
    if (!isLoggedIn) {
      // Not logged in, redirect to login page
      next({ name: "admin" });
    } else {
      // Logged in, proceed to route
      next();
    }
  } else {
    // Not a protected route, proceed
    next();
  }
});

export default router;
