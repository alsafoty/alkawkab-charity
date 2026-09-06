<template>
  <div class="container-fluid py-4" dir="rtl">
    <div class="card shadow-sm border-0 rounded-3">
      <div class="card-header bg-success text-white py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <i class="bi bi-folder2-open me-2"></i>
            مركز الملفات (الموازنات السنوية)
          </h3>
          <button @click="goBack" class="btn btn-outline-light btn-sm">
            <i class="bi bi-arrow-right me-1"></i>
            رجوع
          </button>
        </div>
      </div>

      <div class="card-body p-4">
        <!-- Year Selection and Upload Section -->
        <div class="row mb-4">
          <div class="col-md-6 col-lg-4">
            <label class="form-label fw-bold">اختر السنة:</label>
            <select
              v-model="selectedYear"
              @change="fetchFiles"
              class="form-select form-select-lg shadow-sm"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                سنة {{ year }}
              </option>
            </select>
          </div>
          <div class="col-md-6 col-lg-8 d-flex align-items-end mt-3 mt-md-0">
            <button
              @click="fetchFiles"
              class="btn btn-outline-success btn-lg"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise me-1"></i>
              تحديث
            </button>
          </div>
        </div>

        <!-- Upload Section -->
        <div class="upload-section p-4 rounded-3 mb-4">
          <h4 class="mb-3">
            <i class="bi bi-cloud-upload me-2"></i>
            رفع ملف الموازنة لسنة {{ selectedYear }}
          </h4>
          <div class="alert alert-info py-2 mb-3" style="font-size: 0.9rem">
            <i class="bi bi-info-circle me-2"></i>
            <strong>ملاحظة:</strong> يتم حفظ ملف موازنة واحد لكل سنة. في حال رفع ملف جديد سيتم استبدال الملف السابق.
          </div>
          <div class="row align-items-end">
            <div class="col-md-8">
              <label class="form-label fw-bold">اختر الملف</label>
              <input
                type="file"
                @change="onFileSelect"
                class="form-control form-control-lg"
                ref="fileInput"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.csv,.xls,.xlsx"
              />
              <small
                v-if="selectedFiles.length > 0"
                class="text-success mt-2 d-block"
              >
                <i class="bi bi-check-circle me-1"></i>
                تم اختيار الملف: {{ selectedFiles[0].name }} (الحجم:
                {{ formatFileSize(selectedFiles[0].size) }})
              </small>
            </div>
            <div class="col-md-4 mt-3 mt-md-0">
              <button
                @click="uploadFiles"
                class="btn btn-success btn-lg w-100"
                :disabled="selectedFiles.length === 0 || uploading"
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
          <p class="mt-2 text-muted">جاري فحص الملفات...</p>
        </div>

        <!-- Files Table -->
        <div v-else-if="files.length > 0" class="table-responsive">
          <h4 class="mb-3">
            <i class="bi bi-file-earmark-text me-2"></i>
            ملف الموازنة المتاح لسنة {{ selectedYear }}
          </h4>
          <table class="table table-hover table-striped align-middle">
            <thead class="table-header text-white">
              <tr>
                <th style="width: 80px">#</th>
                <th>اسم الملف</th>
                <th>السنة المالية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in files" :key="file.fileId">
                <td>{{ index + 1 }}</td>
                <td>
                  <i class="bi bi-file-earmark-pdf me-2 text-danger fs-5"></i>
                  <span class="fw-bold">{{ file.fileName }}</span>
                </td>
                <td>سنة {{ file.year }}</td>
                <td>
                  <button
                    @click="downloadFile(file)"
                    class="btn btn-sm btn-primary px-3 rounded-pill"
                    title="تحميل الملف"
                  >
                    <i class="bi bi-download me-1"></i>
                    تحميل الملف
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
            لا يوجد ملف موازنة مرفوع للسنة {{ selectedYear }}
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
import { getAuthToken, handleApiError } from "@/utils/api";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const API_BASE_URL =
  (process.env.VUE_APP_API_BASE_URL ||
    process.env.VUE_APP_NODEJS_API_BASE_URL ||
    "") + "/api";
const FilesAPI = API_BASE_URL + "/UploadFiles";
const AUTH_TOKEN = getAuthToken();

const loading = ref(false);
const uploading = ref(false);
const files = ref([]);
const selectedYear = ref(new Date().getFullYear());
const selectedFiles = ref([]);
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
      responseType: "blob",
    });

    let fileName = `Budget_${selectedYear.value}`;
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, "");
      }
    }

    files.value = [
      {
        fileId: selectedYear.value,
        fileName: fileName,
        fileBlob: response.data,
        year: selectedYear.value,
      },
    ];
  } catch (error) {
    // Status 400 means no file exists for this year
    files.value = [];
  } finally {
    loading.value = false;
  }
};

// Handle file selection
const onFileSelect = (event) => {
  const fileList = Array.from(event.target.files);
  if (fileList.length > 0) {
    selectedFiles.value = [fileList[0]];
  }
};

// Upload files (direct multipart upload to backend)
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    alertify.warning("الرجاء اختيار ملف أولاً");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  uploading.value = true;

  try {
    const file = selectedFiles.value[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${FilesAPI}?year=${selectedYear.value}`, formData, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alertify.success(`تم رفع ملف موازنة سنة ${selectedYear.value} بنجاح`);

    selectedFiles.value = [];
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    await fetchFiles();
  } catch (error) {
    const errorMsg = handleApiError(error, alertify);
    alertify.error(`فشل رفع الملف: ${errorMsg}`);
  } finally {
    uploading.value = false;
  }
};

// Download file
const downloadFile = async (file) => {
  try {
    let blob = file?.fileBlob;
    if (!blob) {
      const response = await axios.get(
        `${FilesAPI}?year=${selectedYear.value}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          responseType: "blob",
        },
      );
      blob = response.data;
    }

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = file?.fileName || `Budget_${selectedYear.value}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alertify.success("تم بدء تحميل الملف");
  } catch (error) {
    const errorMsg = handleApiError(error, alertify);
    alertify.error(`خطأ في تحميل الملف: ${errorMsg}`);
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "غير معروف";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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

* {
  font-family: "Tajawal", sans-serif;
}
</style>
