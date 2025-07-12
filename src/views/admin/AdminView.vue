<!-- AdminView.vue - Enhanced Login Component with Persistent Login -->
<template>
  <div
    v-if="!isCheckingAuth && !isLoggedInUser"
    class="login-container d-flex justify-content-center align-items-center"
    dir="rtl"
  >
    <div class="login-box p-4 rounded shadow">
      <div class="text-center mb-4">
        <i class="bi bi-shield-lock fs-1 text-primary mb-2"></i>
        <h3 class="fw-bold">تسجيل الدخول</h3>
        <p class="text-muted small">
          الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم
        </p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label d-flex align-items-center">
            <!-- <i class="bi bi-person me-2"></i>
            <span>اسم المستخدم</span> -->
          </label>
          <div class="input-group">
            <span class="input-group-text bg-light">
              <i class="bi bi-person-fill"></i>
            </span>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control"
              placeholder="أدخل اسم المستخدم"
              required
              :class="{ 'is-invalid': validationErrors.username }"
              @input="clearError('username')"
            />
          </div>
          <div v-if="validationErrors.username" class="text-danger small mt-1">
            {{ validationErrors.username }}
          </div>
        </div>

        <div class="mb-4">
          <label for="password" class="form-label d-flex align-items-center">
            <!-- <i class="bi bi-key me-2"></i>
            <span>كلمة المرور</span> -->
          </label>
          <div class="input-group">
            <span class="input-group-text bg-light">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="form-control"
              placeholder="أدخل كلمة المرور"
              required
              :class="{ 'is-invalid': validationErrors.password }"
              @input="clearError('password')"
            />
            <button
              type="button"
              class="input-group-text bg-light"
              @click="togglePasswordVisibility"
            >
              <i
                :class="
                  showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                "
              ></i>
            </button>
          </div>
          <div v-if="validationErrors.password" class="text-danger small mt-1">
            {{ validationErrors.password }}
          </div>
        </div>

        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="rememberMe"
            v-model="rememberMe"
          />
          <label class="form-check-label" for="rememberMe">تذكرني</label>
        </div>

        <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          <span>{{ isLoading ? "جاري تسجيل الدخول..." : "تسجيل دخول" }}</span>
        </button>

        <div class="text-center mt-3">
          <a href="#" class="text-decoration-none small">نسيت كلمة المرور؟</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
// الحقول المتفاعلة
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const isCheckingAuth = ref(true); // متغير جديد للتحقق من حالة المصادقة
const isLoggedInUser = ref(false); // متغير جديد لتخزين حالة تسجيل الدخول
const validationErrors = reactive({
  username: "",
  password: "",
});
const AuthAPI = ref("https://charityapp.runasp.net/api/Auth/Login");
const router = useRouter();

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
onMounted(() => {
  // التحقق مما إذا كان المستخدم مسجل الدخول بالفعل
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    // إذا كان المستخدم مسجل الدخول، قم بتعيين المتغير وتوجيهه إلى صفحة قاعدة البيانات
    isLoggedInUser.value = true;
    router.push("/enterdb");
  }
  // إنهاء التحقق من حالة المصادقة
  isCheckingAuth.value = false;
});

// التحقق من صحة البيانات
const validateForm = () => {
  let isValid = true;

  // التحقق من اسم المستخدم
  if (!username.value.trim()) {
    validationErrors.username = "يرجى إدخال اسم المستخدم";
    isValid = false;
  } else if (username.value.length < 3) {
    validationErrors.username = "يجب أن يكون اسم المستخدم 3 أحرف على الأقل";
    isValid = false;
  }

  // التحقق من كلمة المرور
  if (!password.value) {
    validationErrors.password = "يرجى إدخال كلمة المرور";
    isValid = false;
  } else if (password.value.length < 5) {
    validationErrors.password = "يجب أن تكون كلمة المرور 5 أحرف على الأقل";
    isValid = false;
  }

  return isValid;
};

// مسح رسائل الخطأ عند الكتابة
const clearError = (field) => {
  validationErrors[field] = "";
  errorMessage.value = "";
};

// تبديل رؤية كلمة المرور
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// حفظ حالة تسجيل الدخول
const saveLoginState = () => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", username.value);

  // إذا اختار المستخدم "تذكرني"، قم بتخزين المعلومات بشكل دائم
  if (rememberMe.value) {
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("rememberMe");
  }
};

// ********************** testing ***********************************

// ********************** testing ***********************************

// التعامل مع تسجيل الدخول
// التعامل مع تسجيل الدخول
const handleLogin = async () => {
  // التحقق من صحة النموذج
  if (!validateForm()) {
    return;
  }

  // تفعيل حالة التحميل
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // إرسال طلب تسجيل الدخول إلى الخادم
    const response = await axios.post(AuthAPI.value, {
      username: username.value,
      password: password.value,
    });
    // التحقق من وجود التوكن في الاستجابة
    if (response.data) {
      // حفظ التوكن في localStorage
      localStorage.setItem("token", response.data);

      // حفظ حالة تسجيل الدخول
      saveLoginState();

      // نجاح تسجيل الدخول - التوجه إلى الصفحة الرئيسية
      router.push("/enterdb");
    } else {
      // في حالة عدم وجود توكن في الاستجابة
      errorMessage.value = "فشل في تسجيل الدخول - لم يتم الحصول على توكن صالح";
    }
  } catch (error) {
    // التعامل مع أخطاء مختلفة
    if (error.response) {
      // خطأ من الخادم (401, 403, 500, إلخ)
      switch (error.response.status) {
        case 401:
          errorMessage.value = "اسم المستخدم أو كلمة المرور غير صحيحة";
          break;
        case 403:
          errorMessage.value = "ليس لديك صلاحية للوصول";
          break;
        case 500:
          errorMessage.value = "خطأ في الخادم - يرجى المحاولة لاحقاً";
          break;
        default:
          errorMessage.value = "حدث خطأ أثناء تسجيل الدخول";
      }
    } else if (error.request) {
      // خطأ في الشبكة
      errorMessage.value = "خطأ في الاتصال - تحقق من اتصال الإنترنت";
    } else {
      // خطأ آخر
      errorMessage.value = "حدث خطأ غير متوقع";
    }

    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
};

// تصدير دالة تسجيل الخروج للاستخدام في الملفات الأخرى
const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  // الاحتفاظ بخيار "تذكرني" إذا كان مفعلاً
  if (localStorage.getItem("rememberMe") !== "true") {
    localStorage.removeItem("rememberMe");
  }
  router.push("/admin");
};

// تصدير الدوال للاستخدام في الملفات الأخرى
defineExpose({ logout });
</script>

<style scoped>
.login-container {
  min-height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
}

.form-control {
  text-align: right;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.25);
}

.form-control::placeholder {
  text-align: right;
  color: #aaa;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #42b983;
  border-color: #42b983;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #3aa876;
  border-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.input-group-text {
  border: 1px solid #e0e0e0;
  color: #666;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}

/* Animation for error messages */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.alert-danger {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Checkbox styling */
.form-check {
  text-align: right;
}

.form-check-input {
  float: right;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.form-check-label {
  color: #555;
}
</style>
