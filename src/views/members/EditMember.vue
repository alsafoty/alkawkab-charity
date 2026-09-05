<template>
  <div class="container py-4" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 border-0">
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0 fw-bold">تعديل بيانات العضو</h2>
          </div>

          <div class="card-body p-4">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-success" role="status"></div>
              <p class="mt-2 text-muted">جاري تحميل البيانات...</p>
            </div>

            <form v-else @submit.prevent="submitForm" class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">الرقم الوطني</label>
                <input
                  v-model="formData.id"
                  type="text"
                  class="form-control"
                  disabled
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">الاسم الأول *</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">اسم الأب *</label>
                <input
                  v-model="formData.secondName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">اسم العائلة *</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الهاتف</label>
                <input
                  v-model="formData.phoneNumber"
                  type="tel"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">مكان الإقامة</label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="form-control"
                  placeholder="أدخل مكان الإقامة"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">رسوم الانتساب</label>
                <select v-model="formData.isMembershipPaid" class="form-select">
                  <option :value="true">مسددة</option>
                  <option :value="false">غير مسددة</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الإيصال</label>
                <input
                  v-model.number="formData.receiptNO"
                  type="number"
                  class="form-control"
                />
              </div>

              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-success btn-lg px-5 rounded-pill"
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

alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
// Node.js Backend API for Members
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const MemberAPI = API_BASE_URL + "/Member";
const AUTH_TOKEN = localStorage.getItem("token");

const loading = ref(false);

const formData = reactive({
  id: "",
  firstName: "",
  secondName: "",
  lastName: "",
  location: "",
  phoneNumber: "",
  isMembershipPaid: false,
  receiptNo: null,
});

const fetchMemberDetails = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${MemberAPI}/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    Object.assign(formData, response.data.data || response.data);
  } catch (error) {
    console.error("Error fetching member details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات العضو");
    router.back();
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  alertify.confirm(
    "تأكيد التعديل",
    "هل أنت متأكد من حفظ التعديلات؟",
    async function () {
      try {
        const payload = {
          id: formData.id,
          firstName: formData.firstName?.trim() || formData.firstName,
          secondName: formData.secondName?.trim() || formData.secondName,
          lastName: formData.lastName?.trim() || formData.lastName,
          location: formData.location?.trim() || formData.location || "",
          phoneNumber: formData.phoneNumber?.trim() || null,
          isMembershipPaid: formData.isMembershipPaid,
          receiptNo: formData.receiptNo || null,
        };

        await axios.put(`${MemberAPI}/${route.params.id}`, payload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        alertify.success("تم تحديث بيانات العضو بنجاح");
        router.push(`/view-member/${route.params.id}`);
      } catch (error) {
        console.error("Error updating member:", error);
        alertify.error("حدث خطأ أثناء تحديث البيانات");
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
  fetchMemberDetails();
});
</script>

<style scoped>
.form-control,
.form-select {
  border-radius: 8px;
  text-align: right;
}

.btn-success {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-success:hover {
  background-color: #359269;
}

* {
  font-family: "Tajawal", sans-serif;
}
</style>
