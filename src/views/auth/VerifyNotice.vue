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
            class="relative z-10 w-full max-w-md rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-abyss-800/80 border border-white/20 dark:border-abyss-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-500">

            <div class="mb-8">
                <div
                    class="w-14 h-14 rounded-2xl bg-calm-lavender-100 dark:bg-calm-lavender-900/30 flex items-center justify-center mb-6 text-calm-lavender-600 dark:text-calm-lavender-400 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h1 class="text-3xl font-bold font-heading text-abyss-900 dark:text-platinum-50">Verify your email</h1>
                <p class="text-sm text-platinum-600 dark:text-platinum-400 mt-3 leading-relaxed">
                    We sent a verification link to
                    <span class="font-bold text-calm-lavender-600 dark:text-calm-lavender-400">{{ model.email || 
                    "your email" }}</span>.
                    Please check your inbox to continue.
                </p>
            </div>

            <form @submit.prevent="onResend" class="space-y-5">
                <div>
                    <label
                        class="block text-xs font-bold uppercase tracking-wider mb-2 text-abyss-900 dark:text-platinum-100 opacity-70">
                        Email Address
                    </label>
                    <input v-model.trim="model.email" type="email" inputmode="email" autocomplete="email" class="w-full px-4 py-3 rounded-xl border border-platinum-300 dark:border-abyss-600 
                   bg-platinum-50/50 dark:bg-abyss-900/50 text-abyss-900 dark:text-platinum-50
                   placeholder-platinum-400 dark:placeholder-platinum-500
                   focus:outline-none focus:ring-2 focus:ring-calm-lavender-500/50 focus:border-calm-lavender-500
                   transition-all duration-200" :disabled="isLoading || cooldown > 0" placeholder="name@example.com" />
                    <p v-if="errs.email" class="mt-1.5 text-xs font-medium text-neon-pink-500">{{ errs.email }}</p>
                </div>

                <div class="flex flex-col gap-3 pt-2">
                    <button type="submit"
                        class="w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-bold text-white
                   bg-calm-lavender-600 hover:bg-calm-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed 
                   focus:ring-4 focus:ring-calm-lavender-500/30 transition-all duration-200 shadow-lg shadow-calm-lavender-500/20"
                        :disabled="isLoading || !isValidEmail || cooldown > 0">
                        <span v-if="!isLoading && cooldown === 0">Resend Verification</span>
                        <span v-else-if="cooldown > 0">Resend in {{ cooldown }}s</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                        </span>
                    </button>

                    <button type="button" class="w-full rounded-xl px-6 py-3 border border-platinum-300 dark:border-abyss-600
                   bg-white dark:bg-abyss-900/30 text-abyss-700 dark:text-platinum-200 font-bold 
                   hover:bg-platinum-50 dark:hover:bg-abyss-700/50 text-sm transition-all duration-200"
                        :disabled="isLoading" @click="refreshFromQuery">
                        Reload URL
                    </button>
                </div>
            </form>

            <div
                class="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest border-t border-platinum-200 dark:border-abyss-700 pt-6">
                <router-link
                    class="text-platinum-600 dark:text-platinum-400 hover:text-calm-lavender-600 transition-colors"
                    :to="{ name: 'login' }">
                    &larr; Sign In
                </router-link>
                <router-link
                    class="text-platinum-600 dark:text-platinum-400 hover:text-calm-lavender-600 transition-colors"
                    :to="{ name: 'signup' }">
                    New Account
                </router-link>
            </div>

            <div
                class="mt-6 rounded-2xl bg-azure-blue-50 dark:bg-azure-blue-900/10 border border-azure-blue-200 dark:border-azure-blue-900/30 p-4 text-sm">
                <div class="flex gap-3">
                    <svg class="w-5 h-5 text-azure-blue-600 dark:text-azure-blue-400 flex-shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-azure-blue-800 dark:text-azure-blue-200/80 leading-snug">
                        <span class="font-bold block mb-0.5 text-azure-blue-900 dark:text-azure-blue-100">Pro
                            Tip:</span>
                        Check your spam folder. Link valid for a limited time.
                    </p>
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
    animation: mesh-flow 25s ease-in-out infinite;
}

/* Blob Morphing */
@keyframes morph-float-1 {

    0%,
    100% {
        transform: translate(25px, 35px) rotate(0deg) scale(1);
    }

    50% {
        transform: translate(35px, 20px) rotate(15deg) scale(1.1);
    }
}

@keyframes morph-float-2 {

    0%,
    100% {
        transform: translate(85px, 20px) rotate(0deg);
    }

    50% {
        transform: translate(70px, 35px) rotate(-20deg) scale(1.2);
    }
}

.animate-blob-1 {
    animation: morph-float-1 20s ease-in-out infinite;
}

.animate-blob-2 {
    animation: morph-float-2 30s ease-in-out infinite;
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
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from '@/utils/useToast';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const COOLDOWN_SEC = 60;

const model = reactive({
    email: route.query.email?.toString() || auth.pendingEmail || "",
});

const errs = reactive({ email: "" });
const isLoading = ref(false);
const cooldown = ref(0);
let timer = null;

const isValidEmail = computed(() => {
    const v = model.email?.trim() || "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
});

function startCooldown() {
    cooldown.value = COOLDOWN_SEC;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        cooldown.value -= 1;
        if (cooldown.value <= 0) {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function refreshFromQuery() {
    const q = route.query.email?.toString() || "";
    if (q) model.email = q;
}

async function onResend() {
    errs.email = "";

    if (!isValidEmail.value) {
        errs.email = "Please enter a valid email.";
        return;
    }

    try {
        isLoading.value = true;
        auth.setPendingEmail(model.email);

        await auth.resendVerificationEmail(model.email);

        toast.success("If that email exists and is unverified, we sent a new verification link.");

        if (cooldown.value === 0) startCooldown();
    } catch (e) {
        toast.error(e?.response?.data?.message || "Unable to send email right now. Please try again.");
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    if (!model.email && auth.pendingEmail) model.email = auth.pendingEmail;
});

onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
});

watch(() => model.email, (val) => auth.setPendingEmail(val));
</script>