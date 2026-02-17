<template>
  <div class="container py-4" dir="rtl">
    <div class="card border-0 shadow-lg rounded-4">
      <!-- Header -->
      <div
        class="card-header bg-info text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h2 class="mb-0 fw-bold">
          <i class="bi bi-receipt me-2"></i>
          إدارة الإيصالات ({{ filteredReceipts.length }})
        </h2>
        <div class="d-flex gap-2">
          <button
            @click="printContent"
            class="btn btn-light btn-sm rounded-pill no-print"
          >
            <i class="bi bi-printer me-1"></i>
            طباعة
          </button>
          <button @click="goBack" class="btn btn-light btn-sm rounded-pill">
            <i class="bi bi-arrow-right me-1"></i>
            رجوع
          </button>
        </div>
      </div>

      <div class="card-body p-4" ref="printArea">
        <!-- Search and Add Section -->
        <div class="row mb-4 no-print">
          <div class="col-md-8">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-lg"
              placeholder="🔍 بحث عن إيصال (رقم الإيصال، السنة، الشهر...)"
            />
          </div>
          <div class="col-md-4">
            <button
              @click="router.push('/add-receipt')"
              class="btn btn-success btn-lg w-100"
            >
              <i class="bi bi-plus-circle me-2"></i>
              إضافة إيصال جديد
            </button>
          </div>
          <div class="col-md-12 mt-2" v-if="selectedReceipts.length > 0">
            <button @click="deleteSelected" class="btn btn-danger btn-lg">
              <i class="bi bi-trash me-2"></i>
              حذف المحدد ({{ selectedReceipts.length }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات الإيصالات...</p>
        </div>

        <!-- Receipts Table -->
        <div v-else-if="filteredReceipts.length > 0" class="table-responsive">
          <table class="table table-hover table-striped">
            <thead class="table-header text-white">
              <tr>
                <th class="no-print" style="width: 50px">
                  <input
                    type="checkbox"
                    v-model="allSelected"
                    class="form-check-input"
                    style="cursor: pointer"
                  />
                </th>
                <th>رقم الإيصال</th>
                <th>القيمة (دينار)</th>
                <th>السنة</th>
                <th>الشهر</th>
                <th>تاريخ الدفع</th>
                <th>رقم العضو</th>
                <th class="no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="receipt in filteredReceipts" :key="receipt.receiptId">
                <td class="no-print">
                  <input
                    type="checkbox"
                    :checked="isSelected(receipt.receiptId)"
                    @change="toggleSelection(receipt.receiptId)"
                    class="form-check-input"
                    style="cursor: pointer"
                  />
                </td>
                <td>{{ receipt.receiptNo }}</td>
                <td>{{ receipt.value }}</td>
                <td>{{ receipt.year }}</td>
                <td>{{ getMonthName(receipt.month) }}</td>
                <td>{{ formatDate(receipt.paidDate) }}</td>
                <td>{{ receipt.basicMemberId }}</td>
                <td class="no-print">
                  <button
                    @click="viewReceipt(receipt.receiptId)"
                    class="btn btn-sm btn-primary me-1"
                    title="عرض"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click="editReceipt(receipt.receiptId)"
                    class="btn btn-sm btn-warning me-1"
                    title="تعديل"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="deleteReceipt(receipt.receiptId)"
                    class="btn btn-sm btn-danger"
                    title="حذف"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Receipts Message -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox text-muted" style="font-size: 4rem"></i>
          <p class="text-muted mt-3 fs-5">لا توجد إيصالات مسجلة</p>
        </div>
      </div>
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">قائمة الإيصالات</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
        <p class="text-muted">
          إجمالي الإيصالات: {{ filteredReceipts.length }}
        </p>
      </div>

      <div class="print-section" v-if="filteredReceipts.length > 0">
        <table class="print-table">
          <thead>
            <tr>
              <th>رقم الإيصال</th>
              <th>القيمة (دينار)</th>
              <th>السنة</th>
              <th>الشهر</th>
              <th>تاريخ الدفع</th>
              <th>رقم العضو</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="receipt in filteredReceipts" :key="receipt.receiptId">
              <td>{{ receipt.receiptNo }}</td>
              <td>{{ receipt.value }}</td>
              <td>{{ receipt.year }}</td>
              <td>{{ getMonthName(receipt.month) }}</td>
              <td>{{ formatDate(receipt.paidDate) }}</td>
              <td>{{ receipt.basicMemberId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";
import { getApiBaseUrl, getAuthToken } from "@/utils/api";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
// Node.js Backend API for Receipts
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const ReceiptAPI = API_BASE_URL + "/Receipt";
const AUTH_TOKEN = getAuthToken();

const loading = ref(false);
const receipts = ref([]);
const searchQuery = ref("");
const printArea = ref(null);
const selectedReceipts = ref([]);

// Computed property for select all state
const allSelected = computed({
  get: () =>
    filteredReceipts.value.length > 0 &&
    selectedReceipts.value.length === filteredReceipts.value.length,
  set: (value) => {
    selectedReceipts.value = value
      ? filteredReceipts.value.map((r) => r.receiptId)
      : [];
  },
});

// Check if a receipt is selected
const isSelected = (id) => selectedReceipts.value.includes(id);

// Toggle selection of a receipt
const toggleSelection = (id) => {
  const index = selectedReceipts.value.indexOf(id);
  if (index > -1) {
    selectedReceipts.value.splice(index, 1);
  } else {
    selectedReceipts.value.push(id);
  }
};

// Filtered receipts based on search
const filteredReceipts = computed(() => {
  if (!searchQuery.value) return receipts.value;
  const query = searchQuery.value.toLowerCase();
  return receipts.value.filter(
    (receipt) =>
      receipt.receiptNo?.toString().includes(query) ||
      receipt.year?.toString().includes(query) ||
      receipt.month?.toString().includes(query) ||
      receipt.value?.toString().includes(query) ||
      receipt.basicMemberId?.toString().includes(query),
  );
});

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

// Fetch receipts
const fetchReceipts = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(ReceiptAPI, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    receipts.value = response.data.data || response.data;
    console.log("Receipts fetched:", receipts.value);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الإيصالات");
  } finally {
    loading.value = false;
  }
};

const viewReceipt = (id) => {
  router.push(`/view-receipt/${id}`);
};

const editReceipt = (id) => {
  router.push(`/edit-receipt/${id}`);
};

// Bulk delete selected receipts
const deleteSelected = async () => {
  if (selectedReceipts.value.length === 0) {
    alertify.warning("الرجاء اختيار إيصال واحد على الأقل للحذف");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  const count = selectedReceipts.value.length;
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${count} إيصال؟`,
    async function () {
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedReceipts.value) {
        try {
          await axios.delete(`${ReceiptAPI}/${id}`, {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          });
          successCount++;
        } catch (error) {
          console.error(`Error deleting receipt ${id}:`, error);
          failCount++;
        }
      }

      await fetchReceipts();
      selectedReceipts.value = [];

      if (successCount > 0) {
        alertify.success(`تم حذف ${successCount} إيصال بنجاح`);
      }
      if (failCount > 0) {
        alertify.error(`فشل حذف ${failCount} إيصال`);
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

const deleteReceipt = (id) => {
  alertify.confirm(
    "تأكيد الحذف",
    "هل أنت متأكد من حذف هذا الإيصال؟",
    async function () {
      try {
        await axios.delete(`${ReceiptAPI}/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });
        alertify.success("تم حذف الإيصال بنجاح");
        await fetchReceipts();
      } catch (error) {
        console.error("Error deleting receipt:", error);
        alertify.error("حدث خطأ أثناء حذف الإيصال");
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
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
      <title>طباعة قائمة الإيصالات</title>
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
          border-bottom: 2px solid #17a2b8; 
          padding-bottom: 15px; 
        }
        .print-header h2 { 
          color: #17a2b8; 
          margin-bottom: 10px; 
        }
        .print-section {
          margin-bottom: 20px;
        }
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 10px; 
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: center; 
        }
        .print-table th { 
          background-color: #17a2b8; 
          color: white; 
          font-weight: bold; 
        }
        .print-table tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        @media print { 
          body { margin: 0; } 
          .print-table { font-size: 9px; }
          .print-table th, .print-table td { padding: 4px; }
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

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchReceipts();
});
</script>

<style scoped>
.table-header {
  background-color: #17a2b8 !important;
}

.bg-info {
  background-color: #17a2b8 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

/* Font family */
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
    background-color: #17a2b8 !important;
    color: white !important;
    padding: 1rem !important;
    text-align: center !important;
    border: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .card-header h2 {
    font-size: 1.3rem !important;
    margin: 0 !important;
  }

  .card-body {
    padding: 1rem !important;
  }

  .table-responsive {
    overflow: visible !important;
    border: 1px solid #e0e0e0;
    margin-bottom: 1rem;
  }

  .table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 10px !important;
    margin: 0 !important;
  }

  .table thead {
    display: table-header-group;
  }

  .table tr {
    page-break-inside: avoid;
  }

  .table th {
    background-color: #17a2b8 !important;
    color: white !important;
    border: 1px solid #dee2e6 !important;
    padding: 0.5rem 0.3rem !important;
    font-size: 10px !important;
    font-weight: bold !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .table td {
    border: 1px solid #dee2e6 !important;
    padding: 0.4rem 0.3rem !important;
    font-size: 9px !important;
    color: #000 !important;
  }

  .table tbody tr:nth-child(even) {
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
