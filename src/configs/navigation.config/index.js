import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM} from 'constants/navigation.constant'
import directoryNavigationConfig from './directory.navigation.config'
import clientesNavigationConfig from './clientes.navigation.config'

import Dsi from 'views/dsi';
import inventarioNavigationConfig from './inventario.navigation.config';
import comprasNavigationConfig from './compras.navigation.config';

import ventasNavigationConfig from './ventas.navigation.config';

const navigationConfig = [
    
    ...directoryNavigationConfig,
    ...clientesNavigationConfig, 
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
                title: 'Puestos de trabajo',
                translateKey: 'nav.administration.organizational-units',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'administration.functional-positions',
                path: 'administration/functional-positions',
                title: 'Cargos asignados',
                translateKey: 'nav.administration.functional-positions',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                pos: [1, 60]
            },
        ]
    },
    ...inventarioNavigationConfig,
    ...comprasNavigationConfig,
    ...ventasNavigationConfig 
]

export default navigationConfig
