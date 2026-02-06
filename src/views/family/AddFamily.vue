<template>
  <div class="container my-4" dir="rtl">
    <div class="card border-0 shadow rounded-4 overflow-hidden">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold text-center">إضافة أسرة جديدة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" class="row g-4">
          <!-- معلومات العائلة الأساسية -->
          <div class="col-12 mb-4">
            <div class="section-card p-4 rounded-3 bg-light">
              <h4 class="section-title mb-4 text-success">
                معلومات الأسرة الأساسية
              </h4>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold">رب الأسرة</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="form-control shadow-sm"
                      placeholder="أدخل اسم رب الأسرة"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold">عدد الأفراد</label>
                    <input
                      v-model.number="formData.numberOfFamilyMembers"
                      type="number"
                      class="form-control shadow-sm"
                      placeholder="أدخل عدد الأفراد"
                      min="1"
                      required
                    />
                    <small class="text-muted">
                      قم بإدخال عدد أفراد الأسرة يدوياً
                    </small>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold mb-2">حالة السكن</label>
                    <div class="house-status p-3 bg-light rounded-3 border">
                      <div class="form-check mb-0">
                        <input
                          v-model="formData.isHouseOwned"
                          class="form-check-input"
                          type="checkbox"
                          id="isHouseOwned"
                        />
                        <label class="form-check-label" for="isHouseOwned">
                          يمتلكون منزل
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- إضافة أعضاء للعائلة -->
          <div class="col-12 mb-4">
            <div class="section-card p-4 rounded-3 bg-light">
              <h4 class="section-title mb-4 text-success">
                إضافة أعضاء للأسرة
              </h4>
              <div class="mb-2 text-muted">
                اختر الأشخاص الذين تريد إضافتهم لهذه الأسرة:
              </div>

              <!-- Search Bar -->
              <div class="mb-3">
                <div class="input-group">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control search-input"
                    placeholder="البحث في الأشخاص المتاحين..."
                  />
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                </div>
                <small class="text-muted">
                  يمكنك البحث بالاسم الأول أو الأخير أو رقم الهوية
                </small>
              </div>

              <div
                class="list-group persons-list mb-2"
                style="max-height: 300px; overflow-y: auto"
              >
                <div
                  v-for="person in filteredPersonsWithoutFamily"
                  :key="person.id"
                  class="list-group-item"
                >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'person-' + person.id"
                      :value="person.id"
                      v-model="selectedPersons"
                    />
                    <label
                      class="form-check-label"
                      :for="'person-' + person.id"
                    >
                      {{ person.firstName }} {{ person.lastName }} (رقم:
                      {{ person.id }})
                    </label>
                  </div>
                </div>
                <div
                  v-if="
                    filteredPersonsWithoutFamily.length === 0 &&
                    personsWithoutFamily.length > 0
                  "
                  class="text-muted p-2 text-center"
                >
                  لا توجد نتائج تطابق البحث
                </div>
                <div
                  v-if="personsWithoutFamily.length === 0"
                  class="text-danger p-2 text-center"
                >
                  لا يوجد أشخاص متاحون حالياً.
                </div>
              </div>
              <div
                v-if="selectedPersons.length > 0"
                class="alert alert-success p-2 mt-2"
              >
                تم اختيار {{ selectedPersons.length }} شخص/أشخاص.
              </div>
            </div>
          </div>

          <!-- زر الإرسال -->
          <div class="col-12 text-center mt-5">
            <button
              type="submit"
              class="btn btn-success btn-lg px-5 py-3 shadow-sm"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <i class="bi bi-check-circle me-2"></i>
              إضافة الأسرة
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure AlertifyJS for RTL and Arabic - Bottom Right positioning
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const formData = ref({
  name: "",
  numberOfFamilyMembers: 1,
  isHouseOwned: false,
});

const allPersons = ref([]);
const selectedPersons = ref([]);
const loading = ref(false);
const searchTerm = ref("");

// جلب جميع الأشخاص
const fetchAllPersons = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    allPersons.value = response.data;
  } catch (error) {
    allPersons.value = [];
    alertify.error("حدث خطأ أثناء جلب بيانات الأشخاص");
  }
};

// تصفية الأشخاص الذين ليس لديهم عائلة
const personsWithoutFamily = computed(() =>
  allPersons.value.filter(
    (person) =>
      !person.familyId || person.familyId === 0 || person.familyId === null,
  ),
);

// Computed property for filtered persons based on search
const filteredPersonsWithoutFamily = computed(() => {
  if (!searchTerm.value.trim()) {
    return personsWithoutFamily.value;
  }

  const search = searchTerm.value.toLowerCase().trim();
  return personsWithoutFamily.value.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    const personId = person.id.toString();

    return fullName.includes(search) || personId.includes(search);
  });
});

onMounted(() => {
  fetchAllPersons();
});

// جلب جميع العائلات
const fetchAllFamilies = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/Family`,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    },
  );
  return response.data;
};

const getLastFamilyId = async () => {
  const families = await fetchAllFamilies();
  if (!families || families.length === 0) return null;
  // بافتراض أن آخر عائلة هي الأخيرة في القائمة
  // إذا كان هناك ترتيب حسب التاريخ يمكنك ترتيبهم هنا
  return (
    families[families.length - 1].id || families[families.length - 1].familyId
  );
};
const getPersonWithoutAssistances = (person) => {
  const { assistances, ...personWithoutAssistances } = person;
  return personWithoutAssistances;
};
// إرسال البيانات
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    alertify.warning("يرجى إدخال اسم رب الأسرة");
    return;
  }

  if (
    !formData.value.numberOfFamilyMembers ||
    formData.value.numberOfFamilyMembers < 1
  ) {
    alertify.warning("يرجى إدخال عدد الأفراد (على الأقل 1)");
    return;
  }

  loading.value = true;

  // Show loading notification
  alertify.message("جاري إضافة الأسرة...");

  try {
    // 1. أضف العائلة
    const familyData = {
      name: formData.value.name.trim(),
      numberOfFamilyMembers: formData.value.numberOfFamilyMembers,
      isHouseOwned: formData.value.isHouseOwned,
    };

    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/api/Family`,
      familyData,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    // 2. جلب جميع العائلات وأخذ id الأخيرة
    const familyId = await getLastFamilyId();
    if (!familyId) {
      throw new Error("لم يتم العثور على معرف العائلة الجديدة!");
    }

    // 3. اربط الأشخاص المختارين بالعائلة الجديدة وعدل isPartOfFamily
    for (const personId of selectedPersons.value) {
      const personData = allPersons.value.find((p) => p.id === personId);
      if (personData) {
        const updatedPerson = {
          ...getPersonWithoutAssistances(personData),
          familyId,
          isPartOfFamily: true, // تحديث الحالة
        };
        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/api/Person/${personId}`,
          updatedPerson,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    // Success notification
    alertify.success("تمت إضافة الأسرة وربط الأعضاء بنجاح");

    // Reset form
    formData.value = {
      name: "",
      numberOfFamilyMembers: 1,
      isHouseOwned: false,
    };
    selectedPersons.value = [];
    searchTerm.value = "";

    await fetchAllPersons();

    // Navigate after a short delay to show success message
    setTimeout(() => {
      router.push("/family");
    }, 1500);
  } catch (error) {
    console.error("Error adding family:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء إضافة الأسرة: ${errorMessage}`);
    } else if (error.message) {
      alertify.error(error.message);
    } else {
      alertify.error("حدث خطأ أثناء إضافة الأسرة أو ربط الأعضاء");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.section-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.form-control,
.form-select {
  text-align: right;
}

.form-control[readonly] {
  background-color: #f8f9fa;
  opacity: 1;
  cursor: not-allowed;
}

.form-check {
  text-align: right;
  padding-right: 2rem;
  padding-left: 0;
  margin-bottom: 1rem;
}

.form-check-input {
  float: right;
  margin-right: -2rem;
  margin-left: 0;
}

.form-check-label {
  padding-right: 0.5rem;
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

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.text-muted {
  font-size: 0.85rem;
  color: #6c757d !important;
}

/* Search input styles */
.search-input {
  text-align: right;
  direction: rtl;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.2rem rgba(66, 185, 131, 0.25);
}

.search-input:focus + .input-group-text {
  border-color: #42b983;
}

/* Persons list styling */
.persons-list {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #fff;
}

.persons-list .list-group-item {
  border-left: none;
  border-right: none;
  border-top: none;
}

.persons-list .list-group-item:first-child {
  border-top: none;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.persons-list .list-group-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.persons-list::-webkit-scrollbar {
  width: 8px;
}

.persons-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.persons-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.persons-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>

<style>
/* Global AlertifyJS RTL Styling - Bottom Right - Larger Size */
.alertify-notifier .ajs-message {
  direction: rtl;
  text-align: right;
  font-family: "Tajawal", sans-serif;
  font-size: 18px; /* increased from 14px */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  padding: 20px 30px; /* increased padding */
  min-width: 300px; /* increased from 250px */
  backdrop-filter: blur(10px);
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.alertify-notifier .ajs-success {
  background-color: #42b983;
  color: white;
  border: none;
  border-left-color: #2d8f5f;
}

.alertify-notifier .ajs-error {
  background-color: #dc3545;
  color: white;
  border: none;
  border-left-color: #a71e2a;
}

.alertify-notifier .ajs-warning {
  background-color: #ffc107;
  color: #212529;
  border: none;
  border-left-color: #d39e00;
}

.alertify-notifier .ajs-message {
  background-color: #17a2b8;
  color: white;
  border: none;
  border-left-color: #117a8b;
}

/* Animation improvements for bottom-right */
.alertify-notifier .ajs-message.ajs-visible {
  animation: slideInRight 0.4s ease-out;
}

.alertify-notifier .ajs-message.ajs-hidden {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Custom positioning for RTL - Bottom Right */
.alertify-notifier {
  position: fixed;
  bottom: 20px;
  right: 20px;
  left: auto;
  top: auto;
  z-index: 1050;
  max-width: 400px;
}

/* Stack notifications properly */
.alertify-notifier .ajs-message {
  position: relative;
  display: block;
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .alertify-notifier {
    right: 10px;
    left: 10px;
    bottom: 10px;
    max-width: none;
  }

  .alertify-notifier .ajs-message {
    font-size: 16px; /* increased from 13px */
    margin-bottom: 8px;
    padding: 18px 25px; /* increased padding */
    min-width: 280px;
  }
}

@media (max-width: 480px) {
  .alertify-notifier {
    right: 5px;
    left: 5px;
    bottom: 5px;
  }

  .alertify-notifier .ajs-message {
    font-size: 14px; /* increased from 12px */
    padding: 16px 20px; /* increased padding */
  }
}

/* Hover effects */
.alertify-notifier .ajs-message:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

/* Close button styling */
.alertify-notifier .ajs-message .ajs-close {
  position: absolute;
  top: 8px;
  left: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px; /* increased from 16px */
  cursor: pointer;
  transition: color 0.2s ease;
}

.alertify-notifier .ajs-message .ajs-close:hover {
  color: white;
}
</style>
