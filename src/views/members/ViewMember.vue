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

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تفاصيل العضو الأساسي</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <div class="print-section mb-3" v-if="memberData">
        <h4 class="section-title">المعلومات الأساسية</h4>
        <table class="print-info-table">
          <tbody>
            <tr>
              <td><strong>الرقم الوطني:</strong></td>
              <td>{{ memberData.id }}</td>
              <td><strong>رقم الهاتف:</strong></td>
              <td>{{ memberData.phoneNumber || "غير محدد" }}</td>
            </tr>
            <tr>
              <td><strong>الاسم الكامل:</strong></td>
              <td colspan="3">
                {{ memberData.firstName }} {{ memberData.secondName }}
                {{ memberData.lastName }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="print-section mb-3" v-if="memberData">
        <h4 class="section-title">معلومات العضوية</h4>
        <table class="print-info-table">
          <tbody>
            <tr>
              <td><strong>رسوم الانتساب:</strong></td>
              <td>{{ memberData.isMembershipPaid ? "مسددة" : "غير مسددة" }}</td>
              <td><strong>رقم الإيصال:</strong></td>
              <td>{{ memberData.receiptNo || "غير متوفر" }}</td>
            </tr>
          </tbody>
        </table>
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

const getCurrentDate = () => {
  return new Date().toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const printContent = () => {
  const printContent = document.getElementById("printableContent").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>طباعة تفاصيل العضو الأساسي</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Tajawal', Arial, sans-serif; 
          direction: rtl; 
          margin: 20px; 
          color: #333; 
        }
        .print-header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #42b983; 
          padding-bottom: 15px; 
        }
        .print-header h2 { 
          color: #42b983; 
          margin-bottom: 10px; 
        }
        .print-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          color: #42b983;
          font-size: 1.1rem;
          border-bottom: 1px solid #42b983;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .print-info-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 11px; 
        }
        .print-info-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: right;
        }
        .print-info-table strong { 
          color: #42b983;
        }
        @media print { 
          body { margin: 0; } 
          .print-info-table { font-size: 10px; }
        }
      </style>
    </head>
    <body>${printContent}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
    alertify.success("تم فتح نافذة الطباعة");
  }, 250);
};

onMounted(() => {
  fetchMemberDetails();
});
</script>

<style scoped>
.bg-primary {
  background-color: #42b983 !important;
}

.info-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  color: #2c3e50;
  font-size: 1.25rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.info-item strong {
  color: #42b983;
  margin-left: 0.5rem;
}

* {
  font-family: "Tajawal", sans-serif;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 1.5cm;
  }

  body {
    margin: 0;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .card {
    border: none !important;
    box-shadow: none !important;
  }

  .card-header {
    background-color: #42b983 !important;
    color: white !important;
    padding: 1rem !important;
    text-align: center !important;
    border: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .card-header h3 {
    font-size: 1.3rem !important;
    margin: 0 !important;
  }

  .card-body {
    padding: 1rem !important;
  }

  .info-section {
    margin-bottom: 1rem !important;
    page-break-inside: avoid;
    border: 1px solid #e0e0e0 !important;
    box-shadow: none !important;
  }

  .section-title {
    color: #42b983 !important;
    font-size: 1.1rem !important;
    font-weight: bold !important;
    border-bottom: 2px solid #42b983 !important;
    padding-bottom: 0.5rem !important;
    margin-bottom: 1rem !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-grid {
    gap: 0.5rem !important;
  }

  .info-item {
    background-color: #f8f9fa !important;
    border: 1px solid #e9ecef !important;
    padding: 0.5rem !important;
    margin-bottom: 0 !important;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-item strong {
    color: #42b983 !important;
    font-size: 0.9rem !important;
    font-weight: bold !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-item span {
    font-size: 0.85rem !important;
    color: #000 !important;
  }

  .badge {
    border: 1px solid #666 !important;
    padding: 2px 6px !important;
    font-size: 0.75rem !important;
  }

  .badge.bg-success {
    background-color: #42b983 !important;
    color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .badge.bg-danger {
    background-color: #dc3545 !important;
    color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
