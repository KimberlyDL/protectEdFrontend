<!-- src/components/admin/AdminSidebar.vue -->
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import {
    LayoutDashboard,
    BookOpen,
    BrainCircuit,
    FileSearch,
    Bell,
    Database,
    ClipboardCheck,
    SearchCode,
    Users,
    ChevronLeft,
    ChevronRight
} from 'lucide-vue-next'
import AdminProfileDropdown from './AdminProfileDropdown.vue'

const route = useRoute()
const router = useRouter()

const expanded = ref(false)
const profileMenuOpen = ref(false)
const profileTriggerRef = ref(null)
const profileDropdownRef = ref(null)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => width.value < 768)

const mode = computed(() => {
    return expanded.value ? 'full' : 'icon'
})
const isIcon = computed(() => mode.value === 'icon')
const isFull = computed(() => mode.value === 'full')

const navigation = [
    { name: 'Main Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Resource Library', icon: BookOpen, path: '/resources' },
    { name: 'Class Analytics', icon: BrainCircuit, path: '/analytics' },
    { name: 'Student Progress', icon: FileSearch, path: '/student-logs' },
    { name: 'Early Alerts', icon: Bell, path: '/alerts', critical: true },
    { name: 'User Management', icon: Users, path: '/management' },
    { name: 'Content Approval', icon: ClipboardCheck, path: '/approvals' },
    { name: 'AI Config', icon: SearchCode, path: '/ai-settings' },
    { name: 'System Audit', icon: Database, path: '/audit-logs' },
]

const reposition = async () => {
    if (!profileMenuOpen.value) return
    await nextTick()
    const trigger = profileTriggerRef.value
    const dropdown = profileDropdownRef.value
    if (!trigger || !dropdown) return
    const { x, y } = await computePosition(trigger, dropdown, {
        placement: 'right-start',
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    })
    Object.assign(dropdown.style, {
        left: `${x}px`,
        top: `${y}px`,
    })
}

watch(profileMenuOpen, (open) => {
    if (open) reposition()
})

const handleResize = () => {
    width.value = window.innerWidth
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize)
        window.addEventListener('resize', reposition)
    }
})

function navClick(item) {
    router.push(item.path)
}
</script>

<template>
    <aside :class="[
        'fixed top-16 left-0 bottom-0 z-40',
        'bg-white/80 backdrop-blur-md text-abyss-900 border-r border-platinum-200',
        'dark:bg-abyss-900/90 dark:backdrop-blur-xl dark:text-platinum-300 dark:border-abyss-800',
        'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
        isIcon && 'w-20 md:block',
        isFull && 'w-64 md:block'
    ]">
        <div class="h-full flex flex-col">
            <!-- Header with toggle -->
            <div
                class="hidden md:flex items-center justify-between px-4 py-3 border-b border-platinum-100 dark:border-abyss-800">
                <span v-if="isFull"
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-platinum-400">Navigation</span>
                <button @click="expanded = !expanded"
                    class="p-1.5 rounded-lg bg-platinum-50 dark:bg-abyss-800 hover:scale-110 transition-all border border-transparent hover:border-kaitoke-green-500/50"
                    :aria-label="isFull ? 'Collapse sidebar' : 'Expand sidebar'">
                    <ChevronLeft v-if="isFull" class="h-4 w-4 text-kaitoke-green-600" />
                    <ChevronRight v-else class="h-4 w-4 text-kaitoke-green-600" />
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <div v-for="item in navigation" :key="item.path" class="space-y-1">
                    <button @click="navClick(item)" :title="item.name" :class="[
                        'group w-full rounded-xl transition-all duration-300 px-3 py-2.5 relative overflow-hidden',
                        'hover:bg-kaitoke-green-50/50 dark:hover:bg-kaitoke-green-900/10',
                        route.path === item.path
                            ? 'bg-kaitoke-green-50 dark:bg-kaitoke-green-900/20 shadow-sm'
                            : 'transparent'
                    ]">
                        <div v-if="route.path === item.path"
                            class="absolute left-0 top-2 bottom-2 w-1 bg-kaitoke-green-500 rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                        </div>

                        <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                            <div
                                class="p-2 rounded-lg bg-kaitoke-green-100/50 dark:bg-kaitoke-green-900/20 group-hover:bg-opacity-80 transition-all duration-300 group-hover:scale-110">
                                <component :is="item.icon" :class="[
                                    'h-5 w-5 stroke-[1.75] transition-colors',
                                    route.path === item.path ? 'text-kaitoke-green-700 dark:text-kaitoke-green-300' : 'text-platinum-500 group-hover:text-kaitoke-green-600'
                                ]" />
                            </div>
                            <span v-if="!isIcon" :class="[
                                'truncate font-heading text-sm tracking-wide transition-colors',
                                route.path === item.path ? 'font-bold text-kaitoke-green-700 dark:text-kaitoke-green-300' : 'font-medium'
                            ]">
                                {{ item.name }}
                            </span>
                            <span v-if="item.critical && !isIcon"
                                class="ml-auto px-2 py-1 text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">New</span>
                        </div>
                    </button>
                </div>
            </nav>

            <!-- Profile Section -->
            <div class="border-t border-platinum-100 dark:border-abyss-800 p-3 flex-shrink-0">
                <AdminProfileDropdown />
            </div>
        </div>
    </aside>
</template>

<style scoped>
@reference "@/style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-platinum-200 dark:bg-abyss-800 rounded-full;
}
</style>
