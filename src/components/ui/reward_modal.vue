<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">
                    {{ isEdit ? 'Edit Reward' : 'Create Reward' }}
                </h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <X class="w-6 h-6" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6">
                <!-- Basic Info -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Reward Name *
                            </label>
                            <input v-model="form.name" type="text" required maxlength="100"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., First Steps Champion" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea v-model="form.description" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="What does this reward unlock or provide?"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Reward Configuration -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Reward Configuration</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Reward Type *
                            </label>
                            <select v-model="form.rewardType" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="badge">Badge</option>
                                <option value="points">Points</option>
                                <option value="unlock">Unlock Content</option>
                                <option value="title">Title/Achievement</option>
                                <option value="combo">Combo (Multiple)</option>
                            </select>
                        </div>

                        <div v-if="form.rewardType === 'badge' || form.rewardType === 'combo'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Badge
                            </label>
                            <select v-model="form.badgeId"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option :value="null">None</option>
                                <option v-for="badge in badges" :key="badge.id" :value="badge.id">
                                    {{ badge.name }}
                                </option>
                            </select>
                        </div>

                        <div v-if="form.rewardType === 'points' || form.rewardType === 'combo'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Points Value
                            </label>
                            <input v-model.number="form.pointsValue" type="number" min="0"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 100" />
                        </div>

                        <div v-if="form.rewardType === 'title' || form.rewardType === 'combo'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Title Text
                            </label>
                            <input v-model="form.titleText" type="text" maxlength="100"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Master Learner" />
                        </div>
                    </div>
                </div>

                <!-- Requirements -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Requirements</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Required Score *
                            </label>
                            <input v-model.number="form.requiredScore" type="number" required min="0"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Required Level (Optional)
                            </label>
                            <input v-model.number="form.requiredLevel" type="number" min="1"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 5" />
                        </div>
                    </div>
                </div>

                <!-- Repeatability -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Repeatability</h3>

                    <div class="space-y-4">
                        <label class="flex items-center cursor-pointer">
                            <input v-model="form.isRepeatable" type="checkbox"
                                class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                            <span class="ml-2 text-sm font-medium text-gray-700">
                                This reward can be earned multiple times
                            </span>
                        </label>

                        <div v-if="form.isRepeatable">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Cooldown (Days)
                            </label>
                            <input v-model.number="form.cooldownDays" type="number" min="1"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 7" />
                            <p class="text-xs text-gray-500 mt-1">
                                Number of days before user can earn this reward again
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Time Limits -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Time Limits (Optional)</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Valid From
                            </label>
                            <input v-model="form.validFrom" type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Valid Until
                            </label>
                            <input v-model="form.validUntil" type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <!-- Settings -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Settings</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    Active Reward
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button type="button" @click="$emit('close')"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="loading"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        <span v-if="loading">Saving...</span>
                        <span v-else>{{ isEdit ? 'Update' : 'Create' }} Reward</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import axios from 'axios';

const props = defineProps({
    reward: Object
});

const emit = defineEmits(['close', 'save']);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const isEdit = computed(() => !!props.reward);
const loading = ref(false);
const badges = ref([]);

const form = reactive({
    name: '',
    description: '',
    badgeId: null,
    rewardType: 'badge',
    pointsValue: null,
    unlockContent: null,
    titleText: null,
    requiredScore: 0,
    requiredLevel: null,
    isRepeatable: false,
    cooldownDays: null,
    isActive: true,
    validFrom: null,
    validUntil: null,
    sortOrder: 0
});

onMounted(() => {
    fetchBadges();
});

// Initialize form with reward data if editing
watch(() => props.reward, (reward) => {
    if (reward) {
        Object.keys(form).forEach(key => {
            if (reward[key] !== undefined) {
                form[key] = reward[key];
            }
        });
        // Format dates
        if (reward.validFrom) {
            form.validFrom = new Date(reward.validFrom).toISOString().split('T')[0];
        }
        if (reward.validUntil) {
            form.validUntil = new Date(reward.validUntil).toISOString().split('T')[0];
        }
    }
}, { immediate: true });

async function fetchBadges() {
    try {
        const response = await axios.get(`${API_URL}/api/badges`, {
            params: { isActive: true, limit: 100 }
        });
        badges.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch badges:', error);
    }
}

async function handleSubmit() {
    loading.value = true;

    try {
        const payload = { ...form };

        // Clean up null values
        Object.keys(payload).forEach(key => {
            if (payload[key] === '' || payload[key] === null) {
                delete payload[key];
            }
        });

        if (isEdit.value) {
            await axios.put(`${API_URL}/api/rewards/${props.reward.id}`, payload);
        } else {
            await axios.post(`${API_URL}/api/rewards`, payload);
        }

        emit('save');
    } catch (error) {
        console.error('Failed to save reward:', error);
        alert(error.response?.data?.error || 'Failed to save reward');
    } finally {
        loading.value = false;
    }
}
</script>