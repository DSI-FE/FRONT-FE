import React from "react";
import { ADMINISTRATION_PREFIX_PATH } from 'constants/route.constant';


const title = 'Ferretería Flores';
const options = [
    {title:'Boletas de Pago',key:'attendance.attendances',path:`administration/payment_vouchers`},
];

const administrationRoute = [
    {
        key: 'administration_employees',
        path: '/administration/employees',
        component: React.lazy(() => import('views/administration/Employees')),
        authority: [],
    },
    {
        key: 'administration.organizational-units',
        generalKey: 'administration',
        path: `${ADMINISTRATION_PREFIX_PATH}/organizational-units`,
        component: React.lazy(() => import('views/dsi/OrganizationalUnits')),
        authority: [],
        base:{
            title:title,
            subtitle:'Unidades Organizacionales',
            info:'Gestión de unidades organizacionales .',
            options:options
        },
        index:3,
    },
    {
        key: 'administration.functional-positions',
        generalKey: 'administration',
        path: `${ADMINISTRATION_PREFIX_PATH}/functional-positions`,
        component: React.lazy(() => import('views/dsi/FunctionalPositions')),
        authority: [],
        base:{
            title:title,
            subtitle:'Cargos Funcionales',
            info:'Gestión de cargos funcionales.',
            options:options
        },
        index:3,
    },
]

export default administrationRoute;
