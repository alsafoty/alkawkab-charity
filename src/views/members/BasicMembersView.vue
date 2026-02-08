<template>
  <div class="container py-4" dir="rtl">
    <div class="card border-0 shadow-lg rounded-4">
      <!-- Header -->
      <div
        class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h2 class="mb-0 fw-bold">
          <i class="bi bi-person-badge me-2"></i>
          الأعضاء الأساسيين ({{ filteredMembers.length }})
        </h2>
        <div class="d-flex gap-2">
          <button
            @click="printContent"
            class="btn btn-light btn-sm rounded-pill no-print"
          >
            <i class="bi bi-printer me-1"></i>
            طباعة
          </button>
          <button @click="goBack" class="btn btn-light btn-sm rounded-pill">
            <i class="bi bi-arrow-right me-1"></i>
            رجوع
          </button>
        </div>
      </div>

      <div class="card-body p-4" ref="printArea">
        <!-- Search and Add Section -->
        <div class="row mb-4 no-print">
          <div class="col-md-8">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-lg"
              placeholder="🔍 بحث عن عضو (الاسم، الرقم، الموقع...)"
            />
          </div>
          <div class="col-md-4">
            <button
              @click="router.push('/add-member')"
              class="btn btn-success btn-lg w-100"
            >
              <i class="bi bi-plus-circle me-2"></i>
              إضافة عضو جديد
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          <p class="mt-2 text-muted">جاري تحميل بيانات الأعضاء...</p>
        </div>

        <!-- Members Table -->
        <div v-else-if="filteredMembers.length > 0" class="table-responsive">
          <table class="table table-hover table-striped">
            <thead class="table-header text-white">
              <tr>
                <th>الرقم الوطني</th>
                <th>الاسم الكامل</th>
                <th>الموقع</th>
                <th>رقم الهاتف</th>
                <th>حالة العضوية</th>
                <th>رقم الإيصال</th>
                <th class="no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in filteredMembers" :key="member.id">
                <td>{{ member.id }}</td>
                <td>
                  {{ member.firstName }} {{ member.secondName }}
                  {{ member.lastName }}
                </td>
                <td>{{ member.location || "غير محدد" }}</td>
                <td>{{ member.phoneNumber || "غير محدد" }}</td>
                <td>
                  <span v-if="member.isMembershipPaid" class="badge bg-success">
                    <i class="bi bi-check-circle me-1"></i>
                    مسددة
                  </span>
                  <span v-else class="badge bg-danger">
                    <i class="bi bi-x-circle me-1"></i>
                    غير مسددة
                  </span>
                </td>
                <td>{{ member.receiptNO || "-" }}</td>
                <td class="no-print">
                  <button
                    @click="viewMember(member.id)"
                    class="btn btn-sm btn-primary me-1"
                    title="عرض"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click="editMember(member.id)"
                    class="btn btn-sm btn-warning me-1"
                    title="تعديل"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="deleteMember(member.id)"
                    class="btn btn-sm btn-danger"
                    title="حذف"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Members Message -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox text-muted" style="font-size: 4rem"></i>
          <p class="text-muted mt-3 fs-5">لا توجد بيانات أعضاء</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const router = useRouter();
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const MemberAPI = API_BASE_URL + "/Member";
const AUTH_TOKEN = localStorage.getItem("token");

const loading = ref(false);
const members = ref([]);
const searchQuery = ref("");
const printArea = ref(null);

// Filtered members based on search
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value;
  const query = searchQuery.value.toLowerCase();
  return members.value.filter(
    (member) =>
      member.id?.toLowerCase().includes(query) ||
      member.firstName?.toLowerCase().includes(query) ||
      member.secondName?.toLowerCase().includes(query) ||
      member.lastName?.toLowerCase().includes(query) ||
      member.location?.toLowerCase().includes(query) ||
      member.phoneNumber?.toLowerCase().includes(query),
  );
});

// Fetch members
const fetchMembers = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(MemberAPI, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    members.value = response.data;
    console.log("Members fetched:", members.value);
  } catch (error) {
    console.error("Error fetching members:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الأعضاء");
  } finally {
    loading.value = false;
  }
};

const viewMember = (id) => {
  router.push(`/view-member/${id}`);
};

const editMember = (id) => {
  router.push(`/edit-member/${id}`);
};

const deleteMember = (id) => {
  alertify.confirm(
    "تأكيد الحذف",
    "هل أنت متأكد من حذف هذا العضو؟",
    async function () {
      try {
        await axios.delete(`${MemberAPI}/${id}`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });
        alertify.success("تم حذف العضو بنجاح");
        await fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
        alertify.error("حدث خطأ أثناء حذف العضو");
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

const printContent = () => {
  window.print();
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchMembers();
});
</script>

<style scoped>
.table-header {
  background-color: #42b983 !important;
}

.bg-primary {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}
</style>
