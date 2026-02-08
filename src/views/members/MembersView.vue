<template>
  <div class="container py-4" dir="rtl">
    <div class="card border-0 shadow-lg rounded-4">
      <!-- Header -->
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h2 class="mb-0 fw-bold">
          <i class="bi bi-people me-2"></i>
          إدارة العضوية
        </h2>
        <button @click="goBack" class="btn btn-light btn-sm rounded-pill">
          <i class="bi bi-arrow-right me-1"></i>
          رجوع
        </button>
      </div>

      <div class="card-body p-4">
        <!-- Quick Actions -->
        <div class="row mb-4 g-3">
          <div class="col-md-6">
            <button
              @click="router.push('/basic-members')"
              class="btn btn-primary btn-lg w-100"
            >
              <i class="bi bi-person-badge me-2"></i>
              الأعضاء الأساسيين
            </button>
          </div>
          <div class="col-md-6">
            <button
              @click="router.push('/general-assembly')"
              class="btn btn-warning btn-lg w-100"
            >
              <i class="bi bi-people-fill me-2"></i>
              أعضاء الجمعية العمومية
            </button>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="info-card p-4 rounded-3">
              <i class="bi bi-person-badge display-4 text-primary mb-3"></i>
              <h4>الأعضاء الأساسيين</h4>
              <p class="text-muted">
                إدارة بيانات الأعضاء الأساسيين في الجمعية، متابعة سداد رسوم
                العضوية، إصدار الإيصالات
              </p>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="info-card p-4 rounded-3">
              <i class="bi bi-people-fill display-4 text-warning mb-3"></i>
              <h4>أعضاء الجمعية العمومية</h4>
              <p class="text-muted">
                إدارة بيانات أعضاء الجمعية العمومية، تحديد الأعضاء الإداريين
                ومناصبهم
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.info-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.btn-primary {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary:hover {
  background-color: #359269;
  border-color: #359269;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
