<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h3 class="text-lg font-medium text-abyss-900">Notification Preferences</h3>
      <p class="mt-1 text-sm text-gray-500">
        Control how and when you receive updates from the platform.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kaitoke-green-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading preferences...</p>
    </div>

    <!-- Notification Settings -->
    <div v-else class="divide-y divide-gray-200 border-t border-b border-gray-200">
      <!-- Safety Alerts (Always Enabled) -->
      <div class="flex items-start py-4 bg-blue-50 px-4 rounded-lg">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <ShieldAlertIcon class="h-5 w-5 text-blue-600" />
            <label class="text-sm font-medium text-blue-900">Safety Alerts</label>
          </div>
          <p class="mt-1 text-xs text-blue-700">
            Critical notifications for your protection. This setting cannot be disabled to ensure your safety.
          </p>
        </div>
        <div class="ml-3 flex h-5 items-center">
          <input type="checkbox" checked disabled
            class="h-4 w-4 rounded border-gray-300 text-blue-600 opacity-50 cursor-not-allowed" />
        </div>
      </div>

      <!-- Email Notifications -->
      <div class="flex items-start py-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-abyss-900">Email Notifications</label>
          <p class="text-xs text-gray-500">
            Receive email summaries of your progress and achievement alerts.
          </p>
        </div>
        <div class="ml-3 flex h-5 items-center">
          <input v-model="preferences.email_notifications" type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-kaitoke-green-600 focus:ring-kaitoke-green-500" />
        </div>
      </div>

      <!-- Module Reminders -->
      <div class="flex items-start py-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-abyss-900">Learning Reminders</label>
          <p class="text-xs text-gray-500">
            Get notified when it's time to continue your GAD modules.
          </p>
        </div>
        <div class="ml-3 flex h-5 items-center">
          <input v-model="preferences.module_reminders" type="checkbox" :disabled="!preferences.email_notifications"
            class="h-4 w-4 rounded border-gray-300 text-kaitoke-green-600 focus:ring-kaitoke-green-500 disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
      </div>

      <!-- Achievement Alerts -->
      <div class="flex items-start py-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-abyss-900">Achievement Alerts</label>
          <p class="text-xs text-gray-500">
            Receive notifications when you earn badges and complete milestones.
          </p>
        </div>
        <div class="ml-3 flex h-5 items-center">
          <input v-model="preferences.achievement_alerts" type="checkbox" :disabled="!preferences.email_notifications"
            class="h-4 w-4 rounded border-gray-300 text-kaitoke-green-600 focus:ring-kaitoke-green-500 disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
      </div>

      <!-- Platform Updates -->
      <div class="flex items-start py-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-abyss-900">Platform Updates</label>
          <p class="text-xs text-gray-500">
            Receive occasional updates about new features and improvements.
          </p>
        </div>
        <div class="ml-3 flex h-5 items-center">
          <input v-model="preferences.platform_updates" type="checkbox" :disabled="!preferences.email_notifications"
            class="h-4 w-4 rounded border-gray-300 text-kaitoke-green-600 focus:ring-kaitoke-green-500 disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="rounded-md bg-gray-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <BellIcon class="h-5 w-5 text-gray-400" />
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-abyss-900">About Notifications</h3>
          <div class="mt-2 text-sm text-platinum-600 space-y-1">
            <p>• Safety alerts are mandatory and will always be sent for your protection</p>
            <p>• Email notifications must be enabled to receive other types of alerts</p>
            <p>• You can change these preferences at any time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button @click="savePreferences" :disabled="isSaving || isLoading"
        class="inline-flex items-center px-6 py-2 bg-kaitoke-green-600 text-white text-sm font-medium rounded-md hover:bg-kaitoke-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kaitoke-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
        <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        {{ isSaving ? 'Saving...' : 'Update Preferences' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ShieldAlertIcon, BellIcon } from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const isLoading = ref(false);
const isSaving = ref(false);

const preferences = ref({
  email_notifications: true,
  module_reminders: true,
  achievement_alerts: true,
  safety_alerts: true, // Always true, cannot be changed
  platform_updates: false
});

const loadPreferences = async () => {
  isLoading.value = true;
  try {
    await profileStore.fetchNotificationSettings();
    if (profileStore.notificationSettings) {
      // Merge with loaded settings, ensuring safety_alerts is always true
      preferences.value = {
        ...profileStore.notificationSettings,
        safety_alerts: true // Force safety alerts to always be true
      };
    }
  } catch (error) {
    toast.error('Failed to load notification preferences');
  } finally {
    isLoading.value = false;
  }
};

const savePreferences = async () => {
  isSaving.value = true;

  try {
    // Ensure safety_alerts is always true before saving
    const dataToSave = {
      ...preferences.value,
      safety_alerts: true
    };

    const success = await profileStore.updateNotificationSettings(dataToSave);

    if (success) {
      // Success toast already shown by store
    }
  } catch (error) {
    // Error toast already shown by store
    console.error('Save preferences error:', error);
  } finally {
    isSaving.value = false;
  }
};

// Auto-disable dependent options when email_notifications is turned off
watch(() => preferences.value.email_notifications, (newValue) => {
  if (!newValue) {
    preferences.value.module_reminders = false;
    preferences.value.achievement_alerts = false;
    preferences.value.platform_updates = false;
  }
});

onMounted(() => {
  loadPreferences();
});
</script>