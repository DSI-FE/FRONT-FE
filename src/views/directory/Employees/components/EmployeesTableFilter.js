import React 							from 'react';
import { useDispatch, useSelector }		from 'react-redux';

import cloneDeep 						from 'lodash/cloneDeep';
import { Select } 						from 'components/ui';
import { HiCheck }						from 'react-icons/hi';

import { setTableData,setOrganizationalUnitId } 	from '../store/dataSlice';

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
	);
}

const EmployeesTableFilter = ({ className }) =>
{
	const dispatch = useDispatch();

	const tableData = useSelector((state) => state.directory.data.tableData);
	const organizationalUnitId = useSelector((state) => state.directory.data.organizationalUnitId);
	const organizationalUnitsList = useSelector((state) => state.directory.data.organizationalUnitsList);

	const handleFilterChange = (selected) => {
		const newTableData = cloneDeep(tableData)
		newTableData.page = 1
		dispatch( setTableData(newTableData) );
		dispatch( setOrganizationalUnitId( selected.value  ));
	}

	const options = [ { value: '', label: 'Todas las Unidades Organizacionales' }, ];
	organizationalUnitsList.forEach( organizationalUnit =>	{ options.push({ value:organizationalUnit.id, label:organizationalUnit.name }) });

	return (
		<div className={`${className}`}>
			<Select 
				options = { options }
				size = "sm"
				onChange = { handleFilterChange }
				components = {{ Option: CustomSelectOption }}
				value = { options.filter(option => option.value === organizationalUnitId) }
			/>
		</div>
	);
}

export default EmployeesTableFilter;