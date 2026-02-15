// src/router/modules/authenticated.js
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue';
import FacilitatorDashboardLayout from '@/layouts/FacilitatorDashboardLayout.vue';
import UserDashboardLayout from '@/layouts/UserDashboardLayout.vue';

const ProfileView = () => import('@/views/Profile.vue');
const SettingsView = () => import('@/views/Settings.vue');

import { learnerPages } from '../authenticatedPages/learner_pages';
import { facilitatorPages } from '../authenticatedPages/facilitator_pages';
import { adminPages } from '../authenticatedPages/admin_pages';
import { FacilitatorClassrooms } from '../authenticatedPages/facilitator_classrooms';

const authenticatedRoutes = [
    {
        path: '/dashboard',
        component: UserDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['player'] },
        children: learnerPages
    },

    // ===== Facilitator Routes =====
    {
        path: '/facilitator',
        component: FacilitatorDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['educator', 'moderator'] },
        children: facilitatorPages
    },


    // ===== Admin Routes =====
    {
        path: '/admin',
        component: AdminDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['admin'] },
        children: adminPages
    },


    // ===== Facilitator Classroom Routes =====
    {
        path: '/facilitator/classroom/:id',
        component: FacilitatorDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['educator', 'moderator'] },
        children: FacilitatorClassrooms
    },

    // ===== Facilitator Classroom Routes =====
    {
        path: '/facilitator/classroom/:id',
        component: FacilitatorDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['educator', 'moderator'] },
        children: FacilitatorClassrooms
    },


    {
        path: '/profile',
        name: 'facilitator.profile',
        component: ProfileView,
        meta: { title: 'My Profile' }
    },
    {
        path: '/settings',
        name: 'facilitator.settings',
        component: SettingsView,
        meta: { title: 'Settings' }
    },
]

export default authenticatedRoutes