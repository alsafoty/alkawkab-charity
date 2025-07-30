<template>
  <div
    class="families-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button @click="goBack" class="btn btn-secondary expandable-btn">
        <i class="bi bi-arrow-right icon"></i>
        <span class="btn-text">عودة</span>
      </button>
      <h2 class="text-center flex-grow-1 mb-0 fw-bold">جدول العائلات</h2>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <!-- زر إضافة عائلة مع تأثير التوسع -->
        <router-link to="/add-family" class="btn btn-success expandable-btn">
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة عائلة</span>
        </router-link>
      </div>

      <div class="flex-grow-1 mx-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث باسم العائلة أو رقم العائلة..."
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-2 text-muted">جاري تحميل بيانات العائلات...</p>
    </div>

    <div
      v-else
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>رقم العائلة</th>
            <th>اسم العائلة</th>
            <th>عدد الأفراد</th>
            <th>حالة المنزل</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="family in filteredFamilies" :key="family.familyId">
            <td>{{ family.familyId }}</td>
            <td>{{ family.name }}</td>
            <td>
              <span class="badge bg-success">
                {{ getActualMemberCount(family) }}
              </span>
            </td>
            <td>{{ family.isHouseOwned ? "ملك" : "إيجار" }}</td>
            <td class="d-flex gap-2 justify-content-center">
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
      لا يوجد عائلات مطابقة للبحث المحدد
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

const goBack = () => {
  window.history.back();
};

const API_BASE_URL = "https://charityapp.runasp.net/api";
const router = useRouter();
const families = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const AUTH_TOKEN = localStorage.getItem("token");

// دالة لحساب العدد الحقيقي لأفراد العائلة
const getActualMemberCount = (family) => {
  if (family.familyMembers && Array.isArray(family.familyMembers)) {
    return family.familyMembers.length;
  }
  return 0;
};

const fetchFamilies = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/Family`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // جلب تفاصيل كل عائلة مع أعضائها
    const familiesWithMembers = await Promise.all(
      response.data.map(async (family) => {
        try {
          const detailResponse = await axios.get(
            `${API_BASE_URL}/Family/${family.familyId}`,
            {
              headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
              },
            }
          );
          return detailResponse.data;
        } catch (error) {
          console.error(
            `Error fetching details for family ${family.familyId}:`,
            error
          );
          // في حالة الخطأ، إرجاع البيانات الأساسية مع قائمة أعضاء فارغة
          return {
            ...family,
            familyMembers: [],
          };
        }
      })
    );

    families.value = familiesWithMembers;
    console.log("Families with members:", familiesWithMembers);
  } catch (error) {
    console.error("Error fetching families:", error);
    alertify.error(
      " يرجى إعادة تسجيل الدخول، حدث خطأ أثناء جلب  بيانات العائلات"
    );
  } finally {
    loading.value = false;
  }
};

// Enhanced search functionality - searches across multiple fields
const filteredFamilies = computed(() => {
  if (!searchQuery.value) {
    return families.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return families.value.filter((family) => {
    // Search criteria
    const matchesName = family.name?.toLowerCase().includes(query);
    const matchesId = family.familyId?.toString().includes(query);
    const matchesHouseStatus = family.isHouseOwned
      ? "ملك".includes(query)
      : "إيجار".includes(query);

    return matchesName || matchesId || matchesHouseStatus;
  });
});

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
        alertify.message("جاري حذف العائلة...");

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
          error.response?.data || error.message
        );
        alertify.error("حدث خطأ أثناء حذف العائلة");
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الحذف");
    }
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
  background-color: #6c757d; /* Adding solid background for secondary button */
  color: white;
}

/* Override for success button */
.btn-success.expandable-btn {
  background-color: #42b983;
  color: white;
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
  background-color: #5c636a; /* Bootstrap secondary hover */
}

.btn-success.expandable-btn:hover {
  background-color: #157347; /* Bootstrap success hover */
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
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.btn-warning.expandable-action-btn {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.btn-danger.expandable-action-btn {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-primary.expandable-action-btn:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
  transform: translateY(-1px);
}

.btn-warning.expandable-action-btn:hover {
  background-color: #ffca2c;
  border-color: #ffc720;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
  transform: translateY(-1px);
}

.btn-danger.expandable-action-btn:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
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
</style>
