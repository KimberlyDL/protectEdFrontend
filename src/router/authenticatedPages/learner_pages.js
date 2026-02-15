// protectEdFrontend\src\router\authenticatedPages\learner_pages.js

const ProfileView = () => import('@/views/Profile.vue');
const SettingsView = () => import('@/views/Settings.vue');

export const learnerPages = [

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
        meta: {
            title: 'Learning Modules',
            breadcrumb: 'Modules'
        }
    },
    {
        path: 'modules/:id',
        name: 'user.module',
        component: () => import('@/views/ModuleDetail.vue'),
        meta: {
            title: 'Module Content',
            activeMenu: 'user.modules'
        }
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
    {
        path: 'manage-badges',
        name: 'user.managebadges',
        component: () => import('@/views/dashboard/ManageBadges.vue'),
        meta: { title: 'My Achievements' }
    },
    // {
    //     path: 'milestones',
    //     name: 'user.milestones',
    //     component: () => import('@/views/dashboard/Milestones.vue'),
    //     meta: { title: 'My Milestones' }
    // },

    // {
    //     path: 'stress-meter',
    //     name: 'user.stress',
    //     component: () => import('@/views/wellness/StressMeter.vue'),
    //     meta: { title: 'Stress Meter' }
    // },
    {
        path: 'stats',
        name: 'user.stats',
        component: () => import('@/views/dashboard/UserStats.vue'),
        meta: { requiresAuth: true }
    },
    // {
    //     path: 'profile',
    //     name: 'user.profile',
    //     component: ProfileView,
    //     meta: { title: 'My Profile' }
    // },
    // {
    //     path: 'settings',
    //     name: 'user.settings',
    //     component: SettingsView,
    //     meta: { title: 'Settings' }
    // },

];