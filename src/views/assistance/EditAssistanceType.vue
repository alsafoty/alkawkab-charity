<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold">تعديل نوع المساعدة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" class="row g-4">
          <!-- Assistance Type Name -->
          <div class="col-md-12">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">اسم نوع المساعدة</label>
              <input
                v-model="formData.assistanceTypeName"
                type="text"
                class="form-control"
                required
                placeholder="أدخل اسم نوع المساعدة"
              />
            </div>
          </div>

          <!-- Is Financial -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">نوع مالي</label>
              <div class="form-check form-switch">
                <input
                  v-model="formData.isFinancial"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="isFinancialSwitch"
                />
                <label class="form-check-label" for="isFinancialSwitch">
                  {{ formData.isFinancial ? "نعم" : "لا" }}
                </label>
              </div>
            </div>
          </div>

          <!-- Assistance Value (shown only if isFinancial is true) -->
          <div class="col-md-6" v-if="formData.isFinancial">
            <div class="form-group mb-3">
              <label class="form-label fw-bold">القيمة</label>
              <input
                v-model="formData.assistanceValue"
                type="number"
                class="form-control"
                min="0"
                step="0.01"
                required
                placeholder="أدخل قيمة المساعدة"
              />
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
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const route = useRoute();
const AUTH_TOKEN = localStorage.getItem("token");

const formData = ref({
  assistanceTypeName: "",
  isFinancial: false,
  assistanceValue: null,
});

onMounted(async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/AssistanceType/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    formData.value = {
      assistanceTypeName: response.data.assistanceTypeName,
      isFinancial: response.data.isFinancial,
      assistanceValue: response.data.assistanceValue,
    };
  } catch (error) {
    console.error("Error fetching assistance type:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب بيانات نوع المساعدة: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب بيانات نوع المساعدة");
    }
  }
});

const submitForm = async () => {
  // Form validation
  if (!formData.value.assistanceTypeName.trim()) {
    alertify.warning("يرجى إدخال اسم نوع المساعدة");
    return;
  }

  if (
    formData.value.isFinancial &&
    (!formData.value.assistanceValue || formData.value.assistanceValue <= 0)
  ) {
    alertify.warning("يرجى إدخال قيمة صحيحة للمساعدة المالية");
    return;
  }

  alertify.confirm(
    "تأكيد التحديث",
    "هل أنت متأكد من تحديث بيانات نوع المساعدة؟",
    async function () {
      // User clicked OK
      try {
        const response = await axios.put(
          `${API_BASE_URL}/AssistanceType/${route.params.id}`,
          formData.value,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          },
        );

        if (response.status === 200) {
          alertify.success("تم تحديث نوع المساعدة بنجاح");

          // Navigate after a short delay to show success message
          setTimeout(() => {
            router.push("/assistance-types");
          }, 1500);
        }
      } catch (error) {
        console.error("Error updating assistance type:", error);

        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء تحديث نوع المساعدة: ${errorMessage}`);
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء تحديث نوع المساعدة");
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
.form-control,
.form-select {
  text-align: right;
}

.form-check {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.form-check-input {
  margin-right: 0;
  margin-left: 0.5rem;
}

.btn-success {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-success:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
