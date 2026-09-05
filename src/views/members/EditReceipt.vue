<template>
  <div class="container py-4" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 border-0">
          <div class="card-header bg-info text-white text-center py-3">
            <h2 class="mb-0 fw-bold">تعديل بيانات الإيصال</h2>
          </div>

          <div class="card-body p-4">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-info" role="status"></div>
              <p class="mt-2 text-muted">جاري تحميل البيانات...</p>
            </div>

            <form v-else @submit.prevent="submitForm" class="row g-3">
              <!-- Receipt Number (Read-only) -->
              <div class="col-md-6">
                <label class="form-label fw-bold">رقم الإيصال</label>
                <input
                  v-model="formData.receiptNo"
                  type="number"
                  class="form-control"
                  disabled
                />
              </div>

              <!-- Value -->
              <div class="col-md-6">
                <label class="form-label fw-bold">القيمة (دينار) *</label>
                <input
                  v-model.number="formData.value"
                  type="number"
                  class="form-control"
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
                  required
                />
              </div>

              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-info btn-lg px-5 rounded-pill text-white"
                >
                  <i class="bi bi-save me-1"></i>
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-secondary btn-lg px-5 rounded-pill ms-3"
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
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";
import { getApiBaseUrl, getAuthToken } from "@/utils/api";

alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
const ReceiptAPI = `${getApiBaseUrl()}/Receipt`;

const loading = ref(false);

const formData = reactive({
  receiptNo: null,
  value: null,
  year: null,
  month: null,
  paidDate: null,
  basicMemberId: null,
});

const fetchReceiptDetails = async () => {
  const token = getAuthToken();
  if (!token) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`${ReceiptAPI}/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.data || response.data;
    if (data) {
      data.receiptNo = data.receiptNo ?? data.receiptNO;
      if (data.paidDate) {
        const date = new Date(data.paidDate);
        data.paidDate = date.toISOString().split("T")[0];
      }
      Object.assign(formData, data);
    }
  } catch (error) {
    console.error("Error fetching receipt details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الإيصال");
    router.back();
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const token = getAuthToken();
  if (!token) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  alertify.confirm(
    "تأكيد التعديل",
    "هل أنت متأكد من حفظ التعديلات؟",
    async function () {
      try {
        const payload = {
          value: formData.value,
          year: formData.year,
          month: formData.month,
          paidDate: formData.paidDate || null,
          basicMemberId: formData.basicMemberId,
        };

        await axios.put(`${ReceiptAPI}/${route.params.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        alertify.success("تم تحديث بيانات الإيصال بنجاح");
        router.push(`/view-receipt/${route.params.id}`);
      } catch (error) {
        console.error("Error updating receipt:", error);
        const errorMsg =
          error.response?.data?.message || "حدث خطأ أثناء تحديث البيانات";
        alertify.error(errorMsg);
      }
    },
    function () {
      alertify.message("تم إلغاء عملية التعديل");
    },
  );
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchReceiptDetails();
});
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
}

.btn-info:hover {
  background-color: #138496;
}

* {
  font-family: "Tajawal", sans-serif;
}
</style>
