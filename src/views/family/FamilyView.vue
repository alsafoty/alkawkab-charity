<template>
  <div
    class="families-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
    ref="printArea"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold">جدول الأسر</h2>
      <button class="btn btn-success no-print" @click="printContent">
        <i class="bi bi-printer me-1"></i>
        طباعة
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2 no-print">
        <!-- زر إضافة عائلة مع تأثير التوسع -->
        <router-link to="/add-family" class="btn btn-success expandable-btn">
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة أسرة</span>
        </router-link>
      </div>

      <div class="flex-grow-1 mx-3 no-print">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث باسم رب الأسرة أو رقم الأسرة..."
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
          <option value="familyId">ترتيب حسب: تاريخ الإضافة</option>
          <option value="name">ترتيب حسب: الاسم</option>
          <option value="members">ترتيب حسب: عدد الأفراد</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2 text-muted">جاري تحميل بيانات الأسر...</p>
    </div>

    <div
      v-else
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>رقم الأسرة</th>
            <th>رب الأسرة</th>
            <th>الرقم الوطني</th>
            <th>رقم الهاتف</th>
            <th>عدد الأفراد</th>
            <th>حالة المنزل</th>
            <th class="no-print">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="family in filteredFamilies" :key="family.familyId">
            <td>{{ family.familyId }}</td>
            <td>{{ getHeadOfFamilyName(family) }}</td>
            <td>{{ getHeadOfFamilyId(family) }}</td>
            <td>{{ getHeadOfFamilyPhone(family) }}</td>
            <td>
              <span class="badge bg-success">
                {{ family.numberOfFamilyMembers || 0 }}
              </span>
            </td>
            <td>{{ family.isHouseOwned ? "ملك" : "إيجار" }}</td>
            <td class="d-flex gap-2 justify-content-center no-print">
              <button
                @click="viewDetails(family.familyId)"
                class="btn btn-primary btn-sm expandable-action-btn"
                title="عرض التفاصيل"
              >
                <i class="bi bi-eye icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="editFamily(family.familyId)"
                class="btn btn-warning btn-sm expandable-action-btn"
                title="تعديل"
              >
                <i class="bi bi-pencil icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="deleteFamily(family.familyId)"
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
      v-if="!loading && !filteredFamilies.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أسر مطابقة للبحث المحدد
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تقرير الأسر</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <table class="table table-bordered print-table">
        <thead class="table-dark">
          <tr>
            <th>رقم الأسرة</th>
            <th>رب الأسرة</th>
            <th>الرقم الوطني</th>
            <th>رقم الهاتف</th>
            <th>عدد الأفراد</th>
            <th>حالة المنزل</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="family in filteredFamilies" :key="family.familyId">
            <td>{{ family.familyId }}</td>
            <td>{{ getHeadOfFamilyName(family) }}</td>
            <td>{{ getHeadOfFamilyId(family) }}</td>
            <td>{{ getHeadOfFamilyPhone(family) }}</td>
            <td>{{ family.numberOfFamilyMembers || 0 }}</td>
            <td>{{ family.isHouseOwned ? "ملك" : "إيجار" }}</td>
          </tr>
        </tbody>
      </table>

      <div class="print-footer mt-4">
        <p class="text-center text-muted">
          إجمالي عدد الأسر: {{ filteredFamilies.length }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const families = ref([]);
const familyHeadsData = ref({}); // تخزين بيانات رؤساء الأسر
const searchQuery = ref("");
const sortBy = ref("familyId"); // الترتيب الافتراضي حسب رقم الأسرة
const loading = ref(false);
const AUTH_TOKEN = localStorage.getItem("token");
const printArea = ref(null);

const filteredFamilies = computed(() => {
  let result = families.value;

  // تطبيق البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((family) => {
      const headName = getHeadOfFamilyName(family).toLowerCase();
      return (
        headName.includes(query) ||
        family.name.toLowerCase().includes(query) ||
        family.familyId.toString().includes(query)
      );
    });
  }

  // تطبيق الترتيب
  const sorted = [...result];
  if (sortBy.value === "familyId") {
    sorted.sort((a, b) => a.familyId - b.familyId);
  } else if (sortBy.value === "name") {
    sorted.sort((a, b) => {
      const nameA = getHeadOfFamilyName(a).toLowerCase();
      const nameB = getHeadOfFamilyName(b).toLowerCase();
      return nameA.localeCompare(nameB, "ar");
    });
  } else if (sortBy.value === "members") {
    sorted.sort(
      (a, b) => (b.numberOfFamilyMembers || 0) - (a.numberOfFamilyMembers || 0),
    );
  }

  return sorted;
});

// دالة لجلب بيانات شخص واحد
const fetchPersonById = async (personId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Person/${personId}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching person ${personId}:`, error);
    return null;
  }
};

// دالة لجلب بيانات رؤساء الأسر
const fetchFamilyHeadsData = async () => {
  const promises = families.value.map(async (family) => {
    if (family.familyMembers && family.familyMembers.length > 0) {
      const headId = family.familyMembers[0]; // أول عضو هو رب الأسرة
      const headData = await fetchPersonById(headId);
      if (headData) {
        familyHeadsData.value[family.familyId] = headData;
      }
    }
  });

  await Promise.all(promises);
};

const getHeadOfFamilyId = (family) => {
  const headData = familyHeadsData.value[family.familyId];
  return headData?.id || "-";
};

const getHeadOfFamilyPhone = (family) => {
  const headData = familyHeadsData.value[family.familyId];
  return headData?.phoneNumber || "-";
};

const getHeadOfFamilyName = (family) => {
  const headData = familyHeadsData.value[family.familyId];
  if (headData) {
    return `${headData.firstName} ${headData.lastName}`;
  }
  return family.name || "-";
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
      <title>طباعة جدول الأسر</title>
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

const fetchFamilies = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/Family`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    families.value = response.data;
    console.log("Families:", response.data);

    // جلب بيانات رؤساء الأسر
    await fetchFamilyHeadsData();
  } catch (error) {
    console.error("Error fetching families:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الأسر");
  } finally {
    loading.value = false;
  }
};

const viewDetails = (id) => {
  router.push(`/view-family/${id}`);
};

const editFamily = (id) => {
  router.push(`/edit-family/${id}`);
};

const deleteFamily = async (id) => {
  // Create a custom confirmation dialog using AlertifyJS
  alertify.confirm(
    "تأكيد الحذف",
    "هل أنت متأكد من عملية الحذف؟",
    async function () {
      // User clicked OK
      try {

        await axios.delete(`${API_BASE_URL}/Family/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        alertify.success(`تم حذف العائلة رقم: ${id} بنجاح`);
        // إعادة تحميل البيانات بدلاً من إعادة التوجيه
        await fetchFamilies();
      } catch (error) {
        console.error(
          "خطأ أثناء الحذف:",
          error.response?.data || error.message,
        );
        alertify.error("حدث خطأ أثناء حذف العائلة");
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

// Initialize data on component mount
onMounted(fetchFamilies);
</script>

<style scoped>
.families-table {
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

/* تأثيرات التوسع للأزرار الرئيسية */
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

/* تنسيق خاص لأزرار الإجراءات */
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

/* Placeholder RTL fix */
.form-control::placeholder {
  text-align: right;
}

/* تحسينات للشاشات الصغيرة */
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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.badge {
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
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

  .families-table {
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
