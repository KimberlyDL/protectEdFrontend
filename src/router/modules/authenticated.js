// src/router/modules/authenticated.js
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue';
import FacilitatorDashboardLayout from '@/layouts/FacilitatorDashboardLayout.vue';
import UserDashboardLayout from '@/layouts/UserDashboardLayout.vue';

// ===== Helper for the shared components to keep code DRY ======
const ProfileView = () => import('@/views/Profile.vue');
const SettingsView = () => import('@/views/Settings.vue');

const authenticatedRoutes = [
    // ===== User/Player Routes =====
    {
        path: '/dashboard',
        component: UserDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['player'] },
        children: [
            {
                path: '',
                name: 'user.dashboard',
                component: () => import('@/views/dashboard/UserDashboard.vue'),
                meta: { title: 'Dashboard' }
            },
            {
                path: 'modules',
                name: 'user.modules',
                component: () => import('@/views/Modules.vue'),
                meta: { title: 'Learning Modules' }
            },
            {
                path: 'modules/:id',
                name: 'user.module',
                component: () => import('@/views/ModuleDetail.vue'),
                meta: { title: 'Module' }
            },
            {
                path: 'learning-paths/:id',
                name: 'user.learning-path',
                component: () => import('@/views/dashboard/LearningPath.vue'),
                meta: { title: 'Learning Path' }
            },
            {
                path: 'leaderboard',
                name: 'user.leaderboard',
                component: () => import('@/views/dashboard/Leaderboard.vue'),
                meta: { title: 'Leaderboard' }
            },
            {   path: 'profile', 
                name: 'user.profile', 
                component: ProfileView, 
                meta: { title: 'My Profile' }
            },
            {   path: 'settings', 
                name: 'user.settings', 
                component: SettingsView, 
                meta: { title: 'Settings' }
            },
            
            {
                path: 'manage-badges',
                name: 'user.managebadges',
                component: () => import('@/views/dashboard/ManageBadges.vue'),
                meta: { title: 'Manage Badges' }
            },
        ]
    },

    // ===== Facilitator Routes =====
    {
        path: '/facilitator',
        component: FacilitatorDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['educator', 'moderator', 'admin'] },
        children: [
            {
                path: '',
                redirect: '/facilitator/dashboard'
            },
            {
                path: 'dashboard',
                name: 'facilitator.dashboard',
                component: () => import('@/views/facilitator/FacilitatorDashboard.vue'),
                meta: { title: 'Facilitator Portal' }
            },
            // {
            //     path: 'students',
            //     name: 'facilitator.students',
            //     // component: () => import('@/views/facilitator/MyStudents.vue'),
            //     component: () => import('@/views/facilitator/Modules.vue'),
            //     meta: { title: 'My Students' }
            // },
            {
                path: 'modules',
                name: 'facilitator.modules',
                component: () => import('@/views/Modules.vue'),
                meta: { title: 'My Modules' }
            },
            {
                path: 'modules/:id',
                name: 'facilitator.module',
                component: () => import('@/views/ModuleDetail.vue'),
                meta: { title: 'Module' }
            },

            // {
            //     path: 'modules/create',
            //     name: 'facilitator.modules.create',
            //     component: () => import('@/views/facilitator/CreateModule.vue'),
            //     meta: { title: 'Create Module' }
            // },
            // {
            //     path: 'modules/:id/edit',
            //     name: 'facilitator.modules.edit',
            //     component: () => import('@/views/facilitator/EditModule.vue'),
            //     meta: { title: 'Edit Module' }
            // },
            // {
            //     path: 'analytics',
            //     name: 'facilitator.analytics',
            //     component: () => import('@/views/facilitator/Analytics.vue'),
            //     meta: { title: 'Analytics' }
            // },
            // {
            //     path: 'resources',
            //     name: 'facilitator.resources',
            //     component: () => import('@/views/facilitator/Resources.vue'),
            //     meta: { title: 'Teaching Resources' }
            // },
            // {
            //     path: 'reviews',
            //     name: 'facilitator.reviews',
            //     component: () => import('@/views/facilitator/Reviews.vue'),
            //     meta: { title: 'Pending Reviews' }
            // },

            {   path: 'profile', 
                name: 'facilitator.profile', 
                component: ProfileView, 
                meta: { title: 'My Profile' } 
            },
            {   path: 'settings', 
                name: 'facilitator.settings', 
                component: SettingsView, 
                meta: { title: 'Settings' } 
            },
        ]
    },

    // ===== Admin Routes =====
    {
        path: '/admin',
        component: AdminDashboardLayout,
        meta: { requiresAuth: true, requiresRole: ['admin'] },
        children: [
            {
                path: '',
                redirect: '/admin/dashboard'
            },
            {
                path: 'dashboard',
                name: 'admin.dashboard',
                component: () => import('@/views/admin/AdminDashboard.vue'),
                meta: { title: 'Admin Control Panel' }
            },
            {
                path: 'facilitators',
                name: 'admin.facilitators',
                component: () => import('@/views/admin/FacilitatorManagement.vue'),
                meta: { title: 'Facilitator Management' }
            },
            // {
            //     path: 'users',
            //     name: 'admin.users',
            //     component: () => import('@/views/admin/UserManagement.vue'),
            //     meta: { title: 'User Management' }
            // },
            // {
            //     path: 'content',
            //     name: 'admin.content',
            //     component: () => import('@/views/admin/ContentManagement.vue'),
            //     meta: { title: 'Content Library' }
            // },
            // {
            //     path: 'content/modules',
            //     name: 'admin.content.modules',
            //     component: () => import('@/views/admin/ModuleManagement.vue'),
            //     meta: { title: 'Module Management' }
            // },
            // {
            //     path: 'content/categories',
            //     name: 'admin.content.categories',
            //     component: () => import('@/views/admin/CategoryManagement.vue'),
            //     meta: { title: 'Category Management' }
            // },
            // {
            //     path: 'reports',
            //     name: 'admin.reports',
            //     component: () => import('@/views/admin/Reports.vue'),
            //     meta: { title: 'Analytics & Reports' }
            // },
            // {
            //     path: 'activity',
            //     name: 'admin.activity',
            //     component: () => import('@/views/admin/ActivityLog.vue'),
            //     meta: { title: 'Activity Log' }
            // },
            // {
            //     path: 'settings',
            //     name: 'admin.settings',
            //     component: () => import('@/views/admin/Settings.vue'),
            //     meta: { title: 'Platform Settings' }
            // },
            // {
            //     path: 'settings/security',
            //     name: 'admin.settings.security',
            //     component: () => import('@/views/admin/SecuritySettings.vue'),
            //     meta: { title: 'Security Settings' }
            // },
            // {
            //     path: 'settings/notifications',
            //     name: 'admin.settings.notifications',
            //     component: () => import('@/views/admin/NotificationSettings.vue'),
            //     meta: { title: 'Notification Settings' }
            // },
            {   path: 'profile', 
                name: 'admin.profile', 
                component: ProfileView, 
                meta: { title: 'My Profile' } 
            },
            {   path: 'settings', 
                name: 'admin.settings', 
                component: SettingsView, 
                meta: { title: 'Account Settings' } 
            },
        ]
    },

    // ===== Profile & Settings (All Authenticated Users - Role-Agnostic) =====
    // {
    //     path: '/profile',
    //     name: 'profile',
    //     component: () => import('@/views/Profile.vue'),
    //     meta: {
    //         requiresAuth: true,
    //         title: 'My Profile'
    //     }
    // },
    // {
    //     path: '/settings',
    //     name: 'settings',
    //     component: () => import('@/views/Settings.vue'),
    //     meta: {
    //         requiresAuth: true,
    //         title: 'Account Settings'
    //     }
    // }
]

export default authenticatedRoutes