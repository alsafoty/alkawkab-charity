<template>
  <div
    class="persons-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
    ref="printArea"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold">جدول الأرامل</h2>
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

        <!-- Bulk Delete Button -->
        <button
          @click="deleteSelected"
          class="btn btn-danger expandable-btn"
          :disabled="selectedWidows.length === 0"
          v-if="selectedWidows.length > 0"
        >
          <i class="bi bi-trash icon"></i>
          <span class="btn-text">حذف المحدد ({{ selectedWidows.length }})</span>
        </button>
      </div>

      <div class="flex-grow-1 mx-3 no-print">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث بالاسم أو الرقم الوطني أو المستوى التعليمي..."
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
      <p class="mt-2 text-muted">جاري تحميل بيانات الأرامل...</p>
    </div>

    <div
      v-else
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
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
            <th>الجنس</th>
            <th>الاسم الكامل</th>
            <th>رقم الهاتف</th>
            <th>المستوى التعليمي</th>
            <th class="no-print">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredWidows" :key="person.id">
            <td class="no-print">
              <input
                type="checkbox"
                :checked="isSelected(person.id)"
                @change="toggleSelection(person.id)"
                class="form-check-input"
                style="cursor: pointer"
              />
            </td>
            <td>{{ person.id }}</td>
            <td>{{ person.gender }}</td>
            <td>
              {{ person.firstName }} {{ person.secondName }}
              {{ person.thirdName }} {{ person.lastName }}
            </td>
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
      v-if="!loading && !filteredWidows.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أرامل مطابقون للبحث المحدد
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تقرير الأرامل</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <table class="table table-bordered print-table">
        <thead class="table-dark">
          <tr>
            <th>الرقم الوطني</th>
            <th>الاسم الكامل</th>
            <th>الجنس</th>
            <th>رقم الهاتف</th>
            <th>المستوى التعليمي</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredWidows" :key="person.id">
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
          إجمالي عدد الأرامل: {{ filteredWidows.length }}
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
const getAuthToken = () => localStorage.getItem("token") || "";

const widows = ref([]);
const searchQuery = ref("");
const sortBy = ref("name"); // الترتيب الافتراضي حسب الاسم
const loading = ref(false);
const isDeleting = ref(false);
const printArea = ref(null);
const selectedWidows = ref([]);

// Computed property for select all state
const allSelected = computed({
  get: () =>
    filteredWidows.value.length > 0 &&
    selectedWidows.value.length === filteredWidows.value.length,
  set: (value) => {
    selectedWidows.value = value ? filteredWidows.value.map((p) => p.id) : [];
  },
});

// Check if a widow is selected
const isSelected = (id) => selectedWidows.value.includes(id);

// Toggle selection of a widow
const toggleSelection = (id) => {
  const index = selectedWidows.value.indexOf(id);
  if (index > -1) {
    selectedWidows.value.splice(index, 1);
  } else {
    selectedWidows.value.push(id);
  }
};

// Fetch widows data
const fetchWidows = async () => {
  const token = getAuthToken();
  if (!token) {
    alertify.warning("يرجى تسجيل الدخول أولاً للوصول إلى بيانات الأرامل");
    router.push("/admin");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/Person`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Filter only widows
    widows.value = (response.data || []).filter((person) => person.isWidow === true);
  } catch (error) {
    console.error("Error fetching widows:", error);

    if (error.response?.status === 401) {
      alertify.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      router.push("/admin");
    } else if (error.response) {
      const errorMessage =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data?.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات الأرامل: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات الأرامل");
    }
  } finally {
    loading.value = false;
  }
};

// Enhanced search functionality with sorting
const filteredWidows = computed(() => {
  let result = widows.value;

  // تطبيق البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();

    result = result.filter((person) => {
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
const viewDetails = (id) => {
  router.push(`/view-person/${id}`);
};

const editPerson = (id) => {
  router.push(`/edit-person/${id}`);
};

// Bulk delete selected widows
const deleteSelected = async () => {
  if (selectedWidows.value.length === 0) {
    alertify.warning("الرجاء اختيار عنصر واحد على الأقل للحذف");
    return;
  }

  const token = getAuthToken();
  if (!token) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    router.push("/admin");
    return;
  }

  if (isDeleting.value) {
    alertify.warning("جاري تنفيذ عملية حذف، يرجى الانتظار");
    return;
  }

  const count = selectedWidows.value.length;
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${count} عنصر؟`,
    async function () {
      isDeleting.value = true;
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedWidows.value) {
        try {
          await axios.delete(`${API_BASE_URL}/Person/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          successCount++;
        } catch (error) {
          console.error(`Error deleting person ${id}:`, error);
          failCount++;
        }
      }

      await fetchWidows();
      selectedWidows.value = [];
      isDeleting.value = false;

      if (successCount > 0) {
        alertify.success(`تم حذف ${successCount} عنصر بنجاح`);
      }
      if (failCount > 0) {
        alertify.error(`فشل حذف ${failCount} عنصر`);
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

const deletePerson = async (id) => {
  if (!id || id === "") {
    alertify.error("معرف الشخص غير صحيح");
    return;
  }

  const token = getAuthToken();
  if (!token) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    router.push("/admin");
    return;
  }

  if (isDeleting.value) {
    alertify.warning("يتم حذف شخص آخر، يرجى الانتظار");
    return;
  }

  const person = widows.value.find((p) => p.id === id);
  const personName = person
    ? `${person.firstName} ${person.lastName}`
    : `الشخص رقم ${id}`;

  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${personName}؟`,
    async function () {
      isDeleting.value = true;

      try {
        await axios.delete(`${API_BASE_URL}/Person/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const index = widows.value.findIndex((p) => p.id === id);
        if (index > -1) {
          widows.value.splice(index, 1);
        }

        alertify.success(`تم حذف ${personName} بنجاح`);
      } catch (error) {
        console.error("Error deleting person:", error);

        if (error.response) {
          if (error.response.status === 404) {
            alertify.warning("الشخص غير موجود أو تم حذفه مسبقاً");
            await fetchWidows();
          } else if (error.response.status === 403) {
            alertify.error("ليس لديك صلاحية لحذف هذا الشخص");
          } else if (error.response.status === 409) {
            alertify.error("لا يمكن حذف هذا الشخص لأنه مرتبط ببيانات أخرى");
          } else {
            const errorMessage =
              typeof error.response.data === "string" && error.response.data.trim()
                ? error.response.data
                : (error.response.data?.message || "حدث خطأ أثناء معالجة الطلب");
            alertify.error(`فشل الحذف: ${errorMessage}`);
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
      <title>طباعة جدول الأرامل</title>
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

onMounted(fetchWidows);
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
