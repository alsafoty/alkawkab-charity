<template>
  <div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg text-center" style="max-width: 500px;" v-if="!selected">
      <h2 class="fs-1 fw-bold mb-4">الدخول لقاعدة البيانات</h2>
      <div class="d-flex flex-column justify-content-around mb-3 gap-3">
        <button @click="selected = 'individual'" class="btn btn-success donate-button  fs-3 px-5 py-2">
          أفراد
        </button>
        <button @click="selected = 'family'" class=" btn btn-success donate-button fs-3 px-5 py-2">
          عائلات
        </button>
      </div>
    </div>

    <div class="w-100 mt-3">
      <IndividualView v-if="selected === 'individual'" />
      <FamilyView v-else-if="selected === 'family'" />
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import IndividualView from '@/views/IndividualView.vue'
import FamilyView from '@/views/FamilyView.vue'

const selected = ref(null)
</script>

<style scoped>
.donate-button {

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
