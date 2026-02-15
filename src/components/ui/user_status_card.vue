<template>
    <div class="relative min-h-fit rounded-2xl dark:border-abyss-700 overflow-hidden">

        <!-- Gradient Cover -->
        <div
            class="relative bg-gradient-to-br from-calm-lavender-500 to-emerald-400 p-8 pt-15 mt-20 text-abyss-700 text-start rounded-t-2xl">
            <p class="text-xl text-abyss-500 font-bold font-body relative z-20">
                Welcome,
            </p>
            <h1 class="text-4xl font-black font-heading relative z-20">
                {{ firstName }}!
            </h1>
        </div>

        <!-- Avatar -->
        <img src="@/assets/happy-man-shows-the-likes.png" alt="Avatar"
            class="absolute top-0 -right-20 max-h-200 min-w-80 z-10 pointer-events-none select-none" />


        <!-- Stats Section -->
        <div class="relative z-30">
            <div
                class="p-8 text-center border border-emerald-200 dark:border-emerald-800 rounded-b-2xl bg-white dark:bg-abyss-800">
                <div class="mb-6">
                    <p
                        class="text-xs text-platinum-500 dark:text-platinum-400 mb-1 font-bold uppercase tracking-widest">
                        Lifetime Experience
                    </p>

                    <div class="flex items-baseline justify-center gap-1">
                        <span class="text-5xl font-black text-vawc-orange-600 tracking-tighter">
                            {{ totalPoints.toLocaleString() }}
                        </span>
                        <span class="text-sm font-bold text-platinum-400">XP</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3">

                    <!-- Modules -->
                    <div class="p-4 rounded-xl bg-safety-teal-50 dark:bg-safety-teal-500 text-center">
                        <p class="text-[10px] uppercase font-black mb-1 text-safety-teal-600 dark:text-abyss-300">
                            Modules
                        </p>
                        <p class="text-lg font-bold text-safety-teal-700 dark:text-abyss-700">
                            {{ modulesCompleted }}
                        </p>
                    </div>

                    <!-- Badges -->
                    <div class="p-4 rounded-xl bg-calm-lavender-50 dark:bg-calm-lavender-500 text-center">
                        <p class="text-[10px] uppercase font-black mb-1 text-calm-lavender-600 dark:text-abyss-300">
                            Badges
                        </p>
                        <p class="text-lg font-bold text-calm-lavender-700 dark:text-abyss-700">
                            {{ badgesCount }}
                        </p>
                    </div>

                    <!-- Rank -->
                    <div class="p-4 rounded-xl bg-vawc-orange-50 dark:bg-vawc-orange-500 text-center">
                        <p class="text-[10px] uppercase font-black mb-1 text-vawc-orange-600 dark:text-abyss-300">
                            Rank
                        </p>
                        <p class="text-lg font-bold text-vawc-orange-700 dark:text-abyss-700">
                            #{{ rank }}
                        </p>
                    </div>

                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
defineProps({
    firstName: String,
    totalPoints: Number,
    modulesCompleted: Number,
    badgesCount: Number,
    rank: Number
})
</script>
