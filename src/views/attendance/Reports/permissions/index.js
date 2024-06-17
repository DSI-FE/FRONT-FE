import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Filters from './components/Filters'
// import MarkingsTable from './components/MarkingsTable';
import InfoDrawer from './components/InfoDrawer'
import EmpsTable from './components/EmpsTable'

import { injectReducer } 		from 'store/index'
import reducer 					from './store'

import { Spinner } from 'components/ui'

injectReducer('attendance', reducer);



const Asistencias = () =>
{
    const dispatch = useDispatch()
	
	const { loading, employeesList:data } = useSelector((state) => state.attendance.state)
	
	return (
		<>
			<div className='mt-5'>
				<div>
					{/* {
						loading ?
						<div className='flex justify-center items-center'>
							<Spinner size="3.25rem" />
						</div>
						: */}
						<EmpsTable data={data}/>
					{/* // } */}
					
					{/* <MarkingsTable className='mt-5'/>
					<MarkingsTable employeeSelectedId = {167} className='mt-5'/> */}
				</div>
			</div>
			<InfoDrawer/>
			
		</>
	);
}

export default Asistencias;