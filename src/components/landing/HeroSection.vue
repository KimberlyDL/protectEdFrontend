<!-- src/components/landing/HeroSection.vue -->
<template>
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto text-center space-y-8">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-abyss-900 dark:text-platinum-50 leading-tight">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-kaitoke-green-600 to-emerald-600">Learn. Grow. Protect.</span>
            </h1>

            <p class="text-xl text-platinum-600 dark:text-platinum-300 max-w-2xl mx-auto leading-relaxed">
                ProtectEd is a gamified AI-powered platform designed to educate and empower learners about Gender Awareness, sexual health, and violence prevention through engaging, interactive experiences.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <router-link :to="{ name: 'signup' }" class="px-8 py-4 bg-kaitoke-green-600 hover:bg-kaitoke-green-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Start Learning Today
                </router-link>
                <a href="#features" class="px-8 py-4 border-2 border-kaitoke-green-600 text-kaitoke-green-600 dark:text-kaitoke-green-400 dark:border-kaitoke-green-400 hover:bg-kaitoke-green-50 dark:hover:bg-abyss-800 font-semibold rounded-lg transition">
                    Explore Features
                </a>
            </div>
        </div>
    </section>
</template>

<script setup>
// Hero section with headline, tagline, and CTAs
</script>
