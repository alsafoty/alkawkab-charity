<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل العضو الأساسي</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات العضو...</p>
        </div>

        <!-- Member Information -->
        <div v-else-if="memberData">
          <div class="info-section mb-4">
            <h4 class="section-title mb-3">المعلومات الأساسية</h4>
            <div class="info-grid">
              <div class="info-item">
                <strong>الرقم الوطني:</strong>
                <span>{{ memberData.id }}</span>
              </div>
              <div class="info-item">
                <strong>الاسم الكامل:</strong>
                <span>
                  {{ memberData.firstName }} {{ memberData.secondName }}
                  {{ memberData.lastName }}
                </span>
              </div>
              <div class="info-item">
                <strong>رقم الهاتف:</strong>
                <span>{{ memberData.phoneNumber || "غير محدد" }}</span>
              </div>
            </div>
          </div>

          <div class="info-section mb-4">
            <h4 class="section-title mb-3">معلومات العضوية</h4>
            <div class="info-grid">
              <div class="info-item">
                <strong>رسوم الانتساب:</strong>
                <span
                  v-if="memberData.isMembershipPaid"
                  class="badge bg-success"
                >
                  <i class="bi bi-check-circle me-1"></i>
                  مسددة
                </span>
                <span v-else class="badge bg-danger">
                  <i class="bi bi-x-circle me-1"></i>
                  غير مسددة
                </span>
              </div>
              <div class="info-item">
                <strong>رقم الإيصال:</strong>
                <span>{{ memberData.receiptNo || "غير متوفر" }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4">
            <button
              @click="editMember"
              class="btn btn-warning px-4 me-2 no-print"
            >
              <i class="bi bi-pencil me-1"></i>
              تعديل البيانات
            </button>
            <button @click="goBack" class="btn btn-secondary px-4 no-print">
              <i class="bi bi-arrow-right me-1"></i>
              عودة
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          حدث خطأ في تحميل بيانات العضو
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

// Node.js Backend API for Members
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const route = useRoute();
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const memberData = ref(null);
const loading = ref(false);
const printArea = ref(null);

const fetchMemberDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Member/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    memberData.value = response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching member details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات العضو");
  } finally {
    loading.value = false;
  }
};

const editMember = () => {
  router.push(`/edit-member/${route.params.id}`);
};

const goBack = () => {
  router.back();
};

const printContent = () => {
  window.print();
};

onMounted(() => {
  fetchMemberDetails();
});
</script>

<style scoped>
.section-title {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.bg-primary {
  background-color: #42b983 !important;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.info-item strong {
  color: #42b983;
  display: block;
  margin-bottom: 0.5rem;
}

@media print {
  .no-print {
    display: none !important;
  }
}

* {
  font-family: "Tajawal", sans-serif;
}
</style>
