<!-- src/components/modules/CreateModuleModal.vue -->
<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>

        <!-- Modal -->
        <div
            class="relative bg-platinum-50 dark:bg-abyss-700 rounded-lg shadow-2xl max-w-4xl w-full my-8 animate-scale-in">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b dark:border-advocacy-purple-800">
                <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-200">Create New Module</h2>
                <button @click="$emit('cancel')"
                    class="p-2 hover:bg-advocacy-purple-100 dark:hover:bg-advocacy-purple-800 rounded-lg transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- Basic Info -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Title <span class="text-neon-pink-600">*</span>
                        </label>
                        <input v-model="form.title" type="text" required
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent"
                            placeholder="Module title" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Description
                        </label>
                        <textarea v-model="form.description" rows="4"
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent"
                            placeholder="Module description"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Content (HTML/Markdown)
                        </label>
                        <textarea v-model="form.content" rows="6"
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent font-mono text-sm"
                            placeholder="<h1>Module content...</h1>"></textarea>
                    </div>
                </div>

                <!-- Classification -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Category <span class="text-neon-pink-600">*</span>
                        </label>
                        <select v-model="form.category" required
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent">
                            <option value="gad">GAD</option>
                            <option value="sexual_health">Sexual Health</option>
                            <option value="vawc">VAWC</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Difficulty
                        </label>
                        <select v-model="form.difficulty_level"
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <!-- File Uploads -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Module File (PDF/Word)
                        </label>
                        <input type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" ref="fileInput"
                            class="w-full text-sm text-advocacy-purple-600 dark:text-advocacy-purple-400" />
                        <p class="text-xs text-advocacy-purple-600 dark:text-advocacy-purple-400 mt-1">Max 25MB - PDF, DOC, DOCX only
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Thumbnail Image
                        </label>
                        <input type="file" accept="image/*" @change="handleThumbnailSelect" ref="thumbnailInput"
                            class="w-full text-sm text-advocacy-purple-600 dark:text-advocacy-purple-400" />
                        <p class="text-xs text-advocacy-purple-600 dark:text-advocacy-purple-400 mt-1">Max 5MB - Images only</p>
                    </div>
                </div>

                <!-- Gamification -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-abyss-900 dark:text-platinum-100 mb-2">
                            Order
                        </label>
                        <input v-model.number="form.order" type="number" min="0"
                            class="w-full border border-platinum-300 dark:border-abyss-400 rounded-lg px-4 py-2 bg-platinum-50 dark:bg-abyss-700 dark:bg-abyss-700/50 text-advocacy-purple-900 dark:text-white focus:ring-2 focus:ring-calm-lavender-500 focus:border-transparent" />
                    </div>
                </div>

                <!-- Status -->
                <div class="flex items-center gap-6 p-4 bg-calm-lavender-50 dark:bg-abyss-700 rounded-lg">
                    <label class="flex items-center cursor-pointer">
                        <input v-model="form.is_published" type="checkbox"
                            class="w-4 h-4 text-calm-lavender-600 border-advocacy-purple-300 rounded focus:ring-calm-lavender-500 bg-platinum-50 dark:bg-abyss-700" />
                        <span class="ml-2 text-sm text-abyss-900 dark:text-platinum-100">Published</span>
                    </label>

                    <label class="flex items-center cursor-pointer">
                        <input v-model="form.is_featured" type="checkbox"
                            class="w-4 h-4 text-calm-lavender-600 border-advocacy-purple-300 rounded focus:ring-calm-lavender-500 bg-platinum-50 dark:bg-abyss-700" />
                        <span class="ml-2 text-sm text-abyss-900 dark:text-platinum-100">Featured</span>
                    </label>
                </div>

                <!-- Error message -->
                <div v-if="error"
                    class="bg-neon-pink-50 dark:bg-neon-pink-900/20 border border-neon-pink-200 dark:border-neon-pink-800 rounded-lg p-4">
                    <p class="text-sm text-neon-pink-800 dark:text-neon-pink-200">{{ error }}</p>
                </div>
            </form>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t dark:border-advocacy-purple-800">
                <button type="button" @click="$emit('cancel')"
                    class="px-6 py-2 border border-platinum-300 dark:border-abyss-400 text-advocacy-purple-700 dark:text-advocacy-purple-300 rounded-lg hover:bg-advocacy-purple-50 dark:hover:bg-advocacy-purple-800 transition-colors">
                    Cancel
                </button>
                <button type="button" @click="handleSubmit" :disabled="creating"
                    class="px-6 py-2 bg-calm-lavender-600 hover:bg-calm-lavender-700 disabled:bg-advocacy-purple-400 text-white rounded-lg transition-colors font-semibold">
                    {{ creating ? 'Creating...' : 'Create Module' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useModuleStore } from '@/stores/module';

const emit = defineEmits(['saved', 'cancel']);

const moduleStore = useModuleStore();

const form = reactive({
    title: '',
    description: '',
    content: '',
    category: 'general',
    difficulty_level: 'beginner',
    order: 0,
    is_published: false,
    is_featured: false
});

const moduleFile = ref(null);
const thumbnail = ref(null);
const creating = ref(false);
const error = ref(null);

const fileInput = ref(null);
const thumbnailInput = ref(null);

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            error.value = 'Invalid file type. Only PDF and Word documents are allowed.';
            event.target.value = '';
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            error.value = 'File size exceeds 25MB limit.';
            event.target.value = '';
            return;
        }

        moduleFile.value = file;
        error.value = null;
    }
};

const handleThumbnailSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            error.value = 'Invalid file type. Only images are allowed.';
            event.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            error.value = 'Thumbnail size exceeds 5MB limit.';
            event.target.value = '';
            return;
        }

        thumbnail.value = file;
        error.value = null;
    }
};

const handleSubmit = async () => {
    creating.value = true;
    error.value = null;

    try {
        const files = {
            moduleFile: moduleFile.value,
            thumbnail: thumbnail.value
        };

        await moduleStore.createModule(form, files);
        emit('saved');
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to create module';
    } finally {
        creating.value = false;
    }
};
</script>

<style scoped>
@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-scale-in {
    animation: scale-in 0.2s ease-out;
}
</style>
