import React from 'react'
import { ATTENDANCE_PREFIX_PATH } from 'constants/route.constant';

const title = 'Asistencias';

const options = [
    {title:'Marcaciones y Descuentos',key:'attendance.attendances',path:`${ATTENDANCE_PREFIX_PATH}/attendances`},
    {title:'Solicitudes',key:'attendance.requests.permissions',path:`${ATTENDANCE_PREFIX_PATH}/requests/permissions`},
    {title:'Reportes y Estadísticas',key:'attendance.reports',path:`${ATTENDANCE_PREFIX_PATH}/reports/markings`,rrhh:true,boss:true},
    {title:'Configuraciones',key:'attendance.settings',path:`${ATTENDANCE_PREFIX_PATH}/settings/markings`,rrhh:true}
];

const reqSubOptions = [
    {title:'Permisos',key:'attendance.requests.permissions',path:`${ATTENDANCE_PREFIX_PATH}/requests/permissions`},
    {title:'Compensatorios',key:'attendance.requests.compensatories',path:`${ATTENDANCE_PREFIX_PATH}/requests/compensatories`},
//     // {title:'Viáticos',key:'attendance.requests.travel',path:`${ATTENDANCE_PREFIX_PATH}/requests/travel`},
//     // {title:'Horas Extra',key:'attendance.requests.extra',path:`${ATTENDANCE_PREFIX_PATH}/requests/extra`}
]

const repSubOptions = [
    {title:'Marcaciones',key:'attendance.reports.markings',path:`${ATTENDANCE_PREFIX_PATH}/reports/markings`},
    {title:'Permisos',key:'attendance.reports.permissions',path:`${ATTENDANCE_PREFIX_PATH}/reports/permissions`},
]

const setSubOptions = [
    {title:'Marcaciones',key:'attendance.reports.markings',path:`${ATTENDANCE_PREFIX_PATH}/settings/markings`},
    {title:'Asuetos',key:'attendance.reports.holidays',path:`${ATTENDANCE_PREFIX_PATH}/settings/holidays`},
    {title:'Tipos de Permiso',key:'attendance.reports.permissionTypes',path:`${ATTENDANCE_PREFIX_PATH}/settings/permission-types`}
]

const attIndex = 1
const reqIndex = 2
const repIndex = 3
const setIndex = 4

const attendanceRoute =
[
    {
        key: 'attendance',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}`,
        component: React.lazy(() => import('views/attendance/')),
        authority: [],
        base:{
            title:title,
            subtitle:'Asistencias y Permisos',
            info:'Consequat consectetur excepteur nulla est eu anim culpa commodo incididunt esse est. Proident cupidatat ut nisi ea ipsum.',
            options:options
        },
        index:1
    },

    {
        key: 'attendance.attendances',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/attendances`,
        component: React.lazy(() => import('views/attendance/Attendances')),
        authority: [],
        base:{
            title:title,
            subtitle:'Marcaciones y Descuentos',
            info:'Se muestra el resumen de las marcaciones, descuentos y permisos para el empleado en un periodo determinado. Puede filtrar las fechas del periodo de consulta.',
            options:options
        },
        index:attIndex
    },
    {
        key: 'attendance.requests',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/requests`,
        component: React.lazy(() => import('views/attendance/Requests')),
        authority: [],
        base:{
            title:title,
            subtitle:'Solicitudes',
            info:'Se muestran las solicitudes de permisos y compensatorios',
            options:options,
            subOptions:reqSubOptions
        },
        index:reqIndex
    },
    {
        key: 'attendance.reports',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/reports`,
        component: React.lazy(() => import('views/attendance/Reports')),
        authority: [],
        base:{
            title:title,
            subtitle:'Reportes y Estadísticas',
            info:'Se muestran los reportes generados automaticamente por el sistema',
            options:options,
            subOptions:repSubOptions
        },
        index:repIndex
    },
    {
        key: 'attendance.settings.markings',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/settings/markings`,
        component: React.lazy(() => import('views/attendance/Settings')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'Gestión de valores y parámetros involucrados en el módulo de marcaciones y descuentos. Acceso a procesos de marcaciones, cálculos de descuentos, entre otros.',
            options:options,
            subOptions:setSubOptions
        },
        index:setIndex,
        subIndex:1
    },

    {
        key: 'attendance.settings.holidays',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/settings/holidays`,
        component: React.lazy(() => import('views/attendance/Settings/holidays')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'Gestión de valores y parámetros involucrados en el módulo de marcaciones y descuentos. Acceso a procesos de marcaciones, cálculos de descuentos, entre otros.',
            options:options,
            subOptions:setSubOptions
        },
        index:setIndex,
        subIndex:2
    },

    {
        key: 'attendance.settings.permissionTypes',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/settings/permission-types`,
        component: React.lazy(() => import('views/attendance/Settings/permissionTypes')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'Gestión de valores y parámetros involucrados en el módulo de marcaciones y descuentos. Acceso a procesos de marcaciones, cálculos de descuentos, entre otros.',
            options:options,
            subOptions:setSubOptions
        },
        index:setIndex,
        subIndex:3
    },

    {
        key: 'attendance.requests.compensatories',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/requests/compensatories`,
        component: React.lazy(() => import('views/attendance/Requests/compensatories')),
        authority: [],
        base:{
            title:title,
            subtitle:'Solicitudes',
            info:'Se muestran las solicitudes de permisos y compensatorios',
            options:options,
            subOptions:reqSubOptions
        },
        index:reqIndex,
        subIndex:2
    },
    {
        key: 'attendance.requests.permissions',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/requests/permissions`,
        component: React.lazy(() => import('views/attendance/Requests/permissions')),
        authority: [],
        base:{
            title:title,
            subtitle:'Solicitudes',
            info:'Se muestran las solicitudes de permisos y compensatorios',
            options:options,
            subOptions:reqSubOptions
        },
        index:reqIndex,
        subIndex:1
    },
    // {
    //     key: 'attendance.requests.permissionRequests',
    //     generalKey: 'attendance',
    //     path: `${ATTENDANCE_PREFIX_PATH}/requests/permission-requests`,
    //     component: React.lazy(() => import('views/attendance/Requests/PermissionRequests')),
    //     authority: [],
    //     base:{
    //         title:title,
    //         subtitle:'Solicitud de Permisos y Licencias',
    //         info:'Se muestran las solicitudes de permisos y compensatorios.',
    //         options:options,
            // subOptions:reqSubOptions
    //     },
    //     index:reqIndex,
    //     subIndex:5
    // },
    {
        key: 'attendance.requests.extra',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/requests/extra`,
        component: React.lazy(() => import('views/attendance/Requests/extra')),
        authority: [],
        base:{
            title:title,
            subtitle:'Solicitudes',
            info:'Se muestran las solicitudes de permisos y compensatorios',
            options:options,
            subOptions:reqSubOptions
        },
        index:reqIndex,
        subIndex:4
    },
    {
        key: 'attendance.requests.travel',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/requests/travel`,
        component: React.lazy(() => import('views/attendance/Requests/travel')),
        authority: [],
        base:{
            title:title,
            subtitle:'Solicitudes',
            info:'Se muestran las solicitudes de permisos y compensatorios',
            options:options,
            subOptions:reqSubOptions
        },
        index:reqIndex,
        subIndex:3
    },

    {
        key: 'attendance.reports.markings',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/reports/markings`,
        component: React.lazy(() => import('views/attendance/Reports/markings')),
        authority: [],
        base:{
            title:title,
            subtitle:'Reportes y Estadísticas',
            info:'Se muestran los reportes generados automaticamente por el sistema',
            options:options,
            subOptions:repSubOptions
        },
        index:reqIndex,
        subIndex:1
    },
    {
        key: 'attendance.reports.permissions',
        generalKey: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/reports/permissions`,
        component: React.lazy(() => import('views/attendance/Reports/permissions')),
        authority: [],
        base:{
            title:title,
            subtitle:'Reportes y Estadísticas',
            info:'Se muestran los reportes generados automaticamente por el sistema',
            options:options,
            subOptions:repSubOptions
        },
        index:reqIndex,
        subIndex:2
    }

    
]
export default attendanceRoute