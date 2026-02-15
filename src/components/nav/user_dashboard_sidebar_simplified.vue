<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import {
    Home,
    BookOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    Trophy,
    BarChart3,
    LogOut,
    User,
    MoreVertical,
    GraduationCap,
    FolderOpen
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const props = defineProps({
    isMobileOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['close-mobile-sidebar', 'expanded-change'])

const expanded = ref(false)
const profileMenuOpen = ref(false)
const profileTriggerRef = ref(null)
const profileDropdownRef = ref(null)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => width.value < 768)

const mode = computed(() => {
    if (isMobile.value) return props.isMobileOpen ? 'mobile-full' : 'hidden'
    return expanded.value ? 'full' : 'icon'
})
const isHidden = computed(() => mode.value === 'hidden')
const isMobileShown = computed(() => mode.value === 'mobile-full')
const isIcon = computed(() => mode.value === 'icon')
const isFull = computed(() => mode.value === 'full')

// Watch expanded state and emit to parent
watch(expanded, (newVal) => {
    emit('expanded-change', newVal)
})

const reposition = async () => {
    if (!profileMenuOpen.value) return
    await nextTick()

    const trigger = profileTriggerRef.value
    const dropdown = profileDropdownRef.value
    if (!trigger || !dropdown) return

    const { x, y } = await computePosition(trigger, dropdown, {
        placement: 'right-start',
        middleware: [
            offset(8),
            flip(),
            shift({ padding: 8 }),
        ],
    })

    Object.assign(dropdown.style, {
        left: `${x}px`,
        top: `${y}px`,
    })
}

watch(profileMenuOpen, (open) => {
    if (open) reposition()
})

// Mock Classrooms Data
const myClassrooms = ref([
    {
        id: 1,
        name: 'Cybersecurity 101',
        instructor: 'Prof. Sarah Jenkins',
        color: 'bg-calm-lavender-600',
        shortName: 'CS101'
    },
    {
        id: 2,
        name: 'Network Infrastructure',
        instructor: 'Dr. James Miller',
        color: 'bg-blue-600',
        shortName: 'NET'
    },
    {
        id: 3,
        name: 'Web Dev Capstone',
        instructor: 'Prof. Alan Turing',
        color: 'bg-purple-600',
        shortName: 'WEB'
    }
])

// Navigation Functions
function goHome() {
    router.push({ name: 'user.dashboard' })
}

function goModules() {
    router.push({ name: 'user.modules' })
}

function goLeaderboard() {
    router.push({ name: 'leaderboard' })
}

function goStats() {
    router.push({ name: 'user.stats' })
}

function goSettings() {
    router.push({ name: 'user.settings' })
}

function goProfile() {
    router.push({ name: 'user.profile' })
}

function goClassroomList() {
    router.push({ name: 'classroom.list' })
}

function goClassroom(classroomId) {
    router.push({ name: 'classroom.home', params: { id: classroomId } })
}

async function logout() {
    try {
        await auth.logout()
    } finally {
        router.push({ name: 'login' })
    }
}

const mine = ref([])

function getOrgInitials(org) {
    if (!org || !org.name) return 'U'
    return org.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

onMounted(() => {
    const handleResize = () => (width.value = window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <!-- Mobile Overlay -->
    <div v-if="isMobileShown" @click="emit('close-mobile-sidebar')"
        class="fixed inset-0 z-40 bg-abyss-900/80 backdrop-blur-sm md:hidden"></div>

    <!-- Sidebar -->
    <aside v-if="!isHidden" :class="[
        'fixed top-16 bottom-0 z-40 bg-white dark:bg-abyss-900 border-r border-platinum-100 dark:border-abyss-800 flex flex-col transition-all duration-300',
        isMobileShown ? 'left-0 w-64 shadow-xl' : '',
        !isMobile && 'md:left-0',
        isIcon ? 'md:w-20' : 'md:w-64'
    ]">
        <!-- Toggle Button (Desktop Only) -->
        <button v-if="!isMobile" @click="expanded = !expanded"
            class="absolute -right-3 top-6 z-10 w-6 h-6 bg-white dark:bg-abyss-800 border border-platinum-200 dark:border-abyss-700 rounded-full flex items-center justify-center hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors shadow-sm">
            <ChevronLeft v-if="!isIcon" class="h-3 w-3 text-platinum-600 dark:text-platinum-400" />
            <ChevronRight v-else class="h-3 w-3 text-platinum-600 dark:text-platinum-400" />
        </button>

        <!-- Header -->
        <div class="p-4 border-b border-platinum-100 dark:border-abyss-800">
            <div v-if="!isIcon" class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-calm-lavender-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <GraduationCap class="h-6 w-6 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-abyss-900 dark:text-platinum-50 truncate text-sm">ProtectED</h2>
                    <p class="text-[10px] text-platinum-500 dark:text-platinum-400 uppercase tracking-wider">
                        Learning Platform
                    </p>
                </div>
            </div>
            <div v-else class="flex justify-center">
                <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-calm-lavender-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <GraduationCap class="h-6 w-6 text-white" />
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
            <!-- Main Navigation Section -->
            <section class="space-y-1">
                <p v-if="!isIcon"
                    class="px-3 text-[10px] font-bold text-platinum-400 dark:text-platinum-500 uppercase tracking-widest mb-2">
                    Main
                </p>

                <button @click="goHome()"
                    :class="['sidebar-btn group', route.name === 'user.dashboard' ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20' : '']">
                    <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                        <div
                            class="p-2 rounded-lg group-hover:bg-calm-lavender-100 dark:group-hover:bg-calm-lavender-900/30 transition-colors">
                            <Home :class="[
                                'h-5 w-5 stroke-[1.75] transition-colors',
                                route.name === 'user.dashboard' ? 'text-calm-lavender-600' : 'text-platinum-500 group-hover:text-calm-lavender-600'
                            ]" />
                        </div>
                        <span v-if="!isIcon" :class="[
                            'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                            route.name === 'user.dashboard' ? 'text-calm-lavender-700 dark:text-calm-lavender-300' : 'text-platinum-600 dark:text-platinum-400'
                        ]">Dashboard</span>
                    </div>
                </button>

                <button @click="goModules()"
                    :class="['sidebar-btn group', route.name === 'user.modules' ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20' : '']">
                    <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                        <div
                            class="p-2 rounded-lg group-hover:bg-advocacy-purple-100 dark:group-hover:bg-advocacy-purple-900/30 transition-colors">
                            <BookOpen :class="[
                                'h-5 w-5 stroke-[1.75] transition-colors',
                                route.name === 'user.modules' ? 'text-advocacy-purple-600' : 'text-platinum-500 group-hover:text-advocacy-purple-600'
                            ]" />
                        </div>
                        <span v-if="!isIcon" :class="[
                            'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                            route.name === 'user.modules' ? 'text-advocacy-purple-700 dark:text-advocacy-purple-300' : 'text-platinum-600 dark:text-platinum-400'
                        ]">All Modules</span>
                    </div>
                </button>

                <button @click="goLeaderboard()" class="sidebar-btn group">
                    <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                        <div
                            class="p-2 rounded-lg bg-vawc-orange-100 dark:bg-vawc-orange-900/20 group-hover:bg-opacity-80 transition-colors">
                            <Trophy
                                :class="['h-5 w-5 stroke-[1.75] text-vawc-orange-600 transition-colors', 'group-hover:text-vawc-orange-700']" />
                        </div>
                        <span v-if="!isIcon"
                            class="font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform text-platinum-600 dark:text-platinum-400">Leaderboard</span>
                    </div>
                </button>

                <button @click="goStats()"
                    :class="['sidebar-btn group', route.name === 'user.stats' ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20' : '']">
                    <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                        <div
                            class="p-2 rounded-lg group-hover:bg-calm-lavender-100 dark:group-hover:bg-calm-lavender-900/30 transition-colors">
                            <BarChart3 :class="[
                                'h-5 w-5 stroke-[1.75] transition-colors',
                                route.name === 'user.stats' ? 'text-calm-lavender-600' : 'text-platinum-500 group-hover:text-calm-lavender-600'
                            ]" />
                        </div>
                        <span v-if="!isIcon" :class="[
                            'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                            route.name === 'user.stats' ? 'text-calm-lavender-700 dark:text-calm-lavender-300' : 'text-platinum-600 dark:text-platinum-400'
                        ]">My Stats</span>
                    </div>
                </button>
            </section>

            <!-- Classrooms Section -->
            <section class="space-y-1">
                <div class="flex items-center justify-between px-3 mb-2">
                    <p v-if="!isIcon"
                        class="text-[10px] font-bold text-platinum-400 dark:text-platinum-500 uppercase tracking-widest">
                        Classrooms
                    </p>
                    <button v-if="!isIcon" @click="goClassroomList()"
                        class="text-calm-lavender-600 hover:text-calm-lavender-700 transition-colors"
                        title="View all classrooms">
                        <FolderOpen class="h-4 w-4" />
                    </button>
                </div>

                <!-- Classroom List Button (Icon Mode) -->
                <button v-if="isIcon" @click="goClassroomList()" class="sidebar-btn group">
                    <div class="flex items-center justify-center">
                        <div
                            class="p-2 rounded-lg group-hover:bg-safety-teal-100 dark:group-hover:bg-safety-teal-900/30 transition-colors">
                            <FolderOpen class="h-5 w-5 stroke-[1.75] text-safety-teal-600" />
                        </div>
                    </div>
                </button>

                <!-- Individual Classrooms (Full Mode) -->
                <template v-if="!isIcon">
                    <button v-for="classroom in myClassrooms" :key="classroom.id" @click="goClassroom(classroom.id)"
                        :class="[
                            'sidebar-btn group',
                            route.params.id == classroom.id ? 'bg-safety-teal-50 dark:bg-safety-teal-900/20' : ''
                        ]">
                        <div class="flex items-center gap-3 justify-start">
                            <div :class="[
                                'w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                                classroom.color
                            ]">
                                {{ classroom.shortName }}
                            </div>
                            <div class="flex-1 min-w-0 text-left">
                                <p :class="[
                                    'font-heading text-sm font-semibold truncate transition-colors',
                                    route.params.id == classroom.id ? 'text-safety-teal-700 dark:text-safety-teal-300' : 'text-platinum-600 dark:text-platinum-400 group-hover:text-safety-teal-600'
                                ]">
                                    {{ classroom.name }}
                                </p>
                                <p class="text-[10px] text-platinum-400 dark:text-platinum-500 truncate">
                                    {{ classroom.instructor }}
                                </p>
                            </div>
                        </div>
                    </button>
                </template>
            </section>
        </nav>

        <!-- Profile Section (Bottom) -->
        <div class="border-t border-platinum-100 dark:border-abyss-800">
            <!-- Full mode: profile card with clickable menu -->
            <template v-if="isFull">
                <div class="p-4 bg-platinum-50/50 dark:bg-abyss-950/40 relative">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="w-10 h-10 rounded-full bg-gradient-to-br from-calm-lavender-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-calm-lavender-500/20 flex-shrink-0">
                                {{ getOrgInitials(mine[0]) || 'U' }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-bold text-abyss-900 dark:text-platinum-100 truncate">You</p>
                                <p
                                    class="text-[10px] text-platinum-500 dark:text-platinum-400 uppercase tracking-wider font-semibold">
                                    Authenticated</p>
                            </div>
                        </div>

                        <!-- Menu button -->
                        <button ref="profileTriggerRef" @click="profileMenuOpen = !profileMenuOpen"
                            class="p-1.5 rounded-lg hover:bg-platinum-200/50 dark:hover:bg-abyss-700 transition-colors flex-shrink-0"
                            aria-label="Profile menu">
                            <MoreVertical class="h-4 w-4 stroke-[2] text-platinum-500 dark:text-platinum-400" />
                        </button>
                    </div>
                </div>
            </template>

            <!-- Icon mode: compact profile with menu button -->
            <template v-else>
                <div class="p-3 bg-platinum-50/50 dark:bg-abyss-950/40 relative flex justify-center">
                    <div class="relative">
                        <button ref="profileTriggerRef" @click="profileMenuOpen = !profileMenuOpen"
                            class="flex justify-center p-2 rounded-lg hover:bg-platinum-100 dark:hover:bg-abyss-800 transition-colors"
                            aria-label="Profile menu">
                            <div
                                class="w-8 h-8 rounded-full bg-gradient-to-br from-calm-lavender-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-calm-lavender-500/20 hover:shadow-xl hover:scale-110 transition-all">
                                {{ getOrgInitials(mine[0]) || 'U' }}
                            </div>
                        </button>
                    </div>
                </div>
            </template>

            <!-- Dropdown menu -->
            <transition name="fade">
                <div v-if="profileMenuOpen" ref="profileDropdownRef"
                    class="fixed z-50 w-48 bg-white dark:bg-abyss-800 rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">
                    <button @click="goProfile(); profileMenuOpen = false"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors border-b border-platinum-100 dark:border-abyss-700 group">
                        <User
                            class="h-4 w-4 stroke-[1.75] text-platinum-500 group-hover:text-calm-lavender-600 transition-colors" />
                        <span
                            class="font-medium text-abyss-900 dark:text-platinum-100 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">My
                            Profile</span>
                    </button>
                    <button @click="goSettings(); profileMenuOpen = false"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors border-b border-platinum-100 dark:border-abyss-700 group">
                        <Settings
                            class="h-4 w-4 stroke-[1.75] text-platinum-500 group-hover:text-advocacy-purple-600 transition-colors" />
                        <span
                            class="font-medium text-abyss-900 dark:text-platinum-100 group-hover:text-advocacy-purple-600 dark:group-hover:text-advocacy-purple-400 transition-colors">Account
                            Settings</span>
                    </button>
                    <button @click="logout(); profileMenuOpen = false"
                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group">
                        <LogOut class="h-4 w-4 stroke-[1.75] text-red-500 group-hover:text-red-600 transition-colors" />
                        <span
                            class="font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 transition-colors">Logout</span>
                    </button>
                </div>
            </transition>
        </div>
    </aside>
</template>

<style scoped>
@reference "@/style.css";

.sidebar-btn {
    @apply w-full rounded-xl transition-all duration-300 px-1 py-1 text-left hover:bg-platinum-50 dark:hover:bg-abyss-800/50;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

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