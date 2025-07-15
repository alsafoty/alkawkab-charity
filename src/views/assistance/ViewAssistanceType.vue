<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل نوع المساعدة</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Basic Assistance Type Information -->
        <div class="info-section mb-4">
          <h4 class="section-title mb-3">معلومات نوع المساعدة الأساسية</h4>
          <div class="info-grid">
            <div class="info-item">
              <strong>رقم نوع المساعدة:</strong>
              <span>{{ assistanceTypeData.assistanceTypeId }}</span>
            </div>
            <div class="info-item">
              <strong>اسم نوع المساعدة:</strong>
              <span>{{ assistanceTypeData.assistanceTypeName }}</span>
            </div>
            <div class="info-item">
              <strong>طبيعة المساعدة:</strong>
              <span
                class="badge"
                :class="
                  assistanceTypeData.isFinancial ? 'bg-success' : 'bg-info'
                "
              >
                {{ assistanceTypeData.isFinancial ? "مالية" : "عينية" }}
              </span>
            </div>
            <div class="info-item" v-if="assistanceTypeData.assistanceValue">
              <strong>قيمة المساعدة:</strong>
              <span>{{ assistanceTypeData.assistanceValue }} دينار</span>
            </div>
          </div>
        </div>

        <!-- Related Assistances -->
        <div
          class="info-section mb-4"
          v-if="relatedAssistances && relatedAssistances.length > 0"
        >
          <h4 class="section-title mb-3">
            المساعدات المرتبطة بهذا النوع ({{ relatedAssistances.length }})
          </h4>

          <!-- Loading state for assistances -->
          <div v-if="loadingAssistances" class="text-center py-3">
            <div class="spinner-border text-success" role="status">
              <span class="visually-hidden"
                >جاري تحميل المساعدات المرتبطة...</span
              >
            </div>
          </div>

          <!-- Assistances table -->
          <div
            v-else
            class="table-responsive rounded-2 shadow-sm border border-light-subtle"
          >
            <table class="table table-striped table-hover">
              <thead class="table-header text-white">
                <tr>
                  <th>رقم المساعدة</th>
                  <th>المستفيد</th>
                  <th>عدد المساعدات</th>
                  <th>ملاحظات</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="assistance in relatedAssistances"
                  :key="assistance.assistanceId"
                >
                  <td>{{ assistance.assistanceId }}</td>
                  <td>
                    {{ getBeneficiaryName(assistance) }}
                  </td>
                  <td>
                    <span class="badge bg-success">{{
                      assistance.numberOfAssistance
                    }}</span>
                  </td>
                  <td>{{ assistance.note || "-" }}</td>
                  <td>
                    <button
                      @click="viewAssistanceDetails(assistance.assistanceId)"
                      class="btn btn-outline-primary btn-sm"
                      title="عرض تفاصيل المساعدة"
                    >
                      <i class="bi bi-eye me-1"></i>
                      عرض
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Statistics Section -->
        <div class="info-section mb-4" v-if="statistics">
          <h4 class="section-title mb-3">إحصائيات</h4>
          <div class="info-grid">
            <div class="info-item">
              <strong>إجمالي المستفيدين:</strong>
              <span class="badge bg-primary">{{
                statistics.totalAssistances
              }}</span>
            </div>
            <div class="info-item">
              <strong>إجمالي عدد المساعدات:</strong>
              <span class="badge bg-info">{{ statistics.totalCount }}</span>
            </div>
            <div
              class="info-item"
              v-if="
                assistanceTypeData.isFinancial &&
                assistanceTypeData.assistanceValue
              "
            >
              <strong>إجمالي القيمة المالية:</strong>
              <span class="badge bg-success"
                >{{ statistics.totalValue }} دينار</span
              >
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="
            !loadingAssistances &&
            (!relatedAssistances || relatedAssistances.length === 0)
          "
          class="info-section mb-4"
        >
          <h4 class="section-title mb-3">المساعدات المرتبطة</h4>
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle me-2"></i>
            لا توجد مساعدات مُسجلة لهذا النوع حتى الآن.
          </div>
        </div>

        <!-- Back Button -->
        <div class="text-center mt-4">
          <button @click="goBack" class="btn btn-secondary px-4 no-print">
            <i class="bi bi-arrow-right me-1"></i>
            عودة
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

const API_BASE_URL = "https://charityapp.runasp.net/api";
const route = useRoute();
const router = useRouter();
const assistanceTypeData = ref({});
const relatedAssistances = ref([]);
const families = ref([]);
const persons = ref([]);
const loadingAssistances = ref(false);
const AUTH_TOKEN = localStorage.getItem("token");
const printArea = ref(null);

// حساب الإحصائيات
const statistics = computed(() => {
  if (!relatedAssistances.value || relatedAssistances.value.length === 0) {
    return null;
  }

  const totalAssistances = relatedAssistances.value.length;
  const totalCount = relatedAssistances.value.reduce(
    (sum, assistance) => sum + assistance.numberOfAssistance,
    0
  );
  const totalValue =
    assistanceTypeData.value.isFinancial &&
    assistanceTypeData.value.assistanceValue
      ? totalCount * assistanceTypeData.value.assistanceValue
      : 0;

  return {
    totalAssistances,
    totalCount,
    totalValue,
  };
});

// دالة للحصول على اسم المستفيد
const getBeneficiaryName = (assistance) => {
  if (assistance.personId) {
    const person = persons.value.find((p) => p.id === assistance.personId);
    return person ? `${person.firstName} ${person.lastName}` : "غير معروف";
  } else if (assistance.familyId) {
    const family = families.value.find(
      (f) => f.familyId === assistance.familyId
    );
    return family ? `عائلة ${family.name}` : "عائلة غير معروفة";
  }
  return "غير محدد";
};

// دالة لعرض تفاصيل المساعدة
const viewAssistanceDetails = (assistanceId) => {
  router.push(`/view-assistance/${assistanceId}`);
};

// جلب تفاصيل نوع المساعدة
const fetchAssistanceTypeDetails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/AssistanceType/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    assistanceTypeData.value = response.data;
    console.log("Assistance Type details:", response.data);
  } catch (error) {
    console.error("Error fetching assistance type details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات نوع المساعدة");
  }
};

// جلب المساعدات المرتبطة بهذا النوع
const fetchRelatedAssistances = async () => {
  loadingAssistances.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/Assistance`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // فلترة المساعدات حسب نوع المساعدة
    relatedAssistances.value = response.data.filter(
      (assistance) => assistance.assistanceTypeId === parseInt(route.params.id)
    );

    console.log("Related assistances:", relatedAssistances.value);
  } catch (error) {
    console.error("Error fetching related assistances:", error);
    relatedAssistances.value = [];
  } finally {
    loadingAssistances.value = false;
  }
};

// جلب العائلات من الـ API
const fetchFamilies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Family`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    families.value = response.data;
  } catch (error) {
    console.error("Error fetching families:", error);
  }
};

// جلب الأشخاص من الـ API
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
  }
};

onMounted(async () => {
  // جلب جميع البيانات المطلوبة
  await Promise.all([
    fetchAssistanceTypeDetails(),
    fetchFamilies(),
    fetchPersons(),
    fetchRelatedAssistances(),
  ]);
});

const printContent = () => {
  window.print();
};

const goBack = () => {
  router.push("/assistance-types");
};
</script>

<style scoped>
.section-title {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item strong {
  color: #42b983;
  display: block;
  margin-bottom: 0.5rem;
}

/* تنسيق جدول المساعدات */
.table-header {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-responsive {
  border-radius: 8px;
}

.badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
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

  .card {
    border: none !important;
    box-shadow: none !important;
  }

  .card-header {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-section {
    page-break-inside: avoid;
    margin-bottom: 1rem;
  }

  .info-item strong {
    color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .table-header {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
