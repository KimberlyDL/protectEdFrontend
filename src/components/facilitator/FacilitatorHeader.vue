<template>
    <header class="fixed top-0 left-0 right-0 z-[60] h-16 bg-white dark:bg-abyss-900 border-b border-gray-200 dark:border-abyss-800 shadow-sm">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-4">
                <button @click="sidebarStore.toggleMobile"
                    class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-abyss-800 transition-colors">
                    <MenuIcon class="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </button>

                <nav class="hidden sm:flex items-center space-x-2 text-sm">
                    <router-link to="/facilitator/dashboard"
                        class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        Facilitator
                    </router-link>
                    <ChevronRightIcon class="h-4 w-4 text-gray-400" />
                    <span class="text-gray-900 dark:text-white font-medium">{{ currentPageTitle }}</span>
                </nav>
            </div>

            <div class="flex items-center gap-3">
                <div class="hidden md:block relative">
                    <input type="text" placeholder="Search modules..."
                        class="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-abyss-700 bg-white dark:bg-abyss-800 text-sm focus:ring-2 focus:ring-electric-lime-500 focus:border-transparent" />
                    <SearchIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <button @click="createModule"
                    class="hidden md:flex items-center gap-2 px-4 py-2 bg-electric-lime-600 hover:bg-electric-lime-700 text-white rounded-lg text-sm font-medium transition-colors">
                    <PlusIcon class="h-4 w-4" />
                    <span>Create</span>
                </button>

                <button class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-abyss-800 transition-colors">
                    <BellIcon class="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <span
                        class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-abyss-900"></span>
                </button>

                <button @click="toggleTheme"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-abyss-800 transition-colors">
                    <SunIcon v-if="isDark" class="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <MoonIcon v-else class="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/stores';
import {
    MenuIcon,
    ChevronRightIcon,
    SearchIcon,
    PlusIcon,
    BellIcon,
    SunIcon,
    MoonIcon
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const isDark = ref(false);

const currentPageTitle = computed(() => route.meta.title || 'Dashboard');

const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark');
};

const createModule = () => {
    router.push('/facilitator/modules/create');
};
</script>