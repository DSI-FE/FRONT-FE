import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM} from 'constants/navigation.constant'

import directoryNavigationConfig from './directory.navigation.config'

import Dsi from 'views/dsi';

const navigationConfig = [
    
    ...directoryNavigationConfig,
 
    {
        key: 'administrationCollapse',
        title: 'Administración',
        path: '#',
        icon: 'userCog',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        pos: [1, 60],
        subMenu: [
            {
                key: 'payment_vouchers.employees',
                path: 'administration/employees',
                title: 'Empleados',
                translateKey: 'nav.administrationCollapse.employees',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'administration.organizational-units',
                path: 'administration/organizational-units',
                title: 'Unidades Organizacionales',
                translateKey: 'nav.administration.organizational-units',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'administration.functional-positions',
                path: 'administration/functional-positions',
                title: 'Cargos Funcionales',
                translateKey: 'nav.administration.functional-positions',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                pos: [1, 60]
            },
        ]
    },
    {
        key: 'ourJob',
        path: 'our-job/gallery',
        title: 'Acerca de Nuestro Trabajo',
        translateKey: 'nav.ourJob',
        icon: 'cogs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: []
    },




]

export default navigationConfig
