<!-- src/components/landing/LandingNav.vue -->
<template>
    <nav class="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-abyss-900/80 backdrop-blur-sm border-sun-200 dark:border-abyss-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="h-16 flex items-center justify-between">
                <!-- Logo -->
                <router-link :to="{ name: 'home' }" class="flex items-center gap-2 text-xl font-extrabold tracking-wider text-kaitoke-green-600 dark:text-kaitoke-green-400">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" />
                    </svg>
                    ProtectEd
                </router-link>

                <!-- Navigation Links -->
                <div class="hidden md:flex items-center gap-8">
                    <a href="#features" class="text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:text-kaitoke-green-600 dark:hover:text-kaitoke-green-400 transition">Features</a>
                    <a href="#impact" class="text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:text-kaitoke-green-600 dark:hover:text-kaitoke-green-400 transition">Impact</a>
                    <a href="#about" class="text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:text-kaitoke-green-600 dark:hover:text-kaitoke-green-400 transition">About</a>
                </div>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-3">
                    <router-link :to="{ name: 'login' }" class="hidden sm:inline-block px-4 py-2 text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:text-kaitoke-green-600 dark:hover:text-kaitoke-green-400 transition">
                        Sign In
                    </router-link>
                    <router-link :to="{ name: 'signup' }" class="px-4 py-2 bg-kaitoke-green-600 hover:bg-kaitoke-green-700 text-white text-sm font-medium rounded-lg transition shadow-md hover:shadow-lg">
                        Get Started
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
// Navigation component with logo, links, and auth buttons
</script>
