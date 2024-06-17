import React, {useState,useCallback,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { DatePicker,Checkbox,Button } from 'components/ui'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbFilterOff } from 'react-icons/tb';
import { getMarkingsByPeriod } from '../store/dataSlice';


const Filters = () =>
{
    const date = new Date()
    const monthIni = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth()+1, 0)

    const [dateIni,setDateIni] = useState( monthIni );
    const [dateEnd,setDateEnd] = useState( monthEnd );
    const [showNoLaboralDays,setShowNoLaboralDays] = useState(false);
    
    const dispatch = useDispatch();
    const { employee } = useSelector( state => state.auth );

    const fetchData = useCallback( () => {
        dispatch(
            getMarkingsByPeriod({
                date_ini:dateIni,
                date_end:dateEnd,
                show_no_laboral_days:showNoLaboralDays,
                employee_id:employee.id
            })
        )
    },[ dispatch, dateIni, dateEnd, showNoLaboralDays, employee.id ]);

    useEffect( () =>{ fetchData()}, [ fetchData ]);
    
    /** Clear Filters */
    const onClearAll = () => {
        setDateIni(monthIni)
        setDateEnd(monthEnd)
        setShowNoLaboralDays(false)
	}
    
    return (
        <div className="
            xs:flex xs:flex-col
            md:flex-row md:justify-between md:items-center md:mt-4 md:mb-8
        ">
            <div className="
                xs:flex xs:flex-col
                md:flex-row md:justify-start md:w-9/12
                gap-5
            ">
                <div className="
                    xs:flex md:w-5/12
                    gap-6
                ">
                    <div>
                        <div className="mb-1 font-semibold text-sm">Fecha Inicial:</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg" />}
                            inputSuffix={null}
                            value={dateIni}
                            inputFormat=" DD/MM/YYYY"
                            maxDate={dateEnd}
                            onChange={(date)=>setDateIni(date)}
                        />
                    </div>
                    <div>
                        <div className="mb-1 font-semibold text-sm">Fecha Final:</div>
                        <DatePicker
                            inputPrefix={<HiOutlineCalendar className="text-lg" />}
                            inputSuffix={null}
                            value={dateEnd}
                            inputFormat=" DD/MM/YYYY"
                            minDate={dateIni}
                            onChange={(date)=>setDateEnd(date)}
                        />
                    </div>
                </div>
                <div className="
                    xs:flex xs:justify-center xs:w-full
                    md:w-7/12 md:justify-start md:mt-9
                ">
                    <Checkbox checked={showNoLaboralDays} onChange={(val)=>setShowNoLaboralDays(val)}>Mostrar días no laborales</Checkbox>
                </div>
            </div>
            <div className="
                xs:text-center xs:mt-5
            ">
                <Button className="" size="sm" onClick = {onClearAll}>
                    <TbFilterOff className="text-xl" title="Limpiar Filtros" />
                </Button>
            </div>
        </div>
    )
}

export default Filters