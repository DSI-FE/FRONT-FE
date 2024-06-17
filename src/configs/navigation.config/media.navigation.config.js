import { MEDIA_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const mediaNavigationConfig = [
	{
        key: 'media',
        path: `${MEDIA_PREFIX_PATH}/magazine`,
        title: 'Medios de Comunicación',
        icon: 'magazine',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    }
]

export default mediaNavigationConfig