<template>
  <div
    class="persons-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
  >
    <h2 class="text-center mb-4 fw-bold">جدول الأفراد</h2>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <!-- زر إضافة شخص جديد مع تأثير التوسع -->
        <router-link to="/add-person" class="btn btn-success expandable-btn">
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة شخص جديد</span>
        </router-link>
      </div>

      <div class="flex-grow-1 mx-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث بالاسم أو الرقم التعريفي أو المستوى التعليمي..."
        />
      </div>
    </div>

    <div
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
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in filteredPersons" :key="person.id">
            <td>{{ person.id }}</td>
            <td>{{ person.gender }}</td>
            <td>{{ person.firstName }}</td>
            <td>{{ person.secondName }}</td>
            <td>{{ person.thirdName }}</td>
            <td>{{ person.lastName }}</td>
            <td>{{ person.phoneNumber }}</td>
            <td>{{ person.educationalLevel }}</td>
            <td class="d-flex gap-2 justify-content-center">
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
      v-if="!filteredPersons.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أشخاص مطابقون للبحث المحدد
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API_BASE_URL = "https://charityapp.runasp.net/api";
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const persons = ref([]);
const searchQuery = ref("");

// Fetch persons data
const fetchPersons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Person`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    persons.value = response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    alert("حدث خطأ أثناء جلب بيانات الأشخاص");
  }
};

// Enhanced search functionality - searches across multiple fields
const filteredPersons = computed(() => {
  if (!searchQuery.value) {
    return persons.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return persons.value.filter((person) => {
    // Search in all name fields
    const fullName =
      `${person.firstName} ${person.secondName} ${person.thirdName} ${person.lastName}`.toLowerCase();

    // Search criteria
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
  if (confirm("هل أنت متأكد من عملية الحذف؟")) {
    try {
      await axios.delete(`${API_BASE_URL}/Person/${id}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      // Refresh data after deletion
      await fetchPersons();
      alert(`تم حذف الشخص رقم: ${id} بنجاح`);
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("حدث خطأ أثناء حذف الشخص");
    }
  }
};

// Initialize data on component mount
onMounted(fetchPersons);
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
</style>
