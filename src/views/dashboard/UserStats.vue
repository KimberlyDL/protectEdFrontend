<template>
    <div class="user-stats-page min-h-screen bg-platinum-50 dark:bg-abyss-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-heading font-bold text-abyss-900 dark:text-platinum-50">
                            My Stats & Progress
                        </h1>
                        <p class="mt-2 text-sm text-platinum-600 dark:text-platinum-400">
                            Track your learning journey and achievements
                        </p>
                    </div>
                    <router-link to="/dashboard"
                        class="px-4 py-2 bg-white dark:bg-abyss-800 border border-platinum-300 dark:border-abyss-600 rounded-lg text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </router-link>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div
                        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-calm-lavender-500 border-t-transparent">
                    </div>
                    <p class="mt-4 text-platinum-600 dark:text-platinum-400">Loading your stats...</p>
                </div>
            </div>

            <!-- Content Grid -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column - Status Card & Leaderboard -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Status Card -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 overflow-hidden">
                        <!-- Gradient Header -->
                        <div
                            class="relative bg-gradient-to-br from-calm-lavender-500 to-emerald-400 p-6 text-abyss-700">
                            <p class="text-sm text-abyss-500 font-bold font-body mb-1">
                                Your Status
                            </p>
                            <h3 class="text-2xl font-black font-heading">
                                Level {{ mockStats.level }}
                            </h3>
                        </div>

                        <!-- Stats Grid -->
                        <div class="p-6">
                            <div class="mb-6">
                                <p
                                    class="text-xs text-platinum-500 dark:text-platinum-400 mb-1 font-bold uppercase tracking-widest text-center">
                                    Lifetime Experience
                                </p>
                                <div class="flex items-baseline justify-center gap-1">
                                    <span class="text-5xl font-black text-vawc-orange-600 tracking-tighter">
                                        {{ mockStats.totalPoints.toLocaleString() }}
                                    </span>
                                    <span class="text-sm font-bold text-platinum-400">XP</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-3 mb-6">
                                <!-- Modules -->
                                <div class="p-4 rounded-xl bg-safety-teal-50 dark:bg-safety-teal-500/20 text-center">
                                    <p
                                        class="text-[10px] uppercase font-black mb-1 text-safety-teal-600 dark:text-safety-teal-400">
                                        Modules
                                    </p>
                                    <p class="text-lg font-bold text-safety-teal-700 dark:text-safety-teal-300">
                                        {{ mockStats.modulesCompleted }}
                                    </p>
                                </div>

                                <!-- Badges -->
                                <div
                                    class="p-4 rounded-xl bg-calm-lavender-50 dark:bg-calm-lavender-500/20 text-center">
                                    <p
                                        class="text-[10px] uppercase font-black mb-1 text-calm-lavender-600 dark:text-calm-lavender-400">
                                        Badges
                                    </p>
                                    <p class="text-lg font-bold text-calm-lavender-700 dark:text-calm-lavender-300">
                                        {{ mockStats.badgesCount }}
                                    </p>
                                </div>

                                <!-- Rank -->
                                <div class="p-4 rounded-xl bg-vawc-orange-50 dark:bg-vawc-orange-500/20 text-center">
                                    <p
                                        class="text-[10px] uppercase font-black mb-1 text-vawc-orange-600 dark:text-vawc-orange-400">
                                        Rank
                                    </p>
                                    <p class="text-lg font-bold text-vawc-orange-700 dark:text-vawc-orange-300">
                                        #{{ mockStats.rank }}
                                    </p>
                                </div>
                            </div>

                            <!-- Level Progress -->
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-semibold text-platinum-600 dark:text-platinum-400">
                                        Level {{ mockStats.level }}
                                    </span>
                                    <span class="text-xs font-semibold text-platinum-600 dark:text-platinum-400">
                                        Level {{ mockStats.level + 1 }}
                                    </span>
                                </div>
                                <div class="w-full h-2 bg-platinum-200 dark:bg-abyss-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-calm-lavender-500 to-emerald-500 transition-all duration-700"
                                        :style="{ width: mockStats.levelProgress + '%' }"></div>
                                </div>
                                <p class="text-xs text-center text-platinum-500 dark:text-platinum-400 mt-2">
                                    {{ mockStats.xpToNextLevel }} XP to next level
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Leaderboard -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                Leaderboard
                            </h2>
                            <router-link to="/leaderboard"
                                class="text-xs font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline">
                                View All →
                            </router-link>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(player, index) in leaderboard.slice(0, 5)" :key="player.id"
                                class="flex items-center gap-3 p-3 rounded-lg transition-all" :class="player.name === 'You'
                                    ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20 border-2 border-calm-lavender-300 dark:border-calm-lavender-700'
                                    : 'bg-platinum-50 dark:bg-abyss-700/30'">
                                <div class="flex-shrink-0 w-8 text-center">
                                    <span v-if="index < 3" class="text-2xl">
                                        {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
                                    </span>
                                    <span v-else class="text-sm font-bold text-platinum-500 dark:text-platinum-400">
                                        #{{ index + 1 }}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-sm text-abyss-900 dark:text-platinum-50 truncate"
                                        :class="player.name === 'You' && 'text-calm-lavender-700 dark:text-calm-lavender-300'">
                                        {{ player.name }}
                                    </p>
                                    <p class="text-xs text-platinum-500 dark:text-platinum-400">
                                        {{ player.points.toLocaleString() }} XP
                                    </p>
                                </div>
                                <div class="text-xl">{{ player.icon }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics Overview -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6 md:p-8">
                        <h2
                            class="text-xl md:text-2xl font-bold text-abyss-900 dark:text-platinum-50 mb-6 font-heading">
                            Statistics Overview
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-calm-lavender-50 dark:bg-calm-lavender-900/20 rounded-lg text-center">
                                <p
                                    class="text-2xl md:text-3xl font-black text-calm-lavender-600 dark:text-calm-lavender-400">
                                    {{ mockStats.streakDays }}
                                </p>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400 mt-1">Day Streak</p>
                            </div>

                            <div class="p-4 bg-safety-teal-50 dark:bg-safety-teal-900/20 rounded-lg text-center">
                                <p
                                    class="text-2xl md:text-3xl font-black text-safety-teal-600 dark:text-safety-teal-400">
                                    {{ mockStats.quizzesCompleted }}
                                </p>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400 mt-1">Quizzes Done</p>
                            </div>

                            <div class="p-4 bg-neon-pink-50 dark:bg-neon-pink-900/20 rounded-lg text-center">
                                <p class="text-2xl md:text-3xl font-black text-neon-pink-600 dark:text-neon-pink-400">
                                    {{ mockStats.averageScore }}%
                                </p>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400 mt-1">Avg Score</p>
                            </div>

                            <div class="p-4 bg-vawc-orange-50 dark:bg-vawc-orange-900/20 rounded-lg text-center">
                                <p
                                    class="text-2xl md:text-3xl font-black text-vawc-orange-600 dark:text-vawc-orange-400">
                                    {{ mockStats.hoursLearned }}
                                </p>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400 mt-1">Hours Learned</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Achievements & Activity -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Achievements Section -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6 md:p-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                    Achievements
                                </h2>
                                <p class="text-sm text-platinum-600 dark:text-platinum-400 mt-1">
                                    {{mockBadges.filter(b => b.earned).length}} of {{ mockBadges.length }} badges
                                    earned
                                </p>
                            </div>
                            <button @click="showAllBadges = !showAllBadges"
                                class="text-sm font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline">
                                {{ showAllBadges ? 'Show Less' : 'See All' }}
                            </button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-300"
                            :class="showAllBadges ? 'max-h-[800px] overflow-y-auto custom-scrollbar' : 'max-h-[400px] overflow-hidden'">
                            <div v-for="badge in mockBadges" :key="badge.id"
                                class="group relative p-4 md:p-6 bg-gradient-to-br rounded-xl border-2 transition-all duration-300 cursor-pointer"
                                :class="badge.earned
                                    ? 'from-calm-lavender-50 to-neon-pink-50 dark:from-calm-lavender-900/20 dark:to-neon-pink-900/20 border-calm-lavender-300 dark:border-calm-lavender-700 hover:shadow-lg hover:scale-105'
                                    : 'from-platinum-50 to-platinum-100 dark:from-abyss-700/30 dark:to-abyss-700/10 border-platinum-200 dark:border-abyss-600 opacity-60'">
                                <div class="text-center">
                                    <div class="text-3xl md:text-4xl mb-2 md:mb-3 transition-transform group-hover:scale-110"
                                        :class="!badge.earned && 'grayscale opacity-50'">
                                        {{ badge.emoji }}
                                    </div>
                                    <h3 class="font-bold text-xs md:text-sm text-abyss-900 dark:text-platinum-50 mb-1">
                                        {{ badge.name }}
                                    </h3>
                                    <p
                                        class="text-[10px] md:text-xs text-platinum-600 dark:text-platinum-400 line-clamp-2">
                                        {{ badge.description }}
                                    </p>
                                    <div v-if="badge.earned" class="mt-2 md:mt-3">
                                        <span
                                            class="text-[10px] md:text-xs text-calm-lavender-600 dark:text-calm-lavender-400 font-semibold">
                                            {{ badge.earnedDate }}
                                        </span>
                                    </div>
                                    <div v-else class="mt-2 md:mt-3">
                                        <span
                                            class="text-[10px] md:text-xs text-platinum-500 dark:text-platinum-500 italic">
                                            Locked
                                        </span>
                                    </div>
                                </div>

                                <!-- Tooltip on hover (desktop only) -->
                                <div v-if="badge.earned"
                                    class="hidden md:flex absolute inset-0 bg-calm-lavender-600/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-4">
                                    <div class="text-center text-white">
                                        <p class="text-xs font-semibold mb-1">{{ badge.name }}</p>
                                        <p class="text-xs">{{ badge.description }}</p>
                                        <p class="text-xs mt-2 opacity-80">Earned: {{ badge.earnedDate }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Learning Progress -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6 md:p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl md:text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                Learning Progress
                            </h2>
                            <router-link to="/dashboard"
                                class="text-sm font-bold text-safety-teal-600 dark:text-safety-teal-400 hover:underline">
                                View Dashboard →
                            </router-link>
                        </div>

                        <div class="space-y-6">
                            <div v-for="path in mockLearningPaths" :key="path.id" class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-bold text-abyss-900 dark:text-platinum-100 text-sm">{{ path.name }}
                                    </h3>
                                    <span class="text-xs font-bold text-platinum-600 dark:text-platinum-400">
                                        {{ path.progress }}%
                                    </span>
                                </div>
                                <div
                                    class="w-full h-2.5 bg-platinum-100 dark:bg-abyss-700 rounded-full overflow-hidden shadow-inner">
                                    <div class="h-full bg-safety-teal-600 rounded-full transition-all duration-1000"
                                        :style="{ width: path.progress + '%' }"></div>
                                </div>
                                <p class="text-xs text-platinum-500 dark:text-platinum-400">
                                    {{ path.completed }} of {{ path.total }} modules completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6 md:p-8">
                        <h2
                            class="text-xl md:text-2xl font-bold text-abyss-900 dark:text-platinum-50 mb-6 font-heading">
                            Recent Activity
                        </h2>
                        <div class="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div v-for="activity in mockRecentActivities" :key="activity.id"
                                class="flex items-center gap-4 pb-4 border-b border-platinum-200 dark:border-abyss-700 last:border-0 last:pb-0">
                                <div class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="activity.iconBg">
                                    <span class="text-lg md:text-xl">{{ activity.icon }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-sm text-abyss-900 dark:text-platinum-50 truncate">
                                        {{ activity.title }}
                                    </p>
                                    <p class="text-xs text-platinum-500 dark:text-platinum-400">
                                        {{ activity.time }}
                                    </p>
                                </div>
                                <div v-if="activity.points"
                                    class="flex items-center gap-1 text-vawc-orange-600 dark:text-vawc-orange-400 flex-shrink-0">
                                    <span class="text-sm font-bold">+{{ activity.points }}</span>
                                    <span class="text-xs">XP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const isLoading = ref(true);
const showAllBadges = ref(false);

// Mock data
const mockStats = ref({
    totalPoints: 2450,
    modulesCompleted: 8,
    badgesCount: 5,
    rank: 2,
    level: 12,
    levelProgress: 65,
    xpToNextLevel: 350,
    streakDays: 7,
    quizzesCompleted: 24,
    averageScore: 87,
    hoursLearned: 32
});

const mockBadges = ref([
    {
        id: 1,
        name: 'Quick Start',
        emoji: '🚀',
        description: 'Complete your first module',
        earned: true,
        earnedDate: '2 weeks ago'
    },
    {
        id: 2,
        name: 'Committed',
        emoji: '💪',
        description: '7 days learning streak',
        earned: true,
        earnedDate: '1 week ago'
    },
    {
        id: 3,
        name: 'Scholar',
        emoji: '📚',
        description: 'Complete 5 modules',
        earned: true,
        earnedDate: '5 days ago'
    },
    {
        id: 4,
        name: 'Advocate',
        emoji: '🗣️',
        description: 'Share knowledge with community',
        earned: true,
        earnedDate: '3 days ago'
    },
    {
        id: 5,
        name: 'Guardian',
        emoji: '🛡️',
        description: 'Complete VAWC awareness module',
        earned: true,
        earnedDate: '1 day ago'
    },
    {
        id: 6,
        name: 'Explorer',
        emoji: '🔍',
        description: 'Complete 10 modules',
        earned: false,
        earnedDate: null
    },
    {
        id: 7,
        name: 'Master',
        emoji: '🎓',
        description: 'Achieve 95% average score',
        earned: false,
        earnedDate: null
    },
    {
        id: 8,
        name: 'Champion',
        emoji: '🏆',
        description: 'Reach top 10 leaderboard',
        earned: false,
        earnedDate: null
    },
    {
        id: 9,
        name: 'Perfectionist',
        emoji: '⭐',
        description: 'Get 100% on 5 quizzes',
        earned: false,
        earnedDate: null
    },
    {
        id: 10,
        name: 'Mentor',
        emoji: '👨‍🏫',
        description: 'Help 10 community members',
        earned: false,
        earnedDate: null
    }
]);

const mockLearningPaths = ref([
    { id: 1, name: 'Gender & Development Essentials', progress: 75, completed: 6, total: 8 },
    { id: 2, name: 'Sexual Health & Safety', progress: 45, completed: 4, total: 9 },
    { id: 3, name: 'Journey to Adultery', progress: 89, completed: 8, total: 9 }
]);

const mockRecentActivities = ref([
    {
        id: 1,
        type: 'quiz',
        icon: '📝',
        title: 'Completed: Gender Equality Quiz',
        time: '2 hours ago',
        points: 150,
        iconBg: 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30'
    },
    {
        id: 2,
        type: 'badge',
        icon: '🏆',
        title: 'Earned: Guardian Badge',
        time: '1 day ago',
        points: 500,
        iconBg: 'bg-vawc-orange-100 dark:bg-vawc-orange-900/30'
    },
    {
        id: 3,
        type: 'module',
        icon: '📚',
        title: 'Completed: VAWC Prevention Module',
        time: '2 days ago',
        points: 300,
        iconBg: 'bg-safety-teal-100 dark:bg-safety-teal-900/30'
    },
    {
        id: 4,
        type: 'quiz',
        icon: '📝',
        title: 'Completed: Safety Quiz',
        time: '3 days ago',
        points: 100,
        iconBg: 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30'
    },
    {
        id: 5,
        type: 'badge',
        icon: '🏆',
        title: 'Earned: Advocate Badge',
        time: '3 days ago',
        points: 500,
        iconBg: 'bg-vawc-orange-100 dark:bg-vawc-orange-900/30'
    },
    {
        id: 6,
        type: 'module',
        icon: '📚',
        title: 'Started: Cyber Safety Module',
        time: '4 days ago',
        points: 0,
        iconBg: 'bg-safety-teal-100 dark:bg-safety-teal-900/30'
    },
    {
        id: 7,
        type: 'quiz',
        icon: '📝',
        title: 'Completed: Health & Wellness Quiz',
        time: '5 days ago',
        points: 120,
        iconBg: 'bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30'
    },
    {
        id: 8,
        type: 'badge',
        icon: '🏆',
        title: 'Earned: Scholar Badge',
        time: '5 days ago',
        points: 500,
        iconBg: 'bg-vawc-orange-100 dark:bg-vawc-orange-900/30'
    }
]);

const players = ref([
    { id: 101, name: 'Elena R.', points: 3120, icon: '🌟' },
    { id: 1, name: 'You', points: 2450, icon: '👤' },
    { id: 102, name: 'Marcus K.', points: 2100, icon: '🛡️' },
    { id: 103, name: 'Sarah J.', points: 2900, icon: '🌿' },
    { id: 104, name: 'David L.', points: 1950, icon: '🎯' },
    { id: 105, name: 'Maya P.', points: 1800, icon: '💫' }
]);

const leaderboard = computed(() => {
    return [...players.value].sort((a, b) => b.points - a.points);
});

onMounted(async () => {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    isLoading.value = false;
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
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