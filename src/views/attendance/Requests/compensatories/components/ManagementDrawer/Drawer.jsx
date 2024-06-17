import React, { useRef, useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer as DrawerTemp, Notification, toast, Avatar, Switcher, Input,DatePicker,FormItem,FormContainer } from 'components/ui'
import { setDrawerManagementOpen, setSelectedEntry, setLoading } from '../../store/stateSlice'
import { themeConfig } from 'configs/theme.config';
import { dateToStringFormat, StringDateToFormat, intToHours } from 'helpers'
import classNames from 'classnames'
import { IconText } from 'components/shared'

import { HiOutlineUser, HiMail, HiPhone, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi'
import { BsFillDiagram2Fill } from 'react-icons/bs'

import BaseService from 'services/BaseService'

import { getCompensatoriesByEmployee,getCompensatoriesByOrganizationalUnit } from '../../store/dataSlice'

import { Formik } from 'formik'

import { TimeField } from '@mui/x-date-pickers/TimeField';

import dayjs from 'dayjs'

const {textThemeColor, colorDanger} = themeConfig;

const Drawer = () =>
{
	const formikRef = useRef();

	const dispatch = useDispatch();
    const {employee,functionalPosition,organizationalUnit} = useSelector( state => state.auth )
    const isBoss = functionalPosition.boss === 1
    const isRRHH = functionalPosition.id === 48 || functionalPosition.id === 89

	const { drawer_management_open:drawerOpen,loading,selected_entry:selectedEntry } = useSelector((state) => state.compensatories.state );

    const onDrawerClose = () => {
        dispatch(setDrawerManagementOpen(false))
        dispatch(setSelectedEntry(null))
        dispatch(setLoading(false))
	}

    const formSubmit = () =>
	{
		formikRef.current?.submitForm();
	}

	const formReset = () =>
	{
		formikRef.current?.resetForm();
	}

    const Title = () => (
		<div>
			<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
                {`Gestionar Compensatorio`}
            </h4>
            <span>
                Llene los campos que se le solicitan en el formulario
            </span>
		</div>
	);

    
    
    const Footer = ( { onSaveClick, onCancel, onReset } ) =>
	{
		return (
			<div className="flex justify-between items-center w-full">
                <div className="w-6/12 flex justify-start items-center">
                    <Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                </div>
                {
                    isBoss && (stateEnt == 0 || stateEnt == 1) ?
                    <div className="w-6/12 flex justify-end items-center gap-5">
                        <Button loading={loading} size="sm" color={colorDanger} variant="solid" onClick={()=>onSaveClick(5)}>Rechazar</Button>
                        <Button loading={loading} size="sm" variant="solid" onClick={()=>onSaveClick(2)}>Aprobar</Button>
                    </div> : <></>
                }
			</div>
		)
	}

    const emp = selectedEntry ? selectedEntry.employee:{}
	const ava = emp ? emp.photo : '/img/avatars/nopic.jpg'

    const id = selectedEntry ? selectedEntry.id : null
    const description = selectedEntry && selectedEntry.description ? selectedEntry.description : '-'
    const date = selectedEntry && selectedEntry.date ? StringDateToFormat(selectedEntry.date,false,true) : '-'
    const timeIni = selectedEntry? selectedEntry.time_start : '-'
    const timeEnd = selectedEntry? selectedEntry.time_end : '-'
    const timeReq = selectedEntry? selectedEntry.time_requested : '-'
    const timeApprovedEnt = selectedEntry? selectedEntry.time_approved : '-'
    const stateEnt = selectedEntry? selectedEntry.status : 0


    const timeApprovedIni = dayjs('2000-01-01T00:00')
    const [ timeApproved, setTimeApproved ] = useState(timeApprovedIni)

    // Subcomponents --------------------------------------------------------------------------------------

    // Submit ----------------------------------------------------------------------------------------------

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

    const onSubmit = async (status) => {
        try {

            const values = []
            if (id) {
                values['id'] = id
            }
            values['status'] =  status
            values['adm_employee_boss_id'] =  employee.id
            const timeApprovedNew = (timeApproved.$H*60)+timeApproved.$m;
            values['time_approved'] =  timeApprovedNew


            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/attendance/compensatories/manage-state', data)
            if ( response ) {
                dispatch(setDrawerManagementOpen(false))
                if(isBoss) {
                    dispatch(getCompensatoriesByOrganizationalUnit(organizationalUnit.id))
                } else {
                    dispatch(getCompensatoriesByEmployee(emp.id))
                }
                openNotification('success','Éxito','El compensatorio se envió con éxito','top-start')
            }
        } catch (errors) {
            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
        }
    }

    const [drawerWidth, setDrawerWidth] = useState(50);
    useEffect( () => {
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
    
    return (
        <>
            <DrawerTemp
                isOpen={drawerOpen}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
                closable={false}
                title={<Title />}
                footer={ <Footer onCancel={onDrawerClose} onSaveClick={onSubmit} onReset={formReset}/> }
                widthPercent={ true }
			    width={ drawerWidth }
            >
                <Formik
                    enableReinitialize
                    innerRef = { formikRef }
                    onSubmit = { values => onSubmit( values ) }
                    initialValues = {{}}
                >
                    { ( { resetForm, values } ) => {
                        return (
                            <>
                                {
                                    <div>

                                        <div className={classNames(`flex justify-start items-center gap-5`)}>
                                            
                                            <Avatar size={125} src={ava} shape="rounded" icon={<HiOutlineUser />} />
                                            
                                            <div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>

                                                <div className={`flex justify-start items-start gap-2 w-full font-semibold text-buke-500`}>
                                                    <div className='w-1/12'>
                                                        <HiOutlineUser className="text-lg" />
                                                    </div>
                                                    <div className='w-10/12'>
                                                        <span>{`${emp?.name?(emp.name+' '+emp?.lastname):'-'}`}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className={`flex justify-start items-start gap-2 w-full font-semibold`}>
                                                    <div className='w-1/12'>
                                                        <HiOutlineUser className="text-lg" />
                                                    </div>
                                                    <div className='w-10/12'>
                                                        <span>{`${emp?.functional_position?emp.functional_position:'-'}`}</span>
                                                    </div>
                                                </div>

                                                <div className={`flex justify-start items-start gap-2 w-full`}>
                                                    <div className='w-1/12'>
                                                        <BsFillDiagram2Fill className="text-lg" />
                                                    </div>
                                                    <div className='w-10/12'>
                                                        <span>{`${emp?.organizational_unit?emp.organizational_unit:'-'}`}</span>
                                                    </div>
                                                </div>

                                                <div className={`flex justify-start items-start gap-2 w-full`}>
                                                    <div className='w-1/12'>
                                                        <HiMail className="text-lg" />
                                                    </div>
                                                    <div className='w-10/12'>
                                                        <a href={`mailto:${emp?.email?emp.email:'-'}`}>
                                                            <span>{`${emp?.email?emp.email:'-'}`}</span>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className={`flex justify-start items-start gap-2 w-full`}>
                                                    <div className='w-1/12'>
                                                        <HiPhone className="text-lg" />
                                                    </div>
                                                    <div className='w-10/12'>
                                                        <span>{`${emp?.phone?emp.phone:'-'}`}</span>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <div className={`mt-5`}>
                                            <h6 className={`mt-5 text-buke-500`} >Compensatorio solicitado</h6>
                                            <div className='mt-2 flex flex-col justify-start gap-4'>
                                                <div className='text-justify'>
                                                    <span className='font-semibold'>Justificación: </span>
                                                    <span className=''>{description}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <div className='flex justify-around w-4/12 border-r'>
                                                        <div className='text-center'>
                                                            <IconText className="font-semibold" icon={<HiOutlineCalendar className="text-lg" />}>
                                                                Fecha: 
                                                            </IconText>
                                                            <span className=''>{date}</span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className='flex justify-around w-8/12 border-l'>
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
                                            </div>

                                        </div>

                                        <FormContainer className='flex justify-between gap-8 mt-8'>
                                            <FormItem className='w-5/12' label={`Cantidad de Tiempo Solicitado (HH:mm)`}>
                                                {intToHours(timeReq)}
                                            </FormItem> 
                                            {
                                                isBoss && (stateEnt == 0 || stateEnt == 1) ?
                                                <FormItem className='w-5/12' label={`Cantidad de Tiempo a Aprobar (HH:mm)`}>
                                                    <TimeField
                                                        className='w-full'
                                                        sx={{ svg: { color:'#019de1' }, input: { color:'#777777' }, label: { color:'#777777' } }}
                                                        slotProps={{ textField: { size: 'small' } }}
                                                        value={  timeApproved  }
                                                        onChange={ time => {setTimeApproved( time ) }}
                                                        format="HH:mm"
                                                    />
                                                </FormItem>
                                                :
                                                <FormItem className='w-5/12' label={`Cantidad de Tiempo Aprobado (HH:mm)`}>
                                                    {intToHours(timeApprovedEnt)}
                                                </FormItem> 
                                            }
                                            
                                        </FormContainer>
                                    </div>
                                }
                            </>
                        )}
                    }
                </Formik>
            </DrawerTemp>
        </>
	)
    
}

export default Drawer;
