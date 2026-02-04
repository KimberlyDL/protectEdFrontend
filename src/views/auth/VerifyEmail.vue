<template>
    <div
        class="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-platinum-50 dark:bg-abyss-900 transition-colors duration-300">

        <div class="absolute inset-0 z-0">
            <div
                class="absolute inset-0 animate-mesh-flow bg-[length:300%_300%] bg-gradient-to-br from-calm-lavender-500 via-azure-blue-600 to-neon-pink-500 opacity-30 dark:opacity-20">
            </div>

            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <filter id="blur-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" />
                    </filter>
                    <filter id="blur-heavy" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" />
                    </filter>
                </defs>

                <path class="animate-blob-1" fill="var(--color-azure-blue-400)" opacity="0.3" filter="url(#blur-soft)"
                    d="M35.6,-48.2C44.3,-41.1,48.1,-28.4,50.7,-15.8C53.3,-3.2,54.7,9.3,50.8,20.4C46.9,31.5,37.7,41.2,26.7,47.8C15.7,54.4,2.9,57.9,-10.1,56C-23.1,54.1,-36.3,46.7,-45.8,35.8C-55.3,24.9,-61,10.4,-60.1,-3.5C-59.2,-17.4,-51.7,-30.7,-41.2,-38.2C-30.7,-45.7,-17.3,-47.4,-2.8,-43.5C11.7,-39.6,26.9,-55.3,35.6,-48.2Z"
                    transform="translate(20 30)" />
                <path class="animate-blob-2" fill="var(--color-neon-pink-400)" opacity="0.2" filter="url(#blur-heavy)"
                    d="M38.1,-52.1C49.1,-45.3,57.5,-33.5,61.4,-20.3C65.3,-7.1,64.7,7.4,59.3,20.1C53.9,32.8,43.6,43.7,31.5,50.6C19.4,57.5,5.5,60.4,-8.6,58.8C-22.7,57.2,-37,51.1,-47.4,40.9C-57.8,30.7,-64.3,16.4,-65,1.5C-65.7,-13.4,-60.6,-28.9,-51.1,-37.2C-41.6,-45.5,-27.7,-46.6,-15.5,-52.5C-3.3,-58.4,7.2,-58.9,38.1,-52.1Z"
                    transform="translate(80 20)" />

                <g class="bubbles" opacity="0.5">
                    <circle class="animate-bubble-slow" cx="15" cy="110" r="3" fill="white" filter="url(#blur-soft)" />
                    <circle class="animate-bubble-fast" cx="80" cy="110" r="1.5" fill="white"
                        filter="url(#blur-soft)" />
                    <circle class="animate-bubble-med" cx="45" cy="110" r="2" fill="white" />
                </g>
            </svg>
        </div>

        <div
            class="relative z-10 max-w-md w-full text-center p-10 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-abyss-800/80 border border-white/20 dark:border-abyss-700 animate-in fade-in zoom-in duration-500">

            <div v-if="status === 'loading'">
                <div class="relative mx-auto h-16 w-16 mb-6">
                    <div
                        class="absolute inset-0 rounded-full border-4 border-platinum-200 dark:border-abyss-600 opacity-20">
                    </div>
                    <div class="absolute inset-0 rounded-full border-4 border-t-calm-lavender-500 animate-spin"></div>
                </div>
                <h2 class="text-2xl font-heading font-bold text-abyss-900 dark:text-platinum-50 mb-2">Verifying Account
                </h2>
                <p class="text-platinum-600 dark:text-platinum-400">Securing your protectEd credentials...</p>
            </div>

            <div v-else-if="status === 'success'">
                <div
                    class="mx-auto w-16 h-16 bg-calm-lavender-100 dark:bg-calm-lavender-900/40 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg class="w-8 h-8 text-calm-lavender-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="text-2xl font-heading font-bold text-abyss-900 dark:text-platinum-50 mb-2">Verified!</h2>
                <p class="text-platinum-600 dark:text-platinum-400 mb-8 leading-relaxed">Your email is confirmed. You
                    can now access your intelligent document vault.</p>
                <router-link :to="{ name: 'login' }"
                    class="w-full inline-flex items-center justify-center py-3.5 px-6 bg-calm-lavender-600 text-white font-bold rounded-xl hover:bg-calm-lavender-700 focus:ring-4 focus:ring-calm-lavender-500/30 transition-all shadow-lg hover:shadow-calm-lavender-500/20">
                    Sign In
                </router-link>
            </div>

            <div v-else>
                <div
                    class="mx-auto w-16 h-16 bg-neon-pink-100 dark:bg-neon-pink-900/40 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-8 h-8 text-neon-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 class="text-2xl font-heading font-bold text-abyss-900 dark:text-platinum-50 mb-2">Verification Error
                </h2>
                <p class="text-platinum-600 dark:text-platinum-400 mb-8">{{ errorMessage }}</p>
                <div class="flex flex-col gap-4">
                    <router-link :to="{ name: 'verify-notice' }"
                        class="w-full py-3.5 bg-azure-blue-600 text-white font-bold rounded-xl hover:bg-azure-blue-700 transition-all shadow-lg hover:shadow-azure-blue-500/20">
                        Resend Link
                    </router-link>
                    <router-link :to="{ name: 'login' }"
                        class="text-sm font-bold text-calm-lavender-600 dark:text-calm-lavender-400 hover:text-neon-pink-500 transition-colors">
                        Back to Sign In
                    </router-link>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Gradient Mesh Animation */
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

/* Blob Morphing */
@keyframes morph-float-1 {

    0%,
    100% {
        transform: translate(20px, 30px) scale(1);
    }

    50% {
        transform: translate(30px, 20px) scale(1.1);
    }
}

@keyframes morph-float-2 {

    0%,
    100% {
        transform: translate(80px, 20px) rotate(0deg);
    }

    50% {
        transform: translate(70px, 35px) rotate(-15deg);
    }
}

.animate-blob-1 {
    animation: morph-float-1 18s ease-in-out infinite;
}

.animate-blob-2 {
    animation: morph-float-2 25s ease-in-out infinite;
}

/* Bubble Rise */
@keyframes bubble-rise {
    0% {
        transform: translateY(0);
        opacity: 0;
    }

    15% {
        opacity: 0.5;
    }

    85% {
        opacity: 0.5;
    }

    100% {
        transform: translateY(-120vh);
        opacity: 0;
    }
}

.animate-bubble-slow {
    animation: bubble-rise 25s linear infinite;
}

.animate-bubble-med {
    animation: bubble-rise 18s linear infinite;
    animation-delay: 2s;
}

.animate-bubble-fast {
    animation: bubble-rise 12s linear infinite;
    animation-delay: 4s;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthShellSvg from "@components/ui/auth_animated_bg.vue"
import api from '@/utils/api'

const hero = "/illustrations_1.jpg"
const artist = "Charlie Davis"

const route = useRoute()
const status = ref('loading') // 'loading' | 'success' | 'error'
const errorMessage = ref('')

onMounted(async () => {
    const token = route.query.token

    if (!token) {
        status.value = 'error'
        errorMessage.value = 'The verification token is missing or corrupted.'
        return
    }

    try {
        // Hits backend: router.get('/verify-email', authController.verifyEmail)
        await api.get(`/api/v1/auth/verify-email?token=${token}`)
        status.value = 'success'
    } catch (error) {
        status.value = 'error'
        errorMessage.value = error.response?.data?.message || 'The verification link is invalid or has expired.'
    }
})
</script>