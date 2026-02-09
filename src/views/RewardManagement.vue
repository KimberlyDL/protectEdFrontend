<template>
    <div class="reward-management p-6">
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-800">Reward Management</h1>
            <button @click="openCreateModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Plus class="w-5 h-5 inline mr-2" />
                Create Reward
            </button>
        </div>

        <!-- Filters -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="filters.search" @input="debouncedSearch" type="text" placeholder="Search rewards..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select v-model="filters.rewardType" @change="fetchRewards"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="badge">Badge</option>
                <option value="points">Points</option>
                <option value="unlock">Unlock</option>
                <option value="title">Title</option>
                <option value="combo">Combo</option>
            </select>
            <select v-model="filters.isActive" @change="fetchRewards"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
            <select v-model="filters.isRepeatable" @change="fetchRewards"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All</option>
                <option value="true">Repeatable</option>
                <option value="false">One-time</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Rewards List -->
        <div v-else-if="rewards.length > 0" class="space-y-4">
            <div v-for="reward in rewards" :key="reward.id"
                class="reward-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div class="flex items-start gap-4">
                    <!-- Badge Icon -->
                    <div v-if="reward.badge" class="flex-shrink-0">
                        <img :src="reward.badge.iconUrl" :alt="reward.badge.name"
                            class="w-20 h-20 object-contain rounded-lg" @error="handleImageError" />
                    </div>
                    <div v-else class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Trophy class="w-10 h-10 text-gray-400" />
                    </div>

                    <!-- Reward Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">{{ reward.name }}</h3>
                                <p class="text-sm text-gray-600 mt-1">{{ reward.description }}</p>
                            </div>
                            <div class="flex gap-2">
                                <button @click="openEditModal(reward)"
                                    class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                                    <Edit class="w-4 h-4 inline mr-1" />
                                    Edit
                                </button>
                                <button @click="confirmDelete(reward)"
                                    class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                                    <Trash2 class="w-4 h-4 inline" />
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mt-3">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {{ formatRewardType(reward.rewardType) }}
                            </span>
                            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                {{ reward.requiredScore }} points required
                            </span>
                            <span v-if="reward.requiredLevel"
                                class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                Level {{ reward.requiredLevel }}+
                            </span>
                            <span v-if="reward.isRepeatable"
                                class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Repeatable
                                <span v-if="reward.cooldownDays">({{ reward.cooldownDays }}d cooldown)</span>
                            </span>
                            <span v-if="!reward.isActive"
                                class="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                Inactive
                            </span>
                        </div>

                        <!-- Additional Info -->
                        <div v-if="reward.pointsValue || reward.titleText" class="mt-3 text-sm text-gray-600">
                            <span v-if="reward.pointsValue" class="mr-4">
                                <strong>Points Value:</strong> {{ reward.pointsValue }}
                            </span>
                            <span v-if="reward.titleText">
                                <strong>Title:</strong> {{ reward.titleText }}
                            </span>
                        </div>

                        <!-- Date Range -->
                        <div v-if="reward.validFrom || reward.validUntil" class="mt-2 text-xs text-gray-500">
                            <Calendar class="w-3 h-3 inline mr-1" />
                            <span v-if="reward.validFrom">From {{ formatDate(reward.validFrom) }}</span>
                            <span v-if="reward.validUntil"> to {{ formatDate(reward.validUntil) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <Trophy class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">No rewards found</p>
            <button @click="openCreateModal"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Your First Reward
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center gap-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">
                Previous
            </button>
            <span class="px-4 py-2">
                Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages"
                class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">
                Next
            </button>
        </div>

        <!-- Create/Edit Modal -->
        <RewardModal v-if="showModal" :reward="selectedReward" @close="closeModal" @save="handleSave" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Plus, Edit, Trash2, Trophy, Calendar } from 'lucide-vue-next';
import axios from 'axios';
import RewardModal from '@components/ui/reward_modal.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const rewards = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedReward = ref(null);

const filters = reactive({
    search: '',
    rewardType: '',
    isActive: '',
    isRepeatable: ''
});

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
});

let debounceTimeout = null;

onMounted(() => {
    fetchRewards();
});

async function fetchRewards() {
    loading.value = true;
    try {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters
        };

        const response = await axios.get(`${API_URL}/api/rewards`, { params });

        rewards.value = response.data.data;
        Object.assign(pagination, response.data.pagination);
    } catch (error) {
        console.error('Failed to fetch rewards:', error);
        alert('Failed to load rewards');
    } finally {
        loading.value = false;
    }
}

function debouncedSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        pagination.page = 1;
        fetchRewards();
    }, 500);
}

function changePage(newPage) {
    pagination.page = newPage;
    fetchRewards();
}

function openCreateModal() {
    selectedReward.value = null;
    showModal.value = true;
}

function openEditModal(reward) {
    selectedReward.value = { ...reward };
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    selectedReward.value = null;
}

async function handleSave() {
    closeModal();
    await fetchRewards();
}

async function confirmDelete(reward) {
    if (!confirm(`Are you sure you want to delete "${reward.name}"?`)) {
        return;
    }

    try {
        await axios.delete(`${API_URL}/api/rewards/${reward.id}`);
        await fetchRewards();
    } catch (error) {
        console.error('Failed to delete reward:', error);
        alert('Failed to delete reward');
    }
}

function formatRewardType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function handleImageError(event) {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23ddd"/%3E%3C/svg%3E';
}
</script>

<style scoped>
.reward-card {
    transition: all 0.3s ease;
}

.reward-card:hover {
    transform: translateY(-2px);
}
</style>