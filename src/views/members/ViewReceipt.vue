<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-info text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل الإيصال</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات الإيصال...</p>
        </div>

        <!-- Receipt Information -->
        <div v-else-if="receiptData">
          <div class="info-section mb-4">
            <h4 class="section-title mb-3">معلومات الإيصال</h4>
            <div class="info-grid">
              <div class="info-item">
                <strong>رقم الإيصال:</strong>
                <span>{{ receiptData.receiptNo }}</span>
              </div>
              <div class="info-item">
                <strong>القيمة:</strong>
                <span>{{ receiptData.value }} دينار</span>
              </div>
              <div class="info-item">
                <strong>السنة:</strong>
                <span>{{ receiptData.year }}</span>
              </div>
              <div class="info-item">
                <strong>الشهر:</strong>
                <span>{{ getMonthName(receiptData.month) }}</span>
              </div>
              <div class="info-item">
                <strong>تاريخ الدفع:</strong>
                <span>{{ formatDate(receiptData.paidDate) }}</span>
              </div>
              <div class="info-item">
                <strong>رقم العضو الأساسي:</strong>
                <span>{{ receiptData.basicMemberId }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4">
            <button
              @click="editReceipt"
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
          حدث خطأ في تحميل بيانات الإيصال
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
import { getApiBaseUrl, getAuthToken } from "@/utils/api";

alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

// Node.js Backend API for Receipts
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const route = useRoute();
const router = useRouter();
const AUTH_TOKEN = getAuthToken();

const receiptData = ref(null);
const loading = ref(false);
const printArea = ref(null);

// Helper function to get month name in Arabic
const getMonthName = (month) => {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  return months[month - 1] || month;
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "غير محدد";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fetchReceiptDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Receipt/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    receiptData.value = response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching receipt details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الإيصال");
  } finally {
    loading.value = false;
  }
};

const editReceipt = () => {
  router.push(`/edit-receipt/${route.params.id}`);
};

const goBack = () => {
  router.back();
};

const printContent = () => {
  window.print();
};

onMounted(() => {
  fetchReceiptDetails();
});
</script>

<style scoped>
.section-title {
  color: #17a2b8;
  border-bottom: 2px solid #17a2b8;
  padding-bottom: 0.5rem;
}

.bg-info {
  background-color: #17a2b8 !important;
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
  color: #17a2b8;
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
