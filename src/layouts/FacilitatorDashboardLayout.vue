<template>
    <div class="min-h-screen bg-platinum-50 dark:bg-abyss-950 transition-colors duration-300">
        <FacilitatorHeader />

        <div class="pt-16"> <FacilitatorSidebar />

            <main 
                class="transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-8"
                :class="[
                    sidebarStore.isExpanded ? 'md:ml-64' : 'md:ml-20',
                    'ml-0' // No margin on mobile
                ]"
            >
                <div class="max-w-7xl mx-auto w-full">
                    <router-view v-slot="{ Component }">
                        <Transition name="fade-slide" mode="out-in">
                            <component :is="Component" />
                        </Transition>
                    </router-view>
                </div>
            </main>
        </div>

        <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
            <div v-if="sidebarStore.isMobileOpen" @click="sidebarStore.closeMobile"
                class="fixed inset-0 bg-abyss-950/60 backdrop-blur-sm z-40 lg:hidden" />
        </Transition>
    </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/stores';
import FacilitatorSidebar from '@/components/facilitator/FacilitatorSidebar.vue';
import FacilitatorHeader from '@/components/facilitator/FacilitatorHeader.vue';

const sidebarStore = useSidebarStore();
</script>

<style scoped>
/* Smooth Fade-Slide Transition for Page Components */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.25s ease-out;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Base Fade for mobile backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>