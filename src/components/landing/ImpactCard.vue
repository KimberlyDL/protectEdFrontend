<!-- src/components/landing/ImpactCard.vue -->
<template>
    <div :class="['p-8 rounded-xl border', bgClass, borderClass]">
        <h3 :class="['text-2xl font-bold mb-4', titleClass]">{{ title }}</h3>
        <ul class="space-y-3 text-platinum-700 dark:text-platinum-300">
            <li v-for="(item, index) in items" :key="index" class="flex items-start gap-3">
                <span :class="['flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mt-0.5', badgeBgClass]">✓</span>
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
    items: { type: Array, required: true },
    variant: { 
        type: String, 
        default: 'green',
        validator: (value) => ['green', 'orange'].includes(value)
    }
})

const bgClass = {
    green: 'bg-gradient-to-br from-kaitoke-green-50 to-emerald-50 dark:from-kaitoke-green-900/20 dark:to-emerald-900/20',
    orange: 'bg-gradient-to-br from-sun-50 to-amber-50 dark:from-sun-900/20 dark:to-amber-900/20'
}[props.variant]

const borderClass = {
    green: 'border-kaitoke-green-200 dark:border-kaitoke-green-800',
    orange: 'border-sun-200 dark:border-sun-800'
}[props.variant]

const titleClass = {
    green: 'text-kaitoke-green-900 dark:text-kaitoke-green-300',
    orange: 'text-sun-900 dark:text-sun-300'
}[props.variant]

const badgeBgClass = {
    green: 'bg-kaitoke-green-500',
    orange: 'bg-sun-500'
}[props.variant]
</script>
