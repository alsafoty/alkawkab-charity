<template>
  <div class="container my-4" dir="rtl">
    <div class="card border-0 shadow rounded-4 overflow-hidden">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold text-center">إضافة أسرة جديدة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" class="row g-4">
          <!-- معلومات الأسرة الأساسية -->
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
                    <label class="form-label fw-bold mb-2">حالة السكن</label>
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
          <div class="col-12 mb-4">
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
                    <label class="form-label fw-bold">رقم الهوية *</label>
                    <input
                      v-model="headOfFamily.id"
                      type="text"
                      class="form-control shadow-sm"
                      placeholder="أدخل رقم الهوية"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold">الجنس *</label>
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
                    <label class="form-label fw-bold">المستوى التعليمي *</label>
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

          <!-- بيانات أفراد الأسرة -->
          <div class="col-12 mb-4">
            <div class="section-card p-4 rounded-3 bg-light">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4 class="section-title mb-0 text-success">
                  <i class="bi bi-people me-2"></i>
                  بيانات أفراد الأسرة (اختياري)
                </h4>
                <button
                  type="button"
                  class="btn btn-success btn-sm"
                  @click="addFamilyMember"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  إضافة فرد
                </button>
              </div>

              <div
                v-if="familyMembers.length === 0"
                class="text-muted text-center p-3"
              >
                لم يتم إضافة أفراد بعد. يمكنك إضافة أفراد الأسرة بالضغط على الزر
                أعلاه.
              </div>

              <div
                v-for="(member, index) in familyMembers"
                :key="index"
                class="member-card mb-4 p-4 bg-white rounded-3 border"
              >
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h5 class="mb-0 text-secondary">
                    <i class="bi bi-person me-2"></i>
                    الفرد رقم {{ index + 1 }}
                  </h5>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeFamilyMember(index)"
                  >
                    <i class="bi bi-trash me-1"></i>
                    حذف
                  </button>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label fw-bold">رقم الهوية *</label>
                      <input
                        v-model="member.id"
                        type="text"
                        class="form-control shadow-sm"
                        placeholder="أدخل رقم الهوية"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label fw-bold">الجنس *</label>
                      <select
                        v-model="member.gender"
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
                        v-model="member.firstName"
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
                        v-model="member.secondName"
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
                        v-model="member.thirdName"
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
                        v-model="member.lastName"
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
                        v-model="member.phoneNumber"
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
                        v-model="member.educationalLevel"
                        type="text"
                        class="form-control shadow-sm"
                        placeholder="المستوى التعليمي"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label fw-bold">الوظيفة</label>
                      <input
                        v-model="member.job"
                        type="text"
                        class="form-control shadow-sm"
                        placeholder="الوظيفة"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <div class="d-flex gap-3 pt-4">
                        <div class="form-check">
                          <input
                            v-model="member.isWidow"
                            class="form-check-input"
                            type="checkbox"
                            :id="'isWidow-' + index"
                          />
                          <label
                            class="form-check-label"
                            :for="'isWidow-' + index"
                          >
                            أرملة
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            v-model="member.isOrphan"
                            class="form-check-input"
                            type="checkbox"
                            :id="'isOrphan-' + index"
                          />
                          <label
                            class="form-check-label"
                            :for="'isOrphan-' + index"
                          >
                            يتيم
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- إضافة أعضاء من القائمة السابقة -->
          <div class="col-12 mb-4">
            <div class="section-card p-4 rounded-3 bg-light">
              <div class="form-check mb-3">
                <input
                  v-model="showExistingPersonsList"
                  class="form-check-input"
                  type="checkbox"
                  id="showExistingPersonsList"
                />
                <label
                  class="form-check-label fw-bold"
                  for="showExistingPersonsList"
                >
                  إضافة أفراد من قائمة الأشخاص المضافين مسبقاً
                </label>
              </div>

              <div v-if="showExistingPersonsList">
                <h4 class="section-title mb-4 text-success">
                  اختيار أشخاص من القائمة
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
  isHouseOwned: false,
});

// بيانات رب الأسرة
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
});

// بيانات أفراد الأسرة
const familyMembers = ref([]);

// متغيرات القائمة الموجودة مسبقاً
const allPersons = ref([]);
const selectedPersons = ref([]);
const showExistingPersonsList = ref(false);
const loading = ref(false);
const searchTerm = ref("");

// إضافة فرد جديد
const addFamilyMember = () => {
  familyMembers.value.push({
    id: "",
    gender: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    lastName: "",
    phoneNumber: "",
    educationalLevel: "",
    job: "",
    isWidow: false,
    isOrphan: false,
  });
};

// حذف فرد
const removeFamilyMember = (index) => {
  familyMembers.value.splice(index, 1);
};

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
  // التحقق من البيانات الأساسية
  if (!formData.value.name.trim()) {
    alertify.warning("يرجى إدخال اسم الأسرة");
    return;
  }

  // التحقق من بيانات رب الأسرة
  if (!headOfFamily.value.id.trim()) {
    alertify.warning("يرجى إدخال رقم هوية رب الأسرة");
    return;
  }

  if (!headOfFamily.value.gender) {
    alertify.warning("يرجى اختيار جنس رب الأسرة");
    return;
  }

  if (
    !headOfFamily.value.firstName.trim() ||
    !headOfFamily.value.secondName.trim() ||
    !headOfFamily.value.thirdName.trim() ||
    !headOfFamily.value.lastName.trim()
  ) {
    alertify.warning("يرجى إدخال الاسم الكامل لرب الأسرة");
    return;
  }

  if (!headOfFamily.value.educationalLevel.trim()) {
    alertify.warning("يرجى إدخال المستوى التعليمي لرب الأسرة");
    return;
  }

  loading.value = true;
  alertify.message("جاري إضافة الأسرة...");

  try {
    // 1. حساب عدد الأفراد
    const totalMembers =
      1 + familyMembers.value.length + selectedPersons.value.length;

    // 2. أضف العائلة
    const familyData = {
      name: formData.value.name.trim(),
      numberOfFamilyMembers: totalMembers,
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

    // 3. جلب معرف العائلة الجديدة
    const familyId = await getLastFamilyId();
    if (!familyId) {
      throw new Error("لم يتم العثور على معرف العائلة الجديدة!");
    }

    // 4. إضافة رب الأسرة
    const headData = {
      id: headOfFamily.value.id.trim(),
      gender: headOfFamily.value.gender,
      firstName: headOfFamily.value.firstName.trim(),
      secondName: headOfFamily.value.secondName.trim(),
      thirdName: headOfFamily.value.thirdName.trim(),
      lastName: headOfFamily.value.lastName.trim(),
      phoneNumber: headOfFamily.value.phoneNumber?.trim() || null,
      educationalLevel: headOfFamily.value.educationalLevel.trim(),
      job: headOfFamily.value.job?.trim() || null,
      isPartOfFamily: true,
      isWidow: false,
      isOrphan: false,
      guardianId: null,
    };

    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person/AddPersonInFamily?familyId=${familyId}`,
      headData,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    // 5. إضافة أفراد الأسرة الجدد
    for (const member of familyMembers.value) {
      const memberData = {
        id: member.id.trim(),
        gender: member.gender,
        firstName: member.firstName.trim(),
        secondName: member.secondName.trim(),
        thirdName: member.thirdName.trim(),
        lastName: member.lastName.trim(),
        phoneNumber: member.phoneNumber?.trim() || null,
        educationalLevel: member.educationalLevel.trim(),
        job: member.job?.trim() || null,
        isPartOfFamily: true,
        isWidow: member.isWidow,
        isOrphan: member.isOrphan,
        guardianId: null,
      };

      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/Person/AddPersonInFamily?familyId=${familyId}`,
        memberData,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // 6. ربط الأشخاص المختارين من القائمة
    for (const personId of selectedPersons.value) {
      const personData = allPersons.value.find((p) => p.id === personId);
      if (personData) {
        const updatedPerson = {
          ...getPersonWithoutAssistances(personData),
          familyId,
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

    // نجاح العملية
    alertify.success("تمت إضافة الأسرة وجميع الأعضاء بنجاح");

    // إعادة تعيين النموذج
    formData.value = {
      name: "",
      isHouseOwned: false,
    };
    headOfFamily.value = {
      id: "",
      gender: "",
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      phoneNumber: "",
      educationalLevel: "",
      job: "",
    };
    familyMembers.value = [];
    selectedPersons.value = [];
    searchTerm.value = "";
    showExistingPersonsList.value = false;

    await fetchAllPersons();

    // الانتقال إلى صفحة العائلات
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
      alertify.error("حدث خطأ أثناء إضافة الأسرة أو الأعضاء");
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

/* Member card styling */
.member-card {
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef !important;
}

.member-card:hover {
  border-color: #42b983 !important;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

/* Border highlight for head of family section */
.border-2 {
  border-width: 2px !important;
}

.border-success {
  border-color: #42b983 !important;
}

/* Animation for adding members */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.member-card {
  animation: slideIn 0.3s ease;
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
