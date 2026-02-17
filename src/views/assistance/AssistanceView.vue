<template>
  <div
    class="assistance-table container my-4 bg-white bg-opacity-50 p-5 rounded-4 shadow-lg"
    dir="rtl"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold">جدول المساعدات</h2>
      <button class="btn btn-success no-print" @click="directPrint">
        <i class="bi bi-printer me-1"></i>
        طباعة
      </button>
    </div>

    <!-- شريط الإجراءات -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex gap-2 align-items-center">
        <router-link
          to="/add-assistance"
          class="btn btn-success expandable-btn"
        >
          <i class="bi bi-plus-circle icon"></i>
          <span class="btn-text">إضافة مساعدة</span>
        </router-link>
        <router-link
          to="/assistance-types"
          class="btn btn-info text-white expandable-btn"
        >
          <i class="bi bi-gear icon"></i>
          <span class="btn-text">أنواع المساعدات</span>
        </router-link>

        <button
          v-if="selectedAssistances.length > 0"
          @click="deleteSelected"
          class="btn btn-danger expandable-btn"
        >
          <i class="bi bi-trash icon"></i>
          <span class="btn-text"
            >حذف المحدد ({{ selectedAssistances.length }})</span
          >
        </button>
      </div>
      <div class="d-flex gap-2 flex-grow-1 me-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control custom-input"
          placeholder="ابحث في المساعدات..."
        />
      </div>
    </div>

    <!-- لوحة الفلاتر -->
    <div class="filter-panel card mb-4">
      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="mb-0 fw-bold text-secondary">
            <i class="bi bi-funnel me-1"></i> خيارات الفلترة
          </h6>
          <button
            @click="clearAllFilters"
            class="btn btn-sm btn-danger"
            :class="{ 'btn-outline-danger': activeFilterCount === 0 }"
          >
            <i class="bi bi-x-circle me-1"></i>
            مسح الفلاتر
            <span
              v-if="activeFilterCount > 0"
              class="badge bg-white text-danger ms-1"
              >{{ activeFilterCount }}</span
            >
          </button>
        </div>

        <div class="row g-4">
          <!-- نوع المستفيد -->
          <div class="col-md-6 col-lg-3">
            <label class="filter-label">
              <i class="bi bi-people me-1"></i> نوع المستفيد
            </label>
            <div class="filter-chips">
              <label
                v-for="opt in beneficiaryOptions"
                :key="opt.value"
                class="filter-chip"
                :class="{
                  active: selectedBeneficiaryTypes.includes(opt.value),
                }"
              >
                <input
                  type="checkbox"
                  v-model="selectedBeneficiaryTypes"
                  :value="opt.value"
                  class="d-none"
                />
                <i :class="opt.icon" class="me-1"></i>
                {{ opt.label }}
              </label>
            </div>
          </div>

          <!-- نوع المساعدة -->
          <div class="col-md-6 col-lg-3">
            <label class="filter-label">
              <i class="bi bi-box me-1"></i> نوع المساعدة
            </label>
            <div class="filter-chips">
              <label
                v-for="type in assistanceTypes"
                :key="type.assistanceTypeId"
                class="filter-chip"
                :class="{
                  active: selectedAssistanceTypes.includes(
                    type.assistanceTypeId,
                  ),
                }"
              >
                <input
                  type="checkbox"
                  v-model="selectedAssistanceTypes"
                  :value="type.assistanceTypeId"
                  class="d-none"
                />
                {{ type.assistanceTypeName }}
              </label>
            </div>
          </div>

          <!-- الفترة الزمنية -->
          <div class="col-md-6 col-lg-3">
            <label class="filter-label">
              <i class="bi bi-calendar-range me-1"></i> الفترة الزمنية
            </label>
            <div class="d-flex flex-column gap-2">
              <div class="input-group input-group-sm">
                <span class="input-group-text">من</span>
                <input
                  v-model="filterDateFrom"
                  type="date"
                  class="form-control"
                />
              </div>
              <div class="input-group input-group-sm">
                <span class="input-group-text">إلى</span>
                <input
                  v-model="filterDateTo"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- الترتيب -->
          <div class="col-md-6 col-lg-3">
            <label class="filter-label">
              <i class="bi bi-sort-down me-1"></i> الترتيب
            </label>
            <div class="filter-chips">
              <label
                v-for="opt in sortOptions"
                :key="opt.value"
                class="filter-chip"
                :class="{ active: sortBy === opt.value }"
              >
                <input
                  type="radio"
                  v-model="sortBy"
                  :value="opt.value"
                  class="d-none"
                />
                <i :class="opt.icon" class="me-1"></i>
                {{ opt.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="table-responsive rounded-2 shadow-sm border border-light-subtle"
    >
      <table class="table table-striped table-hover">
        <thead class="table-header text-white">
          <tr>
            <th style="width: 50px">
              <input
                type="checkbox"
                v-model="allSelected"
                class="form-check-input"
                style="cursor: pointer"
              />
            </th>
            <th>نوع المستفيد</th>
            <th>المستفيد</th>
            <th>نوع المساعدة</th>
            <th>تاريخ المساعدة</th>
            <th>الاستلام</th>
            <th>ملاحظات</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="assistance in paginatedAssistances"
            :key="assistance.assistanceId"
          >
            <td>
              <input
                type="checkbox"
                :checked="isSelected(assistance.assistanceId)"
                @change="toggleSelection(assistance.assistanceId)"
                class="form-check-input"
                style="cursor: pointer"
              />
            </td>
            <td>{{ getBeneficiaryType(assistance) }}</td>
            <td>
              {{
                getPersonName(assistance.personId) ||
                " أسرة " + getFamilyName(assistance.familyId)
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
            <td class="note-cell" :title="assistance.note || ''">
              {{ truncateNote(assistance.note) }}
            </td>
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

    <!-- Pagination Controls -->
    <div
      v-if="sortedAndFilteredAssistances.length > 0"
      class="d-flex justify-content-between align-items-center mt-4 no-print"
    >
      <div class="text-muted">
        عرض
        {{ (currentPage - 1) * itemsPerPage + 1 }}
        -
        {{
          Math.min(
            currentPage * itemsPerPage,
            sortedAndFilteredAssistances.length,
          )
        }}
        من {{ sortedAndFilteredAssistances.length }} مساعدة
      </div>

      <nav aria-label="تصفح المساعدات">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="prevPage"
              :disabled="currentPage === 1"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>

          <!-- عرض أرقام الصفحات -->
          <template v-if="totalPages <= 7">
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>
          </template>

          <!-- عرض مختصر للصفحات الكثيرة -->
          <template v-else>
            <li class="page-item" :class="{ active: currentPage === 1 }">
              <button class="page-link" @click="goToPage(1)">1</button>
            </li>

            <li v-if="currentPage > 3" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <template v-for="page in totalPages" :key="page">
              <li
                v-if="
                  page > 1 &&
                  page < totalPages &&
                  Math.abs(page - currentPage) <= 1
                "
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
            </template>

            <li v-if="currentPage < totalPages - 2" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li
              class="page-item"
              :class="{ active: currentPage === totalPages }"
            >
              <button class="page-link" @click="goToPage(totalPages)">
                {{ totalPages }}
              </button>
            </li>
          </template>

          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              class="page-link"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
        </ul>
      </nav>
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
        <div v-if="filterDateFrom || filterDateTo" class="text-muted">
          <small
            >الفترة :
            {{ filterDateFrom ? formatDate(filterDateFrom) : "..." }} -
            {{ filterDateTo ? formatDate(filterDateTo) : "..." }}</small
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
                " أسرة " + getFamilyName(assistance.familyId)
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
import { ref, computed, onMounted, watch } from "vue";
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
const filterDateFrom = ref("");
const filterDateTo = ref("");
const selectedAssistances = ref([]);

// Computed property for select all state (for current page)
const allSelected = computed({
  get: () =>
    paginatedAssistances.value.length > 0 &&
    paginatedAssistances.value.every((a) =>
      selectedAssistances.value.includes(a.assistanceId),
    ),
  set: (value) => {
    if (value) {
      // Add all items from current page
      paginatedAssistances.value.forEach((a) => {
        if (!selectedAssistances.value.includes(a.assistanceId)) {
          selectedAssistances.value.push(a.assistanceId);
        }
      });
    } else {
      // Remove all items from current page
      paginatedAssistances.value.forEach((a) => {
        const index = selectedAssistances.value.indexOf(a.assistanceId);
        if (index > -1) {
          selectedAssistances.value.splice(index, 1);
        }
      });
    }
  },
});

// Check if an assistance is selected
const isSelected = (id) => selectedAssistances.value.includes(id);

// Toggle selection of an assistance
const toggleSelection = (id) => {
  const index = selectedAssistances.value.indexOf(id);
  if (index > -1) {
    selectedAssistances.value.splice(index, 1);
  } else {
    selectedAssistances.value.push(id);
  }
};

// فلتر نوع المستفيد (مصفوفة للاختيار المتعدد)
const selectedBeneficiaryTypes = ref([]);

// فلتر نوع المساعدة (مصفوفة للاختيار المتعدد)
const selectedAssistanceTypes = ref([]);

// متغير الترتيب
const sortBy = ref("date-desc");

// خيارات نوع المستفيد
const beneficiaryOptions = [
  { value: "family", label: "أسر", icon: "bi bi-house-door" },
  { value: "widow", label: "أرامل", icon: "bi bi-person" },
  { value: "orphan", label: "أيتام", icon: "bi bi-person-heart" },
  { value: "other", label: "أخرى", icon: "bi bi-three-dots" },
];

// خيارات الترتيب
const sortOptions = [
  { value: "date-desc", label: "الأحدث", icon: "bi bi-sort-down" },
  { value: "date-asc", label: "الأقدم", icon: "bi bi-sort-up" },
  { value: "beneficiary", label: "المستفيد", icon: "bi bi-person" },
  { value: "type", label: "النوع", icon: "bi bi-tag" },
  { value: "received", label: "الاستلام", icon: "bi bi-check-circle" },
];

// متغيرات pagination
const currentPage = ref(1);
const itemsPerPage = 30;

const getAssistanceTypeName = (typeId) => {
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === typeId,
  );
  return assistanceType ? assistanceType.assistanceTypeName : "غير معروف";
};

const getFamilyName = (familyId) => {
  if (!familyId || familyId === 0) return "-";
  const family = families.value.find((f) => f.familyId === familyId);
  if (family && family.familyMembers && family.familyMembers.length > 0) {
    const headId = family.familyMembers[0];
    const headPerson = persons.value.find((p) => p.id === headId);
    if (headPerson) {
      return `${headPerson.firstName} ${headPerson.lastName}`;
    }
  }
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
    if (family && family.familyMembers && family.familyMembers.length > 0) {
      const headId = family.familyMembers[0];
      return headId;
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
    if (family && family.familyMembers && family.familyMembers.length > 0) {
      const headId = family.familyMembers[0];
      const person = persons.value.find((p) => p.id === headId);
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

// عدد الفلاتر النشطة
const activeFilterCount = computed(() => {
  let count = 0;
  if (selectedBeneficiaryTypes.value.length > 0) count++;
  if (selectedAssistanceTypes.value.length > 0) count++;
  if (filterDateFrom.value || filterDateTo.value) count++;
  return count;
});

// مسح جميع الفلاتر
const clearAllFilters = () => {
  selectedBeneficiaryTypes.value = [];
  selectedAssistanceTypes.value = [];
  filterDateFrom.value = "";
  filterDateTo.value = "";
  searchQuery.value = "";
  sortBy.value = "date-desc";
  alertify.message("تم مسح جميع الفلاتر");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const truncateNote = (note, maxLength = 100) => {
  if (!note) return "-";
  if (note.length <= maxLength) return note;
  return note.substring(0, maxLength) + "...";
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const fetchData = async () => {
  const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };

  try {
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
  if (selectedBeneficiaryTypes.value.length > 0) {
    result = result.filter((assistance) => {
      const beneficiaryType = getBeneficiaryType(assistance);
      return selectedBeneficiaryTypes.value.some((filter) => {
        if (filter === "family") return beneficiaryType === "أسرة";
        if (filter === "widow") return beneficiaryType === "أرمل/ة";
        if (filter === "orphan") return beneficiaryType === "يتيم/ة";
        if (filter === "other")
          return beneficiaryType === "فرد" || beneficiaryType === "غير محدد";
        return false;
      });
    });
  }

  // تطبيق فلتر نوع المساعدة
  if (selectedAssistanceTypes.value.length > 0) {
    result = result.filter((assistance) =>
      selectedAssistanceTypes.value.includes(assistance.assistanceTypeId),
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
  if (filterDateFrom.value || filterDateTo.value) {
    result = result.filter((assistance) => {
      if (!assistance.date) return false;
      const assistanceDate = new Date(assistance.date);
      const fromDate = filterDateFrom.value
        ? new Date(filterDateFrom.value)
        : null;
      const toDate = filterDateTo.value ? new Date(filterDateTo.value) : null;

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

  // تطبيق الترتيب
  const sorted = [...result];
  if (sortBy.value === "date-desc") {
    sorted.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });
  } else if (sortBy.value === "date-asc") {
    sorted.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateA - dateB;
    });
  } else if (sortBy.value === "beneficiary") {
    sorted.sort((a, b) => {
      const nameA = (
        getPersonName(a.personId) || " عائلة " + getFamilyName(a.familyId)
      ).toLowerCase();
      const nameB = (
        getPersonName(b.personId) || " عائلة " + getFamilyName(b.familyId)
      ).toLowerCase();
      return nameA.localeCompare(nameB, "ar");
    });
  } else if (sortBy.value === "type") {
    sorted.sort((a, b) => {
      const typeA = getAssistanceTypeName(a.assistanceTypeId);
      const typeB = getAssistanceTypeName(b.assistanceTypeId);
      return typeA.localeCompare(typeB, "ar");
    });
  } else if (sortBy.value === "received") {
    sorted.sort((a, b) => b.received - a.received);
  }

  return sorted;
});

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(sortedAndFilteredAssistances.value.length / itemsPerPage);
});

const paginatedAssistances = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedAndFilteredAssistances.value.slice(start, end);
});

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // التمرير لأعلى الجدول عند تغيير الصفحة
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

// إعادة ضبط الصفحة عند تغيير الفلاتر
watch(
  [
    searchQuery,
    selectedBeneficiaryTypes,
    selectedAssistanceTypes,
    filterDateFrom,
    filterDateTo,
    sortBy,
  ],
  () => {
    currentPage.value = 1;
  },
);

// Helper function to format received status for printing
const getReceivedStatusText = (received) => {
  return received ? "تم الاستلام" : "لم يتم الاستلام";
};

// Sort assistances alphabetically by beneficiary name for printing
const getSortedPrintAssistances = () => {
  return [...sortedAndFilteredAssistances.value].sort((a, b) => {
    const nameA =
      getPersonName(a.personId) || " أسرة " + getFamilyName(a.familyId);
    const nameB =
      getPersonName(b.personId) || " أسرة " + getFamilyName(b.familyId);
    return nameA.localeCompare(nameB, "ar");
  });
};

// Generate dynamic print title based on active filters
const getPrintTitle = () => {
  const filters = [];

  if (selectedAssistanceTypes.value.length > 0) {
    const typeNames = selectedAssistanceTypes.value.map((id) =>
      getAssistanceTypeName(id),
    );
    filters.push(typeNames.join("، "));
  }

  if (selectedBeneficiaryTypes.value.length > 0) {
    const filterLabels = {
      family: "أسر",
      widow: "أرامل",
      orphan: "أيتام",
      other: "أخرى",
    };
    const labels = selectedBeneficiaryTypes.value.map((v) => filterLabels[v]);
    filters.push(labels.join("، "));
  }

  return filters.length > 0 ? filters.join(" - ") : "";
};

const directPrint = () => {
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

// Bulk delete selected assistances
const deleteSelected = async () => {
  if (selectedAssistances.value.length === 0) {
    alertify.warning("الرجاء اختيار مساعدة واحدة على الأقل للحذف");
    return;
  }

  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  const count = selectedAssistances.value.length;
  alertify.confirm(
    "تأكيد الحذف",
    `هل أنت متأكد من حذف ${count} مساعدة؟`,
    async function () {
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedAssistances.value) {
        try {
          await axios.delete(`${API_BASE_URL}/Assistance/${id}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          });
          successCount++;
        } catch (error) {
          console.error(`Error deleting assistance ${id}:`, error);
          failCount++;
        }
      }

      await fetchData();
      selectedAssistances.value = [];

      if (successCount > 0) {
        alertify.success(`تم حذف ${successCount} مساعدة بنجاح`);
      }
      if (failCount > 0) {
        alertify.error(`فشل حذف ${failCount} مساعدة`);
      }
    },
    function () {
      alertify.message("تم إلغاء عملية الحذف");
    },
  );
};

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

.note-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
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

/* تنسيق لوحة الفلاتر */
.filter-panel {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  animation: slideDown 0.3s ease;
}

.filter-label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border: 1.5px solid #dee2e6;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
  color: #495057;
  user-select: none;
}

.filter-chip:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

.filter-chip.active {
  background: #42b983;
  color: #fff;
  border-color: #42b983;
  box-shadow: 0 2px 6px rgba(66, 185, 131, 0.3);
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 50%;
  background: #dc3545;
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 0.4rem;
}

.form-control::placeholder {
  text-align: right;
}

/* تنسيق فلترة التاريخ */
.filter-panel .input-group-text {
  font-size: 0.8rem;
  background-color: #f8f9fa;
  border-color: #dee2e6;
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

/* تأثيرات الانتقال للوحة الفلاتر */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

/* Pagination Styles */
.pagination {
  gap: 0.25rem;
}

.page-link {
  color: #42b983;
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  font-weight: 500;
}

.page-link:hover {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.page-item.active .page-link {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
  font-weight: bold;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

.page-link:focus {
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.25);
  z-index: 3;
}
</style>
