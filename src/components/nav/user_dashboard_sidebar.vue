<script setup>
import { ref, computed, onMounted, watchEffect, watch, nextTick } from 'vue'
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import {
    ClipboardList,
    UserPlus,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    SquareArrowUpRight,
    Share2,
    ShieldCheck,
    BookOpen,
    LogOut,
    User,
    Users2,
    AlertCircle,
    Heart,
    Handshake,
    Trophy,
    MoreVertical
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const props = defineProps({
    isMobileOpen: { type: Boolean, default: false },
    userId: { type: [String, Number, null], default: null },
    orgId: { type: [String, Number, null], default: null },
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



const modules = ref([
    { id: 1, name: 'Gender & Power', icon: 'users2', color: 'text-advocacy-purple-600', progress: 65, status: 'in-progress' },
    { id: 2, name: 'Recognizing VAWC', icon: 'alertCircle', color: 'text-red-500', progress: 100, status: 'completed' },
    { id: 3, name: 'Sexual Health 101', icon: 'heart', color: 'text-rose-500', progress: 40, status: 'in-progress' },
    { id: 4, name: 'Support Resources', icon: 'handshake', color: 'text-emerald-600', progress: 0, status: 'not-started' },
])

const myLearningPaths = ref([
    { id: 1, name: 'VAWC Prevention', progress: 65, modules: 4 },
    { id: 2, name: 'Sexual Health', progress: 40, modules: 5 },
    { id: 3, name: 'GAD Management', progress: 25, modules: 6 },
])

function goModule(moduleId) {
    router.push({ name: 'module', params: { id: moduleId } })
}

function goPath(pathId) {
    router.push({ name: 'learning-path', params: { id: pathId } })
}

function goLeaderboard() {
    router.push({ name: 'leaderboard' })
}

function goSettings() {
    router.push({ name: 'user.settings' })
}

function goManageBadges() {
    router.push({ name: 'user.managebadges' })
}

function goModules() {
    router.push({ name: 'user.modules' })
}

function goProfile() {
    router.push({ name: 'user.profile' })
}

function goStats() {
    router.push({ name: 'user.stats' })
}

async function logout() {
    try {
        await auth.logout()
    } finally {
        router.push({ name: 'login' })
    }
}

const mine = ref([])
const all = ref([])
const reqs = ref([])
const loading = ref({ mine: false, all: false, req: false })

async function loadMine() {
    loading.value.mine = true
    try {
        const { data } = await axios.get('/api/organizations/my')
        mine.value = data || []
    } finally {
        loading.value.mine = false
    }
}

async function loadAll() {
    loading.value.all = true
    try {
        const { data } = await axios.get('/api/organizations', { params: { scope: 'others' } })
        all.value = data || []
    } finally {
        loading.value.all = false
    }
}

async function loadReqs() {
    loading.value.req = true
    try {
        const { data } = await axios.get('/api/organizations/my-requests')
        reqs.value = data || []

        console.log('Loaded my requests:', reqs.value);
    } finally {
        loading.value.req = false
    }
}

const R2_WORKER_ENDPOINT = import.meta.env.VITE_R2_WORKER_ENDPOINT || ''

function getOrgLogoUrl(org) {
    if (!org || !org.logo) return ''

    const path = org.logo
    if (typeof path !== 'string') return ''

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    if (!R2_WORKER_ENDPOINT) return ''

    const cleanEndpoint = R2_WORKER_ENDPOINT.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    return `${cleanEndpoint}/${cleanPath}`
}

function getOrgInitials(org) {
    const name = org?.name || ''
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '?'

    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    return (first + second).toUpperCase()
}

function goSharedDocuments() {
    if (currentId.value) {
        router.push({
            name: 'org.shared-documents',
            params: { id: currentId.value }
        })
    } else {
        router.push({ name: 'home.shared-documents' })
    }
}

const currentId = computed(() => props.orgId ?? route.params.id ?? null)

function goOrg(id) {
    router.push({ name: 'orgs.org', params: { id } })
}

function goManage(id) {
    router.push({ name: 'org.overview', params: { id } })
}

function goMyRequests() {
    router.push({ name: 'orgs.requests' })
}

const windowExists = typeof window !== 'undefined'

const handleResize = () => {
    width.value = window.innerWidth
}

if (windowExists) {
    window.addEventListener('resize', handleResize)

    window.addEventListener('resize', reposition)
}

onMounted(() => {
    if (windowExists) {
        loadMine()
        loadAll()
        loadReqs()
    }

    window.removeEventListener('resize', reposition)
})

watchEffect(() => emit('expanded-change', isFull.value))
</script>

<template>
    <Transition enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="isMobileShown" class="fixed inset-0 z-40 md:hidden bg-abyss-950/60 backdrop-blur-sm"
            @click="$emit('close-mobile-sidebar')" />
    </Transition>

    <aside :class="[
        'fixed top-16 left-0 bottom-0 z-40',
        'bg-white/80 backdrop-blur-md text-abyss-900 border-r border-platinum-200',
        'dark:bg-abyss-900/90 dark:backdrop-blur-xl dark:text-platinum-300 dark:border-abyss-800',
        'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
        isHidden && 'hidden md:block',
        isIcon && 'w-20 md:block',
        isFull && 'w-64 md:block',
        isMobileShown && 'w-72 md:hidden shadow-2xl'
    ]">
        <div class="h-full flex flex-col">
            <div v-if="!isMobileShown"
                class="hidden md:flex items-center justify-between px-4 py-3 border-b border-platinum-100 dark:border-abyss-800">
                <span v-if="isFull"
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-platinum-400">Navigation</span>
                <button @click="expanded = !expanded"
                    class="p-1.5 rounded-lg bg-platinum-50 dark:bg-abyss-800 hover:scale-110 transition-all border border-transparent hover:border-calm-lavender-500/50"
                    :aria-label="isFull ? 'Collapse sidebar' : 'Expand sidebar'">
                    <ChevronLeft v-if="isFull" class="h-4 w-4 text-calm-lavender-600" />
                    <ChevronRight v-else class="h-4 w-4 text-calm-lavender-600" />
                </button>
            </div>

            <nav class="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">

                <section class="space-y-2">
                    <div v-if="isFull || isMobileShown"
                        class="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-calm-lavender-600 dark:text-calm-lavender-400 opacity-70">
                        Active Modules
                    </div>

                    <div class="space-y-1">
                        <button v-for="module in modules" :key="'module-' + module.id" @click="goModule(module.id)"
                            :title="module.name" :class="[
                                'group w-full rounded-xl transition-all duration-300 px-3 py-2.5 relative overflow-hidden',
                                'hover:bg-calm-lavender-50/50 dark:hover:bg-calm-lavender-900/10',
                                route.params.id == module.id
                                    ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20 shadow-sm'
                                    : 'transparent'
                            ]">
                            <div v-if="route.params.id == module.id"
                                class="absolute left-0 top-2 bottom-2 w-1 bg-calm-lavender-500 rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                            </div>

                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-between']">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div class="p-2 rounded-lg group-hover:bg-opacity-80 transition-all duration-300 group-hover:scale-110"
                                        :class="[
                                            module.icon === 'users2' ? 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/20' :
                                                module.icon === 'alertCircle' ? 'bg-red-100 dark:bg-red-900/20' :
                                                    module.icon === 'heart' ? 'bg-rose-100 dark:bg-rose-900/20' :
                                                        'bg-emerald-100 dark:bg-emerald-900/20'
                                        ]">
                                        <Users2 v-if="module.icon === 'users2'"
                                            :class="['h-5 w-5 stroke-[1.75]', module.color]" />
                                        <AlertCircle v-else-if="module.icon === 'alertCircle'"
                                            :class="['h-5 w-5 stroke-[1.75]', module.color]" />
                                        <Heart v-else-if="module.icon === 'heart'"
                                            :class="['h-5 w-5 stroke-[1.75]', module.color]" />
                                        <Handshake v-else-if="module.icon === 'handshake'"
                                            :class="['h-5 w-5 stroke-[1.75]', module.color]" />
                                    </div>
                                    <span v-if="!isIcon" :class="[
                                        'truncate font-heading text-sm tracking-wide transition-colors',
                                        route.params.id == module.id ? 'font-bold text-calm-lavender-700 dark:text-calm-lavender-300' : 'font-medium'
                                    ]">
                                        {{ module.name }}
                                    </span>
                                </div>
                                <div v-if="!isIcon && module.progress > 0" class="flex flex-col items-end">
                                    <span class="text-[10px] font-black text-calm-lavender-600/70">{{ module.progress
                                    }}%</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <section class="space-y-4">
                    <div v-if="isFull || isMobileShown"
                        class="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-advocacy-purple-500 dark:text-advocacy-purple-400 opacity-70">
                        Your Journeys
                    </div>

                    <div v-if="!isIcon" class="space-y-3 px-1">
                        <button v-for="path in myLearningPaths" :key="'path-' + path.id" @click="goPath(path.id)"
                            class="w-full text-left group">
                            <p
                                class="text-xs font-bold text-abyss-800 dark:text-platinum-200 truncate mb-1.5 group-hover:text-calm-lavender-500 transition-colors">
                                {{ path.name }}
                            </p>
                            <div
                                class="relative h-1 w-full bg-platinum-100 dark:bg-abyss-800 rounded-full overflow-hidden">
                                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-calm-lavender-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                    :style="{ width: path.progress + '%' }"></div>
                            </div>
                        </button>
                    </div>
                    <div v-else class="flex flex-col items-center gap-4">
                        <div v-for="path in myLearningPaths" :key="'p-icon-' + path.id"
                            class="w-2 h-2 rounded-full bg-calm-lavender-500/40 border border-calm-lavender-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                        </div>
                    </div>
                </section>

                <section class="pt-4 border-t border-platinum-100 dark:border-abyss-800">
                    <div class="space-y-1">
                        <button @click="goModules()"
                            :class="['sidebar-btn group', route.name === 'user.modules' ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20' : '']">
                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                                <div
                                    class="p-2 rounded-lg group-hover:bg-advocacy-purple-100 dark:group-hover:bg-advocacy-purple-900/20 transition-colors">
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
                                    <svg :class="[
                                        'h-5 w-5 stroke-[1.75] transition-colors',
                                        route.name === 'user.stats' ? 'text-calm-lavender-600' : 'text-platinum-500 group-hover:text-calm-lavender-600'
                                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span v-if="!isIcon" :class="[
                                    'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                                    route.name === 'user.stats' ? 'text-calm-lavender-700 dark:text-calm-lavender-300' : 'text-platinum-600 dark:text-platinum-400'
                                ]">My Stats</span>
                            </div>
                        </button>

                        <button @click="goManageBadges()"
                            :class="['sidebar-btn group', route.name === 'user.managebadges' ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20' : '']">
                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                                <div
                                    class="p-2 rounded-lg group-hover:bg-calm-lavender-100 dark:group-hover:bg-calm-lavender-900/30 transition-colors">
                                    <ShieldCheck :class="[
                                        'h-5 w-5 stroke-[1.75] transition-colors',
                                        route.name === 'user.managebadges' ? 'text-calm-lavender-600' : 'text-platinum-500 group-hover:text-calm-lavender-600'
                                    ]" />
                                </div>
                                <span v-if="!isIcon" :class="[
                                    'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                                    route.name === 'user.managebadges' ? 'text-calm-lavender-700 dark:text-calm-lavender-300' : 'text-platinum-600 dark:text-platinum-400'
                                ]">Manage Badges</span>
                            </div>
                        </button>
                    </div>
                </section>
            </nav>

            <!-- Profile Section (Bottom) - Visible in both icon and full mode on desktop -->
            <div class="hidden md:flex flex-col mt-auto border-t border-platinum-100 dark:border-abyss-800">
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

                            <!-- Dropdown menu positioned to the right -->
                            <!-- <transition name="fade">
                                <div v-if="profileMenuOpen"
                                    class="absolute top-0 left-full ml-2 w-48 bg-white dark:bg-abyss-800 rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10 z-50 overflow-hidden">
                                    <button @click="goProfile(); profileMenuOpen = false"
                                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors border-b border-platinum-100 dark:border-abyss-700 group">
                                        <User
                                            class="h-4 w-4 stroke-[1.75] text-platinum-500 group-hover:text-calm-lavender-600 transition-colors flex-shrink-0" />
                                        <span
                                            class="font-medium text-abyss-900 dark:text-platinum-100 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">Profile</span>
                                    </button>
                                    <button @click="goSettings(); profileMenuOpen = false"
                                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors border-b border-platinum-100 dark:border-abyss-700 group">
                                        <Settings
                                            class="h-4 w-4 stroke-[1.75] text-platinum-500 group-hover:text-advocacy-purple-600 transition-colors flex-shrink-0" />
                                        <span
                                            class="font-medium text-abyss-900 dark:text-platinum-100 group-hover:text-advocacy-purple-600 dark:group-hover:text-advocacy-purple-400 transition-colors">Settings</span>
                                    </button>
                                    <button @click="logout(); profileMenuOpen = false"
                                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group">
                                        <LogOut
                                            class="h-4 w-4 stroke-[1.75] text-red-500 group-hover:text-red-600 transition-colors flex-shrink-0" />
                                        <span
                                            class="font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 transition-colors">Logout</span>
                                    </button>
                                </div>
                            </transition> -->
                        </div>
                    </div>
                </template>

                <!-- Dropdown menu -->
                <transition name="fade">
                    <div v-if="profileMenuOpen" ref="profileDropdownRef"
                        class="fixed z-50 w-48 bg-white dark:bg-abyss-800 rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10 z-50 overflow-hidden">
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
                            <LogOut
                                class="h-4 w-4 stroke-[1.75] text-red-500 group-hover:text-red-600 transition-colors" />
                            <span
                                class="font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 transition-colors">Logout</span>
                        </button>
                    </div>
                </transition>

            </div>
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

.dark aside::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
            transparent 50%,
            rgba(255, 255, 255, 0.02) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.3;
}
</style>