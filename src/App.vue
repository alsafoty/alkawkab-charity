<template>
  <div class="main-container position-relative">
    <!-- طبقة التعتيم -->
    <div
      class="overlay bg-success bg-opacity-25 position-absolute top-0 start-0 w-100 h-100"
    ></div>

    <!-- محتوى الصفحة -->
    <div
      class="content-wrapper position-relative d-flex flex-column min-vh-100"
    >
      <nav
        class="navbar navbar-expand-lg bg-white bg-opacity-75 shadow px-4 py-3 position-relative"
      >
        <div
          class="container-fluid d-flex justify-content-between align-items-center"
        >
          <!-- الشعار والعنوان (left side) -->
          <div class="d-flex align-items-center gap-3 flex-shrink-0">
            <img src="/images/logo.png" alt="Logo" class="logo-img" />
            <h1 class="navbar-brand fw-bold text-dark m-0 fs-5 fs-md-4">
              جمعية الكوكب الدري الخيرية
            </h1>
          </div>

          <!-- زر القائمة المنسدلة للجوال -->
          <button
            class="navbar-toggler d-lg-none"
            type="button"
            @click="toggleMobileMenu"
            aria-label="Toggle navigation"
          >
            <i class="bi bi-list fs-4"></i>
          </button>

          <!-- روابط التنقل (desktop) -->
          <ul
            class="navbar-nav d-none d-lg-flex flex-row fs-6 fs-md-3 fw-bold position-absolute start-50 translate-middle-x"
          >
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/contact-us"
                >تواصل معنا</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/about"
                >عن الجمعية</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/"
                >الرئيسية</router-link
              >
            </li>
          </ul>

          <!-- زر الدخول للنظام (desktop) -->
          <div class="login-button-container flex-shrink-0 d-none d-lg-block">
            <router-link
              class="btn btn-success btn-sm rounded-pill shadow-sm"
              to="/admin"
            >
              <i class="bi bi-person-fill me-1"></i>
              الدخول للنظام
            </router-link>
          </div>
        </div>

        <!-- القائمة المنسدلة للجوال -->
        <div class="mobile-menu d-lg-none" :class="{ show: showMobileMenu }">
          <div class="mobile-menu-content">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link
                  class="nav-link text-dark"
                  to="/"
                  @click="closeMobileMenu"
                >
                  الرئيسية
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link text-dark"
                  to="/about"
                  @click="closeMobileMenu"
                >
                  عن الجمعية
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link text-dark"
                  to="/contact-us"
                  @click="closeMobileMenu"
                >
                  تواصل معنا
                </router-link>
              </li>
              <li class="nav-item mt-3">
                <router-link
                  class="btn btn-success btn-sm rounded-pill shadow-sm w-100"
                  to="/admin"
                  @click="closeMobileMenu"
                >
                  <i class="bi bi-person-fill me-1"></i>
                  الدخول للنظام
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- الانتقال بين الصفحات -->
      <transition name="fade-slide" mode="out-in">
        <router-view :key="$route.fullPath" @logout="logout" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const showMobileMenu = ref(false);

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
onMounted(() => {
  checkLoginStatus();
});

// مراقبة تغييرات المسار للتحقق من حالة تسجيل الدخول
watch(
  () => route.path,
  () => {
    checkLoginStatus();
    closeMobileMenu(); // إغلاق القائمة عند تغيير المسار
  }
);

// التحقق من حالة تسجيل الدخول
const checkLoginStatus = () => {
  const loginStatus = localStorage.getItem("isLoggedIn");
  isLoggedIn.value = loginStatus === "true";

  // التحقق مما إذا كان المستخدم يحاول الوصول إلى صفحة محمية
  if (!isLoggedIn.value && isProtectedRoute(route.path)) {
    router.push("/admin");
  }
};

// التحقق مما إذا كان المسار محمياً
const isProtectedRoute = (path) => {
  const protectedRoutes = ["/enterdb", "/individual", "/family"];
  return protectedRoutes.some((route) => path.startsWith(route));
};

// تسجيل الخروج
const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  // الاحتفاظ بخيار "تذكرني" إذا كان مفعلاً
  if (localStorage.getItem("rememberMe") !== "true") {
    localStorage.removeItem("rememberMe");
  }
  isLoggedIn.value = false;
  router.push("/admin");
};

// تبديل القائمة المنسدلة للجوال
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// إغلاق القائمة المنسدلة للجوال
const closeMobileMenu = () => {
  showMobileMenu.value = false;
};
</script>

<style>
body {
  margin: 0;
  font-family: "Tajawal", sans-serif;
}

.main-container {
  background: url("../public/images/pexels-photo-2673300.jpeg") no-repeat center
    center;
  background-size: cover;
  min-height: 100vh;
  overflow: hidden;
}

.overlay {
  z-index: 0;
}

.content-wrapper {
  z-index: 1;
}

/* الشعار */
.logo-img {
  height: 50px;
}
@media (min-width: 768px) {
  .logo-img {
    height: 70px;
  }
}

/* انتقال الصفحات */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* خطوط Tajawal */
@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-ExtraLight.ttf") format("truetype");
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-Light.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-ExtraBold.ttf") format("truetype");
  font-weight: 800;
  font-style: normal;
}

@font-face {
  font-family: "Tajawal";
  src: url("@/assets/fonts/Tajawal-Black.ttf") format("truetype");
  font-weight: 900;
  font-style: normal;
}

/* زر تسجيل الخروج المنفصل */
.logout-button-container {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 1030;
}

.logout-button-container .btn {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  transition: all 0.3s ease;
}

.logout-button-container .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* زر الدخول للنظام */
.login-button-container .btn {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  transition: all 0.3s ease;
}

.login-button-container .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(25, 135, 84, 0.3);
}

/* زر القائمة المنسدلة للجوال */
.navbar-toggler {
  border: none;
  background: none;
  color: #198754;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.navbar-toggler:hover {
  background-color: rgba(25, 135, 84, 0.1);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

/* القائمة المنسدلة للجوال */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  z-index: 1000;
}

.mobile-menu.show {
  max-height: 300px;
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-menu .navbar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu .nav-item {
  margin-bottom: 0.5rem;
}

.mobile-menu .nav-link {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
}

.mobile-menu .nav-link:hover {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.mobile-menu .nav-link.router-link-active {
  background-color: rgba(25, 135, 84, 0.2);
  color: #198754;
  font-weight: 600;
}

/* تطبيق الخط على الجسم كامل */
body {
  font-family: "Tajawal", sans-serif;
}

/* تحسينات إضافية للجوال */
@media (max-width: 991px) {
  .navbar .container-fluid {
    position: relative;
  }

  .logo-img {
    height: 40px;
  }

  .navbar-brand {
    font-size: 1.1rem !important;
  }
}

@media (max-width: 480px) {
  .navbar-brand {
    font-size: 1rem !important;
  }

  .logo-img {
    height: 35px;
  }
}
</style>
