<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-sun-200 dark:border-abyss-700">
            <router-link :to="{ name: 'user.dashboard' }" class="text-kaitoke-green-600 hover:underline text-sm font-medium mb-4 inline-block">
                ← Back to Dashboard
            </router-link>
            
            <h1 class="text-3xl font-bold text-abyss-900 dark:text-platinum-50 mb-2">
                {{ moduleTitle }}
            </h1>
            <p class="text-platinum-600 dark:text-platinum-300 mb-6">
                Dive deeper into this important topic and track your progress through all lessons.
            </p>

            <!-- Progress Section -->
            <div class="mb-8">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-platinum-600 dark:text-platinum-400">Module Progress</span>
                    <span class="font-medium text-abyss-900 dark:text-platinum-100">{{ progress }}%</span>
                </div>
                <div class="h-3 bg-sun-100 dark:bg-abyss-700 rounded-full overflow-hidden">
                    <div class="h-full bg-kaitoke-green-500" :style="{ width: progress + '%' }"></div>
                </div>
            </div>

            <!-- Content Loading -->
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-platinum-600 dark:text-platinum-400">Loading module content...</p>
            </div>
            <div v-else class="prose dark:prose-invert max-w-none">
                <p class="text-abyss-900 dark:text-platinum-100">Module content and lessons will be displayed here.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const moduleTitle = ref('Module Detail')
const progress = ref(0)
const isLoading = ref(true)

onMounted(async () => {
    const moduleId = route.params.id
    try {
        const res = await api.get(`/api/v1/modules/${moduleId}`)
        if (res.data) {
            moduleTitle.value = res.data.name || 'Module Detail'
            progress.value = res.data.progress || 0
        }
    } catch (error) {
        console.error('[v0] Failed to load module:', error.message)
    } finally {
        isLoading.value = false
    }
})
</script>
