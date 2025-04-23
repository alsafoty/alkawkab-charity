<template>
  <div class="main-container position-relative">
    <!-- طبقة التعتيم -->
    <div class="overlay bg-success bg-opacity-25 position-absolute top-0 start-0 w-100 h-100"></div>

    <!-- محتوى الصفحة -->
    <div class="content-wrapper position-relative d-flex flex-column min-vh-100">
      <nav class="navbar navbar-expand-lg bg-white bg-opacity-75 shadow px-4 py-3">
        <div class="container-fluid d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">

          <!-- الشعار والعنوان -->
          <div class="d-flex align-items-center gap-3">
            <img src="/images/logo.png" alt="Logo" class="logo-img" />
            <h1 class="navbar-brand fw-bold text-dark m-0 fs-5 fs-md-4">جمعية الكوكب الدري الخيرية</h1>
          </div>

          <!-- روابط التنقل -->
          <ul class="navbar-nav d-flex flex-row gap-3 fs-6 fs-md-5 fw-bold">
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/admin">الدخول للنظام</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/contact-us">تواصل معنا</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/about">عن الجمعية</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/">الرئيسية</router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- الانتقال بين الصفحات -->
      <transition name="fade-slide" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </div>
  </div>
</template>


<script setup>
// لا حاجة لسكريبت إضافي حالياً
</script>
<style>
body {
  margin: 0;
  font-family: 'Tajawal', sans-serif;
}

.main-container {
  background: url('../public/images/pexels-photo-2673300.jpeg') no-repeat center center;
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

/* Tajawal Regular */
@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-ExtraLight.ttf') format('truetype');
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-ExtraBold.ttf') format('truetype');
  font-weight: 800;
  font-style: normal;
}

@font-face {
  font-family: 'Tajawal';
  src: url('@/assets/fonts/Tajawal-Black.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

/* تطبيق الخط على الجسم كامل */
body {
  font-family: 'Tajawal', sans-serif;
}


</style>
