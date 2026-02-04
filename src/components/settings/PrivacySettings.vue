<template>
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <h3 class="text-lg font-medium text-abyss-900">Privacy & Visibility</h3>
            <p class="mt-1 text-sm text-gray-500">
                Control how your data is shared with the ProtectEd community.
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kaitoke-green-600"></div>
            <p class="mt-2 text-sm text-gray-500">Loading privacy settings...</p>
        </div>

        <!-- Privacy Settings -->
        <div v-else class="space-y-4">
            <!-- Profile Visibility -->
            <div class="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <GlobeIcon v-if="settings.profile_visibility === 'public'" class="h-5 w-5 text-green-600" />
                            <LockIcon v-else class="h-5 w-5 text-platinum-600" />
                            <p class="font-medium text-abyss-900">Profile Visibility</p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            {{ settings.profile_visibility === 'public'
                                ? 'Your profile is visible to other ProtectEd users'
                                : 'Your profile is private and only visible to you'
                            }}
                        </p>
                    </div>
                    <div class="ml-4">
                        <select v-model="settings.profile_visibility"
                            class="mt-1 block rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-kaitoke-green-500 focus:outline-none focus:ring-kaitoke-green-500">
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Show Achievements -->
            <div class="border rounded-lg p-4 transition-colors"
                :class="settings.profile_visibility === 'public' ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 opacity-60'">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <TrophyIcon class="h-5 w-5"
                                :class="settings.show_achievements ? 'text-yellow-600' : 'text-gray-400'" />
                            <p class="font-medium text-abyss-900">Show Achievements</p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            Display your badges and completed modules on your public profile.
                        </p>
                        <p v-if="settings.profile_visibility !== 'public'" class="mt-1 text-xs text-orange-600">
                            Only available when profile is public
                        </p>
                    </div>
                    <div class="ml-4">
                        <input type="checkbox" v-model="settings.show_achievements"
                            :disabled="settings.profile_visibility !== 'public'"
                            class="h-4 w-4 text-kaitoke-green-600 focus:ring-kaitoke-green-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                </div>
            </div>

            <!-- Show Progress -->
            <div class="border rounded-lg p-4 transition-colors"
                :class="settings.profile_visibility === 'public' ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 opacity-60'">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <ActivityIcon class="h-5 w-5"
                                :class="settings.show_progress ? 'text-blue-600' : 'text-gray-400'" />
                            <p class="font-medium text-abyss-900">Show Learning Progress</p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            Display your learning statistics and module completion status.
                        </p>
                        <p v-if="settings.profile_visibility !== 'public'" class="mt-1 text-xs text-orange-600">
                            Only available when profile is public
                        </p>
                    </div>
                    <div class="ml-4">
                        <input type="checkbox" v-model="settings.show_progress"
                            :disabled="settings.profile_visibility !== 'public'"
                            class="h-4 w-4 text-kaitoke-green-600 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                </div>
            </div>

            <!-- Allow Messages -->
            <div class="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <MessageSquareIcon class="h-5 w-5"
                                :class="settings.allow_messages ? 'text-purple-600' : 'text-gray-400'" />
                            <p class="font-medium text-abyss-900">Allow Direct Messages</p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            Let other users send you messages through the platform.
                        </p>
                    </div>
                    <div class="ml-4">
                        <input type="checkbox" v-model="settings.allow_messages"
                            class="h-4 w-4 text-kaitoke-green-600 focus:ring-kaitoke-green-500 border-gray-300 rounded" />
                    </div>
                </div>
            </div>

            <!-- Safety Notice -->
            <div class="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <ShieldCheckIcon class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-blue-900">Safety & Privacy Protection</p>
                        <p class="mt-1 text-xs text-blue-700">
                            Your personal information (address, phone number, emergency contacts) is always kept private
                            and never shared publicly, regardless of your profile visibility settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Info Box -->
        <div class="rounded-md bg-gray-50 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <EyeIcon class="h-5 w-5 text-gray-400" />
                </div>
                <div class="ml-3 flex-1">
                    <h3 class="text-sm font-medium text-abyss-900">What's Visible When Public?</h3>
                    <div class="mt-2 text-sm text-platinum-600 space-y-1">
                        <p><strong>Always Visible:</strong> Display name, bio, profile picture</p>
                        <p><strong>Optional:</strong> Achievements and learning progress (based on your settings above)
                        </p>
                        <p><strong>Never Visible:</strong> Email, phone number, address, emergency contacts, guardian
                            information</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
            <button @click="saveSettings" :disabled="isSaving || isLoading"
                class="inline-flex items-center px-6 py-2 bg-kaitoke-green-600 text-white text-sm font-medium rounded-md hover:bg-kaitoke-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kaitoke-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Privacy Preferences' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
    ShieldCheckIcon,
    GlobeIcon,
    LockIcon,
    TrophyIcon,
    ActivityIcon,
    MessageSquareIcon,
    EyeIcon
} from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const isLoading = ref(false);
const isSaving = ref(false);

const settings = ref({
    profile_visibility: 'private',
    show_achievements: true,
    show_progress: false,
    allow_messages: false
});

const loadSettings = async () => {
    isLoading.value = true;
    try {
        await profileStore.fetchPrivacySettings();
        if (profileStore.privacySettings) {
            settings.value = { ...profileStore.privacySettings };
        }
    } catch (error) {
        toast.error('Failed to load privacy settings');
    } finally {
        isLoading.value = false;
    }
};

const saveSettings = async () => {
    isSaving.value = true;

    try {
        const success = await profileStore.updatePrivacySettings(settings.value);

        if (success) {
            // Success toast already shown by store
        }
    } catch (error) {
        // Error toast already shown by store
        console.error('Save settings error:', error);
    } finally {
        isSaving.value = false;
    }
};

// Auto-disable achievements and progress when profile becomes private
watch(() => settings.value.profile_visibility, (newValue) => {
    if (newValue !== 'public') {
        settings.value.show_achievements = false;
        settings.value.show_progress = false;
    }
});

onMounted(() => {
    loadSettings();
});
</script>