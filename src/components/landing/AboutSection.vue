<!-- src/components/landing/AboutSection.vue -->
<template>
    <section id="about" class="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-abyss-800/30">
        <div class="max-w-4xl mx-auto text-center space-y-8">
            <h2 class="text-4xl font-bold text-abyss-900 dark:text-platinum-50">About ProtectEd</h2>

            <div class="space-y-6 text-lg text-platinum-600 dark:text-platinum-300 leading-relaxed">
                <p>
                    ProtectEd is a cutting-edge platform that bridges the gap between interactive education and predictive intelligence. By combining gamified learning modules with AI-powered behavioral analysis, we create a unified system that educates, engages, and supports early intervention efforts in VAWC prevention.
                </p>

                <p>
                    Built specifically for educational institutions and VAWC prevention organizations, ProtectEd provides comprehensive tools for teaching critical life skills while simultaneously identifying and supporting at-risk individuals before issues escalate.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <router-link :to="{ name: 'signup' }" class="px-8 py-4 bg-kaitoke-green-600 hover:bg-kaitoke-green-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl">
                    Join Our Community
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
// About section with platform description and CTA
</script>
