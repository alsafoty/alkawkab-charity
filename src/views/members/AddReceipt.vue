<template>
  <div class="container py-4" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 border-0">
          <!-- Header -->
          <div class="card-header bg-info text-white text-center py-3">
            <h2 class="mb-0 fw-bold">إضافة إيصال جديد</h2>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="submitForm" class="row g-3">
              <!-- Receipt Number -->
              <div class="col-md-6">
                <label class="form-label fw-bold">رقم الإيصال *</label>
                <input
                  v-model.number="formData.receiptNo"
                  type="number"
                  class="form-control"
                  placeholder="أدخل رقم الإيصال"
                  required
                />
              </div>

              <!-- Value -->
              <div class="col-md-6">
                <label class="form-label fw-bold">القيمة (دينار) *</label>
                <input
                  v-model.number="formData.value"
                  type="number"
                  class="form-control"
                  placeholder="أدخل القيمة"
                  required
                  min="0"
                />
              </div>

              <!-- Year -->
              <div class="col-md-6">
                <label class="form-label fw-bold">السنة *</label>
                <input
                  v-model.number="formData.year"
                  type="number"
                  class="form-control"
                  placeholder="أدخل السنة (مثال: 2026)"
                  required
                  min="1900"
                  max="2100"
                />
              </div>

              <!-- Month -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الشهر *</label>
                <select
                  v-model.number="formData.month"
                  class="form-select"
                  required
                >
                  <option value="" disabled>اختر الشهر</option>
                  <option value="1">يناير</option>
                  <option value="2">فبراير</option>
                  <option value="3">مارس</option>
                  <option value="4">أبريل</option>
                  <option value="5">مايو</option>
                  <option value="6">يونيو</option>
                  <option value="7">يوليو</option>
                  <option value="8">أغسطس</option>
                  <option value="9">سبتمبر</option>
                  <option value="10">أكتوبر</option>
                  <option value="11">نوفمبر</option>
                  <option value="12">ديسمبر</option>
                </select>
              </div>

              <!-- Paid Date -->
              <div class="col-md-6">
                <label class="form-label fw-bold">تاريخ الدفع</label>
                <input
                  v-model="formData.paidDate"
                  type="date"
                  class="form-control"
                />
              </div>

              <!-- Basic Member ID -->
              <div class="col-md-6">
                <label class="form-label fw-bold">رقم العضو الأساسي *</label>
                <input
                  v-model.number="formData.basicMemberId"
                  type="number"
                  class="form-control"
                  placeholder="أدخل رقم العضو"
                  required
                />
              </div>

              <!-- Submit Buttons -->
              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-info btn-lg px-5 rounded-pill shadow-sm text-white"
                >
                  <i class="bi bi-save me-1"></i>
                  حفظ الإيصال
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
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";
import { getApiBaseUrl, getAuthToken } from "@/utils/api";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const ReceiptAPI = `${getApiBaseUrl()}/Receipt`;

const formData = reactive({
  receiptNo: null,
  value: null,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  paidDate: null,
  basicMemberId: null,
});

const submitForm = async () => {
  const token = getAuthToken();
  if (!token) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  // Validation
  if (
    !formData.receiptNo ||
    !formData.value ||
    !formData.year ||
    !formData.month ||
    !formData.basicMemberId
  ) {
    alertify.warning("الرجاء ملء جميع الحقول الإلزامية");
    return;
  }

  try {
    const payload = {
      receiptNo: formData.receiptNo,
      value: formData.value,
      year: formData.year,
      month: formData.month,
      paidDate: formData.paidDate || null,
      basicMemberId: formData.basicMemberId,
    };

    await axios.post(ReceiptAPI, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    alertify.success("تم إضافة الإيصال بنجاح");
    router.push("/receipts");
  } catch (error) {
    console.error("Error adding receipt:", error);
    if (error.response) {
      const errorMsg =
        error.response.data?.message ||
        error.response.data?.title ||
        error.response.statusText ||
        "حدث خطأ في السيرفر";
      alertify.error(`فشل في إضافة الإيصال: ${errorMsg}`);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      alertify.error("لم يتم الاتصال بالسيرفر. تحقق من الاتصال بالإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء إضافة الإيصال");
    }
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.form-control,
.form-select {
  border-radius: 8px;
  text-align: right;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  transition: all 0.3s ease;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
  transform: translateY(-2px);
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
