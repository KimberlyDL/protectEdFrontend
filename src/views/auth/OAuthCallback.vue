<template>
    <div
        class="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-platinum-50 dark:bg-abyss-900 transition-colors duration-300">

        <div class="absolute inset-0 z-0">
            <div
                class="absolute inset-0 animate-mesh-flow bg-[length:300%_300%] bg-gradient-to-br from-calm-lavender-500 via-azure-blue-600 to-neon-pink-500 opacity-25">
            </div>

            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <filter id="blur-soft">
                        <feGaussianBlur stdDeviation="3" />
                    </filter>
                </defs>
                <path class="animate-blob-1" fill="var(--color-azure-blue-400)" opacity="0.3" filter="url(#blur-soft)"
                    d="M35.6,-48.2C44.3,-41.1,48.1,-28.4,50.7,-15.8C53.3,-3.2,54.7,9.3,50.8,20.4C46.9,31.5,37.7,41.2,26.7,47.8C15.7,54.4,2.9,57.9,-10.1,56C-23.1,54.1,-36.3,46.7,-45.8,35.8C-55.3,24.9,-61,10.4,-60.1,-3.5C-59.2,-17.4,-51.7,-30.7,-41.2,-38.2C-30.7,-45.7,-17.3,-47.4,-2.8,-43.5C11.7,-39.6,26.9,-55.3,35.6,-48.2Z"
                    transform="translate(25 35)" />
            </svg>
        </div>

        <div
            class="relative z-10 max-w-sm w-full text-center p-10 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-abyss-800/80 border border-white/20 dark:border-abyss-700 animate-in fade-in zoom-in">

            <div v-if="!error" class="space-y-6">
                <div class="relative mx-auto h-16 w-16">
                    <div
                        class="absolute inset-0 rounded-full border-4 border-platinum-200 dark:border-abyss-600 opacity-20">
                    </div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-calm-lavender-600 animate-spin"></div>
                </div>
                <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50">Signing you in...</h2>
                <p class="text-platinum-600 dark:text-platinum-400">Exchanging credentials with Google Secure Auth.</p>
            </div>

            <div v-else class="space-y-6">
                <div
                    class="mx-auto w-16 h-16 bg-neon-pink-100 dark:bg-neon-pink-900/30 rounded-full flex items-center justify-center text-neon-pink-500">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-abyss-900 dark:text-platinum-50">Auth Failed</h2>
                <p class="text-platinum-600 dark:text-platinum-400">{{ error }}</p>
                <router-link :to="{ name: 'login' }"
                    class="block w-full py-3 bg-calm-lavender-600 text-white font-bold rounded-xl">Try
                    Again</router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '@/utils/api';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const error = ref(null);

onMounted(async () => {
    const code = route.query.code;
    if (!code) {
        error.value = "Authorization code not found.";
        return;
    }

    try {
        const { data } = await api.post('/api/v1/auth/google/exchange', { code });
        setAuthToken(data.token);
        auth.user = data.user;
        toast.success(`Welcome back, ${data.user.name || 'User'}!`);
        router.replace({ name: 'user.dashboard' });
    } catch (err) {
        error.value = err.response?.data?.message || "Google sync failed.";
    }
});
</script>

<style scoped>
@keyframes mesh-flow {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

.animate-mesh-flow {
    animation: mesh-flow 20s ease-in-out infinite;
}

@keyframes morph-float-1 {

    0%,
    100% {
        transform: translate(25px, 35px) scale(1);
    }

    50% {
        transform: translate(35px, 20px) scale(1.1);
    }
}

.animate-blob-1 {
    animation: morph-float-1 18s ease-in-out infinite;
}
</style>