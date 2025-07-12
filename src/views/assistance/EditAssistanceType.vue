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

const API_BASE_URL = "https://charityapp.runasp.net/api";
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
      }
    );

    formData.value = {
      assistanceTypeName: response.data.assistanceTypeName,
      isFinancial: response.data.isFinancial,
      assistanceValue: response.data.assistanceValue,
    };
  } catch (error) {
    console.error("Error fetching assistance type:", error);
    alert("حدث خطأ أثناء جلب بيانات نوع المساعدة");
  }
});

const submitForm = async () => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/AssistanceType/${route.params.id}`,
      formData.value,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    if (response.status === 200) {
      alert("تم تحديث نوع المساعدة بنجاح");
      router.push("/assistance-types");
    }
  } catch (error) {
    console.error("Error updating assistance type:", error);
    alert("حدث خطأ أثناء تحديث نوع المساعدة");
  }
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
