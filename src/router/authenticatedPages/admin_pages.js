// protectEdFrontend\src\router\authenticatedPages\admin_pages.js

const ProfileView = () => import('@/views/Profile.vue');
const SettingsView = () => import('@/views/Settings.vue');

export const adminPages = [

    {
        path: '',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { title: 'Admin Control Panel' }
    },
    // {
    //     path: 'management',
    //     name: 'admin.users',
    //     component: () => import('@/views/admin/UserManagement.vue'),
    //     meta: { title: 'User Management' }
    // },
    {
        path: 'facilitators',
        name: 'admin.facilitators',
        component: () => import('@/views/admin/FacilitatorManagement.vue'),
        meta: { title: 'Facilitator Management' }
    },
    // {
    //     path: 'approvals',
    //     name: 'admin.approvals',
    //     component: () => import('@/views/admin/ContentApproval.vue'),
    //     meta: { title: 'Content Approval' }
    // },
    // {
    //     path: 'resources',
    //     name: 'admin.resources',
    //     component: () => import('@/views/ResourceLibrary.vue'),
    //     meta: { title: 'Master Resource Library' }
    // },
    // {
    //     path: 'game-settings',
    //     name: 'admin.game-settings',
    //     component: () => import('@/views/admin/GameSettings.vue'),
    //     meta: { title: 'Game Engine Config' }
    // },
    // {
    //     path: 'ai-settings',
    //     name: 'admin.ai-settings',
    //     component: () => import('@/views/admin/AISettings.vue'),
    //     meta: { title: 'AI Risk Config' }
    // },
    // {
    //     path: 'security',
    //     name: 'admin.security',
    //     component: () => import('@/views/admin/SecuritySettings.vue'),
    //     meta: { title: 'System Security' }
    // },
    // {
    //     path: 'audit-logs',
    //     name: 'admin.audit',
    //     component: () => import('@/views/admin/ActivityLog.vue'),
    //     meta: { title: 'System Audit' }
    // },
    // {
    //     path: 'profile',
    //     name: 'admin.profile',
    //     component: ProfileView,
    //     meta: { title: 'My Profile' }
    // },
    // {
    //     path: 'settings',
    //     name: 'admin.settings',
    //     component: SettingsView,
    //     meta: { title: 'Account Settings' }
    // }
];