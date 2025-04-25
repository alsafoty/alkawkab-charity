<!-- src/components/FamiliesTable.vue -->
<template>
  <div class="families-table container my-4" dir="rtl">
    <h2 class="text-center mb-4">جدول العائلات</h2>
    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="ابحث باسم العائلة..."
      />
    </div>
    <div class="table-responsive rounded-2">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>اسم العائلة</th>
            <th>عدد الأفراد</th>
            <th>الحالة</th>
            <th>رقم التواصل</th>
            <th>تاريخ التسجيل</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="family in filteredFamilies" :key="family.id">
            <td>{{ family.name }}</td>
            <td>{{ family.membersCount }}</td>
            <td :class="getStatusClass(family.status)">
              {{ family.status }}
            </td>
            <td>{{ family.contactNumber }}</td>
            <td>{{ formatDate(family.registrationDate) }}</td>
            <td>
              <button
                @click="viewDetails(family.id)"
                class="btn btn-primary btn-sm me-1"
              >
                عرض
              </button>
              <button
                @click="editFamily(family.id)"
                class="btn btn-warning btn-sm me-1"
              >
                تعديل
              </button>
              <button
                @click="deleteFamily(family.id)"
                class="btn btn-danger btn-sm"
              >
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filteredFamilies.length" class="alert alert-warning text-center">
      ما في عائلات مطابقة!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// بيانات تجريبية للعائلات
const families = ref([
  {
    id: 1,
    name: 'عائلة أحمد',
    membersCount: 5,
    status: 'بحاجة لمساعدة',
    contactNumber: '0791234567',
    registrationDate: '2025-03-15',
  },
  {
    id: 2,
    name: 'عائلة خالد',
    membersCount: 3,
    status: 'تمت المساعدة',
    contactNumber: '0789876543',
    registrationDate: '2025-04-01',
  },
  {
    id: 3,
    name: 'عائلة سميرة',
    membersCount: 7,
    status: 'بحاجة لمساعدة',
    contactNumber: '0771122334',
    registrationDate: '2025-04-20',
  },
]);

// البحث
const searchQuery = ref('');

// فلترة العائلات بناءً على البحث
const filteredFamilies = computed(() => {
  return families.value.filter((family) =>
    family.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// تنسيق التاريخ
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// كلاسات للحالة
const getStatusClass = (status) => {
  return {
    'text-danger fw-bold': status === 'بحاجة لمساعدة',
    'text-success fw-bold': status === 'تمت المساعدة',
  };
};

// دوال الإجراءات
const viewDetails = (id) => {
  alert(`عرض تفاصيل العائلة رقم: ${id}`);
  // بتقدر تضيف توجيه لصفحة تفاصيل بـ Vue Router
};

const editFamily = (id) => {
  alert(`تعديل العائلة رقم: ${id}`);
  // بتقدر تضيف نموذج تعديل
};

const deleteFamily = (id) => {
  if (confirm('متأكد بدك تحذف العائلة؟')) {
    families.value = families.value.filter((family) => family.id !== id);
  }
};
</script>

<style scoped>
.families-table {
  font-family: Arial, sans-serif;
}

/* ضبط محاذاة النصوص للجدول */
.table th,
.table td {
  text-align: right;
}

/* ضبط الأزرار لتكون محاذاة بشكل مناسب */
.table .btn {
  margin-left: 5px;
}

/* ضبط الـ placeholder ليكون RTL */
.form-control::placeholder {
  text-align: right;
}
</style>