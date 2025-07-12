<template>
  <div
    class="families-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg text-center"
    dir="rtl"
  >
    <h2 class="text-center mb-4 fw-bold">جدول الأفراد</h2>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link to="/add-person" class="btn btn-success custom-btn">
        <i class="bi bi-plus-circle me-1"></i>
        إضافة شخص جديد
      </router-link>

      <div class="flex-grow-1 mx-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث باسم الشخص..."
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
            <td class="d-flex gap-3">
              <button
                @click="viewDetails(person.id)"
                class="btn btn-primary btn-sm me-1 custom-btn"
              >
                عرض
              </button>
              <button
                @click="editPerson(person.id)"
                class="btn btn-warning btn-sm me-1 custom-btn"
              >
                تعديل
              </button>
              <button
                @click="deletePerson(person.id)"
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
      v-if="!filteredPersons.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد معلومات مطابقة!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const persons = ref([]);

// Set up interceptor
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
const AUTH_TOKEN = localStorage.getItem("token");
axios
  .get("https://charityapp.runasp.net/api/Person", {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  })
  .then((res) => {
    persons.value = res.data;
  })
  .catch((error) => console.log(error));

const searchQuery = ref("");

const filteredPersons = computed(() => {
  return persons.value.filter((person) =>
    person.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusClass = (status) => {
  return {
    "text-danger fw-bold": status === "بحاجة لمساعدة",
    "text-success fw-bold": status === "تمت المساعدة",
  };
};

const viewDetails = (id) => {
  router.push(`/view-person/${id}`);
};

const editPerson = (id) => {
  router.push(`/edit-person/${id}`);
};

const deletePerson = (id) => {
  if (confirm("هل أنت متأكد من عملية الحذف؟")) {
    axios
      .delete(`https://charityapp.runasp.net/api/Person/${id}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.log(error));

    // Refresh the current page
    router.replace({ path: "/redirect" }).then(() => {
      router.replace({ path: "/individual" });
    });
    alert(`تم حذف الشخص رقم: ${id}`);
  }
};
</script>

<style scoped>
.families-table {
  font-family: "Tajawal", sans-serif;
}

/* Theme-aligned table header */
.table-header {
  background-color: #42b983 !important;
}

/* Align table text to right */
.table th,
.table td {
  text-align: right;
  vertical-align: middle;
}

/* Input styling aligned with login theme */
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

/* Button styling matching login page */
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

/* Placeholder RTL fix */
.form-control::placeholder {
  text-align: right;
}
</style>
