<template>
    <div
        class="flex h-[calc(100vh-7rem)] overflow-hidden bg-white dark:bg-abyss-800 rounded-2xl border border-platinum-200 dark:border-abyss-700 shadow-sm">
        <!-- Channel Sidebar -->
        <aside
            class="w-64 border-r border-platinum-100 dark:border-abyss-700 flex flex-col bg-platinum-50/50 dark:bg-abyss-900/20">
            <div class="p-4 border-b border-platinum-100 dark:border-abyss-700">
                <h2 class="font-bold text-abyss-900 dark:text-platinum-50 truncate">{{ classroom.name }}</h2>
                <p class="text-xs text-platinum-500 dark:text-platinum-400 mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ classroom.instructor }}
                </p>
            </div>

            <div class="px-4 py-2 border-b border-platinum-100 dark:border-abyss-700">
                <p class="text-xs text-platinum-400 dark:text-platinum-500 uppercase tracking-widest font-bold">
                    Channels
                </p>
            </div>

            <nav class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                <router-link v-for="channel in channels" :key="channel.id"
                    :to="{ name: 'classroom.channel', params: { id: $route.params.id, channelId: channel.id } }"
                    class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 group"
                    :class="$route.params.channelId == channel.id
                        ? 'bg-calm-lavender-600 text-white shadow-md'
                        : 'text-platinum-600 dark:text-platinum-400 hover:bg-platinum-100 dark:hover:bg-abyss-700'">
                    <span class="opacity-70">#</span>
                    <span class="flex-1 truncate">{{ channel.name }}</span>
                </router-link>
            </nav>

            <!-- Back to Classrooms Button -->
            <div class="p-3 border-t border-platinum-100 dark:border-abyss-700">
                <router-link :to="{ name: 'classroom.list' }"
                    class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-platinum-100 dark:bg-abyss-700 hover:bg-platinum-200 dark:hover:bg-abyss-600 text-platinum-700 dark:text-platinum-300 rounded-lg text-sm font-medium transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>All Classrooms</span>
                </router-link>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Tab Navigation -->
            <header
                class="h-14 border-b border-platinum-100 dark:border-abyss-700 flex items-center px-6 bg-white dark:bg-abyss-800">
                <div class="flex gap-6">
                    <router-link :to="{ name: 'classroom.home', params: { id: $route.params.id } }"
                        class="h-14 flex items-center border-b-2 text-sm font-bold transition-all border-transparent hover:text-calm-lavender-600"
                        :class="$route.name === 'classroom.home'
                            ? 'border-calm-lavender-600 text-calm-lavender-600'
                            : 'text-platinum-500 dark:text-platinum-400'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </router-link>

                    <router-link
                        :to="{ name: 'classroom.channel', params: { id: $route.params.id, channelId: $route.params.channelId || channels[0]?.id || 1 } }"
                        class="h-14 flex items-center border-b-2 text-sm font-bold transition-all border-transparent hover:text-calm-lavender-600"
                        :class="$route.name === 'classroom.channel'
                            ? 'border-calm-lavender-600 text-calm-lavender-600'
                            : 'text-platinum-500 dark:text-platinum-400'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Channels
                    </router-link>

                    <router-link :to="{ name: 'classroom.grades', params: { id: $route.params.id } }"
                        class="h-14 flex items-center border-b-2 text-sm font-bold transition-all border-transparent hover:text-calm-lavender-600"
                        :class="$route.name === 'classroom.grades'
                            ? 'border-calm-lavender-600 text-calm-lavender-600'
                            : 'text-platinum-500 dark:text-platinum-400'">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Grades
                    </router-link>
                </div>
            </header>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <router-view :key="$route.fullPath" :classroom="classroom" :channels="channels" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const classroom = ref({
    name: 'Cybersecurity 101',
    instructor: 'Prof. Sarah Jenkins',
    description: 'Welcome to the Cybersecurity fundamentals course. This class covers ethical hacking, network defense, and digital forensics.'
})

const channels = ref([
    { id: 1, name: 'general', instructions: 'Start here for announcements.', module: null },
    { id: 2, name: 'network-security', instructions: 'Read Chapter 4 before starting the module.', module: { id: 101, name: 'VPN & Firewalls', progress: 45 } },
    { id: 3, name: 'cryptography', instructions: 'Watch the introductory video.', module: { id: 102, name: 'AES Encryption', progress: 0 } }
])

// In real app, fetch classroom data based on route.params.id
onMounted(async () => {
    // TODO: Fetch classroom and channels from API
    // const { data } = await axios.get(`/api/classrooms/${route.params.id}`)
    // classroom.value = data.classroom
    // channels.value = data.channels
})
</script>

<style scoped>
@reference "@/style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-platinum-200 dark:bg-abyss-700 rounded-full;
}
</style>