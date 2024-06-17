import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDiscountByDate } from '../store/stateSlice'
import {StringDateToFormat,dollarFormat,intToHours,capitalizeFirstLetter,getTimeInHHmmFormat} from 'helpers/index'

import TableRowSkeleton from 'components/shared/loaders/TableRowSkeleton'

import { Table, Button, Tooltip, Spinner } from 'components/ui'
import { IconText } from 'components/shared'
import { HiDocumentSearch, HiInformationCircle } from 'react-icons/hi'
import { BiParty } from 'react-icons/bi'
import { MdToday } from 'react-icons/md'
import {
    setDrawerPermissionRequestOpen,
    getPermissionRequestsFromEmployeeByPeriod
} from '../store/stateSlice'
import { themeConfig } from 'configs/theme.config'
import RemoteMark from 'views/attendance/RemoteMark'
import DrawerPermissionRequests from './DrawerPermissionRequests'
import DrawerPermissionRequest from '../../components/DrawerPermissionRequest'

const { primaryColorLevel, colorInfo, textDangerColor, textSuccessColor, textInfoColor } = themeConfig

const { Tr, Th, Td, THead, TBody } = Table

const columns = [
    {className:'w-2/12', header:'Fecha', accessorKey:'formatDate',divClassName:'text-center'},
    {className:'w-1/12 xs:hidden sm:hidden md:table-cell', header:'Entrada', accessorKey:'iniMark',divClassName:'text-center'},
    {className:'w-1/12 xs:hidden sm:hidden md:table-cell border-r', header:'Salida', accessorKey:'endMark',divClassName:'text-center'},
    {className:'w-2/12 xs:hidden sm:hidden md:table-cell', header:'No Laborado',accessorKey:'timeNotWorked',divClassName:'text-center'},
    {className:'w-2/12 xs:hidden sm:hidden md:table-cell', header:'Justificado',accessorKey:'justifiedPay',divClassName:'text-center'},
    {className:'w-2/12 border-r', header:'Descuento',accessorKey:'discount',divClassName:'text-center'},
    {className:'w-1/12', header:'',accessorKey:'actions',divClassName:'text-center'},
]

const HolidayTooltip = (params) => (
    <Tooltip title={ <div> {params.titleStr} </div> } >
        <span className="cursor-pointer text-lg"><BiParty/></span>
    </Tooltip>
)

const TodayTooltip = () => (
    <Tooltip title={ 'Hoy' } >
        <span className="cursor-pointer text-lg"><MdToday/></span>
    </Tooltip>
)

const RowOptions = ({row}) => {

    const dispatch = useDispatch()
    const { employee } = useSelector((state) => state.auth )
    const employeeId = employee.id
    
    // const discount = row.discount?.discount
    // const permissions = row.permissions

    const handleOpenDrawerPermissionRequest = () => {
        dispatch(setDrawerPermissionRequestOpen( true ))
        const reqData = {
            date_ini:row.date,
            date_end:row.date,
            time_ini:'00:00:00',
            time_end:'23:59:59',
            adm_employee_id:employeeId
        }
        dispatch(getPermissionRequestsFromEmployeeByPeriod( reqData ))
        dispatch(getDiscountByDate({ date:row.date, employee_id:employeeId }))
    }
    const buttonCheckPermissions = 
        <Button
            title='Detalle de Fecha'
            size="xs"
            color={`${colorInfo}-${primaryColorLevel}`}
            variant="solid"
            icon={<HiInformationCircle />}
            onClick={handleOpenDrawerPermissionRequest}
        />
    
    return (
        <div className="flex justify-center items-center">
            {buttonCheckPermissions}
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
                <div className={`flex justify-between items-center gap-3 font-bold ${dateClass}`}>
                    <div className='w-1/12 text-left xs:hidden sm:hidden md:inline-block'>
                        <DateToday/>
                        <DateHoliday titleStr={`${dateTitle}`}/>
                    </div>
                    <div className='w-11/12 text-center xs:hidden sm:hidden md:inline-block'>{`${capitalizeFirstLetter(StringDateToFormat(date?.date,true,true))}`}</div>
                    <div className='w-11/12 text-center xs:table-cell sm:table-cell md:hidden'>{`${capitalizeFirstLetter(StringDateToFormat(date?.date,false,true))}`}</div>
                </div>
            </Td>
            <Td className='xs:hidden sm:hidden md:table-cell'>{date?.iniMark?.datetime? getTimeInHHmmFormat(date.iniMark.datetime) :'-'}</Td>
            <Td className="border-r xs:hidden sm:hidden md:table-cell">{date?.endMark?.datetime? getTimeInHHmmFormat(date.endMark.datetime):'-'}</Td>
            <Td className='xs:hidden sm:hidden md:table-cell'>{date.discount?.time_not_worked ? intToHours(date.discount?.time_not_worked) : '-'}</Td>
            <Td className='xs:hidden sm:hidden md:table-cell'>{date.discount?.time_justified_pay ? intToHours(date.discount?.time_justified_pay) : '-'}</Td>
            <Td className="border-r">{date.discount?.discount? <span className={`${textDangerColor} font-semibold`}>{dollarFormat(date.discount.discount)}</span> :'-'}</Td>
            <Td><RowOptions row={date} /></Td>
        </Tr>
    )
}

const MarkingsTable = ({ className }) =>
{
    const { employee } = useSelector((state) => state.auth )
    const {
        total_time_not_worked,
        total_time_justified_pay,
        total_time_justified_no_pay,
        total_time_discounted,
        total_discount_mount,
        dates,
        loading
    } = useSelector( state => state.attendance.data)

    const { discount_info:discountInfo } = useSelector( state => state.attendance.state )
    
    const TotalValue = ({ value, isBad, isTime, isMoney }) => {
        const color = isBad ? textDangerColor : textSuccessColor;
        let Comp;
        if (isTime) {
            Comp = value > 0 ? <span className={color}>{intToHours(value)}</span> : <span>{intToHours(value)}</span>;
        } else if (isMoney) {
            Comp = value > 0 ? <span className={color}>{dollarFormat(value)}</span> : <span>{dollarFormat(value)}</span>;
        } else {
            Comp = value > 0 ? <span className={color}>{value}</span> : <span>{value}</span>;
        }
        return !loading ? Comp : (
            <div className='flex justify-center items-center w-full h-full'>
                <Spinner/>
            </div>
        );
    };
    
    const TableResumeLeft = ({ className }) => (
        <div className={className}>
            <div className='text-left mb-2'>
                <h4>Descuentos del Periodo</h4>
            </div>
            <Table compact>
                <TBody>
                    <Tr>
                        <Td className='font-bold'>Tiempo no Laborado</Td>
                        <Td className='text-center'><TotalValue isBad={true} isTime={true} value={total_time_not_worked}/></Td>
                    </Tr>
                    <Tr>
                        <Td className='font-bold'>Tiempo justificado</Td>
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
    )
    
    const TableResumeRight = ({ className }) => (
        <div className={className}>
            <div className='flex flex-col justify-center items-center gap-3 xs:mb-6'>
            {
                employee.remote_mark === 1 ?
                <>
                    <span className='font-semibold'>Registrar Marcación</span>
                    <RemoteMark/>
                </> : <></>
            }
            </div>
        </div>
    )
    
    const TableResume = () => (
        <div className="
            xs:flex xs:flex-col
            md:flex-row md:justify-around md:gap-4
        ">
            <TableResumeLeft className="
                xs:w-full
                md:w-6/12
            "/>
            <TableResumeRight className="
                xs:flex xs:order-first
                md:w-6/12 md:order-last justify-center items-center
            "/>
        </div>
    )

    const TableMarkingsDetail = ({ className }) => (
        <div className={ className }>
            <div className='mb-2'>
                <h4>Marcaciones del Periodo</h4>
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
                                {
                                    columns.map( (col,i) =>
                                        <Th
                                            key={col.header+i}
                                            className={col.className}
                                        >
                                            <div className={col.divClassName}>{col.header}</div>
                                        </Th>
                                    )
                                }
                            </Tr>
                        </THead>
                        {
                            ! loading ? <TBody>{ dates.map( ( date, i ) =>  TableRow( date, i ) ) }</TBody> : <TableRowSkeleton columns={7} rows={5} />
                        }
                    </Table>
                )}
        </div>
    )

    const [ openDrawerPermissionRequest, setOpenDrawerPermissionRequest ] = useState( false )
    const selectedDate = discountInfo ? discountInfo.date : null
    
    return (
        <div className={`${className}`}>
            <TableResume/>
            <TableMarkingsDetail className={`mt-5`} />
            { discountInfo ? <DrawerPermissionRequests state={ openDrawerPermissionRequest } setState={ setOpenDrawerPermissionRequest } /> : <></> }
            {
                openDrawerPermissionRequest ?
                    <DrawerPermissionRequest
                        state={ openDrawerPermissionRequest }
                        setState={ setOpenDrawerPermissionRequest }
                        employeeIsBoss={ false }
                        selectedDate={ selectedDate }
                    />
                : <></>
            }
        </div>
	)
}

export default MarkingsTable
