<template>
  <div
    class="d-flex flex-column justify-content-center align-items-start position-relative text-white px-5 py-4"
    style="
      min-height: 100vh;
      background: url('../public/images/pexels-photo-2673300.jpeg') no-repeat
        center center;
      background-size: cover;
    "
  >
    <!-- طبقة تعتيم خلف النص فقط -->
    <div
      class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      style="z-index: 0"
    ></div>

    <!-- محتوى النص -->
    <div class="position-relative w-100 text-end" style="z-index: 1">
      <h2 class="display-3 fw-bold mb-3 text-shadow">
        معًا يمكننا<br />أن نُحدث فرقًا
      </h2>
      <p class="lead fs-4 mb-4 text-shadow-light">
        انضم إلينا في رسالتنا لمساعدة المحتاجين وخدمة المجتمع
      </p>
      <button @click="goToContact" class="btn donate-button fs-5 px-4 py-2">
        تبرع الآن
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToContact() {
      this.$router.push("/contact-us");
    },
  },
  components: {},
};
</script>
<style scoped>
.text-shadow {
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.6);
}

.text-shadow-light {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.donate-button {
  background-color: #ea580c;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.donate-button:hover {
  background-color: #c2410c;
}
</style>
