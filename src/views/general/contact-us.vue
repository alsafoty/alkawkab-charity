<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center"
    style="min-height: 80vh"
  >
    <div
      class="container py-5 text-center text-md-end bg-white bg-opacity-75 p-5 rounded-4 shadow-lg"
    >
      <h1 class="mb-4 fw-bold text-success">تواصل معنا</h1>

      <p class="lead mb-5 fw-bold">
        يسعدنا تواصلك معنا. يمكنك إرسال استفساراتك أو ملاحظاتك من خلال النموذج
        أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.
      </p>

      <form class="text-end">
        <div class="mb-3">
          <label for="name" class="form-label fw-bold">الاسم الكامل</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="أدخل اسمك"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label fw-bold"
            >البريد الإلكتروني</label
          >
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="example@example.com"
          />
        </div>
        <div class="mb-3">
          <label for="message" class="form-label fw-bold">رسالتك</label>
          <textarea
            class="form-control"
            id="message"
            rows="5"
            placeholder="اكتب رسالتك هنا"
          ></textarea>
        </div>
        <button type="submit" class="donate-button">إرسال</button>
      </form>
    </div>
  </div>
</template>

<script setup>
// لا حاجة لجافاسكريبت حاليًا
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
}

.card-title {
  font-size: 1.4rem;
}

.card-text {
  font-size: 1rem;
  color: #555;
}

.donate-button {
  background-color: #ea580c;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
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
