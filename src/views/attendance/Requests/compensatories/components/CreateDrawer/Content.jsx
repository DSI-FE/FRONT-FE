import React, { forwardRef, useState, useCallback, useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { Input,DatePicker,FormItem,FormContainer,Notification,toast,Avatar,Switcher} from 'components/ui'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { Formik } from 'formik'

import { dateToStringFormat, StringToDate, convertToAmPm } from 'helpers'
import { HiDocument, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlinePlus,HiOutlineMinusCircle } from 'react-icons/hi'
import {FaBusinessTime} from 'react-icons/fa'
import BaseService from 'services/BaseService'
import { setDrawerOpen } from '../../store/stateSlice'
import { getCompensatoriesByEmployee } from '../../store/dataSlice'
import dayjs from 'dayjs'

import { apiGetMarkingByDateEmployee } from 'services/AttendanceService'

const getMarkingByDateEmployee = async (date,employeeId) => {
    if ( date instanceof Date ) {
        const res = await apiGetMarkingByDateEmployee({date:dateToStringFormat(date),employeeId:employeeId})
        return res.data
    }
}

const Content = forwardRef( (props, ref) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee } = useSelector( state => state.auth )
    const { selected_entry:selectedEntry } =  useSelector( state => state.compensatories.state )

    // Initial Values --------------------------------------------------------------------------------------

    const idIni = selectedEntry ? selectedEntry.id : null
    const descriptionIni = selectedEntry && selectedEntry.description ? selectedEntry.description : ''
    const dateIni = selectedEntry && selectedEntry.date ? StringToDate(selectedEntry.date,'-',2) : {}
    const timeIniIni = selectedEntry? dayjs('2000-01-01T'+selectedEntry.time_start) : dayjs('2000-01-01T08:00')
    const timeEndIni = selectedEntry? dayjs('2000-01-01T'+selectedEntry.time_end) : dayjs('2000-01-01T16:00')

    // States ----------------------------------------------------------------------------------------------

    const [ id, setId ] = useState(idIni)
    const [ description, setDescription ] = useState(descriptionIni)
    const [ date, setDate ] = useState(dateIni)
    const [ timeIni, setTimeIni ] = useState(timeIniIni)
    const [ timeEnd, setTimeEnd ] = useState(timeEndIni)

    const [ markings, setMarkings ] = useState()
    const [ markingIni, setMarkingIni ] = useState()
    const [ markingEnd, setMarkingEnd ] = useState()

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( async () => {
        setMarkings( await getMarkingByDateEmployee(date,employee.id))
    },[date])
    useEffect(() => { fetchData() }, [date])
    useEffect(() => {
        setTimeIni(dayjs('2000-01-01T'+markings?.ini))
        setTimeEnd(dayjs('2000-01-01T'+markings?.end))
    }, [markings])

    useEffect(() => {
        if( markings && markings.ini != markings.end  ) {
            if( markings.ini){
                setMarkingIni(convertToAmPm(markings.ini))
            } else {
                setMarkingIni('-')
            }
            if( markings.end){
                setMarkingEnd(convertToAmPm(markings.end))
            } else {
                setMarkingEnd('-')
            }
        } else if( markings && markings.ini == markings.end  ) {
            setMarkingIni(convertToAmPm(markings.ini))
            setMarkingEnd('-')
        } else {
            setMarkingIni('-')
            setMarkingEnd('-')
        }
    }, [markings,markingIni,markingEnd])
    
    useEffect(() => {
        if( date instanceof Date && (markings && (!markings.ini || !markings.end) )) {
            openNotification('warning','Advertencia','Irregularidades en las marcaciones del día seleccionado','top-start')
        }
    }, [markings])

    // Handlers --------------------------------------------------------------------------------------------
    const handleChangeDescription = entry => { setDescription(entry.target.value)}

    // Subcomponents --------------------------------------------------------------------------------------
    const CustomDatePicker = () => (
        <DatePicker
            clearable={ false }
            inputPrefix={ null }
            inputSuffix={ <HiOutlineCalendar className="text-lg" /> }
            inputFormat={ `DD/MM/YYYY` }
            value={ date }
            onChange = { date => {
                setDate( date )
            }}
        />
    )

    const CustomDatePickers = () => {
        return (
            <div className='w-full flex justify-between gap-5'>
                <FormItem className='w-5/12' label={`Fecha`}>
                    <CustomDatePicker/>
                </FormItem>
                {
                    markings ?
                    <FormItem className='w-6/12' icon={<FaBusinessTime/>} label={`Marcaciones de Fecha`}>
                        <div className='flex justify-between mt-2'>
                            <div className='flex justify-start gap-2 items-center w-6/12'>
                                <span className='font-semibold'>Entrada:</span>
                                <span>{markingIni}</span>
                            </div>
                            <div className='flex justify-start gap-2 items-center w-6/12'>
                                <span className={`font-semibold }`}>Salida:</span>
                                <span>{markingEnd}</span>
                            </div>
                        </div>
                    </FormItem>
                    :
                    <></>
                }
            </div>
        )
    }
    
    // Submit ----------------------------------------------------------------------------------------------

    const openNotification = (type,title,message,placement) => {
        let BodyMessage = () => <>{message}</>
        if( typeof message === 'object' ) {
            BodyMessage = () => (
                <ul>{ Object.entries(message).map(([key, value]) => <li className='text-justify'>{value[0]}</li>  ) }</ul>
            )
        }
        toast.push((
            <Notification closable className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={3500}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }

    const onSubmit = async () => {
        try {
            const values = []
            if (id) {
                values['id'] = id
            }
            values['description'] =  description
            values['status'] =  1

            if ( date instanceof Date  ) { values['date'] = dateToStringFormat(date) }
            values['time_start'] = ('0' + timeIni.$H).slice(-2)+':'+('0' + timeIni.$m).slice(-2)
            values['time_end'] = ('0' + timeEnd.$H).slice(-2)+':'+('0' + timeEnd.$m).slice(-2)

            values['adm_employee_id'] =employee.id


            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/attendance/compensatories', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                dispatch(getCompensatoriesByEmployee(employee.id))
                openNotification('success','Éxito','El compensatorio se envió con éxito','top-start')
            }
        } catch (errors) {
            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
        }
    }

    // Form ------------------------------------------------------------------------------------------------
    return (
            <Formik
                enableReinitialize
                innerRef = { ref }
                onSubmit = { values => onSubmit( values ) }
                initialValues = {{}}
            >
                { ( { resetForm, values } ) => {
                    return (
                        <>
                        {
                                <FormContainer>
                                <CustomDatePickers />
                                <div className='w-full flex justify-between gap-5'>
                                    <FormItem className='w-5/12' label={`Hora inicial`}>
                                        <TimePicker
                                            className='w-full'
                                            sx={{ svg: { color:'#019de1' }, input: { color:'#777777' }, label: { color:'#777777' } }}
                                            slotProps={{ textField: { size: 'small' } }}
                                            value={  timeIni  }
                                            onChange={ time => {setTimeIni( time ) }}
                                        />
                                    </FormItem>
                                    <FormItem className='w-5/12' label={`Hora final`}>
                                        <TimePicker
                                            className='w-full'
                                            sx={{ svg: { color:'#019de1' }, input: { color:'#777777' }, label: { color:'#777777' } }}
                                            slotProps={{ textField: { size: 'small' } }}
                                            value={ timeEnd  }
                                            onChange={ time => {  setTimeEnd( time ) }}
                                        />
                                    </FormItem>
                                    <div className='w-1/12'></div>
                                </div>
                                <FormItem label="Descripción">
                                    <Input textArea value={ description } onChange={ handleChangeDescription } />
                                </FormItem>
                            </FormContainer>
                        }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content