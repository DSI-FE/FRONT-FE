import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Select } from 'components/ui'
import { CustomSelectOption } from 'components/custom'

import SelectEmployee from '../components/SelectEmployee'
import SelectOrganizationalUnit from '../components/SelectOrganizationalUnit'

import { injectReducer } from 'store/index'

import reducer from './store'

import { setSelectedOrganizationalUnit, setSelectedEmployee, setSelectedState } from '../store/stateSlice'
import { getOrganizationalUnits, getOrganizationalUnitDirectChildrensActiveBossEmployees } from '../store/dataSlice'

import PermissionRequestsTable from './components/PermissionRequestsTable'

injectReducer('permission_requests', reducer)

const PermissionRequests = ( ) =>
{

	// Redux Selector --------------------------------------------------------------------------------------------

    const {
		employee,
		organizationalUnit
	} = useSelector( state => state.auth )

	const {
		organizational_units:organizationalUnits,
		employees
	} = useSelector( state => state.attendance_requests.data )

    const {
        selected_state:selectedState,
		selected_segment:selectedSegment,
		selected_organizational_unit:selectedOrganizationalUnit
	} = useSelector( state => state.attendance_requests.state )

	// Initial Values --------------------------------------------------------------------------------------------

	const dispatch = useDispatch()
	
	const isBoss = selectedSegment && selectedSegment[0] === '2'
    const isRRHH = selectedSegment && selectedSegment[0] === '3'

	const options = useMemo( () => [
		{ value: 0, label: 'Todos' },
		{ value: 1, label: 'Enviados' },
		{ value: 2, label: 'Aprobados por Jefe Inmediato' },
		{ value: 3, label: 'Aprobados por Talento Humano' },
		{ value: 4, label: 'Observados' },
		{ value: 5, label: 'Rechazados' }
	 ], [])

	// Subcomponents ---------------------------------------------------------------------------------------------

	const Filters = () => {
		return (
			<>
				{
					(isBoss || isRRHH) && (
					<>
						<SelectOrganizationalUnit
							className={`xs:w-full md:w-3/12`}
							isBoss={isBoss}
							isRRHH={isRRHH}
							organizationalUnits = { organizationalUnits }
							selectedOrganizationalUnit = { selectedOrganizationalUnit }
						/>
						<SelectEmployee className={` xs:w-full md:w-3/12 `} employees={employees} />
					</>)
				}
				<div className='xs:w-full md:w-3/12'>
					<div className='font-semibold mb-2'>Estado</div>
					<Select
						options = { options }
						placeholder={'Selecciona'}
						onChange={selected => {
							dispatch(setSelectedState(selected.value === 0 || selected.value === undefined ? 0 : selected.value))
						 }}
						 components = {{ Option: CustomSelectOption }}
						value = { options.find( 
							option => ( 
								( selectedState === null ||  selectedState === 0 ) && option.value === 0 ) || option.value === selectedState 
							) 
						}
						defaultValue={options.find( (option) => option.value === selectedState)}
					/>
				</div>
			</>
		)
	}
	
	// Handle Rerendering ----------------------------------------------------------------------------------------

	// useEffect( () => {}, [selectedSegment])


	useEffect( () => {

		dispatch(setSelectedState(0))

		if (isBoss || isRRHH) {
			const selectedUnitId = isBoss ? organizationalUnit.id : ( isRRHH ? 0 : organizationalUnit.id )
			dispatch(getOrganizationalUnits({ id: selectedUnitId }))
			dispatch(getOrganizationalUnitDirectChildrensActiveBossEmployees({ id: selectedUnitId }))
			dispatch(setSelectedOrganizationalUnit(selectedUnitId))
			dispatch(setSelectedEmployee(0))
		} else {
			dispatch(setSelectedOrganizationalUnit(organizationalUnit.id))
			dispatch(setSelectedEmployee(employee.id))
		}

	}, [dispatch, organizationalUnit.id, isBoss, isRRHH, employee.id, selectedSegment ])

	return(
        <PermissionRequestsTable LeftContent={ Filters } />
    )
}

export default PermissionRequests