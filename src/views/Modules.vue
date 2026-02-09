<!-- src/views/dashboard/Modules.vue -->
<template>
    <div class="modules-page">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Modules</h1>
            <p class="text-gray-600 dark:text-gray-400">
                Explore our comprehensive collection of educational modules
            </p>
        </div>

        <!-- Featured modules -->
        <section v-if="featuredModules.length > 0" class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Featured Modules</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    ⭐ Top picks for you
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModuleCard v-for="module in featuredModules" :key="module.id" :module="module" @view="viewModule" />
            </div>
        </section>

        <!-- Stats overview (for educators/admins) -->
        <section v-if="canManageModules && stats" class="mb-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Total Modules</p>
                            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.total_modules }}</p>
                        </div>
                        <svg class="w-10 h-10 text-blue-400 opacity-50" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>

                <div
                    class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.total_views }}</p>
                        </div>
                        <svg class="w-10 h-10 text-green-400 opacity-50" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                </div>
                <!-- 
                <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Completions</p>
                            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.total_completions }}</p>
                        </div>
                        <svg class="w-10 h-10 text-purple-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>

                <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Avg. Completion</p>
                            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ avgCompletion }}%</p>
                        </div>
                        <svg class="w-10 h-10 text-yellow-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    </div>
                </div> -->
            </div>
        </section>

        <!-- All modules with filters -->
        <section>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">All Modules</h2>
                <button v-if="canManageModules" @click="showCreateModal = true"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Module</span>
                </button>
            </div>

            <ModuleList @view="viewModule" />
        </section>

        <!-- Create module modal -->
        <CreateModuleModal v-if="showCreateModal" @saved="handleModuleCreated" @cancel="showCreateModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import ModuleCard from '@/components/modules/ModuleCard.vue';
import ModuleList from '@/components/modules/ModuleList.vue';
import CreateModuleModal from '@/components/modules/CreateModuleModal.vue';

const router = useRouter();
const moduleStore = useModuleStore();
const authStore = useAuthStore();
const toast = useToast();

const showCreateModal = ref(false);

const featuredModules = computed(() => moduleStore.featuredModules);
const stats = computed(() => moduleStore.stats);

const canManageModules = computed(() => {
    const user = authStore.user;
    return user && (user.role === 'admin' || user.role === 'educator');
});

// const avgCompletion = computed(() => {
//     if (!stats.value || !stats.value.total_views || stats.value.total_views === 0) return 0;
//     return Math.round((stats.value.total_completions / stats.value.total_views) * 100);
// });

const viewModule = (id) => {
    const userRole = authStore.user?.role;
    
    if (['admin', 'educator', 'moderator'].includes(userRole)) {
        router.push({ name: 'facilitator.module', params: { id } });
    } else if (userRole === 'player') {
        router.push({ name: 'user.module', params: { id } });
    } else {
        toast.error('Unauthorized: Role not recognized.');
    }
};

const handleModuleCreated = () => {
    showCreateModal.value = false;
    toast.success('Module created successfully! 🎉');
    // Refresh the module list
    moduleStore.fetchModules();
    moduleStore.fetchFeaturedModules();
    if (canManageModules.value) {
        moduleStore.fetchStats();
    }
};

onMounted(async () => {
    await moduleStore.fetchFeaturedModules();
    if (canManageModules.value) {
        await moduleStore.fetchStats();
    }
});
</script>
