<script setup>
import { ref, watch, nextTick, defineExpose, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { UserIcon, SettingsIcon, LogOutIcon, MoreVertical } from 'lucide-vue-next';

const props = defineProps({
    expanded: Boolean,
    open: Boolean,
    triggerRef: Object // Passed from FacilitatorSidebar for positioning
});

const emit = defineEmits(['update:open']);
const router = useRouter();
const authStore = useAuthStore();
const dropdownRef = ref(null);

// Logic: Shared Repositioning
const reposition = async () => {
    if (!props.open || !dropdownRef.value || !props.triggerRef) return;
    await nextTick();
    const { x, y } = await computePosition(props.triggerRef, dropdownRef.value, {
        placement: 'right-end',
        middleware: [offset(12), flip(), shift({ padding: 8 })],
    });
    Object.assign(dropdownRef.value.style, { left: `${x}px`, top: `${y}px` });
};

watch(() => props.open, (val) => val && reposition());

const handleLogout = async () => {
    emit('update:open', false);
    await authStore.logout();
    router.push('/facilitator/login');
};

const handleAction = (routeName) => {
    emit('update:open', false);
    router.push({ name: routeName });
};

const avatar = computed(() => authStore.user?.avatar_url || `https://ui-avatars.com/api/?name=${authStore.user?.name || 'Facilitator'}&background=84cc16&color=fff`);

// Expose internal dropdown element for the sidebar's Floating UI logic
defineExpose({ $el: dropdownRef });
</script>

<template>
    <div class="relative">
        <div
            class="group w-full flex items-center transition-all duration-300"
            :class="[
                expanded 
                    ? 'justify-between p-4 bg-gray-50/50 dark:bg-abyss-950/40' 
                    : 'justify-center p-4' // Cleaned up p-2 to p-4 to match Admin height
            ]"
        >
            <div class="flex items-center gap-3 min-w-0">
                <div class="relative flex-shrink-0">
                    <button v-if="!expanded" type="button" @click.stop="emit('update:open', !open)" class="outline-none">
                        <img :src="avatar" 
                            class="h-10 w-10 rounded-full object-cover border-2 border-electric-lime-500 shadow-lg shadow-electric-lime-500/20 group-hover:scale-110 transition-transform" />
                    </button>
                    <img v-else :src="avatar" 
                        class="h-10 w-10 rounded-full object-cover border-2 border-electric-lime-500 shadow-sm" />
                    
                    <span class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-abyss-900 rounded-full"></span>
                </div>

                <div v-if="expanded" class="flex-1 min-w-0 text-left animate-in fade-in slide-in-from-left-2">
                    <p class="text-xs font-bold text-abyss-900 dark:text-white truncate">
                        {{ authStore.user?.name || 'Facilitator' }}
                    </p>
                    <p class="text-[10px] text-gray-500 dark:text-platinum-400 truncate uppercase font-semibold">
                        Facilitator
                    </p>
                </div>
            </div>

            <button
                v-if="expanded"
                type="button"
                @click.stop="emit('update:open', !open)"
                class="p-1.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-abyss-700 transition-colors flex-shrink-0 outline-none"
            >
                <MoreVertical class="h-4 w-4 stroke-[2] text-gray-400" />
            </button>
        </div>

        <transition name="fade-pop">
            <div v-if="open" ref="dropdownRef"
                class="fixed z-50 w-56 bg-white dark:bg-abyss-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-abyss-700 overflow-hidden">
                
                <div class="px-4 py-3 border-b border-gray-100 dark:border-abyss-700 bg-gray-50/50 dark:bg-abyss-900/20">
                    <p class="text-xs font-bold text-abyss-900 dark:text-platinum-50 truncate">
                        {{ authStore.user?.name || 'Facilitator' }}
                    </p>
                    <p class="text-[10px] text-electric-lime-600 truncate uppercase tracking-widest font-black">
                        Facilitator Portal
                    </p>
                </div>

                <div class="p-2 space-y-1">
                    <button @click="handleAction('facilitator.profile')" class="menu-item group">
                        <UserIcon class="h-4 w-4 text-gray-400 group-hover:text-electric-lime-600 transition-colors" />
                        <span class="font-medium">My Profile</span>
                    </button>
                    <button @click="handleAction('facilitator.settings')" class="menu-item group">
                        <SettingsIcon class="h-4 w-4 text-gray-400 group-hover:text-electric-lime-600 transition-colors" />
                        <span class="font-medium">Account Settings</span>
                    </button>
                    <div class="my-1 border-t border-gray-100 dark:border-abyss-700"></div>
                    <button @click="handleLogout" class="menu-item group text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                        <LogOutIcon class="h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors" />
                        <span class="font-bold">Logout</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
@reference "@/style.css";   

.menu-item { 
    @apply w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded-lg transition-all 
           hover:bg-gray-50 dark:hover:bg-abyss-700/50 text-abyss-900 dark:text-platinum-200; 
}

.fade-pop-enter-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-pop-enter-from { opacity: 0; transform: scale(0.95) translateX(-10px); }
.fade-pop-leave-to { opacity: 0; transform: scale(0.95); }
</style>