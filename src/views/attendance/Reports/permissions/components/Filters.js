import React, {useState,useCallback,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { DatePicker,Checkbox,Button,Select} from 'components/ui'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbFilterOff } from 'react-icons/tb'
// import { getMarkingsByPeriod } from '../store/dataSlice'

import { apiGetOrganizationalUnitChildrens } from 'services/AdministrationService'

import { HiCheck } from 'react-icons/hi'

import { setEmployeesList } from '../store/stateSlice'

const getOrganizationalUnitChildrens = async (id) => {
    const res = await apiGetOrganizationalUnitChildrens(id)
    return res.data
}

const Filters = ({children}) => {

    const dispatch = useDispatch()
    const {organizationalUnit:organizationalUnitCurrent,functionalPosition} = useSelector((state) => state.auth)
    // const { employeesList } = useSelector((state) => state.attendance.state)

    const isBoss = functionalPosition.boss
    const isRRHH = functionalPosition.id === 48 || functionalPosition.id === 89

    const orgId = isRRHH ? 1 : organizationalUnitCurrent.id

    // const borderFilter = isBoss || isRRHH ? 'border' : ''
    const borderFilter = 'border'
    
    const [ date ] = useState( new Date() )

    const [ dateIni, setDateIni ] = useState(new Date(date.getFullYear(), date.getMonth(), 1))
    const [ dateEnd, setDateEnd ] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate()))

    const [ organizationalUnitsList, setOrganizationalUnitsList ] = useState([])

    const [ employee, setEmployee ] = useState(0)
    const [ organizationalUnit, setOrganizationalUnit ] = useState(0)

    const [showNoLaboralDays,setShowNoLaboralDays] = useState(false)

    const orgIdReq = organizationalUnit === 0 ? orgId : organizationalUnit
    
    const fetchData = useCallback( async () => {
        const dateIniReq = dateIni.getFullYear()+'-'+(dateIni.getMonth()+1)+'-'+dateIni.getDate()
        const dateEndReq = dateEnd.getFullYear()+'-'+(dateEnd.getMonth()+1)+'-'+dateEnd.getDate()
        setOrganizationalUnitsList( await getOrganizationalUnitChildrens( orgId ) )
        dispatch(setEmployeesList(  { id:orgIdReq, date_ini:dateIniReq, date_end:dateEndReq, show_no_laboral_days:showNoLaboralDays } ) )
    },[dispatch,organizationalUnit,orgId,dateIni,dateEnd ])

    useEffect(() => {
        fetchData()
    }, [ fetchData, dateIni, dateEnd, showNoLaboralDays, organizationalUnit ])
    
    /** Clear Filters */
    const onClearAll = () => {
        setDateIni(new Date(date.getFullYear(), date.getMonth(), 1))
        setDateEnd(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
        setOrganizationalUnit(0)
        setEmployee(0)
        setShowNoLaboralDays(false)
	}

    const CustomSelectOption = ({innerProps, label, isSelected}) =>
    {
        return (
            <div 
                className = {`flex items-center justify-between p-2 cursor-pointer ${
                    isSelected
                    ? 'bg-gray-100 dark:bg-gray-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }` } 
                {...innerProps}
            >
                <div className = "flex items-center gap-2" >
                    <span>{ label }</span>
                </div>
                { isSelected && <HiCheck className="text-emerald-500 text-xl" /> }
            </div>
        )
    }

    // const EmployeesSelect = ( { className } ) =>
    // {
    //     if ( isRRHH || isBoss ) {
    //         const handleFilterChange = (selected) => { setEmployee(selected.value) }

    //         const options = [ { value: 0, label: 'Todos los empleados de la unidad seleccionada' }, ]
    //         employeesList?.forEach( employee =>	{ options.push({ value:employee.id, label:(employee.name+' '+employee.lastname) }) })

    //         return (
    //                 <div className={className}>
    //                     <div className="mb-1 font-semibold text-sm">Empleados</div>
    //                     <Select 
    //                         options = { options }
    //                         size = "sm"
    //                         onChange = { handleFilterChange }
    //                         components = {{ Option: CustomSelectOption }}
    //                         value = { options.filter(option => option.value === employee) }
    //                     />
    //                 </div>
    //         )
    //     }
    // }

    const OrganizationalUnitsSelect = ( { className } ) =>
    {
        // if ( isRRHH || isBoss ) {
            const handleFilterChange = (selected) => {
                setOrganizationalUnit(selected.value)
                setEmployee(0)
            }

            const options = [ { value: 0, label: 'Todas las unidades organizacionales' }, ]
            organizationalUnitsList.forEach( org =>	{ options.push({ value:org.id, label:org.name }) })

            return (
                <div className={className}>
                    <div className="mb-1 font-semibold text-sm">Unidades Organizacionales</div>
                    <Select 
                        options = { options }
                        size = "sm"
                        onChange = { handleFilterChange }
                        components = {{ Option: CustomSelectOption }}
                        value = { options.filter(option => option.value === organizationalUnit) }
                    />
                </div>
            )
        // }
    }

    // useEffect(() => {
    //     console.log(dateIni,dateEnd)
    // }, [ dateIni,dateEnd ])

    return (
        <div className="md:flex xs:flex-col md:flex-col justify-start w-full gap-5 md:mt-4 md:mb-8">
            <div className="md:flex xs:flex-col md:flex-row justify-start w-full gap-5">
                {/* <div className={`w-6/12 flex justify-start items-center gap-4 border rounded p-4`}>
                    <div className="w-4/12">
                        <div className="mb-1 font-semibold text-sm">Fecha Inicial</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg" />}
                            inputSuffix={null}
                            value={ dateIni ? dateIni : date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear() }
                            inputFormat="DD/MM/YYYY"
                            maxDate={dateEnd}
                            onChange={(dateVal)=>{
                                const dateReq = dateVal ? dateVal : new Date(date.getFullYear(),date.getMonth(),date.getDate())
                                return setDateIni(dateReq)
                            }}
                            clearable={false}
                        />
                    </div>
                    <div className="w-4/12">
                        <div className="mb-1 font-semibold text-sm">Fecha Final</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg" />}
                            inputSuffix={null}
                            value={dateEnd}
                            inputFormat=" DD/MM/YYYY"
                            minDate={dateIni}
                            onChange={(date)=>setDateEnd(date)}
                            clearable={false}

                        />
                    </div>
                    <div className="w-4/12 h-full">
                        <label className='flex justify-start items-center h-full pt-5'>
                            <Checkbox className="text-sm" checked={showNoLaboralDays} onChange={(val)=>setShowNoLaboralDays(val)}/>
                            <span className='font-semibold'>Días no laborales</span>
                        </label>
                    </div>
                </div> */}
                <div className={`w-6/12 flex items-center justify-start gap-5 ${borderFilter} rounded p-4`}>
                    <OrganizationalUnitsSelect className={`w-6/12`}/>
                    {/* <EmployeesSelect className={`w-6/12`}/> */}
                    {
                        children
                    }
                </div>
            </div>
            <div className="w-full text-right">
                <Button size="sm" onClick = {onClearAll} title="Limpiar Filtros" icon={<TbFilterOff />}>
                    Reiniciar Filtros
                </Button>
            </div>
        </div>
    )
}

export default Filters