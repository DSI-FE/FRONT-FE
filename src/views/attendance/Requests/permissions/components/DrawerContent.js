import React, { forwardRef,useCallback,useState,useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { CustomSelectOption,Upload, Button as CustomButton} from 'components/custom'
import { Input,DatePicker,FormItem,FormContainer,Select,Notification,toast} from 'components/ui'

import { Formik } from 'formik'

import { getDatesBetween,substractDaysToDate,dateToStringFormat,isWeekend,addDaysToDate, StringToDate, intToHours } from 'helpers'
import { apiPermissionTypesIndexActive,apiPermissionTypesShowSimple,apiGetHolidays,apiGetCompensatoryAvailableTime } from 'services/AttendanceService'
import { apiGetOrganizationalUnitEmployeesSimple,apiGetOrganizationalUnitEmployeesBosses } from 'services/AdministrationService'
import { HiDocument, HiUpload, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi'
import BaseService from 'services/BaseService'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { setDrawerOpen,setLoading } from '../store/stateSlice'
import { getEmployeePermissions,getOrganizationUnitPermissions } from '../store/dataSlice'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import InfoContent from './InfoContent'

const getPermissionTypesIndexActive = async () => {
    const res = await apiPermissionTypesIndexActive()
    return res.data
}

const getCompensatoryAvailableTime = async (employeeId) => {
    const res = await apiGetCompensatoryAvailableTime({employeeId})
    return res.data
}

const getPermissionTypesShowSimple = async (id,employeeId) => {
    const res = await apiPermissionTypesShowSimple({permission_type_id:id,employee_id:employeeId})
    return res.data
}

const getOrganizationalUnitEmployeesSimple = async (id) => {
    const resSimple = await apiGetOrganizationalUnitEmployeesSimple(id)
    const resBosses = await apiGetOrganizationalUnitEmployeesBosses(id)
    return [...resSimple.data,...resBosses.data]
}

const getHolidays = async () => {
    const res = await apiGetHolidays()
    return res.data
}


const DrawerContent = forwardRef( (props, ref) => 
{
    const { isBoss } = props
    
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee, organizationalUnit } = useSelector(state => state.auth)
    const { selected_permission:selectedPermission, selected_date:selectedDate, date_input_read_only:dateInputReadOnly} =  useSelector(state => state.permissions.state)

    // Initial Values --------------------------------------------------------------------------------------

    const permissionIdIni = selectedPermission? selectedPermission.id:null
    const employeeIni = selectedPermission? selectedPermission.employee.id:employee.id
    const permTypeIdIni = selectedPermission? selectedPermission.permission_type_id:null
    const dateIniIni = selectedPermission? StringToDate(selectedPermission.date_start,'-',2) : selectedDate ? StringToDate(selectedDate,'-',2) : {}
    const dateEndIni = selectedPermission? StringToDate(selectedPermission.date_end,'-',2) : {}
    const timeIniIni = selectedPermission? dayjs('2000-01-01T'+selectedPermission.time_start) : dayjs('2000-01-01T08:00')
    const timeEndIni = selectedPermission? dayjs('2000-01-01T'+selectedPermission.time_end) : dayjs('2000-01-01T16:00')
    const descripIni = selectedPermission? selectedPermission.description : ''
    const dateEndRequiredIni = selectedPermission && selectedPermission.date_start === selectedPermission.date_end ? false : true

    // States ----------------------------------------------------------------------------------------------

    const [ employeesList, setEmployeesList ] = useState([])
    const [ employeeSelected, setEmployeeSelected ] = useState(employeeIni)

    const [ permissionTypeList, setPermissionTypeList ] = useState([])
    const [ permissionType, setPermissionType ] = useState({})
    const [ permissionTypeId, setPermissionTypeId] = useState(permTypeIdIni)

    const [ permissionId ] = useState(permissionIdIni)

    const [ dateIni, setDateIni ] = useState(dateIniIni)
    const [ dateEnd, setDateEnd ] = useState(dateEndIni)

    const [ dateIniMax, setDateIniMax ] = useState(dateEnd)

    const [ dateEndMax, setDateEndMax ] = useState(dateEnd)
    const [ dateEndMin, setDateEndMin ] = useState(dateIni)

    const [ dateEndRequired, setDateEndRequired ] = useState(dateEndRequiredIni)
    const [holidays, setHolidays] = useState([])
    
    const [ timeIni, setTimeIni ] = useState(timeIniIni)
    const [ timeEnd, setTimeEnd ] = useState(timeEndIni)

    const [ description, setDescription ] = useState(descripIni)

    const [ file, setFile ] = useState([])

    const [ availableTime,setAvailableTime] = useState(0)

    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeDescription = event => {
        setDescription(event.target.value)
    }

    const handleChangeFile = (e) => { setFile(e) }

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( async () => {
        setPermissionTypeList( await getPermissionTypesIndexActive() )
        setHolidays( await getHolidays() )
        setEmployeesList(await getOrganizationalUnitEmployeesSimple(organizationalUnit.id))
        setPermissionTypeId(permissionTypeId)
        if (permissionTypeId) {
            setPermissionType( await getPermissionTypesShowSimple(permissionTypeId,employeeSelected))
        }
    },[employeeSelected,organizationalUnit.id,selectedPermission])
    useEffect(() => { fetchData() }, [fetchData, selectedPermission, permissionTypeId ])

    useEffect(() => {
        if (selectedPermission) {
            setEmployeeSelected(selectedPermission.employee.id);
            setPermissionTypeId(selectedPermission.permission_type_id);
            setPermissionType({id:selectedPermission.permission_type_id}); // You may need to fetch and set permissionType based on the new permission_type_id
            setDateIni(StringToDate(selectedPermission.date_start, '-', 2));
            setDateEnd(StringToDate(selectedPermission.date_end, '-', 2));
            // Set other initial values as needed
            setTimeIni(dayjs('2000-01-01T' + selectedPermission.time_start));
            setTimeEnd(dayjs('2000-01-01T' + selectedPermission.time_end));
            setDescription(selectedPermission.description);
            // ... (other state values)
        }
    }, [selectedPermission]);

    // useEffect(() => { setDateIni(StringToDate(selectedDate,'-',2)) }, [selectedDate,permissionTypeId])

    // Subcomponents --------------------------------------------------------------------------------------

    const EmployeeSelect = ( { className } ) =>
    {
        const options = []
        employeesList.forEach( per =>	{ options.push({ value:per.id, label:(per.name+' '+per.lastname) }) })

        const handleFilterChange = async (selected) => { 
            setEmployeeSelected(selected.value)
            setPermissionType({})
                setDateIni({})
                setDateEnd({})
                setDateEndRequired(false)
                setTimeIni(dayjs('2000-01-01T08:00'))
                setTimeEnd(dayjs('2000-01-01T16:00'))

        }

        return (
            <div className={`${className} mb-4`}>
                <div className={`mb-2 font-semibold`}>Empleado</div>
                <Select 
                    options = { options }
                    placeholder={'Selecciona un empleado'}
                    onChange = { handleFilterChange }
                    components = {{ Option: CustomSelectOption }}
                    value = { options.filter(option => employeeSelected ? option.value === employeeSelected : null) }
                />
            </div>
        )
    }
    
    const PermissionTypeSelect = ({ className }) => {
        const options = [];
        permissionTypeList.forEach((per) => {
            options.push({ value: per.id, label: per.name });
        });
    
        const compensatory = permissionType.id === 14;
    
        const handleFilterChange = async (selected) => {
            setPermissionType(await getPermissionTypesShowSimple(selected.value, employeeSelected));
            setAvailableTime(await getCompensatoryAvailableTime(employeeSelected));
            setDateEnd({});
            setDateEndRequired(false);
            setTimeIni(dayjs('2000-01-01T08:00'));
            setTimeEnd(dayjs('2000-01-01T16:00'));
        };
    
        const selectClassName = compensatory ? 'w-6/12' : 'w-full';
    
        return (
            <div className='flex justify-between items-center gap-6'>
                <div className={selectClassName}>
                    <div className="mb-2 font-semibold flex justify-between items-center">
                        <span>Tipo de permiso</span>
                        {permissionType.id ? <InfoContent permissionType={permissionType} /> : <></>}
                    </div>
                    <Select
                        options={options}
                        placeholder={'Selecciona un tipo de permiso'}
                        onChange={handleFilterChange}
                        components={{ Option: CustomSelectOption }}
                        value={options.find((option) => permissionType && option.value === permissionType.id) || null}
                        defaultValue = { options.filter(option => permissionType ? option.value === permissionType.id : null) }

                    />
                </div>
                {compensatory ? (
                    <div className='w-6/12 text-center'>
                        <h6 className='font-semibold text-slate-500'>Tiempo disponible</h6>
                        <span className='text-lg'>{intToHours(availableTime)}</span>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    };
    

    const CustomDatePicker = ({ ini = true }) => {
        let holidayArr = []
        const pickHolidays = holidays
        pickHolidays?.forEach( ( holiday, i ) => {
            if( holiday.date_end && holiday.date_end !== holiday.date_start ) {
                const holyDates = getDatesBetween(holiday.date_start,holiday.date_end)
                holyDates.forEach((holyDate,j) => {
                    holidayArr.push(holyDate)
                })
            } else {
                holidayArr.push(holiday.date_start)
            }
        })

        let banDate = holidayArr
        let dateMinCurrent = new Date()

        let dayCounter = permissionType.permission_days ? permissionType.permission_days : permissionType.gnral_days
        while(dayCounter>0) {
            substractDaysToDate(dateMinCurrent,1)
            const actDate = dateToStringFormat(dateMinCurrent)
            if(holidayArr.includes(actDate)||isWeekend(dateMinCurrent)) {
                banDate.push(actDate)
            } else {
                dayCounter--
            }
        }

        let diffDays = null
        if(permissionType.max_hours_per_year && permissionType.max_hours_per_year > 0) {
            const maxHoursYear = permissionType.max_hours_per_year
            const usedHoursYear = permissionType.employee_permission_type.used_hours
            diffDays = Math.ceil((maxHoursYear - usedHoursYear)/8)
        }

        const disableCertainDate = date => banDate.includes(dayjs(date).format('YYYY-MM-DD')) || isWeekend(date)

        return (
            <DatePicker
                disabled={dateInputReadOnly}
                clearable={ false }
                inputPrefix={ null }
                inputSuffix={ <HiOutlineCalendar className="text-lg" /> }
                inputFormat={ `DD/MM/YYYY` }
                value={ ( ini ? dateIni : dateEnd ) }
                disableOutOfMonth={true}
                disableDate={disableCertainDate}
                // disabled = { !ini ? !dateEndRequired && dateIni : false }
                maxDate={(ini ? dateIniMax : dateEndMax)}
                minDate={(ini ? dateMinCurrent : dateEndMin)}
                onChange = { date => { 
                    if (ini) {
                        setDateIni( date )
                        setDateEndMin( date )
                        if (permissionType.max_days_per_request) {
                            let maxDays = diffDays && diffDays < permissionType.max_days_per_request ? diffDays : permissionType.max_days_per_request
                            let dateMaxPer = cloneDeep(date)
                            substractDaysToDate(dateMaxPer,1)
                            while ( maxDays > 0 ) {
                                addDaysToDate(dateMaxPer,1)
                                const dateMaxPerStr = dateToStringFormat(dateMaxPer)
                                if(!(banDate.includes(dateMaxPerStr)||isWeekend(dateMaxPer))) {
                                    maxDays--
                                }
                            }
                            setDateEndMax(dateMaxPer)
                            setDateEnd(dateMaxPer)
                        }
                    } else {
                        setDateEnd( date )
                        setDateIniMax( date )
                        if (permissionType.max_days_per_request) {
                            let maxDays = diffDays && diffDays < permissionType.max_days_per_request ? diffDays : permissionType.max_days_per_request
                            let dateMinPer = cloneDeep(date)
                            substractDaysToDate(dateMinPer,1)
                            while ( maxDays > 0 ) {
                                substractDaysToDate(dateMinPer,1)
                                const dateMinPerStr = dateToStringFormat(dateMinPer)
                                if(!(banDate.includes(dateMinPerStr)||isWeekend(dateMinPer))) {
                                    maxDays--
                                }
                            }
                        }
                    }
                }}
            />
        )
    }

    const CustomDatePickers = () => {
        const onSwitcherToggle = () => { setDateEndRequired(!dateEndRequired)}
        return (
            <div className='w-full flex justify-between gap-5'>
                <FormItem className='w-5/12' label={`Fecha ${dateEndRequired ? 'inicial' : ''}`}>
                    <CustomDatePicker  ini= { true } />
                </FormItem>
                {
                    dateEndRequired ? ( <FormItem className='w-5/12' label="Fecha final"><CustomDatePicker ini={false} /></FormItem> ) :  <div className='w-5/12' ></div>
                }
                <div className='w-2/12 flex flex-col justify-center items-center'>
                    <CustomButton
                        variant = "solid"
                        color = { dateEndRequired ? 'red-500' : 'buke-500' }
                        icon = { dateEndRequired ? <HiOutlineMinusCircle /> : <HiOutlinePlusCircle /> }
                        title = { dateEndRequired ? 'Remover fecha final' : 'Agregar fecha final (Permiso de más de un día)' }
                        onClick = { onSwitcherToggle }
                    />
                </div>
            </div>
        )
    }

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

    const CustomMandatoryAttachments = ({name}) => (
        <div className='flex justify-between items-center align-middle'>
            <Upload
                name='attachment_mandatory'
                accept='application/pdf, application/zip,image/jpeg, image/png'
                uploadLimit={2}
                onChange={(file) => {handleChangeFile(file)}}
            >
                <CustomButton icon={<HiUpload className='text-lg'/>}>Cargar {name}</CustomButton>
            </Upload>
            <div >
            {
                file.map((el,i) =>{
                    return (
                        <div className='flex justify-between' key={`file-${i}`}>
                            <div className='flex align-middle items-center gap-2'><HiDocument className='inline-block'/><span>{el.name}</span></div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )

    const CustomMandatoriesAttachments = () => {
        const steps = permissionType?.steps
        if (steps) {
            const firstStep = steps.find( el => el.correlative === 1)
            const attachments = firstStep?.attachments
            if(attachments.length > 0){
                return (
                    <>
                        <h6 className='mb-4'>Adjuntos Obligatorios</h6>
                        { attachments.map( (el,i) => {
                            return (
                                <FormContainer key={`att-${i}`} className='w-full mt-2'>
                                    <CustomMandatoryAttachments name={`${el.name}`}/>
                                </FormContainer>
                            )
                        })}
                    </>
                )
            }
        }
        return <></>
    }

    // Submit ----------------------------------------------------------------------------------------------

    const onSubmit = async () => {
        try {
            const values = []
            if (selectedPermission?.id) {
                values['id'] = selectedPermission?.id
            }
            if ( dateIni instanceof Date  ) {
                values['date_ini'] = dateToStringFormat(dateIni)
            }
            if( dateEnd instanceof Date && dateEndRequired ) {
                values['date_end'] =  dateToStringFormat(dateEnd) 
            } else {
                if ( dateIni instanceof Date  ) {
                    values['date_end'] = dateToStringFormat(dateIni)
                }
            }
            values['time_ini'] = ('0' + timeIni.$H).slice(-2)+':'+('0' + timeIni.$m).slice(-2)
            values['time_end'] = ('0' + timeEnd.$H).slice(-2)+':'+('0' + timeEnd.$m).slice(-2)
            values['description'] =  description

            values['boss_generated'] = 0
            values['state'] = 1

            if ( permissionType.id !== undefined) {
                values['att_permission_type_id'] = permissionType.id
            }
            values['adm_employee_id'] =employeeSelected
            values['attachment_mandatory'] = file[0]


            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })
            const response = await BaseService.post('/attendance/permissions/application', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                dispatch(getEmployeePermissions({id:employee.id,state:0}))
                if(isBoss){
                    dispatch(getOrganizationUnitPermissions(organizationalUnit.id))
                }
                const message = response.data?.message
                openNotification('success','Éxito',message,'top-start')
            }



        } catch (errors) {
            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
        } finally {
            dispatch(setLoading(false))
        }
    }


    // Form ------------------------------------------------------------------------------------------------
    return (
        <div className="p-6">
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
                                isBoss ?
                                <EmployeeSelect />
                                : <></>
                            }
                            <PermissionTypeSelect /> 
                            
                            <FormContainer className='mt-4'>
                                
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
                                    <div className='w-2/12'></div>
                                </div>
                                <FormItem label="Justificación">
                                    <Input textArea value={ description } onChange={ handleChangeDescription } />
                                </FormItem>

                            <CustomMandatoriesAttachments/>
                        </FormContainer>
                        </>
                    )}
                }
            </Formik>
        </div>
    )

})

export default DrawerContent
