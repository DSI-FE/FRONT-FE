import React, {useState} from 'react';
import { DatePicker} from 'components/ui'
import { HiOutlineCalendar } from 'react-icons/hi'

const Filters = (props) =>
{
    const {className} = props;
    const [date] = useState(new Date());
    
    const [dateIni,setDateIni] = useState(new Date(date.getFullYear(), date.getMonth(), 1),);
    const [dateEnd,setDateEnd] = useState(new Date(date.getFullYear(), date.getMonth()+1, 0));
    
    return (
        <div className={`flex justify-start gap-6 ${className}`}>
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
    )
}

export default Filters