<template>
  <div
    class="assistance-type-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg text-center"
    dir="rtl"
  >
    <h2 class="text-center mb-4 fw-bold">أنواع المساعدات</h2>

    <!-- Add and Search Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link to="/add-assistance-type" class="btn btn-success">
        <i class="bi bi-plus-circle me-1"></i>
        إضافة نوع مساعدة
      </router-link>

      <div class="flex-grow-1 me-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث في أنواع المساعدات..."
        />
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>نوع المساعدة</th>
            <th>نوع مالي</th>
            <th>القيمة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in filteredTypes" :key="type.assistanceTypeId">
            <td>{{ type.assistanceTypeName }}</td>
            <td>
              <i
                :class="
                  type.isFinancial
                    ? 'bi bi-check-circle-fill text-success'
                    : 'bi bi-x-circle-fill text-danger'
                "
              ></i>
            </td>
            <td>{{ type.assistanceValue || "-" }}</td>
            <td class="d-flex gap-2 justify-content-center">
              <button
                @click="viewDetails(type.assistanceTypeId)"
                class="btn btn-primary btn-sm custom-btn"
                title="عرض تفاصيل نوع المساعدة"
              >
                عرض
              </button>
              <router-link
                :to="`/edit-assistance-type/${type.assistanceTypeId}`"
                class="btn btn-warning btn-sm custom-btn"
              >
                تعديل
              </router-link>
              <button
                @click="deleteType(type.assistanceTypeId)"
                class="btn btn-danger btn-sm custom-btn"
                :disabled="type.assistances && type.assistances.length > 0"
                :title="
                  type.assistances && type.assistances.length > 0
                    ? 'لا يمكن حذف هذا النوع لوجود مساعدات مرتبطة به'
                    : 'حذف نوع المساعدة'
                "
              >
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!filteredTypes.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد أنواع مساعدات مطابقة للبحث
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const AUTH_TOKEN = localStorage.getItem("token");
const router = useRouter();

// Data
const assistanceTypes = ref([]);
const searchQuery = ref("");

// Computed
const filteredTypes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return assistanceTypes.value.filter(
    (type) =>
      type.assistanceTypeName.toLowerCase().includes(query) ||
      (type.assistanceValue && type.assistanceValue.toString().includes(query)),
  );
});

// Methods
const fetchAssistanceTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/AssistanceType`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    assistanceTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching assistance types:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب أنواع المساعدات: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب أنواع المساعدات");
    }
  }
};

const viewDetails = (assistanceTypeId) => {
  router.push(`/view-assistance-type/${assistanceTypeId}`);
};

const deleteType = async (id) => {
  // Get the assistance type name for better confirmation message
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === id,
  );
  const typeName = assistanceType
    ? assistanceType.assistanceTypeName
    : "هذا النوع";

  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف "${typeName}"؟`,
    async function () {
      // User clicked OK
      try {
        await axios.delete(`${API_BASE_URL}/AssistanceType/${id}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });

        await fetchAssistanceTypes();
        alertify.success(`تم حذف "${typeName}" بنجاح`);
      } catch (error) {
        console.error("Error deleting assistance type:", error);

        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء حذف نوع المساعدة: ${errorMessage}`);
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء حذف نوع المساعدة");
        }
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

// Lifecycle
onMounted(async () => {
  await fetchAssistanceTypes();
});
</script>

<style scoped>
.assistance-type-table {
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

.btn-primary {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-warning:hover,
.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0) !important;
}

.modal-header .btn-close {
  margin-right: auto;
  margin-left: 0;
}

.form-check-input {
  float: right !important;
  margin-left: 0.5rem !important;
  margin-right: -1.5rem !important;
}
</style>
