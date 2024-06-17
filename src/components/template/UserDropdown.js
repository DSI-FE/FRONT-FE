import React, {useEffect} from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'

import { themeConfig } from 'configs/theme.config'

// import { apiGetNotifications } from 'services/AdministrationService'


const { textThemeColor } = themeConfig;

// const dropdownItemList = []

// const getNotifications = async () => {
//     return await apiGetNotifications()
// }

export const UserDropdown = ({ className }) => {
    // bind this
    // const userInfo = useSelector((state) => state.auth.user)

	const { employee, functionalPosition, organizationalUnit } = useSelector((state) => state.auth);
	const { current_route_key:currentRouteKey } = useSelector((state) => state.base.common);

    const { signOut } = useAuth();
    const ava = employee.photo ? employee.photo : '/img/avatars/nopic.jpg';


    useEffect( () => {
        // getNotifications()
    },[currentRouteKey])

    const UserAvatar = (
		<div className={classNames(className, 'flex items-center gap-2')}>
			<div className="hidden md:block text-right">
				<div>
					<span className={`font-bold ${textThemeColor}`}>{ employee.name + ' ' + employee.lastname }</span>
				</div>
				<div className="text-sm">
					<span>{`${functionalPosition.name} `}</span>
					-
					<span>{` ${organizationalUnit.name}`}</span>
					{/* <span>{` ${notificationsQty}`}</span> */}

				</div>
				{/* <div className="text-xs">{organizationalUnit.name}</div> */}
			</div>
			<Avatar size={50} src={ava} shape="circle" icon={<HiOutlineUser />} />
		</div>
	)

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                {/* <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar shape="circle" icon={<HiOutlineUser />} />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                User01
                            </div>
                            <div className="text-xs">user01@mail.com</div>
                        </div>
                    </div>
                </Dropdown.Item> */}
                {/* <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        eventKey={item.label}
                        key={item.label}
                        className="mb-1"
                    >
                        <Link
                            className="flex gap-2 items-center"
                            to={item.path}
                        >
                            <span className="text-xl opacity-50">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    </Dropdown.Item>
                ))} */}
                {/* <Dropdown.Item variant="divider" /> */}
                <Dropdown.Item
                    onClick={signOut}
                    eventKey="Sign Out"
                    className="gap-2"
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Salir</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default withHeaderItem(UserDropdown)
