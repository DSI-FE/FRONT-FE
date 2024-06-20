import { CLIENTES_PREFIX_PATH } from 'constants/route.constant'
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
		  translateKey: 'clientes',
		  icon: 'clock',
		  type: NAV_ITEM_TYPE_COLLAPSE,
		  authority: [ADMIN, USER],
		  subMenu: [ ],
		},
	  ],
	},
  ];
  
  export default clientesNavigationConfig;
  
  