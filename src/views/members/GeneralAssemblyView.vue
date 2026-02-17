<template>
  <div class="container py-4" dir="rtl">
    <div class="card border-0 shadow-lg rounded-4">
      <!-- Header -->
      <div
        class="card-header bg-warning text-dark py-3 d-flex justify-content-between align-items-center"
      >
        <h2 class="mb-0 fw-bold">
          <i class="bi bi-people-fill me-2"></i>
          أعضاء الجمعية العمومية ({{ filteredMembers.length }})
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
              placeholder="🔍 بحث عن عضو (الاسم، الرقم، المنصب...)"
            />
          </div>
          <div class="col-md-4">
            <button
              @click="router.push('/add-general-member')"
              class="btn btn-success btn-lg w-100"
            >
              <i class="bi bi-plus-circle me-2"></i>
              إضافة عضو جديد
            </button>
          </div>
          <div class="col-md-12 mt-2" v-if="selectedMembers.length > 0">
            <button @click="deleteSelected" class="btn btn-danger btn-lg">
              <i class="bi bi-trash me-2"></i>
              حذف المحدد ({{ selectedMembers.length }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات الأعضاء...</p>
        </div>

        <!-- Members Table -->
        <div v-else-if="filteredMembers.length > 0" class="table-responsive">
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
                <th>الرقم الوطني</th>
                <th>الاسم الكامل</th>
                <th>رقم الهاتف</th>
                <th>عضو إداري</th>
                <th>المنصب</th>
                <th class="no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in filteredMembers" :key="member.id">
                <td class="no-print">
                  <input
                    type="checkbox"
                    :checked="isSelected(member.id)"
                    @change="toggleSelection(member.id)"
                    class="form-check-input"
                    style="cursor: pointer"
                  />
                </td>
                <td>{{ member.id }}</td>
                <td>
                  {{ member.firstName }} {{ member.secondName }}
                  {{ member.lastName }}
                </td>
                <td>{{ member.phoneNumber || "غير محدد" }}</td>
                <td>
                  <span
                    v-if="member.isAdministrativeMember"
                    class="badge bg-primary"
                  >
                    <i class="bi bi-star me-1"></i>
                    نعم
                  </span>
                  <span v-else class="badge bg-secondary">لا</span>
                </td>
                <td>
                  <span v-if="member.administrativePosition" class="fw-bold">
                    {{ member.administrativePosition }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="no-print">
                  <button
                    @click="viewMember(member.id)"
                    class="btn btn-sm btn-primary me-1"
                    title="عرض"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click="editMember(member.id)"
                    class="btn btn-sm btn-warning me-1"
                    title="تعديل"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="deleteMember(member.id)"
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

        <!-- No Members Message -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox text-muted" style="font-size: 4rem"></i>
          <p class="text-muted mt-3 fs-5">لا توجد بيانات أعضاء</p>
        </div>
      </div>
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">قائمة أعضاء الجمعية العمومية</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
        <p class="text-muted">إجمالي الأعضاء: {{ filteredMembers.length }}</p>
      </div>

      <div class="print-section" v-if="filteredMembers.length > 0">
        <table class="print-table">
          <thead>
            <tr>
              <th>الرقم الوطني</th>
              <th>الاسم الكامل</th>
              <th>رقم الهاتف</th>
              <th>عضو إداري</th>
              <th>المنصب</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.id">
              <td>{{ member.id }}</td>
              <td>
                {{ member.firstName }} {{ member.secondName }}
                {{ member.lastName }}
              </td>
              <td>{{ member.phoneNumber || "غير محدد" }}</td>
              <td>{{ member.isAdministrativeMember ? "نعم" : "لا" }}</td>
              <td>{{ member.administrativePosition || "-" }}</td>
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

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
// Node.js Backend API for General Assembly Members
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const MemberAPI = API_BASE_URL + "/MemberGeneralAssembly";
const AUTH_TOKEN = localStorage.getItem("token");

const loading = ref(false);
const members = ref([]);
const searchQuery = ref("");
const printArea = ref(null);
const selectedMembers = ref([]);

// Computed property for select all state
const allSelected = computed({
  get: () =>
    filteredMembers.value.length > 0 &&
    selectedMembers.value.length === filteredMembers.value.length,
  set: (value) => {
    selectedMembers.value = value ? filteredMembers.value.map((m) => m.id) : [];
  },
});

// Check if a member is selected
const isSelected = (id) => selectedMembers.value.includes(id);

// Toggle selection of a member
const toggleSelection = (id) => {
  const index = selectedMembers.value.indexOf(id);
  if (index > -1) {
    selectedMembers.value.splice(index, 1);
  } else {
    selectedMembers.value.push(id);
  }
};

// Filtered members based on search
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  const query = searchQuery.value.toLowerCase();
  return members.value.filter(
    (member) =>
      member.id?.toLowerCase().includes(query) ||
      member.firstName?.toLowerCase().includes(query) ||
      member.secondName?.toLowerCase().includes(query) ||
      member.lastName?.toLowerCase().includes(query) ||
      member.phoneNumber?.toLowerCase().includes(query) ||
      member.administrativePosition?.toLowerCase().includes(query),
  );
});

// Fetch members
const fetchMembers = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(MemberAPI, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    members.value = response.data.data || response.data;
    console.log("General Assembly members fetched:", members.value);
  } catch (error) {
    console.error("Error fetching members:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الأعضاء");
  } finally {
    loading.value = false;
  }
};

const viewMember = (id) => {
  router.push(`/view-general-member/${id}`);
};

const editMember = (id) => {
  router.push(`/edit-general-member/${id}`);
};

// Bulk delete selected members
const deleteSelected = async () => {
  if (selectedMembers.value.length === 0) {
    alertify.warning("الرجاء اختيار عضو واحد على الأقل للحذف");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  const count = selectedMembers.value.length;
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${count} عضو؟`,
    async function () {
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedMembers.value) {
        try {
          await axios.delete(`${MemberAPI}/${id}`, {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          });
          successCount++;
        } catch (error) {
          console.error(`Error deleting member ${id}:`, error);
          failCount++;
        }
      }

      await fetchMembers();
      selectedMembers.value = [];

      if (successCount > 0) {
        alertify.success(`تم حذف ${successCount} عضو بنجاح`);
      }
      if (failCount > 0) {
        alertify.error(`فشل حذف ${failCount} عضو`);
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

const deleteMember = (id) => {
  alertify.confirm(
    "تأكيد الحذف",
    "هل أنت متأكد من حذف هذا العضو؟",
    async function () {
      try {
        await axios.delete(`${MemberAPI}/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });
        alertify.success("تم حذف العضو بنجاح");
        await fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
        alertify.error("حدث خطأ أثناء حذف العضو");
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
      <title>طباعة قائمة أعضاء الجمعية العمومية</title>
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
          border-bottom: 2px solid #ffc107; 
          padding-bottom: 15px; 
        }
        .print-header h2 { 
          color: #ffc107; 
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
          background-color: #ffc107; 
          color: #000; 
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
  fetchMembers();
});
</script>

<style scoped>
.table-header {
  background-color: #ffc107 !important;
  color: #000 !important;
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
    background-color: #ffc107 !important;
    color: #000 !important;
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
    background-color: #ffc107 !important;
    color: #000 !important;
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

  .badge {
    border: 1px solid #666 !important;
    padding: 2px 6px !important;
    font-size: 8px !important;
  }

  .badge.bg-primary {
    background-color: #cce5ff !important;
    color: #004085 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .badge.bg-secondary {
    background-color: #e2e3e5 !important;
    color: #383d41 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
