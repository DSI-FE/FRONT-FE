import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { DatePicker, Input, Select, Spinner } from 'components/ui'
import { Button as CustomButton, CustomSelectOption, Upload } from 'components/custom'
import {
    HiOutlineCalendar,
    HiOutlineMinusCircle,
    HiOutlinePlusCircle,
    HiDocument,
    HiUpload
} from 'react-icons/hi'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'


import { apiPermissionTypesIndexActive, apiGetPermissionRequest } from 'services/AttendanceService'
import { apiGetOrganizationalUnitChildrensActiveEmployees } from 'services/AdministrationService'

import dayjs from 'dayjs'
import { dateToStringFormat, getLastWeekday } from 'helpers'

const getPermissionTypesIndexActive = async () => {
    const res = await apiPermissionTypesIndexActive()
    return res.data
}
const getOrganizationalUnitChildrensActiveEmployees = async (id) => {
    const res = await apiGetOrganizationalUnitChildrensActiveEmployees(id)
    return res.data
}
const getPermissionRequest = async (id) => {
    const res = await apiGetPermissionRequest(id)
    return res.data
}

const Content = ({ employeeIsBoss, getFormData, selectedDate = null, permissionRequestId = null }) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------
	const {  organizationalUnit, employee } = useSelector( state => state.auth )

	// Initial Values --------------------------------------------------------------------------------------
    const [ permissionRequest, setPermissionRequest ] = useState( null )

    const loading = false
    const dateIniIni = selectedDate ? new Date( selectedDate ) : getLastWeekday()

    // States ----------------------------------------------------------------------------------------------

    const [ employeesList, setEmployeesList ] = useState()
    const [ permissionTypesList, setPermissionTypesList ] = useState()
    const [ dateEndRequired, setDateEndRequired ] = useState( false )

    const [ employeeId, setEmployeeId ] = useState( employee.id )
    const [ permissionTypeId, setPermissionTypeId ] = useState( 0 )
    const [ permissionType, setPermissionType ] = useState( 0 )
    const [ dateIni, setDateIni ] = useState( dateIniIni )
    const [ dateEnd, setDateEnd ] = useState( null )
    const [ timeIni, setTimeIni ] = useState( dayjs( '2000-01-01T08:00' ) )
    const [ timeEnd, setTimeEnd ] = useState( dayjs( '2000-01-01T16:00' ) )
    const [ justification, setJustification ] = useState( null )
    const [ files, setFiles ] = useState([])
    
    // Fetching Data ---------------------------------------------------------------------------------------

    const fetchData = useCallback( async () => {
        setPermissionTypesList( await getPermissionTypesIndexActive() )
        if( employeeIsBoss ) {
            setEmployeesList( await getOrganizationalUnitChildrensActiveEmployees( organizationalUnit.id ) )
        }
        if( permissionRequestId ){
            setPermissionRequest( await getPermissionRequest( permissionRequestId ) )
        }

    },[ employeeIsBoss, organizationalUnit?.id, permissionRequestId ])
    useEffect(() => { fetchData() }, [ fetchData ])

    
    useEffect(() => {
        getFormData( () => ({
            att_permission_type_id: permissionTypeId && permissionTypeId !== 0 ? permissionTypeId : null,
            adm_employee_id: employeeId,
            date_ini: dateIni && dateIni instanceof Date ? dateToStringFormat( dateIni ) : dateIni ,
            date_end: dateEnd && dateEnd instanceof Date ? dateToStringFormat( dateEnd ) : ( dateIni && dateIni instanceof Date ? dateToStringFormat( dateIni ) : dateIni ),
            time_ini: timeIni && timeIni.$H ? ( '0' + timeIni.$H ).slice( -2 )+':'+( '0' + timeIni.$m ).slice( -2 )+':00' : null,
            time_end: timeEnd && (timeEnd.$H || timeEnd.$H === '0')  ? ( '0' + timeEnd.$H ).slice( -2 )+':'+( '0' + timeEnd.$m ).slice( -2 )+':00' : null,
            justification: justification,
            state: 1,
            adm_employee_generated_id: employee.id,
            files:files
        } ))
    }, [ getFormData,dateEnd, dateIni, employee.id, employeeId, justification, permissionTypeId, timeEnd, timeIni, files ]);

    // Subcomponents ---------------------------------------------------------------------------------------

    const PermissionTypeSelect = ( { className } ) =>
    {
        const options = []
        permissionTypesList?.forEach( per => { options.push({ value:per.id, label:per.name }) })

        return (
            <div className={`${className}`}>
                <div className={`mb-2 font-semibold`}>Tipo de Permiso</div>
                <Select 
                    options = { options }
                    placeholder={'Selecciona un tipo de permiso'}
                    components = {{ Option: CustomSelectOption }}
                    onChange = { selected => {
                        setPermissionTypeId( selected.value )
                        setPermissionType( permissionTypesList.find( el => el.id=== selected.value) )
                    } }
                    value = { options.filter( option => permissionTypeId ? option.value === permissionTypeId : null ) }
                />
            </div>
        )
    }

    const EmployeeSelect = ( { className } ) =>
    {
        if( !employeeIsBoss ) {
            return <></>
        }
        const options = []
        employeesList?.forEach( emp => { options.push({ value:emp.id, label:emp.name+' '+emp.lastname }) })

        return (
            <div className={`${className}`}>
                <div className={`mb-2 font-semibold`}>Colaborador</div>
                <Select 
                    options = { options }
                    placeholder={'Selecciona un tipo de permiso'}
                    components = {{ Option: CustomSelectOption }}
                    onChange = { selected => {
                        setEmployeeId( selected.value ) 
                    } }
                    value = { options.filter( option => employeeId ? option.value === employeeId : null ) }
                />
            </div>
        )
    }

    const CustomDatePicker = ( { ini = true } ) => {

        return (
            <DatePicker
                clearable={ false }
                inputPrefix={ null }
                inputSuffix={ <HiOutlineCalendar className="text-lg" /> }
                inputFormat={ `DD/MM/YYYY` }
                disableOutOfMonth={ true }
                maxDate={ ini ? dateEnd : null }
                minDate={ ini ? null : dateIni }
                value={ ini ? dateIni : dateEnd }
                onChange = { date => {
                    ini ? setDateIni( date ) : setDateEnd( date )
                }}
            />
        )
    }

    const DatePickers = ( { className }) => {
        const handleDateEndRequired = () =>{
            setDateEndRequired(!dateEndRequired)
            if(dateEndRequired){
                setDateEnd(null)
            }
        }
        return (
            <div className={`flex justify-start items-end gap-6 ${className}`}>
                <div className='w-5/12'>
                    <div className={`mb-2 font-semibold`}>{`Fecha ${dateEndRequired ? 'inicial' : ''}`}</div>
                    <CustomDatePicker />
                </div>
                {
                    dateEndRequired ? (
                        <div className='w-5/12'>
                            <div className={`mb-2 font-semibold`}>Fecha Final</div>
                            <CustomDatePicker ini={ false } />
                        </div>
                    ) :  <div className='w-5/12'></div>
                }
                <div className='w-2/12 text-center'>
                    <CustomButton
                        variant = "solid"
                        color = { dateEndRequired ? 'red-500' : 'buke-500' }
                        icon = { dateEndRequired ? <HiOutlineMinusCircle /> : <HiOutlinePlusCircle /> }
                        title = { dateEndRequired ? 'Remover fecha final' : 'Agregar fecha final (Permiso de más de un día)' }
                        onClick = { handleDateEndRequired }
                    />
                </div>
            </div>
        )
    }

    const CustomTimePicker = ( { ini = true } ) => (
        <TimePicker
            className='w-full'
            sx={{ svg: { color:'#019de1' }, input: { color:'#777777' }, label: { color:'#777777' } }}
            slotProps={{ textField: { size: 'small' } }}
            value={  ini ? timeIni : timeEnd }
            onChange={ time => {
                ini ? setTimeIni( time ) : setTimeEnd( time )
            }}

        />
    )

    const TimePickers = ( { className } ) => (
        <div className={`w-full flex justify-start items-end gap-6 ${className}`}>
            <div className='w-5/12'>
                <div className={`mb-2 font-semibold`}>Hora Inicial</div>
                <CustomTimePicker />
            </div>
            <div className='w-5/12'>
                <div className={`mb-2 font-semibold`}>Hora Final</div>
                <CustomTimePicker ini={ false } />
            </div>
            <div className='w-2/12'></div>
        </div>
    )

    const CustomMandatoryAttachments = ( { attId, attName } ) => (
        <div className='flex justify-between items-center align-middle mb-4'>
            <Upload
                name='attachment_mandatory'
                accept='application/pdf, application/zip,image/jpeg, image/png'
                uploadLimit={1}
                onChange={ (e) => {
                    setFiles( prevFiles => ({
                        ...prevFiles,
                        [attId]: e,
                    }));
                }}
            >
                <CustomButton icon={<HiUpload className='text-lg'/>}>Cargar {attName} </CustomButton>
            </Upload>
            <div >
            {
                files[attId] ? (
                    files[attId].map( ( el, i ) => (
                            <div className='flex align-middle items-center gap-2'>
                                <HiDocument className='inline-block'/><span>{el.name}</span>
                            </div>
                    ))
                ) : <></>
            }
            </div>
        </div>
    )

    const CustomMandatoriesAttachments = () => {
        const attachments = permissionType?.permission_type_attachments
        if (attachments && attachments.length > 0) {
            return (
                <>
                    <div className={`my-4 font-semibold`}>Adjuntos Obligatorios</div>
                    {
                        attachments.map( (el,i) => (
                            <div key={`att-${i}`}>
                                <CustomMandatoryAttachments attId={`${el.id}`} attName={`${el.name}`} />
                            </div>))
                    }
                </>
            )
        }
        return <></>
    }

    // Form ------------------------------------------------------------------------------------------------
    
    return (
        ! loading ? (
            <>
                <PermissionTypeSelect className={'mb-6'} />
                <EmployeeSelect className={'mb-6'} />
                <DatePickers className={'mb-6'} />
                <TimePickers className={'mb-6'} />
                <div className=''>
                    <div className={`mb-2 font-semibold`}>Justificación</div>
                    <Input
                        textArea
                        onChange = { e => setJustification( e.target.value )}
                    />
                </div>
                <CustomMandatoriesAttachments />
            </>
        ) : (
            <div className='flex justify-center items-center h-full'>
                <Spinner size="3.25rem" />
            </div>
        )
    )
}

export default Content