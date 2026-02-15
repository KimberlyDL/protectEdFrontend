<template>
    <div class="reward-management">
        <div class="header">
            <h1>Reward Management</h1>
            <button @click="openCreateModal" class="btn-primary">
                + Add New Reward
            </button>
        </div>

        <div class="rewards-grid">
            <div v-for="reward in rewards" :key="reward.id" class="reward-card">
                <img :src="reward.image_url || '/placeholder-reward.png'" :alt="reward.name" class="reward-image" />
                <div class="reward-info">
                    <h3>{{ reward.name }}</h3>
                    <p class="description">{{ reward.description }}</p>
                    <div class="reward-meta">
                        <span class="points">{{ reward.points_required }} points</span>
                        <span class="stock" :class="{ 'low-stock': reward.stock_quantity < 5 }">
                            Stock: {{ reward.stock_quantity }}
                        </span>
                    </div>
                    <div class="reward-status">
                        <span :class="['badge', reward.is_active ? 'active' : 'inactive']">
                            {{ reward.is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <span v-if="reward.category" class="category">{{ reward.category }}</span>
                    </div>
                </div>
                <div class="reward-actions">
                    <button @click="editReward(reward)" class="btn-edit">Edit</button>
                    <button @click="deleteReward(reward.id)" class="btn-delete">Delete</button>
                </div>
            </div>
        </div>

        <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
            <div class="modal" @click.stop>
                <h2>{{ showEditModal ? 'Edit Reward' : 'Create New Reward' }}</h2>
                <form @submit.prevent="saveReward">
                    <div class="form-group">
                        <label>Reward Name *</label>
                        <input v-model="formData.name" type="text" required />
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="formData.description" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Image URL</label>
                        <input v-model="formData.image_url" type="url" />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Points Required *</label>
                            <input v-model.number="formData.points_required" type="number" min="0" required />
                        </div>

                        <div class="form-group">
                            <label>Stock Quantity *</label>
                            <input v-model.number="formData.stock_quantity" type="number" min="0" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Category</label>
                        <input v-model="formData.category" type="text" placeholder="e.g., Electronics, Gift Cards" />
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input v-model="formData.is_active" type="checkbox" />
                            Active (available for redemption)
                        </label>
                    </div>

                    <div class="modal-actions">
                        <button type="button" @click="closeModals" class="btn-secondary">Cancel</button>
                        <button type="submit" class="btn-primary">
                            {{ showEditModal ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const toast = useToast();
const rewards = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingId = ref(null);

const formData = ref({
    name: '',
    description: '',
    image_url: '',
    points_required: 0,
    stock_quantity: 0,
    category: '',
    is_active: true
});

const fetchRewards = async () => {
    try {
        const response = await api.get('/api/v1/rewards');
        rewards.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch rewards:', error);
        toast.error('Failed to load rewards');
    }
};

// FIX: Added the missing openCreateModal function
const openCreateModal = () => {
    // Reset form data
    formData.value = {
        name: '',
        description: '',
        image_url: '',
        points_required: 0,
        stock_quantity: 0,
        category: '',
        is_active: true
    };
    editingId.value = null;
    showCreateModal.value = true;
};

const editReward = (reward) => {
    formData.value = { ...reward };
    editingId.value = reward.id;
    showEditModal.value = true;
};

const saveReward = async () => {
    try {
        if (showEditModal.value) {
            await api.put(`/api/v1/rewards/${editingId.value}`, formData.value);
            toast.success('Reward updated successfully');
        } else {
            await api.post('/api/v1/rewards', formData.value);
            toast.success('Reward created successfully');
        }
        closeModals();
        fetchRewards();
    } catch (error) {
        console.error('Failed to save reward:', error);
        toast.error(error.response?.data?.message || 'Failed to save reward');
    }
};

const deleteReward = async (id) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
        await api.delete(`/api/v1/rewards/${id}`);
        toast.success('Reward deleted successfully');
        fetchRewards();
    } catch (error) {
        console.error('Failed to delete reward:', error);
        toast.error(error.response?.data?.message || 'Failed to delete reward');
    }
};

const closeModals = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingId.value = null;
    formData.value = {
        name: '',
        description: '',
        image_url: '',
        points_required: 0,
        stock_quantity: 0,
        category: '',
        is_active: true
    };
};

onMounted(() => {
    fetchRewards();
});
</script>

<style scoped>
.reward-management {
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.rewards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.reward-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reward-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.reward-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
}

.description {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.reward-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.points {
    font-weight: 600;
    color: #2563eb;
}

.stock {
    color: #059669;
}

.stock.low-stock {
    color: #dc2626;
}

.reward-status {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge.active {
    background: #d1fae5;
    color: #065f46;
}

.badge.inactive {
    background: #fee2e2;
    color: #991b1b;
}

.category {
    padding: 0.25rem 0.75rem;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 12px;
    font-size: 0.75rem;
}

.reward-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-primary,
.btn-edit,
.btn-delete,
.btn-secondary {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-edit {
    background: #f59e0b;
    color: white;
    flex: 1;
}

.btn-delete {
    background: #dc2626;
    color: white;
    flex: 1;
}

.btn-secondary {
    background: #e5e7eb;
    color: #374151;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.checkbox-label input {
    width: auto;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}
</style>