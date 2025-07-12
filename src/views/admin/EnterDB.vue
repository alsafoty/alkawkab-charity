<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center"
    style="min-height: 80vh"
  >
    <div
      class="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg text-center"
      style="max-width: 500px"
    >
      <h2 class="fs-1 fw-bold mb-4">الدخول لقاعدة البيانات</h2>
      <div class="d-flex flex-column justify-content-around mb-3 gap-3">
        <button
          @click="router.push('/individual')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          أفراد
        </button>
        <button
          @click="router.push('/family')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          عائلات
        </button>
        <button
          @click="router.push('/assistance')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          المساعدات
        </button>
        <button
          @click="router.push('/files')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          مركز الملفات
        </button>
      </div>

      <!-- زر تسجيل الخروج -->
      <div class="mt-4 pt-3 border-top">
        <button
          @click="logout"
          class="btn btn-danger btn-sm rounded-pill shadow-sm"
        >
          <i class="bi bi-box-arrow-right me-1"></i>
          تسجيل الخروج
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// وظيفة تسجيل الخروج
const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  // الاحتفاظ بخيار "تذكرني" إذا كان مفعلاً
  if (localStorage.getItem("rememberMe") !== "true") {
    localStorage.removeItem("rememberMe");
  }
  router.push("/admin");
};
</script>

<style scoped>
.donate-button {
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.donate-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

.donate-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
