<template>
    <div class="user-rewards p-6">
        <!-- Header with Stats -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 text-white mb-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-4xl font-bold mb-2">Your Rewards</h1>
                    <p class="text-blue-100">Track your progress and achievements</p>
                </div>
                <div v-if="stats" class="text-right">
                    <div class="text-5xl font-bold">{{ stats.totalRewards }}</div>
                    <div class="text-blue-100">Total Rewards</div>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-3xl font-bold">{{ currentScore }}</div>
                    <div class="text-sm text-blue-100">Current Score</div>
                </div>
                <div v-if="stats" class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-3xl font-bold">{{ stats.unviewedRewards }}</div>
                    <div class="text-sm text-blue-100">New Rewards</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-3xl font-bold">{{ earnedCount }}</div>
                    <div class="text-sm text-blue-100">Earned</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-3xl font-bold">{{ availableCount }}</div>
                    <div class="text-sm text-blue-100">Available</div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6 border-b border-gray-200">
            <nav class="flex space-x-8">
                <button @click="activeTab = 'progress'" :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'progress'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    <Target class="w-5 h-5 inline mr-2" />
                    Progress
                </button>
                <button @click="activeTab = 'earned'" :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'earned'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    <Trophy class="w-5 h-5 inline mr-2" />
                    Earned ({{ earnedCount }})
                </button>
            </nav>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Progress Tab -->
        <div v-else-if="activeTab === 'progress' && progress.length > 0" class="space-y-4">
            <div v-for="item in progress" :key="item.reward.id" class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex items-start gap-4">
                    <!-- Badge Icon -->
                    <div v-if="item.reward.badge" class="flex-shrink-0">
                        <img :src="getBadgeUrl(item.reward.badge.iconKey)" :alt="item.reward.badge.name"
                            class="w-20 h-20 object-contain rounded-lg"
                            :class="{ 'opacity-50 grayscale': !item.earned }" />
                    </div>
                    <div v-else class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Trophy class="w-10 h-10 text-gray-400" />
                    </div>

                    <!-- Reward Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {{ item.reward.name }}
                                    <CheckCircle v-if="item.earned" class="w-5 h-5 text-green-500" />
                                </h3>
                                <p class="text-sm text-gray-600 mt-1">{{ item.reward.description }}</p>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mt-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">
                                    {{ item.eligible ? 'Eligible!' : item.reason }}
                                </span>
                                <span class="font-medium text-gray-800">
                                    {{ Math.min(100, item.progress) }}%
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500"
                                    :class="item.eligible ? 'bg-green-500' : 'bg-blue-600'"
                                    :style="{ width: `${Math.min(100, item.progress)}%` }"></div>
                            </div>
                            <div v-if="item.scoreNeeded > 0" class="text-xs text-gray-500 mt-1">
                                {{ item.scoreNeeded }} more points needed
                            </div>
                        </div>

                        <!-- Reward Details -->
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                {{ item.reward.requiredScore }} points
                            </span>
                            <span v-if="item.reward.pointsValue"
                                class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                +{{ item.reward.pointsValue }} bonus points
                            </span>
                            <span v-if="item.earned && item.earnedCount > 1"
                                class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Earned {{ item.earnedCount }}x
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Earned Tab -->
        <div v-else-if="activeTab === 'earned' && earnedRewards.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="userReward in earnedRewards" :key="userReward.id"
                class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div class="flex flex-col items-center text-center">
                    <div v-if="userReward.reward.badge" class="mb-4">
                        <img :src="getBadgeUrl(userReward.reward.badge.iconKey)" :alt="userReward.reward.badge.name"
                            class="w-32 h-32 object-contain" />
                    </div>
                    <div v-else class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Trophy class="w-16 h-16 text-gray-400" />
                    </div>

                    <h3 class="text-lg font-bold text-gray-800 mb-2">
                        {{ userReward.reward.name }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-3">
                        {{ userReward.reward.description }}
                    </p>

                    <div class="w-full space-y-2">
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Earned:</span>
                            <span>{{ formatDate(userReward.earnedAt) }}</span>
                        </div>
                        <div v-if="userReward.earnedCount > 1" class="flex justify-between text-xs text-gray-500">
                            <span>Times Earned:</span>
                            <span class="font-bold">{{ userReward.earnedCount }}x</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Score at Earn:</span>
                            <span>{{ userReward.scoreAtEarn }}</span>
                        </div>
                    </div>

                    <div v-if="!userReward.isViewed" class="mt-4 w-full">
                        <span
                            class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            New!
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty States -->
        <div v-else class="text-center py-12">
            <Trophy class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 text-lg">
                {{ activeTab === 'progress' ? 'No rewards available' : 'No rewards earned yet' }}
            </p>
            <p class="text-gray-500 text-sm mt-2">
                Keep learning and earning points to unlock rewards!
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Trophy, Target, CheckCircle } from 'lucide-vue-next';
import axios from 'axios';
import { useUserStore } from '@/stores/user'; // Adjust to your store path
import { getBadgeUrl } from '@/utils/cloudflare';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const userStore = useUserStore();
const userId = computed(() => userStore.user?.id);
const currentScore = computed(() => userStore.user?.score || 0);

const activeTab = ref('progress');
const loading = ref(false);
const progress = ref([]);
const earnedRewards = ref([]);
const stats = ref(null);

const earnedCount = computed(() => progress.value.filter(p => p.earned).length);
const availableCount = computed(() => progress.value.filter(p => p.eligible && !p.earned).length);

onMounted(async () => {
    await Promise.all([
        fetchProgress(),
        fetchEarnedRewards(),
        fetchStats()
    ]);
});

async function fetchProgress() {
    if (!userId.value) return;

    loading.value = true;
    try {
        const response = await axios.get(
            `${API_URL}/api/v1/rewards/user/${userId.value}/progress`,
            {
                params: { currentScore: currentScore.value }
            }
        );
        progress.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch progress:', error);
    } finally {
        loading.value = false;
    }
}

async function fetchEarnedRewards() {
    if (!userId.value) return;

    try {
        const response = await axios.get(`${API_URL}/api/v1/rewards/user/${userId.value}`);
        earnedRewards.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch earned rewards:', error);
    }
}

async function fetchStats() {
    if (!userId.value) return;

    try {
        const response = await axios.get(`${API_URL}/api/v1/rewards/user/${userId.value}/stats`);
        stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}
</script>