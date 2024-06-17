import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Select } from 'components/ui'
import { CustomSelectOption } from 'components/custom'
import { setSelectedOrganizationalUnit, setSelectedEmployee, setSelectedState } from '../store/stateSlice'
import { getOrganizationalUnitDirectChildrensActiveBossEmployees, getOrganizationalUnitChildrensActiveEmployees } from '../store/dataSlice'

const SelectOrganizationalUnit = ({ className, isBoss=false, organizationalUnits, selectedOrganizationalUnit }) =>
{
   const dispatch = useDispatch()

   const { organizationalUnit } = useSelector( state => state.auth )
   const { loading } = useSelector( state => state.attendance_requests.data )
   
   const options = useMemo( () => {
      const newOptions = [{ value: 0, label: 'Todas' }]
      organizationalUnits?.forEach( per => { newOptions.push( { value: per.id, label: per.name } ) })
      return newOptions
   }, [ organizationalUnits ])
   
   return (
      <div className={className}>
         <div className='font-semibold mb-2'>Unidad Organizacional</div>
         {
            loading ? <p>Loading...</p> : (
               <Select
                  options={options}
                  placeholder={'Selecciona'}
                  onChange={ selected => {
                     dispatch( setSelectedOrganizationalUnit( !selected.value ? 0 : selected.value ) )
                     dispatch( setSelectedEmployee(0) )
                     dispatch( setSelectedState(0) )
                     
                     if( !isBoss ) {
                        dispatch( getOrganizationalUnitDirectChildrensActiveBossEmployees( {id:(!selected.value ? 0 : selected.value)} ) )
                     } else {
                        if(selected.value === 0){
                           dispatch( getOrganizationalUnitChildrensActiveEmployees( { id:organizationalUnit.id }) )
                        } else {
                           dispatch( getOrganizationalUnitDirectChildrensActiveBossEmployees( {id:(!selected.value ? 0 : selected.value)} ) )
                        }
                     }
                  }}
                  components={{ Option: CustomSelectOption }}
                  value={
                     selectedOrganizationalUnit !== null
                        ? options.find(option => option.value === selectedOrganizationalUnit)
                        : options.find(option => option.value === 0)
                  }
               />
            )
         }
         </div>
   )
     
}

export default SelectOrganizationalUnit
