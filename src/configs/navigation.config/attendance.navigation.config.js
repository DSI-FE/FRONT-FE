import { ATTENDANCE_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const attendanceNavigationConfig = [
	{
        key: 'attendance',
        path: `${ATTENDANCE_PREFIX_PATH}/attendances`,
        title: 'Asistencias y Permisos',
        icon: 'businessTime',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    }
]

export default attendanceNavigationConfig