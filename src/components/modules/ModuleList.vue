<!-- src/components/modules/ModuleList.vue -->
<template>
    <div class="module-list">
        <!-- Filters -->
        <div class="filters bg-white dark:bg-abyss-800 p-4 rounded-lg shadow-md mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Search -->
                <div class="relative">
                    <input
                        v-model="localFilters.search"
                        type="text"
                        placeholder="Search modules..."
                        class="w-full border dark:border-abyss-600 rounded-lg px-4 py-2 pl-10 bg-white dark:bg-abyss-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        @input="debouncedSearch"
                    />
                    <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>

                <!-- Category filter -->
                <select 
                    v-model="localFilters.category"
                    class="border dark:border-abyss-600 rounded-lg px-4 py-2 bg-white dark:bg-abyss-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="applyFilters"
                >
                    <option :value="null">All Categories</option>
                    <option value="gad">GAD</option>
                    <option value="sexual_health">Sexual Health</option>
                    <option value="vawc">VAWC</option>
                    <option value="general">General</option>
                </select>

                <!-- Type filter -->
                <!-- <select 
                    v-model="localFilters.type"
                    class="border dark:border-abyss-600 rounded-lg px-4 py-2 bg-white dark:bg-abyss-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="applyFilters"
                >
                    <option :value="null">All Types</option>
                    <option value="lesson">Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="activity">Activity</option>
                    <option value="resource">Resource</option>
                    <option value="assessment">Assessment</option>
                </select> -->

                <!-- Difficulty filter -->
                <select 
                    v-model="localFilters.difficulty_level"
                    class="border dark:border-abyss-600 rounded-lg px-4 py-2 bg-white dark:bg-abyss-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="applyFilters"
                >
                    <option :value="null">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <!-- Active filters & Reset -->
            <div v-if="hasActiveFilters" class="mt-4 flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                    <span 
                        v-for="(value, key) in activeFiltersDisplay" 
                        :key="key"
                        class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                        <span>{{ value }}</span>
                        <button 
                            @click="removeFilter(key)"
                            class="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </span>
                </div>
                <button 
                    @click="resetFilters"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Reset all
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="moduleStore.loading && modules.length === 0" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Loading modules...</p>
        </div>

        <!-- Module grid -->
        <div 
            v-else-if="modules.length > 0" 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <ModuleCard 
                v-for="module in modules" 
                :key="module.id"
                :module="module"
                @view="viewModule"
            />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12 bg-gray-50 dark:bg-abyss-800 rounded-lg">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400 text-lg mb-4">No modules found</p>
            <button 
                @click="resetFilters"
                class="text-blue-600 dark:text-blue-400 hover:underline"
            >
                Clear filters
            </button>
        </div>

        <!-- Load more button -->
        <div v-if="moduleStore.hasMorePages && !moduleStore.loading" class="text-center mt-8">
            <button 
                @click="loadMore"
                class="bg-gray-200 dark:bg-abyss-700 hover:bg-gray-300 dark:hover:bg-abyss-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition-colors"
            >
                Load More
            </button>
        </div>

        <!-- Loading more indicator -->
        <div v-if="moduleStore.loading && modules.length > 0" class="text-center mt-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import ModuleCard from './ModuleCard.vue';

const router = useRouter();
const moduleStore = useModuleStore();

const localFilters = ref({
    search: '',
    category: null,
    // type: null,
    difficulty_level: null
});

const modules = computed(() => moduleStore.modules);

const hasActiveFilters = computed(() => {
    return Object.values(localFilters.value).some(v => v !== null && v !== '');
});

const activeFiltersDisplay = computed(() => {
    const display = {};
    if (localFilters.value.search) display.search = `Search: "${localFilters.value.search}"`;
    if (localFilters.value.category) display.category = `Category: ${formatLabel(localFilters.value.category)}`;
    // if (localFilters.value.type) display.type = `Type: ${formatLabel(localFilters.value.type)}`;
    if (localFilters.value.difficulty_level) display.difficulty_level = `Level: ${formatLabel(localFilters.value.difficulty_level)}`;
    return display;
});

let searchTimeout;

const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters();
    }, 500);
};

const applyFilters = async () => {
    await moduleStore.setFilters(localFilters.value);
};

const removeFilter = async (key) => {
    localFilters.value[key] = key === 'search' ? '' : null;
    await applyFilters();
};

const resetFilters = async () => {
    localFilters.value = {
        search: '',
        category: null,
        // type: null,
        difficulty_level: null
    };
    moduleStore.resetFilters();
    await moduleStore.fetchModules();
};

const loadMore = async () => {
    await moduleStore.loadNextPage();
};

const emit = defineEmits(['view']);

const viewModule = (id) => {
    emit('view', id);
};

const formatLabel = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

onMounted(async () => {
    await moduleStore.fetchModules();
});
</script>
