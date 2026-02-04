<template>
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
            <h1 class="text-3xl font-heading font-bold text-abyss-900 dark:text-platinum-50">
                Account Settings
            </h1>
            <p class="mt-2 text-sm text-platinum-600 dark:text-platinum-400">
                Manage your ProtectEd profile, privacy, and security preferences.
            </p>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
            <aside class="w-full md:w-64 space-y-1">
                <nav class="flex flex-col space-y-1">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        class="group flex items-center px-4 py-3 text-sm font-medium border-l-4 transition-all duration-200 w-full text-left outline-none focus:ring-2 focus:ring-kaitoke-green-500/20 rounded-r-lg"
                        :class="[
                            activeTab === tab.id
                                ? 'bg-kaitoke-green-50 dark:bg-kaitoke-green-900/20 text-kaitoke-green-700 dark:text-kaitoke-green-400 border-kaitoke-green-600 dark:border-kaitoke-green-500'
                                : 'text-platinum-600 dark:text-platinum-400 hover:bg-platinum-50 dark:hover:bg-abyss-800 hover:text-abyss-900 dark:hover:text-platinum-200 border-transparent'
                        ]">
                        <component :is="tab.icon" class="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200"
                            :class="[
                                activeTab === tab.id
                                    ? 'text-kaitoke-green-600 dark:text-kaitoke-green-400'
                                    : 'text-platinum-400 group-hover:text-platinum-500 dark:text-platinum-500 dark:group-hover:text-platinum-300'
                            ]" />
                        {{ tab.name }}
                    </button>
                </nav>
            </aside>

            <main
                class="flex-1 bg-white dark:bg-abyss-800 rounded-xl shadow-sm border border-platinum-200 dark:border-abyss-700 p-6 sm:p-8">
                <transition mode="out-in" name="fade">
                    <component :is="currentComponent" />
                </transition>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { User, Shield, Bell, Users, Settings as SettingsIcon } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

// Lazy load sub-components
import ProfileSettings from '@/components/settings/ProfileSettings.vue';
import PrivacySettings from '@/components/settings/PrivacySettings.vue';
import GuardianSettings from '@/components/settings/GuardianSettings.vue';
import NotificationSettings from '@/components/settings/NotificationSettings.vue';
import AccountManagement from '@/components/settings/AccountManagement.vue';

const auth = useAuthStore();
const profileStore = useProfileStore();

const activeTab = ref('profile');

const tabs = [
    { id: 'profile', name: 'Profile', icon: User, component: ProfileSettings },
    { id: 'guardians', name: 'Guardians', icon: Users, component: GuardianSettings },
    { id: 'privacy', name: 'Privacy', icon: Shield, component: PrivacySettings },
    { id: 'notifications', name: 'Notifications', icon: Bell, component: NotificationSettings },
    { id: 'account', name: 'Account', icon: SettingsIcon, component: AccountManagement },
];

const currentComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value);
    return tab ? tab.component : ProfileSettings;
});

onMounted(async () => {
    if (auth.user) {
        await profileStore.fetchProfile(auth.user.id);
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(5px);
}
</style>