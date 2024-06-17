import React, {useRef,useCallback,useEffect, useState } from 'react'
import {  Drawer as DrawerTemplate, Spinner,Avatar,Button,FormItem,FormContainer,Input,Notification,toast} from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { HiOutlineUser,HiMail,HiPhone,HiOutlineCalendar,HiOutlineClock,HiDocument } from 'react-icons/hi'
import { IconText } from 'components/shared'
import { BsFillDiagram2Fill } from 'react-icons/bs'
import axios from 'axios'
import {
	setDrawerAppOpen,
	setDrawerTitle,
	setDrawerInfo,
	getPermissionTypesIndexActive,
	setSelectedPermissionType,
	setSelectedPermission
} from '../store/stateSlice'
import {StringDateToFormat,convertToAmPm } from 'helpers'
import BaseService from 'services/BaseService'
import { getEmployeePermissions,getOrganizationUnitPermissions, getAllPermissions } from '../store/dataSlice'

import appConfig from 'configs/app.config'

const { apiPrefix } = appConfig

const Drawer = ({isBoss,isRRHH}) =>
{
	const dispatch = useDispatch()
	const [observation,setObservation] = useState('')
	
	const {
		loading,
		drawer_app_open:drawerOpen,
		drawer_title:drawerTitle,
		drawer_info:drawerInfo,
		selected_permission:selectedPermission
	} = useSelector((state) => state.permissions.state)

	const { employee:employeeSession } = useSelector((state) => state.auth)

	const status = selectedPermission ? selectedPermission.status : null
	const employee = selectedPermission ? selectedPermission.employee:{}
	const ava = employee ? employee.photo : '/img/avatars/nopic.jpg'
	const permissionType = selectedPermission ? selectedPermission.permission_type : '-'
	const description = selectedPermission ? selectedPermission.description : '-'
	const dateIni = selectedPermission ? StringDateToFormat(selectedPermission?.date_start) :  '-'
	const dateEnd = selectedPermission ? StringDateToFormat(selectedPermission?.date_end) :  '-'

	const timeIni = selectedPermission?.time_start ? convertToAmPm(selectedPermission?.time_start) :  '-'
	const timeEnd = selectedPermission?.time_end ? convertToAmPm(selectedPermission?.time_end) :  '-'

	const permissionComments = selectedPermission ? selectedPermission.permission_comments :  []
	const attachments = selectedPermission ? selectedPermission.attachments :  []

	const { organizationalUnit,session } = useSelector((state) => state.auth)

	const downloadFile = (fileId,filename) => {
		axios.get(`${apiPrefix}/attendance/permissions/download/${fileId}`, { responseType: 'blob',headers: {
			Authorization: `Bearer ${session.token}`,
		}, })
		.then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', filename)
			document.body.appendChild(link)
			link.click()
		})
		.catch(error => { console.error('Error al descargar archivo:', error) })
	}
	
	const Title = () =>(
		<div>
			<h5 className="mb-2 flex justify-start items-center gap-2 text-slate-600">{drawerTitle}</h5>
			<p>{ drawerInfo }</p>
		</div>
	)

	const Footer = ( { onCancel, onApproveClick } ) => {

		if ( isBoss || isRRHH ){
			return (
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center w-2/12">
						<Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
					</div>
					<div className="flex justify-end gap-4 items-center w-5/12">
					{ 
						( isBoss && employeeSession.id != employee.id && (status === 1 || status === 0) ) || ( isRRHH && status === 2 ) ?
						<>
							<Button color="emerald-500" loading={loading} size="sm" variant="solid" onClick={()=>onApproveClick(1)}>Aprobar</Button>
							<Button color="orange-500" loading={loading} size="sm" variant="solid" onClick={()=>onApproveClick(2)}>Modificar</Button>
							<Button color="red-600" loading={loading} size="sm" variant="solid" onClick={()=>onApproveClick(3)}>Rechazar</Button>
						</>
						:<></>
					}
						
					</div>
				</div>
			)
		} else {
			return (
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center w-2/12">
						<Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
					</div>
				</div>
			)
		}
	}
	
	const onDrawerClose = () => {
		dispatch(setDrawerAppOpen(false))
		dispatch(setDrawerTitle(''))
		dispatch(setDrawerInfo(''))
		dispatch(setSelectedPermissionType(''))
		dispatch(setSelectedPermission(null))
	}
	
	const fetchData = useCallback( () => {
        dispatch(getPermissionTypesIndexActive())
	}, [])

    const [drawerWidth, setDrawerWidth] = useState(50);
    useEffect( () => {
		fetchData()
		const handleResize = () => {
			const screenWidth = window.innerWidth;
			if (screenWidth < 640) {
				setDrawerWidth(100)
			} else if (screenWidth >= 640 && screenWidth < 768) {
			  setDrawerWidth(100);
			} else if (screenWidth >= 768 && screenWidth < 1024) {
			  setDrawerWidth(50);
			} else if (screenWidth >= 1024 && screenWidth < 1280) {
			  setDrawerWidth(50);
			} else if (screenWidth >= 1280 && screenWidth < 1536) {
			  setDrawerWidth(50);
			} else {
			  setDrawerWidth(50);
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [])

	const handlerApprove = async (btnCas) => {
		const values = []
		values['state'] = btnCas
		values['observations'] = observation
		values['employee_id'] = employee.id
		values['is_boss'] = isBoss
		values['is_rrhh'] = isRRHH
		values['permission_id'] = selectedPermission.id
		
		let data = new FormData
		Object.entries(values).forEach(([key, value]) => { data.append(key,value) })
		const response = await BaseService.post('/attendance/permissions/manage-state', data)
		if ( response ) {
			dispatch(setDrawerAppOpen(false))
			if (!isBoss) {
				if (!isRRHH)
				{
					dispatch(getEmployeePermissions(employee.id))
				} else {
					dispatch(getAllPermissions())
				}
			} else {
				dispatch(getOrganizationUnitPermissions(organizationalUnit.id))
			}
			const message = response.data?.message
			openNotification('success','Éxito',message,'top-start')
		}
	}

	const openNotification = (type,title,message,placement) => {
        let BodyMessage = () => <>{message}</>
        if( typeof message === 'object' ) {
            BodyMessage = () => (
                <ul>{ Object.entries(message).map(([key, value]) => <li className='text-justify'>{value[0]}</li>  ) }</ul>
            )
        }
        toast.push((
            <Notification closable className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }
	
	return (
		<DrawerTemplate
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			onRequestClose={onDrawerClose}
			closable={false}
			bodyClass="p-0"
			title={<Title/>}
			footer={ <Footer onCancel={onDrawerClose} onApproveClick={handlerApprove} /> }
			widthPercent={true}
			width={drawerWidth}
			className={`w-full`}
		>
			<div className='p-5'>
				<div className='mb-8'>
					<div className={classNames(`flex justify-start items-center gap-5`)}>
	
						<Avatar size={125} src={ava} shape="rounded" icon={<HiOutlineUser />} />
						
						<div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>

							<div className={`flex justify-start items-start gap-2 w-full font-semibold text-buke-500`}>
								<div className='w-1/12'>
									<HiOutlineUser className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.name?(employee.name+' '+employee?.lastname):'-'}`}</span>
								</div>
							</div>
							
							<div className={`flex justify-start items-start gap-2 w-full font-semibold`}>
								<div className='w-1/12'>
									<HiOutlineUser className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.functional_position?employee.functional_position:'-'}`}</span>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<BsFillDiagram2Fill className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.organizational_unit?employee.organizational_unit:'-'}`}</span>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<HiMail className="text-lg" />
								</div>
								<div className='w-10/12'>
									<a href={`mailto:${employee?.email?employee.email:'-'}`}>
										<span>{`${employee?.email?employee.email:'-'}`}</span>
									</a>
								</div>
							</div>

							<div className={`flex justify-start items-start gap-2 w-full`}>
								<div className='w-1/12'>
									<HiPhone className="text-lg" />
								</div>
								<div className='w-10/12'>
									<span>{`${employee?.phone?employee.phone:'-'}`}</span>
								</div>
							</div>
							
						</div>
					</div>
					<div className={`mt-5`}>
						<h6 className={`mt-5 text-buke-500`} >Permiso solicitado</h6>
						<div className='mt-2 flex flex-col justify-start gap-4'>
							<div className='text-justify'>
								<span className='font-semibold'>Tipo de Permiso: </span>
								<span className=''>{permissionType}</span>
							</div>
							<div className='text-justify'>
								<span className='font-semibold'>Justificación: </span>
								<span className=''>{description}</span>
							</div>
							<div className='flex justify-between'>
								<div className='flex justify-around w-6/12 border-r'>
									<div className='text-center'>
										<IconText className="font-semibold" icon={<HiOutlineCalendar className="text-lg" />}>
											Fecha Inicial: 
										</IconText>
										<span className=''>{dateIni}</span>
									</div>
									<div className='text-center'>
										<IconText className="font-semibold" icon={<HiOutlineCalendar className="text-lg" />}>
											Fecha Final: 
										</IconText>
										<span className=''>{dateEnd}</span>
									</div>
								</div>
								<div className='flex justify-around w-6/12 border-l'>
									<div className='text-center'>
										<IconText className="font-semibold" icon={<HiOutlineClock className="text-lg" />}>
											Hora Inicial: 
										</IconText>
										<span className=''>{timeIni}</span>
									</div>
									<div className='text-center'>
										<IconText className="font-semibold" icon={<HiOutlineClock className="text-lg" />}>
											Hora Final: 
										</IconText>
										<span className=''>{timeEnd}</span>
									</div>
								</div>
							</div>
							{
								permissionComments.length > 0 ?
								<div className='mt-5'>
									<div className='font-semibold mb-2'>Observaciones realizadas</div>
									{
										permissionComments.map((el,i)=>{
											return (
												<div key={`comment-${i}`} className='flex justify-start gap-2 border-b py-2'>
													<div className='flex justify-start gap-2 w-3/12'>
														<div className='w-2/12 txt-lg mt-3'>
															<HiOutlineUser className='txt-lg'/>
														</div>
														<span className={`font-semibold w-10/12`}>{el.employee}:</span>
													</div>
													<span className='w-9/12'>{el.comment}</span>
												</div>
												)
										})
									}
								</div>
								:<></>
							}
							{
								attachments.length > 0 ?
								<div className='text-justify mt-5'>
									<div className='font-semibold mb-2'>Archivos Obligatorios Adjuntos</div>
									{
										attachments.map((el,i)=>{
											return (
												<div key={`comment-${i}`} className='flex justify-start items-center align-middle gap-2'>
													<IconText className={`font-semibold`} icon={<HiDocument/>}>{el.name}:</IconText>
													<Button variant='plain' onClick={()=>downloadFile(el.id,el.file_original_name)}>{`${el.file_original_name}`}</Button> 
												</div>
												)
										})
									}
								</div>
								:<></>
							}
						</div>

					</div>
				</div>

				{
					( isBoss && employeeSession.id != employee.id && (status === 1 || status === 0) ) || ( isRRHH && status === 2 ) ?

					<div className='flex flex-col justify-between items-start '>
						<FormContainer className='w-full'>
							<FormItem label="Agregar Observaciones">
								<Input 
									textArea
									name='observation'
									value={observation}
									onChange={event => setObservation(event.target.value)}
								/>
							</FormItem>
						</FormContainer>
					</div>
					:<></>
				}
			</div>
		</DrawerTemplate>
	)
}

export default Drawer
