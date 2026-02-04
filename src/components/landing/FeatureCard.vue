<!-- src/components/landing/FeatureCard.vue -->
<template>
    <div class="p-8 rounded-xl bg-white dark:bg-abyss-900 border border-sun-200 dark:border-abyss-700 hover:shadow-lg dark:hover:shadow-abyss-900/50 transition">
        <div class="w-12 h-12 bg-kaitoke-green-100 dark:bg-kaitoke-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-kaitoke-green-600" fill="none" stroke="currentColor" :viewBox="viewBox">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
            </svg>
        </div>
        <h3 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 mb-2">{{ title }}</h3>
        <p class="text-platinum-600 dark:text-platinum-400">{{ description }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    viewBox: { type: String, default: '0 0 24 24' }
})
</script>
