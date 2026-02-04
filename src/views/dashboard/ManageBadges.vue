<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Badge Management</h1>

    <div class="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <input type="file" @change="onFileSelect" ref="fileInput" class="hidden" accept="image/*" />
      <button @click="$refs.fileInput.click()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upload New Badge Icon
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      <div v-for="badge in badges" :key="badge.id" class="relative group bg-gray-100 p-2 rounded-lg aspect-square flex items-center justify-center">
        <img :src="`http://localhost:3000${badge.iconPath}`" class="max-h-full max-w-full object-contain" />
        
        <button @click="deleteBadge(badge.id)" class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const badges = ref([]);
const fetchBadges = async () => {
  const { data } = await axios.get('http://localhost:3000/api/badges');
  badges.value = data;
};

const onFileSelect = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('badge', file); // Must match upload.single('badge')

  try {
    // Note the added /v1/
    await axios.post('http://localhost:3000/api/v1/badges', formData);
    fetchBadges();
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
  }
};

const deleteBadge = async (id) => {
  if (!confirm('Remove this badge?')) return;
  await axios.delete(`http://localhost:3000/api/badges/${id}`);
  fetchBadges();
};

onMounted(fetchBadges);
</script>