import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';

import { getEmployees, setTableData, setOrganizationalUnitId } 	from '../store/dataSlice';

import { Button } from 'components/ui';
import { TbFilterOff } from 'react-icons/tb';
import EmployeesTableSearch from './EmployeesTableSearch';
import EmployeesTableFilter from './EmployeesTableFilter';

const EmployeesTableTools = ({className}) =>
{
	const dispatch 	= useDispatch();
	const inputRef 	= useRef();
	const tableData	= useSelector((state) => state.directory.data.tableData);

	const fetchData = data =>
	{
		dispatch(setTableData(data));
		dispatch(getEmployees(data));
	}

	const onClearAll = () =>
	{
		const newTableData 		= cloneDeep(tableData);

		newTableData.search 	= '';
		inputRef.current.value 	= '';

		dispatch( setOrganizationalUnitId( '' ));
		fetchData( newTableData );
	}

	return (
		<div className={`flex items-center justify-end gap-5 ${className}`}>
				<EmployeesTableSearch className={`flex items-center justify-end w-4/12`} ref = { inputRef } />
				<EmployeesTableFilter className={`w-4/12`} />
				<Button className="" size="sm" onClick = {onClearAll} title="Limpiar Filtros">
					<TbFilterOff className="text-xl" />
				</Button>
		</div>
	)
}

export default EmployeesTableTools