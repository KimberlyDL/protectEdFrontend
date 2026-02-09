<!-- src/views/dashboard/ModuleDetail.vue -->
<template>
    <div class="module-detail-page">
        <!-- Header with back button -->
        <div class="mb-6 flex items-center justify-between">
            <button 
                @click="router.back()"
                class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span>Back to Modules</span>
            </button>

            <!-- Desktop: Info toggle -->
            <button 
                @click="toggleSidebar"
                class="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ sidebarOpen ? 'Hide' : 'Show' }} Info</span>
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="moduleStore.loading" class="flex items-center justify-center py-20">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400">Loading module...</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-800 dark:text-red-200">{{ error }}</p>
            <button 
                @click="router.back()"
                class="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
                Go back
            </button>
        </div>

        <!-- Main content -->
        <div v-else-if="module" class="flex flex-col lg:flex-row gap-6">
            <!-- Main content area -->
            <div 
                class="flex-1 transition-all duration-300"
                :class="{ 'lg:mr-0': sidebarOpen, 'lg:mr-0': !sidebarOpen }"
            >
                <!-- Module header -->
                <div class="bg-white dark:bg-abyss-800 rounded-lg shadow-md p-6 mb-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-3">
                                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                                    {{ formatCategory(module.category) }}
                                </span>
                                <!-- <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm capitalize">
                                    {{ module.type }}
                                </span> -->
                                <span 
                                    v-if="module.is_featured"
                                    class="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold"
                                >
                                    ⭐ Featured
                                </span>
                            </div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                {{ module.title }}
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400">
                                {{ module.description }}
                            </p>
                        </div>

                        <!-- Admin actions -->
                        <div v-if="canEdit" class="flex gap-2">
                            <button 
                                @click="editModule"
                                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit module"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </button>
                            <button 
                                @click="confirmDelete"
                                class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete module"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Meta info bar -->
                    <div class="flex flex-wrap items-center gap-4 pt-4 border-t dark:border-abyss-700">
                        <!-- <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>{{ module.duration_minutes || 0 }} minutes</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                            </svg>
                            <span>{{ module.points || 0 }} points</span>
                        </div> -->
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                            <span class="capitalize">{{ module.difficulty_level }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span>{{ module.view_count || 0 }} views</span>
                        </div>
                        <!-- <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>{{ module.completion_count || 0 }} completed</span>
                        </div> -->
                    </div>

                    <!-- Mobile: Info toggle -->
                    <button 
                        @click="toggleSidebar"
                        class="lg:hidden mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>{{ sidebarOpen ? 'Hide' : 'Show' }} Module Info</span>
                    </button>
                </div>

                <!-- Document viewer -->
                <div class="bg-white dark:bg-abyss-800 rounded-lg shadow-md p-6 mb-6">
                    <DocumentViewer 
                        v-if="module.file_url"
                        :file-url="module.file_url"
                        :file-name="module.file_name"
                        :file-type="module.file_type"
                    />
                    <div v-else class="text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <p class="text-gray-500 dark:text-gray-400">No document attached to this module</p>
                    </div>
                </div>

                <!-- Content section -->
                <div v-if="module.content" class="bg-white dark:bg-abyss-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Content</h2>
                    <div 
                        class="prose dark:prose-invert max-w-none"
                        v-html="module.content"
                    ></div>
                </div>

                <!-- Complete button -->
                <!-- <div class="bg-white dark:bg-abyss-800 rounded-lg shadow-md p-6">
                    <button 
                        @click="markAsComplete"
                        :disabled="completing"
                        class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>{{ completing ? 'Marking Complete...' : 'Mark as Complete' }}</span>
                    </button>
                </div> -->
            </div>

            <!-- Sidebar - Desktop: side panel, Mobile: overlay -->
            <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-300 ease-in"
                enter-from-class="lg:translate-x-0 translate-x-full lg:opacity-0"
                enter-to-class="translate-x-0 opacity-100"
                leave-from-class="translate-x-0 opacity-100"
                leave-to-class="lg:translate-x-0 translate-x-full lg:opacity-0"
            >
                <div 
                    v-if="sidebarOpen"
                    class="fixed lg:sticky top-0 right-0 h-screen lg:h-auto lg:top-20 w-full lg:w-80 xl:w-96 bg-white dark:bg-abyss-800 shadow-2xl lg:shadow-md rounded-none lg:rounded-lg z-50 overflow-y-auto"
                >
                    <ModuleSidebar 
                        :module="module"
                        @close="sidebarOpen = false"
                    />
                </div>
            </transition>

            <!-- Overlay for mobile -->
            <transition
                enter-active-class="transition-opacity duration-300"
                leave-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div 
                    v-if="sidebarOpen"
                    @click="sidebarOpen = false"
                    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
                ></div>
            </transition>
        </div>

        <!-- Delete confirmation modal -->
        <DeleteConfirmModal 
            v-if="showDeleteModal"
            :module-title="module?.title"
            @confirm="handleDelete"
            @cancel="showDeleteModal = false"
        />

        <!-- Edit modal -->
        <EditModuleModal 
            v-if="showEditModal"
            :module="module"
            @saved="handleModuleUpdated"
            @cancel="showEditModal = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import DocumentViewer from '@/components/modules/DocumentViewer.vue';
import ModuleSidebar from '@/components/modules/ModuleSidebar.vue';
import DeleteConfirmModal from '@/components/modules/DeleteConfirmModal.vue';
import EditModuleModal from '@/components/modules/EditModuleModal.vue';

const route = useRoute();
const router = useRouter();
const moduleStore = useModuleStore();
const authStore = useAuthStore();
const toast = useToast();

const sidebarOpen = ref(false);
const completing = ref(false);
const error = ref(null);
const showDeleteModal = ref(false);
const showEditModal = ref(false);

const module = computed(() => moduleStore.currentModule);
const canEdit = computed(() => {
    const user = authStore.user;
    return user && (user.role === 'admin' || user.role === 'educator');
    //return true;

    // TODO for debug lang ng function, ibalik to sa proper verification
});

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const formatCategory = (category) => {
    const map = {
        'gad': 'GAD',
        'sexual_health': 'Sexual Health',
        'vawc': 'VAWC',
        'general': 'General'
    };
    return map[category] || category;
};

// const markAsComplete = async () => {
//     completing.value = true;
//     try {
//         await moduleStore.markComplete(module.value.id);
//         toast.success('Module marked as complete! 🎉');
//     } catch (err) {
//         toast.error('Failed to mark module as complete');
//     } finally {
//         completing.value = false;
//     }
// };

const editModule = () => {
    showEditModal.value = true;
};

const confirmDelete = () => {
    showDeleteModal.value = true;
};

const handleDelete = async () => {
    try {
        await moduleStore.deleteModule(module.value.id);
        toast.success('Module deleted successfully');
        router.push({ name: 'user.dashboard' });
    } catch (err) {
        toast.error('Failed to delete module');
    } finally {
        showDeleteModal.value = false;
    }
};

const handleModuleUpdated = () => {
    showEditModal.value = false;
    toast.success('Module updated successfully');
    // Refresh module data
    moduleStore.fetchModuleById(route.params.id);
};

onMounted(async () => {
    try {
        await moduleStore.fetchModuleById(route.params.id);
        // Auto-open sidebar on desktop
        if (window.innerWidth >= 1024) {
            sidebarOpen.value = true;
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Module not found';
    }
});
</script>

<style scoped>

@reference "@/style.css";
/* Prose styling for content */
.prose {
    @apply text-gray-700 dark:text-gray-300;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
    @apply text-gray-900 dark:text-white font-bold;
}

.prose :deep(a) {
    @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.prose :deep(code) {
    @apply bg-gray-100 dark:bg-abyss-700 px-1 py-0.5 rounded text-sm;
}
</style>
