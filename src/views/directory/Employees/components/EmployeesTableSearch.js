import React, { forwardRef } 		from 'react';
import { useDispatch, useSelector }	from 'react-redux';
import { Input } 					from 'components/ui';
import { HiOutlineSearch } 			from 'react-icons/hi';
import debounce 					from 'lodash/debounce';
import cloneDeep 										from 'lodash/cloneDeep';
import { getEmployees, setTableData } 	from '../store/dataSlice';

const EmployeesTableSearch = forwardRef( (props, ref) =>
{
	const { className } = props;

	const dispatch 	= useDispatch();
	const tableData = useSelector((state) => state.directory.data.tableData);

	const fetchData = data =>
	{
		dispatch(setTableData(data))
		dispatch(getEmployees(data))
	}

	const handleInputChanges = (val) => {
		const newTableData = cloneDeep(tableData)
		newTableData.search = val
		newTableData.page = 1
		if(typeof val === 'string' && val.length > 1) {
			fetchData(newTableData)
		}

		if(typeof val === 'string' && val.length === 0)
		{
			fetchData(newTableData)
		}
	}
	

	const debounceFn = debounce(handleDebounceFn, 500);

	function handleDebounceFn(val)
    {
		handleInputChanges?.(val);
	}

	const handleInputChange = (e) =>
    {
		debounceFn(e.target.value);
	}

	return (
		<div className={`${className}`} >
			<Input
				ref={ref}
				className={`max-w-md md:w-52`}
				size="sm"
				placeholder="Buscar Empleado" 
				prefix={<HiOutlineSearch className="text-lg" />} 
				onChange={handleInputChange}
			/>
		</div>
	)
})

export default EmployeesTableSearch;