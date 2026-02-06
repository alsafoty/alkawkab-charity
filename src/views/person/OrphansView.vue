<template>
  <div
    class="persons-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
    ref="printArea"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold">جدول الأيتام</h2>
      <button class="btn btn-success no-print" @click="printContent">
        <i class="bi bi-printer me-1"></i>
        طباعة
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2 no-print">
        <!-- زر إضافة شخص جديد مع تأثير التوسع -->
        <router-link to="/add-person" class="btn btn-success expandable-btn">
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة شخص جديد</span>
        </router-link>
      </div>

      <div class="flex-grow-1 mx-3 no-print">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث بالاسم أو الرقم التعريفي أو المستوى التعليمي..."
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2 text-muted">جاري تحميل بيانات الأيتام...</p>
    </div>

    <div
      v-else
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>الرقم التعريفي</th>
            <th>الجنس</th>
            <th>الاسم الأول</th>
            <th>اسم الأب</th>
            <th>اسم الجد</th>
            <th>الاسم العائلة</th>
            <th>رقم الهاتف</th>
            <th>المستوى التعليمي</th>
            <th class="no-print">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredOrphans" :key="person.id">
            <td>{{ person.id }}</td>
            <td>{{ person.gender }}</td>
            <td>{{ person.firstName }}</td>
            <td>{{ person.secondName }}</td>
            <td>{{ person.thirdName }}</td>
            <td>{{ person.lastName }}</td>
            <td>{{ person.phoneNumber }}</td>
            <td>{{ person.educationalLevel }}</td>
            <td class="d-flex gap-2 justify-content-center no-print">
              <button
                @click="viewDetails(person.id)"
                class="btn btn-primary btn-sm expandable-action-btn"
                title="عرض التفاصيل"
              >
                <i class="bi bi-eye icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="editPerson(person.id)"
                class="btn btn-warning btn-sm expandable-action-btn"
                title="تعديل"
              >
                <i class="bi bi-pencil icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="deletePerson(person.id)"
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
      v-if="!loading && !filteredOrphans.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أيتام مطابقون للبحث المحدد
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تقرير الأيتام</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <table class="table table-bordered print-table">
        <thead class="table-dark">
          <tr>
            <th>الرقم التعريفي</th>
            <th>الاسم الكامل</th>
            <th>الجنس</th>
            <th>رقم الهاتف</th>
            <th>المستوى التعليمي</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredOrphans" :key="person.id">
            <td>{{ person.id }}</td>
            <td>
              {{ person.firstName }} {{ person.secondName }}
              {{ person.thirdName }} {{ person.lastName }}
            </td>
            <td>{{ person.gender }}</td>
            <td>{{ person.phoneNumber }}</td>
            <td>{{ person.educationalLevel }}</td>
          </tr>
        </tbody>
      </table>

      <div class="print-footer mt-4">
        <p class="text-center text-muted">
          إجمالي عدد الأيتام: {{ filteredOrphans.length }}
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

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const orphans = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const isDeleting = ref(false);
const printArea = ref(null);

// Fetch orphans data
const fetchOrphans = async () => {
  loading.value = true;
  try {
    alertify.message("جاري تحميل بيانات الأيتام...");

    const response = await axios.get(`${API_BASE_URL}/Person`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // Filter only orphans
    orphans.value = response.data.filter((person) => person.isOrphan === true);

    alertify.success(`تم تحميل ${orphans.value.length} يتيم/يتيمة بنجاح`);
  } catch (error) {
    console.error("Error fetching orphans:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات الأيتام: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات الأيتام");
    }
  } finally {
    loading.value = false;
  }
};

// Enhanced search functionality
const filteredOrphans = computed(() => {
  if (!searchQuery.value) {
    return orphans.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return orphans.value.filter((person) => {
    const fullName =
      `${person.firstName} ${person.secondName} ${person.thirdName} ${person.lastName}`.toLowerCase();

    const matchesName = fullName.includes(query);
    const matchesId = person.id.toString().includes(query);
    const matchesEducation = person.educationalLevel
      ?.toLowerCase()
      .includes(query);
    const matchesPhone = person.phoneNumber?.includes(query);
    const matchesGender = person.gender?.toLowerCase().includes(query);

    return (
      matchesName ||
      matchesId ||
      matchesEducation ||
      matchesPhone ||
      matchesGender
    );
  });
});

// Navigation functions
const viewDetails = (id) => {
  router.push(`/view-person/${id}`);
};

const editPerson = (id) => {
  router.push(`/edit-person/${id}`);
};

const deletePerson = async (id) => {
  if (!id || id === "") {
    alertify.error("معرف الشخص غير صحيح");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  if (isDeleting.value) {
    alertify.warning("يتم حذف شخص آخر، يرجى الانتظار");
    return;
  }

  const person = orphans.value.find((p) => p.id === id);
  const personName = person
    ? `${person.firstName} ${person.lastName}`
    : `الشخص رقم ${id}`;

  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${personName}؟`,
    async function () {
      isDeleting.value = true;

      try {
        alertify.message("جاري حذف الشخص...");

        await axios.delete(`${API_BASE_URL}/Person/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });

        const index = orphans.value.findIndex((p) => p.id === id);
        if (index > -1) {
          orphans.value.splice(index, 1);
        }

        alertify.success(`تم حذف ${personName} بنجاح`);
      } catch (error) {
        console.error("Error deleting person:", error);

        if (error.response) {
          if (error.response.status === 404) {
            alertify.warning("الشخص غير موجود أو تم حذفه مسبقاً");
            await fetchOrphans();
          } else if (error.response.status === 403) {
            alertify.error("ليس لديك صلاحية لحذف هذا الشخص");
          } else if (error.response.status === 409) {
            alertify.error("لا يمكن حذف هذا الشخص لأنه مرتبط ببيانات أخرى");
          } else {
            const errorMessage =
              error.response.data.message || error.response.statusText;
            alertify.error(`حدث خطأ أثناء حذف الشخص: ${errorMessage}`);
          }
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء حذف الشخص");
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
  return new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const printContent = () => {
  alertify.message("جاري تحضير الطباعة...");

  const printContent = document.getElementById("printableContent").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>طباعة جدول الأيتام</title>
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

onMounted(fetchOrphans);
</script>

<style scoped>
.persons-table {
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

.btn-danger.expandable-action-btn:hover {
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
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

  .persons-table {
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
