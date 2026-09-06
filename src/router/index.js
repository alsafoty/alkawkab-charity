import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/general/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "جمعية الكوكب الدري الخيرية - الصفحة الرئيسية",
      description:
        "جمعية الكوكب الدري الخيرية تقدم الدعم والمساعدة للأيتام والأرامل والعائلات المحتاجة",
      keywords: "جمعية خيرية, الكوكب الدري, مساعدة الأيتام, الأعمال الخيرية",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/general/AboutView.vue"),
    meta: {
      title: "من نحن - جمعية الكوكب الدري الخيرية",
      description:
        "تعرف على جمعية الكوكب الدري الخيرية، رؤيتنا، رسالتنا، وأهدافنا في خدمة المجتمع والعائلات المحتاجة",
      keywords: "من نحن, جمعية خيرية, رؤيتنا, رسالتنا",
    },
  },
  {
    path: "/contact-us",
    name: "contact",
    component: () => import("../views/general/contact-us.vue"),
    meta: {
      title: "تواصل معنا - جمعية الكوكب الدري الخيرية",
      description:
        "تواصل مع جمعية الكوكب الدري الخيرية للاستفسارات والتبرعات والمشاركة في الأعمال الخيرية",
      keywords: "تواصل معنا, اتصل بنا, جمعية خيرية",
    },
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
    path: "/guardians",
    name: "guardians",
    component: () => import("../views/person/GuardiansView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-guardian",
    name: "add-guardian",
    component: () => import("../views/person/AddGuardian.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-guardian/:id",
    name: "view-guardian",
    component: () => import("../views/person/ViewGuardian.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-guardian/:id",
    name: "edit-guardian",
    component: () => import("../views/person/EditGuardian.vue"),
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
  {
    path: "/files-center",
    name: "files-center",
    component: () => import("../views/files/FilesCenter.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/members",
    name: "members",
    component: () => import("../views/members/MembersView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/basic-members",
    name: "basic-members",
    component: () => import("../views/members/BasicMembersView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-member",
    name: "add-member",
    component: () => import("../views/members/AddMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-member/:id",
    name: "edit-member",
    component: () => import("../views/members/EditMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-member/:id",
    name: "view-member",
    component: () => import("../views/members/ViewMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/general-assembly",
    name: "general-assembly",
    component: () => import("../views/members/GeneralAssemblyView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-general-member",
    name: "add-general-member",
    component: () => import("../views/members/AddGeneralMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-general-member/:id",
    name: "edit-general-member",
    component: () => import("../views/members/EditGeneralMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-general-member/:id",
    name: "view-general-member",
    component: () => import("../views/members/ViewGeneralMember.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/receipts",
    name: "receipts",
    component: () => import("../views/members/ReceiptsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-receipt",
    name: "add-receipt",
    component: () => import("../views/members/AddReceipt.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-receipt/:id",
    name: "edit-receipt",
    component: () => import("../views/members/EditReceipt.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/view-receipt/:id",
    name: "view-receipt",
    component: () => import("../views/members/ViewReceipt.vue"),
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

  // Update document title and meta tags for SEO
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "جمعية الكوكب الدري الخيرية";
  }

  // Update meta description
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", to.meta.description);
    }
  }

  // Update meta keywords
  if (to.meta.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", to.meta.keywords);
    }
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in and token exists
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      // Not logged in, redirect to login page
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
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
