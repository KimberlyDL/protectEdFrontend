<!-- frontend\src\components\nav\home_sidebar.vue -->
<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/api'
import {
    ClipboardList,
    UserPlus,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    SquareArrowUpRight,
    Share2,
    ShieldCheck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

/** Props:
 * - isMobileOpen: toggles off-canvas on small screens
 * - userId: optional current user id
 */
const props = defineProps({
    isMobileOpen: { type: Boolean, default: false },
    userId: { type: [String, Number, null], default: null },
})
const emit = defineEmits(['close-mobile-sidebar', 'expanded-change'])

/* ------- responsive + mode ------- */
const expanded = ref(false)
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

watchEffect(() => emit('expanded-change', isFull.value))

/* ------- learning modules data ------- */
const modules = ref([
    { id: 1, name: 'Gender & Power', icon: '👥', progress: 65, status: 'in-progress' },
    { id: 2, name: 'Recognizing VAWC', icon: '🚨', progress: 100, status: 'completed' },
    { id: 3, name: 'Sexual Health 101', icon: '💚', progress: 40, status: 'in-progress' },
    { id: 4, name: 'Support Resources', icon: '🤝', progress: 0, status: 'not-started' },
])

const myLearningPaths = ref([
    { id: 1, name: 'VAWC Prevention', progress: 65, modules: 4 },
    { id: 2, name: 'Sexual Health', progress: 40, modules: 5 },
    { id: 3, name: 'GAD Management', progress: 25, modules: 6 },
])

/* ------- helpers ------- */
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
    router.push({ name: 'settings' })
}

function goManageBadges() {
    router.push({ name: 'user.managebadges' })
}
/* ------- organizations data ------- */
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

/* ------- logo helpers (same behavior as OrgDetail) ------- */
const R2_WORKER_ENDPOINT = import.meta.env.VITE_R2_WORKER_ENDPOINT || ''

function getOrgLogoUrl(org) {
    if (!org || !org.logo) return ''

    const path = org.logo
    if (typeof path !== 'string') return ''

    // Already full URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    // Use R2 worker endpoint if configured
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
    // If user has a current org, show shared docs for that org
    if (currentId.value) {
        router.push({
            name: 'org.shared-documents',
            params: { id: currentId.value }
        })
    } else {
        // [FIXED] Go to the new dedicated route instead of query param
        router.push({ name: 'home.shared-documents' })
    }
}

/* ------- helpers ------- */
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

if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => (width.value = window.innerWidth))
}

onMounted(() => {
    loadMine()
    loadAll()
    loadReqs()
})
</script>

<template>
    <Transition 
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200" 
        enter-from-class="opacity-0" 
        leave-to-class="opacity-0"
    >
        <div v-if="isMobileShown" 
             class="fixed inset-0 z-40 md:hidden bg-abyss-950/60 backdrop-blur-sm"
             @click="$emit('close-mobile-sidebar')" 
        />
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
                <span v-if="isFull" class="text-[10px] font-black uppercase tracking-[0.2em] text-platinum-400">Navigation</span>
                <button @click="expanded = !expanded"
                    class="p-1.5 rounded-lg bg-platinum-50 dark:bg-abyss-800 hover:scale-110 transition-all border border-transparent hover:border-kaitoke-green-500/50"
                    :aria-label="isFull ? 'Collapse sidebar' : 'Expand sidebar'">
                    <ChevronLeft v-if="isFull" class="h-4 w-4 text-kaitoke-green-600" />
                    <ChevronRight v-else class="h-4 w-4 text-kaitoke-green-600" />
                </button>
            </div>

            <nav class="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                
                <section class="space-y-2">
                    <div v-if="isFull || isMobileShown"
                        class="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-kaitoke-green-600 dark:text-kaitoke-green-400 opacity-70">
                        Active Modules
                    </div>
                    
                    <div class="space-y-1">
                        <button v-for="module in modules" :key="'module-' + module.id" @click="goModule(module.id)"
                            :title="module.name" :class="[
                                'group w-full rounded-xl transition-all duration-300 px-3 py-2.5 relative overflow-hidden',
                                'hover:bg-kaitoke-green-50/50 dark:hover:bg-kaitoke-green-900/10',
                                route.params.id == module.id
                                    ? 'bg-kaitoke-green-50 dark:bg-kaitoke-green-900/20 shadow-sm'
                                    : 'transparent'
                            ]">
                            <div v-if="route.params.id == module.id" 
                                 class="absolute left-0 top-2 bottom-2 w-1 bg-kaitoke-green-500 rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                            </div>

                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-between']">
                                <div class="flex items-center gap-3 min-w-0">
                                    <span class="text-xl group-hover:scale-125 transition-transform duration-300">{{ module.icon }}</span>
                                    <span v-if="!isIcon" :class="[
                                        'truncate font-heading text-sm tracking-wide transition-colors',
                                        route.params.id == module.id ? 'font-bold text-kaitoke-green-700 dark:text-kaitoke-green-300' : 'font-medium'
                                    ]">
                                        {{ module.name }}
                                    </span>
                                </div>
                                <div v-if="!isIcon && module.progress > 0" class="flex flex-col items-end">
                                    <span class="text-[10px] font-black text-kaitoke-green-600/70">{{ module.progress }}%</span>
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
                            <p class="text-xs font-bold text-abyss-800 dark:text-platinum-200 truncate mb-1.5 group-hover:text-kaitoke-green-500 transition-colors">
                                {{ path.name }}
                            </p>
                            <div class="relative h-1 w-full bg-platinum-100 dark:bg-abyss-800 rounded-full overflow-hidden">
                                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-kaitoke-green-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                    :style="{ width: path.progress + '%' }"></div>
                            </div>
                        </button>
                    </div>
                    <div v-else class="flex flex-col items-center gap-4">
                        <div v-for="path in myLearningPaths" :key="'p-icon-'+path.id" 
                             class="w-2 h-2 rounded-full bg-kaitoke-green-500/40 border border-kaitoke-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    </div>
                </section>

                <section class="pt-4 border-t border-platinum-100 dark:border-abyss-800">
                    <div class="space-y-1">
                        <button @click="goLeaderboard()" class="sidebar-btn group">
                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                                <div class="p-2 rounded-lg group-hover:bg-vawc-orange-100 dark:group-hover:bg-vawc-orange-900/20 transition-colors">
                                    <span class="text-lg">🏆</span>
                                </div>
                                <span v-if="!isIcon" class="font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform">Leaderboard</span>
                            </div>
                        </button>

<button @click="goManageBadges()" 
                :class="['sidebar-btn group', route.name === 'user.managebadges' ? 'bg-kaitoke-green-50 dark:bg-kaitoke-green-900/20' : '']">
            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                <div class="p-2 rounded-lg group-hover:bg-kaitoke-green-100 dark:group-hover:bg-kaitoke-green-900/30 transition-colors">
                    <ShieldCheck :class="[
                        'h-5 w-5 transition-colors',
                        route.name === 'user.managebadges' ? 'text-kaitoke-green-600' : 'text-platinum-500 group-hover:text-kaitoke-green-600'
                    ]" />
                </div>
                <span v-if="!isIcon" 
                      :class="[
                          'font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform',
                          route.name === 'user.managebadges' ? 'text-kaitoke-green-700 dark:text-kaitoke-green-300' : 'text-platinum-600 dark:text-platinum-400'
                      ]">
                    Manage Badges
                </span>
            </div>
        </button>

                        <button @click="goSettings()" class="sidebar-btn group">
                            <div :class="['flex items-center gap-3', isIcon ? 'justify-center' : 'justify-start']">
                                <div class="p-2 rounded-lg group-hover:bg-platinum-100 dark:group-hover:bg-abyss-800 transition-colors">
                                    <span class="text-lg text-platinum-500">⚙️</span>
                                </div>
                                <span v-if="!isIcon" class="font-heading text-sm font-semibold group-hover:translate-x-1 transition-transform text-platinum-600 dark:text-platinum-400">Settings</span>
                            </div>
                        </button>
                    </div>
                </section>
            </nav>

            <div v-if="isFull" class="p-4 bg-platinum-50/50 dark:bg-abyss-950/40 mt-auto border-t border-platinum-100 dark:border-abyss-800">
                 <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-full bg-kaitoke-green-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-kaitoke-green-500/20">
                         {{ getOrgInitials(mine[0]) || 'U' }}
                     </div>
                     <div class="flex-1 min-w-0">
                         <p class="text-[10px] font-black uppercase tracking-tighter text-abyss-900 dark:text-platinum-100 truncate">System Access</p>
                         <p class="text-[9px] text-platinum-500 uppercase tracking-widest font-bold">Authenticated</p>
                     </div>
                 </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>

@reference "@/style.css";
.sidebar-btn {
    @apply w-full rounded-xl transition-all duration-300 px-1 py-1 text-left hover:bg-platinum-50 dark:hover:bg-abyss-800/50;
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

/* Add a subtle scanline effect in dark mode for that 'futuristic' feel */
.dark aside::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        transparent 50%,
        rgba(255, 255, 255, 0.02) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.3;
}
</style>
