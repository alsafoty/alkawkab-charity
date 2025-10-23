<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold">تعديل المساعدة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" class="row g-4">
          <!-- Selection Mode -->
          <div class="col-12">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">طريقة الاختيار</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="selectionMode"
                    id="familyMode"
                    value="family"
                    v-model="selectionMode"
                    @change="resetSelection"
                  />
                  <label class="form-check-label" for="familyMode">
                    عائلة
                  </label>
                </div>
                <div class="form-check">
                  <label class="form-check-label" for="personMode">
                    شخص منفرد
                  </label>
                  <input
                    class="form-check-input"
                    type="radio"
                    name="selectionMode"
                    id="personMode"
                    value="person"
                    v-model="selectionMode"
                    @change="resetSelection"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Family Selection -->
          <div class="col-md-6" v-if="selectionMode === 'family'">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">العائلة</label>
              <select
                v-model="formData.familyId"
                class="form-select"
                required
                @change="loadFamilyMembers"
              >
                <option value="" disabled>اختر العائلة</option>
                <option
                  v-for="family in families"
                  :key="family.familyId"
                  :value="family.familyId"
                >
                  {{ family.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Individual Person Selection -->
          <div class="col-md-6" v-if="selectionMode === 'person'">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">الشخص</label>
              <select v-model="formData.personId" class="form-select" required>
                <option value="" disabled>اختر الشخص</option>
                <option
                  v-for="person in allPersons"
                  :key="person.id"
                  :value="person.id"
                >
                  {{ person.firstName }} {{ person.lastName }}
                </option>
              </select>
            </div>
          </div>

          <!-- Assistance Type -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">نوع المساعدة</label>
              <select
                v-model="formData.assistanceTypeId"
                class="form-select"
                required
              >
                <option :value="null" disabled>اختر نوع المساعدة</option>
                <option
                  v-for="type in assistanceTypes"
                  :key="type.assistanceTypeId"
                  :value="type.assistanceTypeId"
                >
                  {{ type.assistanceTypeName }}
                </option>
              </select>
            </div>
          </div>

          <!-- Number of Assistance -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">عدد المساعدات</label>
              <input
                v-model="formData.numberOfAssistance"
                type="number"
                class="form-control"
                min="1"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">حالة الاستلام</label>
              <div class="form-check form-switch">
                <input
                  v-model="formData.received"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="isReceived"
                />
                <label class="form-check-label" for="isReceived">
                  {{ formData.received ? "نعم" : "لا" }}
                </label>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="col-12">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">ملاحظات</label>
              <textarea
                v-model="formData.note"
                class="form-control"
                rows="3"
                placeholder="أضف أي ملاحظات إضافية هنا..."
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="col-12 text-center mt-4">
            <button type="submit" class="btn btn-success btn-lg px-5">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const route = useRoute();
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const families = ref([]);
const familyMembers = ref([]);
const assistanceTypes = ref([]);
const allPersons = ref([]);
const selectionMode = ref("family");

const formData = ref({
  numberOfAssistance: 1,
  familyId: 0,
  personId: "",
  assistanceTypeId: null,
  note: "",
});

onMounted(async () => {
  await loadInitialData();
  await loadAssistanceData();
});

const loadInitialData = async () => {
  try {
    alertify.message("جاري تحميل البيانات الأولية...");

    // جلب العائلات
    const familyResponse = await axios.get(`${API_BASE_URL}/Family`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    families.value = familyResponse.data;

    // جلب أنواع المساعدات من الـ API
    const assistanceTypesResponse = await axios.get(
      `${API_BASE_URL}/AssistanceType`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    assistanceTypes.value = assistanceTypesResponse.data;

    // جلب جميع الأشخاص
    const personsResponse = await axios.get(`${API_BASE_URL}/Person`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    allPersons.value = personsResponse.data;

    alertify.success("تم تحميل البيانات الأولية بنجاح");
  } catch (error) {
    console.error("Error fetching initial data:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب البيانات الأولية: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب البيانات الأولية");
    }
  }
};

const loadAssistanceData = async () => {
  try {
    alertify.message("جاري تحميل بيانات المساعدة...");

    // جلب بيانات المساعدة الحالية
    const assistanceResponse = await axios.get(
      `${API_BASE_URL}/Assistance/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    const assistanceData = assistanceResponse.data;

    // تحديد نمط الاختيار بناءً على البيانات الموجودة
    if (assistanceData.personId && !assistanceData.familyId) {
      selectionMode.value = "person";
    } else {
      selectionMode.value = "family";
    }

    formData.value = {
      numberOfAssistance: assistanceData.numberOfAssistance,
      familyId: assistanceData.familyId || 0,
      personId: assistanceData.personId || "",
      assistanceTypeId: assistanceData.assistanceTypeId,
      note: assistanceData.note || "",
      received: assistanceData.received || false,
    };

    // تحميل أعضاء العائلة إذا كانت المساعدة للعائلة
    if (formData.value.familyId && selectionMode.value === "family") {
      await loadFamilyMembers();
    }

    alertify.success("تم تحميل بيانات المساعدة بنجاح");
  } catch (error) {
    console.error("Error fetching assistance data:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات المساعدة: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات المساعدة");
    }
  }
};

const loadFamilyMembers = async () => {
  if (!formData.value.familyId) {
    familyMembers.value = [];
    return;
  }

  try {
    alertify.message("جاري تحميل أعضاء العائلة...");

    const response = await axios.get(
      `${API_BASE_URL}/Family/${formData.value.familyId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    familyMembers.value = response.data.familyMembers || [];

    if (familyMembers.value.length > 0) {
      alertify.success(`تم تحميل ${familyMembers.value.length} عضو من العائلة`);
    } else {
      alertify.message("لا يوجد أعضاء في هذه العائلة");
    }
  } catch (error) {
    console.error("Error fetching family members:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات أفراد العائلة: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات أفراد العائلة");
    }
  }
};

const resetSelection = () => {
  // لا نريد إعادة تعيين البيانات في وضع التعديل
  // فقط نقوم بتنظيف الحقول غير المستخدمة
  if (selectionMode.value === "family") {
    formData.value.personId = "";
  } else {
    formData.value.familyId = 0;
  }
  familyMembers.value = [];
};

const submitForm = async () => {
  // التحقق من صحة البيانات
  if (!formData.value.assistanceTypeId) {
    alertify.warning("يرجى اختيار نوع المساعدة");
    return;
  }

  if (
    !formData.value.numberOfAssistance ||
    formData.value.numberOfAssistance < 1
  ) {
    alertify.warning("يرجى إدخال عدد صحيح للمساعدات");
    return;
  }

  if (
    selectionMode.value === "family" &&
    (!formData.value.familyId || formData.value.familyId === 0)
  ) {
    alertify.warning("يرجى اختيار عائلة");
    return;
  }

  if (selectionMode.value === "person" && !formData.value.personId) {
    alertify.warning("يرجى اختيار شخص");
    return;
  }

  alertify.confirm(
    "تأكيد التحديث",
    "هل أنت متأكد من تحديث بيانات المساعدة؟",
    async function () {
      // User clicked OK
      try {
        alertify.message("جاري تحديث المساعدة...");

        const dataToSend = {
          numberOfAssistance: Number(formData.value.numberOfAssistance),
          familyId:
            selectionMode.value === "family"
              ? Number(formData.value.familyId)
              : null,
          personId: formData.value.personId || null,
          assistanceTypeId: Number(formData.value.assistanceTypeId),
          note: String(formData.value.note || ""),
          received: formData.value.received,
        };

        console.log("Data to send:", dataToSend);

        const response = await axios.put(
          `${API_BASE_URL}/Assistance/${route.params.id}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alertify.success("تم تحديث المساعدة بنجاح");

          // Navigate after a short delay to show success message
          setTimeout(() => {
            router.push("/assistance");
          }, 1500);
        }
      } catch (error) {
        console.error("Error updating assistance:", error);

        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء تحديث المساعدة: ${errorMessage}`);
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت"
          );
        } else {
          alertify.error("حدث خطأ أثناء تحديث المساعدة");
        }
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية التحديث");
    }
  );
};
</script>

<style scoped>
.form-control,
.form-select {
  text-align: right;
}

.btn-success {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-success:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

.form-check-input:checked {
  background-color: #42b983;
  border-color: #42b983;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
