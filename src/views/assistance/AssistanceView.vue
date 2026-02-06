<template>
  <div
    class="assistance-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
  >
    <h2 class="text-center mb-4 fw-bold">جدول المساعدات</h2>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <!-- زر إضافة مساعدة مع تأثير التوسع -->
        <router-link
          to="/add-assistance"
          class="btn btn-success expandable-btn"
        >
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة مساعدة</span>
        </router-link>

        <!-- زر أنواع المساعدات مع تأثير التوسع -->
        <router-link
          to="/assistance-types"
          class="btn btn-info text-white expandable-btn"
        >
          <i class="bi bi-gear icon"></i>
          <span class="btn-text">أنواع المساعدات</span>
        </router-link>

        <!-- زر الطباعة مع تأثير التوسع -->
        <button @click="directPrint" class="btn btn-secondary expandable-btn">
          <i class="bi bi-printer icon"></i>
          <span class="btn-text">طباعة الجدول</span>
        </button>

        <!-- زر فلترة الفترة الزمنية مع تأثير التوسع -->
        <button
          @click="toggleDateFilter"
          class="btn btn-outline-primary expandable-btn"
          :class="{ active: showDateFilter }"
        >
          <i class="bi bi-calendar-range icon"></i>
          <span class="btn-text">فلترة بالتاريخ</span>
        </button>
      </div>

      <div class="flex-grow-1 mx-3 d-flex gap-2">
        <!-- فلتر نوع المستفيد -->

        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث في المساعدات..."
        />

        <select
          v-model="beneficiaryTypeFilter"
          class="form-select custom-input"
          @change="applyBeneficiaryFilter"
          dir="rtl"
          style="
            max-width: 200px;
            text-align: right;
            padding-right: 2rem;
            background-position: right 0.75rem center;
            background-size: 12px 12px;
          "
        >
          <option value="all">جميع المستفيدين</option>
          <option value="family">أسر</option>
          <option value="widow">أرامل</option>
          <option value="orphan">أيتام</option>
          <option value="other">أخرى</option>
        </select>

        <select
          v-model="assistanceTypeFilter"
          class="form-select custom-input"
          @change="applyAssistanceTypeFilter"
          dir="rtl"
          style="
            max-width: 200px;
            text-align: right;
            padding-right: 2rem;
            background-position: right 0.75rem center;
            background-size: 12px 12px;
          "
        >
          <option value="all">جميع أنواع المساعدات</option>
          <option
            v-for="type in assistanceTypes"
            :key="type.assistanceTypeId"
            :value="type.assistanceTypeId"
          >
            {{ type.assistanceTypeName }}
          </option>
        </select>
      </div>
    </div>

    <!-- شريط فلترة التاريخ -->
    <div
      v-if="showDateFilter"
      class="date-filter-section card p-3 mb-4 bg-light"
    >
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label fw-bold">من تاريخ:</label>
          <input v-model="filterDateFrom" type="date" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">إلى تاريخ:</label>
          <input v-model="filterDateTo" type="date" class="form-control" />
        </div>
        <div class="col-md-4">
          <div class="d-flex gap-2">
            <button
              @click="applyDateFilter"
              class="btn btn-primary expandable-btn"
            >
              <i class="bi bi-funnel icon"></i>
              <span class="btn-text">تطبيق الفلتر</span>
            </button>
            <button
              @click="clearDateFilter"
              class="btn btn-outline-secondary expandable-btn"
            >
              <i class="bi bi-x-circle icon"></i>
              <span class="btn-text">مسح</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="activeDateFilter" class="mt-2">
        <small class="text-success">
          <i class="bi bi-check-circle me-1"></i>
          الفلتر مطبق: {{ formatDate(activeDateFilter.from) }} -
          {{ formatDate(activeDateFilter.to) }}
        </small>
      </div>
    </div>

    <div
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th>نوع المستفيد</th>
            <th>المستفيد</th>
            <th>نوع المساعدة</th>
            <th class="sortable-header" @click="toggleDateSort">
              <div class="header-content">
                <span class="header-text">تاريخ المساعدة</span>
                <button
                  class="sort-btn expandable-sort-btn"
                  :class="getSortIconClass()"
                >
                  <i :class="getSortIcon()" class="icon"></i>
                  <span class="sort-text">{{ getSortText() }}</span>
                </button>
              </div>
            </th>
            <th>الاستلام</th>
            <th>ملاحظات</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="assistance in sortedAndFilteredAssistances"
            :key="assistance.assistanceId"
          >
            <td>{{ getBeneficiaryType(assistance) }}</td>
            <td>
              {{
                getPersonName(assistance.personId) ||
                " عائلة " + getFamilyName(assistance.familyId)
              }}
            </td>
            <td>{{ getAssistanceTypeName(assistance.assistanceTypeId) }}</td>
            <td>{{ formatDate(assistance.date) }}</td>
            <td>
              <i
                :class="
                  assistance.received
                    ? 'bi bi-check-circle-fill text-success'
                    : 'bi bi-x-circle-fill text-danger'
                "
              ></i>
            </td>
            <td>{{ assistance.note || "-" }}</td>
            <td class="d-flex gap-2 justify-content-center">
              <button
                @click="viewDetails(assistance.assistanceId)"
                class="btn btn-primary btn-sm expandable-action-btn"
              >
                <i class="bi bi-eye icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="editAssistance(assistance.assistanceId)"
                class="btn btn-warning btn-sm expandable-action-btn"
              >
                <i class="bi bi-pencil icon"></i>
                <span class="btn-text"></span>
              </button>
              <button
                @click="deleteAssistance(assistance.assistanceId)"
                class="btn btn-danger btn-sm expandable-action-btn"
              >
                <i class="bi bi-trash icon"></i>
                <span class="btn-text"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="!sortedAndFilteredAssistances.length"
      class="alert alert-warning text-center mt-3"
    >
      لا يوجد مساعدات مطابقة للبحث أو الفلاتر المحددة
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تقرير المساعدات</h2>
        <h4 v-if="getPrintTitle()" class="text-success mt-2">
          {{ getPrintTitle() }}
        </h4>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
        <div v-if="activeDateFilter" class="text-muted">
          <small
            >الفترة : {{ formatDate(activeDateFilter.from) }} -
            {{ formatDate(activeDateFilter.to) }}</small
          >
        </div>
      </div>

      <table class="table table-bordered print-table">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الرقم الوطني</th>
            <th>رقم الهاتف</th>
            <th>نوع المساعدة</th>
            <th>تاريخ المساعدة</th>
            <th>التوقيع</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(assistance, index) in getSortedPrintAssistances()"
            :key="assistance.assistanceId"
          >
            <td>{{ index + 1 }}</td>
            <td>
              {{
                getPersonName(assistance.personId) ||
                " عائلة " + getFamilyName(assistance.familyId)
              }}
            </td>
            <td>
              {{ getNationalId(assistance.personId, assistance.familyId) }}
            </td>
            <td>
              {{ getPhoneNumber(assistance.personId, assistance.familyId) }}
            </td>
            <td>{{ getAssistanceTypeName(assistance.assistanceTypeId) }}</td>
            <td>{{ formatDate(assistance.date) }}</td>
            <td>{{ " " }}</td>
          </tr>
        </tbody>
      </table>

      <div class="print-footer mt-4">
        <p class="text-center text-muted">
          إجمالي عدد المساعدات: {{ sortedAndFilteredAssistances.length }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const assistances = ref([]);
const assistanceTypes = ref([]);
const families = ref([]);
const persons = ref([]);
const searchQuery = ref("");

// متغيرات فلترة التاريخ
const showDateFilter = ref(false);
const filterDateFrom = ref("");
const filterDateTo = ref("");
const activeDateFilter = ref(null);

// متغير فلتر نوع المستفيد
const beneficiaryTypeFilter = ref("all");

// متغير فلتر نوع المساعدة
const assistanceTypeFilter = ref("all");

// متغيرات ترتيب التاريخ
const dateSortOrder = ref("none"); // "none", "asc", "desc"

const getAssistanceTypeName = (typeId) => {
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === typeId,
  );
  return assistanceType ? assistanceType.assistanceTypeName : "غير معروف";
};

const getFamilyName = (familyId) => {
  if (!familyId || familyId === 0) return "-";
  const family = families.value.find((f) => f.familyId === familyId);
  return family ? family.name : "غير معروف";
};

const getPersonName = (personId) => {
  if (!personId || personId === "") return "";
  const person = persons.value.find((p) => p.id === personId);
  return person ? `${person.firstName} ${person.lastName}` : "غير معروف";
};

const getNationalId = (personId, familyId) => {
  if (personId && personId !== "") {
    // Return the person's id as the national ID
    return personId;
  }
  if (familyId && familyId !== 0) {
    // For families, get the head of family's id
    const family = families.value.find((f) => f.familyId === familyId);
    if (family?.personId) {
      return family.personId;
    }
  }
  return "-";
};

const getPhoneNumber = (personId, familyId) => {
  if (personId && personId !== "") {
    const person = persons.value.find((p) => p.id === personId);
    return person?.phoneNumber || "-";
  }
  if (familyId && familyId !== 0) {
    // For families, get the head of family's phone number
    const family = families.value.find((f) => f.familyId === familyId);
    if (family?.personId) {
      const person = persons.value.find((p) => p.id === family.personId);
      return person?.phoneNumber || "-";
    }
  }
  return "-";
};

// دالة تحديد نوع المستفيد
const getBeneficiaryType = (assistance) => {
  if (assistance.familyId && assistance.familyId !== 0) {
    return "أسرة";
  } else if (assistance.personId && assistance.personId !== "") {
    const person = persons.value.find((p) => p.id === assistance.personId);
    if (person) {
      if (person.isWidow) return "أرمل/ة";
      if (person.isOrphan) return "يتيم/ة";
      return "فرد";
    }
  }
  return "غير محدد";
};

// دالة تطبيق فلتر نوع المستفيد
const applyBeneficiaryFilter = () => {
  const filterLabels = {
    all: "جميع المستفيدين",
    family: "أسر",
    widow: "أرامل",
    orphan: "أيتام",
    other: "أخرى",
  };

  if (beneficiaryTypeFilter.value !== "all") {
    alertify.success(
      `تم تطبيق فلتر: ${filterLabels[beneficiaryTypeFilter.value]}`,
    );
  }
};

// دالة تطبيق فلتر نوع المساعدة
const applyAssistanceTypeFilter = () => {
  if (assistanceTypeFilter.value !== "all") {
    const typeName = getAssistanceTypeName(assistanceTypeFilter.value);
    alertify.success(`تم تطبيق فلتر: ${typeName}`);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// دوال فلترة التاريخ
const toggleDateFilter = () => {
  showDateFilter.value = !showDateFilter.value;
  if (!showDateFilter.value) {
    clearDateFilter();
  }
};

const applyDateFilter = () => {
  if (filterDateFrom.value && filterDateTo.value) {
    activeDateFilter.value = {
      from: filterDateFrom.value,
      to: filterDateTo.value,
    };
    alertify.success("تم تطبيق فلتر التاريخ بنجاح");
  } else if (filterDateFrom.value) {
    activeDateFilter.value = {
      from: filterDateFrom.value,
      to: null,
    };
    alertify.success(
      "تم تطبيق فلتر التاريخ من: " + formatDate(filterDateFrom.value),
    );
  } else if (filterDateTo.value) {
    activeDateFilter.value = {
      from: null,
      to: filterDateTo.value,
    };
    alertify.success(
      "تم تطبيق فلتر التاريخ إلى: " + formatDate(filterDateTo.value),
    );
  } else {
    alertify.warning("يرجى اختيار تاريخ واحد على الأقل");
  }
};

const clearDateFilter = () => {
  filterDateFrom.value = "";
  filterDateTo.value = "";
  activeDateFilter.value = null;
  alertify.message("تم مسح فلتر التاريخ");
};

// دوال ترتيب التاريخ
const toggleDateSort = () => {
  if (dateSortOrder.value === "none") {
    dateSortOrder.value = "asc";
    alertify.message("تم ترتيب التواريخ تصاعدياً");
  } else if (dateSortOrder.value === "asc") {
    dateSortOrder.value = "desc";
    alertify.message("تم ترتيب التواريخ تنازلياً");
  } else {
    dateSortOrder.value = "none";
    alertify.message("تم إلغاء ترتيب التواريخ");
  }
};

const getSortIcon = () => {
  if (dateSortOrder.value === "asc") return "bi bi-sort-up";
  if (dateSortOrder.value === "desc") return "bi bi-sort-down";
  return "bi bi-arrow-down-up";
};

const getSortText = () => {
  if (dateSortOrder.value === "asc") return "تصاعدي";
  if (dateSortOrder.value === "desc") return "تنازلي";
  return "ترتيب";
};

const getSortIconClass = () => {
  return {
    "btn-primary": dateSortOrder.value !== "none",
    "btn-outline-secondary": dateSortOrder.value === "none",
  };
};

const fetchData = async () => {
  const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };

  try {
    alertify.message("جاري تحميل بيانات المساعدات...");

    const [assistanceTypesRes, familiesRes, personsRes, assistancesRes] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/AssistanceType`, { headers }),
        axios.get(`${API_BASE_URL}/Family`, { headers }),
        axios.get(`${API_BASE_URL}/Person`, { headers }),
        axios.get(`${API_BASE_URL}/Assistance`, { headers }),
      ]);

    assistanceTypes.value = assistanceTypesRes.data;
    families.value = familiesRes.data;
    persons.value = personsRes.data;
    assistances.value = assistancesRes.data;

    alertify.success("تم تحميل جميع البيانات بنجاح");
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error.response) {
      const errorMessage =
        error.response.data.message || error.response.statusText;
      alertify.error(`حدث خطأ أثناء جلب البيانات: ${errorMessage}`);
    } else if (error.request) {
      alertify.error("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
    } else {
      alertify.error("حدث خطأ أثناء جلب البيانات");
    }
  }
};

// الفلترة والترتيب المدمجة
const sortedAndFilteredAssistances = computed(() => {
  let result = assistances.value;

  // تطبيق فلتر نوع المستفيد
  if (beneficiaryTypeFilter.value !== "all") {
    result = result.filter((assistance) => {
      const beneficiaryType = getBeneficiaryType(assistance);

      if (beneficiaryTypeFilter.value === "family") {
        return beneficiaryType === "أسرة";
      } else if (beneficiaryTypeFilter.value === "widow") {
        return beneficiaryType === "أرمل/ة";
      } else if (beneficiaryTypeFilter.value === "orphan") {
        return beneficiaryType === "يتيم/ة";
      } else if (beneficiaryTypeFilter.value === "other") {
        return beneficiaryType === "فرد" || beneficiaryType === "غير محدد";
      }

      return true;
    });
  }

  // تطبيق فلتر نوع المساعدة
  if (assistanceTypeFilter.value !== "all") {
    result = result.filter(
      (assistance) =>
        assistance.assistanceTypeId === assistanceTypeFilter.value,
    );
  }

  // تطبيق البحث النصي
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (assistance) =>
        getFamilyName(assistance.familyId)?.toLowerCase().includes(query) ||
        getPersonName(assistance.personId)?.toLowerCase().includes(query) ||
        getAssistanceTypeName(assistance.assistanceTypeId)
          .toLowerCase()
          .includes(query) ||
        assistance.note?.toLowerCase().includes(query) ||
        assistance.numberOfAssistance.toString().includes(query) ||
        assistance.assistanceId.toString().includes(query),
    );
  }

  // تطبيق فلتر التاريخ
  if (activeDateFilter.value) {
    result = result.filter((assistance) => {
      if (!assistance.date) return false;

      const assistanceDate = new Date(assistance.date);
      const fromDate = activeDateFilter.value.from
        ? new Date(activeDateFilter.value.from)
        : null;
      const toDate = activeDateFilter.value.to
        ? new Date(activeDateFilter.value.to)
        : null;

      if (fromDate && toDate) {
        return assistanceDate >= fromDate && assistanceDate <= toDate;
      } else if (fromDate) {
        return assistanceDate >= fromDate;
      } else if (toDate) {
        return assistanceDate <= toDate;
      }

      return true;
    });
  }

  // تطبيق ترتيب التاريخ
  if (dateSortOrder.value !== "none") {
    result = [...result].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);

      if (dateSortOrder.value === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  return result;
});

// Helper function to format received status for printing
const getReceivedStatusText = (received) => {
  return received ? "تم الاستلام" : "لم يتم الاستلام";
};

// Sort assistances alphabetically by beneficiary name for printing
const getSortedPrintAssistances = () => {
  return [...sortedAndFilteredAssistances.value].sort((a, b) => {
    const nameA =
      getPersonName(a.personId) || " عائلة " + getFamilyName(a.familyId);
    const nameB =
      getPersonName(b.personId) || " عائلة " + getFamilyName(b.familyId);
    return nameA.localeCompare(nameB, "ar");
  });
};

// Generate dynamic print title based on active filters
const getPrintTitle = () => {
  const filters = [];

  // Add assistance type filter if active
  if (assistanceTypeFilter.value !== "all") {
    const typeName = getAssistanceTypeName(assistanceTypeFilter.value);
    filters.push(typeName);
  }

  // Add beneficiary type filter if active
  if (beneficiaryTypeFilter.value !== "all") {
    const filterLabels = {
      family: "أسر",
      widow: "أرامل",
      orphan: "أيتام",
      other: "أخرى",
    };
    filters.push(filterLabels[beneficiaryTypeFilter.value]);
  }

  // Return filter text or empty string
  return filters.length > 0 ? filters.join(" - ") : "";
};

const directPrint = () => {
  alertify.message("جاري تحضير الطباعة...");

  const printContent = document.getElementById("printableContent").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>طباعة جدول المساعدات</title>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Tajawal', Arial, sans-serif; 
          direction: rtl; 
          margin: 20px; 
          color: #333; 
        }
        .print-header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #42b983; 
          padding-bottom: 15px; 
        }
        .print-header h2 { 
          color: #42b983; 
          margin-bottom: 10px; 
        }
        .print-header h4 {
          color: #42b983;
          font-size: 1.2rem;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          font-size: 10px; 
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 5px; 
          text-align: center; 
          vertical-align: middle;
        }
        .print-table th { 
          background-color: #42b983; 
          color: white; 
          font-weight: bold; 
          font-size: 9px;
        }
        .print-table th:nth-child(1) { width: 4%; } /* # */
        .print-table th:nth-child(2) { width: 20%; } /* الاسم */
        .print-table th:nth-child(3) { width: 15%; } /* الرقم الوطني */
        .print-table th:nth-child(4) { width: 12%; } /* رقم الهاتف */
        .print-table th:nth-child(5) { width: 18%; } /* نوع المساعدة */
        .print-table th:nth-child(6) { width: 13%; } /* تاريخ المساعدة */
        .print-table th:nth-child(7) { width: 18%; } /* التوقيع */
        .print-table tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        .print-footer { 
          margin-top: 30px; 
          text-align: center; 
          border-top: 1px solid #ddd; 
          padding-top: 15px; 
          color: #666; 
        }
        @media print { 
          body { margin: 0; } 
          .print-table { font-size: 8px; }
          .print-table th { font-size: 7px; }
        }
      </style>
    </head>
    <body>${printContent}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
    alertify.success("تم فتح نافذة الطباعة");
  }, 250);
};

const viewDetails = (assistanceId) =>
  router.push(`/view-assistance/${assistanceId}`);
const editAssistance = (assistanceId) =>
  router.push(`/edit-assistance/${assistanceId}`);

const deleteAssistance = async (assistanceId) => {
  // Get assistance details for better confirmation message
  const assistance = assistances.value.find(
    (a) => a.assistanceId === assistanceId,
  );
  const assistanceInfo = assistance
    ? `المساعدة رقم ${assistanceId} (${getAssistanceTypeName(
        assistance.assistanceTypeId,
      )})`
    : `المساعدة رقم ${assistanceId}`;

  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${assistanceInfo}؟`,
    async function () {
      // User clicked OK
      try {
        alertify.message("جاري حذف المساعدة...");

        await axios.delete(`${API_BASE_URL}/Assistance/${assistanceId}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });

        await fetchData();
        alertify.success(`تم حذف ${assistanceInfo} بنجاح`);
      } catch (error) {
        console.error("Error deleting assistance:", error);

        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء حذف المساعدة: ${errorMessage}`);
        } else if (error.request) {
          alertify.error(
            "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت",
          );
        } else {
          alertify.error("حدث خطأ أثناء حذف المساعدة");
        }
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

onMounted(fetchData);
</script>

<style scoped>
.assistance-table {
  font-family: "Tajawal", sans-serif;
}
.table-header {
  background-color: #42b983 !important;
}
.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.custom-input {
  text-align: right;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  border-radius: 8px;
}

.custom-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.25);
}

.custom-input::placeholder {
  text-align: right;
  color: #aaa;
  font-size: 0.9rem;
}

/* تأثيرات التوسع للأزرار الرئيسية */
.expandable-btn {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expandable-btn .icon {
  transition: margin 0.4s ease;
  font-size: 1.1rem;
}

.expandable-btn .btn-text {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: all 0.4s ease;
  margin-right: 0;
  font-weight: 600;
}

.expandable-btn:hover {
  min-width: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.expandable-btn:hover .icon {
  margin-left: 0.5rem;
}

.expandable-btn:hover .btn-text {
  opacity: 1;
  max-width: 150px;
  margin-right: 0.5rem;
}

/* تأثيرات التوسع لأزرار الإجراءات */

/* تنسيق خاص لأزرار الإجراءات */
.btn-primary.expandable-action-btn {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-primary.expandable-action-btn:hover {
  background-color: #3aa876;
  border-color: #3aa876;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.btn-warning.expandable-action-btn:hover,
.btn-danger.expandable-action-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.expandable-action-btn:active {
  transform: translateY(0) !important;
}

/* تنسيق زر الترتيب في رأس الجدول */
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.expandable-sort-btn {
  border: none;
  background: none;
  color: white;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  min-width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expandable-sort-btn .icon {
  transition: margin 0.3s ease;
}

.expandable-sort-btn .sort-text {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-right: 0;
  font-size: 0.75rem;
}

.expandable-sort-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  min-width: auto;
}

.expandable-sort-btn:hover .icon {
  margin-left: 0.3rem;
}

.expandable-sort-btn:hover .sort-text {
  opacity: 1;
  max-width: 60px;
  margin-right: 0.3rem;
}

.expandable-sort-btn.btn-primary {
  background-color: rgba(255, 255, 255, 0.3);
}

.form-control::placeholder {
  text-align: right;
}

/* تنسيق فلترة التاريخ */
.date-filter-section {
  border: 1px solid #dee2e6;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn.active {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
}

/* تنسيق ترتيب التاريخ */
.sortable-header {
  cursor: pointer;
  position: relative;
  user-select: none;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  text-align: right;
  font-size: 0.9rem;
}

/* تنسيق القوائم المنسدلة في RTL */
[dir="rtl"] .form-select {
  padding-right: 2.5rem !important;
  padding-left: 0.75rem !important;
  background-position: right 0.75rem center !important;
  text-align: right;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .expandable-btn:hover .btn-text {
    max-width: 120px;
  }

  .expandable-action-btn:hover .btn-text {
    max-width: 60px;
  }
}
</style>
