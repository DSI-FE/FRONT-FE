import { INVENTARIO_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const inventarioNavigationConfig = [
	{
        key: 'inventario',
        path: `${INVENTARIO_PREFIX_PATH}/inventario`,
        title: 'Inventarios',
        icon: 'inventario',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    }
]

export default inventarioNavigationConfig