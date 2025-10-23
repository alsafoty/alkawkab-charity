<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div class="card-header bg-success text-white py-3 text-center">
        <h3 class="mb-0 fw-bold">
          <i class="bi bi-folder2-open me-2"></i>
          الموازنة السنوية
        </h3>
      </div>

      <div class="card-body p-4">
        <div class="row g-4">
          <!-- Upload File Section -->
          <div class="col-md-6">
            <div class="file-operation-card card h-100 border-success">
              <div class="card-body text-center p-4">
                <div class="operation-icon mb-3">
                  <i
                    class="bi bi-cloud-upload text-success"
                    style="font-size: 3rem"
                  ></i>
                </div>
                <h5 class="card-title text-success mb-3">رفع ملف جديد</h5>
                <p class="text-muted mb-4">
                  اختر ملفاً من جهازك لرفعه إلى النظام
                </p>

                <form @submit.prevent="uploadFile" class="text-start">
                  <div class="mb-3">
                    <label class="form-label fw-bold">السنة</label>
                    <input
                      type="number"
                      required
                      v-model.number="uploadData.year"
                      placeholder="ادخل السنة"
                      class="form-control"
                      :min="2020"
                      :max="2030"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold">اختر الملف</label>
                    <input
                      ref="fileInput"
                      type="file"
                      class="form-control"
                      @change="handleFileSelect"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      required
                    />
                  </div>

                  <!-- File Preview -->
                  <div v-if="uploadData.file" class="mb-3 p-3 bg-light rounded">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-file-earmark text-success me-2"></i>
                      <div>
                        <strong>{{ uploadData.file.name }}</strong>
                        <br />
                        <small class="text-muted">{{
                          formatFileSize(uploadData.file.size)
                        }}</small>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success w-100"
                    :disabled="uploading || !canUpload"
                  >
                    <span
                      v-if="uploading"
                      class="spinner-border spinner-border-sm me-1"
                    ></span>
                    <i v-else class="bi bi-upload me-1"></i>
                    {{ uploading ? "جاري الرفع..." : "رفع الملف" }}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Download File Section -->
          <div class="col-md-6">
            <div class="file-operation-card card h-100 border-primary">
              <div class="card-body text-center p-4">
                <div class="operation-icon mb-3">
                  <i
                    class="bi bi-download text-primary"
                    style="font-size: 3rem"
                  ></i>
                </div>
                <h5 class="card-title text-primary mb-3">تنزيل ملف</h5>
                <p class="text-muted mb-4">حدد السنة لتنزيل الملفات المرفوعة</p>

                <form @submit.prevent="downloadFile" class="text-start">
                  <div class="mb-3">
                    <label class="form-label fw-bold">السنة</label>
                    <input
                      type="number"
                      required
                      v-model.number="downloadData.year"
                      placeholder="ادخل السنة"
                      class="form-control"
                      :min="2020"
                      :max="2030"
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="downloading || !downloadData.year"
                  >
                    <span
                      v-if="downloading"
                      class="spinner-border spinner-border-sm me-1"
                    ></span>
                    <i v-else class="bi bi-download me-1"></i>
                    {{ downloading ? "جاري التنزيل..." : "تنزيل الملفات" }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="statusMessage" class="mt-4">
          <div
            :class="[
              'alert',
              'alert-dismissible',
              'fade',
              'show',
              statusType === 'success' ? 'alert-success' : 'alert-danger',
            ]"
            role="alert"
          >
            <i
              :class="
                statusType === 'success'
                  ? 'bi bi-check-circle me-2'
                  : 'bi bi-exclamation-triangle me-2'
              "
            ></i>
            {{ statusMessage }}
            <button
              type="button"
              class="btn-close"
              @click="clearMessage"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";

// Reactive data
const uploading = ref(false);
const downloading = ref(false);
const statusMessage = ref("");
const statusType = ref("success");
const fileInput = ref(null);

// Form data
const uploadData = ref({
  year: new Date().getFullYear(),
  file: null,
});

const downloadData = ref({
  year: new Date().getFullYear(),
});

// Computed properties
const canUpload = computed(() => {
  return uploadData.value.year && uploadData.value.file && !uploading.value;
});

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
};

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showMessage("حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت", "error");
      return;
    }
    uploadData.value.file = file;
    clearMessage();
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 بايت";
  const k = 1024;
  const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Upload file function
const uploadFile = async () => {
  if (!canUpload.value) {
    showMessage("يرجى اختيار الملف والسنة", "error");
    return;
  }

  const authToken = getAuthToken();
  if (!authToken) {
    showMessage("يرجى تسجيل الدخول أولاً", "error");
    return;
  }

  uploading.value = true;
  clearMessage();

  try {
    const formData = new FormData();
    formData.append("file", uploadData.value.file);

    // Send year as query parameter, not in FormData
    const response = await axios.post(
      `${API_BASE_URL}/UploadFiles?year=${uploadData.value.year}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Don't set Content-Type manually for FormData
        },
      }
    );

    showMessage("تم رفع الملف بنجاح", "success");

    // Reset form
    uploadData.value.file = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    handleApiError(error, "رفع الملف");
  } finally {
    uploading.value = false;
  }
};

// Download file function
const downloadFile = async () => {
  if (!downloadData.value.year) {
    showMessage("يرجى إدخال السنة", "error");
    return;
  }

  const authToken = getAuthToken();
  if (!authToken) {
    showMessage("يرجى تسجيل الدخول أولاً", "error");
    return;
  }

  downloading.value = true;
  clearMessage();

  try {
    const response = await axios.get(
      `${API_BASE_URL}/UploadFiles?year=${downloadData.value.year}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        responseType: "blob",
      }
    );

    // Check if response has data
    if (response.data.size === 0) {
      showMessage("لا توجد ملفات للسنة المحددة", "error");
      return;
    }

    // Create download link
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Extract filename from response headers or use default
    let fileName = `Budget_${downloadData.value.year}`;
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        fileName = filenameMatch[1];
      }
    } else {
      // Add extension based on content type
      const contentType = response.headers["content-type"];
      if (contentType?.includes("pdf")) fileName += ".pdf";
      else if (contentType?.includes("word")) fileName += ".docx";
      else if (contentType?.includes("excel")) fileName += ".xlsx";
    }

    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showMessage("تم تنزيل الملف بنجاح", "success");
  } catch (error) {
    console.error("Error downloading file:", error);
    handleApiError(error, "تنزيل الملف");
  } finally {
    downloading.value = false;
  }
};

// Handle API errors
const handleApiError = (error, operation) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        if (typeof data === "string") {
          showMessage(data, "error");
        } else {
          showMessage("طلب غير صحيح", "error");
        }
        break;
      case 401:
        showMessage("غير مصرح لك بالوصول. يرجى تسجيل الدخول", "error");
        break;
      case 403:
        showMessage("ليس لديك صلاحية لهذه العملية", "error");
        break;
      case 404:
        showMessage("لا توجد ملفات للسنة المحددة", "error");
        break;
      case 500:
        showMessage("خطأ في الخادم. يرجى المحاولة لاحقاً", "error");
        break;
      default:
        showMessage(`خطأ في ${operation}: ${status}`, "error");
    }
  } else if (error.request) {
    showMessage("لا يمكن الوصول إلى الخادم. تحقق من الاتصال", "error");
  } else {
    showMessage(`حدث خطأ في ${operation}`, "error");
  }
};

// Show status message
const showMessage = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;

  // Auto clear success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }
};

// Clear message
const clearMessage = () => {
  statusMessage.value = "";
};
</script>

<style scoped>
.file-operation-card {
  transition: all 0.3s ease;
  border-width: 2px;
}

.file-operation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.operation-icon {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.form-control,
.form-select {
  text-align: right;
  border-radius: 8px;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}

.card-title {
  font-weight: 700;
}

.alert {
  border-radius: 8px;
  border: none;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}

/* Custom animations */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.file-operation-card:hover .operation-icon {
  animation: pulse 2s infinite;
}

/* File preview styling */
.bg-light {
  background-color: #f8f9fa !important;
}
</style>
