<template>
  <div class="container py-4 theme-container" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 overflow-hidden border-0">
          <!-- Green Header -->
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0 fw-bold">تعديل بيانات الوصي</h2>
          </div>

          <div class="card-body p-4">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
              </div>
              <p class="mt-2 text-muted">جاري تحميل بيانات الوصي...</p>
            </div>

            <!-- Edit Form -->
            <form v-else @submit.prevent="submitForm" class="row g-3">
              <!-- Guardian Information -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الرقم الوطني</label>
                <input
                  v-model="formData.guardianId"
                  type="text"
                  class="form-control"
                  placeholder="أدخل الرقم الوطني"
                  required
                  disabled
                />
                <small class="text-muted">لا يمكن تعديل الرقم الوطني</small>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">الاسم الأول</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل الاسم الأول"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">اسم الأب</label>
                <input
                  v-model="formData.secondName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل اسم الأب"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">اسم الجد</label>
                <input
                  v-model="formData.thirdName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل اسم الجد"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">اسم العائلة</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل اسم العائلة"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">صلة القرابة</label>
                <input
                  v-model="formData.relationship"
                  type="text"
                  class="form-control"
                  placeholder="مثال: عم، خال، جد"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">المهنة</label>
                <input
                  v-model="formData.guardianJob"
                  type="text"
                  class="form-control"
                  placeholder="أدخل المهنة"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الهاتف</label>
                <input
                  v-model="formData.guardianPhoneNumber"
                  type="tel"
                  class="form-control"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>

              <!-- Submit -->
              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-success btn-lg px-5 rounded-pill shadow-sm text-white fw-bold ms-3"
                >
                  <i class="bi bi-save me-1"></i>
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-secondary btn-lg px-5 rounded-pill shadow-sm ms-3"
                >
                  <i class="bi bi-x-circle me-1"></i>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const GuardianAPI = API_BASE_URL + "/Guardian";
const AUTH_TOKEN = localStorage.getItem("token");

const loading = ref(false);

const formData = reactive({
  guardianId: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  relationship: "",
  guardianJob: "",
  guardianPhoneNumber: "",
});

// Fetch guardian details
const fetchGuardianDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${GuardianAPI}/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // Populate form with existing data
    Object.assign(formData, response.data);
    console.log("Guardian data loaded:", response.data);
  } catch (error) {
    console.error("Error fetching guardian details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الوصي");
    router.back();
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  // Form validation
  if (!formData.firstName.trim()) {
    alertify.warning("يرجى إدخال الاسم الأول");
    return;
  }

  if (!formData.relationship.trim()) {
    alertify.warning("يرجى إدخال صلة القرابة");
    return;
  }

  alertify.confirm(
    "تأكيد التعديل",
    "هل أنت متأكد من حفظ التعديلات؟",
    async function () {
      try {

        const payload = {
          guardianId: formData.guardianId.trim(),
          firstName: formData.firstName.trim(),
          secondName: formData.secondName.trim(),
          thirdName: formData.thirdName.trim(),
          lastName: formData.lastName.trim(),
          relationship: formData.relationship.trim(),
          guardianJob: formData.guardianJob.trim() || null,
          guardianPhoneNumber: formData.guardianPhoneNumber.trim() || null,
        };

        console.log("Updating guardian with payload:", payload);

        await axios.put(`${GuardianAPI}/${route.params.id}`, payload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        alertify.success("تم تحديث بيانات الوصي بنجاح");

        setTimeout(() => {
          router.push(`/view-guardian/${route.params.id}`);
        }, 1500);
      } catch (err) {
        console.error("Error:", err);

        if (err.response) {
          const errorMessage =
            err.response.data.message || err.response.statusText;
          alertify.error(`فشل في تحديث بيانات الوصي: ${errorMessage}`);
        } else if (err.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("فشل في إرسال البيانات، تحقق من الاتصال أو التوكن.");
        }
      }
    },
    function () {
      alertify.message("تم إلغاء عملية التعديل");
    },
  );
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchGuardianDetails();
});
</script>

<style scoped>
.card {
  border-radius: 15px;
}

.form-control,
.form-select {
  border-radius: 8px;
  text-align: right;
}

.btn-success {
  transition: all 0.3s ease;
  background-color: #42b983 !important;
  border-color: #42b983 !important;
}

.btn-success:hover {
  transform: translateY(-2px);
  background-color: #359269 !important;
  border-color: #359269 !important;
}

.card-header.bg-success {
  background-color: #42b983 !important;
}

.btn-secondary {
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
}

.text-muted {
  font-size: 0.85rem;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
