// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api, {
    setAuthToken,
    clearAuthToken,
    getAuthToken,
    logout as apiLogout,
    logoutEverywhere as apiLogoutEverywhere
} from "@/utils/api";

export const useAuthStore = defineStore("auth", () => {
    // ===== State =====
    const user = ref(null);
    const isLoading = ref(false);
    const pendingEmail = ref(null);
    const activeSessions = ref([]);

    const me = computed(() => user.value);
    const isAuthenticated = computed(() => !!user.value);

    function setPendingEmail(email) {
        pendingEmail.value = email || null;
    }

    // ===== Actions =====
    async function fetchUser() {
        try {
            const { data } = await api.get("/api/v1/auth/me");
            user.value = data;
            return data;
        } catch {
            user.value = null;
            return null;
        }
    }

    async function signup(payload) {
        isLoading.value = true;
        try {
            const res = await api.post("/api/v1/auth/register", payload);
            return { success: true, message: res.data.message, email: res.data.email };
        } catch (e) {
            const error = new Error(e.response?.data?.message || "Registration failed");
            error.details = e.response?.data?.errors;
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function restoreSession() {
        if (!getAuthToken()) return null;
        return await fetchUser();
    }

    async function login({ email, password }) {
        isLoading.value = true;
        try {
            const res = await api.post("/api/v1/auth/login", { email, password });
            const token = res?.data?.token;

            if (!token) throw new Error("Login failed: Access token missing.");

            // Store the short-lived access token
            setAuthToken(token);

            // Refresh token is handled by the browser cookie automatically
            user.value = res.data.user;
            return { ok: true, user: user.value };
        } catch (e) {
            const data = e?.response?.data;
            if (data?.unverified) {
                const err = new Error("Please verify your email.");
                err.unverified = true;
                err.email = email;
                throw err;
            }
            throw new Error(data?.message || "Invalid email or password.");
        } finally {
            isLoading.value = false;
        }
    }

    const loginWithGoogle = async () => {
        isGoogleLoading.value = true;
        try {
            const { data } = await api.get('/api/v1/auth/google/redirect');
            window.location.href = data.authUrl;
        } catch (error) {
            isGoogleLoading.value = false;
            toast.error("Failed to connect to Google.");
        }
    }

    async function logout() {
        try { await apiLogout(); } catch { }
        clearAuthToken();
        user.value = null;
        activeSessions.value = [];
        return { ok: true };
    }

    async function logoutAll() {
        try { await apiLogoutEverywhere(); } catch { }
        clearAuthToken();
        user.value = null;
        activeSessions.value = [];
        return { ok: true };
    }

    async function fetchSessions() {
        try {
            const { data } = await api.get("/api/v1/auth/sessions");
            activeSessions.value = data.sessions || [];
            return activeSessions.value;
        } catch { return []; }
    }

    async function changePassword(payload) {
        try {
            const { data } = await api.post("/api/v1/auth/change-password", payload);
            if (data.token) setAuthToken(data.token);
            return { ok: true, message: data.message };
        } catch (e) {
            throw new Error(e?.response?.data?.message || "Failed to change password");
        }
    }
    async function resendVerificationEmail(email) {
        isLoading.value = true;
        try {
            const { data } = await api.post("/api/v1/auth/email/verification-notification", { email });
            return data;
        } catch (e) {
            throw new Error(e.response?.data?.message || "Failed to resend email");
        } finally {
            isLoading.value = false;
        }
    }

    async function requestPasswordReset(email) {
        return api.post("/api/v1/auth/forgot-password", { email });
    }

    async function performPasswordReset(payload) {
        // payload should include: token, email, password, password_confirmation
        return api.post("/api/v1/auth/reset-password", payload);
    }

    return {
        user, isLoading, isAuthenticated, me, pendingEmail, activeSessions,
        signup, login, logout, logoutAll, fetchUser, setPendingEmail, restoreSession,
        fetchSessions, changePassword, resendVerificationEmail,
        requestPasswordReset, performPasswordReset, loginWithGoogle
    };
});