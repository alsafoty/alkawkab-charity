<template>
  <div class="container my-4 p-5 rounded-4" dir="rtl">
    <div class="card border-0 shadow">
      <div
        class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center"
      >
        <h3 class="mb-0 fw-bold">تفاصيل الشخص</h3>
        <button class="btn btn-light no-print" @click="printContent">
          <i class="bi bi-printer me-1"></i>
          طباعة
        </button>
      </div>
      <div class="card-body p-4" ref="printArea">
        <div class="row g-4">
          <div class="col-md-6">
            <div class="info-section">
              <h4 class="section-title mb-3">المعلومات الشخصية</h4>
              <div class="info-grid">
                <div class="info-item">
                  <strong>الرقم الوطني:</strong> {{ personData.id }}
                </div>
                <div class="info-item">
                  <strong>الجنس:</strong> {{ personData.gender }}
                </div>
                <div class="info-item">
                  <strong>الاسم الأول:</strong> {{ personData.firstName }}
                </div>
                <div class="info-item">
                  <strong>اسم الأب:</strong> {{ personData.secondName }}
                </div>
                <div class="info-item">
                  <strong>اسم الجد:</strong> {{ personData.thirdName }}
                </div>
                <div class="info-item">
                  <strong>اسم العائلة:</strong> {{ personData.lastName }}
                </div>
                <div class="info-item">
                  <strong>رقم الجوال:</strong> {{ personData.phoneNumber }}
                </div>
                <div class="info-item">
                  <strong>المستوى التعليمي:</strong>
                  {{ personData.educationalLevel }}
                </div>
                <div class="info-item">
                  <strong>المهنة:</strong> {{ personData.job }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="info-section">
              <h4 class="section-title mb-3">الحالة</h4>
              <div class="info-grid">
                <div class="info-item">
                  <strong>أرمل/ة:</strong>
                  {{ personData.isWidow ? "نعم" : "لا" }}
                </div>
                <div class="info-item">
                  <strong>يتيم/ة:</strong>
                  <span
                    :class="
                      personData.isOrphan ? 'badge bg-warning text-dark' : ''
                    "
                  >
                    {{ personData.isOrphan ? "نعم" : "لا" }}
                  </span>
                </div>
                <div class="info-item">
                  <strong>جزء من عائلة:</strong>
                  {{ personData.isPartOfFamily ? "نعم" : "لا" }}
                </div>
                <div class="info-item">
                  <strong>يملك منزل:</strong>
                  {{ personData.isHouseOwned ? "نعم" : "لا" }}
                </div>
                <div class="info-item">
                  <strong>عدد أفراد العائلة:</strong>
                  <span class="badge bg-success">{{
                    actualFamilyMemberCount
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- معلومات العائلة - تظهر إذا كان الشخص جزء من عائلة -->
        <div
          class="row g-4 mt-4"
          v-if="
            personData.isPartOfFamily &&
            (personData.familyId || personData.family || familyData)
          "
        >
          <div class="col-12">
            <div class="info-section">
              <h4 class="section-title mb-3">معلومات الأسرة</h4>

              <!-- Loading state -->
              <div v-if="loadingFamilyData" class="text-center py-3">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden"
                    >جاري تحميل بيانات الأسرة...</span
                  >
                </div>
              </div>

              <!-- Family data -->
              <div v-else-if="getFamilyInfo()" class="info-grid">
                <div class="info-item">
                  <strong>رقم الأسرة:</strong>
                  {{ getFamilyInfo().familyId }}
                </div>
                <div class="info-item">
                  <strong>رب الأسرة:</strong>
                  {{ getFamilyInfo().name }}
                </div>
                <div class="info-item">
                  <strong>عدد الأفراد:</strong>
                  <span class="badge bg-success">{{
                    actualFamilyMemberCount
                  }}</span>
                </div>
                <div class="info-item">
                  <strong>يملك منزل:</strong>
                  {{ getFamilyInfo().isHouseOwned ? "نعم" : "لا" }}
                </div>
              </div>

              <!-- عرض قائمة أعضاء العائلة إذا كانت متوفرة -->
              <div
                v-if="memberDetails && memberDetails.length > 0"
                class="mt-4"
              >
                <h5 class="text-success mb-3">أعضاء الأسرة:</h5>
                <div class="row g-2">
                  <div
                    v-for="(member, index) in memberDetails"
                    :key="member.id"
                    class="col-md-6"
                  >
                    <div class="member-card p-2 bg-light rounded border">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <small>
                            <strong>{{ index + 1 }}.</strong>
                            {{ member.firstName }} {{ member.secondName }}
                            {{ member.lastName }}
                            <span
                              v-if="member.id === personData.id"
                              class="badge bg-primary ms-2"
                              >أنت</span
                            >
                          </small>
                          <div class="mt-1">
                            <small class="text-muted">{{
                              member.phoneNumber || "غير متوفر"
                            }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- رسالة في حالة عدم توفر بيانات العائلة -->
              <div
                v-else-if="!loadingFamilyData && personData.isPartOfFamily"
                class="alert alert-info"
              >
                <i class="bi bi-info-circle me-2"></i>
                لا توجد معلومات تفصيلية متاحة للعائلة حالياً.
              </div>
            </div>
          </div>
        </div>

        <!-- معلومات الوصي - تظهر إذا كان الشخص يتيماً -->
        <div class="row g-4 mt-4" v-if="personData.isOrphan">
          <div class="col-12">
            <div class="info-section">
              <h4 class="section-title mb-3">معلومات الوصي</h4>

              <!-- Loading state for guardian -->
              <div v-if="loadingGuardianData" class="text-center py-3">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden"
                    >جاري تحميل بيانات الوصي...</span
                  >
                </div>
              </div>

              <!-- Guardian data -->
              <div v-else-if="guardianData" class="info-grid">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>الرقم الوطني:</strong>
                      {{ guardianData.guardianId }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>الاسم الأول:</strong>
                      {{ guardianData.firstName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>اسم الأب:</strong>
                      {{ guardianData.secondName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>اسم الجد:</strong>
                      {{ guardianData.thirdName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>اسم العائلة:</strong>
                      {{ guardianData.lastName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>صلة القرابة:</strong>
                      {{ guardianData.relationship }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>المهنة:</strong>
                      {{ guardianData.guardianJob }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <strong>رقم الجوال:</strong>
                      {{ guardianData.guardianPhoneNumber }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- رسالة في حالة عدم توفر بيانات الوصي -->
              <div v-else-if="!loadingGuardianData" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                لا توجد معلومات متاحة للوصي حالياً. قد تحتاج إلى إضافة بيانات
                الوصي.
              </div>
            </div>
          </div>
        </div>

        <!-- قسم المساعدات المُحدّث -->
        <div
          class="row g-4 mt-4"
          v-if="assistanceData && assistanceData.length > 0"
        >
          <div class="col-12">
            <div class="info-section">
              <h4 class="section-title mb-3">المساعدات المُستلمة</h4>

              <!-- Loading state for assistances -->
              <div v-if="loadingAssistances" class="text-center py-3">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden"
                    >جاري تحميل بيانات المساعدات...</span
                  >
                </div>
              </div>

              <!-- Assistances table -->
              <div
                v-else
                class="table-responsive rounded-2 shadow-sm border border-light-subtle"
              >
                <table class="table table-striped table-hover">
                  <thead class="table-header text-white">
                    <tr>
                      <th>رقم المساعدة</th>
                      <th>نوع المساعدة</th>
                      <th>تاريخ المساعدة</th>
                      <th>ملاحظات</th>
                      <th class="no-print">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="assistance in assistanceData"
                      :key="assistance.assistanceId"
                    >
                      <td>{{ assistance.assistanceId }}</td>
                      <td>
                        {{ getAssistanceTypeName(assistance.assistanceTypeId) }}
                      </td>
                      <td>{{ formatDate(assistance.date) }}</td>
                      <td>{{ assistance.note || "-" }}</td>
                      <td class="no-print">
                        <button
                          @click="
                            viewAssistanceDetails(assistance.assistanceId)
                          "
                          class="btn btn-outline-primary btn-sm"
                          title="عرض تفاصيل المساعدة"
                        >
                          <i class="bi bi-eye me-1"></i>
                          عرض
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- رسالة في حالة عدم وجود مساعدات -->
        <div
          v-else-if="
            !loadingAssistances &&
            (!personData.assistances || personData.assistances.length === 0)
          "
          class="row g-4 mt-4"
        >
          <div class="col-12">
            <div class="info-section">
              <h4 class="section-title mb-3">المساعدات المُستلمة</h4>
              <div class="alert alert-info text-center">
                <i class="bi bi-info-circle me-2"></i>
                لا توجد مساعدات مُسجلة لهذا الشخص حتى الآن.
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <button class="btn btn-success custom-btn px-5" @click="goBack">
            <i class="bi bi-arrow-right me-1"></i>
            رجوع
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden content for printing -->
    <div id="printableContent" style="display: none">
      <div class="print-header text-center mb-4">
        <h2 class="fw-bold">تفاصيل المستفيد</h2>
        <p class="text-muted">تاريخ الطباعة: {{ getCurrentDate() }}</p>
      </div>

      <div class="print-section mb-3">
        <h4 class="section-title">المعلومات الشخصية</h4>
        <table class="print-info-table">
          <tr>
            <td><strong>الرقم الوطني:</strong></td>
            <td>{{ personData.id }}</td>
            <td><strong>الجنس:</strong></td>
            <td>{{ personData.gender }}</td>
          </tr>
          <tr>
            <td><strong>الاسم الكامل:</strong></td>
            <td colspan="3">
              {{ personData.firstName }} {{ personData.secondName }}
              {{ personData.thirdName }} {{ personData.lastName }}
            </td>
          </tr>
          <tr>
            <td><strong>رقم الجوال:</strong></td>
            <td>{{ personData.phoneNumber }}</td>
            <td><strong>المستوى التعليمي:</strong></td>
            <td>{{ personData.educationalLevel }}</td>
          </tr>
          <tr>
            <td><strong>المهنة:</strong></td>
            <td>{{ personData.job }}</td>
            <td><strong>عدد أفراد العائلة:</strong></td>
            <td>{{ actualFamilyMemberCount }}</td>
          </tr>
        </table>
      </div>

      <div class="print-section mb-3">
        <h4 class="section-title">الحالة</h4>
        <table class="print-info-table">
          <tr>
            <td><strong>أرمل/ة:</strong></td>
            <td>{{ personData.isWidow ? "نعم" : "لا" }}</td>
            <td><strong>يتيم/ة:</strong></td>
            <td>{{ personData.isOrphan ? "نعم" : "لا" }}</td>
          </tr>
          <tr>
            <td><strong>جزء من عائلة:</strong></td>
            <td>{{ personData.isPartOfFamily ? "نعم" : "لا" }}</td>
            <td><strong>يملك منزل:</strong></td>
            <td>{{ personData.isHouseOwned ? "نعم" : "لا" }}</td>
          </tr>
        </table>
      </div>

      <!-- <div
        v-if="personData.isPartOfFamily && getFamilyInfo()"
        class="print-section mb-3"
        display="none"
      >
        <h4 class="section-title">معلومات الأسرة</h4>
        <table class="print-info-table">
          <tr>
            <td><strong>رقم الأسرة:</strong></td>
            <td>{{ getFamilyInfo().familyId }}</td>
            <td><strong>رب الأسرة:</strong></td>
            <td>{{ getFamilyInfo().name }}</td>
          </tr>
        </table>
        <div v-if="memberDetails && memberDetails.length > 0" class="mt-2">
          <strong>أعضاء الأسرة:</strong>
          <ul class="member-list">
            <li v-for="(member, index) in memberDetails" :key="member.id">
              {{ index + 1 }}. {{ member.firstName }} {{ member.secondName }}
              {{ member.lastName }}
              <span v-if="member.id === personData.id">(أنت)</span>
            </li>
          </ul>
        </div>
      </div> -->

      <div
        v-if="personData.isOrphan && guardianData"
        class="print-section mb-3"
      >
        <h4 class="section-title">معلومات الوصي</h4>
        <table class="print-info-table">
          <tr>
            <td><strong>الاسم الكامل:</strong></td>
            <td colspan="3">
              {{ guardianData.firstName }} {{ guardianData.secondName }}
              {{ guardianData.thirdName }} {{ guardianData.lastName }}
            </td>
          </tr>
          <tr>
            <td><strong>صلة القرابة:</strong></td>
            <td>{{ guardianData.relationship }}</td>
            <td><strong>المهنة:</strong></td>
            <td>{{ guardianData.guardianJob }}</td>
          </tr>
          <tr>
            <td><strong>رقم الجوال:</strong></td>
            <td colspan="3">{{ guardianData.guardianPhoneNumber }}</td>
          </tr>
        </table>
      </div>

      <div
        v-if="assistanceData && assistanceData.length > 0"
        class="print-section mb-3"
      >
        <h4 class="section-title">المساعدات المُستلمة</h4>
        <table class="table table-bordered print-table">
          <thead>
            <tr>
              <th>رقم المساعدة</th>
              <th>نوع المساعدة</th>
              <th>تاريخ المساعدة</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assistance in assistanceData"
              :key="assistance.assistanceId"
            >
              <td>{{ assistance.assistanceId }}</td>
              <td>{{ getAssistanceTypeName(assistance.assistanceTypeId) }}</td>
              <td>{{ formatDate(assistance.date) }}</td>
              <td>{{ assistance.note || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import alertify from "alertifyjs";

// Configure alertify for this component
alertify.set("notifier", "position", "bottom-right");
alertify.set("notifier", "delay", 5);

const route = useRoute();
const router = useRouter();
const personData = ref({});
const familyData = ref(null);
const assistanceData = ref([]);
const assistanceTypes = ref([]);
const memberDetails = ref([]);
const guardianData = ref(null);
const loadingFamilyData = ref(false);
const loadingAssistances = ref(false);
const loadingGuardianData = ref(false);
const AUTH_TOKEN = localStorage.getItem("token");
const printArea = ref(null);

// دالة للحصول على معلومات العائلة من أي مصدر متاح
const getFamilyInfo = () => {
  return familyData.value || personData.value.family || null;
};

// حساب عدد أفراد العائلة الحقيقي من قائمة الأعضاء
const actualFamilyMemberCount = computed(() => {
  if (familyData.value && familyData.value.familyMembers) {
    return familyData.value.familyMembers.length;
  } else if (personData.value.family && personData.value.family.familyMembers) {
    return personData.value.family.familyMembers.length;
  } else if (personData.value.isPartOfFamily) {
    return personData.value.numberOfFamilyMembers || 1;
  } else {
    return 1;
  }
});

// دالة للحصول على اسم نوع المساعدة
const getAssistanceTypeName = (typeId) => {
  const assistanceType = assistanceTypes.value.find(
    (type) => type.assistanceTypeId === typeId,
  );
  return assistanceType ? assistanceType.assistanceTypeName : "غير معروف";
};

// دالة لعرض تفاصيل المساعدة
const viewAssistanceDetails = (assistanceId) => {
  router.push(`/view-assistance/${assistanceId}`);
};

// دالة لجلب أنواع المساعدات
const fetchAssistanceTypes = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/AssistanceType`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    assistanceTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching assistance types:", error);
  }
};

// دالة لجلب بيانات الوصي
const fetchGuardianData = async (guardianId) => {
  if (!guardianId) return;

  loadingGuardianData.value = true;
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Guardian/${guardianId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    guardianData.value = response.data;
    console.log("Guardian data:", guardianData.value);
  } catch (error) {
    console.error("Error fetching guardian data:", error);
    guardianData.value = null;
  } finally {
    loadingGuardianData.value = false;
  }
};

// دالة لجلب تفاصيل شخص واحد
const fetchPersonDetails = async (personId) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person/${personId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching person ${personId}:`, error);
    return null;
  }
};

// دالة لتنسيق التاريخ
const formatDate = (date) => {
  if (!date) return "غير محدد";
  const d = new Date(date);
  return d.toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// دالة لجلب تفاصيل جميع أعضاء العائلة
const fetchAllMemberDetails = async () => {
  const familyInfo = getFamilyInfo();
  if (
    !familyInfo ||
    !familyInfo.familyMembers ||
    familyInfo.familyMembers.length === 0
  ) {
    memberDetails.value = [];
    return;
  }

  try {
    const memberPromises = familyInfo.familyMembers.map((member) => {
      const memberId = member.id || member;
      return fetchPersonDetails(memberId);
    });

    const results = await Promise.allSettled(memberPromises);

    memberDetails.value = results
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);
  } catch (error) {
    console.error("Error fetching member details:", error);
    memberDetails.value = [];
  }
};

// دالة لجلب بيانات المساعدة الواحدة
const fetchAssistanceData = async (assistanceId) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Assistance/${assistanceId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching assistance data for ${assistanceId}:`, error);
    return null;
  }
};

// دالة لجلب جميع المساعدات
const fetchAllAssistances = async () => {
  if (
    !personData.value.assistances ||
    personData.value.assistances.length === 0
  ) {
    assistanceData.value = [];
    return;
  }

  loadingAssistances.value = true;
  try {
    const assistancePromises = personData.value.assistances.map(
      (assistanceId) => fetchAssistanceData(assistanceId),
    );

    const results = await Promise.allSettled(assistancePromises);

    assistanceData.value = results
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);

    console.log("Loaded assistances:", assistanceData.value);
  } catch (error) {
    console.error("Error fetching assistances:", error);
    assistanceData.value = [];
  } finally {
    loadingAssistances.value = false;
  }
};

onMounted(async () => {
  try {
    // جلب أنواع المساعدات أولاً
    await fetchAssistanceTypes();

    // جلب بيانات الشخص
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Person/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    personData.value = response.data;
    console.log("Person data:", personData.value);

    // جلب بيانات الوصي إذا كان الشخص يتيماً
    if (personData.value.isOrphan && personData.value.guardianId) {
      await fetchGuardianData(personData.value.guardianId);
    }

    // جلب بيانات المساعدات إذا كانت موجودة
    if (
      personData.value.assistances &&
      personData.value.assistances.length > 0
    ) {
      await fetchAllAssistances();
    }

    // جلب بيانات العائلة إذا كان الشخص جزءاً من عائلة
    if (personData.value.isPartOfFamily) {
      if (personData.value.familyId) {
        await fetchFamilyData(personData.value.familyId);
      } else {
        console.log(
          "Person is part of family but no familyId found, using embedded family data",
        );
        if (personData.value.family) {
          await fetchAllMemberDetails();
        }
      }
    }
  } catch (error) {
    console.error("Error fetching person details:", error);
    alertify.error("حدث خطأ أثناء جلب بيانات الشخص");
  }
});

const fetchFamilyData = async (familyId) => {
  if (!familyId) return;

  loadingFamilyData.value = true;
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/Family/${familyId}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );
    familyData.value = response.data;
    personData.value.family = response.data;
    personData.value.isHouseOwned = response.data.isHouseOwned;
    await fetchAllMemberDetails();
    console.log("Family Data:", familyData.value);
    console.log("Actual Member Count:", actualFamilyMemberCount.value);
  } catch (error) {
    console.error("Error fetching family data:", error);
    console.warn(
      "Could not fetch family data, using person's embedded family data",
    );
    if (personData.value.family) {
      await fetchAllMemberDetails();
    }
  } finally {
    loadingFamilyData.value = false;
  }
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const printContent = () => {

  const printContent = document.getElementById("printableContent").innerHTML;
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>طباعة تفاصيل الشخص</title>
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
        .print-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          color: #42b983;
          font-size: 1.1rem;
          border-bottom: 1px solid #42b983;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .print-info-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 11px; 
        }
        .print-info-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: right;
        }
        .print-info-table strong { 
          color: #42b983;
        }
        .print-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0; 
          font-size: 10px; 
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: center; 
        }
        .print-table th { 
          background-color: #42b983; 
          color: white; 
          font-weight: bold; 
        }
        .member-list {
          list-style-position: inside;
          margin: 5px 0;
          padding-right: 10px;
          font-size: 11px;
        }
        .member-list li {
          padding: 3px 0;
        }
        @media print { 
          body { margin: 0; } 
          .print-info-table { font-size: 10px; }
          .print-table { font-size: 9px; }
          .member-list { font-size: 10px; }
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

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.info-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  color: #2c3e50;
  font-size: 1.25rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.info-item strong {
  color: #42b983;
  margin-left: 0.5rem;
}

.member-card {
  transition: all 0.2s ease;
}

.member-card:hover {
  background-color: #e9ecef !important;
  transform: translateY(-1px);
}

.badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

.custom-btn {
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  transition: all 0.3s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* تنسيق جدول المساعدات */
.table-header {
  background-color: #42b983 !important;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-responsive {
  border-radius: 8px;
}

/* Font family consistent with IndividualView */
.container {
  font-family: "Tajawal", sans-serif;
}

/* Print-specific styles */
@media print {
  .no-print {
    display: none !important;
  }

  .container {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .card {
    border: none !important;
    box-shadow: none !important;
  }

  .card-header {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    padding: 1rem !important;
  }

  .card-body {
    padding: 1rem !important;
  }

  .info-section {
    page-break-inside: avoid;
    margin-bottom: 1rem;
    box-shadow: none !important;
    border: 1px solid #e0e0e0;
  }

  .section-title {
    font-size: 1.1rem;
    color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-grid {
    gap: 0.5rem;
  }

  .info-item {
    padding: 0.5rem;
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .info-item strong {
    color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .member-card {
    page-break-inside: avoid;
    border: 1px solid #dee2e6 !important;
    margin-bottom: 0.5rem;
  }

  .badge {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .table {
    font-size: 11px;
    page-break-inside: avoid;
  }

  .table-header {
    background-color: #42b983 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .table th,
  .table td {
    padding: 0.4rem !important;
    border: 1px solid #dee2e6 !important;
  }

  .alert {
    page-break-inside: avoid;
    border: 1px solid #dee2e6;
  }

  /* Ensure proper spacing between sections */
  .row {
    margin-bottom: 0.5rem;
  }

  /* Avoid breaking family and guardian sections */
  .row.g-4 {
    page-break-inside: avoid;
  }
}
</style>
