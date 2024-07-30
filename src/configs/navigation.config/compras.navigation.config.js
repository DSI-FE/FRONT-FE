import { COMPRAS_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const comprasNavigationConfig = [
	{
        key: 'compras',
        path: `${COMPRAS_PREFIX_PATH}/compras`,
        title: 'Compras',
        icon: 'compras',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    }
]

export default comprasNavigationConfig