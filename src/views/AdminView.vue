<!-- src/components/LoginBox.vue -->
<template>
  <div class="login-container d-flex justify-content-center align-items-center" dir="rtl">
    <div class="login-box p-4 rounded shadow">
      <h3 class="text-center mb-4">تسجيل الدخول</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">اسم المستخدم</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="form-control"
            placeholder="أدخل اسم المستخدم"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">كلمة المرور</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <button type="submit" class="btn btn-primary w-100">تسجيل دخول</button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// الحقول المتفاعلة
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();


// التعامل مع تسجيل الدخول
const handleLogin = () => {
  if (username.value !='admin' || password.value != '12345') {
    errorMessage.value = 'هناك خطأ في اسم المستخدم أو كلمة المرور';
    return;
  }

  // هنا بتقدر تضيف منطق تسجيل الدخول (مثل طلب API)
  errorMessage.value = '';
  alert(`تسجيل دخول: ${username.value}`);
  // مثال: توجيه لصفحة أخرى بعد تسجيل الدخول بـ Vue Router
  // router.push('/dashboard');
  router.push('/enterdb');
};
</script>

<style scoped>
.login-container {
  min-height: 88vh;
  /* background: linear-gradient(135deg, #42b983, #3498db); خلفية متدرجة */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.95); /* أبيض بشفافية */
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.form-label {
  font-weight: bold;
}

.form-control {
  text-align: right;
}

.form-control::placeholder {
  text-align: right;
}

.btn-primary {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

/* لتعديل مظهر النصوص والحقول في الـ RTL */
.alert {
  text-align: right;
}
</style>