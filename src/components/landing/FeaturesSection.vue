<!-- src/components/landing/FeaturesSection.vue -->
<template>
    <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-abyss-800/30">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-abyss-900 dark:text-platinum-50 mb-4">Comprehensive Learning Features</h2>
                <p class="text-xl text-platinum-600 dark:text-platinum-300">Everything you need to develop critical awareness and life skills.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    title="Gamified Learning"
                    description="Interactive quizzes, challenges, and activities make learning about GAD, sexual health, and violence prevention engaging and fun."
                    icon="M13 10V3L4 14h7v7l9-11h-7z"
                />
                <FeatureCard
                    title="Personalized Paths"
                    description="Content adapts based on your age and knowledge level, creating a customized learning journey tailored just for you."
                    icon="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
                <FeatureCard
                    title="Rewards & Recognition"
                    description="Earn badges, points, and unlock achievements as you progress. Compete on leaderboards to stay motivated."
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <FeatureCard
                    title="AI-Powered Insights"
                    description="Our advanced AI analyzes behavioral patterns to provide early detection alerts and support for VAWC prevention."
                    icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <FeatureCard
                    title="Resource Library"
                    description="Access guides, videos, and interactive materials tailored for your age group. Learn at your own pace."
                    icon="M13 10V3L4 14h7v7l9-11h-7z"
                />
                <FeatureCard
                    title="Data Privacy"
                    description="Your data is secure and protected. We maintain strict compliance with privacy standards and ethical guidelines."
                    icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>
