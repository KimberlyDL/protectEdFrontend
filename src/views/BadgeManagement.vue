<template>
    <div class="badge-management p-6">
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-800">Badge Management</h1>
            <button @click="openCreateModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Plus class="w-5 h-5 inline mr-2" />
                Create Badge
            </button>
        </div>

        <!-- Filters -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="filters.search" @input="debouncedSearch" type="text" placeholder="Search badges..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select v-model="filters.category" @change="fetchBadges"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ formatCategory(cat) }}
                </option>
            </select>
            <select v-model="filters.rarity" @change="fetchBadges"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Rarities</option>
                <option v-for="rar in rarities" :key="rar" :value="rar">
                    {{ formatRarity(rar) }}
                </option>
            </select>
            <select v-model="filters.isActive" @change="fetchBadges"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Badge Grid -->
        <div v-else-if="badges.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="badge in badges" :key="badge.id"
                class="badge-card bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition"
                :class="getRarityClass(badge.rarity)">
                <div class="relative">
                    <img :src="getBadgeUrl(badge.iconKey)" :alt="badge.name"
                        class="w-full h-48 object-contain rounded-lg mb-4" @error="handleImageError" />
                    <span :class="getRarityBadgeClass(badge.rarity)"
                        class="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full">
                        {{ formatRarity(badge.rarity) }}
                    </span>
                    <span v-if="!badge.isActive"
                        class="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-gray-500 text-white rounded-full">
                        Inactive
                    </span>
                </div>

                <h3 class="text-lg font-bold text-gray-800 mb-2">{{ badge.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                    {{ badge.description || 'No description' }}
                </p>

                <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span class="bg-gray-100 px-2 py-1 rounded">
                        {{ formatCategory(badge.category) }}
                    </span>
                    <span>Order: {{ badge.sortOrder }}</span>
                </div>

                <div class="flex gap-2">
                    <button @click="openEditModal(badge)"
                        class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                        <Edit class="w-4 h-4 inline mr-1" />
                        Edit
                    </button>
                    <button @click="confirmDelete(badge)"
                        class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                        <Trash2 class="w-4 h-4 inline" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <Award class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">No badges found</p>
            <button @click="openCreateModal"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Your First Badge
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
        <BadgeModal v-if="showModal" :badge="selectedBadge" :categories="categories" :rarities="rarities"
            @close="closeModal" @save="handleSave" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Plus, Edit, Trash2, Award } from 'lucide-vue-next';
import axios from 'axios';
import BadgeModal from '@components/ui/badge_modal.vue';
import { getBadgeUrl } from '@/utils/cloudflare';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const badges = ref([]);
const categories = ref(['General', 'VAWC', 'GAD']);
const rarities = ref(['Common', 'Rare']);
const loading = ref(false);
const showModal = ref(false);
const selectedBadge = ref(null);

const filters = reactive({
    search: '',
    category: '',
    rarity: '',
    isActive: ''
});

const pagination = reactive({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
});

let debounceTimeout = null;

onMounted(async () => {
    await Promise.all([
        fetchBadges(),
        fetchCategories(),
        fetchRarities()
    ]);
});

async function fetchBadges() {
    loading.value = true;
    try {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters
        };

        const response = await axios.get(`${API_URL}/api/v1/badges`, { params });

        badges.value = response.data.data;
        Object.assign(pagination, response.data.pagination);
    } catch (error) {
        console.error('Failed to fetch badges:', error);
        alert('Failed to load badges');
    } finally {
        loading.value = false;
    }
}

async function fetchCategories() {
    try {
        const response = await axios.get(`${API_URL}/api/v1/badges/categories`);
        categories.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
}

async function fetchRarities() {
    try {
        const response = await axios.get(`${API_URL}/api/v1/badges/rarities`);
        rarities.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch rarities:', error);
    }
}

function debouncedSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        pagination.page = 1;
        fetchBadges();
    }, 500);
}

function changePage(newPage) {
    pagination.page = newPage;
    fetchBadges();
}

function openCreateModal() {
    selectedBadge.value = null;
    showModal.value = true;
}

function openEditModal(badge) {
    selectedBadge.value = { ...badge };
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    selectedBadge.value = null;
}

async function handleSave() {
    closeModal();
    await fetchBadges();
}

async function confirmDelete(badge) {
    if (!confirm(`Are you sure you want to delete "${badge.name}"?`)) {
        return;
    }

    try {
        await axios.delete(`${API_URL}/api/v1/badges/${badge.id}`);
        await fetchBadges();
    } catch (error) {
        console.error('Failed to delete badge:', error);
        alert('Failed to delete badge');
    }
}

function formatCategory(cat) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function formatRarity(rar) {
    return rar.charAt(0).toUpperCase() + rar.slice(1);
}

function getRarityClass(rarity) {
    const classes = {
        common: 'border-l-4 border-gray-400',
        uncommon: 'border-l-4 border-green-500',
        rare: 'border-l-4 border-blue-500',
        epic: 'border-l-4 border-purple-500',
        legendary: 'border-l-4 border-yellow-500'
    };
    return classes[rarity] || classes.common;
}

function getRarityBadgeClass(rarity) {
    const classes = {
        common: 'bg-gray-500 text-white',
        uncommon: 'bg-green-500 text-white',
        rare: 'bg-blue-500 text-white',
        epic: 'bg-purple-500 text-white',
        legendary: 'bg-yellow-500 text-black'
    };
    return classes[rarity] || classes.common;
}

function handleImageError(event) {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.badge-card {
    transition: all 0.3s ease;
}

.badge-card:hover {
    transform: translateY(-5px);
}
</style>