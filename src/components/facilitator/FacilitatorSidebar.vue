<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useSidebarStore } from '@/stores/stores';
import { useRoute, useRouter } from 'vue-router';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import {
    ChevronsLeftIcon, ChevronsRightIcon,
    LayoutDashboardIcon, UsersIcon, BookOpenIcon,
    LineChartIcon, ClipboardCheckIcon
} from 'lucide-vue-next';
import SidebarNavItem from '@/components/sidebar/user_sidebar_nav_item.vue';
import SidebarNavDropdown from '@/components/sidebar/user_sidebar_nav_dropdown.vue';
import FacilitatorProfileDropdown from './FacilitatorProfileDropdown.vue';

const sidebarStore = useSidebarStore();
const route = useRoute();
const router = useRouter();
const pendingReviews = ref(3);

const profileMenuOpen = ref(false);
const profileDropdownRef = ref(null);
const profileTriggerWrapper = ref(null);
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

const isMobile = computed(() => width.value < 768);
const isIcon = computed(() => !sidebarStore.isExpanded || isMobile.value);

const reposition = async () => {
    if (!profileMenuOpen.value || !profileDropdownRef.value || !profileTriggerWrapper.value) return;
    await nextTick();

    const trigger = profileTriggerWrapper.value;
    const dropdown = profileDropdownRef.value.$el;

    if (!trigger || !dropdown) return;

    const { x, y } = await computePosition(trigger, dropdown, {
        placement: 'right-end',
        middleware: [offset(12), flip(), shift({ padding: 8 })],
    });

    Object.assign(dropdown.style, {
        left: `${x}px`,
        top: `${y}px`
    });
};

const handleResize = () => {
    width.value = window.innerWidth;
    if (profileMenuOpen.value) reposition();
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

watch(profileMenuOpen, (val) => {
    if (val) reposition();
});

watch(() => route.path, () => {
    if (sidebarStore.isMobileOpen) sidebarStore.closeMobile();
});
</script>

<template>
    <aside :class="[
        'fixed top-16 left-0 bottom-0 z-50 flex flex-col', // Fixed: top-16 starts sidebar below header
        'bg-white/90 backdrop-blur-xl border-r border-gray-200/50',
        'dark:bg-abyss-900/95 dark:border-abyss-800/50 text-abyss-900 dark:text-platinum-300',
        'transition-[width] duration-300 ease-in-out shadow-xl overflow-x-hidden', // Fixed: overflow-x-hidden stops clipping
        sidebarStore.isExpanded ? 'w-64' : 'w-20',
        sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
        <div class="hidden md:flex items-center h-16 px-4 border-b border-gray-200/50 dark:border-abyss-800/50 flex-shrink-0 transition-all duration-300"
     :class="sidebarStore.isExpanded ? 'justify-between' : 'justify-center'">
    
    <span v-if="sidebarStore.isExpanded" 
          class="text-[10px] font-black uppercase tracking-[0.2em] text-platinum-400 animate-in fade-in duration-500">
        Navigation
    </span>

    <button @click="sidebarStore.toggleExpanded" 
        class="p-1.5 rounded-lg bg-gray-50 dark:bg-abyss-800 hover:scale-110 transition-all text-electric-lime-600 border border-transparent hover:border-electric-lime-500/50 outline-none"
        :aria-label="sidebarStore.isExpanded ? 'Collapse sidebar' : 'Expand sidebar'">
        <ChevronsLeftIcon v-if="sidebarStore.isExpanded" class="h-4 w-4" />
        <ChevronsRightIcon v-else class="h-4 w-4" />
    </button>
</div>

        <nav class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 custom-scrollbar">
            <SidebarNavItem to="/facilitator/dashboard" :exact="true"
                :title="sidebarStore.isExpanded ? 'Dashboard' : ''">
                <template #icon>
                    <LayoutDashboardIcon class="h-5 w-5" />
                </template>
            </SidebarNavItem>

            <SidebarNavItem to="/facilitator/students" :title="sidebarStore.isExpanded ? 'My Students' : ''">
                <template #icon>
                    <UsersIcon class="h-5 w-5" />
                </template>
            </SidebarNavItem>

            <SidebarNavDropdown :label="sidebarStore.isExpanded ? 'Modules' : ''"
                :is-collapsed="!sidebarStore.isExpanded" :match-paths="['/facilitator/modules']">
                <template #icon>
                    <BookOpenIcon class="h-5 w-5" />
                </template>
                <SidebarNavItem v-if="sidebarStore.isExpanded" to="/facilitator/modules" title="All Modules" />
                <SidebarNavItem v-if="sidebarStore.isExpanded" to="/facilitator/modules/create" title="Create Module" />
            </SidebarNavDropdown>

            <SidebarNavItem to="/facilitator/analytics" :title="sidebarStore.isExpanded ? 'Analytics' : ''">
                <template #icon>
                    <LineChartIcon class="h-5 w-5" />
                </template>
            </SidebarNavItem>

            <SidebarNavItem to="/facilitator/reviews" :title="sidebarStore.isExpanded ? 'Pending Reviews' : ''">
                <template #icon>
                    <div class="relative">
                        <ClipboardCheckIcon class="h-5 w-5" />

                        <span v-if="pendingReviews > 0 && !sidebarStore.isExpanded"
                            class="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-abyss-900 shadow-sm animate-pulse">
                        </span>
                    </div>
                </template>

                <template #badge v-if="sidebarStore.isExpanded">
                    <span v-if="pendingReviews > 0"
                        class="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {{ pendingReviews }}
                    </span>
                </template>
            </SidebarNavItem>
        </nav>

        <div ref="profileTriggerWrapper" class="mt-auto flex flex-col border-t border-gray-200 dark:border-abyss-800">
            <FacilitatorProfileDropdown v-model:open="profileMenuOpen" :expanded="sidebarStore.isExpanded"
                :is-open="profileMenuOpen" @close="profileMenuOpen = false" ref="profileDropdownRef" />
        </div>
    </aside>
</template>

<style scoped>
@reference "@/style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-electric-lime-500/20 hover:bg-electric-lime-500/40 rounded-full;
}

aside::after {
    content: '';
    @apply absolute inset-0 pointer-events-none -z-10 opacity-30;
    background: linear-gradient(180deg, transparent 0%, rgba(132, 204, 22, 0.05) 100%);
}

aside {
    will-change: width;
}
</style>