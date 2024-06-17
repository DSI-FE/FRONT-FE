import React, { forwardRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Input,FormItem,FormContainer,Notification,toast,Switcher} from 'components/ui'

import { Formik } from 'formik'

import BaseService from 'services/BaseService'
import { setDrawerOpen } from '../../store/stateSlice'
import { getPermissionTypes } from '../../store/dataSlice'

const Content = forwardRef( (props, ref) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { selected_entry:selectedEntry } =  useSelector( state => state.settingsPermissionTypes.state )

    // Initial Values --------------------------------------------------------------------------------------

    const idIni = selectedEntry ? selectedEntry.id : null

    const nameIni = selectedEntry && selectedEntry.name ? selectedEntry.name : ''
    const descriptionIni = selectedEntry && selectedEntry.description ? selectedEntry.description : ''

    const minutesYearIni = selectedEntry && selectedEntry.minutes_per_year ? (selectedEntry.minutes_per_year / 60) : ''
    const minutesMonthIni = selectedEntry && selectedEntry.minutes_per_month ? (selectedEntry.minutes_per_month / 60) : ''
    const minutesRequestIni = selectedEntry && selectedEntry.minutes_per_request ? (selectedEntry.minutes_per_request / 60) : ''
    const requestsYearIni = selectedEntry && selectedEntry.requests_per_year ? selectedEntry.requests_per_year : ''
    const requestsMonthIni = selectedEntry && selectedEntry.requests_per_month ? selectedEntry.requests_per_month : ''
    const daysRequestIni = selectedEntry && selectedEntry.days_per_request ? selectedEntry.days_per_request : ''
    const daysBeforeRequestIni = selectedEntry && selectedEntry.days_before_request ? selectedEntry.days_before_request : ''
    const dashboardHerarchyIni = selectedEntry && selectedEntry.dashboard_herarchy ? selectedEntry.dashboard_herarchy : ''

    const discountAppliesIni = selectedEntry && (selectedEntry.discount_applies === 1 || selectedEntry.discount_applies === 0) ? selectedEntry.discount_applies === 1 : false
    const continuedHolidayIni = selectedEntry && selectedEntry.adjacent_to_holiday ? selectedEntry.adjacent_to_holiday === 1 : false
    const laterDaysIni = selectedEntry && selectedEntry.later_days ? selectedEntry.later_days === 1 : true
    const activeIni = selectedEntry && selectedEntry.active ? selectedEntry.active === 1 : true
    

    // States ----------------------------------------------------------------------------------------------

    const [ id ] = useState(idIni)
    const [ name, setName ] = useState(nameIni)
    const [ description, setDescription ] = useState(descriptionIni)

    const [ minutesYear, setMinutesYear] = useState( minutesYearIni )
    const [ minutesMonth, setMinutesMonth] = useState( minutesMonthIni )
    const [ minutesRequest, setMinutesRequest] = useState( minutesRequestIni )
    const [ requestsYear, setRequestsYear] = useState( requestsYearIni )
    const [ requestsMonth, setRequestsMonth] = useState( requestsMonthIni )
    const [ daysRequest, setDaysRequest] = useState( daysRequestIni )
    const [ daysBeforeRequest, setDaysBeforeRequest] = useState( daysBeforeRequestIni )
    const [ dashboardHerarchy, setDashboardHerarchy] = useState( dashboardHerarchyIni )

    const [ discountApplies, setDiscountApplies] = useState( discountAppliesIni )
    const [ continuedHoliday, setContinuedHoliday] = useState( continuedHolidayIni )
    const [ laterDays, setLaterDays] = useState( laterDaysIni )
    const [ active, setActive] = useState( activeIni )

    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeName = entry => { setName(entry.target.value)}
    const handleChangeDescription = entry => { setDescription(entry.target.value)}

    const handleChangeMinutesYear = entry => { setMinutesYear(entry.target.value)}
    const handleChangeMinutesMonth = entry => { setMinutesMonth(entry.target.value)}
    const handleChangeMinutesRequest = entry => { setMinutesRequest(entry.target.value)}
    const handleChangeRequestsYear = entry => { setRequestsYear(entry.target.value)}
    const handleChangeRequestsMonth = entry => { setRequestsMonth(entry.target.value)}
    const handleChangeDaysRequest = entry => { setDaysRequest(entry.target.value)}
    const handleChangeDaysBeforeRequest = entry => { setDaysBeforeRequest(entry.target.value)}
    const handleChangeDashboardHerarchy = entry => { setDashboardHerarchy(entry.target.value)}

    const handleChangeDiscountApplies = ( val ) => { setDiscountApplies(!val) }
    const handleChangeContinuedHoliday = ( val ) => { setContinuedHoliday(!val) }
    const handleChangeLaterDays = ( val ) => { setLaterDays(!val) }
    const handleChangeActive = ( val ) => { setActive(!val) }

    // Subcomponents --------------------------------------------------------------------------------------

    const openNotification = (type,title,message,placement) => {
        let BodyMessage = () => <>{message}</>
        if( typeof message === 'object' ) {
            BodyMessage = () => (
                <ul>{ Object.entries(message).map(([key, value]) => <li className='text-justify'>{value[0]}</li>  ) }</ul>
            )
        }
        toast.push((
            <Notification closable title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }
    
    // Submit ----------------------------------------------------------------------------------------------

    const onSubmit = async () => {
        try {
            const values = []
            if (id) {
                values['id'] = id
            }
            values['name'] =  name
            values['description'] =  description

            if (minutesYear) { values['minutes_per_year'] = ( minutesYear * 60 ) }
            if (minutesMonth) { values['minutes_per_month'] = ( minutesMonth * 60 ) }
            if (minutesRequest) { values['minutes_per_request'] = ( minutesRequest * 60 ) }
            if (requestsYear) { values['requests_per_year'] = requestsYear }
            if (requestsMonth) { values['requests_per_month'] = requestsMonth }
            if (daysRequest) { values['days_per_request'] = daysRequest }
            if (daysBeforeRequest) { values['days_before_request'] = daysBeforeRequest }
            if (dashboardHerarchy) { values['dashboard_herarchy'] = dashboardHerarchy }

            values['discount_applies'] =  discountApplies ? 1 : 0
            values['adjacent_to_holiday'] =  continuedHoliday ? 1 : 0
            values['later_days'] =  laterDays ? 1 : 0
            values['active'] =  active ? 1 : 0

            console.log(values)


            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/attendance/permission-types', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                dispatch(getPermissionTypes())
                openNotification('success','Éxito','El tipo de permiso se almacenó con éxito','top-start')
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
                                    <FormItem asterisk label="Nombre">
                                        <Input value={ name } onChange={ handleChangeName } />
                                    </FormItem>
                                    <FormItem asterisk label="Descripción">
                                        <Input textArea value={ description } onChange={ handleChangeDescription } />
                                    </FormItem>
                                    <div className='flex justify-around'>
                                        <FormItem label="Descuento" className="text-center">
                                            <Switcher checked={discountApplies} onChange={handleChangeDiscountApplies} />
                                        </FormItem>
                                        <FormItem label="Continuo a Festivos" className="text-center">
                                            <Switcher checked={continuedHoliday} onChange={handleChangeContinuedHoliday} />
                                        </FormItem>
                                        <FormItem label="Días Posteriores" className="text-center">
                                            <Switcher checked={laterDays} onChange={handleChangeLaterDays} />
                                        </FormItem>
                                        { id ?
                                            <FormItem label="Activo" className="text-center">
                                                <Switcher checked={active} onChange={handleChangeActive} />
                                            </FormItem>
                                            :<></>
                                        }
                                    </div>
                                    <div className='flex justify-around gap-4'>
                                        <FormItem label="Horas al Año">
                                            <Input type='number' value={ minutesYear } onChange={ handleChangeMinutesYear } />
                                        </FormItem>
                                        <FormItem label="Horas al Mes">
                                            <Input type='number' value={ minutesMonth } onChange={ handleChangeMinutesMonth } />
                                        </FormItem>
                                    </div>
                                    <div className='flex justify-around gap-4'>
                                        <FormItem label="Solicitudes al Año">
                                            <Input type='number' value={ requestsYear } onChange={ handleChangeRequestsYear } />
                                        </FormItem>
                                        <FormItem label="Solicitudes al Mes">
                                            <Input type='number' value={ requestsMonth } onChange={ handleChangeRequestsMonth } />
                                        </FormItem>
                                    </div>
                                    <div className='flex justify-around gap-4'>
                                        <FormItem label="Días por Solicitud">
                                            <Input type='number' value={ daysRequest } onChange={ handleChangeDaysRequest } />
                                        </FormItem>
                                        <FormItem label="Horas por Solicitud">
                                            <Input type='number' value={ minutesRequest } onChange={ handleChangeMinutesRequest } />
                                        </FormItem>
                                    </div>
                                    <div className='flex justify-around gap-4'>
                                        <FormItem label="Días Anteriores Permitidos">
                                            <Input type='number' value={ daysBeforeRequest } onChange={ handleChangeDaysBeforeRequest } />
                                        </FormItem>
                                        <FormItem label="Orden en lista">
                                            <Input type='number' value={ dashboardHerarchy } onChange={ handleChangeDashboardHerarchy } />
                                        </FormItem>
                                    </div>
                                    
                                </FormContainer>
                            }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content