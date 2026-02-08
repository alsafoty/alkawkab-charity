<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-warning text-dark py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل عضو الجمعية العمومية</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status">
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
                <strong>الموقع:</strong>
                <span>{{ memberData.location || "غير محدد" }}</span>
              </div>
              <div class="info-item">
                <strong>رقم الهاتف:</strong>
                <span>{{ memberData.phoneNumber || "غير محدد" }}</span>
              </div>
            </div>
          </div>

          <div class="info-section mb-4">
            <h4 class="section-title mb-3">معلومات العضوية الإدارية</h4>
            <div class="info-grid">
              <div class="info-item">
                <strong>عضو إداري:</strong>
                <span
                  v-if="memberData.isAdministrativeMember"
                  class="badge bg-primary"
                >
                  <i class="bi bi-star me-1"></i>
                  نعم
                </span>
                <span v-else class="badge bg-secondary">لا</span>
              </div>
              <div class="info-item">
                <strong>المنصب الإداري:</strong>
                <span v-if="memberData.administrativePosition" class="fw-bold">
                  {{ memberData.administrativePosition }}
                </span>
                <span v-else class="text-muted">لا يوجد</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4">
            <button
              @click="editMember"
              class="btn btn-warning px-4 me-2 no-print text-dark fw-bold"
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

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
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
      `${API_BASE_URL}/MemberGeneralAssembly/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    memberData.value = response.data;
  } catch (error) {
    console.error("Error fetching member details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات العضو");
  } finally {
    loading.value = false;
  }
};

const editMember = () => {
  router.push(`/edit-general-member/${route.params.id}`);
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
  color: #ffc107;
  border-bottom: 2px solid #ffc107;
  padding-bottom: 0.5rem;
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
  color: #ffc107;
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
