<template>
    <div class="space-y-10">
        <!-- Deletion Pending Notice -->
        <section v-if="deletionStatus?.has_pending_deletion"
            class="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <AlertTriangleIcon class="h-6 w-6 text-yellow-600" />
                </div>
                <div class="ml-3 flex-1">
                    <h3 class="text-lg font-medium text-yellow-900">Account Deletion Pending</h3>
                    <p class="mt-2 text-sm text-yellow-700">
                        Your account is scheduled for permanent deletion on
                        <strong>{{ formatDate(deletionStatus.scheduled_deletion_date) }}</strong>.
                    </p>
                    <p class="mt-1 text-sm text-yellow-600">
                        Days remaining: <strong>{{ deletionStatus.days_remaining }}</strong>
                    </p>
                    <button @click="cancelDeletion" :disabled="isCancelling"
                        class="mt-4 inline-flex items-center bg-white text-yellow-800 border border-yellow-300 px-4 py-2 rounded-md hover:bg-yellow-50 text-sm font-medium disabled:opacity-50">
                        <svg v-if="isCancelling" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isCancelling ? 'Cancelling...' : 'Cancel Deletion' }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Change Password -->
        <section>
            <div class="border-b border-gray-200 pb-3">
                <h3 class="text-lg font-medium text-abyss-900">Change Password</h3>
                <p class="mt-1 text-sm text-platinum-600">
                    Update your password regularly to keep your account secure. All sessions will be logged out after
                    password change.
                </p>
            </div>

            <div class="mt-6 max-w-md space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Current Password <span class="text-red-500">*</span>
                    </label>
                    <input v-model="passwordData.current_password" type="password" required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        New Password <span class="text-red-500">*</span>
                    </label>
                    <input v-model="passwordData.password" type="password" required minlength="8"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                    <p class="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password <span class="text-red-500">*</span>
                    </label>
                    <input v-model="passwordData.password_confirmation" type="password" required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-kaitoke-green-500 focus:ring-kaitoke-green-500 sm:text-sm" />
                </div>

                <button @click="changePassword" :disabled="!isPasswordFormValid || isChangingPassword"
                    class="inline-flex items-center bg-kaitoke-green-600 text-white px-4 py-2 rounded-md hover:bg-kaitoke-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isChangingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
                </button>
            </div>
        </section>

        <!-- Active Sessions -->
        <section>
            <div class="border-b border-gray-200 pb-3">
                <h3 class="text-lg font-medium text-abyss-900">Active Sessions</h3>
                <p class="mt-1 text-sm text-platinum-600">
                    Manage devices where you're currently logged in.
                </p>
            </div>

            <div v-if="isLoadingSessions" class="mt-4 text-center py-8">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-kaitoke-green-600"></div>
            </div>

            <div v-else-if="sessions.length > 0" class="mt-4 space-y-3">
                <div v-for="session in sessions" :key="session.id"
                    class="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <MonitorIcon class="h-4 w-4 text-gray-400" />
                            <p class="text-sm font-medium text-abyss-900">
                                {{ session.device_name || 'Unknown Device' }}
                            </p>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                            {{ session.ip_address }}
                        </p>
                        <p class="text-xs text-gray-400">
                            Last active: {{ formatDateTime(session.last_activity) }}
                        </p>
                    </div>
                    <span v-if="session.is_current"
                        class="inline-flex items-center text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-medium">
                        Current Session
                    </span>
                </div>

                <button @click="logoutAllDevices" :disabled="isLoggingOut"
                    class="inline-flex items-center text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
                    <LogOutIcon class="h-4 w-4 mr-1" />
                    {{ isLoggingOut ? 'Logging out...' : 'Logout All Devices' }}
                </button>
            </div>

            <div v-else class="mt-4 text-center py-8 text-gray-500">
                <MonitorIcon class="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p class="text-sm">No active sessions found</p>
            </div>
        </section>

        <!-- Deactivate Account -->
        <section>
            <div class="border-b border-gray-200 pb-3">
                <h3 class="text-lg font-medium text-abyss-900">Deactivate Account</h3>
                <p class="mt-1 text-sm text-platinum-600">
                    Temporarily disable your account. Your profile will be hidden until you log back in (within 30
                    days).
                </p>
            </div>

            <div class="mt-4">
                <button @click="confirmDeactivation" :disabled="isDeactivating"
                    class="inline-flex items-center bg-orange-50 text-orange-700 border-2 border-orange-300 px-4 py-2 rounded-md hover:bg-orange-100 text-sm font-medium disabled:opacity-50">
                    <PauseCircleIcon class="h-4 w-4 mr-2" />
                    {{ isDeactivating ? 'Deactivating...' : 'Deactivate Account' }}
                </button>
            </div>
        </section>

        <!-- Delete Account (Danger Zone) -->
        <section class="bg-red-50 p-6 rounded-lg border-2 border-red-200">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <AlertTriangleIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-3 flex-1">
                    <h3 class="text-lg font-medium text-red-900">Permanent Account Deletion</h3>
                    <p class="mt-2 text-sm text-red-700">
                        This will schedule your account for permanent deletion after <strong>30 days</strong>.
                        All data, including badges, progress, and personal information, will be permanently lost.
                    </p>

                    <div v-if="!showDeleteForm" class="mt-4">
                        <button @click="showDeleteForm = true"
                            class="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium shadow-sm">
                            <Trash2Icon class="h-4 w-4 mr-2" />
                            Request Account Deletion
                        </button>
                    </div>

                    <div v-else class="mt-6 bg-white p-6 rounded border-2 border-red-300 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-abyss-900 mb-2">
                                Confirm Password <span class="text-red-500">*</span>
                            </label>
                            <input v-model="deleteForm.password" type="password" required
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-abyss-900 mb-2">
                                Type <span class="font-bold text-red-600">DELETE MY ACCOUNT</span> to confirm <span
                                    class="text-red-500">*</span>
                            </label>
                            <input v-model="deleteForm.confirm_text" type="text" required
                                placeholder="DELETE MY ACCOUNT"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-abyss-900 mb-2">
                                Reason (Optional - helps us improve)
                            </label>
                            <textarea v-model="deleteForm.reason" rows="3"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                placeholder="Help us improve by sharing why you're leaving"></textarea>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-gray-200">
                            <button @click="requestDeletion" :disabled="!isDeleteFormValid || isDeleting"
                                class="flex-1 inline-flex items-center justify-center bg-red-600 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-bold hover:bg-red-700">
                                <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isDeleting ? 'Processing...' : 'Confirm & Schedule Deletion' }}
                            </button>
                            <button @click="cancelDeleteForm" :disabled="isDeleting"
                                class="px-6 py-2 text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-md font-medium disabled:opacity-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    AlertTriangleIcon,
    MonitorIcon,
    LogOutIcon,
    PauseCircleIcon,
    Trash2Icon
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const toast = useToast();

// State
const showDeleteForm = ref(false);
const isDeleting = ref(false);
const isDeactivating = ref(false);
const isChangingPassword = ref(false);
const isLoggingOut = ref(false);
const isCancelling = ref(false);
const isLoadingSessions = ref(false);

const deleteForm = ref({
    password: '',
    confirm_text: '',
    reason: ''
});

const deletionStatus = ref(null);
const sessions = ref([]);

// Password change state
const passwordData = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
});

// Computed
const isDeleteFormValid = computed(() => {
    return deleteForm.value.confirm_text === 'DELETE MY ACCOUNT' &&
        deleteForm.value.password.length > 0;
});

const isPasswordFormValid = computed(() => {
    return passwordData.value.current_password &&
        passwordData.value.password &&
        passwordData.value.password_confirmation &&
        passwordData.value.password === passwordData.value.password_confirmation &&
        passwordData.value.password.length >= 8;
});

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const changePassword = async () => {
    isChangingPassword.value = true;

    try {
        const result = await authStore.changePassword(passwordData.value);

        if (result.ok) {
            // Reset form
            passwordData.value = {
                current_password: '',
                password: '',
                password_confirmation: ''
            };

            // Redirect to login (all sessions logged out)
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    } catch (error) {
        // Error toast already shown by store
    } finally {
        isChangingPassword.value = false;
    }
};

const loadSessions = async () => {
    isLoadingSessions.value = true;
    try {
        const sessionList = await authStore.fetchSessions();
        sessions.value = sessionList || [];
    } catch (error) {
        toast.error('Failed to load sessions');
    } finally {
        isLoadingSessions.value = false;
    }
};

const logoutAllDevices = async () => {
    if (!confirm('This will log you out of all devices including this one. You will need to log in again. Continue?')) {
        return;
    }

    isLoggingOut.value = true;
    try {
        await authStore.logoutAll();
        toast.success('Logged out of all devices');
        router.push('/login');
    } catch (error) {
        toast.error('Failed to logout');
    } finally {
        isLoggingOut.value = false;
    }
};

const confirmDeactivation = async () => {
    if (!confirm('Are you sure you want to deactivate your account? Your profile will be hidden and you can reactivate within 30 days by logging in again.')) {
        return;
    }

    isDeactivating.value = true;
    try {
        const success = await profileStore.deactivateAccount();
        if (success) {
            // Deactivation logs user out automatically
            router.push('/login');
        }
    } catch (error) {
        // Error already handled
    } finally {
        isDeactivating.value = false;
    }
};

const requestDeletion = async () => {
    isDeleting.value = true;

    try {
        const success = await profileStore.requestAccountDeletion(
            deleteForm.value.password,
            deleteForm.value.reason
        );

        if (success) {
            // Reload deletion status
            await loadDeletionStatus();

            // Reset form
            showDeleteForm.value = false;
            deleteForm.value = {
                password: '',
                confirm_text: '',
                reason: ''
            };

            // Redirect to login (account is deactivated)
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    } catch (error) {
        // Error already handled
    } finally {
        isDeleting.value = false;
    }
};

const cancelDeletion = async () => {
    if (!confirm('Are you sure you want to cancel the account deletion? Your account will be reactivated.')) {
        return;
    }

    isCancelling.value = true;
    try {
        const success = await profileStore.cancelAccountDeletion();
        if (success) {
            deletionStatus.value = null;
        }
    } catch (error) {
        // Error already handled
    } finally {
        isCancelling.value = false;
    }
};

const cancelDeleteForm = () => {
    showDeleteForm.value = false;
    deleteForm.value = {
        password: '',
        confirm_text: '',
        reason: ''
    };
};

const loadDeletionStatus = async () => {
    try {
        const status = await profileStore.getDeletionStatus();
        deletionStatus.value = status;
    } catch (error) {
        console.error('Failed to load deletion status:', error);
    }
};

// Lifecycle
onMounted(async () => {
    await Promise.all([
        loadSessions(),
        loadDeletionStatus()
    ]);
});
</script>