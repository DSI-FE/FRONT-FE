import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Select } from 'components/ui'
import { CustomSelectOption } from 'components/custom'
import { setSelectedEmployee } from '../store/stateSlice'

const SelectEmployee = ({ className }) =>
{
   
   const dispatch = useDispatch()
   
   const { loading, employees } = useSelector( state => state.attendance_requests.data )
   const { selected_employee:selectedEmployee } = useSelector( state => state.attendance_requests.state )
   
   const options = useMemo( () => {
      const newOptions = [{ value: 0, label: 'Todos' }]
      employees?.forEach( per => { newOptions.push( { value: per.id, label: per.name+' '+per.lastname } ) })
      return newOptions
   }, [ employees ])

   return (
      <div className={className}>
         <div className='font-semibold mb-2'>Colaborador</div>
         {
            loading ? <p>Loading...</p> : (
               <Select
                  options={options}
                  placeholder={'Selecciona'}
                  onChange={ selected => {
                     dispatch( setSelectedEmployee( !selected.value ? 0 : selected.value ) )
                  }}
                  components={{ Option: CustomSelectOption }}
                  value={ options.find( option => ( selectedEmployee === null && option.value === 0 ) || option.value === selectedEmployee ) }
                  defaultValue={ options.find( option => option.value === selectedEmployee ) }
               />
            )
         }
         </div>
   )
     
}

export default SelectEmployee
