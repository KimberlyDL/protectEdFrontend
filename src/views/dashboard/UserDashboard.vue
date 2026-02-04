<template>
    <div class="p-4 md:p-6 space-y-6 bg-platinum-50 dark:bg-abyss-900 min-h-screen transition-colors duration-300">
        <div class="max-w-[1600px] mx-auto grid lg:grid-cols-3 gap-6 items-start">

            <div class="lg:col-span-2 space-y-6">

                <div
                    class="relative overflow-hidden bg-white dark:bg-abyss-800 rounded-xl p-6 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-safety-teal-500"></div>
                    <div class="flex items-center gap-5 pl-2">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-safety-teal-50 dark:bg-safety-teal-900/30 rounded-full flex items-center justify-center text-2xl shadow-sm">
                            📢
                        </div>
                        <div>
                            <h4 class="font-bold text-lg text-abyss-900 dark:text-platinum-50 font-heading">
                                Latest News & Updates
                            </h4>
                            <p class="text-platinum-600 dark:text-platinum-400 text-sm leading-relaxed">
                                New interactive modules and games are arriving soon. <span
                                    class="text-safety-teal-600 dark:text-safety-teal-400 font-bold">Stay tuned for the
                                    February update!</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl p-6 border border-platinum-200 dark:border-abyss-700 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 mb-4 font-heading">
                                Continue Learning</h2>
                            <div class="space-y-4">
                                <div
                                    class="p-4 rounded-lg bg-platinum-50 dark:bg-abyss-700/30 border border-platinum-100 dark:border-abyss-600">
                                    <div class="flex justify-between items-center mb-2">
                                        <h3
                                            class="font-bold text-advocacy-purple-500 dark:text-advocacy-purple-400 text-sm truncate pr-2">
                                            {{ currentModule.title }}</h3>
                                        <span class="text-sm font-bold text-platinum-600 dark:text-platinum-400">{{
                                            currentModule.progress }}%</span>
                                    </div>
                                    <div
                                        class="w-full h-2.5 bg-platinum-200 dark:bg-abyss-600 rounded-full overflow-hidden">
                                        <div class="h-full bg-advocacy-purple-950 transition-all duration-700"
                                            :style="{ width: currentModule.progress + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            class="w-full mt-6 py-3 bg-advocacy-purple-600 text-white text-sm font-bold rounded-lg hover:bg-advocacy-purple-700 transition shadow-md">
                            Resume Module →
                        </button>
                    </div>

                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl p-6 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 font-heading">Games</h2>
                            <button @click="showAllGames = !showAllGames"
                                class="text-xs font-bold text-safety-teal-600 dark:text-safety-teal-400 hover:underline transition-all">
                                {{ showAllGames ? 'Show Less' : 'See More' }}
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-3 transition-all duration-300"
                            :class="showAllGames ? 'max-h-[400px] overflow-y-auto pr-1 custom-scrollbar' : 'max-h-[170px] overflow-hidden'">
                            <div v-for="game in (showAllGames ? games : games.slice(0, 4))" :key="game.name"
                                class="bg-platinum-50 dark:bg-abyss-700/50 p-4 rounded-xl text-center cursor-pointer border border-transparent hover:border-vawc-orange-200 transition group">
                                <span class="text-2xl block mb-1 group-hover:scale-110 transition-transform">{{
                                    game.icon }}</span>
                                <p
                                    class="text-xs font-bold text-vawc-orange-700 dark:text-vawc-orange-500 uppercase tracking-tight">
                                    {{ game.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">Explore Library
                        </h2>
                        <button
                            class="text-advocacy-purple-600 dark:text-advocacy-purple-400 text-sm font-bold hover:underline">View
                            All</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div v-for="mod in otherModules" :key="mod.id"
                            class="group bg-platinum-50 dark:bg-abyss-700/50 p-5 rounded-xl border border-platinum-100 dark:border-abyss-600 hover:border-advocacy-purple-300 transition-all">
                            <div class="text-3xl mb-3">{{ mod.icon }}</div>
                            <h3 class="font-bold text-sm text-abyss-900 dark:text-platinum-50 mb-1 leading-tight">{{
                                mod.name }}</h3>
                            <p class="text-xs text-platinum-500 dark:text-platinum-400 line-clamp-2 mb-4 h-8">{{
                                mod.desc }}</p>
                            <button
                                class="text-xs font-bold text-advocacy-purple-600 dark:text-advocacy-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                Start Exploring →
                            </button>
                        </div>
                    </div>
                </div>



                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">Your Learning
                            Paths</h2>
                        <router-link to="#"
                            class="text-safety-teal-600 dark:text-safety-teal-400 text-sm font-bold hover:underline">View
                            All →</router-link>
                    </div>
                    <div class="space-y-6">
                        <div v-for="path in learningPaths" :key="path.id" class="space-y-2">
                            <div class="flex justify-between items-center">
                                <h3 class="font-bold text-abyss-900 dark:text-platinum-100 text-sm">{{ path.name }}</h3>
                                <span class="text-xs font-bold text-platinum-600 dark:text-platinum-400">{{
                                    path.progress }}%</span>
                            </div>
                            <div
                                class="w-full h-2.5 bg-platinum-100 dark:bg-abyss-700 rounded-full overflow-hidden shadow-inner">
                                <div class="h-full bg-safety-teal-900 rounded-full transition-all duration-1000"
                                    :style="{ width: path.progress + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">Quick Resources
                        </h2>
                        <button @click="showAllResources = !showAllResources"
                            class="text-xs font-bold text-safety-teal-600 hover:underline">
                            {{ showAllResources ? 'Show Less' : 'See More' }}
                        </button>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-300"
                        :class="showAllResources ? 'max-h-[600px]' : 'max-h-[120px]'">
                        <div v-for="res in (showAllResources ? quickResources : quickResources.slice(0, 4))"
                            :key="res.name"
                            class="flex flex-col items-center p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-xl border border-platinum-100 dark:border-abyss-600 hover:border-safety-teal-300 transition-colors cursor-pointer group text-center">
                            <span class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ res.icon }}</span>
                            <span class="text-xs font-bold text-abyss-700 dark:text-platinum-300">{{ res.name }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6 lg:sticky lg:top-6">

                <div
                    class="bg-white dark:bg-abyss-800 rounded-2xl border border-platinum-200 dark:border-abyss-700 shadow-lg overflow-hidden">
                    <div
                        class="bg-gradient-to-br from-advocacy-purple-700 to-advocacy-purple-500 p-8 text-white text-center">
                        <h1 class="text-2xl font-bold font-heading mb-1">Hi, {{ userFirstName }}! 👋</h1>
                    </div>

                    <div class="p-8 text-center bg-white dark:bg-abyss-800">
                        <div class="mb-6">
                            <p
                                class="text-xs text-platinum-500 dark:text-platinum-400 mb-1 font-bold uppercase tracking-widest">
                                Lifetime Experience</p>
                            <div class="flex items-baseline justify-center gap-1">
                                <span class="text-5xl font-black text-vawc-orange-600 tracking-tighter">{{
                                    stats.totalPoints.toLocaleString() }}</span>
                                <span class="text-sm font-bold text-platinum-400">XP</span>
                            </div>
                        </div>

                        <div
                            class="flex justify-between items-center p-4 bg-platinum-50 dark:bg-abyss-900/50 rounded-xl border border-platinum-100 dark:border-abyss-700">
                            <div class="text-center flex-1">
                                <p class="text-[10px] text-platinum-400 uppercase font-black mb-1">Modules</p>
                                <p class="text-lg font-bold text-safety-teal-450 dark:text-platinum-500">{{
                                    stats.modulesCompleted }}</p>
                            </div>
                            <div class="w-px h-8 bg-platinum-200 dark:bg-abyss-700"></div>
                            <div class="text-center flex-1">
                                <p class="text-[10px] text-platinum-400 uppercase font-black mb-1">Badges</p>
                                <p class="text-lg font-bold text-safety-teal-450 dark:text-platinum-500">{{ badgesEarnedCount
                                    }}</p>
                            </div>
                            <div class="w-px h-8 bg-platinum-200 dark:bg-abyss-700"></div>
                            <div class="text-center flex-1">
                                <p class="text-[10px] text-platinum-400 uppercase font-black mb-1">Global Rank</p>
                                <p class="text-lg font-bold text-safety-teal-450 dark:text-platinum-500">#{{ userRank }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl border border-platinum-200 dark:border-abyss-700 shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 font-heading">Achievements
                        </h3>
                        <button @click="showAllBadges = !showAllBadges"
                            class="text-xs font-bold text-advocacy-purple-600 dark:text-advocacy-purple-400 hover:underline">
                            {{ showAllBadges ? 'Less' : 'View All' }}
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-4 transition-all duration-300 overflow-hidden"
                        :class="showAllBadges ? 'max-h-[500px]' : 'max-h-[85px]'">
                        <div v-for="badge in (showAllBadges ? badges : badges.slice(0, 3))" :key="badge.id"
                            class="flex flex-col items-center gap-1 w-[68px]">
                            <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl border border-platinum-100 dark:border-abyss-600 bg-platinum-50 dark:bg-abyss-700 shadow-sm hover:rotate-12 transition-transform"
                                :title="badge.name">
                                {{ badge.emoji }}
                            </div>
                            <span
                                class="text-[11px] text-center font-bold text-platinum-500 dark:text-platinum-400 truncate w-full">{{
                                badge.name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl border border-platinum-200 dark:border-abyss-700 shadow-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 font-heading">Leaderboard</h3>
                        <span class="text-xs font-bold text-platinum-400 uppercase tracking-widest">Top
                            Performers</span>
                    </div>
                    <div class="space-y-3">
                        <div v-for="(player, index) in leaderboard" :key="player.id"
                            class="flex items-center justify-between p-3 rounded-lg transition-colors"
                            :class="player.name === 'You' ? 'bg-safety-teal-50 dark:bg-safety-teal-900/20 border border-safety-teal-100 dark:border-safety-teal-800' : 'bg-platinum-50 dark:bg-abyss-700/30'">
                            <div class="flex items-center gap-3">
                                <span class="text-sm font-black w-5"
                                    :class="index === 0 ? 'text-vawc-orange-500' : 'text-platinum-400'">
                                    {{ index + 1 }}
                                </span>
                                <div
                                    class="w-8 h-8 rounded-full bg-platinum-200 dark:bg-abyss-600 flex items-center justify-center text-xs">
                                    {{ player.icon }}
                                </div>
                                <span class="text-sm font-bold text-abyss-800 dark:text-platinum-100">{{ player.name
                                    }}</span>
                            </div>
                            <span class="text-xs font-black text-vawc-orange-600 dark:text-vawc-orange-400">{{
                                player.points }} XP</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-abyss-800 rounded-xl p-6 border border-platinum-200 dark:border-abyss-700 shadow-sm">
                    <h2 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 mb-4 font-heading">Activity Log
                    </h2>
                    <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <div v-for="activity in recentActivities" :key="activity.id"
                            class="flex items-center gap-4 pb-4 border-b border-platinum-50 dark:border-abyss-700 last:border-0 last:pb-0">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                :class="activity.iconBg">
                                <span class="text-lg">{{ activity.type === 'quiz' ? '📝' : '🏆' }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-bold text-sm text-abyss-900 dark:text-platinum-50 truncate">{{
                                    activity.title }}</p>
                                <p class="text-xs text-platinum-500 dark:text-platinum-400 truncate">{{ activity.time }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// UI States
const showAllGames = ref(false)
const showAllBadges = ref(false)
const showAllResources = ref(false)

// User Data
// User Data
const currentUser = ref({ firstName: 'Alex' })
const userFirstName = computed(() => currentUser.value.firstName)


// Content Data
const badges = ref([
    { id: 1, name: 'Quick Start', emoji: '🚀' },
    { id: 2, name: 'Committed', emoji: '💪' },
    { id: 3, name: 'Scholar', emoji: '📚' },
    { id: 4, name: 'Advocate', emoji: '🗣️' },
    { id: 5, name: 'Guardian', emoji: '🛡️' }
])

// Dynamic Badge Count based on the array length
const badgesEarnedCount = computed(() => badges.value.length)

const stats = ref({
    totalPoints: 2450,
    modulesCompleted: 8,
})
// 1. Updated Leaderboard Data
// 1. Raw Data (Unsorted)
const players = ref([
    { id: 101, name: 'Elena R.', points: 3120, icon: '🌟' },
    { id: 1, name: 'You', points: 2450, icon: '👤' },
    { id: 102, name: 'Marcus K.', points: 2100, icon: '🛡️' },
    { id: 103, name: 'Sarah J.', points: 2900, icon: '🌿' } // Example: Increased Sarah's points
])

// 2. Computed Leaderboard (Automatically sorts by points descending)
const leaderboard = computed(() => {
    return [...players.value].sort((a, b) => b.points - a.points)
})

// 3. Updated User Rank (Finds 'You' in the sorted leaderboard)
const userRank = computed(() => {
    const index = leaderboard.value.findIndex(player => player.name === 'You')
    return index !== -1 ? index + 1 : 0
})
// Content Data
const currentModule = ref({ title: 'Gender Equality & Empowerment', progress: 65 })

const games = ref([
    { name: 'Trivia', icon: '🧩' },
    { name: 'Maze', icon: '🛡️' },
    { name: 'Word Hunt', icon: '🔎' },
    { name: 'Scenario', icon: '🎭' },
    { name: 'Match Up', icon: '🔗' },
    { name: 'Flashcards', icon: '🗂️' }
])

const quickResources = ref([
    { name: 'Hotlines', icon: '📞' },
    { name: 'E-Books', icon: '📖' },
    { name: 'Guidelines', icon: '📋' },
    { name: 'Reports', icon: '📊' },
    { name: 'Templates', icon: '📝' },
    { name: 'Contacts', icon: '👥' }
])

const otherModules = ref([
    { id: 1, name: 'Cyber Safety', icon: '💻', desc: 'Protecting digital identity and online interactions.' },
    { id: 2, name: 'Safe Spaces', icon: '🏙️', desc: 'Understanding your rights in public and private spaces.' },
    { id: 3, name: 'Wellness', icon: '🧠', desc: 'Mental health strategies and building emotional resilience.' }
])

const learningPaths = ref([
    { id: 1, name: 'Gender & Development Essentials', progress: 75 },
    { id: 2, name: 'Sexual Health & Safety', progress: 45 },
    { id: 3, name: 'Journey to Adultery', progress: 89 },
    
])

const recentActivities = ref([
    { id: 1, type: 'quiz', title: 'Quiz: Gender Equality', time: '2h ago', iconBg: 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30' },
    { id: 2, type: 'badge', title: 'Badge: Scholar Earned', time: '1d ago', iconBg: 'bg-vawc-orange-100 dark:bg-vawc-orange-900/30' },
    { id: 3, type: 'quiz', title: 'Intro to Safety', time: '3d ago', iconBg: 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30' },
    { id: 4, type: 'badge', title: 'Badge: Quick Start', time: '1w ago', iconBg: 'bg-vawc-orange-100 dark:bg-vawc-orange-900/30' }
])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>