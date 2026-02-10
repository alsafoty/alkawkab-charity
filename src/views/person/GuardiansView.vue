<template>
  <div
    class="guardians-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
    ref="printArea"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold">جدول الأوصياء</h2>
      <button class="btn btn-success no-print" @click="printContent">
        <i class="bi bi-printer me-1"></i>
        طباعة
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2 no-print">
        <!-- زر إضافة وصي جديد -->
        <router-link to="/add-guardian" class="btn btn-success expandable-btn">
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة وصي جديد</span>
        </router-link>
      </div>

      <div class="flex-grow-1 mx-3 no-print">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث بالاسم أو الرقم الوطني أو صلة القرابة..."
        />
      </div>

      <div class="no-print" style="min-width: 200px">
        <select
          v-model="sortBy"
          class="form-select custom-input"
          dir="rtl"
          style="
            max-width: 230px;
            text-align: right;
            padding-right: 2rem;
            background-position: right 0.75rem center;
            background-size: 12px 12px;
          "
        >
          <option value="name">ترتيب حسب: الاسم</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2 text-muted">جاري تحميل بيانات الأوصياء...</p>
    </div>

    <div
      v-else
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>الرقم الوطني</th>
            <th>الاسم الكامل</th>
            <th>صلة القرابة</th>
            <th>المهنة</th>
            <th>رقم الهاتف</th>
            <th>عدد الأيتام</th>
            <th class="no-print">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guardian in filteredGuardians" :key="guardian.guardianId">
            <td>{{ guardian.guardianId }}</td>
            <td>
              {{ guardian.firstName }} {{ guardian.secondName }}
              {{ guardian.thirdName }} {{ guardian.lastName }}
            </td>
            <td>{{ guardian.relationship }}</td>
            <td>{{ guardian.guardianJob || "-" }}</td>
            <td>{{ guardian.guardianPhoneNumber || "-" }}</td>
            <td>
              <span class="badge bg-success">{{
                guardian.peopleUnderGuardianship?.length || 0
              }}</span>
            </td>
            <td class="d-flex gap-2 justify-content-center no-print">
              <button
                @click="viewGuardianDetails(guardian.guardianId)"
                class="btn btn-primary btn-sm expandable-action-btn"
                title="عرض التفاصيل"
              >
                <i class="bi bi-eye icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="editGuardian(guardian.guardianId)"
                class="btn btn-warning btn-sm expandable-action-btn"
                title="تعديل"
              >
                <i class="bi bi-pencil icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="deleteGuardian(guardian.guardianId)"
                class="btn btn-danger btn-sm expandable-action-btn"
                title="حذف"
              >
                <i class="bi bi-trash icon"></i>
                <span class="btn-text"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!loading && !filteredGuardians.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أوصياء مطابقون للبحث المحدد
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تقرير الأوصياء</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <table class="table table-bordered print-table">
        <thead class="table-dark">
          <tr>
            <th>الرقم الوطني</th>
            <th>الاسم الكامل</th>
            <th>صلة القرابة</th>
            <th>المهنة</th>
            <th>رقم الهاتف</th>
            <th>عدد الأيتام</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guardian in filteredGuardians" :key="guardian.guardianId">
            <td>{{ guardian.guardianId }}</td>
            <td>
              {{ guardian.firstName }} {{ guardian.secondName }}
              {{ guardian.thirdName }} {{ guardian.lastName }}
            </td>
            <td>{{ guardian.relationship }}</td>
            <td>{{ guardian.guardianJob || "-" }}</td>
            <td>{{ guardian.guardianPhoneNumber || "-" }}</td>
            <td>{{ guardian.peopleUnderGuardianship?.length || 0 }}</td>
          </tr>
        </tbody>
      </table>

      <div class="print-footer mt-4">
        <p class="text-center text-muted">
          إجمالي عدد الأوصياء: {{ filteredGuardians.length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const guardians = ref([]);
const searchQuery = ref("");
const sortBy = ref("name"); // الترتيب الافتراضي حسب الاسم
const loading = ref(false);
const isDeleting = ref(false);
const printArea = ref(null);

// Fetch guardians data
const fetchGuardians = async () => {
  loading.value = true;
  try {

    const response = await axios.get(`${API_BASE_URL}/Guardian`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    guardians.value = response.data;
  } catch (error) {
    console.error("Error fetching guardians:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات الأوصياء: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات الأوصياء");
    }
  } finally {
    loading.value = false;
  }
};

// Enhanced search functionality with sorting
const filteredGuardians = computed(() => {
  let result = guardians.value;

  // تطبيق البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();

    result = result.filter((guardian) => {
      const fullName =
        `${guardian.firstName} ${guardian.secondName} ${guardian.thirdName} ${guardian.lastName}`.toLowerCase();

      const matchesName = fullName.includes(query);
      const matchesId = guardian.guardianId.toString().includes(query);
      const matchesRelationship = guardian.relationship
        ?.toLowerCase()
        .includes(query);
      const matchesJob = guardian.guardianJob?.toLowerCase().includes(query);
      const matchesPhone = guardian.guardianPhoneNumber?.includes(query);

      return (
        matchesName ||
        matchesId ||
        matchesRelationship ||
        matchesJob ||
        matchesPhone
      );
    });
  }

  // تطبيق الترتيب
  const sorted = [...result];
  sorted.sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB, "ar");
  });

  return sorted;
});

// Navigation functions
const viewGuardianDetails = (id) => {
  router.push(`/view-guardian/${id}`);
};

const editGuardian = (id) => {
  router.push(`/edit-guardian/${id}`);
};

const deleteGuardian = async (id) => {
  if (!id || id === "") {
    alertify.error("معرف الوصي غير صحيح");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  if (isDeleting.value) {
    alertify.warning("يتم حذف وصي آخر، يرجى الانتظار");
    return;
  }

  const guardian = guardians.value.find((g) => g.guardianId === id);
  const guardianName = guardian
    ? `${guardian.firstName} ${guardian.lastName}`
    : `الوصي رقم ${id}`;

  // Check if guardian has orphans under guardianship
  if (guardian?.peopleUnderGuardianship?.length > 0) {
    alertify.error(
      `لا يمكن حذف ${guardianName} لأنه وصي على ${guardian.peopleUnderGuardianship.length} يتيم/أيتام`,
    );
    return;
  }

  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${guardianName}؟`,
    async function () {
      isDeleting.value = true;

      try {

        await axios.delete(`${API_BASE_URL}/Guardian/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });

        const index = guardians.value.findIndex((g) => g.guardianId === id);
        if (index > -1) {
          guardians.value.splice(index, 1);
        }

        alertify.success(`تم حذف ${guardianName} بنجاح`);
      } catch (error) {
        console.error("Error deleting guardian:", error);

        if (error.response) {
          if (error.response.status === 404) {
            alertify.warning("الوصي غير موجود أو تم حذفه مسبقاً");
            await fetchGuardians();
          } else if (error.response.status === 403) {
            alertify.error("ليس لديك صلاحية لحذف هذا الوصي");
          } else if (error.response.status === 409) {
            alertify.error("لا يمكن حذف هذا الوصي لأنه مرتبط بأيتام");
          } else {
            const errorMessage =
              error.response.data.message || error.response.statusText;
            alertify.error(`حدث خطأ أثناء حذف الوصي: ${errorMessage}`);
          }
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء حذف الوصي");
        }
      } finally {
        isDeleting.value = false;
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
      <title>طباعة جدول الأوصياء</title>
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
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          font-size: 11px; 
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: center; 
          vertical-align: middle;
        }
        .print-table th { 
          background-color: #42b983; 
          color: white; 
          font-weight: bold; 
          font-size: 12px;
        }
        .print-table tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        .print-footer { 
          margin-top: 30px; 
          text-align: center; 
          border-top: 1px solid #ddd; 
          padding-top: 15px; 
          color: #666; 
        }
        @media print { 
          body { margin: 0; } 
          .print-table { font-size: 10px; }
          .print-table th { font-size: 11px; }
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

onMounted(fetchGuardians);
</script>

<style scoped>
.guardians-table {
  font-family: "Tajawal", sans-serif;
}

.table-header {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.custom-input {
  text-align: right;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  border-radius: 8px;
}

.custom-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.25);
}

.custom-input::placeholder {
  text-align: right;
  color: #aaa;
  font-size: 0.9rem;
}

.expandable-btn {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expandable-btn .icon {
  transition: margin 0.4s ease;
  font-size: 1.1rem;
}

.expandable-btn .btn-text {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: all 0.4s ease;
  margin-right: 0;
  font-weight: 600;
}

.expandable-btn:hover {
  min-width: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.expandable-btn:hover .icon {
  margin-left: 0.5rem;
}

.expandable-btn:hover .btn-text {
  opacity: 1;
  max-width: 150px;
  margin-right: 0.5rem;
}

.btn-danger.expandable-action-btn:hover {
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
  transform: translateY(-1px);
}

.btn-primary.expandable-action-btn {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary.expandable-action-btn:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
  transform: translateY(-1px);
}

.btn-warning.expandable-action-btn:hover {
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
  transform: translateY(-1px);
}

.expandable-action-btn:active {
  transform: translateY(0) !important;
}

.form-control::placeholder {
  text-align: right;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .expandable-btn:hover .btn-text {
    max-width: 120px;
  }

  .expandable-action-btn:hover .btn-text {
    max-width: 50px;
  }

  .table-responsive {
    font-size: 0.9rem;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .container {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .guardians-table {
    box-shadow: none !important;
    background: white !important;
  }

  .table {
    font-size: 12px;
  }

  .table-header {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .table th,
  .table td {
    padding: 0.5rem !important;
  }

  h2 {
    margin-bottom: 1rem !important;
  }
}
</style>
