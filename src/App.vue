<template>
  <div class="main-container position-relative">
    <!-- Background overlay layer -->
    <div class="overlay bg-success bg-opacity-25 position-absolute top-0 start-0 w-100 h-100"></div>

    <!-- Page content -->
    <div class="content-wrapper position-relative d-flex flex-column min-vh-100">
      <nav class="navbar navbar-expand-lg bg-white bg-opacity-75 shadow px-4 py-3">
  <div class="container-fluid d-flex flex-wrap justify-content-between align-items-center">
    
    <!-- شعار وعنوان الجمعية -->
    <div class="d-flex align-items-center gap-3 flex-grow-1 flex-md-grow-0 justify-content-center justify-content-md-start text-center w-100 w-md-auto mb-3 mb-md-0">
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


      <!-- Transition effect for page content -->
      <transition name="fade-slide" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </div>
  </div>
</template>

<script setup>
// No background logic here anymore
</script>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

/* الشعار – استجابة تلقائية */
.logo-img {
  height: 50px;
}

@media (min-width: 768px) {
  .logo-img {
    height: 70px;
  }
}

/* Transition Styles */
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
</style>
