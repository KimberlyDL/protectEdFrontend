<template>
    <AuthShellSvg page-title="Facilitator Login" :hero-image="hero" :artist="artist">
        <div class="w-full max-w-md mx-auto">
            <!-- Header Section -->
            <div class="mb-8 text-center sm:text-left">
                <div class="flex items-center gap-2 mb-3">
                    <School :size="32" :stroke-width="1.50" class="text-calm-lavender-600 dark:text-calm-lavender-400" />
                    <h1 class="text-3xl font-heading font-bold text-abyss-900 dark:text-platinum-50">
                        Facilitator Portal
                    </h1>
                </div>
                <p class="text-platinum-600 dark:text-platinum-400">
                    Access your educator dashboard and manage student learning.
                </p>
            </div>

            <!-- Info Banner (First Time Setup) -->
            <div v-if="showFirstTimeNotice"
                class="mb-6 p-4 rounded-lg bg-azure-blue-50 dark:bg-azure-blue-900/20 border border-azure-blue-200 dark:border-azure-blue-800">
                <div class="flex gap-3">
                    <svg class="w-5 h-5 text-azure-blue-600 dark:text-azure-blue-400 flex-shrink-0 mt-0.5" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="flex-1">
                        <h3 class="text-sm font-semibold text-azure-blue-900 dark:text-azure-blue-100 mb-1">
                            First time logging in?
                        </h3>
                        <p class="text-xs text-azure-blue-700 dark:text-azure-blue-300">
                            Use the temporary password provided by your administrator, then you'll be prompted to create
                            a new secure password.
                        </p>
                    </div>
                    <button @click="showFirstTimeNotice = false" class="text-azure-blue-400 hover:text-azure-blue-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Main Form Card -->
            <div class="bg-platinum-50 dark:bg-abyss-700 rounded-2xl shadow-xl">
                <form @submit.prevent="handleLogin" class="space-y-5">

                    <!-- Email Input -->
                    <div class="space-y-1.5">
                        <label for="email" class="block text-sm font-medium text-abyss-900 dark:text-platinum-100">
                            Work Email Address
                        </label>
                        <input id="email" v-model.trim="form.email" type="email" placeholder="facilitator@school.edu"
                            required autocomplete="username" class="w-full px-4 py-3 rounded-lg border border-platinum-300 dark:border-abyss-400 
                                   bg-platinum-50 dark:bg-abyss-700/50 text-abyss-900 dark:text-platinum-50
                                   placeholder-platinum-400 dark:placeholder-platinum-500
                                   focus:outline-none focus:ring-2 focus:ring-azure-blue-500/50 focus:border-azure-blue-500
                                   transition-all duration-200"
                            :class="{ 'border-red-500 focus:ring-red-500/50 focus:border-red-500': errors.email }" />
                        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
                    </div>

                    <!-- Password Input -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label for="password"
                                class="block text-sm font-medium text-abyss-900 dark:text-platinum-100">
                                Password
                            </label>
                            <router-link :to="{ name: 'facilitator.forgotPassword' }"
                                class="text-xs font-medium text-azure-blue-600 dark:text-azure-blue-400 hover:text-azure-blue-700 hover:underline transition-colors">
                                Forgot password?
                            </router-link>
                        </div>
                        <input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                            autocomplete="current-password" class="w-full px-4 py-3 rounded-lg border border-platinum-300 dark:border-abyss-400 
                                   bg-platinum-50 dark:bg-abyss-700/50 text-abyss-900 dark:text-platinum-50
                                   placeholder-platinum-400 dark:placeholder-platinum-500
                                   focus:outline-none focus:ring-2 focus:ring-azure-blue-500/50 focus:border-azure-blue-500
                                   transition-all duration-200"
                            :class="{ 'border-red-500 focus:ring-red-500/50 focus:border-red-500': errors.password }" />
                        <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
                    </div>

                    <!-- Remember Me -->
                    <div class="flex items-center">
                        <input id="remember" v-model="form.rememberMe" type="checkbox"
                            class="w-4 h-4 text-azure-blue-600 border-platinum-300 rounded focus:ring-azure-blue-500 dark:border-abyss-400 dark:bg-abyss-700" />
                        <label for="remember" class="ml-2 text-sm text-platinum-600 dark:text-platinum-400">
                            Remember me on this device
                        </label>
                    </div>

                    <!-- Login Button -->
                    <button type="submit" :disabled="isLoading || isGoogleLoading"
                        class="w-full py-3 px-4 bg-calm-lavender-600 text-white font-semibold rounded-lg 
                               hover:bg-calm-lavender-700 focus:ring-4 focus:ring-calm-lavender-500/30
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <span v-if="!isLoading">Sign In to Portal</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </span>
                    </button>
                </form>

                <!-- Help Section -->
                <div class="mt-6 pt-6 border-t border-platinum-200 dark:border-abyss-600">
                    <p class="text-sm text-center text-platinum-600 dark:text-platinum-400">
                        Need help accessing your account?
                        <a href="mailto:support@protected.edu"
                            class="text-azure-blue-600 dark:text-azure-blue-400 hover:underline font-medium">
                            Contact Administrator
                        </a>
                    </p>
                </div>
            </div>

            <!-- Student Login Link -->
            <div class="mt-6 text-center">
                <p class="text-sm text-platinum-600 dark:text-platinum-400">
                    Are you a student?
                    <router-link :to="{ name: 'login' }"
                        class="text-calm-lavender-600 dark:text-calm-lavender-400 hover:underline font-semibold">
                        Student Login
                    </router-link>
                </p>
            </div>
        </div>
    </AuthShellSvg>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import AuthShellSvg from "@components/ui/auth_animated_bg.vue";
import { School } from 'lucide-vue-next'

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
    email: '',
    password: '',
    rememberMe: false
});

const errors = ref({});
const isLoading = ref(false);
const showFirstTimeNotice = ref(true);

// Hero image for facilitator theme
const hero = ref('/images/facilitator-hero.svg');
const artist = ref({ name: 'Educational Team', url: '#' });

const handleLogin = async () => {
    errors.value = {};
    isLoading.value = true;

    try {
        const result = await authStore.login({
            email: form.value.email,
            password: form.value.password
        });

        if (result.ok && result.user) {
            // Check if user is educator or admin
            if (!['educator', 'admin'].includes(result.user.role)) {
                toast.error('This portal is for facilitators only. Please use the student login.');
                await authStore.logout();
                return;
            }

            toast.success('Welcome back, ' + (result.user.name || 'Facilitator'));

            // Check if this is first login (password needs to be changed)
            // You could add a flag like 'requires_password_change' to the user model
            if (result.user.requires_password_change) {
                router.push({ name: 'facilitator.changePassword', query: { firstLogin: true } });
            } else {
                router.push({ name: 'facilitator.dashboard' });
            }
        }
    } catch (error) {
        if (error.unverified) {
            toast.warning('Please verify your email address first.');
            authStore.setPendingEmail(error.email);
            router.push({ name: 'verify-notice' });
        } else {
            toast.error(error.message || 'Invalid credentials. Please try again.');
            errors.value.email = error.message;
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    // Clear any existing session for security
    if (authStore.isAuthenticated) {
        authStore.logout();
    }
});
</script>

<style scoped>
/* Additional facilitator-specific styling if needed */
</style>