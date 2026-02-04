<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-abyss-900">Guardian Information</h3>
        <p class="text-sm text-gray-500">Essential for minors and account recovery.</p>
      </div>
      <button @click="openModal()"
        class="inline-flex items-center px-4 py-2 bg-kaitoke-green-600 text-white text-sm font-medium rounded-md hover:bg-kaitoke-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kaitoke-green-500">
        <UserPlusIcon class="h-4 w-4 mr-2" />
        Add Guardian
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kaitoke-green-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading guardians...</p>
    </div>

    <!-- Guardians Table -->
    <div v-else-if="guardians.length > 0"
      class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-abyss-900">Name</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-abyss-900">Type</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-abyss-900">Relationship</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-abyss-900">Contact</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-abyss-900">Status</th>
            <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="guardian in guardians" :key="guardian.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-abyss-900">
              {{ guardian.full_name }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
              {{ guardian.guardian_type.replace('_', ' ') }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ guardian.relationship }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div>{{ guardian.phone_number }}</div>
              <div v-if="guardian.email" class="text-xs text-gray-400">{{ guardian.email }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span v-if="guardian.is_primary"
                class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <ShieldCheckIcon class="h-3 w-3 mr-1" />
                Primary
              </span>
            </td>
            <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button @click="openModal(guardian)" class="text-kaitoke-green-600 hover:text-kaitoke-green-900 mr-4">
                Edit
              </button>
              <button @click="confirmDelete(guardian)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-abyss-900">No guardians added</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding a guardian for account recovery.</p>
      <div class="mt-6">
        <button @click="openModal()"
          class="inline-flex items-center px-4 py-2 bg-kaitoke-green-600 text-white text-sm font-medium rounded-md hover:bg-kaitoke-green-700">
          <UserPlusIcon class="h-4 w-4 mr-2" />
          Add Your First Guardian
        </button>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
        @click.self="closeModal">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-bold text-abyss-900 mb-4">
              {{ editMode ? 'Edit Guardian' : 'Add New Guardian' }}
            </h3>

            <form @submit.prevent="saveGuardian" class="space-y-4">
              <!-- Guardian Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Type <span class="text-red-500">*</span>
                </label>
                <select v-model="form.guardian_type" required
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500">
                  <option value="">Select type...</option>
                  <option value="parent">Parent</option>
                  <option value="legal_guardian">Legal Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input v-model="form.full_name" type="text" required minlength="3" maxlength="255"
                  placeholder="Juan Dela Cruz"
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500" />
              </div>

              <!-- Relationship -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Relationship <span class="text-red-500">*</span>
                </label>
                <input v-model="form.relationship" type="text" required maxlength="100"
                  placeholder="Mother, Father, Uncle, etc."
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500" />
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input v-model="form.phone_number" type="tel" required pattern="^\+639\d{9}$"
                  placeholder="+639XXXXXXXXX"
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500" />
                <p class="mt-1 text-xs text-gray-500">Format: +639XXXXXXXXX</p>
              </div>

              <!-- Email (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input v-model="form.email" type="email" placeholder="guardian@example.com"
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500" />
              </div>

              <!-- Address (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address (Optional)
                </label>
                <textarea v-model="form.address" rows="2" placeholder="Complete address"
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-kaitoke-green-500 focus:border-kaitoke-green-500"></textarea>
              </div>

              <!-- Primary Guardian Checkbox -->
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input v-model="form.is_primary" type="checkbox" id="is_primary"
                    class="h-4 w-4 text-kaitoke-green-600 border-gray-300 rounded focus:ring-kaitoke-green-500" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="is_primary" class="font-medium text-gray-700">
                    Set as Primary Guardian
                  </label>
                  <p class="text-gray-500 text-xs">
                    Primary guardian will be contacted first in emergencies.
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" :disabled="isSaving"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-kaitoke-green-600 rounded-md hover:bg-kaitoke-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {{ isSaving ? 'Saving...' : (editMode ? 'Update Guardian' : 'Add Guardian') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { UserPlusIcon, UsersIcon, ShieldCheckIcon } from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const guardians = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const editMode = ref(false);
const editingId = ref(null);

const emptyForm = {
  guardian_type: '',
  full_name: '',
  relationship: '',
  phone_number: '',
  email: '',
  address: '',
  is_primary: false
};

const form = ref({ ...emptyForm });

const loadGuardians = async () => {
  isLoading.value = true;
  try {
    await profileStore.fetchGuardians();
    guardians.value = profileStore.guardians;
  } catch (error) {
    toast.error('Failed to load guardians');
  } finally {
    isLoading.value = false;
  }
};

const openModal = (guardian = null) => {
  if (guardian) {
    editMode.value = true;
    editingId.value = guardian.id;
    form.value = { ...guardian };
  } else {
    editMode.value = false;
    editingId.value = null;
    form.value = { ...emptyForm };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
  editingId.value = null;
  form.value = { ...emptyForm };
};

const saveGuardian = async () => {
  isSaving.value = true;

  try {
    let success;

    if (editMode.value) {
      success = await profileStore.updateGuardian(editingId.value, form.value);
    } else {
      success = await profileStore.addGuardian(form.value);
    }

    if (success) {
      await loadGuardians();
      closeModal();
    }
  } catch (error) {
    // Error toast already shown by store
    console.error('Save guardian error:', error);
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (guardian) => {
  const confirmed = confirm(
    `Are you sure you want to remove ${guardian.full_name} as a guardian? This action cannot be undone.`
  );

  if (confirmed) {
    const success = await profileStore.deleteGuardian(guardian.id);
    if (success) {
      await loadGuardians();
    }
  }
};

onMounted(() => {
  loadGuardians();
});
</script>