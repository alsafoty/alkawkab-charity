<template>
  <div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="container py-5 text-center  bg-white bg-opacity-75 p-5 rounded-4 shadow-lg">
      <h1 class="mb-4 fw-bold text-success">عن الجمعية</h1>
      
      <p class="lead mb-5 fw-bold">
        جمعية الكوكب الدري الخيرية هي منظمة غير ربحية تهدف إلى خدمة المجتمع من خلال تقديم الدعم والمساعدة للأسر المحتاجة والأفراد، والعمل على تحقيق التنمية المستدامة في المجتمع.
      </p>

      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <h5 class="card-title fw-bold text-success">رسالتنا</h5>
              <p class="card-text">نشر الخير وتعزيز قيم التكافل الاجتماعي من خلال مشاريع وبرامج نوعية تخدم مختلف شرائح المجتمع.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <h5 class="card-title fw-bold text-success">رؤيتنا</h5>
              <p class="card-text">أن نكون نموذجاً رائداً في العمل الخيري المؤسسي، ونساهم بفاعلية في تحقيق تنمية مجتمعية مستدامة.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow border-0">
            <div class="card-body">
              <h5 class="card-title fw-bold text-success">أهدافنا</h5>
              <p class="card-text">دعم الأسر المحتاجة، تنمية قدرات الشباب، المساهمة في تحسين جودة الحياة، وتعزيز روح التطوع في المجتمع.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- معلومات الجمعية -->
      <!-- ... باقي الصفحة كما هي ... -->

<!-- معلومات الجمعية بشكل مرتب -->
      <div class="container border-top pt-4 mt-5">
        <h5 class="fw-bold text-success text-center mb-4 text-shadow" style="font-size: 2rem;">معلومات التواصل</h5>
        <div class="row  text-center">
          <div class="col-md mb-3">
            <i class="bi bi-telephone-fill text-success fs-4 me-2"></i>
            <span class="fw-semibold fs-3">+962 77 974 7580</span>
          </div>
          <div class="col-md mb-3">
            <i class="bi bi-envelope-fill text-success fs-4 me-2"></i>
            <span class="fw-semibold fs-3">info@alkawkab.org</span>
          </div>
          <div class="col-md mb-3">
            <i class="bi bi-geo-alt-fill text-success fs-4 me-2"></i>
            <span class="fw-semibold fs-3"> الأردن، مادبا </span>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
// لا حاجة لجافاسكريبت هنا
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
</style>
