import React, { forwardRef } from 'react'
import {  useSelector } from 'react-redux'
import { Spinner,Table } from 'components/ui'

import { StringDateToFormat,capitalizeFirstLetter,getTimeInHHmmFormat,dollarFormat,intToHours,TextSlicer } from 'helpers'

import { themeConfig } from 'configs/theme.config'

const {textSuccessColor} = themeConfig;

const { Tr, Th, Td, THead, TBody } = Table

const InfoContent = forwardRef( (props, ref) => 
{
    const dateInfo = useSelector((state) => state.attendance.state.dateInfo);
    const loading = useSelector((state) => state.attendance.state.loading);

    let Content;
    
    if (loading) {
        Content = () => {
            return (
                <div className='flex justify-center items-center w-full h-full'>
                    <Spinner size="3.25rem" />
                </div>
            )
        }
    } else {
        Content = () => {
            const date = dateInfo.date ? new Date(dateInfo.date) : new Date();
            const dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            const formatedDate = capitalizeFirstLetter(StringDateToFormat((date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()),true));
            const isWeekend = Boolean(dateInfo.isWeekend);
            const isHoliday = Boolean(dateInfo.isHoliday);
            const isLaboral = !Boolean(dateInfo.isWeekend) && !Boolean(dateInfo.isHoliday);

            let dayType = isLaboral ? 'Día Laboral' : '';
            dayType = isWeekend || isHoliday ? 'Día no laboral' : dayType;
            let dayTypeStr = isWeekend ? '(Fin de semana)': '';
            dayTypeStr = isHoliday ? '(Festivo)': dayTypeStr;
            dayTypeStr = isHoliday && isWeekend ? '(Festivo y fin de semana)' : dayTypeStr;
            let holidays='';
            if (isHoliday && dateInfo.holidays)
            {
                (dateInfo.holidays).forEach((element,i) =>
                {
                    const separator=i>0?' | ':'';
                    holidays+= element.name+separator;
                });
            }

            const iniMark = dateInfo.iniMark ? getTimeInHHmmFormat(dateInfo.iniMark.datetime) : 'N/a';
            const endMark = dateInfo.endMark ? getTimeInHHmmFormat(dateInfo.endMark.datetime) : 'N/a';

            const scheduleName = dateInfo.schedule ? ` ${dateInfo.schedule.name} ` : 'Sin Asignar';
            const scheduleIni = dateInfo.schedule && dateInfo.schedule.days[0] && isLaboral? getTimeInHHmmFormat(dateString+' '+dateInfo.schedule?.days[0].pivot?.time_start) : 'N/a'
            const scheduleEnd = dateInfo.schedule && dateInfo.schedule.days[0] && isLaboral? getTimeInHHmmFormat(dateString+' '+dateInfo.schedule?.days[0].pivot?.time_end) : 'N/a'

            const iniMarkClassName = iniMark > scheduleIni || iniMark === 'N/a' && isLaboral ? 'text-red-500':'';
            const endMarkClassName = endMark < scheduleEnd || endMark === 'N/a' && isLaboral ? 'text-red-500':'';

            const discount = dateInfo.discount ?? null;
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

            const permissions = dateInfo.permissions ?? null;

            const ContentHeader = () => (
                <div>
                    <div>
                        <div className='flex justify-between text-black'>
                            <h6 className='font-bold'>{`${formatedDate}`}</h6>
                        </div>
                        <div className='flex justify-between font-semibold'>
                            <span>{` ${dayType} ${dayTypeStr}`}</span>
                            <span>{` ${holidays}`}</span>
                        </div>
                    </div>
                </div>
            )

            const ContentSchedule = () => (
                <>
                    <div className='flex justify-start gap-2 items-center mt-6'>
                        <h6 className='text-black'>Horario Asignado:</h6>
                        <h6 className='font-semibold text-black'>{scheduleName}</h6>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <div className='flex justify-start gap-2 items-center w-6/12'>
                            <span className='font-semibold'>Hora Entrada:</span>
                            <span>{scheduleIni}</span>
                        </div>
                        <div className='flex justify-start gap-2 items-center w-6/12'>
                            <span className='font-semibold'>Hora Salida:</span>
                            <span>{scheduleEnd}</span>
                        </div>
                    </div>
                </>
            )

            const ContentMarkings = () =>
            (
                <>
                    <div className='mt-6 font-semibold text-black'>
                        <h6>Marcaciones del Día</h6>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <div className='flex justify-start gap-2 items-center w-6/12'>
                            <span className='font-semibold'>Hora Entrada:</span>
                            <span className={`${iniMarkClassName}`}>{iniMark}</span>
                        </div>
                        <div className='flex justify-start gap-2 items-center w-6/12'>
                            <span className={`font-semibold }`}>Hora Salida:</span>
                            <span className={`${endMarkClassName}`}>{endMark}</span>
                        </div>
                    </div>
                </>
            )

            const DiscountDiv = () => {
                return discount ?
                (
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
                                <span className='font-semibold'>Descuento:</span>
                                <span className={`font-semibold ${discountMountClassName}`}>{dollarFormat(discountMount)}</span>
                            </div>
                        </div>

                    </>
                )
                : (
                    <div className='flex justify-start font-semibold w-full'>
                        <p>Sin descuentos aplicados</p>
                    </div>
                )
            };

            const ContentDiscounts = () =>
            (
                <>
                    <div className='mt-6 font-semibold text-black'>
                        <h6>Detalle de Descuento</h6>
                    </div>
                    <div className='flex flex-col justify-between mt-2'>
                        <DiscountDiv/>
                    </div>
                </>
            )

            const PermissionsDiv = () =>
            {
                return permissions ?
                (
                    <>
                        <Table compact>
                            <THead>
                                <Tr>
                                    <Th>
                                        <div className={`font-semibold`}>Tipo</div>
                                    </Th>
                                    <Th>
                                        <div className={`font-semibold`}>Permiso</div>
                                    </Th>
                                    <Th>
                                        <div className={`font-semibold`}>Estado</div>
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {
                                    permissions.map((perm,i)=> {
                                        return (
                                            <Tr key={`trp-${i}`}>
                                                <Td className={`font-semibold`} title={perm.employee_permission_type.permission_type.name}>{TextSlicer(perm.employee_permission_type.permission_type.name,50)}</Td>
                                                <Td title={perm.description}>{TextSlicer(perm.description,50)}</Td>
                                                <Td>{perm.string_status}</Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </TBody>
                        </Table>

                    </>
                )
                : (
                    <div className='flex justify-start font-semibold w-full'>
                        <p>Sin permisos enviados</p>
                    </div>
                )
            }

            const ContentPermissions = () =>
            (
                <>
                    <div className='mt-6 font-semibold text-black'>
                        <h6>Permisos y Licencias</h6>
                    </div>
                    <div className='flex flex-col justify-between mt-2'>
                        <PermissionsDiv/>
                    </div>
                </>
            )

            return (
                <>
                    <ContentHeader/>
                    <ContentSchedule/>
                    <ContentMarkings/>
                    <ContentDiscounts/>
                    <ContentPermissions/>
                </>
            )
        }
    }


    
    return (
        <>
            <Content/>
        </>
	)
})

export default InfoContent;
