import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Drawer as DrawerT, Button, Spinner } from 'components/ui'
import Content from './Content'
import {
	setDrawerPermissionRequestOpen,
	setLoading,
	setDiscountInfo,
	setPermissionRequests
} from '../../store/stateSlice'
import { themeConfig } from 'configs/theme.config'

const { textThemeColor, colorSecondary } = themeConfig

const Drawer = ( { state, setState } ) =>
{
	const dispatch = useDispatch()
	const {
		loading,
		drawer_permission_request_open:drawerPermissionRequestOpen,
	} = useSelector((state) => state.attendance.state )

    const onDrawerClose = () => {
		dispatch( setLoading( false ) )
        dispatch( setDrawerPermissionRequestOpen( false ) )
		dispatch( setDiscountInfo( null ) )
		dispatch( setPermissionRequests( null ) )
		document.body.style.overflow = 'auto';
	}
	
	
	return (
		<DrawerT
			closable={ false }
			isOpen={ drawerPermissionRequestOpen }
			onClose={ onDrawerClose }
			onRequestClose={ onDrawerClose }
			title={
				<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
					Detalles de Fecha
				</h4>
			}
			footer={
				<div className="flex justify-between items-center w-full">
                	<Button size="sm" variant="solid" color={colorSecondary} onClick={onDrawerClose}>Salir</Button>
        		</div>
			}
		>
			{
				loading ?
				<div className='flex justify-center items-center h-full'>
					<Spinner size="3.25rem" />
				</div>
				: <Content state={state} setState={setState} />
			}
		</DrawerT>
	)
    
}

export default Drawer