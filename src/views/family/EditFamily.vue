<template>
  <div class="container py-4 theme-container" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 overflow-hidden border-0">
          <!-- Green Header -->
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0">تعديل بيانات الأسرة</h2>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="submitForm" class="row g-4">
              <!-- Basic Family Information Section -->
              <div class="col-12 mb-4">
                <div class="section-card p-4 rounded-3 bg-light">
                  <h4 class="section-title mb-4 text-success">
                    معلومات الأسرة الأساسية
                  </h4>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">اسم الأسرة</label>
                        <input
                          v-model="formData.name"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="أدخل اسم الأسرة"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold mb-2"
                          >حالة السكن</label
                        >
                        <div class="house-status p-3 bg-white rounded-3 border">
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

              <!-- بيانات رب الأسرة -->
              <div class="col-12 mb-4" v-if="headOfFamily.id">
                <div
                  class="section-card p-4 rounded-3 bg-light border-2 border-success"
                >
                  <h4 class="section-title mb-4 text-success">
                    <i class="bi bi-person-badge me-2"></i>
                    بيانات رب الأسرة
                  </h4>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">الرقم الوطني</label>
                        <input
                          v-model="headOfFamily.id"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="الرقم الوطني"
                          readonly
                          disabled
                        />
                        <small class="text-muted"
                          >لا يمكن تعديل الرقم الوطني</small
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">الجنس</label>
                        <select
                          v-model="headOfFamily.gender"
                          class="form-control shadow-sm"
                          required
                        >
                          <option value="">اختر الجنس</option>
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">الاسم الأول *</label>
                        <input
                          v-model="headOfFamily.firstName"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="الاسم الأول"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">اسم الأب *</label>
                        <input
                          v-model="headOfFamily.secondName"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="اسم الأب"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">اسم الجد *</label>
                        <input
                          v-model="headOfFamily.thirdName"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="اسم الجد"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">اسم العائلة *</label>
                        <input
                          v-model="headOfFamily.lastName"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="اسم العائلة"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">رقم الهاتف</label>
                        <input
                          v-model="headOfFamily.phoneNumber"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="رقم الهاتف"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold"
                          >المستوى التعليمي *</label
                        >
                        <input
                          v-model="headOfFamily.educationalLevel"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="المستوى التعليمي"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group mb-3">
                        <label class="form-label fw-bold">الوظيفة</label>
                        <input
                          v-model="headOfFamily.job"
                          type="text"
                          class="form-control shadow-sm"
                          placeholder="الوظيفة"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- إدارة أعضاء العائلة -->
              <div class="col-12 mb-4">
                <div class="section-card p-4 rounded-3 bg-light">
                  <h4 class="section-title mb-4 text-success">
                    إدارة أعضاء الأسرة
                  </h4>
                  <!-- الأعضاء الحاليون -->
                  <div class="mb-3">
                    <div class="fw-bold mb-2">أعضاء الأسرة الحاليون:</div>
                    <div v-if="currentMembers.length === 0" class="text-danger">
                      لا يوجد أعضاء.
                    </div>
                    <ul class="list-group">
                      <li
                        v-for="person in currentMembers"
                        :key="person.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {{ person.firstName }} {{ person.lastName }} (رقم:
                          {{ person.id }})
                        </span>
                        <div class="btn-group" role="group">
                          <button
                            type="button"
                            class="btn btn-outline-primary btn-sm"
                            @click="editPerson(person)"
                          >
                            <i class="bi bi-pencil-square me-1"></i>
                            تعديل
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            @click="removeMember(person)"
                            :disabled="removingIds.includes(person.id)"
                          >
                            <i class="bi bi-trash me-1"></i>
                            إزالة
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- إضافة أعضاء جدد -->
                  <div class="mt-4">
                    <div class="fw-bold mb-2">إضافة أشخاص للأسرة:</div>

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
                        يمكنك البحث بالاسم الأول أو الأخير أو الرقم الوطني
                      </small>
                    </div>

                    <div
                      class="list-group persons-list"
                      style="max-height: 250px; overflow-y: auto"
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
                            :id="'add-person-' + person.id"
                            :value="person.id"
                            v-model="selectedToAdd"
                          />
                          <label
                            class="form-check-label"
                            :for="'add-person-' + person.id"
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
                        لا يوجد أشخاص متاحون للإضافة.
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedToAdd.length > 0"
                    class="alert alert-success p-2 mt-2"
                  >
                    سيتم إضافة {{ selectedToAdd.length }} شخص عند الحفظ.
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const formData = ref({
  name: "",
  numberOfFamilyMembers: 1,
  isHouseOwned: false,
});

const headOfFamily = ref({
  id: "",
  gender: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  phoneNumber: "",
  educationalLevel: "",
  job: "",
  isPartOfFamily: true,
  isWidow: false,
  isOrphan: false,
  guardianId: null,
});

const allPersons = ref([]);
const currentMembers = ref([]);
const personsWithoutFamily = ref([]);
const selectedToAdd = ref([]);
const removingIds = ref([]);
const loading = ref(false);
const searchTerm = ref("");

// Helper function to exclude assistances from person object
const getPersonWithoutAssistances = (person) => {
  const { assistances, ...personWithoutAssistances } = person;
  return personWithoutAssistances;
};

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

const fetchFamilyAndMembers = async () => {
  try {
    // جلب بيانات العائلة
    const familyRes = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Family/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      },
    );
    formData.value = {
      name: familyRes.data.name || "",
      numberOfFamilyMembers: familyRes.data.numberOfFamilyMembers || 1,
      isHouseOwned: familyRes.data.isHouseOwned || false,
    };

    // جلب جميع الأشخاص
    const personsRes = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      },
    );
    allPersons.value = personsRes.data;

    // تصفية أعضاء العائلة الحاليين
    currentMembers.value = allPersons.value.filter(
      (p) => p.familyId == route.params.id,
    );

    // جلب بيانات رب الأسرة (أول عضو)
    if (
      familyRes.data.familyMembers &&
      familyRes.data.familyMembers.length > 0
    ) {
      const headId = familyRes.data.familyMembers[0];
      try {
        const headRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/api/Person/${headId}`,
          {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          },
        );
        headOfFamily.value = {
          id: headRes.data.id || "",
          gender: headRes.data.gender || "",
          firstName: headRes.data.firstName || "",
          secondName: headRes.data.secondName || "",
          thirdName: headRes.data.thirdName || "",
          lastName: headRes.data.lastName || "",
          phoneNumber: headRes.data.phoneNumber || "",
          educationalLevel: headRes.data.educationalLevel || "",
          job: headRes.data.job || "",
          isPartOfFamily: headRes.data.isPartOfFamily,
          isWidow: headRes.data.isWidow,
          isOrphan: headRes.data.isOrphan,
          guardianId: headRes.data.guardianId,
          familyId: headRes.data.familyId,
        };
      } catch (error) {
        console.error("Error fetching head of family:", error);
        alertify.warning("تعذر جلب بيانات رب الأسرة");
      }
    }

    // تصفية الأشخاص غير المنتمين لأي عائلة
    personsWithoutFamily.value = allPersons.value.filter(
      (p) => !p.familyId || p.familyId === 0 || p.familyId === null,
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الأسرة أو الأعضاء");
    router.push("/family");
  }
};

onMounted(fetchFamilyAndMembers);

// الانتقال إلى صفحة تعديل بيانات الفرد
const editPerson = (person) => {
  router.push(`/edit-person/${person.id}`);
};

// إزالة عضو من العائلة
const removeMember = async (person) => {
  alertify.confirm(
    "تأكيد الإزالة",
    `هل أنت متأكد من إزالة ${person.firstName} ${person.lastName} من العائلة؟`,
    async function () {
      // User clicked OK
      removingIds.value.push(person.id);
      try {
        // استخدام البيانات بدون المساعدات
        const updatedPerson = {
          ...getPersonWithoutAssistances(person),
          familyId: null,
          isPartOfFamily: false,
        };

        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/api/Person/${person.id}`,
          updatedPerson,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

        alertify.success(
          `تم إزالة ${person.firstName} ${person.lastName} من الأسرة بنجاح`,
        );
        // حدث القوائم
        await fetchFamilyAndMembers();
      } catch (error) {
        console.error("Error removing member:", error);
        alertify.error("حدث خطأ أثناء إزالة العضو");
      } finally {
        removingIds.value = removingIds.value.filter((id) => id !== person.id);
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الإزالة");
    },
  );
};

// حفظ التعديلات
const submitForm = async () => {
  loading.value = true;

  try {
    // 1. تحديث بيانات رب الأسرة
    if (headOfFamily.value.id) {
      const updatedHead = {
        ...getPersonWithoutAssistances(headOfFamily.value),
        gender: headOfFamily.value.gender,
        firstName: headOfFamily.value.firstName,
        secondName: headOfFamily.value.secondName,
        thirdName: headOfFamily.value.thirdName,
        lastName: headOfFamily.value.lastName,
        phoneNumber: headOfFamily.value.phoneNumber || null,
        educationalLevel: headOfFamily.value.educationalLevel,
        job: headOfFamily.value.job || null,
        familyId: parseInt(route.params.id),
        isPartOfFamily: true,
      };

      await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/api/Person/${headOfFamily.value.id}`,
        updatedHead,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // 2. تحديث بيانات العائلة
    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/api/Family/${route.params.id}`,
      {
        name: formData.value.name,
        numberOfFamilyMembers: formData.value.numberOfFamilyMembers,
        isHouseOwned: formData.value.isHouseOwned,
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    // 3. إضافة الأعضاء الجدد
    for (const personId of selectedToAdd.value) {
      const person = allPersons.value.find((p) => p.id === personId);
      if (person) {
        // استخدام البيانات بدون المساعدات
        const updatedPerson = {
          ...getPersonWithoutAssistances(person),
          familyId: parseInt(route.params.id),
          isPartOfFamily: true,
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

    alertify.success("تم حفظ التعديلات بنجاح");
    selectedToAdd.value = [];
    searchTerm.value = "";
    await fetchFamilyAndMembers();

    // Navigate after a short delay to show success message
    setTimeout(() => {
      router.push("/family");
    }, 1500);
  } catch (error) {
    console.error("Error updating family:", error);
    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء حفظ التعديلات: ${errorMessage}`);
    } else {
      alertify.error("حدث خطأ أثناء حفظ التعديلات");
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
