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

      <!-- الأزرار الرئيسية -->
      <div
        v-if="!showBeneficiariesMenu"
        class="d-flex flex-column justify-content-around mb-3 gap-3"
      >
        <button
          @click="showBeneficiariesMenu = true"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          المستفيدين
        </button>
        <button
          @click="router.push('/assistance')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          المساعدات
        </button>
      </div>

      <!-- قائمة المستفيدين -->
      <div v-else class="d-flex flex-column justify-content-around mb-3 gap-3">
        <button
          @click="router.push('/family')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          أسر
        </button>
        <button
          @click="router.push('/widows')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          أرامل
        </button>
        <button
          @click="router.push('/orphans')"
          class="btn btn-success donate-button fs-3 px-5 py-2"
        >
          أيتام
        </button>
        <button
          @click="showBeneficiariesMenu = false"
          class="btn btn-secondary donate-button fs-3 px-5 py-2"
        >
          <i class="bi bi-arrow-right me-2"></i>
          رجوع
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showBeneficiariesMenu = ref(false);

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
