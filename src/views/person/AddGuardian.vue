<template>
  <div class="container py-4 theme-container" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 overflow-hidden border-0">
          <!-- Green Header -->
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0">إضافة وصي جديد</h2>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="submitForm" class="row g-3">
              <!-- Guardian Information -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الرقم الوطني</label>
                <input
                  v-model="formData.guardianId"
                  type="text"
                  class="form-control"
                  placeholder="أدخل الرقم الوطني"
                  required
                />
                <small class="text-muted">يجب أن يكون رقماً فريداً</small>
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

              <!-- Orphans Selection -->
              <div class="col-12 mt-4">
                <div class="section-card p-4 rounded-3 bg-light">
                  <h4 class="section-title mb-3 text-success">
                    <i class="bi bi-people me-2"></i>
                    إضافة أيتام لهذا الوصي (اختياري)
                  </h4>

                  <!-- Loading State -->
                  <div v-if="loadingOrphans" class="text-center py-3">
                    <div class="spinner-border text-success" role="status">
                      <span class="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p class="mt-2 text-muted">جاري تحميل قائمة الأيتام...</p>
                  </div>

                  <!-- Orphans List -->
                  <div v-else-if="availableOrphans.length > 0">
                    <p class="text-muted mb-3">
                      اختر الأيتام الذين سيكونون تحت وصاية هذا الوصي:
                    </p>
                    <div class="row g-2">
                      <div
                        v-for="orphan in availableOrphans"
                        :key="orphan.id"
                        class="col-md-6"
                      >
                        <div
                          class="form-check orphan-check-item p-3 rounded border"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="'orphan-' + orphan.id"
                            :value="orphan.id"
                            v-model="formData.selectedOrphans"
                          />
                          <label
                            class="form-check-label w-100"
                            :for="'orphan-' + orphan.id"
                          >
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <strong
                                  >{{ orphan.firstName }}
                                  {{ orphan.secondName }}
                                  {{ orphan.lastName }}</strong
                                >
                                <br />
                                <small class="text-muted"
                                  >الرقم الوطني: {{ orphan.id }}</small
                                >
                              </div>
                              <i
                                class="bi bi-person-badge text-success"
                                style="font-size: 1.5rem"
                              ></i>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="formData.selectedOrphans.length > 0"
                      class="mt-3 alert alert-info"
                    >
                      <i class="bi bi-info-circle me-2"></i>
                      تم اختيار
                      <strong>{{ formData.selectedOrphans.length }}</strong>
                      يتيم/أيتام
                    </div>
                  </div>

                  <!-- No Orphans Available -->
                  <div v-else class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    لا يوجد أيتام متاحين حالياً (جميع الأيتام لديهم أوصياء)
                  </div>
                </div>
              </div>

              <!-- Submit -->
              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
                >
                  إضافة الوصي
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-secondary btn-lg px-5 rounded-pill shadow-sm ms-3"
                >
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
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const GuardianAPI = API_BASE_URL + "/Guardian";
const PersonAPI = API_BASE_URL + "/Person";
const AUTH_TOKEN = localStorage.getItem("token");

const availableOrphans = ref([]);
const loadingOrphans = ref(false);

const formData = reactive({
  guardianId: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  relationship: "",
  guardianJob: "",
  guardianPhoneNumber: "",
  selectedOrphans: [],
});

// Fetch available orphans (orphans without guardians)
const fetchAvailableOrphans = async () => {
  loadingOrphans.value = true;
  try {
    const response = await axios.get(PersonAPI, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // Filter orphans who don't have a guardian
    availableOrphans.value = response.data.filter(
      (person) =>
        person.isOrphan === true &&
        (!person.guardianId || person.guardianId === ""),
    );

    console.log(`Found ${availableOrphans.value.length} available orphans`);
  } catch (error) {
    console.error("Error fetching orphans:", error);
    alertify.error("حدث خطأ أثناء جلب قائمة الأيتام");
  } finally {
    loadingOrphans.value = false;
  }
};

onMounted(() => {
  fetchAvailableOrphans();
});

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  // Form validation
  if (!formData.guardianId.trim()) {
    alertify.warning("يرجى إدخال الرقم الوطني");
    return;
  }

  if (!formData.firstName.trim()) {
    alertify.warning("يرجى إدخال الاسم الأول");
    return;
  }

  if (!formData.relationship.trim()) {
    alertify.warning("يرجى إدخال صلة القرابة");
    return;
  }

  alertify.confirm(
    "تأكيد الإضافة",
    "هل أنت متأكد من إضافة هذا الوصي؟",
    async function () {
      try {
        alertify.message("جاري إضافة الوصي...");

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

        console.log("Adding guardian with payload:", payload);

        const response = await axios.post(GuardianAPI, payload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Guardian added successfully:", response.data);
        alertify.success("تم إضافة الوصي بنجاح");

        // If orphans are selected, update them with the guardian ID
        if (formData.selectedOrphans.length > 0) {
          alertify.message(
            `جاري ربط ${formData.selectedOrphans.length} يتيم/أيتام بالوصي...`,
          );

          try {
            const updatePromises = formData.selectedOrphans.map(
              async (orphanId) => {
                // Fetch the orphan's full data first
                const orphanResponse = await axios.get(
                  `${PersonAPI}/${orphanId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${AUTH_TOKEN}`,
                    },
                  },
                );

                const orphanData = orphanResponse.data;

                // Update the orphan with the guardian ID
                const updatePayload = {
                  ...orphanData,
                  guardianId: formData.guardianId.trim(),
                };

                return axios.put(`${PersonAPI}/${orphanId}`, updatePayload, {
                  headers: {
                    Authorization: `Bearer ${AUTH_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                });
              },
            );

            await Promise.all(updatePromises);
            alertify.success(
              `تم ربط ${formData.selectedOrphans.length} يتيم/أيتام بالوصي بنجاح`,
            );
          } catch (updateError) {
            console.error("Error updating orphans:", updateError);
            alertify.warning(
              "تم إضافة الوصي ولكن حدث خطأ أثناء ربط بعض الأيتام",
            );
          }
        }

        setTimeout(() => {
          router.push("/guardians");
        }, 1500);
      } catch (err) {
        console.error("Error:", err);

        if (err.response) {
          if (
            err.response.status === 409 ||
            err.response.data.message?.includes("duplicate") ||
            err.response.data.message?.includes("exists")
          ) {
            alertify.error("الرقم الوطني موجود مسبقاً. يرجى إدخال رقم مختلف.");
          } else {
            const errorMessage =
              err.response.data.message || err.response.statusText;
            alertify.error(`فشل في إضافة الوصي: ${errorMessage}`);
          }
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
      alertify.message("تم إلغاء عملية الإضافة");
    },
  );
};

const goBack = () => {
  router.back();
};
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
  background-color: #42b983;
  border-color: #42b983;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  transform: translateY(-2px);
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

.section-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.section-title {
  position: relative;
  padding-right: 15px;
  font-size: 1.1rem;
}

.section-title::before {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #42b983;
  border-radius: 2px;
}

.orphan-check-item {
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.orphan-check-item:hover {
  background-color: #f0f9f5;
  border-color: #42b983 !important;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
  transform: translateY(-2px);
}

.orphan-check-item input[type="checkbox"]:checked ~ label {
  color: #42b983;
  font-weight: 600;
}

.form-check-input:checked {
  background-color: #42b983;
  border-color: #42b983;
}

.form-check-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.25);
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
