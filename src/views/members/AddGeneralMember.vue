<template>
  <div class="container py-4" dir="rtl">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-lg rounded-4 border-0">
          <!-- Header -->
          <div class="card-header bg-success text-white text-center py-3">
            <h2 class="mb-0 fw-bold">إضافة عضو جمعية عمومية</h2>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="submitForm" class="row g-3">
              <!-- Member ID -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الرقم الوطني *</label>
                <input
                  v-model="formData.id"
                  type="text"
                  class="form-control"
                  placeholder="أدخل الرقم الوطني"
                  required
                />
              </div>

              <!-- First Name -->
              <div class="col-md-6">
                <label class="form-label fw-bold">الاسم الأول *</label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل الاسم الأول"
                  required
                />
              </div>

              <!-- Second Name -->
              <div class="col-md-6">
                <label class="form-label fw-bold">اسم الأب *</label>
                <input
                  v-model="formData.secondName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل اسم الأب"
                  required
                />
              </div>

              <!-- Last Name -->
              <div class="col-md-6">
                <label class="form-label fw-bold">اسم العائلة *</label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  class="form-control"
                  placeholder="أدخل اسم العائلة"
                  required
                />
              </div>

              <!-- Phone Number -->
              <div class="col-md-6">
                <label class="form-label">رقم الهاتف</label>
                <input
                  v-model="formData.phoneNumber"
                  type="tel"
                  class="form-control"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>

              <!-- Location -->
              <div class="col-md-6">
                <label class="form-label fw-bold">مكان الإقامة *</label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="form-control"
                  placeholder="أدخل مكان الإقامة"
                  required
                />
              </div>

              <!-- Is Administrative Member -->
              <div class="col-md-6">
                <label class="form-label fw-bold">عضو إداري</label>
                <select
                  v-model="formData.isAdministrativeMember"
                  class="form-select"
                >
                  <option :value="true">نعم</option>
                  <option :value="false">لا</option>
                </select>
              </div>

              <!-- Administrative Position -->
              <div class="col-md-6">
                <label class="form-label">المنصب الإداري</label>
                <input
                  v-model="formData.administrativePosition"
                  type="text"
                  class="form-control"
                  placeholder="مثال: رئيس، نائب الرئيس، أمين الصندوق"
                  :disabled="!formData.isAdministrativeMember"
                />
              </div>

              <!-- Submit Buttons -->
              <div class="col-12 text-center mt-4">
                <button
                  type="submit"
                  class="btn btn-success btn-lg px-5 rounded-pill shadow-sm fw-bold"
                >
                  <i class="bi bi-save me-1"></i>
                  حفظ البيانات
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

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
// Node.js Backend API for General Assembly Members
const API_BASE_URL = process.env.VUE_APP_NODEJS_API_BASE_URL + "/api";
const MemberAPI = API_BASE_URL + "/MemberGeneralAssembly";
const AUTH_TOKEN = localStorage.getItem("token");

const formData = reactive({
  id: "",
  firstName: "",
  secondName: "",
  lastName: "",
  location: "",
  phoneNumber: "",
  isAdministrativeMember: false,
  administrativePosition: "",
});

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  // Validation
  if (
    !formData.id.trim() ||
    !formData.firstName.trim() ||
    !formData.secondName.trim() ||
    !formData.lastName.trim() ||
    !formData.location.trim()
  ) {
    alertify.warning("الرجاء ملء الحقول الإلزامية");
    return;
  }

  try {
    const payload = {
      id: formData.id.trim(),
      firstName: formData.firstName.trim(),
      secondName: formData.secondName.trim(),
      lastName: formData.lastName.trim(),
      location: formData.location.trim(),
      phoneNumber: formData.phoneNumber.trim() || null,
      isAdministrativeMember: formData.isAdministrativeMember,
      administrativePosition: formData.isAdministrativeMember
        ? formData.administrativePosition.trim() || null
        : null,
    };

    await axios.post(MemberAPI, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    alertify.success("تم إضافة العضو بنجاح");
    router.push("/general-assembly");
  } catch (error) {
    console.error("Error adding member:", error);
    if (error.response) {
      alertify.error(`فشل في إضافة العضو: ${error.response.data.message}`);
    } else {
      alertify.error("حدث خطأ أثناء إضافة العضو");
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

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
