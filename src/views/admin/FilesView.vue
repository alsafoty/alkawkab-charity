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
                      type="text"
                      required
                      v-model="uploadData.year"
                      placeholder="ادخل السنة"
                      class="form-control"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold">اختر الملف</label>
                    <input
                      type="file"
                      class="form-control"
                      @change="handleFileSelect"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success w-100"
                    :disabled="uploading"
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
                      type="text"
                      required
                      v-model="downloadData.year"
                      placeholder="ادخل السنة"
                      class="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="downloading"
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
              statusType === 'success' ? 'alert-success' : 'alert-danger',
            ]"
            role="alert"
          >
            <i
              :class="
                statusType === 'success'
                  ? 'bi bi-check-circle'
                  : 'bi bi-exclamation-triangle'
              "
            ></i>
            {{ statusMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const API_BASE_URL = "https://charityapp.runasp.net/api";
const AUTH_TOKEN = localStorage.getItem("token");

// Reactive data
const uploading = ref(false);
const downloading = ref(false);
const statusMessage = ref("");
const statusType = ref("success");

// Form data
const uploadData = ref({
  year: "",
  file: null,
});

const downloadData = ref({
  year: "",
});

// Handle file selection
const handleFileSelect = (event) => {
  uploadData.value.file = event.target.files[0];
};

// Upload file function
const uploadFile = async () => {
  if (!uploadData.value.file || !uploadData.value.year) {
    showMessage("يرجى اختيار الملف والسنة", "error");
    return;
  }

  uploading.value = true;
  const formData = new FormData();
  formData.append("file", uploadData.value.file);

  try {
    await axios.post(`${API_BASE_URL}/UploadFiles`, formData, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
      params: {
        year: uploadData.value.year,
      },
    });

    showMessage("تم رفع الملف بنجاح", "success");

    // Reset form
    uploadData.value = { year: "", file: null };
    // Reset file input
    document.querySelector('input[type="file"]').value = "";
  } catch (error) {
    console.error("Error uploading file:", error);
    showMessage("حدث خطأ أثناء رفع الملف", "error");
  } finally {
    uploading.value = false;
  }
};

// Download file function
const downloadFile = async () => {
  if (!downloadData.value.year) {
    showMessage("يرجى اختيار السنة", "error");
    return;
  }

  downloading.value = true;

  try {
    const response = await axios.get(`${API_BASE_URL}/UploadFiles`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      params: {
        year: downloadData.value.year,
      },
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `files_${downloadData.value.year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    showMessage("تم تنزيل الملفات بنجاح", "success");
  } catch (error) {
    console.error("Error downloading files:", error);
    showMessage("حدث خطأ أثناء تنزيل الملفات", "error");
  } finally {
    downloading.value = false;
  }
};

// Show status message
const showMessage = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;

  // Clear message after 5 seconds
  setTimeout(() => {
    statusMessage.value = "";
  }, 5000);
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
</style>
