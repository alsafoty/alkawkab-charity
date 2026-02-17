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
          <div class="alert alert-info py-2 mb-3" style="font-size: 0.9rem">
            <i class="bi bi-info-circle me-2"></i>
            <strong>ملاحظة:</strong> الحد الأقصى لحجم الملف: 10 ميجابايت.
          </div>
          <div class="row align-items-end">
            <div class="col-md-8">
              <label class="form-label fw-bold">اختر الملفات</label>
              <input
                type="file"
                @change="onFileSelect"
                class="form-control form-control-lg"
                ref="fileInput"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.csv,.xls,.xlsx"
                multiple
              />
              <small
                v-if="selectedFiles.length > 0"
                class="text-success mt-2 d-block"
              >
                <i class="bi bi-check-circle me-1"></i>
                تم اختيار {{ selectedFiles.length }} ملف (الحجم الكلي:
                {{ getTotalSize() }})
              </small>
              <!-- Show list of selected files -->
              <div v-if="selectedFiles.length > 0" class="mt-2">
                <div class="selected-files-list">
                  <div
                    v-for="(file, index) in selectedFiles"
                    :key="index"
                    class="selected-file-item"
                  >
                    <i class="bi bi-file-earmark text-success me-1"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size text-muted"
                      >({{ formatFileSize(file.size) }})</span
                    >
                    <button
                      @click="removeFile(index)"
                      class="btn btn-sm btn-link text-danger p-0 ms-2"
                      title="إزالة"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
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
                  جاري الرفع... ({{ uploadProgress.current }}/{{
                    uploadProgress.total
                  }})
                </span>
                <span v-else>
                  <i class="bi bi-upload me-2"></i>
                  رفع
                  {{ selectedFiles.length > 0 ? selectedFiles.length : "" }}
                  {{ selectedFiles.length > 1 ? "ملفات" : "ملف" }}
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
                <th>تاريخ الرفع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(file, index) in files" :key="file.fileId">
                <td>{{ index + 1 }}</td>
                <td>
                  <i class="bi bi-file-earmark me-2 text-success"></i>
                  {{ file.fileName }}
                </td>
                <td>{{ formatDate(file.uploadedAt) }}</td>
                <td>
                  <button
                    @click="openPreview(file)"
                    class="btn btn-sm btn-info me-2"
                    title="معاينة"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click="downloadFile(file)"
                    class="btn btn-sm btn-primary me-2"
                    title="تحميل"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                  <button
                    @click="confirmDeleteFile(file)"
                    class="btn btn-sm btn-danger me-2"
                    title="حذف"
                    :disabled="deleting"
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

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-eye me-2"></i>
              معاينة الملف: {{ previewFile?.fileName }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closePreview"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="previewError" class="alert alert-warning text-center">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <p class="mb-2">{{ previewError }}</p>
              <button
                @click="openInNewTab(previewFile)"
                class="btn btn-primary btn-sm me-2"
              >
                <i class="bi bi-box-arrow-up-right me-1"></i>
                فتح في صفحة جديدة
              </button>
              <button
                @click="downloadFile(previewFile)"
                class="btn btn-success btn-sm"
              >
                <i class="bi bi-download me-1"></i>
                تحميل الملف
              </button>
            </div>
            <div v-else-if="isImageFile(previewFile)" class="text-center">
              <img
                :src="previewFile.fileUrl"
                :alt="previewFile.fileName"
                class="img-fluid rounded"
                style="max-height: 70vh"
                @error="handlePreviewError"
              />
            </div>
            <div v-else-if="isPdfFile(previewFile)" class="text-center">
              <iframe
                :src="previewFile.fileUrl"
                width="100%"
                height="600px"
                style="border: none"
                @error="handlePreviewError"
              ></iframe>
              <div class="mt-2">
                <small class="text-muted"
                  >لا تظهر المعاينة؟
                  <a href="#" @click.prevent="openInNewTab(previewFile)"
                    >افتح في صفحة جديدة</a
                  ></small
                >
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i
                class="bi bi-file-earmark text-muted"
                style="font-size: 4rem"
              ></i>
              <p class="mt-3 text-muted">لا يمكن معاينة هذا النوع من الملفات</p>
              <button
                @click="downloadFile(previewFile)"
                class="btn btn-primary mt-2"
              >
                <i class="bi bi-download me-2"></i>
                تحميل الملف
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closePreview"
            >
              إغلاق
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="downloadFile(previewFile)"
            >
              <i class="bi bi-download me-2"></i>
              تحميل
            </button>
          </div>
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
import { getApiBaseUrl, getAuthToken, handleApiError } from "@/utils/api";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
// Node.js Backend API for Files
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const FilesAPI = API_BASE_URL + "/UploadFiles";
const AUTH_TOKEN = getAuthToken();

const loading = ref(false);
const uploading = ref(false);
const deleting = ref(false);
const files = ref([]);
const selectedYear = ref(new Date().getFullYear());
const selectedFiles = ref([]);
const fileInput = ref(null);
const showPreviewModal = ref(false);
const previewFile = ref(null);
const previewError = ref(null);
const uploadProgress = ref({ current: 0, total: 0 });

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
    const responseData = response.data.data || response.data;
    files.value = Array.isArray(responseData) ? responseData : [];
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
      const errorMsg = handleApiError(error, alertify);
      alertify.error(`خطأ في جلب الملفات: ${errorMsg}`);
    }
  } finally {
    loading.value = false;
  }
};

// Handle file selection
const onFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    selectedFiles.value = files;

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    console.log(
      `${files.length} file(s) selected, total size: ${totalSizeMB} MB`,
    );
  }
};

// Remove a file from selection
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  // Update file input
  if (selectedFiles.value.length === 0 && fileInput.value) {
    fileInput.value.value = "";
  }
};

// Upload files (direct to Cloudinary with signed upload)
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    alertify.warning("الرجاء اختيار ملف أو أكثر أولاً");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  uploading.value = true;
  uploadProgress.value = { current: 0, total: selectedFiles.value.length };

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  try {
    // Get upload signature from backend
    const signatureResponse = await axios.get(
      `${FilesAPI}/signature?year=${selectedYear.value}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    const signatureData = signatureResponse.data.data;

    // Upload each file directly to Cloudinary
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i];
      uploadProgress.value.current = i + 1;

      try {
        // Upload directly to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file, signatureData);

        // Save file info to database via backend
        await axios.post(
          `${FilesAPI}/save-info?year=${selectedYear.value}`,
          cloudinaryResult,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

        successCount++;
        console.log(`✓ Uploaded: ${file.name}`);
      } catch (error) {
        failCount++;
        errors.push({ fileName: file.name, error: error.message });
        console.error(`✗ Failed: ${file.name}`, error.message);
      }
    }

    // Show results
    if (failCount > 0) {
      alertify.warning(
        `تم رفع ${successCount} من ${selectedFiles.value.length} ملف. فشل رفع ${failCount} ملف.`,
      );
    } else {
      alertify.success(
        `تم رفع ${successCount} ${successCount > 1 ? "ملفات" : "ملف"} بنجاح`,
      );
    }

    // Clear selection
    selectedFiles.value = [];
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    // Refresh files list
    await fetchFiles();
  } catch (error) {
    const errorMsg = handleApiError(error, alertify);
    alertify.error(`فشل رفع الملفات: ${errorMsg}`);
  } finally {
    uploading.value = false;
    uploadProgress.value = { current: 0, total: 0 };
  }
};

// Upload file directly to Cloudinary using signed upload
const uploadToCloudinary = async (file, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signatureData.signature);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("api_key", signatureData.apiKey);
  formData.append("folder", signatureData.folder);

  // Upload directly to Cloudinary (bypasses Vercel completely)
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;

  const response = await axios.post(cloudinaryUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Preview file
const openPreview = (file) => {
  previewFile.value = file;
  previewError.value = null; // Reset error state
  showPreviewModal.value = true;
  console.log("Opening preview for:", file.fileName, "URL:", file.fileUrl);
};

const closePreview = () => {
  showPreviewModal.value = false;
  previewFile.value = null;
  previewError.value = null;
};

const handlePreviewError = () => {
  previewError.value =
    "لا يمكن عرض الملف. قد يكون هناك مشكلة في إعدادات الوصول. جرب فتحه في صفحة جديدة أو تحميله.";
  console.error("Preview error for file:", previewFile.value?.fileName);
};

const openInNewTab = (file) => {
  if (file && file.fileUrl) {
    window.open(file.fileUrl, "_blank");
  }
};

const isImageFile = (file) => {
  if (!file || !file.fileName) return false;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const fileName = file.fileName.toLowerCase();
  return imageExtensions.some((ext) => fileName.endsWith(ext));
};

const isPdfFile = (file) => {
  if (!file || !file.fileName) return false;
  return file.fileName.toLowerCase().endsWith(".pdf");
};

// Download file
const downloadFile = async (file) => {
  try {
    let downloadUrl = file.fileUrl;

    // If it's a Cloudinary URL, add the attachment flag for forced download
    if (downloadUrl.includes("cloudinary.com")) {
      downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }

    // Try to use backend download endpoint for better control
    try {
      const response = await axios.get(`${FilesAPI}/download/${file.fileId}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response.data?.data?.url) {
        downloadUrl = response.data.data.url;
      }
    } catch (backendError) {
      console.log("Using direct Cloudinary URL with attachment flag");
    }

    // Create a temporary anchor element to force download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.download = file.fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alertify.success("جاري تحميل الملف...");
  } catch (error) {
    const errorMsg = handleApiError(error, alertify);
    alertify.error(`خطأ في تحميل الملف: ${errorMsg}`);
  }
};

// Delete file with confirmation
const confirmDeleteFile = (file) => {
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف الملف: ${file.fileName}؟`,
    async () => {
      await deleteFile(file);
    },
    () => {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

// Delete file
const deleteFile = async (file) => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  deleting.value = true;
  try {
    await axios.delete(`${FilesAPI}/${file.fileId}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    alertify.success("تم حذف الملف بنجاح");

    // Refresh files list
    await fetchFiles();
  } catch (error) {
    const errorMsg = handleApiError(error, alertify);
    alertify.error(`فشل حذف الملف: ${errorMsg}`);
  } finally {
    deleting.value = false;
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "غير معروف";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// Get total size of selected files
const getTotalSize = () => {
  const totalBytes = selectedFiles.value.reduce(
    (sum, file) => sum + file.size,
    0,
  );
  return formatFileSize(totalBytes);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "غير معروف";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

.selected-files-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.5rem;
  background-color: white;
}

.selected-file-item {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.selected-file-item:last-child {
  border-bottom: none;
}

.selected-file-item .file-name {
  flex: 1;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-file-item .file-size {
  font-size: 0.8rem;
  margin-right: 0.5rem;
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

.btn-info {
  background-color: #0dcaf0;
  border-color: #0dcaf0;
  color: white;
}

.btn-info:hover {
  background-color: #0bb5d5;
  border-color: #0bb5d5;
}

/* Modal styling */
.modal.show {
  display: block !important;
}

.modal-body img {
  max-width: 100%;
  height: auto;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
