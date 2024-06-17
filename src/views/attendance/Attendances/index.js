import React from 'react';
import Filters from './components/Filters'
import MarkingsTable from './components/MarkingsTable';
import { injectReducer } from 'store/index';
import reducer from './store';

injectReducer('attendance', reducer);

const Asistencias = () =>
{
	return (
		<div className='mt-5'>
			<Filters/>
			<MarkingsTable className='mt-5'/>
		</div>
	);
}

export default Asistencias;
