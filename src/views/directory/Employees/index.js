import React 					from 'react';

import EmployeesTable 			from './components/EmployeesTable';

import reducer 					from './store';
import { injectReducer } 		from 'store/index';


injectReducer('directory', reducer);


const Employees = () =>
{

	return (
		<>
			<div className='mt-5'>
				<div>
					<EmployeesTable className='mt-5'/>
				</div>
			</div>
		</>
	);
}

export default Employees;