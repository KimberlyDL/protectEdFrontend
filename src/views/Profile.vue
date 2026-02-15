<template>
    <div class="profile-page min-h-screen bg-platinum-50 dark:bg-abyss-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-heading font-bold text-abyss-900 dark:text-platinum-50">
                            My Profile
                        </h1>
                        <p class="mt-2 text-sm text-platinum-600 dark:text-platinum-400">
                            Manage your personal information and public profile
                        </p>
                    </div>
                    <router-link :to="{ name: 'settings' }"
                        class="px-4 py-2 bg-white dark:bg-abyss-800 border border-platinum-300 dark:border-abyss-600 rounded-lg text-sm font-medium text-abyss-700 dark:text-platinum-300 hover:bg-platinum-50 dark:hover:bg-abyss-700 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </router-link>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-20">
                <div class="text-center">
                    <div
                        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-calm-lavender-500 border-t-transparent">
                    </div>
                    <p class="mt-4 text-platinum-600 dark:text-platinum-400">Loading profile...</p>
                </div>
            </div>

            <!-- Profile Content -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column - Profile Card & Status -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Profile Card -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 overflow-hidden">
                        <!-- Cover Image -->
                        <div class="h-32 bg-gradient-to-br from-calm-lavender-500 via-neon-pink-500 to-safety-teal-500">
                        </div>

                        <!-- Avatar & Basic Info -->
                        <div class="px-6 pb-6">
                            <div class="relative -mt-16 mb-4">
                                <div class="relative inline-block">
                                    <img :src="profile?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=a855f7'"
                                        :alt="profile?.display_name || user?.name"
                                        class="w-32 h-32 rounded-full border-4 border-white dark:border-abyss-800 shadow-lg object-cover" />
                                    <div v-if="profile?.is_profile_public"
                                        class="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-abyss-800 flex items-center justify-center"
                                        title="Public Profile">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div class="text-center mb-4">
                                <h2 class="text-2xl font-heading font-bold text-abyss-900 dark:text-platinum-50 mb-1">
                                    {{ profile?.display_name || user?.name || 'User' }}
                                </h2>
                                <p class="text-sm text-platinum-600 dark:text-platinum-400 mb-2">
                                    {{ user?.email }}
                                </p>
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                    :class="getRoleBadgeClass(user?.role)">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ formatRole(user?.role) }}
                                </span>
                            </div>

                            <!-- Bio -->
                            <div v-if="profile?.bio" class="mb-4 p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg">
                                <p class="text-sm text-abyss-900 dark:text-platinum-200 leading-relaxed">
                                    {{ profile.bio }}
                                </p>
                            </div>

                            <!-- Quick Stats -->
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div
                                    class="text-center p-3 bg-calm-lavender-50 dark:bg-calm-lavender-900/20 rounded-lg">
                                    <p class="text-2xl font-bold text-calm-lavender-600 dark:text-calm-lavender-400">
                                        {{ mockStats.badgesCount }}
                                    </p>
                                    <p class="text-xs text-platinum-600 dark:text-platinum-400">Badges</p>
                                </div>
                                <div class="text-center p-3 bg-safety-teal-50 dark:bg-safety-teal-900/20 rounded-lg">
                                    <p class="text-2xl font-bold text-safety-teal-600 dark:text-safety-teal-400">
                                        {{ calculateDaysSinceJoined() }}
                                    </p>
                                    <p class="text-xs text-platinum-600 dark:text-platinum-400">Days Active</p>
                                </div>
                            </div>

                            <!-- Edit Profile Button -->
                            <router-link :to="{ name: 'settings' }"
                                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-calm-lavender-600 text-white font-semibold rounded-lg hover:bg-calm-lavender-700 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </router-link>
                        </div>
                    </div>

                    <!-- Status Card - Similar to UserDashboard -->
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

                            <div class="grid grid-cols-3 gap-3">
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
                        </div>
                    </div>

                    <!-- Account Info Card -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <h3 class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50 mb-4">
                            Account Information
                        </h3>
                        <div class="space-y-3">
                            <div
                                class="flex items-center justify-between py-2 border-b border-platinum-200 dark:border-abyss-700">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Status</span>
                                <span class="text-sm font-semibold" :class="getStatusColor(profile?.account_status)">
                                    {{ formatStatus(profile?.account_status) }}
                                </span>
                            </div>
                            <div
                                class="flex items-center justify-between py-2 border-b border-platinum-200 dark:border-abyss-700">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Email Verified</span>
                                <span class="flex items-center gap-1">
                                    <svg v-if="user?.email_verified" class="w-4 h-4 text-green-500" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="text-sm font-semibold text-abyss-900 dark:text-platinum-50">
                                        {{ user?.email_verified ? 'Yes' : 'No' }}
                                    </span>
                                </span>
                            </div>
                            <div class="flex items-center justify-between py-2">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Member Since</span>
                                <span class="text-sm font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ formatDate(profile?.created_at || user?.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Achievements & Activity -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Achievements Section -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                    Achievements
                                </h2>
                                <p class="text-sm text-platinum-600 dark:text-platinum-400 mt-1">
                                    {{ mockBadges.length }} badges earned
                                </p>
                            </div>
                            <button @click="showAllBadges = !showAllBadges"
                                class="text-sm font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline">
                                {{ showAllBadges ? 'Show Less' : 'See All' }}
                            </button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all duration-300"
                            :class="showAllBadges ? 'max-h-[800px] overflow-y-auto custom-scrollbar' : 'max-h-[300px] overflow-hidden'">
                            <div v-for="badge in mockBadges" :key="badge.id"
                                class="group relative p-6 bg-gradient-to-br rounded-xl border-2 transition-all duration-300 cursor-pointer"
                                :class="badge.earned
                                    ? 'from-calm-lavender-50 to-neon-pink-50 dark:from-calm-lavender-900/20 dark:to-neon-pink-900/20 border-calm-lavender-300 dark:border-calm-lavender-700 hover:shadow-lg hover:scale-105'
                                    : 'from-platinum-50 to-platinum-100 dark:from-abyss-700/30 dark:to-abyss-700/10 border-platinum-200 dark:border-abyss-600 opacity-60'">
                                <div class="text-center">
                                    <div class="text-4xl mb-3 transition-transform group-hover:scale-110"
                                        :class="!badge.earned && 'grayscale opacity-50'">
                                        {{ badge.emoji }}
                                    </div>
                                    <h3 class="font-bold text-sm text-abyss-900 dark:text-platinum-50 mb-1">
                                        {{ badge.name }}
                                    </h3>
                                    <p class="text-xs text-platinum-600 dark:text-platinum-400 line-clamp-2">
                                        {{ badge.description }}
                                    </p>
                                    <div v-if="badge.earned" class="mt-3">
                                        <span
                                            class="text-xs text-calm-lavender-600 dark:text-calm-lavender-400 font-semibold">
                                            {{ badge.earnedDate }}
                                        </span>
                                    </div>
                                    <div v-else class="mt-3">
                                        <span class="text-xs text-platinum-500 dark:text-platinum-500 italic">
                                            Locked
                                        </span>
                                    </div>
                                </div>

                                <!-- Tooltip on hover -->
                                <div v-if="badge.earned"
                                    class="absolute inset-0 bg-calm-lavender-600/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
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
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
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
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-8">
                        <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 mb-6 font-heading">
                            Recent Activity
                        </h2>
                        <div class="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div v-for="activity in mockRecentActivities" :key="activity.id"
                                class="flex items-center gap-4 pb-4 border-b border-platinum-200 dark:border-abyss-700 last:border-0 last:pb-0">
                                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="activity.iconBg">
                                    <span class="text-xl">{{ activity.icon }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-sm text-abyss-900 dark:text-platinum-50">
                                        {{ activity.title }}
                                    </p>
                                    <p class="text-xs text-platinum-500 dark:text-platinum-400">
                                        {{ activity.time }}
                                    </p>
                                </div>
                                <div v-if="activity.points"
                                    class="flex items-center gap-1 text-vawc-orange-600 dark:text-vawc-orange-400">
                                    <span class="text-sm font-bold">+{{ activity.points }}</span>
                                    <span class="text-xs">XP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                Personal Information
                            </h2>
                            <router-link :to="{ name: 'settings' }"
                                class="text-sm font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline">
                                Edit →
                            </router-link>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Basic Info -->
                            <div class="space-y-4">
                                <div>
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ profile?.display_name || user?.name || 'Not set' }}
                                    </p>
                                </div>
                                <div>
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Sex
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ formatSex(profile?.sex) }}
                                    </p>
                                </div>
                                <div>
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Date of Birth
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ formatDate(profile?.date_of_birth) }}
                                        <span v-if="profile?.date_of_birth"
                                            class="text-platinum-500 dark:text-platinum-400">
                                            ({{ calculateAge(profile.date_of_birth) }} years old)
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <!-- Contact Info -->
                            <div class="space-y-4">
                                <div>
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ profile?.phone_number || 'Not set' }}
                                    </p>
                                </div>
                                <div v-if="hasAddress">
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Address
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ [profile?.address?.line1, profile?.address?.city,
                                        profile?.address?.province].filter(Boolean).join(', ') || 'Not set' }}
                                    </p>
                                </div>
                                <div v-if="hasEmergencyContact">
                                    <label
                                        class="text-xs font-semibold text-platinum-500 dark:text-platinum-400 uppercase tracking-wide">
                                        Emergency Contact
                                    </label>
                                    <p class="mt-1 text-sm font-medium text-abyss-900 dark:text-platinum-50">
                                        {{ profile?.emergency_contact?.name }} - {{ profile?.emergency_contact?.phone }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Privacy Settings Preview -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50 font-heading">
                                Privacy Settings
                            </h2>
                            <router-link :to="{ name: 'settings' }"
                                class="text-sm font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline">
                                Manage →
                            </router-link>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.is_profile_public ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Public Profile</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.is_profile_public ? 'Enabled' : 'Disabled' }}
                                </p>
                            </div>

                            <div class="p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.show_progress ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Show Progress</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.privacy_settings?.show_progress ? 'Visible' : 'Hidden' }}
                                </p>
                            </div>

                            <div class="p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.show_badges ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Show Badges</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.privacy_settings?.show_badges ? 'Visible' : 'Hidden' }}
                                </p>
                            </div>

                            <div class="p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.allow_messages ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Messages</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.privacy_settings?.allow_messages ? 'Allowed' : 'Disabled' }}
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
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const authStore = useAuthStore();
const toast = useToast();

const user = ref(authStore.user);
const profile = ref(null);
const isLoading = ref(true);
const showAllBadges = ref(false);

// Mock data for status and achievements
const mockStats = ref({
    totalPoints: 2450,
    modulesCompleted: 8,
    badgesCount: 5,
    rank: 2,
    level: 12
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
    }
]);

const mockLearningPaths = ref([
    { id: 1, name: 'Gender & Development Essentials', progress: 75 },
    { id: 2, name: 'Sexual Health & Safety', progress: 45 },
    { id: 3, name: 'Journey to Adultery', progress: 89 }
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
    }
]);

const hasAddress = computed(() => {
    return profile.value?.address?.line1 ||
        profile.value?.address?.city ||
        profile.value?.address?.province;
});

const hasEmergencyContact = computed(() => {
    return profile.value?.emergency_contact?.name ||
        profile.value?.emergency_contact?.phone;
});

const fetchProfile = async () => {
    isLoading.value = true;
    try {
        const { data } = await api.get(`/api/v1/users/${user.value.id}/profile`);
        profile.value = data;
    } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile information');
    } finally {
        isLoading.value = false;
    }
};

// const fetchProfile = async () => {
//     isLoading.value = true;
//     try {
//         // When you want to connect to backend, uncomment this:
//         // const { data } = await api.get(`/api/v1/users/${user.value.id}/profile`);
//         // profile.value = data;

//         // For now, use mock data
//         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
//         profile.value = {
//             display_name: user.value?.name || 'Alex Morgan',
//             bio: 'Passionate about learning and creating safe spaces for everyone.',
//             avatar_url: null,
//             is_profile_public: true,
//             account_status: 'active',
//             sex: 'prefer_not_to_say',
//             date_of_birth: '2000-05-15',
//             phone_number: '+63 912 345 6789',
//             address: {
//                 line1: '123 Education St.',
//                 city: 'Calapan',
//                 province: 'Oriental Mindoro'
//             },
//             emergency_contact: {
//                 name: 'Jane Morgan',
//                 phone: '+63 912 345 6780'
//             },
//             privacy_settings: {
//                 show_progress: true,
//                 show_badges: true,
//                 allow_messages: true
//             },
//             achievements_count: mockStats.value.badgesCount,
//             created_at: '2024-01-15T08:00:00Z'
//         };
//     } catch (error) {
//         console.error('Failed to load profile:', error);
//         toast.error('Failed to load profile information');
//     } finally {
//         isLoading.value = false;
//     }
// };

const getRoleBadgeClass = (role) => {
    const classes = {
        'admin': 'bg-advocacy-purple-100 text-advocacy-purple-700 dark:bg-advocacy-purple-900/30 dark:text-advocacy-purple-300',
        'educator': 'bg-safety-teal-100 text-safety-teal-700 dark:bg-safety-teal-900/30 dark:text-safety-teal-300',
        'moderator': 'bg-neon-pink-100 text-neon-pink-700 dark:bg-neon-pink-900/30 dark:text-neon-pink-300',
        'player': 'bg-calm-lavender-100 text-calm-lavender-700 dark:bg-calm-lavender-900/30 dark:text-calm-lavender-300'
    };
    return classes[role] || classes['player'];
};

const formatRole = (role) => {
    const roles = {
        'admin': 'Administrator',
        'educator': 'Facilitator',
        'moderator': 'Moderator',
        'player': 'Student'
    };
    return roles[role] || 'Student';
};

const getStatusColor = (status) => {
    const colors = {
        'active': 'text-green-600 dark:text-green-400',
        'deactivated': 'text-yellow-600 dark:text-yellow-400',
        'pending_deletion': 'text-red-600 dark:text-red-400',
        'deleted': 'text-red-600 dark:text-red-400'
    };
    return colors[status] || colors['active'];
};

const formatStatus = (status) => {
    const statuses = {
        'active': 'Active',
        'deactivated': 'Deactivated',
        'pending_deletion': 'Pending Deletion',
        'deleted': 'Deleted'
    };
    return statuses[status] || 'Active';
};

const formatSex = (sex) => {
    const sexes = {
        'male': 'Male',
        'female': 'Female',
        'prefer_not_to_say': 'Prefer not to say'
    };
    return sexes[sex] || 'Not specified';
};

const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const calculateAge = (dateString) => {
    if (!dateString) return 0;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const calculateDaysSinceJoined = () => {
    if (!profile.value?.created_at && !user.value?.created_at) return 0;
    const joinDate = new Date(profile.value?.created_at || user.value?.created_at);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

onMounted(() => {
    fetchProfile();
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