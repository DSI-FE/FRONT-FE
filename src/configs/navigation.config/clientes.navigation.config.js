import { CLIENTES_PREFIX_PATH, PRODUCTOS_PREFIX_PATH, PROVEEDORES_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const clientesNavigationConfig = [
	{
		key: 'clientes',
		path: `${CLIENTES_PREFIX_PATH}/clientes`,
		type: NAV_ITEM_TYPE_TITLE,
		authority: [ADMIN, USER],
		subMenu: [
			{
				key: 'clientes.clientes',
				path: `${CLIENTES_PREFIX_PATH}/clientes`,
				translateKey: 'Listado',
				icon: 'dsi',
				type: NAV_ITEM_TYPE_COLLAPSE,
				authority: [ADMIN, USER],
				subMenu: [
					{
						key: 'clientes.clientes',
						path: `${CLIENTES_PREFIX_PATH}/clientes`,
						translateKey: 'Clientes',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [ADMIN, USER],
						subMenu: []
					},
					{
						key: 'proveedores.proveedores',
						path: `${PROVEEDORES_PREFIX_PATH}/proveedores`,
						translateKey: 'Proveedores',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [ADMIN, USER],
						subMenu: []
					},
					{
						key: 'productos',
						path: `${PRODUCTOS_PREFIX_PATH}/productos`,
						title: 'Productos',
						icon: 'productos',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [],
						subMenu: [],
					}
				],
			},
		],
	}
];

export default clientesNavigationConfig;
