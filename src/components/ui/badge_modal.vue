<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">
                    {{ isEdit ? 'Edit Badge' : 'Create Badge' }}
                </h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <X class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6">
                <!-- Icon Upload -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Badge Icon *
                    </label>
                    <div class="flex items-start gap-4">
                        <div
                            class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                            <img v-if="previewUrl" :src="previewUrl" alt="Preview"
                                class="w-full h-full object-contain" />
                            <ImagePlus v-else class="w-12 h-12 text-gray-400" />
                        </div>
                        <div class="flex-1">
                            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange"
                                class="hidden" />
                            <button type="button" @click="$refs.fileInput.click()"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition mb-2">
                                Choose Image
                            </button>
                            <p class="text-xs text-gray-500">
                                PNG recommended for transparency. Max 5MB.
                            </p>
                            <p v-if="form.iconFile" class="text-xs text-green-600 mt-1">
                                ✓ {{ form.iconFile.name }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Name -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Badge Name *
                    </label>
                    <input v-model="form.name" type="text" required maxlength="100"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Quiz Master" />
                </div>

                <!-- Description -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea v-model="form.description" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe what this badge represents..."></textarea>
                </div>

                <!-- Category and Rarity -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select v-model="form.category" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option v-for="cat in categories" :key="cat" :value="cat">
                                {{ formatText(cat) }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Rarity *
                        </label>
                        <select v-model="form.rarity" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option v-for="rar in rarities" :key="rar" :value="rar">
                                {{ formatText(rar) }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Sort Order and Active Status -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Sort Order
                        </label>
                        <input v-model.number="form.sortOrder" type="number" min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="flex items-center">
                        <label class="flex items-center cursor-pointer">
                            <input v-model="form.isActive" type="checkbox"
                                class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span class="ml-2 text-sm font-medium text-gray-700">
                                Active Badge
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button type="button" @click="$emit('close')"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="loading || (!isEdit && !form.iconFile)"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        <span v-if="loading">Saving...</span>
                        <span v-else>{{ isEdit ? 'Update' : 'Create' }} Badge</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { X, ImagePlus } from 'lucide-vue-next';
import axios from 'axios';
import { getBadgeUrl } from '@/utils/cloudflare';

const props = defineProps({
    badge: Object,
    categories: Array,
    rarities: Array
});

const emit = defineEmits(['close', 'save']);

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const isEdit = computed(() => !!props.badge);
const loading = ref(false);
const previewUrl = ref(null);
const fileInput = ref(null);

const form = reactive({
    name: '',
    description: '',
    category: 'achievement',
    rarity: 'common',
    sortOrder: 0,
    isActive: true,
    iconFile: null
});

// Initialize form with badge data if editing
watch(() => props.badge, (badge) => {
    if (badge) {
        form.name = badge.name;
        form.description = badge.description || '';
        form.category = badge.category;
        form.rarity = badge.rarity;
        form.sortOrder = badge.sortOrder;
        form.isActive = badge.isActive;

        // Construct preview URL from iconKey using Cloudflare Worker
        if (badge.iconKey) {
            previewUrl.value = getBadgeUrl(badge.iconKey);
        }
    }
}, { immediate: true });

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    form.iconFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function handleSubmit() {
    loading.value = true;

    try {
        const formData = new FormData();

        // Add file if present
        if (form.iconFile) {
            formData.append('icon', form.iconFile);
        }

        // Add form fields
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('rarity', form.rarity);
        formData.append('sortOrder', form.sortOrder);
        formData.append('isActive', form.isActive);

        if (isEdit.value) {
            // Update badge
            await axios.put(`${API_URL}/api/v1/badges/${props.badge.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            // Create badge
            await axios.post(`${API_URL}/api/v1/badges`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        emit('save');
    } catch (error) {
        console.error('Failed to save badge:', error);
        alert(error.response?.data?.error || 'Failed to save badge');
    } finally {
        loading.value = false;
    }
}

function formatText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
</script>