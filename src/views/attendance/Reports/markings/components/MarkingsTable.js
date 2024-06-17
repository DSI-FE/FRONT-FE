import React,{useCallback,useEffect,useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { getMarkingsByPeriod } from '../store/dataSlice'
import { getDiscountByDate } from '../store/stateSlice'
import {StringDateToFormat,dollarFormat,intToHours,capitalizeFirstLetter,getTimeInHHmmFormat} from 'helpers/index'
import { Table,Button,Tooltip,Avatar } from 'components/ui'
import { IconText } from 'components/shared'
import { HiDocumentSearch,HiEye } from 'react-icons/hi'
import { RiSendPlaneFill } from 'react-icons/ri'
import { BiParty } from 'react-icons/bi'
import { MdToday } from 'react-icons/md'
import { setDrawerInfoOpen,setLoading } from '../store/stateSlice'
import { themeConfig } from 'configs/theme.config'
// import { apiGetMarkingsByPeriod } from 'services/AttendanceService';

const {themeColor,primaryColorLevel,successColor,textDangerColor,textSuccessColor,textInfoColor} = themeConfig

const { Tr, Th, Td, THead, TBody } = Table

const HolidayTooltip = (params) => {
    return (
            <Tooltip
                wrapperClass=''
                title={
                    <div>
                        {params.titleStr}
                    </div>
                }
            >
                <span className="cursor-pointer text-lg"><BiParty/></span>
            </Tooltip>
    )
}

const TodayTooltip = () => ( <Tooltip title = { <div>Hoy</div> }><span className="cursor-pointer text-lg"><MdToday/></span></Tooltip>)

const columns =
[
    {header:'Fecha',accessorKey:'formatDate',divClassName:'text-center'},
    {header:'Entrada',accessorKey:'iniMark',divClassName:'text-center'},
    {header:'Salida',accessorKey:'endMark',divClassName:'text-center',className:'border-r'},
    {header:'No Laborado',accessorKey:'timeNotWorked',divClassName:'text-center'},
    {header:'Justificado',accessorKey:'justifiedPay',divClassName:'text-center'},
    {header:'Descuento',accessorKey:'discount',divClassName:'text-center',className:'border-r'},
    {header:'Acciones',accessorKey:'actions',divClassName:'text-center'},
]

const RowOptions = ({row}) => {
    const dispatch = useDispatch()
    const userId = useSelector((state) => state.auth.user.id)

    const reqData = {
        date:row.date,
        employee_id:userId
    }
	
	const showInfo = () =>
	{
		dispatch(setDrawerInfoOpen(true))
        dispatch(setLoading(true))
        setTimeout( () => {
            dispatch(getDiscountByDate(reqData))
        }, 500)
        
	}

    const showPermissions = () => {
		dispatch(setDrawerInfoOpen(false))
	}

    const discount = row.discount?.discount
    const buttonInfo = (
        <Button
            title='Consultar información'
            size="xs"
            color={`${themeColor}-${primaryColorLevel}`}
            variant="solid"
            icon={<HiEye />}
            onClick={showInfo}
        />
    )
    const buttonSendRequest = (discount > 0) ?
        <Button
            title='Enviar solicitud'
            size="xs"
            color={`${successColor}-${primaryColorLevel}`}
            variant="solid"
            icon={<RiSendPlaneFill />}
            onClick={showPermissions}
            className={`invisible`}
        /> 
        : ''
    
    return (
        <div className="flex justify-start gap-4 items-center">
            {buttonInfo}
            {buttonSendRequest}
        </div>
	)
}

const TableRow = (date,i) =>
{
    const trClass = date.discount?.discount > 0 ? 'bg-red-200' :''
    const dateClass  = date.isWeekend || date.isHoliday  ? textInfoColor : ''
    const dateTodayClass  = date.isToday ? `` : ''
    const DateHoliday = (params) => date.isHoliday ?  <HolidayTooltip titleStr={params.titleStr}/> : <div></div>
    const DateToday = () => date.isToday ?  <TodayTooltip/> : <div></div>
    let dateTitle = date.isWeekend ? `Fin de Semana` : 'Día Laboral'
    dateTitle = date.isHoliday ? `Día Festivo: ${date.dateHoliday.name}` : dateTitle
    dateTitle = date.isHoliday && date.isWeekend ? `Día Festivo: ${date.dateHoliday.name} y Fin de Semana` : dateTitle

    return(
        <Tr key={i} className={`text-center ${trClass} ${dateTodayClass}`}>
            <Td>
                <div className={`flex items-center justify-between font-bold ${dateClass}`}>
                    <div className='w-2/12 flex items justify-center'><DateToday/><DateHoliday titleStr={`${dateTitle}`}/></div>
                    <div className='w-8/12'>{`${capitalizeFirstLetter(StringDateToFormat(date?.date,true,true))}`}</div>
                    <div className='w-2/12'></div>
                </div>
            </Td>
            <Td>{date?.iniMark?.datetime? getTimeInHHmmFormat(date.iniMark.datetime) :'-'}</Td>
            <Td className="border-r">{date?.endMark?.datetime? getTimeInHHmmFormat(date.endMark.datetime):'-'}</Td>
            <Td>{date.discount?.time_not_worked ? intToHours(date.discount?.time_not_worked) : '-'}</Td>
            <Td>{date.discount?.time_justified_pay ? intToHours(date.discount?.time_justified_pay) : '-'}</Td>
            <Td className="border-r">{date.discount?.discount? <span className={`${textDangerColor} font-semibold`}>{dollarFormat(date.discount.discount)}</span> :'-'}</Td>
            <Td><RowOptions row={date} /></Td>
        </Tr>
    )
}

const PermissionsTable = (props) => 
{
    const {className,permissionTypes} = props
    
    return (
        <div className='px-4 border-l h-full'>
            <div className='text-left mb-2'>
                <h4>Estadísticas de Permisos</h4>
            </div>
            <div className=''>
                <Table compact>
                        {/* <THead>
                            <Tr>
                                <Th className='text-center'>Concepto</Th>
                                <Th className='text-center'>Disponible</Th>
                                <Th className='text-center'>Utilizado</Th>
                            </Tr>
                        </THead> */}
                        <TBody>
                        {
                            permissionTypes.map((perm,i)=> {
                                return (
                                    <Tr key={i} className={`text-left`}>
                                        <Td>{perm.permission_type}</Td>
                                        <Td>{perm.available_hours_on_year}</Td>
                                        <Td>{perm.max_hours_per_year-perm.available_hours_on_year}</Td>
                                    </Tr>
                                )
                            })
                        }
                        </TBody>
                    </Table>
            </div>
        </div>
    )
}

const MarkingsTable = props =>
{
    const {className, employeeSelectedId } = props

    const dispatch = useDispatch()
    
    const {
        total_time_not_worked,
        total_time_justified_pay,
        total_time_justified_no_pay,
        total_time_discounted,
        total_discount_mount,
        dates,
        date_ini:dateIni,
        date_end:dateEnd,
        show_no_laboral_days:showNoLaboralDays,
        permission_types:permissionTypes
    } = useSelector((state) => state.attendance.data)

    const employeeCurrentId = useSelector((state) => state.auth.employee.id)
    
    const employeeId = employeeSelectedId ?? employeeCurrentId;
    const employeeAva =  '/img/avatars/nopic.jpg'
    
    const UserAvatar = () => (
        <div>
            <span>{employeeId}</span>
			<Avatar size={100} src={employeeAva} shape="rounded"/>
        </div>
	)
    
    const reqData = useMemo( () => ({
        date_ini:dateIni,
        date_end:dateEnd,
        show_no_laboral_days:showNoLaboralDays,
        employee_id:employeeId
    }), [dateIni,dateEnd,showNoLaboralDays,employeeId])
    
    const fetchData = useCallback( () => {
        // dispatch(getMarkingsByPeriod(reqData))
	}, [dispatch,reqData])

    useEffect( () => { fetchData() }, [fetchData,dateIni,dateEnd,showNoLaboralDays,employeeId])

    const TotalValue = (params) =>
    {
        const {value,isBad,isTime,isMoney} = params
        const color = isBad ? textDangerColor : textSuccessColor
        if(isTime) {
            return value > 0 ? 
            <span className={color}>{intToHours(value)}</span>
            :
            <span>{intToHours(value)}</span>
        } else if(isMoney) {
            return value > 0 ? 
            <span className={color}>{dollarFormat(value)}</span>
            :
            <span>{dollarFormat(value)}</span>
        } else {
            return value > 0 ? 
            <span className={color}>{value}</span>
            :
            <span>{value}</span>

        }
        
    }

    return (
        <div className={`${className}`}>
            <div className='flex justify-around gap-5'>
                <UserAvatar/>
                <div className='w-5/12'>
                    <Table compact>
                        {/* <THead>
                            <Tr>
                                <Th className='text-center'>Concepto</Th>
                                <Th className='text-center'></Th>
                            </Tr>
                        </THead> */}
                        <TBody>
                            <Tr>
                                <Td className='font-bold'>Tiempo no Laborado</Td>
                                <Td className='text-center'><TotalValue isBad={true} isTime={true} value={total_time_not_worked}/></Td>
                            </Tr>
                            <Tr>
                                <Td className='font-bold'>Tiempo justificado (con goce de sueldo)</Td>
                                <Td className='text-center'><TotalValue isBad={false} isTime={true} value={total_time_justified_pay}/></Td>
                            </Tr>
                            <Tr>
                                <Td className='font-bold'>Tiempo justificado (sin goce de sueldo)</Td>
                                <Td className='text-center'><TotalValue isBad={false} isTime={true} value={total_time_justified_no_pay}/></Td>
                            </Tr>
                            <Tr>
                                <Td className='font-bold'>Tiempo total descontado</Td>
                                <Td className='text-center'><TotalValue isBad={true} isTime={true} value={total_time_discounted}/></Td>
                            </Tr>
                            <Tr className='font-bold'>
                                <Td>Descuento</Td>
                                <Td className='text-center'><TotalValue isBad={true} isTime={false} isMoney={true} value={total_discount_mount}/></Td>

                            </Tr>
                        </TBody>
                    </Table>
                </div>
                <div className='w-5/12'>
                    <PermissionsTable permissionTypes={permissionTypes}/>
                </div>
            </div>
            <div className='mt-5'>
                <div className='mb-2'>
                    <h4>Detalle de Marcaciones del Periodo</h4>
                </div>
                {
                    dates.length === 0 ?  (
                        <div className="flex justify-start items-center">
                            <IconText
                                icon={<HiDocumentSearch className="text-lg" />}
                            >
                                <h5 className="text-slate-500">Sin información que mostrar</h5>
                            </IconText>
                        </div>
                    )
                    :(
                        <Table compact>
                            <THead>
                                <Tr>
                                    {columns.map((col,i)=><Th key={col.header+i} className={col.className}><div className={col.divClassName}>{col.header}</div></Th>)}
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    dates.map((date,i)=> {
                                        return TableRow(date,i)
                                    })
                                }
                            </TBody>
                        </Table>
                    )}
                    
            </div>
        </div>
	)

}

export default MarkingsTable