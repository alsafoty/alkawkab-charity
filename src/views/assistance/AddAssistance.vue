<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div class="card-header bg-success text-white py-3">
        <h3 class="mb-0 fw-bold">إضافة مساعدات متعددة</h3>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm">
          <!-- Instructions -->
          <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i>
            <strong>تعليمات:</strong> يمكنك اختيار عدة أسر أو أرامل أو أيتام في
            كل صف، وسيتم توزيع المساعدة على جميع المختارين.
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table table-bordered table-hover large-table">
              <thead class="table-header text-white">
                <tr>
                  <th width="23%">نوع المساعدة</th>
                  <th width="18%">أسر</th>
                  <th width="18%">أرامل</th>
                  <th width="18%">أيتام</th>
                  <th width="10%">الاستلام</th>
                  <th width="8%">ملاحظات</th>
                  <th width="5%">حذف</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in assistanceRows"
                  :key="index"
                  class="assistance-row"
                >
                  <!-- Assistance Type Column -->
                  <td>
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle w-100 text-end"
                        type="button"
                        :id="`assistanceTypeDropdown${index}`"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        {{
                          getSelectedAssistanceTypeText(row.assistanceTypeId)
                        }}
                      </button>
                      <ul
                        class="dropdown-menu w-100 assistance-type-dropdown rtl-dropdown"
                        :aria-labelledby="`assistanceTypeDropdown${index}`"
                      >
                        <li class="dropdown-item-search">
                          <input
                            type="text"
                            class="form-control search-input"
                            placeholder="البحث في أنواع المساعدات..."
                            v-model="row.assistanceTypeSearchTerm"
                            @click.stop
                          />
                        </li>
                        <li class="dropdown-divider"></li>
                        <li
                          v-for="type in getFilteredAssistanceTypes(
                            row.assistanceTypeSearchTerm,
                          )"
                          :key="type.assistanceTypeId"
                        >
                          <div
                            class="dropdown-item rtl-check clickable-item"
                            @click.stop="
                              selectAssistanceType(row, type.assistanceTypeId)
                            "
                          >
                            <span class="rtl-label">{{
                              type.assistanceTypeName
                            }}</span>
                          </div>
                        </li>
                        <li
                          v-if="
                            getFilteredAssistanceTypes(
                              row.assistanceTypeSearchTerm,
                            ).length === 0
                          "
                        >
                          <span class="dropdown-item text-muted text-end">
                            {{
                              row.assistanceTypeSearchTerm
                                ? "لا توجد نتائج"
                                : "لا توجد أنواع مساعدات"
                            }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>

                  <!-- Families Column -->
                  <td>
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle w-100 text-end"
                        type="button"
                        :id="`familiesDropdown${index}`"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        {{ getSelectedFamiliesText(row.selectedFamilies) }}
                      </button>
                      <ul
                        class="dropdown-menu w-100 families-dropdown rtl-dropdown"
                        :aria-labelledby="`familiesDropdown${index}`"
                      >
                        <li class="dropdown-item-search">
                          <input
                            type="text"
                            class="form-control search-input"
                            placeholder="البحث في العائلات..."
                            v-model="row.familySearchTerm"
                            @click.stop
                          />
                        </li>
                        <li class="dropdown-divider"></li>
                        <li
                          v-for="family in getFilteredFamilies(
                            row.familySearchTerm,
                          )"
                          :key="family.familyId"
                        >
                          <div
                            class="form-check dropdown-item-check rtl-check clickable-item"
                            @click.stop="
                              toggleFamilySelection(row, family.familyId)
                            "
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`family-${index}-${family.familyId}`"
                              :value="family.familyId"
                              v-model="row.selectedFamilies"
                              @click.stop
                            />
                            <label
                              class="form-check-label rtl-label"
                              :for="`family-${index}-${family.familyId}`"
                            >
                              {{ family.name }}
                            </label>
                          </div>
                        </li>
                        <li
                          v-if="
                            getFilteredFamilies(row.familySearchTerm).length ===
                            0
                          "
                        >
                          <span class="dropdown-item text-muted text-end">
                            {{
                              row.familySearchTerm
                                ? "لا توجد نتائج"
                                : "لا توجد عائلات"
                            }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>

                  <!-- Widows Column -->
                  <td>
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle w-100 text-end"
                        type="button"
                        :id="`widowsDropdown${index}`"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        {{ getSelectedWidowsText(row.selectedWidows) }}
                      </button>
                      <ul
                        class="dropdown-menu w-100 widows-dropdown rtl-dropdown"
                        :aria-labelledby="`widowsDropdown${index}`"
                      >
                        <li class="dropdown-item-search">
                          <input
                            type="text"
                            class="form-control search-input"
                            placeholder="البحث في الأرامل..."
                            v-model="row.widowSearchTerm"
                            @click.stop
                          />
                        </li>
                        <li class="dropdown-divider"></li>
                        <li
                          v-for="widow in getFilteredWidows(
                            row.widowSearchTerm,
                          )"
                          :key="widow.id"
                        >
                          <div
                            class="form-check dropdown-item-check rtl-check clickable-item"
                            @click.stop="toggleWidowSelection(row, widow.id)"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`widow-${index}-${widow.id}`"
                              :value="widow.id"
                              v-model="row.selectedWidows"
                              @click.stop
                            />
                            <label
                              class="form-check-label rtl-label"
                              :for="`widow-${index}-${widow.id}`"
                            >
                              {{ widow.firstName }} {{ widow.lastName }}
                            </label>
                          </div>
                        </li>
                        <li
                          v-if="
                            getFilteredWidows(row.widowSearchTerm).length === 0
                          "
                        >
                          <span class="dropdown-item text-muted text-end">
                            {{
                              row.widowSearchTerm
                                ? "لا توجد نتائج"
                                : "لا يوجد أرامل"
                            }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>

                  <!-- Orphans Column -->
                  <td>
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle w-100 text-end"
                        type="button"
                        :id="`orphansDropdown${index}`"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        {{ getSelectedOrphansText(row.selectedOrphans) }}
                      </button>
                      <ul
                        class="dropdown-menu w-100 orphans-dropdown rtl-dropdown"
                        :aria-labelledby="`orphansDropdown${index}`"
                      >
                        <li class="dropdown-item-search">
                          <input
                            type="text"
                            class="form-control search-input"
                            placeholder="البحث في الأيتام..."
                            v-model="row.orphanSearchTerm"
                            @click.stop
                          />
                        </li>
                        <li class="dropdown-divider"></li>
                        <li
                          v-for="orphan in getFilteredOrphans(
                            row.orphanSearchTerm,
                          )"
                          :key="orphan.id"
                        >
                          <div
                            class="form-check dropdown-item-check rtl-check clickable-item"
                            @click.stop="toggleOrphanSelection(row, orphan.id)"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`orphan-${index}-${orphan.id}`"
                              :value="orphan.id"
                              v-model="row.selectedOrphans"
                              @click.stop
                            />
                            <label
                              class="form-check-label rtl-label"
                              :for="`orphan-${index}-${orphan.id}`"
                            >
                              {{ orphan.firstName }} {{ orphan.lastName }}
                            </label>
                          </div>
                        </li>
                        <li
                          v-if="
                            getFilteredOrphans(row.orphanSearchTerm).length ===
                            0
                          "
                        >
                          <span class="dropdown-item text-muted text-end">
                            {{
                              row.orphanSearchTerm
                                ? "لا توجد نتائج"
                                : "لا يوجد أيتام"
                            }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>

                  <!-- Received Column -->
                  <td>
                    <div class="form-check">
                      <input
                        v-model="row.received"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="received-{{ index }}"
                      />
                      <label
                        class="form-check-label"
                        for="received-{{ index }}"
                      >
                        {{ row.received ? "نعم" : "لا" }}
                      </label>
                    </div>
                  </td>

                  <!-- Notes Column -->
                  <td>
                    <textarea
                      v-model="row.note"
                      class="form-control notes-textarea"
                      rows="2"
                      placeholder="ملاحظات..."
                    ></textarea>
                  </td>

                  <!-- Delete Column -->
                  <td class="text-center">
                    <button
                      @click="deleteRow(index)"
                      type="button"
                      class="btn btn-danger btn-sm"
                      :disabled="assistanceRows.length === 1"
                      :title="
                        assistanceRows.length === 1
                          ? 'لا يمكن حذف الصف الوحيد'
                          : 'حذف الصف'
                      "
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add Row Button -->
          <div class="text-center mb-4">
            <button
              @click="addRow"
              type="button"
              class="btn btn-outline-success"
            >
              <i class="bi bi-plus-circle me-1"></i>
              إضافة صف جديد
            </button>
          </div>

          <!-- Summary -->
          <div class="alert alert-light mb-4">
            <h6 class="fw-bold mb-2">ملخص المساعدات:</h6>
            <div
              v-for="(summary, index) in getSubmissionSummary()"
              :key="index"
              class="mb-1"
            >
              <small>
                <strong>الصف {{ index + 1 }}:</strong>
                {{ summary.recipients }} مستفيد - {{ summary.typeName }}
              </small>
            </div>
            <hr class="my-2" />
            <strong>إجمالي المساعدات: {{ getTotalAssistances() }}</strong>
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button
              type="submit"
              class="btn btn-success btn-lg px-5"
              :disabled="isSubmitting"
            >
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSubmitting ? "جاري الإضافة..." : "إضافة جميع المساعدات" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL + "/api";
const router = useRouter();
const AUTH_TOKEN = localStorage.getItem("token");

const families = ref([]);
const assistanceTypes = ref([]);
const allPersons = ref([]);
const isSubmitting = ref(false);

// Initialize with one row
const assistanceRows = ref([
  {
    selectedFamilies: [],
    selectedWidows: [],
    selectedOrphans: [],
    assistanceTypeId: "",
    note: "",
    familySearchTerm: "",
    widowSearchTerm: "",
    orphanSearchTerm: "",
    assistanceTypeSearchTerm: "",
    received: true,
  },
]);

onMounted(async () => {
  await loadInitialData();
});

const loadInitialData = async () => {
  try {

    // جلب العائلات
    const familyResponse = await axios.get(`${API_BASE_URL}/Family`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    families.value = familyResponse.data;

    // جلب أنواع المساعدات
    const assistanceTypesResponse = await axios.get(
      `${API_BASE_URL}/AssistanceType`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      },
    );
    assistanceTypes.value = assistanceTypesResponse.data;

    // جلب جميع الأشخاص
    const personsResponse = await axios.get(`${API_BASE_URL}/Person`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    allPersons.value = personsResponse.data;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    alertify.error("حدث خطأ أثناء جلب البيانات الأولية");
  }
};

const addRow = () => {
  assistanceRows.value.push({
    selectedFamilies: [],
    selectedWidows: [],
    selectedOrphans: [],
    assistanceTypeId: "",
    note: "",
    familySearchTerm: "",
    widowSearchTerm: "",
    orphanSearchTerm: "",
    assistanceTypeSearchTerm: "",
    received: true,
  });
  alertify.success("تم إضافة صف جديد");
};

const deleteRow = (index) => {
  if (assistanceRows.value.length === 1) {
    alertify.warning("لا يمكن حذف الصف الوحيد");
    return;
  }
  assistanceRows.value.splice(index, 1);
  alertify.success("تم حذف الصف بنجاح");
};

// Search filter functions
const getFilteredFamilies = (searchTerm) => {
  if (!searchTerm) return families.value;
  return families.value.filter((family) =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

const getFilteredWidows = (searchTerm) => {
  const widows = allPersons.value.filter((person) => person.isWidow === true);
  if (!searchTerm) return widows;
  return widows.filter((widow) =>
    `${widow.firstName} ${widow.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
};

const getFilteredOrphans = (searchTerm) => {
  const orphans = allPersons.value.filter((person) => person.isOrphan === true);
  if (!searchTerm) return orphans;
  return orphans.filter((orphan) =>
    `${orphan.firstName} ${orphan.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
};

const getFilteredAssistanceTypes = (searchTerm) => {
  if (!searchTerm) return assistanceTypes.value;
  return assistanceTypes.value.filter((type) =>
    type.assistanceTypeName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

// Toggle family selection
const toggleFamilySelection = (row, familyId) => {
  const index = row.selectedFamilies.indexOf(familyId);
  if (index > -1) {
    row.selectedFamilies.splice(index, 1);
  } else {
    row.selectedFamilies.push(familyId);
  }
};

// Toggle widow selection
const toggleWidowSelection = (row, widowId) => {
  const index = row.selectedWidows.indexOf(widowId);
  if (index > -1) {
    row.selectedWidows.splice(index, 1);
  } else {
    row.selectedWidows.push(widowId);
  }
};

// Toggle orphan selection
const toggleOrphanSelection = (row, orphanId) => {
  const index = row.selectedOrphans.indexOf(orphanId);
  if (index > -1) {
    row.selectedOrphans.splice(index, 1);
  } else {
    row.selectedOrphans.push(orphanId);
  }
};

// Select assistance type
const selectAssistanceType = (row, typeId) => {
  row.assistanceTypeId = typeId;
  // Close dropdown after selection
  const dropdown = document.querySelector(
    `#assistanceTypeDropdown${assistanceRows.value.indexOf(row)}`,
  );
  if (dropdown) {
    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
    if (bsDropdown) {
      bsDropdown.hide();
    }
  }
};

const getSelectedFamiliesText = (selectedFamilies) => {
  if (selectedFamilies.length === 0) return "اختر الأسر";
  if (selectedFamilies.length === 1) {
    const family = families.value.find(
      (f) => f.familyId === selectedFamilies[0],
    );
    return family ? family.name : "أسرة غير معروفة";
  }
  return `${selectedFamilies.length} أسرة مختارة`;
};

const getSelectedWidowsText = (selectedWidows) => {
  if (selectedWidows.length === 0) return "اختر الأرامل";
  if (selectedWidows.length === 1) {
    const widow = allPersons.value.find((p) => p.id === selectedWidows[0]);
    return widow ? `${widow.firstName} ${widow.lastName}` : "أرملة غير معروفة";
  }
  return `${selectedWidows.length} أرملة مختارة`;
};

const getSelectedOrphansText = (selectedOrphans) => {
  if (selectedOrphans.length === 0) return "اختر الأيتام";
  if (selectedOrphans.length === 1) {
    const orphan = allPersons.value.find((p) => p.id === selectedOrphans[0]);
    return orphan ? `${orphan.firstName} ${orphan.lastName}` : "يتيم غير معروف";
  }
  return `${selectedOrphans.length} يتيم مختار`;
};

const getSelectedAssistanceTypeText = (typeId) => {
  if (!typeId) return "اختر نوع المساعدة";
  const type = assistanceTypes.value.find((t) => t.assistanceTypeId === typeId);
  return type ? type.assistanceTypeName : "نوع غير معروف";
};

const getAssistanceTypeName = (typeId) => {
  const type = assistanceTypes.value.find((t) => t.assistanceTypeId === typeId);
  return type ? type.assistanceTypeName : "غير معروف";
};

const getSubmissionSummary = () => {
  return assistanceRows.value.map((row) => {
    const recipientCount =
      row.selectedFamilies.length +
      row.selectedWidows.length +
      row.selectedOrphans.length;
    const typeName = getAssistanceTypeName(row.assistanceTypeId);
    return {
      recipients: recipientCount,
      typeName: typeName,
      total: recipientCount,
    };
  });
};

const getTotalAssistances = () => {
  return getSubmissionSummary().reduce(
    (total, summary) => total + summary.total,
    0,
  );
};

const submitForm = async () => {
  if (!AUTH_TOKEN) {
    alertify.error("الرجاء تسجيل الدخول أولاً.");
    return;
  }

  // Validate data
  for (let i = 0; i < assistanceRows.value.length; i++) {
    const row = assistanceRows.value[i];

    if (
      row.selectedFamilies.length === 0 &&
      row.selectedWidows.length === 0 &&
      row.selectedOrphans.length === 0
    ) {
      alertify.warning(
        `يرجى اختيار أسرة أو أرملة أو يتيم واحد على الأقل في الصف ${i + 1}`,
      );
      return;
    }

    if (!row.assistanceTypeId) {
      alertify.warning(`يرجى اختيار نوع المساعدة في الصف ${i + 1}`);
      return;
    }
  }

  // Show confirmation dialog before submitting
  const totalAssistances = getTotalAssistances();
  alertify.confirm(
    "تأكيد الإرسال",
    `هل أنت متأكد من إضافة ${totalAssistances} مساعدة؟`,
    async function () {
      // User clicked OK
      isSubmitting.value = true;

      try {
        const assistancesToSubmit = [];

        // Process each row
        for (const row of assistanceRows.value) {
          // Add assistances for selected families
          for (const familyId of row.selectedFamilies) {
            assistancesToSubmit.push({
              numberOfAssistance: 1,
              familyId: Number(familyId),
              personId: null,
              assistanceTypeId: Number(row.assistanceTypeId),
              note: row.note || "",
              received: row.received,
            });
          }

          // Add assistances for selected widows
          for (const widowId of row.selectedWidows) {
            assistancesToSubmit.push({
              numberOfAssistance: 1,
              familyId: null,
              personId: widowId,
              assistanceTypeId: Number(row.assistanceTypeId),
              note: row.note || "",
              received: row.received,
            });
          }

          // Add assistances for selected orphans
          for (const orphanId of row.selectedOrphans) {
            assistancesToSubmit.push({
              numberOfAssistance: 1,
              familyId: null,
              personId: orphanId,
              assistanceTypeId: Number(row.assistanceTypeId),
              note: row.note || "",
              received: row.received,
            });
          }
        }

        console.log("Assistances to submit:", assistancesToSubmit);

        // Submit all assistances
        const promises = assistancesToSubmit.map((assistance) =>
          axios.post(`${API_BASE_URL}/Assistance`, assistance, {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              "Content-Type": "application/json",
            },
          }),
        );

        await Promise.all(promises);

        alertify.success(
          `تم إضافة ${assistancesToSubmit.length} مساعدة بنجاح!`,
        );

        // Navigate after a short delay to show success message
        setTimeout(() => {
          router.push("/assistance");
        }, 1500);
      } catch (error) {
        console.error("Error adding assistances:", error);
        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;
          alertify.error(`حدث خطأ أثناء إضافة المساعدات: ${errorMessage}`);
        } else {
          alertify.error("حدث خطأ أثناء إضافة المساعدات");
        }
      } finally {
        isSubmitting.value = false;
      }
    },
    function () {
      // User clicked Cancel
      alertify.message("تم إلغاء عملية الإرسال");
    },
  );
};
</script>

<style scoped>
.table-header {
  background-color: #42b983 !important;
}

.large-table {
  font-size: 1rem;
  min-height: 400px;
}

.large-table td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.large-table th {
  padding: 1rem 0.75rem;
  font-size: 1.1rem;
}

.assistance-row td {
  vertical-align: middle;
}

/* RTL Dropdown Styles */
.rtl-dropdown {
  max-height: 300px;
  overflow-y: auto;
  direction: rtl;
  text-align: right;
}

.rtl-check {
  padding: 0.5rem 1rem;
  margin: 0;
  direction: rtl;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.rtl-check:hover {
  background-color: #f8f9fa;
}

.rtl-check.clickable-item {
  user-select: none;
}

.rtl-check .form-check-input {
  margin-right: 0;
  margin-left: 0.5rem;
  float: none;
  cursor: pointer;
}

.rtl-label {
  flex: 1;
  text-align: right;
  margin-right: 0;
  margin-left: 0;
  cursor: pointer;
  user-select: none;
}

/* Search input styles */
.dropdown-item-search {
  padding: 0.5rem 1rem;
  margin: 0;
}

.search-input {
  text-align: right;
  direction: rtl;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  font-size: 0.9rem;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.2rem rgba(66, 185, 131, 0.25);
}

.dropdown-divider {
  margin: 0.5rem 0;
}

/* Notes textarea styling */
.notes-textarea {
  resize: vertical;
  min-height: 60px;
  font-size: 0.9rem;
}

.form-control,
.form-select {
  text-align: right;
}

.btn-success {
  background-color: #42b983;
  border-color: #42b983;
}

.btn-success:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

.dropdown-toggle::after {
  float: left;
  margin-top: 0.5rem;
}

.text-end {
  text-align: right !important;
}

/* Font family */
* {
  font-family: "Tajawal", sans-serif;
}

/* Custom scrollbar for dropdowns */
.rtl-dropdown::-webkit-scrollbar {
  width: 8px;
}

.rtl-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.rtl-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.rtl-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .large-table {
    font-size: 0.9rem;
  }

  .large-table td,
  .large-table th {
    padding: 0.75rem 0.5rem;
  }

  .notes-textarea {
    min-height: 50px;
  }
}
</style>
