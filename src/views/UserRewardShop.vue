<template>
    <div class="reward-shop">
        <div class="header">
            <h1>Reward Shop</h1>
            <div class="user-points">
                <span class="label">Your Points:</span>
                <span class="points">{{ userStats.currentScore || 0 }}</span>
            </div>
        </div>

        <div class="filters">
            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
                :class="['filter-btn', { active: selectedCategory === cat }]">
                {{ cat }}
            </button>
        </div>

        <div class="rewards-grid">
            <div v-for="reward in filteredRewards" :key="reward.id" class="reward-card"
                :class="{ 'not-enough-points': !reward.canRedeem }">
                <img :src="reward.image_url || '/placeholder-reward.png'" :alt="reward.name" class="reward-image" />
                <div class="reward-info">
                    <h3>{{ reward.name }}</h3>
                    <p class="description">{{ reward.description }}</p>

                    <div class="reward-meta">
                        <span class="points-required">{{ reward.points_required }} points</span>
                        <span class="stock" :class="{ 'low-stock': reward.stock_quantity < 5 }">
                            {{ reward.stock_quantity }} left
                        </span>
                    </div>

                    <div v-if="!reward.canRedeem" class="not-enough-message">
                        <span v-if="reward.pointsNeeded > 0">
                            Need {{ reward.pointsNeeded }} more points
                        </span>
                        <span v-else>
                            {{ reward.reason }}
                        </span>
                    </div>

                    <button @click="openRedeemModal(reward)" :disabled="!reward.canRedeem" class="btn-redeem">
                        {{ reward.canRedeem ? 'Redeem' : 'Not Enough Points' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredRewards.length === 0" class="empty-state">
            <p>No rewards available in this category</p>
        </div>

        <div v-if="showRedeemModal" class="modal-overlay" @click="closeRedeemModal">
            <div class="modal" @click.stop>
                <h2>Redeem {{ selectedReward?.name }}</h2>
                <img :src="selectedReward?.image_url || '/placeholder-reward.png'" :alt="selectedReward?.name"
                    class="modal-image" />
                <p class="modal-description">{{ selectedReward?.description }}</p>

                <div class="redeem-details">
                    <div class="detail-row">
                        <span>Cost:</span>
                        <strong>{{ selectedReward?.points_required }} points</strong>
                    </div>
                    <div class="detail-row">
                        <span>Your Points:</span>
                        <strong>{{ userStats.currentScore }}</strong>
                    </div>
                    <div class="detail-row">
                        <span>After Redemption:</span>
                        <strong>{{ userStats.currentScore - (selectedReward?.points_required || 0) }} points</strong>
                    </div>
                </div>

                <div class="form-group">
                    <label>Quantity</label>
                    <input v-model.number="quantity" type="number" min="1" :max="selectedReward?.stock_quantity" />
                </div>

                <div class="form-group">
                    <label>Notes (optional)</label>
                    <textarea v-model="notes" rows="3" placeholder="Delivery instructions or preferences..."></textarea>
                </div>

                <div class="modal-actions">
                    <button @click="closeRedeemModal" class="btn-secondary">Cancel</button>
                    <button @click="confirmRedeem" class="btn-primary" :disabled="isRedeeming">
                        {{ isRedeeming ? 'Processing...' : 'Confirm Redemption' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const toast = useToast();
const rewards = ref([]);
const userStats = ref({ currentScore: 0 });
const selectedCategory = ref('All');
const showRedeemModal = ref(false);
const selectedReward = ref(null);
const quantity = ref(1);
const notes = ref('');
const isRedeeming = ref(false);

const categories = computed(() => {
    const cats = new Set(['All']);
    rewards.value.forEach(r => {
        if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
});

const filteredRewards = computed(() => {
    if (selectedCategory.value === 'All') {
        return rewards.value;
    }
    return rewards.value.filter(r => r.category === selectedCategory.value);
});

const fetchRewards = async () => {
    try {
        const response = await api.get('/api/v1/rewards/available');
        rewards.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch rewards:', error);
        toast.error('Failed to load rewards');
    }
};

const fetchUserStats = async () => {
    try {
        const response = await api.get('/api/v1/rewards/my-stats');
        userStats.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch user stats:', error);
    }
};

const openRedeemModal = (reward) => {
    selectedReward.value = reward;
    quantity.value = 1;
    notes.value = '';
    showRedeemModal.value = true;
};

const closeRedeemModal = () => {
    showRedeemModal.value = false;
    selectedReward.value = null;
};

const confirmRedeem = async () => {
    if (!selectedReward.value) return;

    isRedeeming.value = true;
    try {
        await api.post(`/api/v1/rewards/${selectedReward.value.id}/redeem`, {
            quantity: quantity.value,
            notes: notes.value
        });

        toast.success('Reward redeemed successfully! Check your redemptions history.');
        closeRedeemModal();

        // Refresh data
        await Promise.all([fetchRewards(), fetchUserStats()]);
    } catch (error) {
        console.error('Failed to redeem reward:', error);
        toast.error(error.response?.data?.message || 'Failed to redeem reward');
    } finally {
        isRedeeming.value = false;
    }
};

onMounted(() => {
    fetchRewards();
    fetchUserStats();
});
</script>

<style scoped>
/* (Same CSS as provided in your snippet) */
.reward-shop {
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.user-points {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    font-size: 1.125rem;
}

.user-points .points {
    font-weight: 700;
    font-size: 1.5rem;
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

.rewards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.reward-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.reward-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.reward-card.not-enough-points {
    opacity: 0.7;
}

.reward-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.reward-info {
    padding: 1rem;
}

.reward-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
}

.description {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.reward-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.points-required {
    font-weight: 700;
    color: #2563eb;
    font-size: 1.125rem;
}

.stock {
    color: #059669;
    font-size: 0.875rem;
}

.stock.low-stock {
    color: #dc2626;
    font-weight: 600;
}

.not-enough-message {
    background: #fef3c7;
    color: #92400e;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-align: center;
}

.btn-redeem {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-redeem:hover:not(:disabled) {
    background: #1d4ed8;
}

.btn-redeem:disabled {
    background: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal h2 {
    margin-top: 0;
}

.modal-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.modal-description {
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.redeem-details {
    background: #f3f4f6;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.detail-row:last-child {
    margin-bottom: 0;
    padding-top: 0.5rem;
    border-top: 2px solid #d1d5db;
}

.form-group {
    margin-bottom: 1rem;
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

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:disabled {
    background: #d1d5db;
    cursor: not-allowed;
}

.btn-secondary {
    background: #e5e7eb;
    color: #374151;
}
</style>