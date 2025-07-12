<template>
  <div class="container my-4" dir="rtl">
    <div class="card border-0 shadow rounded-4 overflow-hidden">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold text-center">إضافة عائلة جديدة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" class="row g-4">
          <!-- معلومات العائلة الأساسية -->
          <div class="col-12 mb-4">
            <div class="section-card p-4 rounded-3 bg-light">
              <h4 class="section-title mb-4 text-success">
                معلومات العائلة الأساسية
              </h4>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold">اسم العائلة</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="form-control shadow-sm"
                      placeholder="أدخل اسم العائلة"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-3">
                    <label class="form-label fw-bold">عدد أفراد العائلة</label>
                    <input
                      :value="calculatedMemberCount"
                      type="number"
                      class="form-control shadow-sm"
                      readonly
                      placeholder="سيتم حسابه تلقائياً"
                      title="سيتم حساب عدد الأفراد تلقائياً عند إضافة أعضاء للعائلة"
                    />
                    <small class="text-muted">
                      سيتم حساب عدد الأفراد تلقائياً عند إضافة أعضاء للعائلة
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
                إضافة أعضاء للعائلة
              </h4>
              <div class="mb-2 text-muted">
                اختر الأشخاص الذين تريد إضافتهم لهذه العائلة:
              </div>
              <div
                class="list-group mb-2"
                style="max-height: 300px; overflow-y: auto"
              >
                <div
                  v-for="person in personsWithoutFamily"
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
                  v-if="personsWithoutFamily.length === 0"
                  class="text-danger p-2"
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
              إضافة العائلة
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

const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const formData = ref({
  name: "",
  isHouseOwned: false,
});

const allPersons = ref([]);
const selectedPersons = ref([]);
const loading = ref(false);

// جلب جميع الأشخاص
const fetchAllPersons = async () => {
  try {
    const response = await axios.get(
      "https://charityapp.runasp.net/api/Person",
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    allPersons.value = response.data;
  } catch (error) {
    allPersons.value = [];
  }
};

// تصفية الأشخاص الذين ليس لديهم عائلة
const personsWithoutFamily = computed(() =>
  allPersons.value.filter(
    (person) =>
      !person.familyId || person.familyId === 0 || person.familyId === null
  )
);

// حساب عدد الأعضاء المختارين
const calculatedMemberCount = computed(() => selectedPersons.value.length);

onMounted(() => {
  fetchAllPersons();
});

// جلب جميع العائلات
const fetchAllFamilies = async () => {
  const response = await axios.get("https://charityapp.runasp.net/api/Family", {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });
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

// إرسال البيانات
const submitForm = async () => {
  if (!formData.value.name.trim()) {
    alert("يرجى إدخال اسم العائلة");
    return;
  }

  loading.value = true;

  try {
    // 1. أضف العائلة
    const familyData = {
      name: formData.value.name.trim(),
      isHouseOwned: formData.value.isHouseOwned,
    };

    await axios.post("https://charityapp.runasp.net/api/Family", familyData, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // 2. جلب جميع العائلات وأخذ id الأخيرة
    const familyId = await getLastFamilyId();
    if (!familyId) throw new Error("لم يتم العثور على معرف العائلة الجديدة!");

    // 3. اربط الأشخاص المختارين بالعائلة الجديدة وعدل isPartOfFamily
    for (const personId of selectedPersons.value) {
      const personData = allPersons.value.find((p) => p.id === personId);
      if (personData) {
        const updatedPerson = {
          ...personData,
          familyId,
          isPartOfFamily: true, // تحديث الحالة
        };
        await axios.put(
          `https://charityapp.runasp.net/api/Person/${personId}`,
          updatedPerson,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    alert("تمت إضافة العائلة وربط الأعضاء بنجاح");
    formData.value = { name: "", isHouseOwned: false };
    selectedPersons.value = [];
    await fetchAllPersons();
    router.push("/family");
  } catch (error) {
    console.error("Error adding family:", error);
    if (error.response) {
      alert(
        `حدث خطأ أثناء إضافة العائلة أو ربط الأعضاء: ${
          error.response.data.message || error.response.statusText
        }`
      );
    } else {
      alert("حدث خطأ أثناء إضافة العائلة أو ربط الأعضاء");
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

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
