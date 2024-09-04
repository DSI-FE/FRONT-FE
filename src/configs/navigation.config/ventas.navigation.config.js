import { VENTAS_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const ventasNavigationConfig = [
	{
        key: 'ventas',
        path: `${VENTAS_PREFIX_PATH}/ventas`,
        title: 'Ventas',
        icon: 'ventas',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    }
]

export default ventasNavigationConfig