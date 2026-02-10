<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل الأسرة</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Basic Family Information -->
        <div class="info-section mb-4">
          <h4 class="section-title mb-3">معلومات رب الأسرة</h4>
          <div class="info-grid">
            <div class="info-item">
              <strong>الاسم الكامل:</strong>
              <span>{{ getHeadOfFamilyName() }}</span>
            </div>
            <div class="info-item">
              <strong>رقم الهاتف:</strong>
              <span>{{ getHeadOfFamilyPhone() }}</span>
            </div>
            <div class="info-item">
              <strong>الرقم الوطني:</strong>
              <span>{{ getHeadOfFamilyId() }}</span>
            </div>
            <div class="info-item">
              <strong>الوظيفة:</strong>
              <span>{{ getHeadOfFamilyJob() }}</span>
            </div>
            <div class="info-item">
              <strong>المستوى التعليمي:</strong>
              <span>{{ getHeadOfFamilyEducation() }}</span>
            </div>
            <div class="info-item">
              <strong>عدد أفراد الأسرة:</strong>
              <span>{{ familyData.numberOfFamilyMembers || 1 }}</span>
            </div>
            <div class="info-item">
              <strong>حالة المنزل:</strong>
              <span>{{ familyData.isHouseOwned ? "ملك" : "إيجار" }}</span>
            </div>
          </div>
        </div>

        <!-- Family Members (Hidden) -->
        <div class="info-section mb-4 no-print" style="display: none">
          <h4 class="section-title mb-3">
            أفراد الأسرة (المسجلين: {{ memberDetails.length }})
          </h4>

          <!-- Loading State -->
          <div v-if="loadingMembers" class="text-center py-4">
            <div class="spinner-border text-success" role="status">
              <span class="visually-hidden">جاري التحميل...</span>
            </div>
            <p class="mt-2 text-muted">جاري تحميل بيانات أعضاء العائلة...</p>
          </div>

          <!-- Members List -->
          <div
            class="members-list"
            v-else-if="memberDetails && memberDetails.length > 0"
          >
            <div class="row g-3">
              <div
                v-for="(member, index) in memberDetails"
                :key="member.id"
                class="col-md-6"
              >
                <div class="member-card p-3 border rounded-3 bg-light">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="member-info">
                      <h6 class="mb-1 text-success">
                        {{ member.firstName }} {{ member.secondName }}
                        {{ member.lastName }}
                      </h6>
                      <small class="text-muted">
                        <i class="bi bi-hash me-1"></i>
                        الرقم الوطني: {{ member.id }}
                      </small>
                      <div class="mt-1">
                        <small class="text-muted">
                          <i class="bi bi-telephone me-1"></i>
                          {{ member.phoneNumber || "غير متوفر" }}
                        </small>
                      </div>
                      <div class="mt-1">
                        <small class="text-muted">
                          <i class="bi bi-person-circle me-1"></i>
                          {{ member.gender }} | {{ member.job || "غير محدد" }}
                        </small>
                      </div>
                    </div>
                    <span class="badge bg-success rounded-pill fs-6">{{
                      index + 1
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-4">
            <div class="empty-state">
              <i
                class="bi bi-people-fill text-muted"
                style="font-size: 3rem"
              ></i>
              <p class="text-muted mt-2">لا توجد أعضاء مسجلين في هذه الأسرة</p>
              <small class="text-muted"
                >يمكن إضافة أعضاء من خلال نافذة إضافة شخص</small
              >
            </div>
          </div>

          <!-- Error State -->
          <div v-if="memberLoadError" class="alert alert-warning" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            حدث خطأ أثناء تحميل بعض بيانات الأعضاء. يرجى المحاولة مرة أخرى.
          </div>
        </div>

        <!-- قسم المساعدات المُستلمة المُحدّث -->
        <div
          class="info-section mb-4"
          v-if="assistanceData && assistanceData.length > 0"
        >
          <h4 class="section-title mb-3">المساعدات المُستلمة</h4>

          <!-- Loading state for assistances -->
          <div v-if="loadingAssistances" class="text-center py-3">
            <div class="spinner-border text-success" role="status">
              <span class="visually-hidden"
                >جاري تحميل بيانات المساعدات...</span
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
                  <th>نوع المساعدة</th>
                  <th>عدد المساعدات</th>
                  <th>المستفيد</th>
                  <th>ملاحظات</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="assistance in assistanceData"
                  :key="assistance.assistanceId"
                >
                  <td>{{ assistance.assistanceId }}</td>
                  <td>
                    {{ getAssistanceTypeName(assistance.assistanceTypeId) }}
                  </td>
                  <td>
                    <span class="badge bg-success">{{
                      assistance.numberOfAssistance
                    }}</span>
                  </td>
                  <td>
                    {{
                      getPersonName(assistance.personId) || "العائلة بأكملها"
                    }}
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

        <!-- رسالة في حالة عدم وجود مساعدات -->
        <div
          v-else-if="
            !loadingAssistances &&
            (!familyData.assistances || familyData.assistances.length === 0)
          "
          class="info-section mb-4"
        >
          <h4 class="section-title mb-3">المساعدات المُستلمة</h4>
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle me-2"></i>
            لا توجد مساعدات مُسجلة لهذه الأسرة حتى الآن.
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

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تفاصيل الأسرة</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <div class="print-section mb-3">
        <h4 class="section-title">معلومات رب الأسرة</h4>
        <table class="print-info-table-two-columns">
          <tr>
            <td><strong>الاسم الكامل:</strong></td>
            <td colspan="3">{{ getHeadOfFamilyName() }}</td>
          </tr>
          <tr>
            <td><strong>الرقم الوطني:</strong></td>
            <td>{{ getHeadOfFamilyId() }}</td>
            <td><strong>رقم الهاتف:</strong></td>
            <td>{{ getHeadOfFamilyPhone() }}</td>
          </tr>
          <tr>
            <td><strong>الوظيفة:</strong></td>
            <td>{{ getHeadOfFamilyJob() }}</td>
            <td><strong>المستوى التعليمي:</strong></td>
            <td>{{ getHeadOfFamilyEducation() }}</td>
          </tr>
          <tr>
            <td><strong>عدد أفراد الأسرة:</strong></td>
            <td>{{ familyData.numberOfFamilyMembers || 1 }}</td>
            <td><strong>حالة المنزل:</strong></td>
            <td>{{ familyData.isHouseOwned ? "ملك" : "إيجار" }}</td>
          </tr>
        </table>
      </div>

      <div
        v-if="assistanceData && assistanceData.length > 0"
        class="print-section mb-3"
      >
        <h4 class="section-title">المساعدات المُستلمة</h4>
        <table class="table table-bordered print-table">
          <thead>
            <tr>
              <th>رقم المساعدة</th>
              <th>نوع المساعدة</th>
              <th>عدد المساعدات</th>
              <th>المستفيد</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assistance in assistanceData"
              :key="assistance.assistanceId"
            >
              <td>{{ assistance.assistanceId }}</td>
              <td>{{ getAssistanceTypeName(assistance.assistanceTypeId) }}</td>
              <td>{{ assistance.numberOfAssistance }}</td>
              <td>
                {{ getPersonName(assistance.personId) || "العائلة بأكملها" }}
              </td>
              <td>{{ assistance.note || "-" }}</td>
            </tr>
          </tbody>
        </table>
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

const route = useRoute();
const router = useRouter();
const familyData = ref({});
const memberDetails = ref([]);
const assistanceData = ref([]);
const assistanceTypes = ref([]);
const loadingMembers = ref(false);
const loadingAssistances = ref(false);
const memberLoadError = ref(false);
const AUTH_TOKEN = localStorage.getItem("token");
const printArea = ref(null);

// دالة للحصول على اسم نوع المساعدة
const getAssistanceTypeName = (typeId) => {
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === typeId,
  );
  return assistanceType ? assistanceType.assistanceTypeName : "غير معروف";
};

// دالة للحصول على اسم الشخص
const getPersonName = (personId) => {
  if (!personId || personId === "") return "";
  const person = memberDetails.value.find((p) => p.id === personId);
  return person ? `${person.firstName} ${person.lastName}` : "غير معروف";
};

// دوال للحصول على معلومات رب الأسرة
const getHeadOfFamilyName = () => {
  if (memberDetails.value && memberDetails.value.length > 0) {
    const head = memberDetails.value[0];
    return `${head.firstName} ${head.secondName} ${head.thirdName} ${head.lastName}`;
  }
  return "-";
};

const getHeadOfFamilyPhone = () => {
  if (memberDetails.value && memberDetails.value.length > 0) {
    return memberDetails.value[0].phoneNumber || "-";
  }
  return "-";
};

const getHeadOfFamilyId = () => {
  if (memberDetails.value && memberDetails.value.length > 0) {
    return memberDetails.value[0].id || "-";
  }
  return "-";
};

const getHeadOfFamilyJob = () => {
  if (memberDetails.value && memberDetails.value.length > 0) {
    return memberDetails.value[0].job || "-";
  }
  return "-";
};

const getHeadOfFamilyEducation = () => {
  if (memberDetails.value && memberDetails.value.length > 0) {
    return memberDetails.value[0].educationalLevel || "-";
  }
  return "-";
};

// دالة لعرض تفاصيل المساعدة
const viewAssistanceDetails = (assistanceId) => {
  router.push(`/view-assistance/${assistanceId}`);
};

// دالة لجلب أنواع المساعدات
const fetchAssistanceTypes = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/AssistanceType`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    assistanceTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching assistance types:", error);
  }
};

// دالة لجلب تفاصيل شخص واحد باستخدام الرقم الوطني مباشرة
const fetchPersonDetailsByNationalId = async (personId) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person/${personId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching person with ID ${personId}:`, error);
    return null;
  }
};

// دالة لجلب بيانات المساعدة الواحدة
const fetchAssistanceData = async (assistanceId) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Assistance/${assistanceId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching assistance data for ${assistanceId}:`, error);
    return null;
  }
};

// دالة لجلب جميع المساعدات
const fetchAllAssistances = async () => {
  if (
    !familyData.value.assistances ||
    familyData.value.assistances.length === 0
  ) {
    assistanceData.value = [];
    return;
  }

  loadingAssistances.value = true;
  try {
    const assistancePromises = familyData.value.assistances.map(
      (assistanceId) => fetchAssistanceData(assistanceId),
    );

    const results = await Promise.allSettled(assistancePromises);

    assistanceData.value = results
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);

    console.log("Loaded family assistances:", assistanceData.value);
  } catch (error) {
    console.error("Error fetching family assistances:", error);
    assistanceData.value = [];
  } finally {
    loadingAssistances.value = false;
  }
};

// دالة لجلب تفاصيل جميع أعضاء العائلة
const fetchAllMemberDetails = async () => {
  if (
    !familyData.value.familyMembers ||
    familyData.value.familyMembers.length === 0
  ) {
    memberDetails.value = [];
    return;
  }

  loadingMembers.value = true;
  memberLoadError.value = false;

  try {
    // familyMembers عبارة عن مصفوفة من الأرقام الوطنية (IDs)
    const memberPromises = familyData.value.familyMembers.map((personId) => {
      return fetchPersonDetailsByNationalId(personId);
    });

    const results = await Promise.allSettled(memberPromises);

    memberDetails.value = results
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);

    // التحقق من وجود أخطاء
    const hasErrors = results.some(
      (result) => result.status === "rejected" || result.value === null,
    );
    if (hasErrors) {
      memberLoadError.value = true;
      console.warn("Some member details could not be loaded");
    }
  } catch (error) {
    console.error("Error fetching member details:", error);
    memberLoadError.value = true;
    memberDetails.value = [];
  } finally {
    loadingMembers.value = false;
  }
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
      <title>طباعة تفاصيل الأسرة</title>
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
        .print-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          color: #42b983;
          font-size: 1.1rem;
          border-bottom: 1px solid #42b983;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .print-info-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 11px; 
        }
        .print-info-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: right;
        }
        .print-info-table td:first-child {
          width: 30%;
          background-color: #f8f9fa;
        }
        .print-info-table strong { 
          color: #42b983;
        }
        .print-info-table-two-columns {
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 11px; 
        }
        .print-info-table-two-columns td {
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: right;
        }
        .print-info-table-two-columns td:nth-child(odd) {
          width: 20%;
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .print-info-table-two-columns td:nth-child(even) {
          width: 30%;
        }
        .print-info-table-two-columns strong { 
          color: #42b983;
        }
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 10px; 
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: center; 
        }
        .print-table th { 
          background-color: #42b983; 
          color: white; 
          font-weight: bold; 
        }
        .print-table tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        @media print { 
          body { margin: 0; } 
          .print-table { font-size: 10px; }
          .print-info-table { font-size: 11px; }
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

onMounted(async () => {
  try {
    // جلب أنواع المساعدات أولاً
    await fetchAssistanceTypes();

    // جلب بيانات العائلة
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Family/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    familyData.value = response.data;

    console.log("Family Data:", familyData.value);
    console.log("Family Members IDs:", familyData.value.familyMembers);

    // جلب تفاصيل أعضاء العائلة
    await fetchAllMemberDetails();

    // جلب بيانات المساعدات إذا كانت موجودة
    if (
      familyData.value.assistances &&
      familyData.value.assistances.length > 0
    ) {
      await fetchAllAssistances();
    }
  } catch (error) {
    console.error("Error fetching family details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الأسرة");
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goBack = () => {
  router.push("/family");
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

.member-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef !important;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #42b983 !important;
}

.member-info h6 {
  font-weight: 600;
}

.empty-state {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
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

.assistance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.assistance-card {
  transition: transform 0.2s;
}

.assistance-card:hover {
  transform: translateY(-5px);
}

.assistance-details p {
  margin-bottom: 0.5rem;
}

.badge {
  font-size: 0.8rem !important;
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

  .assistance-card {
    page-break-inside: avoid;
  }

  .info-item strong {
    color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .member-card {
    page-break-inside: avoid;
    margin-bottom: 0.5rem;
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
