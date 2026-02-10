<template>
  <div class="container py-4 theme-container" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 overflow-hidden border-0">
          <!-- Green Header -->
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0">تعديل بيانات الشخص</h2>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="submitForm" class="row g-3">
              <!-- Personal Information -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الرقم الوطني</label>
                <input
                  v-model="formData.id"
                  type="text"
                  class="form-control"
                  readonly
                  disabled
                />
                <small class="text-muted">لا يمكن تعديل الرقم الوطني</small>
              </div>
              <div class="col-md-6">
                <label class="form-label">الاسم الأول</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">الاسم الثاني</label>
                <input
                  v-model="formData.secondName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">الاسم الثالث</label>
                <input
                  v-model="formData.thirdName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">اسم العائلة</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">الجنس</label>
                <select v-model="formData.gender" class="form-select" required>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الهاتف</label>
                <input
                  v-model="formData.phoneNumber"
                  type="tel"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">المستوى التعليمي</label>
                <input
                  v-model="formData.educationalLevel"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">المهنة</label>
                <input
                  v-model="formData.job"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <!-- Status Checkboxes - تصميم محسن -->
              <div class="col-12">
                <div class="card p-3 mb-3 border-0 bg-light">
                  <div class="mb-2 fw-bold text-success">
                    الحالات الاجتماعية
                  </div>
                  <div class="d-flex flex-wrap gap-4 justify-content-between">
                    <div class="form-check flex-grow-1">
                      <input
                        v-model="formData.isWidow"
                        type="checkbox"
                        class="form-check-input"
                        id="isWidow"
                      />
                      <label
                        class="form-check-label user-select-none ms-2"
                        for="isWidow"
                      >
                        أرمل/ة
                      </label>
                    </div>
                    <div class="form-check flex-grow-1">
                      <input
                        v-model="formData.isOrphan"
                        type="checkbox"
                        class="form-check-input"
                        id="isOrphan"
                      />
                      <label
                        class="form-check-label user-select-none ms-2"
                        for="isOrphan"
                      >
                        يتيم/ة
                      </label>
                    </div>
                    <div class="form-check flex-grow-1">
                      <input
                        v-model="formData.isPartOfFamily"
                        type="checkbox"
                        class="form-check-input"
                        id="isPartOfFamily"
                      />
                      <label
                        class="form-check-label user-select-none ms-2"
                        for="isPartOfFamily"
                      >
                        جزء من عائلة
                      </label>
                    </div>
                    <div class="form-check flex-grow-1">
                      <input
                        v-model="formData.isHouseOwned"
                        type="checkbox"
                        class="form-check-input"
                        id="isHouseOwned"
                      />
                      <label
                        class="form-check-label user-select-none ms-2"
                        for="isHouseOwned"
                      >
                        يملك منزل
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Family Info -->
              <div v-if="formData.isPartOfFamily" class="col-12">
                <div class="section-card p-4 rounded-3 bg-light">
                  <h4 class="section-title mb-4 text-success">
                    معلومات العائلة
                  </h4>

                  <!-- Family Type Selection -->
                  <div class="row mb-4">
                    <div class="col-12">
                      <div class="form-check form-check-inline me-4">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="keepCurrentFamily"
                          :value="false"
                          v-model="formData.changeFamily"
                        />
                        <label class="form-check-label" for="keepCurrentFamily"
                          >الاحتفاظ بالعائلة الحالية</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="changeFamily"
                          :value="true"
                          v-model="formData.changeFamily"
                        />
                        <label class="form-check-label" for="changeFamily"
                          >تغيير العائلة</label
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Current Family Info -->
                  <div
                    v-if="!formData.changeFamily && currentFamilyInfo"
                    class="row mb-3"
                  >
                    <div class="col-12">
                      <div
                        class="current-family-info p-3 bg-white rounded border"
                      >
                        <h6 class="text-success mb-2">العائلة الحالية</h6>
                        <p class="mb-1">
                          <strong>الاسم:</strong> {{ currentFamilyInfo.name }}
                        </p>
                        <p class="mb-0">
                          <strong>يملكون منزل:</strong>
                          {{ currentFamilyInfo.isHouseOwned ? "نعم" : "لا" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Change Family Options -->
                  <div v-if="formData.changeFamily" class="row mb-4">
                    <div class="col-12">
                      <div class="form-check form-check-inline me-4">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="newFamily"
                          :value="true"
                          v-model="formData.isNewFamily"
                        />
                        <label class="form-check-label" for="newFamily"
                          >عائلة جديدة</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="existingFamily"
                          :value="false"
                          v-model="formData.isNewFamily"
                        />
                        <label class="form-check-label" for="existingFamily"
                          >عائلة موجودة</label
                        >
                      </div>
                    </div>
                  </div>

                  <!-- New Family Fields -->
                  <div
                    v-if="formData.changeFamily && formData.isNewFamily"
                    class="row g-3"
                  >
                    <div class="col-md-6">
                      <label class="form-label fw-bold"
                        >اسم العائلة الجديدة</label
                      >
                      <input
                        v-model="formData.newFamilyName"
                        type="text"
                        class="form-control"
                        placeholder="أدخل اسم العائلة"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold"
                        >عدد أفراد العائلة</label
                      >
                      <input
                        v-model.number="formData.numberOfFamilyMembers"
                        type="number"
                        class="form-control"
                        min="1"
                        placeholder="أدخل عدد أفراد العائلة"
                        required
                      />
                    </div>
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          v-model="formData.familyHouseOwned"
                          type="checkbox"
                          class="form-check-input"
                          id="familyHouseOwned"
                        />
                        <label class="form-check-label" for="familyHouseOwned">
                          العائلة تملك منزل
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Existing Family Selection -->
                  <div
                    v-if="formData.changeFamily && !formData.isNewFamily"
                    class="row g-3"
                  >
                    <div class="col-md-8">
                      <label class="form-label fw-bold"
                        >اختر العائلة الموجودة</label
                      >
                      <select
                        v-model="formData.selectedFamilyId"
                        class="form-select"
                        required
                        @change="onFamilySelect"
                      >
                        <option value="">اختر عائلة...</option>
                        <option
                          v-for="family in existingFamilies"
                          :key="family.familyId"
                          :value="family.familyId"
                        >
                          {{ family.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-4" v-if="selectedFamilyInfo">
                      <div class="family-info p-3 bg-white rounded border">
                        <h6 class="text-success mb-2">
                          معلومات الأسرة المختارة
                        </h6>
                        <p class="mb-1">
                          <strong>رب الأسرة:</strong>
                          {{ selectedFamilyInfo.name }}
                        </p>
                        <p class="mb-0">
                          <strong>يملكون منزل:</strong>
                          {{ selectedFamilyInfo.isHouseOwned ? "نعم" : "لا" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Guardian Info -->
              <div v-if="formData.isOrphan || formData.age < 18" class="col-12">
                <div class="section-card p-4 rounded-3 bg-light">
                  <h4 class="section-title mb-4 text-success">معلومات الوصي</h4>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">الاسم الأول للوصي</label>
                      <input
                        v-model="formData.guardian.firstName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">الاسم الثاني للوصي</label>
                      <input
                        v-model="formData.guardian.secondName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">الاسم الثالث للوصي</label>
                      <input
                        v-model="formData.guardian.thirdName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">اسم عائلة الوصي</label>
                      <input
                        v-model="formData.guardian.lastName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">صلة القرابة</label>
                      <input
                        v-model="formData.guardian.relationship"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">مهنة الوصي</label>
                      <input
                        v-model="formData.guardian.guardianJob"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">رقم هاتف الوصي</label>
                      <input
                        v-model="formData.guardian.guardianPhoneNumber"
                        type="tel"
                        class="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit -->
              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
                >
                  حفظ التعديلات
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
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
const PersonAPI = ref(process.env.VUE_APP_API_BASE_URL + "/api/Person");
const FamilyAPI = ref(process.env.VUE_APP_API_BASE_URL + "/api/Family");
const GuardianAPI = ref(process.env.VUE_APP_API_BASE_URL + "/api/Guardian");
const AUTH_TOKEN = localStorage.getItem("token");

const existingFamilies = ref([]);
const selectedFamilyInfo = ref(null);
const currentFamilyInfo = ref(null);
const originalGuardianId = ref(null);

const formData = reactive({
  id: "",
  gender: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  phoneNumber: "",
  educationalLevel: "",
  isWidow: false,
  isOrphan: false,
  job: "",
  isPartOfFamily: false,
  numberOfFamilyMembers: 1,
  isHouseOwned: false,
  guardianId: "",
  familyId: 0,
  changeFamily: false,
  isNewFamily: true,
  selectedFamilyId: "",
  newFamilyName: "",
  familyHouseOwned: false,
  guardian: {
    guardianId: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    lastName: "",
    relationship: "",
    guardianJob: "",
    guardianPhoneNumber: "",
  },
  assistances: [],
});

onMounted(async () => {
  await fetchExistingFamilies();
  await fetchPersonData();
});

const fetchExistingFamilies = async () => {
  try {
    const response = await axios.get(FamilyAPI.value, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    existingFamilies.value = response.data;
  } catch (error) {
    console.error("Error fetching families:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب قائمة العائلات: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب قائمة العائلات");
    }
  }
};

const fetchPersonData = async () => {
  try {
    const response = await axios.get(`${PersonAPI.value}/${route.params.id}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const personData = response.data;

    // Store original guardian ID
    originalGuardianId.value = personData.guardianId;

    Object.assign(formData, {
      id: personData.id || "",
      gender: personData.gender || "",
      firstName: personData.firstName || "",
      secondName: personData.secondName || "",
      thirdName: personData.thirdName || "",
      lastName: personData.lastName || "",
      phoneNumber: personData.phoneNumber || "",
      educationalLevel: personData.educationalLevel || "",
      isWidow: personData.isWidow || false,
      isOrphan: personData.isOrphan || false,
      job: personData.job || "",
      isPartOfFamily: personData.isPartOfFamily || false,
      numberOfFamilyMembers: personData.numberOfFamilyMembers || 1,
      isHouseOwned: personData.isHouseOwned || false,
      guardianId: personData.guardianId || "",
      familyId: personData.familyId || 0,
      changeFamily: false,
      guardian: {
        guardianId: "",
        firstName: "",
        secondName: "",
        thirdName: "",
        lastName: "",
        relationship: "",
        guardianJob: "",
        guardianPhoneNumber: "",
      },
      assistances: personData.assistances || [],
    });

    // Fetch guardian data if person is orphan
    if (formData.isOrphan && formData.guardianId) {
      await fetchGuardianData(formData.guardianId);
    }

    if (formData.familyId && formData.isPartOfFamily) {
      await fetchCurrentFamilyInfo();
    }
  } catch (error) {
    console.error("Error fetching person details:", error);
    if (error.response && error.response.status === 404) {
      alertify.error("الشخص غير موجود");
      router.back();
    } else if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات الشخص: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات الشخص");
    }
  }
};

const fetchGuardianData = async (guardianId) => {
  try {
    const response = await axios.get(`${GuardianAPI.value}/${guardianId}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const guardianData = response.data;
    formData.guardian = {
      guardianId: guardianData.guardianId || "",
      firstName: guardianData.firstName || "",
      secondName: guardianData.secondName || "",
      thirdName: guardianData.thirdName || "",
      lastName: guardianData.lastName || "",
      relationship: guardianData.relationship || "",
      guardianJob: guardianData.guardianJob || "",
      guardianPhoneNumber: guardianData.guardianPhoneNumber || "",
    };
  } catch (error) {
    console.error("Error fetching guardian data:", error);

    alertify.warning("لم يتم العثور على بيانات الوصي، سيتم إنشاء وصي جديد");

    // Initialize empty guardian if fetch fails
    formData.guardian = {
      guardianId: "",
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      relationship: "",
      guardianJob: "",
      guardianPhoneNumber: "",
    };
  }
};

const fetchCurrentFamilyInfo = async () => {
  try {
    const response = await axios.get(
      `${FamilyAPI.value}/${formData.familyId}`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      },
    );
    currentFamilyInfo.value = response.data;

    if (currentFamilyInfo.value) {
      formData.isHouseOwned = currentFamilyInfo.value.isHouseOwned;
    }
  } catch (error) {
    console.error("Error fetching current family info:", error);
    alertify.warning("لم يتم العثور على معلومات العائلة الحالية");
  }
};

const onFamilySelect = () => {
  if (formData.selectedFamilyId) {
    selectedFamilyInfo.value = existingFamilies.value.find(
      (family) => family.familyId == formData.selectedFamilyId,
    );

    if (selectedFamilyInfo.value) {
      formData.numberOfFamilyMembers =
        selectedFamilyInfo.value.numberOfFamilyMembers;
      formData.isHouseOwned = selectedFamilyInfo.value.isHouseOwned;
      alertify.success(`تم اختيار العائلة: ${selectedFamilyInfo.value.name}`);
    }
  } else {
    selectedFamilyInfo.value = null;
    formData.numberOfFamilyMembers = 1;
    formData.isHouseOwned = false;
  }
};

// Watch effects for family data management
watch(
  () => formData.isPartOfFamily,
  (newVal) => {
    if (newVal) {
      formData.changeFamily = false;
      formData.newFamilyName = formData.lastName || "";
    } else {
      formData.familyId = 0;
      formData.changeFamily = false;
      formData.selectedFamilyId = "";
      formData.newFamilyName = "";
      formData.familyHouseOwned = false;
      formData.numberOfFamilyMembers = 1;
      formData.isHouseOwned = false;
      selectedFamilyInfo.value = null;
    }
  },
);

watch(
  () => formData.lastName,
  (newVal) => {
    if (
      formData.isPartOfFamily &&
      formData.changeFamily &&
      formData.isNewFamily
    ) {
      formData.newFamilyName = newVal;
    }
  },
);

watch(
  () => formData.changeFamily,
  (newVal) => {
    if (!newVal) {
      formData.isNewFamily = true;
      formData.selectedFamilyId = "";
      formData.newFamilyName = "";
      formData.familyHouseOwned = false;
      selectedFamilyInfo.value = null;

      if (currentFamilyInfo.value) {
        formData.isHouseOwned = currentFamilyInfo.value.isHouseOwned;
      }
    } else {
      formData.newFamilyName = formData.lastName || "";
    }
  },
);

watch(
  () => formData.isNewFamily,
  (newVal) => {
    if (newVal) {
      formData.selectedFamilyId = "";
      selectedFamilyInfo.value = null;
      formData.newFamilyName = formData.lastName || "";
      formData.numberOfFamilyMembers = 1;
      formData.isHouseOwned = false;
    } else {
      formData.newFamilyName = "";
      formData.familyHouseOwned = false;
    }
  },
);

// Watch for changes in new family house ownership
watch(
  () => formData.familyHouseOwned,
  (newVal) => {
    if (
      formData.isPartOfFamily &&
      formData.changeFamily &&
      formData.isNewFamily
    ) {
      formData.isHouseOwned = newVal;
    }
  },
);

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  // Basic validation
  if (!formData.firstName.trim()) {
    alertify.warning("يرجى إدخال الاسم الأول");
    return;
  }

  if (!formData.lastName.trim()) {
    alertify.warning("يرجى إدخال اسم العائلة");
    return;
  }

  if (!formData.gender) {
    alertify.warning("يرجى اختيار الجنس");
    return;
  }

  alertify.confirm(
    "تأكيد التحديث",
    "هل أنت متأكد من تحديث بيانات الشخص؟",
    async function () {
      // User clicked OK
      try {
        let guardianId = formData.guardianId;

        // Handle guardian update/creation
        if (formData.isOrphan) {
          try {
            const guardianPayload = {
              guardianId:
                formData.guardian.guardianId ||
                originalGuardianId.value ||
                crypto.randomUUID(),
              firstName: formData.guardian.firstName,
              secondName: formData.guardian.secondName,
              thirdName: formData.guardian.thirdName,
              lastName: formData.guardian.lastName,
              relationship: formData.guardian.relationship,
              guardianJob: formData.guardian.guardianJob,
              guardianPhoneNumber: formData.guardian.guardianPhoneNumber,
            };

            if (originalGuardianId.value) {
              // Update existing guardian
              await axios.put(
                `${GuardianAPI.value}/${originalGuardianId.value}`,
                guardianPayload,
                {
                  headers: {
                    Authorization: `Bearer ${AUTH_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                },
              );
              guardianId = originalGuardianId.value;
              alertify.success("تم تحديث بيانات الوصي بنجاح");
            } else {
              // Create new guardian
              const guardianResponse = await axios.post(
                GuardianAPI.value,
                guardianPayload,
                {
                  headers: {
                    Authorization: `Bearer ${AUTH_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                },
              );
              guardianId =
                guardianResponse.data.guardianId ||
                guardianResponse.data.id ||
                guardianPayload.guardianId;
              alertify.success("تم إنشاء وصي جديد بنجاح");
            }

            console.log("Guardian updated/created with ID:", guardianId);
          } catch (guardianError) {
            console.error("Error updating/creating guardian:", guardianError);
            alertify.error("حدث خطأ أثناء تحديث بيانات الوصي");
            return;
          }
        }

        let familyId = formData.familyId;

        // Handle family creation/selection
        if (formData.isPartOfFamily && formData.changeFamily) {
          if (formData.isNewFamily) {
            // Create new family first
            const newFamilyData = {
              name: formData.newFamilyName,
              numberOfFamilyMembers: formData.numberOfFamilyMembers,
              isHouseOwned: formData.familyHouseOwned,
            };

            const familyResponse = await axios.post(
              FamilyAPI.value,
              newFamilyData,
              {
                headers: {
                  Authorization: `Bearer ${AUTH_TOKEN}`,
                  "Content-Type": "application/json",
                },
              },
            );

            // Get latest family ID
            const allFamiliesResponse = await axios.get(FamilyAPI.value, {
              headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
              },
            });

            const allFamilies = allFamiliesResponse.data;

            if (allFamilies && allFamilies.length > 0) {
              const sortedFamilies = allFamilies.sort(
                (a, b) => b.familyId - a.familyId,
              );
              familyId = sortedFamilies[0].familyId;
            } else {
              familyId = familyResponse.data.familyId || familyResponse.data.id;
            }

            alertify.success(
              `تم إنشاء العائلة الجديدة: ${formData.newFamilyName}`,
            );
            console.log("New family created with ID:", familyId);
          } else {
            // Use existing family
            familyId = formData.selectedFamilyId;

            const selectedFamily = selectedFamilyInfo.value;
            if (selectedFamily) {
              const updatedFamilyData = {
                name: selectedFamily.name,
                numberOfFamilyMembers: selectedFamily.numberOfFamilyMembers + 1,
                isHouseOwned:
                  selectedFamily.isHouseOwned || formData.isHouseOwned,
              };

              await axios.put(
                `${FamilyAPI.value}/${familyId}`,
                updatedFamilyData,
                {
                  headers: {
                    Authorization: `Bearer ${AUTH_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                },
              );

              formData.numberOfFamilyMembers =
                updatedFamilyData.numberOfFamilyMembers;

              alertify.success("تم تحديث بيانات العائلة بنجاح");
            }
          }
        }

        // Create person update payload
        const payload = {
          id: formData.id,
          gender: formData.gender,
          firstName: formData.firstName,
          secondName: formData.secondName,
          thirdName: formData.thirdName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          educationalLevel: formData.educationalLevel,
          isWidow: formData.isWidow,
          isOrphan: formData.isOrphan,
          job: formData.job,
          isPartOfFamily: formData.isPartOfFamily,
          numberOfFamilyMembers: formData.numberOfFamilyMembers,
          isHouseOwned: formData.isHouseOwned,
        };

        // Add family ID if part of family
        if (formData.isPartOfFamily) {
          payload.familyId = familyId;
        }

        // Add guardian ID if orphan
        if (formData.isOrphan && guardianId) {
          payload.guardianId = guardianId;
        }

        console.log("Updating person with payload:", payload);

        const response = await axios.put(
          `${PersonAPI.value}/${route.params.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Person updated successfully:", response.data);
        alertify.success("تم تحديث بيانات الشخص بنجاح");

        // Navigate after a short delay to show success message
        setTimeout(() => {
          router.back();
        }, 1500);
      } catch (error) {
        console.error("Error updating person:", error);
        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء تحديث بيانات الشخص: ${errorMessage}`);
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء تحديث بيانات الشخص");
        }
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية التحديث");
    },
  );
};
</script>

<style scoped>
.section-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.section-title {
  position: relative;
  padding-right: 15px;
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

.family-info,
.current-family-info {
  font-size: 0.9rem;
}

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
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  transform: translateY(-2px);
}

.form-check {
  padding-right: 1.5em;
  padding-left: 0;
  text-align: right;
}

.form-check .form-check-input {
  float: right;
  margin-right: -1.5em;
  margin-left: 0;
}

.form-check-inline {
  margin-left: 1rem;
  margin-right: 0;
}

.text-muted {
  font-size: 0.85rem;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
