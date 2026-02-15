// protectEdFrontend\src\router\authenticatedPages\facilitator_pages.js

const ProfileView = () => import('@/views/Profile.vue');
const SettingsView = () => import('@/views/Settings.vue');

export const facilitatorPages = [

    {
        path: 'dashboard',
        name: 'facilitator.dashboard',
        component: () => import('@/views/facilitator/FacilitatorDashboard.vue'),
        meta: { title: 'Facilitator Portal' }
    },
    {
        path: 'modules',
        name: 'facilitator.modules',
        component: () => import('@/views/Modules.vue'),
        meta: { title: 'My Modules' }
    },

    {
        path: 'students',
        name: 'facilitator.students',
        component: () => import('@/views/facilitator/StudentManagement.vue'),
        meta: { title: 'My Modules' }
    },
    {
        path: "classrooms",
        name: "facilitator.classrooms",
        component: () => import("@views/facilitator/FacilitatorClassroomList.vue"),
        meta: { title: 'My Classrooms' }
    },
    {
        path: "classroom/create",
        name: "classroom.create",
        component: () => import("@views/facilitator/CreateClassroom.vue"),
        meta: { title: 'Create Classroom' }
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
    //     path: 'resources',
    //     name: 'facilitator.resources',
    //     component: () => import('@/views/facilitator/Resources.vue'),
    //     meta: { title: 'Teaching Resources' }
    // },
    // Student Monitoring & Intervention
    // {
    //     path: 'analytics',
    //     name: 'facilitator.analytics',
    //     component: () => import('@/views/facilitator/Analytics.vue'),
    //     meta: { title: 'Class Analytics' }
    // },
    // {
    //     path: 'student-logs',
    //     name: 'facilitator.students',
    //     component: () => import('@/views/facilitator/StudentLogs.vue'),
    //     meta: { title: 'Student Progress' }
    // },
    // {
    //     path: 'alerts',
    //     name: 'facilitator.alerts',
    //     component: () => import('@/views/facilitator/EarlyAlerts.vue'),
    //     meta: { title: 'Early Alerts', critical: true }
    // },
    // {
    //     path: 'risk-patterns',
    //     name: 'facilitator.risk',
    //     component: () => import('@/views/facilitator/RiskIndicators.vue'),
    //     meta: { title: 'Risk Indicators' }
    // },
    // {
    //     path: 'reports',
    //     name: 'facilitator.reports',
    //     component: () => import('@/views/facilitator/Reports.vue'),
    //     meta: { title: 'Progress Reports' }
    // },
    // {
    //     path: 'profile',
    //     name: 'facilitator.profile',
    //     component: ProfileView,
    //     meta: { title: 'My Profile' }
    // },
    // {
    //     path: 'settings',
    //     name: 'facilitator.settings',
    //     component: SettingsView,
    //     meta: { title: 'Settings' }
    // },
];