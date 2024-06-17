import { DIRECTORY_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const directoryNavigationConfig = [

	{
		key: 'directory',
		path: `${DIRECTORY_PREFIX_PATH}/employees`,
		type: NAV_ITEM_TYPE_TITLE,
		authority: [ADMIN, USER],
		subMenu: [
			{
				key: 'directory.employees',
				path: `${DIRECTORY_PREFIX_PATH}/employees`,
				translateKey: 'nav.directory.home',
				icon: 'contacts',
				type: NAV_ITEM_TYPE_COLLAPSE,
				authority: [ADMIN, USER],
				subMenu: [
					{
						key: 'directory.employees',
						path: `${DIRECTORY_PREFIX_PATH}/employees`,
						translateKey: 'Empleados',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [ADMIN, USER],
						subMenu: []
					},
					// {
					// 	key: 'directory.directories',
					// 	path: `${DIRECTORY_PREFIX_PATH}/`,
					// 	translateKey: 'Mis Directorios',
					// 	type: NAV_ITEM_TYPE_ITEM,
					// 	authority: [ADMIN, USER],
					// 	subMenu: []
					// },
				]
			},
        ]
	},
]

export default directoryNavigationConfig