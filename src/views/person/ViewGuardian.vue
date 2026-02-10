<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل الوصي</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات الوصي...</p>
        </div>

        <!-- Guardian Information -->
        <div v-else-if="guardianData">
          <div class="info-section mb-4">
            <h4 class="section-title mb-3">المعلومات الأساسية</h4>
            <div class="info-grid">
              <div class="info-item">
                <strong>الرقم الوطني:</strong>
                <span>{{ guardianData.guardianId }}</span>
              </div>
              <div class="info-item">
                <strong>الاسم الكامل:</strong>
                <span>
                  {{ guardianData.firstName }} {{ guardianData.secondName }}
                  {{ guardianData.thirdName }} {{ guardianData.lastName }}
                </span>
              </div>
              <div class="info-item">
                <strong>صلة القرابة:</strong>
                <span>{{ guardianData.relationship }}</span>
              </div>
              <div class="info-item">
                <strong>المهنة:</strong>
                <span>{{ guardianData.guardianJob || "غير محدد" }}</span>
              </div>
              <div class="info-item">
                <strong>رقم الهاتف:</strong>
                <span>{{
                  guardianData.guardianPhoneNumber || "غير محدد"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Orphans Under Guardianship -->
          <div
            v-if="orphansData && orphansData.length > 0"
            class="info-section mb-4"
          >
            <h4 class="section-title mb-3">
              الأيتام تحت الوصاية ({{ orphansData.length }})
            </h4>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-header text-white">
                  <tr>
                    <th>الرقم الوطني</th>
                    <th>الاسم الكامل</th>
                    <th>الجنس</th>
                    <th class="no-print">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="orphan in orphansData" :key="orphan.id">
                    <td>{{ orphan.id }}</td>
                    <td>
                      {{ orphan.firstName }} {{ orphan.secondName }}
                      {{ orphan.lastName }}
                    </td>
                    <td>{{ orphan.gender }}</td>
                    <td class="no-print">
                      <button
                        @click="viewOrphanDetails(orphan.id)"
                        class="btn btn-sm btn-outline-primary"
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

          <!-- No Orphans Message -->
          <div v-else class="info-section mb-4">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              لا يوجد أيتام تحت وصاية هذا الوصي حالياً
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4">
            <button
              @click="editGuardian"
              class="btn btn-warning px-4 ms-2 no-print"
            >
              <i class="bi bi-pencil me-1"></i>
              تعديل البيانات
            </button>
            <button @click="goBack" class="btn btn-secondary px-4 no-print">
              <i class="bi bi-arrow-right me-1"></i>
              عودة
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          حدث خطأ في تحميل بيانات الوصي
        </div>
      </div>
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold text-success">تقرير معلومات الوصي</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <div v-if="guardianData" class="print-body">
        <!-- معلومات الوصي -->
        <div class="print-section mb-4">
          <h5 class="print-section-title">المعلومات الأساسية</h5>
          <table class="print-info-table">
            <tr>
              <td class="label-cell">الرقم الوطني</td>
              <td class="value-cell">{{ guardianData.guardianId }}</td>
              <td class="label-cell">رقم الهاتف</td>
              <td class="value-cell">
                {{ guardianData.guardianPhoneNumber || "-" }}
              </td>
            </tr>
            <tr>
              <td class="label-cell">الاسم الكامل</td>
              <td class="value-cell" colspan="3">
                {{ guardianData.firstName }} {{ guardianData.secondName }}
                {{ guardianData.thirdName }} {{ guardianData.lastName }}
              </td>
            </tr>
            <tr>
              <td class="label-cell">صلة القرابة</td>
              <td class="value-cell">{{ guardianData.relationship }}</td>
              <td class="label-cell">المهنة</td>
              <td class="value-cell">
                {{ guardianData.guardianJob || "-" }}
              </td>
            </tr>
          </table>
        </div>

        <!-- الأيتام تحت الوصاية -->
        <div v-if="orphansData && orphansData.length > 0" class="print-section">
          <h5 class="print-section-title">
            الأيتام تحت الوصاية ({{ orphansData.length }})
          </h5>
          <table class="print-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الرقم الوطني</th>
                <th>الاسم الكامل</th>
                <th>الجنس</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(orphan, index) in orphansData" :key="orphan.id">
                <td>{{ index + 1 }}</td>
                <td>{{ orphan.id }}</td>
                <td>
                  {{ orphan.firstName }} {{ orphan.secondName }}
                  {{ orphan.lastName }}
                </td>
                <td>{{ orphan.gender }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="print-section">
          <p class="text-muted text-center">
            لا يوجد أيتام تحت وصاية هذا الوصي حالياً
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const route = useRoute();
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const guardianData = ref(null);
const orphansData = ref([]);
const loading = ref(false);
const printArea = ref(null);

// Fetch guardian details
const fetchGuardianDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Guardian/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    guardianData.value = response.data;
    console.log("Guardian details:", response.data);

    // Fetch orphans details if there are any
    if (
      guardianData.value.peopleUnderGuardianship &&
      guardianData.value.peopleUnderGuardianship.length > 0
    ) {
      await fetchOrphansDetails(guardianData.value.peopleUnderGuardianship);
    }
  } catch (error) {
    console.error("Error fetching guardian details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الوصي");
  } finally {
    loading.value = false;
  }
};

// Fetch orphans details by their IDs
const fetchOrphansDetails = async (orphanIds) => {
  try {
    const orphansPromises = orphanIds.map((id) =>
      axios.get(`${API_BASE_URL}/Person/${id}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }),
    );

    const orphansResponses = await Promise.all(orphansPromises);
    orphansData.value = orphansResponses.map((response) => response.data);
    console.log("Orphans data:", orphansData.value);
  } catch (error) {
    console.error("Error fetching orphans details:", error);
    alertify.warning("حدث خطأ في جلب بيانات بعض الأيتام");
  }
};

const viewOrphanDetails = (orphanId) => {
  router.push(`/view-person/${orphanId}`);
};

const editGuardian = () => {
  router.push(`/edit-guardian/${route.params.id}`);
};

const goBack = () => {
  router.back();
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
      <title>طباعة بطاقة الوصي</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Tajawal', Arial, sans-serif; 
          direction: rtl; 
          margin: 20px; 
          color: #333; 
          font-size: 14px;
        }
        .print-header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 3px solid #42b983; 
          padding-bottom: 15px; 
        }
        .print-header h2 { 
          color: #42b983; 
          margin-bottom: 10px; 
          font-size: 24px;
        }
        .print-section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .print-section-title {
          background-color: #42b983;
          color: white;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
        }
        .print-info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .print-info-table td {
          border: 1px solid #ddd;
          padding: 10px;
          font-size: 13px;
        }
        .label-cell {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #42b983;
          width: 25%;
        }
        .value-cell {
          background-color: white;
          width: 25%;
        }
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 12px; 
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
          font-size: 13px;
        }
        .print-table tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        @media print { 
          body { margin: 0; font-size: 12px; } 
          .print-header h2 { font-size: 20px; }
          .print-section-title { font-size: 14px; }
          .print-table { font-size: 11px; }
          .print-table th { font-size: 12px; }
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

onMounted(() => {
  fetchGuardianDetails();
});
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

.table-header {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
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
