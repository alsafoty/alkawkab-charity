<template>
  <div class="container py-4" dir="rtl">
    <div class="card border-0 shadow-lg rounded-4">
      <!-- Header -->
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h2 class="mb-0 fw-bold">
          <i class="bi bi-folder2-open me-2"></i>
          مركز الملفات
        </h2>
        <button @click="goBack" class="btn btn-light btn-sm rounded-pill">
          <i class="bi bi-arrow-right me-1"></i>
          رجوع
        </button>
      </div>

      <div class="card-body p-4">
        <!-- Year Selection and Upload Section -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label fw-bold">اختر السنة</label>
            <select v-model="selectedYear" class="form-select form-select-lg">
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="col-md-6 d-flex align-items-end">
            <button
              @click="fetchFiles"
              class="btn btn-primary btn-lg w-100"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              عرض الملفات
            </button>
          </div>
        </div>

        <!-- Upload Section -->
        <div class="upload-section p-4 rounded-3 mb-4">
          <h4 class="mb-3">
            <i class="bi bi-cloud-upload me-2"></i>
            رفع ملف جديد
          </h4>
          <div class="row align-items-end">
            <div class="col-md-8">
              <label class="form-label fw-bold">اختر الملف</label>
              <input
                type="file"
                @change="onFileSelect"
                class="form-control form-control-lg"
                ref="fileInput"
              />
              <small v-if="selectedFile" class="text-success mt-2 d-block">
                <i class="bi bi-check-circle me-1"></i>
                تم اختيار: {{ selectedFile.name }}
              </small>
            </div>
            <div class="col-md-4">
              <button
                @click="uploadFile"
                class="btn btn-success btn-lg w-100"
                :disabled="!selectedFile || uploading"
              >
                <span v-if="uploading">
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  جاري الرفع...
                </span>
                <span v-else>
                  <i class="bi bi-upload me-2"></i>
                  رفع الملف
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل الملفات...</p>
        </div>

        <!-- Files Table -->
        <div v-else-if="files.length > 0" class="table-responsive">
          <h4 class="mb-3">
            <i class="bi bi-file-earmark-text me-2"></i>
            الملفات المتاحة ({{ files.length }})
          </h4>
          <table class="table table-hover table-striped">
            <thead class="table-header text-white">
              <tr>
                <th>#</th>
                <th>اسم الملف</th>
                <th>الحجم</th>
                <th>تاريخ الرفع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in files" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <i class="bi bi-file-earmark me-2 text-success"></i>
                  {{ file.name }}
                </td>
                <td>{{ formatFileSize(file.size) }}</td>
                <td>{{ formatDate(file.uploadDate) }}</td>
                <td>
                  <button
                    @click="downloadFile(file)"
                    class="btn btn-sm btn-primary me-2"
                    title="تحميل"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                  <button
                    @click="deleteFile(file)"
                    class="btn btn-sm btn-danger"
                    title="حذف"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Files Message -->
        <div v-else class="text-center py-5">
          <i class="bi bi-folder-x text-muted" style="font-size: 4rem"></i>
          <p class="text-muted mt-3 fs-5">
            لا توجد ملفات للسنة {{ selectedYear }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const FilesAPI = API_BASE_URL + "/UploadFiles";
const AUTH_TOKEN = localStorage.getItem("token");

const loading = ref(false);
const uploading = ref(false);
const files = ref([]);
const selectedYear = ref(new Date().getFullYear());
const selectedFile = ref(null);
const fileInput = ref(null);

// Generate available years (current year and past 10 years)
const availableYears = ref([]);
for (let i = 0; i <= 10; i++) {
  availableYears.value.push(new Date().getFullYear() - i);
}

// Fetch files for selected year
const fetchFiles = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`${FilesAPI}?year=${selectedYear.value}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // The API returns file information
    files.value = Array.isArray(response.data) ? response.data : [];
    console.log("Files fetched:", files.value);

    if (files.value.length === 0) {
      alertify.message(`لا توجد ملفات للسنة ${selectedYear.value}`);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    if (error.response?.status === 404) {
      files.value = [];
      alertify.message(`لا توجد ملفات للسنة ${selectedYear.value}`);
    } else {
      alertify.error("حدث خطأ أثناء جلب الملفات");
    }
  } finally {
    loading.value = false;
  }
};

// Handle file selection
const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    console.log("File selected:", file.name);
  }
};

// Upload file
const uploadFile = async () => {
  if (!selectedFile.value) {
    alertify.warning("الرجاء اختيار ملف أولاً");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    await axios.post(`${FilesAPI}?year=${selectedYear.value}`, formData, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alertify.success("تم رفع الملف بنجاح");
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    // Refresh files list
    await fetchFiles();
  } catch (error) {
    console.error("Error uploading file:", error);
    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`فشل رفع الملف: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم");
    } else {
      alertify.error("حدث خطأ أثناء رفع الملف");
    }
  } finally {
    uploading.value = false;
  }
};

// Download file
const downloadFile = async (file) => {
  try {

    const response = await axios.get(
      `${FilesAPI}/${file.name}?year=${selectedYear.value}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        responseType: "blob",
      },
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
    alertify.error("حدث خطأ أثناء تحميل الملف");
  }
};

// Delete file
const deleteFile = (file) => {
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف الملف: ${file.name}؟`,
    async function () {
      try {
        await axios.delete(
          `${FilesAPI}/${file.name}?year=${selectedYear.value}`,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          },
        );

        alertify.success("تم حذف الملف بنجاح");
        await fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        alertify.error("حدث خطأ أثناء حذف الملف");
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "غير معروف";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "غير معروف";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchFiles();
});
</script>

<style scoped>
.table-header {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.upload-section {
  background-color: #f8f9fa;
  border: 2px dashed #42b983;
}

.form-control,
.form-select {
  text-align: right;
}

.btn-primary {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary:hover {
  background-color: #359269;
  border-color: #359269;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
