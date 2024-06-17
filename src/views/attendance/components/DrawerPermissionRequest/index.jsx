import React, { useState } from 'react'
import { Drawer as DrawerT, Button } from 'components/ui'
import Content from './Content'
import { themeConfig } from 'configs/theme.config'
import { apiValidateStorePermissionRequest } from 'services/AttendanceService'
import { openNotification } from 'helpers'
import DialogPermissionRequest from '../DialogPermissionRequest'

const { textThemeColor, colorSecondary } = themeConfig

const validateStorePermissionRequest = async (data) => {
    const res = await apiValidateStorePermissionRequest(data)
    return res.data
}

const DrawerPermissionRequest =  ( { state, setState, employeeIsBoss = false, permissionRequestId = null, selectedDate = null } ) =>
{

	const [openDialog, setOpenDialog ] = useState(false)
	const [data, setData ] = useState([])
	
	const onDrawerClose = () => {
		setState(false)
		document.body.style.overflow = 'auto'
	}

	let gatherFormData = null
    const getFormData = func => { gatherFormData = func }

    const onSubmit = async () => {
		if ( typeof gatherFormData === 'function' ) {
			try {
				const rawData = gatherFormData()
				const formData = new FormData()
				
				Object.entries(rawData).forEach(([key, value]) => {
					if (key !== 'files' && value) {
						formData.append(key, value)
					}
				})

				Object.entries(rawData.files).forEach(([fileName, fileArray]) => {
					formData.append('files['+fileName+']', fileArray[0])
				})
				
				const response = await validateStorePermissionRequest(formData)

				if( response ) {
					formData.append('att_permission_type', response.att_permission_type)
					setData(formData)
					setOpenDialog(true)
				}

			} catch (errors) {
				const message = errors?.response?.data?.errors || errors.toString()
				openNotification('danger','Error',message,'top-start')
			}
		}
	}
	
	return (
		<>
			<DrawerT
				closable={ false }
				isOpen={ state }
				onClose={ onDrawerClose }
				onRequestClose={ onDrawerClose }
				widthPercent={ true }
				title={
					<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
						Nueva Solicitud de Permiso
					</h4>
				}
				footer={
					<div className="flex justify-between items-center w-full">
						<Button size="sm" variant="solid" color={colorSecondary} onClick={onDrawerClose}>Salir</Button>
						<Button size="sm" variant="solid" onClick={onSubmit}>Aceptar</Button>
					</div>
				}
			>
				<Content
					employeeIsBoss={ employeeIsBoss }
					getFormData={ getFormData }
					selectedDate={ selectedDate }
					permissionRequestId = { permissionRequestId }
				/>
			</DrawerT>
			<DialogPermissionRequest state={ openDialog } setState={ setOpenDialog } setParentState={ setState } data={ data } />
		</>
	)
}

export default DrawerPermissionRequest