<template>
    <header id="main-header" class="fixed top-0 left-0 right-0 z-50 border-b
            bg-white text-abyss-900 border-advocacy-purple-200
            dark:bg-abyss-800 dark:text-platinum-50 dark:border-abyss-700">
        <div class="max-w-7xl mx-auto px-2 sm:px-4">
            <div class="h-16 flex items-center justify-between gap-4">
                <!-- Left: menu + brand -->
                <div class="flex items-center gap-3">
                    <!-- Mobile menu -->
                    <button class="md:hidden p-2 rounded-lg text-abyss-900 hover:bg-advocacy-purple-50
                    dark:text-platinum-200 dark:hover:bg-abyss-700 transition" @click="$emit('toggle-mobile-sidebar')"
                        aria-label="Toggle navigation">
                        <!-- lucide burger -->
                        <Menu class="h-5 w-5" />
                    </button>

                    <!-- ProtectEd Brand Logo and Name -->
                    <router-link :to="{ name: 'user.dashboard' }"
                        class="flex items-center gap-2 text-xl font-extrabold tracking-wider text-advocacy-purple-600 dark:text-advocacy-purple-400">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" />
                        </svg>
                        ProtectEd
                    </router-link>

                    <!-- search (lg+) - Learning modules search -->
                    <div class="relative hidden lg:block">
                        <input type="text" placeholder="Search modules…" class="w-64 pl-10 pr-3 py-2 text-sm rounded-full outline-none
                    bg-white border border-advocacy-purple-200 text-abyss-900
                    focus:border-advocacy-purple-500 focus:ring-1 focus:ring-advocacy-purple-500
                    dark:bg-abyss-900 dark:text-platinum-50 dark:border-abyss-700" />
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum-500" />
                    </div>
                </div>

                <!-- Right: quick actions -->
                <div class="flex items-center gap-2 sm:gap-3">
                    <router-link :to="{ name: 'home' }" class="hidden sm:inline-block px-3 py-2 text-sm rounded-full
                    bg-advocacy-purple-600 hover:bg-advocacy-purple-700 text-white font-medium transition">
                        Start Learning
                    </router-link>

                    <!-- Profile dropdown moved out as its own component -->
                    <ProfileDropdown />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Menu, Search } from 'lucide-vue-next'
import ProfileDropdown from '@/components/nav/user_profile_dropdown.vue'
</script>
