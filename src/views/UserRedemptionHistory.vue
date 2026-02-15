<template>
    <div class="redemption-history">
        <h1>My Redemptions</h1>

        <div class="filters">
            <button v-for="status in statuses" :key="status.value" @click="selectedStatus = status.value"
                :class="['filter-btn', { active: selectedStatus === status.value }]">
                {{ status.label }}
            </button>
        </div>

        <div class="redemptions-list">
            <div v-for="redemption in redemptions" :key="redemption.id" class="redemption-card">
                <div class="redemption-header">
                    <h3>{{ redemption.reward.name }}</h3>
                    <span :class="['status-badge', redemption.status]">
                        {{ getStatusLabel(redemption.status) }}
                    </span>
                </div>

                <div class="redemption-body">
                    <img :src="redemption.reward.image_url || '/placeholder-reward.png'" :alt="redemption.reward.name"
                        class="reward-thumbnail" />
                    <div class="redemption-info">
                        <p><strong>Points Spent:</strong> {{ redemption.points_spent }}</p>
                        <p><strong>Quantity:</strong> {{ redemption.quantity }}</p>
                        <p><strong>Redeemed:</strong> {{ formatDate(redemption.redeemed_at) }}</p>
                        <p v-if="redemption.fulfilled_at">
                            <strong>Fulfilled:</strong> {{ formatDate(redemption.fulfilled_at) }}
                        </p>
                        <p v-if="redemption.notes" class="notes">
                            <strong>Notes:</strong> {{ redemption.notes }}
                        </p>
                        <p v-if="redemption.admin_notes" class="admin-notes">
                            <strong>Admin Notes:</strong> {{ redemption.admin_notes }}
                        </p>
                    </div>
                </div>

                <div v-if="redemption.status === 'pending'" class="redemption-actions">
                    <button @click="cancelRedemption(redemption.id)" class="btn-cancel">
                        Cancel Redemption
                    </button>
                </div>
            </div>
        </div>

        <div v-if="redemptions.length === 0" class="empty-state">
            <p>No redemptions found</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const toast = useToast();
const redemptions = ref([]);
const selectedStatus = ref(null);

const statuses = [
    { value: null, label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

const getStatusLabel = (status) => {
    return statuses.find(s => s.value === status)?.label || status;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchRedemptions = async () => {
    try {
        const params = {};
        if (selectedStatus.value) {
            params.status = selectedStatus.value;
        }

        const response = await api.get('/api/v1/rewards/my-redemptions', { params });
        redemptions.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch redemptions:', error);
        toast.error('Failed to load redemptions');
    }
};

const cancelRedemption = async (redemptionId) => {
    if (!confirm('Are you sure you want to cancel this redemption? Your points will be refunded.')) {
        return;
    }

    try {
        await api.post(`/api/v1/rewards/redemptions/${redemptionId}/cancel`);
        toast.success('Redemption cancelled successfully. Points have been refunded.');
        fetchRedemptions();
    } catch (error) {
        console.error('Failed to cancel redemption:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel redemption');
    }
};

watch(selectedStatus, () => {
    fetchRedemptions();
});

onMounted(() => {
    fetchRedemptions();
});
</script>

<style scoped>
/* (Same CSS as provided in your snippet) */
.redemption-history {
    padding: 2rem;
}

.filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
}

.redemptions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.redemption-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.redemption-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.redemption-header h3 {
    margin: 0;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-badge.pending {
    background: #fef3c7;
    color: #92400e;
}

.status-badge.approved {
    background: #dbeafe;
    color: #1e40af;
}

.status-badge.completed {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.cancelled {
    background: #fee2e2;
    color: #991b1b;
}

.redemption-body {
    display: flex;
    gap: 1rem;
}

.reward-thumbnail {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
}

.redemption-info {
    flex: 1;
}

.redemption-info p {
    margin: 0.5rem 0;
    color: #374151;
}

.notes {
    color: #6b7280;
    font-style: italic;
}

.admin-notes {
    background: #f3f4f6;
    padding: 0.5rem;
    border-radius: 4px;
    color: #374151;
}

.redemption-actions {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #dc2626;
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
}

.btn-cancel:hover {
    background: #b91c1c;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
}
</style>