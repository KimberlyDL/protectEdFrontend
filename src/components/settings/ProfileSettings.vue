<template>
    <div class="space-y-8 divide-y divide-gray-200">
        <div class="space-y-6 sm:pt-0">
            <div>
                <h3 class="text-lg font-medium leading-6 text-abyss-900">Public Profile</h3>
                <p class="mt-1 text-sm text-platinum-600">
                    This information will be displayed publicly if your profile visibility is set to public.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row items-start gap-6">
                <div class="relative flex flex-col items-center gap-2">
                    <div class="relative group">
                        <img :src="avatarPreview || profileStore.avatarUrl(200)" alt="Profile Avatar"
                            class="h-32 w-32 rounded-full object-cover border-4 border-kaitoke-green-100 shadow-lg transition-transform" />

                        <div v-if="profileStore.isUploading"
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-white text-sm font-medium">{{ profileStore.uploadProgress }}%</div>
                                <div class="w-16 h-1 bg-gray-300 rounded-full mt-2 overflow-hidden">
                                    <div class="h-full bg-kaitoke-green-500 transition-all duration-300"
                                        :style="{ width: profileStore.uploadProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <label v-if="!pendingFile"
                            class="absolute bottom-0 right-0 bg-kaitoke-green-600 rounded-full p-2 shadow-lg border-2 border-white cursor-pointer hover:bg-kaitoke-green-700 transition-colors"
                            :class="{ 'opacity-50 cursor-not-allowed': profileStore.isUploading }">
                            <CameraIcon class="h-5 w-5 text-white" />
                            <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp"
                                @change="handleFileSelect" :disabled="profileStore.isUploading" />
                        </label>
                    </div>

                    <div v-if="pendingFile" class="flex gap-2 mt-2">
                        <button @click="confirmAvatarUpload" :disabled="profileStore.isUploading"
                            class="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700 shadow-sm transition-colors flex items-center gap-1">
                            Confirm
                        </button>
                        <button @click="cancelAvatarSelection" :disabled="profileStore.isUploading"
                            class="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm transition-colors">
                            Cancel
                        </button>
                    </div>

                    <div v-else class="flex gap-2 mt-2">
                        <button v-if="hasCustomAvatar" @click="handleDeleteAvatar"
                            class="text-xs text-red-600 hover:text-red-800 font-medium"
                            :disabled="profileStore.isUploading">
                            Remove Avatar
                        </button>
                    </div>

                    <p class="text-xs text-gray-500 text-center max-w-[200px]">JPG, PNG or WebP. Max 5MB.</p>
                </div>

                <div class="flex-1 space-y-4 w-full">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Display Name</label>
                        <input v-model="profileData.display_name" type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm"
                            placeholder="How others see you" maxlength="100" />
                        <p class="mt-1 text-xs text-gray-500">{{ profileData.display_name?.length || 0 }}/100 characters
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea v-model="profileData.bio" rows="3" maxlength="500"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm"
                            placeholder="Tell us about yourself (max 500 characters)"></textarea>
                        <p class="mt-1 text-xs text-gray-500">{{ profileData.bio?.length || 0 }}/500 characters</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="pt-8 space-y-6">
            <div>
                <h3 class="text-lg font-medium leading-6 text-abyss-900">Personal Information</h3>
                <p class="mt-1 text-sm text-platinum-600">This data is private and only used for platform safety and
                    verification.</p>
            </div>

            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input v-model="profileData.date_of_birth" type="date" :max="maxBirthDate"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                    <p v-if="profileData.date_of_birth" class="mt-1 text-xs text-gray-500">Age: {{
                        calculateAge(profileData.date_of_birth) }} years</p>
                </div>

                <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Sex</label>
                    <select v-model="profileData.sex"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>

                <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Gender Identity (Optional)</label>
                    <input v-model="profileData.gender_identity" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm"
                        placeholder="How you identify" />
                </div>

                <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input v-model="profileData.phone_number" type="text" placeholder="+639XXXXXXXXX"
                            class="block w-full rounded-md border-gray-300 focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                    </div>
                    <p class="mt-1 text-xs text-gray-500">Format: +639XXXXXXXXX</p>
                </div>
            </div>
        </div>

        <div class="pt-8 space-y-6">
            <div>
                <h3 class="text-lg font-medium leading-6 text-abyss-900">Address</h3>
                <p class="mt-1 text-sm text-platinum-600">Optional - For emergency contact purposes only.</p>
            </div>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-6">
                    <label class="block text-sm font-medium text-gray-700">Address Line 1</label>
                    <input v-model="profileData.address_line1" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>
                <div class="sm:col-span-6">
                    <label class="block text-sm font-medium text-gray-700">Address Line 2</label>
                    <input v-model="profileData.address_line2" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">City</label>
                    <input v-model="profileData.city" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Province</label>
                    <input v-model="profileData.province" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input v-model="profileData.postal_code" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>
            </div>
        </div>

        <div class="pt-8">
            <div class="flex justify-end gap-3">
                <button type="button" @click="resetForm"
                    class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                    Reset
                </button>
                <button @click="saveProfile" :disabled="isSaving"
                    class="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-kaitoke-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-kaitoke-green-700 focus:outline-none focus:ring-2 focus:ring-kaitoke-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isSaving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { CameraIcon } from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toast = useToast();

const isSaving = ref(false);
const avatarPreview = ref(null);
const pendingFile = ref(null);

const profileData = ref({
    display_name: '',
    bio: '',
    date_of_birth: '',
    sex: '',
    gender_identity: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Philippines',
    avatar_url: ''
});

// === HELPER: Format Date for Input ===
const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    // Take the first 10 characters (YYYY-MM-DD) from ISO string
    return isoDate.split('T')[0];
};

// === HELPER: Fill Form Data ===
const fillProfileData = (sourceData) => {
    if (!sourceData) return;

    // Spread data first
    profileData.value = { ...sourceData };

    // FIX: Manually format date so input[type="date"] accepts it
    if (sourceData.date_of_birth) {
        profileData.value.date_of_birth = formatDateForInput(sourceData.date_of_birth);
    }
};

const hasCustomAvatar = computed(() => {
    return profileStore.profile?.avatar_url &&
        !profileStore.profile.avatar_url.includes('ui-avatars.com');
});

const maxBirthDate = computed(() => {
    const today = new Date();
    const minAge = 13;
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
});

const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    avatarPreview.value = URL.createObjectURL(file);
    pendingFile.value = file;
    event.target.value = '';
};

const confirmAvatarUpload = async () => {
    if (!pendingFile.value) return;
    const success = await profileStore.uploadAvatar(pendingFile.value);
    if (success) {
        pendingFile.value = null;
        avatarPreview.value = null;
    }
};

const cancelAvatarSelection = () => {
    pendingFile.value = null;
    avatarPreview.value = null;
};

const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) return;
    const success = await profileStore.deleteAvatar();
    if (success) avatarPreview.value = null;
};

const saveProfile = async () => {
    if (profileData.value.date_of_birth) {
        const age = calculateAge(profileData.value.date_of_birth);
        if (age < 13) {
            toast.error('You must be at least 13 years old to use ProtectED');
            return;
        }
    }

    const phoneRegex = /^\+639\d{9}$/;
    if (profileData.value.phone_number && !phoneRegex.test(profileData.value.phone_number)) {
        toast.error('Please use the format +639XXXXXXXXX for phone number');
        return;
    }

    isSaving.value = true;
    await profileStore.updateProfile(profileData.value);
    isSaving.value = false;
};

const resetForm = () => {
    if (profileStore.profile) {
        fillProfileData(profileStore.profile);
    }
    avatarPreview.value = null;
};

onMounted(async () => {
    if (!profileStore.profile && authStore.user) {
        await profileStore.fetchProfile(authStore.user.id);
    }
    if (profileStore.profile) {
        fillProfileData(profileStore.profile);
    }
});

// Watch for store changes
watch(() => profileStore.profile, (newProfile) => {
    if (newProfile) {
        fillProfileData(newProfile);
    }
}, { deep: true });
</script>

<style scoped>
.group:hover img {
    transform: scale(1.05);
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(99 102 241);
    border-color: rgb(99 102 241);
}
</style>