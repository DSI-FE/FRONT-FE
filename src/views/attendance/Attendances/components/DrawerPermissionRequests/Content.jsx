import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    capitalizeFirstLetter,
    StringDateToFormat,
    getTimeInHHmmFormat,
    intToHours,
    dollarFormat,
    TextSlicer
}
from 'helpers'
import { Button } from 'components/custom'
import { themeConfig } from 'configs/theme.config'
import { FaCalendarDay, FaBusinessTime, FaFileInvoiceDollar, FaFileInvoice } from 'react-icons/fa'
import { MdOutlinePunchClock } from 'react-icons/md'
import { RiSendPlaneFill } from 'react-icons/ri'
import { Table } from 'components/ui'

import { setDrawerPermissionRequestOpen } from '../../store/stateSlice'

const { Tr, Th, Td, THead, TBody } = Table
const { colorTheme, textSuccessColor } = themeConfig

const Content = ({ state, setState }) => 
{
    const { discount_info:discountInfo, permission_requests:permissionRequests } = useSelector( state => state.attendance.state )

    const date = discountInfo?.date ? new Date(discountInfo.date) : new Date();
    const dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    const formatedDate = capitalizeFirstLetter(StringDateToFormat((date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()),true));
    const isWeekend = Boolean(discountInfo.isWeekend);
    const isHoliday = Boolean(discountInfo.isHoliday);
    const isLaboral = !Boolean(discountInfo.isWeekend) && !Boolean(discountInfo.isHoliday);
    let dayType = isLaboral ? 'Día laboral' : '';
    dayType = isWeekend || isHoliday ? 'Día no laboral' : dayType;
    
    const renderHolidays = () => {
        if (isHoliday && discountInfo.holidays) {
            return discountInfo.holidays.map((element, i) => {
                const separator = i > 0 ? ' | ' : '';
                return element.name + separator;
            }).join('');
        }
        return '';
    };
    
    const iniMark = discountInfo.iniMark ? getTimeInHHmmFormat(discountInfo.iniMark.datetime) : '-';
    const endMark = discountInfo.endMark ? getTimeInHHmmFormat(discountInfo.endMark.datetime) : '-';

    const scheduleName = discountInfo.schedule ? ` ${discountInfo.schedule.name} ` : 'No asignado';
    const scheduleIni = discountInfo.schedule && discountInfo.schedule.days[0] && isLaboral? getTimeInHHmmFormat(dateString+' '+discountInfo.schedule?.days[0].pivot?.time_start) : 'No asignado'
    const scheduleEnd = discountInfo.schedule && discountInfo.schedule.days[0] && isLaboral? getTimeInHHmmFormat(dateString+' '+discountInfo.schedule?.days[0].pivot?.time_end) : 'No asignado'

    const iniMarkClassName = iniMark > scheduleIni || iniMark === '-' && isLaboral ? 'text-red-500':'';
    const endMarkClassName = endMark < scheduleEnd || endMark === '-' && isLaboral ? 'text-red-500':'';

    const discount = discountInfo.discount ?? null;
    let discountMount;
    let discountMountClassName;
    let timeDiscounted;
    let timeNotWorked;
    let timeJustifiedPay;
    let timeJustifiedNoPay;
    if(discount)
    {
        discountMount = discount.discount;
        discountMountClassName = discountMount > 0 ? 'text-red-500' : `font-semibold ${textSuccessColor}`
        timeDiscounted = discount.time_discounted;
        timeNotWorked = discount.time_not_worked;
        timeJustifiedPay = discount.time_justified_pay;
        timeJustifiedNoPay = discount.time_justified_no_pay;
    }

    const ContentHeader = () => (
        <div>
            <h6 className='
                font-bold text-slate-600
                xs:flex xs:justify-center xs:items-center xs:gap-2 xs:mb-2
                md:flex md:justify-start
            '>
                <FaCalendarDay/>
                <span>{formatedDate}</span>
            </h6>
            <div className='font-semibold xs:text-center md:text-left'>
                <div>{` ${dayType}`}</div>
                <div>{` ${renderHolidays()}`}</div>
            </div>
        </div>
            
    )

    const ContentMarkings = () =>
    (
        <div className='w-6/12 border-r-2'>
            <h6 className='font-bold text-slate-600 flex justify-start items-center gap-2 mb-2'>
                <MdOutlinePunchClock/>
                <span>{`Marcaciones`}</span>
            </h6>
            <div className='flex justify-center items-center'>
                <div className='w-6/12 text-center border-r-2'>
                    <div className='font-semibold text-center'>Entrada:</div>
                    <div className={`${iniMarkClassName}`}>{iniMark}</div>
                </div>
                <div className='w-6/12 text-center'>
                    <div className='font-semibold '>Salida:</div>
                    <div className={`${endMarkClassName}`}>{endMark}</div>
                </div>
            </div>
        </div>
    )

    const ContentSchedule = () => (
        <div className='w-6/12'>
            <h6 className='font-bold text-slate-600 flex justify-start items-center gap-2 mb-2'>
                <FaBusinessTime/>
                <span>{`Horario ${scheduleName}`}</span>
            </h6>
            <div className='flex justify-center items-center'>
                <div className='w-6/12 text-center border-r-2 '>
                    <div className='font-semibold text-center'>Entrada:</div>
                    <div>{scheduleIni}</div>
                </div>
                <div className='w-6/12 text-center'>
                    <div className='font-semibold text-center'>Salida:</div>
                    <div>{scheduleEnd}</div>
                </div>
            </div>
        </div>
    )
    
    const DiscountDiv = () => {

        if (!discount || ( discount && discount.discount === 0 && discount.time_not_worked === 0 ) ) {
            return (
                <div className="flex justify-start font-semibold w-full">
                    <p>Sin descuentos aplicados</p>
                </div>
            );
        }

        return (
            <>
                <div className='flex flex-col w-full'>
                    <div title='Formato en Horas:Minutos' className='flex justify-between border-b py-1 items-center px-2'>
                        <span className='font-semibold'>Tiempo no laborado:</span>
                        <span>{intToHours(timeNotWorked)}</span>
                    </div>
                    <div title='Formato en Horas:Minutos' className='flex justify-between border-b py-1 items-center px-2'>
                        <span className='font-semibold'>Tiempo justificado (con goce de sueldo):</span>
                        <span>{intToHours(timeJustifiedPay)}</span>
                    </div>
                    <div title='Formato en Horas:Minutos' className='flex justify-between border-b py-1 items-center px-2'>
                        <span className='font-semibold'>Tiempo Justificado (sin goce de sueldo) :</span>
                        <span>{intToHours(timeJustifiedNoPay)}</span>
                    </div>
                    <div title='Formato en Horas:Minutos' className='flex justify-between border-b py-1 items-center px-2'>
                        <span className='font-semibold'>Tiempo descontado:</span>
                        <span className={`font-semibold ${discountMountClassName}`}>{intToHours(timeDiscounted)}</span>
                    </div>
                    <div className='flex justify-between border-b py-1 items-center px-2'>
                        <span className='font-semibold'>Total Descuento:</span>
                        <span className={`font-semibold ${discountMountClassName}`}>{dollarFormat(discountMount)}</span>
                    </div>
                </div>

            </>
        )
    };

    const ContentDiscounts = () =>
    (
        <div className='mb-6'>
            <h6 className='font-bold text-slate-600 flex justify-start items-center gap-2 mb-2'>
                <FaFileInvoiceDollar/><span>Detalle de Descuento</span>
            </h6>
            <div className='flex flex-col justify-between mt-2'>
                <DiscountDiv/>
            </div>
        </div>
    )

    const PermissionsDiv = () => {

        if (! permissionRequests || permissionRequests.length < 1) {
            return (
                <div className="flex justify-start font-semibold w-full">
                    <p>Sin permisos enviados</p>
                </div>
            );
        }

        return (
            <Table compact>
                <THead>
                    <Tr>
                        <Th>
                            <div className={`font-semibold`}>Tipo</div>
                        </Th>
                        <Th>
                            <div className={`font-semibold`}>Justificación</div>
                        </Th>
                        <Th>
                            <div className={`font-semibold`}>Estado</div>
                        </Th>
                    </Tr>
                </THead>
                <TBody>
                    {
                        permissionRequests.map((perm,i)=> {
                            return (
                                <Tr key={`trp-${i}`}>
                                    <Td className={`font-semibold`} title={perm.permission_type.name}>{TextSlicer(perm.permission_type.name,50)}</Td>
                                    <Td title={perm.justification}>{TextSlicer(perm.justification,50)}</Td>
                                    <Td>{perm.state}</Td>
                                </Tr>
                            )
                        })
                    }
                </TBody>
            </Table>
        )
    };

    const PermissionsContent = () =>
    (
        <>
            <h6 className='font-bold text-slate-600 flex justify-start items-center gap-2 mb-2'>
                <FaFileInvoice/><span>Permisos Enviados</span>
            </h6>
            <div className='flex flex-col justify-between mt-2'>
                <PermissionsDiv/>
            </div>
        </>
    )

    const dispatch = useDispatch()
    
    return (
        <>
            <ContentHeader/>
            <div className='flex justify-start items-center gap-2 my-6'>
                <ContentMarkings/>
                <ContentSchedule/>
            </div>
            <div className='my-6 text-center'>
                {/*<Button
                    variant='solid'
                    color={`${colorTheme}`}
                    icon={<RiSendPlaneFill/>}
                    onClick={ () => {
                        dispatch( setDrawerPermissionRequestOpen( false ) )
                        setState(true)
                    }}
                >
                    Nueva solicitud de permiso
                </Button>*/}
            </div>
            <ContentDiscounts/>
            <PermissionsContent/>
        </>
    )
}

export default Content
