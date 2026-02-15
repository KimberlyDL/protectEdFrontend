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
                    <router-link to="/settings"
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
                <!-- Left Column - Profile Card -->
                <div class="lg:col-span-1">
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
                                        {{ profile?.achievements_count || 0 }}
                                    </p>
                                    <p class="text-xs text-platinum-600 dark:text-platinum-400">Achievements</p>
                                </div>
                                <div class="text-center p-3 bg-safety-teal-50 dark:bg-safety-teal-900/20 rounded-lg">
                                    <p class="text-2xl font-bold text-safety-teal-600 dark:text-safety-teal-400">
                                        {{ calculateDaysSinceJoined() }}
                                    </p>
                                    <p class="text-xs text-platinum-600 dark:text-platinum-400">Days Active</p>
                                </div>
                            </div>

                            <!-- Edit Profile Button -->
                            <router-link to="/settings?tab=profile"
                                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-calm-lavender-600 text-white font-semibold rounded-lg hover:bg-calm-lavender-700 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </router-link>
                        </div>
                    </div>

                    <!-- Account Info Card -->
                    <div
                        class="mt-6 bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
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
                                    <span class="text-sm font-semibold"
                                        :class="user?.email_verified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                        {{ user?.email_verified ? 'Verified' : 'Not Verified' }}
                                    </span>
                                </span>
                            </div>
                            <div
                                class="flex items-center justify-between py-2 border-b border-platinum-200 dark:border-abyss-700">
                                <span class="text-sm text-platinum-600 dark:text-platinum-400">Profile Visibility</span>
                                <span class="text-sm font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.is_profile_public ? 'Public' : 'Private' }}
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

                <!-- Right Column - Detailed Information -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Personal Information Card -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50">
                                Personal Information
                            </h3>
                            <router-link to="/settings?tab=profile"
                                class="text-sm text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-medium">
                                Edit
                            </router-link>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Date of Birth
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not set' }}
                                    <span v-if="profile?.date_of_birth"
                                        class="text-platinum-500 dark:text-platinum-400">
                                        ({{ calculateAge(profile.date_of_birth) }} years old)
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Sex
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ formatSex(profile?.sex) }}
                                </p>
                            </div>

                            <div v-if="profile?.gender_identity">
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Gender Identity
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile.gender_identity }}
                                </p>
                            </div>

                            <div v-if="profile?.phone_number">
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Phone Number
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile.phone_number }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Address Card -->
                    <div v-if="hasAddress"
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50">
                                Address
                            </h3>
                            <router-link to="/settings?tab=profile"
                                class="text-sm text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-medium">
                                Edit
                            </router-link>
                        </div>

                        <div class="space-y-2">
                            <p class="text-sm text-abyss-900 dark:text-platinum-50">
                                {{ profile?.address?.line1 }}
                            </p>
                            <p v-if="profile?.address?.line2" class="text-sm text-abyss-900 dark:text-platinum-50">
                                {{ profile.address.line2 }}
                            </p>
                            <p class="text-sm text-abyss-900 dark:text-platinum-50">
                                {{ [profile?.address?.city, profile?.address?.province].filter(Boolean).join(', ') }}
                            </p>
                            <p class="text-sm text-abyss-900 dark:text-platinum-50">
                                {{ profile?.address?.postal_code }} {{ profile?.address?.country }}
                            </p>
                        </div>
                    </div>

                    <!-- Emergency Contact Card -->
                    <div v-if="hasEmergencyContact"
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3
                                class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50 flex items-center gap-2">
                                <svg class="w-5 h-5 text-vawc-orange-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Emergency Contact
                            </h3>
                            <router-link to="/settings?tab=profile"
                                class="text-sm text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-medium">
                                Edit
                            </router-link>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Name
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile?.emergency_contact?.name }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Relationship
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile?.emergency_contact?.relationship }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-platinum-600 dark:text-platinum-400 mb-1">
                                    Phone Number
                                </label>
                                <p class="text-sm text-abyss-900 dark:text-platinum-50 font-medium">
                                    {{ profile?.emergency_contact?.phone }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Guardians Card (For students/minors) -->
                    <div v-if="profile?.guardians && profile.guardians.length > 0"
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3
                                class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50 flex items-center gap-2">
                                <svg class="w-5 h-5 text-safety-teal-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Guardians
                            </h3>
                            <router-link to="/settings?tab=guardians"
                                class="text-sm text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-medium">
                                Manage
                            </router-link>
                        </div>

                        <div class="space-y-4">
                            <div v-for="guardian in profile.guardians" :key="guardian.id"
                                class="p-4 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-abyss-900 dark:text-platinum-50">
                                            {{ guardian.full_name }}
                                        </h4>
                                        <span v-if="guardian.is_primary"
                                            class="px-2 py-0.5 bg-neon-pink-100 dark:bg-neon-pink-900/30 text-neon-pink-700 dark:text-neon-pink-300 rounded-full text-xs font-semibold">
                                            Primary
                                        </span>
                                    </div>
                                    <span
                                        class="px-2 py-1 bg-advocacy-purple-100 dark:bg-advocacy-purple-900/30 text-advocacy-purple-700 dark:text-advocacy-purple-300 rounded-full text-xs font-semibold">
                                        {{ guardian.guardian_type }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span class="text-platinum-600 dark:text-platinum-400">Relationship:</span>
                                        <span class="ml-1 text-abyss-900 dark:text-platinum-50">{{ guardian.relationship
                                            }}</span>
                                    </div>
                                    <div>
                                        <span class="text-platinum-600 dark:text-platinum-400">Phone:</span>
                                        <span class="ml-1 text-abyss-900 dark:text-platinum-50">{{ guardian.phone_number
                                            }}</span>
                                    </div>
                                    <div v-if="guardian.email" class="col-span-2">
                                        <span class="text-platinum-600 dark:text-platinum-400">Email:</span>
                                        <span class="ml-1 text-abyss-900 dark:text-platinum-50">{{ guardian.email
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Privacy Settings Quick View -->
                    <div
                        class="bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3
                                class="text-lg font-heading font-semibold text-abyss-900 dark:text-platinum-50 flex items-center gap-2">
                                <svg class="w-5 h-5 text-calm-lavender-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Privacy & Notifications
                            </h3>
                            <router-link to="/settings?tab=privacy"
                                class="text-sm text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-medium">
                                Manage
                            </router-link>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-3 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.profile_visibility === 'public' ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Profile</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50 capitalize">
                                    {{ profile?.privacy_settings?.profile_visibility || 'Private' }}
                                </p>
                            </div>

                            <div class="p-3 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.show_achievements ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Achievements</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.privacy_settings?.show_achievements ? 'Visible' : 'Hidden' }}
                                </p>
                            </div>

                            <div class="p-3 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
                                <svg class="w-6 h-6 mx-auto mb-2"
                                    :class="profile?.privacy_settings?.show_progress ? 'text-green-500' : 'text-platinum-400'"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p class="text-xs text-platinum-600 dark:text-platinum-400">Progress</p>
                                <p class="text-xs font-semibold text-abyss-900 dark:text-platinum-50">
                                    {{ profile?.privacy_settings?.show_progress ? 'Visible' : 'Hidden' }}
                                </p>
                            </div>

                            <div class="p-3 bg-platinum-50 dark:bg-abyss-700/50 rounded-lg text-center">
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
/* Additional custom styling if needed */
</style>