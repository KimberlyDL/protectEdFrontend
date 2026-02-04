<!-- src/components/landing/ImpactSection.vue -->
<template>
    <section id="impact" class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-abyss-900 dark:text-platinum-50 mb-4">Making a Real Impact</h2>
                <p class="text-xl text-platinum-600 dark:text-platinum-300">Designed to educate, predict, and prevent violence in our communities.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <ImpactCard
                    title="Educational Excellence"
                    variant="green"
                    :items="[
                        'Comprehensive GAD, sexual health, and VAWC education',
                        'Age-appropriate content for different age groups',
                        'Proven gamification to boost engagement and retention',
                        'Interactive scenarios and real-world decision-making'
                    ]"
                />
                <ImpactCard
                    title="Prevention & Safety"
                    variant="orange"
                    :items="[
                        'Early detection of concerning behavioral patterns',
                        'AI-powered risk alerts for educators and administrators',
                        'Support for timely intervention and prevention',
                        'Aggregated insights for trend analysis and planning'
                    ]"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import ImpactCard from './ImpactCard.vue'
</script>
