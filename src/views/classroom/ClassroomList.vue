<template>
    <div class="min-h-screen bg-platinum-50 dark:bg-abyss-900 p-4 md:p-6">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-heading font-bold text-abyss-900 dark:text-platinum-50">My Classrooms</h1>
                    <p class="text-platinum-600 dark:text-platinum-400 mt-1">
                        Track your learning progress across all enrolled courses
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <router-link :to="{ name: 'classroom.analytics' }"
                        class="p-3 bg-white dark:bg-abyss-800 border border-platinum-200 dark:border-abyss-700 text-platinum-600 dark:text-platinum-300 rounded-xl hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-all shadow-sm"
                        title="View Analytics">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </router-link>
                    <button @click="showJoinModal = true"
                        class="flex items-center justify-center gap-2 px-5 py-3 bg-calm-lavender-600 hover:bg-calm-lavender-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Join Class</span>
                    </button>
                </div>
            </div>

            <!-- Classrooms Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="classroom in joinedClasses" :key="classroom.id"
                    class="group relative bg-white dark:bg-abyss-800 rounded-2xl border border-platinum-200 dark:border-abyss-700 overflow-hidden hover:shadow-xl hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700 transition-all flex flex-col">
                    <!-- Header Banner -->
                    <div :class="[classroom.color, 'h-24 w-full relative']">
                        <div class="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                        <div class="absolute top-3 right-3">
                            <button @click.stop="toggleSettings(classroom.id)"
                                class="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="mb-4">
                            <h3 class="text-lg font-heading font-bold text-abyss-900 dark:text-platinum-50 mb-1">
                                {{ classroom.name }}
                            </h3>
                            <p class="text-sm text-platinum-500 dark:text-platinum-400 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {{ classroom.instructor }}
                            </p>
                        </div>

                        <!-- Progress Section -->
                        <div class="mt-auto space-y-4">
                            <div class="space-y-2">
                                <div class="flex justify-between items-center text-xs">
                                    <span
                                        class="text-platinum-500 dark:text-platinum-400 font-bold uppercase tracking-wide">
                                        Progress
                                    </span>
                                    <span class="text-abyss-900 dark:text-platinum-300 font-bold">
                                        {{ classroom.completedModules }}/{{ classroom.totalModules }} modules
                                    </span>
                                </div>
                                <div class="h-2 bg-platinum-100 dark:bg-abyss-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-calm-lavender-500 to-safety-teal-500 transition-all duration-700"
                                        :style="{ width: (classroom.completedModules / classroom.totalModules * 100) + '%' }">
                                    </div>
                                </div>
                                <p class="text-xs text-platinum-500 dark:text-platinum-400">
                                    {{ Math.round((classroom.completedModules / classroom.totalModules) * 100) }}%
                                    complete
                                </p>
                            </div>

                            <!-- Action Button -->
                            <router-link :to="{ name: 'classroom.home', params: { id: classroom.id } }"
                                class="block text-center w-full py-3 text-sm font-bold text-white bg-calm-lavender-600 hover:bg-calm-lavender-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                                Enter Classroom
                            </router-link>
                        </div>
                    </div>

                    <!-- Settings Dropdown -->
                    <div v-if="activeSettingsId === classroom.id"
                        class="absolute top-16 right-4 z-20 w-52 bg-white dark:bg-abyss-800 rounded-xl shadow-2xl border border-platinum-200 dark:border-abyss-700 py-2 overflow-hidden">
                        <button @click="viewAnalytics(classroom)"
                            class="w-full text-left px-4 py-3 text-sm text-abyss-900 dark:text-platinum-100 hover:bg-platinum-50 dark:hover:bg-abyss-700 flex items-center gap-3 transition-colors">
                            <span class="text-lg">📊</span>
                            <span class="font-medium">View Analytics</span>
                        </button>
                        <div class="h-px bg-platinum-100 dark:bg-abyss-700 mx-2 my-1"></div>
                        <button @click="leaveClass(classroom)"
                            class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold flex items-center gap-3 transition-colors">
                            <span class="text-lg">🚪</span>
                            <span>Leave Classroom</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="joinedClasses.length === 0"
                class="flex flex-col items-center justify-center py-20 bg-white dark:bg-abyss-800 rounded-2xl border border-platinum-200 dark:border-abyss-700">
                <div class="text-6xl mb-4">📚</div>
                <h3 class="text-xl font-bold text-abyss-900 dark:text-platinum-50 mb-2">No classrooms yet</h3>
                <p class="text-platinum-600 dark:text-platinum-400 mb-6">Join your first classroom to get started</p>
                <button @click="showJoinModal = true"
                    class="px-6 py-3 bg-calm-lavender-600 hover:bg-calm-lavender-700 text-white font-bold rounded-lg transition-all">
                    Join a Classroom
                </button>
            </div>
        </div>

        <!-- Analytics Modal -->
        <div v-if="selectedClassForAnalytics"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyss-900/60 backdrop-blur-md"
            @click.self="selectedClassForAnalytics = null">
            <div
                class="bg-white dark:bg-abyss-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-platinum-200 dark:border-abyss-700 max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div
                    class="sticky top-0 p-6 border-b border-platinum-100 dark:border-abyss-700 flex justify-between items-center bg-white dark:bg-abyss-800 z-10">
                    <div>
                        <h2 class="text-2xl font-heading font-bold text-abyss-900 dark:text-platinum-50">
                            Class Analytics
                        </h2>
                        <p class="text-sm text-platinum-500 dark:text-platinum-400 mt-1">
                            {{ selectedClassForAnalytics.name }}
                        </p>
                    </div>
                    <button @click="selectedClassForAnalytics = null"
                        class="p-2 hover:bg-platinum-100 dark:hover:bg-abyss-700 rounded-lg transition-colors">
                        <svg class="w-6 h-6 text-platinum-600 dark:text-platinum-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Modal Content -->
                <div class="p-6 md:p-8 space-y-8">
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="stat in mockAnalytics.stats" :key="stat.label"
                            class="p-6 bg-gradient-to-br from-platinum-50 to-platinum-100 dark:from-abyss-900 dark:to-abyss-900/50 rounded-2xl border border-platinum-200 dark:border-abyss-700">
                            <p
                                class="text-xs font-bold text-platinum-500 dark:text-platinum-400 uppercase tracking-widest mb-2">
                                {{ stat.label }}
                            </p>
                            <p class="text-3xl font-black text-calm-lavender-600 dark:text-calm-lavender-400">
                                {{ stat.value }}
                            </p>
                        </div>
                    </div>

                    <!-- Weekly Activity Chart -->
                    <div
                        class="p-6 bg-white dark:bg-abyss-900/50 rounded-2xl border border-platinum-200 dark:border-abyss-700">
                        <h3 class="font-bold text-abyss-900 dark:text-platinum-50 flex items-center gap-2 mb-6">
                            <span class="text-2xl">📈</span>
                            <span>Weekly Activity</span>
                        </h3>
                        <div
                            class="h-48 flex items-end justify-between gap-2 px-2 border-b border-platinum-200 dark:border-abyss-700">
                            <div v-for="(day, i) in mockAnalytics.activity" :key="i"
                                class="flex-1 flex flex-col items-center gap-3">
                                <div class="w-full bg-gradient-to-t from-calm-lavender-500 to-calm-lavender-400 rounded-t-lg transition-all duration-1000 hover:from-calm-lavender-600 hover:to-calm-lavender-500"
                                    :style="{ height: day.value + '%' }"></div>
                                <span class="text-xs font-bold text-platinum-500 dark:text-platinum-400 uppercase">
                                    {{ day.label }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Peer Comparison -->
                    <div
                        class="p-6 bg-gradient-to-br from-platinum-50 to-sun-50 dark:from-abyss-900/50 dark:to-abyss-900/30 rounded-2xl border border-platinum-200 dark:border-abyss-700">
                        <h3 class="font-bold text-abyss-900 dark:text-platinum-50 mb-6 flex items-center gap-2">
                            <span class="text-2xl">🎯</span>
                            <span>Performance Comparison</span>
                        </h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Your Average</span>
                                <span class="text-lg font-bold text-calm-lavender-600 dark:text-calm-lavender-400">
                                    {{ mockAnalytics.averageScore }}%
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Class Average</span>
                                <span class="text-lg font-bold text-platinum-700 dark:text-platinum-300">
                                    {{ mockAnalytics.classAverageScore }}%
                                </span>
                            </div>
                            <div
                                class="relative w-full h-3 bg-platinum-200 dark:bg-abyss-700 rounded-full overflow-hidden">
                                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-calm-lavender-500 to-calm-lavender-600 rounded-full transition-all duration-700"
                                    :style="{ width: mockAnalytics.averageScore + '%' }"></div>
                                <div class="absolute inset-y-0 w-1 bg-abyss-900 dark:bg-white"
                                    :style="{ left: mockAnalytics.classAverageScore + '%' }" title="Class Average">
                                </div>
                            </div>
                            <p class="text-xs text-platinum-500 dark:text-platinum-400 italic">
                                * Vertical line indicates class average
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Join Modal (Placeholder) -->
        <div v-if="showJoinModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyss-900/60 backdrop-blur-md"
            @click.self="showJoinModal = false">
            <div
                class="bg-white dark:bg-abyss-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-platinum-200 dark:border-abyss-700">
                <h3 class="text-xl font-bold text-abyss-900 dark:text-platinum-50 mb-4">Join a Classroom</h3>
                <p class="text-sm text-platinum-600 dark:text-platinum-400 mb-6">
                    Enter the classroom code provided by your instructor
                </p>
                <input type="text" placeholder="Enter classroom code"
                    class="w-full px-4 py-3 border border-platinum-200 dark:border-abyss-700 rounded-lg bg-white dark:bg-abyss-900 text-abyss-900 dark:text-platinum-50 focus:outline-none focus:ring-2 focus:ring-calm-lavender-500 mb-4">
                <div class="flex gap-3">
                    <button @click="showJoinModal = false"
                        class="flex-1 px-4 py-3 border border-platinum-200 dark:border-abyss-700 rounded-lg font-medium text-platinum-700 dark:text-platinum-300 hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors">
                        Cancel
                    </button>
                    <button
                        class="flex-1 px-4 py-3 bg-calm-lavender-600 hover:bg-calm-lavender-700 text-white font-bold rounded-lg transition-colors">
                        Join
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from '@/utils/useToast';

const toast = useToast();
const showJoinModal = ref(false);
const activeSettingsId = ref(null);
const selectedClassForAnalytics = ref(null);

// Mock Classroom Data
const joinedClasses = ref([
    {
        id: 1,
        name: 'Cybersecurity 101',
        instructor: 'Prof. Sarah Jenkins',
        totalModules: 12,
        completedModules: 9,
        color: 'bg-gradient-to-br from-calm-lavender-500 to-calm-lavender-600'
    },
    {
        id: 2,
        name: 'Network Infrastructure',
        instructor: 'Dr. James Miller',
        totalModules: 8,
        completedModules: 2,
        color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
        id: 3,
        name: 'Web Development',
        instructor: 'Prof. Alan Turing',
        totalModules: 15,
        completedModules: 15,
        color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
]);

// Mock Analytics Data
const mockAnalytics = {
    stats: [
        { label: 'Overall Grade', value: 'A-' },
        { label: 'Total XP', value: '2,450' },
        { label: 'Time Spent', value: '14.5h' }
    ],
    activity: [
        { label: 'Mon', value: 30 },
        { label: 'Tue', value: 80 },
        { label: 'Wed', value: 45 },
        { label: 'Thu', value: 90 },
        { label: 'Fri', value: 20 },
        { label: 'Sat', value: 10 },
        { label: 'Sun', value: 5 }
    ],
    averageScore: 88,
    classAverageScore: 72
};

const toggleSettings = (id) => {
    activeSettingsId.value = activeSettingsId.value === id ? null : id;
};

const viewAnalytics = (classroom) => {
    selectedClassForAnalytics.value = classroom;
    activeSettingsId.value = null;
};

const leaveClass = (classroom) => {
    if (confirm(`Are you sure you want to leave ${classroom.name}?`)) {
        joinedClasses.value = joinedClasses.value.filter(c => c.id !== classroom.id);
        toast.info(`Left ${classroom.name}`);
        activeSettingsId.value = null;
    }
};
</script>