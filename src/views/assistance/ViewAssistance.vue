<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل المساعدة</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Basic Assistance Information -->
        <div class="info-section mb-4">
          <h4 class="section-title mb-3">معلومات المساعدة الأساسية</h4>
          <div class="info-grid">
            <div class="info-item">
              <strong>رقم المساعدة:</strong>
              <span>{{ assistanceData.assistanceId }}</span>
            </div>
            <div class="info-item">
              <strong>عدد المساعدات:</strong>
              <span>{{ assistanceData.numberOfAssistance }}</span>
            </div>
            <div class="info-item">
              <strong>نوع المساعدة:</strong>
              <span>{{
                getAssistanceTypeName(assistanceData.assistanceTypeId)
              }}</span>
            </div>
            <div
              class="info-item"
              v-if="assistanceTypeDetails?.assistanceValue"
            >
              <strong>القيمة:</strong>
              <span>{{ assistanceTypeDetails.assistanceValue }} دينار</span>
            </div>
            <div class="info-item" v-if="assistanceTypeDetails">
              <strong>طبيعة المساعدة:</strong>
              <span>{{
                assistanceTypeDetails.isFinancial ? "مالية" : "عينية"
              }}</span>
            </div>
            <div class="info-item">
              <strong>حالة الاستلام:</strong>
              <span>{{
                assistanceData.received ? "تم استلامها" : "لم يتم استلامها"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Recipient Information -->
        <div class="info-section mb-4">
          <h4 class="section-title mb-3">معلومات المستفيد</h4>
          <div class="info-grid">
            <div class="info-item" v-if="assistanceData.familyId">
              <strong>العائلة:</strong>
              <div class="d-flex align-items-center justify-content-between">
                <span>{{ getFamilyName(assistanceData.familyId) }}</span>
                <button
                  @click="viewFamilyDetails(assistanceData.familyId)"
                  class="btn btn-outline-info btn-sm beneficiary-btn no-print"
                  title="عرض معلومات العائلة"
                >
                  <i class="bi bi-info-circle me-1"></i>
                  عرض التفاصيل
                </button>
              </div>
            </div>
            <div class="info-item">
              <strong>المستفيد:</strong>
              <div class="d-flex align-items-center justify-content-between">
                <span>{{
                  getPersonName(assistanceData.personId) ||
                  (assistanceData.familyId ? "العائلة بأكملها" : "غير محدد")
                }}</span>
                <button
                  v-if="assistanceData.personId"
                  @click="viewPersonDetails(assistanceData.personId)"
                  class="btn btn-outline-info btn-sm beneficiary-btn no-print"
                  title="عرض معلومات الشخص"
                >
                  <i class="bi bi-person-circle me-1"></i>
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="info-section mb-4" v-if="assistanceData.note">
          <h4 class="section-title mb-3">معلومات إضافية</h4>
          <div class="info-item">
            <strong>ملاحظات:</strong>
            <p class="mt-2">{{ assistanceData.note }}</p>
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

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = "https://charityapp.runasp.net/api";
const route = useRoute();
const router = useRouter();
const assistanceData = ref({});
const assistanceTypes = ref([]);
const families = ref([]);
const persons = ref([]);
const AUTH_TOKEN = localStorage.getItem("token");
const printArea = ref(null);

// دالة للحصول على اسم نوع المساعدة
const getAssistanceTypeName = (typeId) => {
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === typeId
  );
  return assistanceType ? assistanceType.assistanceTypeName : "غير معروف";
};

// دالة للحصول على تفاصيل نوع المساعدة
const assistanceTypeDetails = computed(() => {
  return assistanceTypes.value.find(
    (type) => type.assistanceTypeId === assistanceData.value.assistanceTypeId
  );
});

// دالة للحصول على اسم العائلة
const getFamilyName = (familyId) => {
  if (!familyId || familyId === 0) return "-";
  const family = families.value.find((f) => f.familyId === familyId);
  return family ? family.name : "غير معروف";
};

// دالة للحصول على اسم الشخص
const getPersonName = (personId) => {
  if (!personId || personId === "") return "";
  const person = persons.value.find((p) => p.id === personId);
  return person ? `${person.firstName} ${person.lastName}` : "غير معروف";
};

// جلب أنواع المساعدات من الـ API
const fetchAssistanceTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/AssistanceType`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    assistanceTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching assistance types:", error);
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

// جلب تفاصيل المساعدة
const fetchAssistanceDetails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Assistance/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    assistanceData.value = response.data;
    console.log("Assistance details:", response.data);
  } catch (error) {
    console.error("Error fetching assistance details:", error);
    alertify.error(
      " يرجى إعادة تسجيل الدخول، حدث خطأ أثناء جلب  بيانات المساعدة"
    );
  }
};

// دالة عرض تفاصيل العائلة
const viewFamilyDetails = (familyId) => {
  router.push(`/view-family/${familyId}`);
};

// دالة عرض تفاصيل الشخص
const viewPersonDetails = (personId) => {
  router.push(`/view-person/${personId}`);
};

onMounted(async () => {
  // جلب جميع البيانات المطلوبة
  await Promise.all([
    fetchAssistanceTypes(),
    fetchFamilies(),
    fetchPersons(),
    fetchAssistanceDetails(),
  ]);
});

const printContent = () => {
  window.print();
};

const goBack = () => {
  router.push("/assistance");
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

/* تنسيق أزرار عرض معلومات المستفيد */
.beneficiary-btn {
  border-color: #17a2b8;
  color: #17a2b8;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.beneficiary-btn:hover {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(23, 162, 184, 0.3);
}

.beneficiary-btn i {
  font-size: 0.9rem;
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
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
