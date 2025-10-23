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
            <strong>تعليمات:</strong> يمكنك اختيار عدة عائلات أو أفراد في كل صف،
            وسيتم توزيع المساعدة على جميع المختارين.
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table table-bordered table-hover large-table">
              <thead class="table-header text-white">
                <tr>
                  <th width="25%">العائلات</th>
                  <th width="25%">الأفراد</th>
                  <th width="20%">نوع المساعدة</th>
                  <th width="10%">العدد</th>
                  <th width="10%">الاستلام</th>
                  <th width="15%">ملاحظات</th>
                  <th width="5%">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in assistanceRows"
                  :key="index"
                  class="assistance-row"
                >
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
                            row.familySearchTerm
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

                  <!-- Persons Column -->
                  <td>
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle w-100 text-end"
                        type="button"
                        :id="`personsDropdown${index}`"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-auto-close="outside"
                      >
                        {{ getSelectedPersonsText(row.selectedPersons) }}
                      </button>
                      <ul
                        class="dropdown-menu w-100 persons-dropdown rtl-dropdown"
                        :aria-labelledby="`personsDropdown${index}`"
                      >
                        <li class="dropdown-item-search">
                          <input
                            type="text"
                            class="form-control search-input"
                            placeholder="البحث في الأشخاص..."
                            v-model="row.personSearchTerm"
                            @click.stop
                          />
                        </li>
                        <li class="dropdown-divider"></li>
                        <li
                          v-for="person in getFilteredPersons(
                            row.personSearchTerm
                          )"
                          :key="person.id"
                        >
                          <div
                            class="form-check dropdown-item-check rtl-check clickable-item"
                            @click.stop="togglePersonSelection(row, person.id)"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`person-${index}-${person.id}`"
                              :value="person.id"
                              v-model="row.selectedPersons"
                              @click.stop
                            />
                            <label
                              class="form-check-label rtl-label"
                              :for="`person-${index}-${person.id}`"
                            >
                              {{ person.firstName }} {{ person.lastName }}
                            </label>
                          </div>
                        </li>
                        <li
                          v-if="
                            getFilteredPersons(row.personSearchTerm).length ===
                            0
                          "
                        >
                          <span class="dropdown-item text-muted text-end">
                            {{
                              row.personSearchTerm
                                ? "لا توجد نتائج"
                                : "لا يوجد أشخاص"
                            }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>

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
                            row.assistanceTypeSearchTerm
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
                              row.assistanceTypeSearchTerm
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

                  <!-- Number Column -->
                  <td>
                    <input
                      v-model.number="row.numberOfAssistance"
                      type="number"
                      class="form-control text-center"
                      min="1"
                      required
                    />
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

                  <!-- Actions Column -->
                  <td class="text-center">
                    <button
                      v-if="assistanceRows.length > 1"
                      @click="removeRow(index)"
                      type="button"
                      class="btn btn-danger btn-sm"
                      title="حذف الصف"
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
                {{ summary.recipients }} مستفيد × {{ summary.count }}
                {{ summary.typeName }} = {{ summary.total }} مساعدة
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
    selectedPersons: [],
    assistanceTypeId: "",
    numberOfAssistance: 1,
    note: "",
    familySearchTerm: "",
    personSearchTerm: "",
    assistanceTypeSearchTerm: "",
    received: false,
  },
]);

onMounted(async () => {
  await loadInitialData();
});

const loadInitialData = async () => {
  try {
    alertify.message("جاري تحميل البيانات الأولية...");

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
      }
    );
    assistanceTypes.value = assistanceTypesResponse.data;

    // جلب جميع الأشخاص
    const personsResponse = await axios.get(`${API_BASE_URL}/Person`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    allPersons.value = personsResponse.data;

    alertify.success("تم تحميل البيانات بنجاح");
  } catch (error) {
    console.error("Error fetching initial data:", error);
    alertify.error("حدث خطأ أثناء جلب البيانات الأولية");
  }
};

const addRow = () => {
  assistanceRows.value.push({
    selectedFamilies: [],
    selectedPersons: [],
    assistanceTypeId: "",
    numberOfAssistance: 1,
    note: "",
    familySearchTerm: "",
    personSearchTerm: "",
    assistanceTypeSearchTerm: "",
    received: false,
  });
  alertify.success("تم إضافة صف جديد");
};

const removeRow = (index) => {
  if (assistanceRows.value.length > 1) {
    alertify.confirm(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا الصف؟",
      function () {
        // User clicked OK
        assistanceRows.value.splice(index, 1);
        alertify.success("تم حذف الصف بنجاح");
      },
      function () {
        // User clicked Cancel
        alertify.message("تم إلغاء عملية الحذف");
      }
    );
  } else {
    alertify.warning("لا يمكن حذف الصف الأخير");
  }
};

// Search filter functions
const getFilteredFamilies = (searchTerm) => {
  if (!searchTerm) return families.value;
  return families.value.filter((family) =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const getFilteredPersons = (searchTerm) => {
  if (!searchTerm) return allPersons.value;
  return allPersons.value.filter((person) =>
    `${person.firstName} ${person.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
};

const getFilteredAssistanceTypes = (searchTerm) => {
  if (!searchTerm) return assistanceTypes.value;
  return assistanceTypes.value.filter((type) =>
    type.assistanceTypeName.toLowerCase().includes(searchTerm.toLowerCase())
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

// Toggle person selection
const togglePersonSelection = (row, personId) => {
  const index = row.selectedPersons.indexOf(personId);
  if (index > -1) {
    row.selectedPersons.splice(index, 1);
  } else {
    row.selectedPersons.push(personId);
  }
};

// Select assistance type
const selectAssistanceType = (row, typeId) => {
  row.assistanceTypeId = typeId;
  // Close dropdown after selection
  const dropdown = document.querySelector(
    `#assistanceTypeDropdown${assistanceRows.value.indexOf(row)}`
  );
  if (dropdown) {
    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
    if (bsDropdown) {
      bsDropdown.hide();
    }
  }
};

const getSelectedFamiliesText = (selectedFamilies) => {
  if (selectedFamilies.length === 0) return "اختر العائلات";
  if (selectedFamilies.length === 1) {
    const family = families.value.find(
      (f) => f.familyId === selectedFamilies[0]
    );
    return family ? family.name : "عائلة غير معروفة";
  }
  return `${selectedFamilies.length} عائلة مختارة`;
};

const getSelectedPersonsText = (selectedPersons) => {
  if (selectedPersons.length === 0) return "اختر الأشخاص";
  if (selectedPersons.length === 1) {
    const person = allPersons.value.find((p) => p.id === selectedPersons[0]);
    return person ? `${person.firstName} ${person.lastName}` : "شخص غير معروف";
  }
  return `${selectedPersons.length} شخص مختار`;
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
      row.selectedFamilies.length + row.selectedPersons.length;
    const typeName = getAssistanceTypeName(row.assistanceTypeId);
    return {
      recipients: recipientCount,
      count: row.numberOfAssistance,
      typeName: typeName,
      total: recipientCount * row.numberOfAssistance,
    };
  });
};

const getTotalAssistances = () => {
  return getSubmissionSummary().reduce(
    (total, summary) => total + summary.total,
    0
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

    if (row.selectedFamilies.length === 0 && row.selectedPersons.length === 0) {
      alertify.warning(
        `يرجى اختيار عائلة أو شخص واحد على الأقل في الصف ${i + 1}`
      );
      return;
    }

    if (!row.assistanceTypeId) {
      alertify.warning(`يرجى اختيار نوع المساعدة في الصف ${i + 1}`);
      return;
    }

    if (!row.numberOfAssistance || row.numberOfAssistance < 1) {
      alertify.warning(`يرجى إدخال عدد صحيح للمساعدات في الصف ${i + 1}`);
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
      alertify.message("جاري إضافة المساعدات...");

      try {
        const assistancesToSubmit = [];

        // Process each row
        for (const row of assistanceRows.value) {
          // Add assistances for selected families
          for (const familyId of row.selectedFamilies) {
            assistancesToSubmit.push({
              numberOfAssistance: Number(row.numberOfAssistance),
              familyId: Number(familyId),
              personId: null,
              assistanceTypeId: Number(row.assistanceTypeId),
              note: row.note || "",
              received: row.received,
            });
          }

          // Add assistances for selected persons
          for (const personId of row.selectedPersons) {
            assistancesToSubmit.push({
              numberOfAssistance: Number(row.numberOfAssistance),
              familyId: null,
              personId: personId,
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
          })
        );

        await Promise.all(promises);

        alertify.success(
          `تم إضافة ${assistancesToSubmit.length} مساعدة بنجاح!`
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
    }
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
