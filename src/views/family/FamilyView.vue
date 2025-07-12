<template>
  <div
    class="families-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg text-center"
    dir="rtl"
  >
    <h2 class="text-center mb-4 fw-bold">جدول العائلات</h2>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link to="/add-family" class="btn btn-success">
        <i class="bi bi-plus-circle me-1"></i>
        إضافة عائلة
      </router-link>

      <div class="flex-grow-1 mx-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث باسم العائلة..."
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
                class="btn btn-primary btn-sm custom-btn"
              >
                عرض
              </button>
              <button
                @click="editFamily(family.familyId)"
                class="btn btn-warning btn-sm custom-btn"
              >
                تعديل
              </button>
              <button
                @click="deleteFamily(family.familyId)"
                class="btn btn-danger btn-sm custom-btn"
              >
                حذف
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
      لا يوجد عائلات مطابقة للبحث
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

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
    const response = await axios.get(
      "https://charityapp.runasp.net/api/Family",
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    // جلب تفاصيل كل عائلة مع أعضائها
    const familiesWithMembers = await Promise.all(
      response.data.map(async (family) => {
        try {
          const detailResponse = await axios.get(
            `https://charityapp.runasp.net/api/Family/${family.familyId}`,
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
    alert("حدث خطأ أثناء جلب بيانات العائلات");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFamilies);

const filteredFamilies = computed(() => {
  return families.value.filter((family) =>
    family.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const viewDetails = (id) => {
  router.push(`/view-family/${id}`);
};

const editFamily = (id) => {
  router.push(`/edit-family/${id}`);
};

const deleteFamily = async (id) => {
  if (confirm("هل أنت متأكد من عملية الحذف؟")) {
    try {
      console.log("ID to delete:", id);
      console.log("Token:", AUTH_TOKEN);

      const response = await axios.delete(
        `https://charityapp.runasp.net/api/Family/${id}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      console.log(response);
      alert(`تم حذف العائلة رقم: ${id}`);

      // إعادة تحميل البيانات بدلاً من إعادة التوجيه
      await fetchFamilies();
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error.response?.data || error.message);
      alert("حدث خطأ أثناء حذف العائلة");
    }
  }
};
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

.custom-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 0.25rem 0.6rem;
}

.btn-primary.custom-btn {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary.custom-btn:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-warning.custom-btn:hover,
.btn-danger.custom-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0) !important;
}

.form-control::placeholder {
  text-align: right;
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
