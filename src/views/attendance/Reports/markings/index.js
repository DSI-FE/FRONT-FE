import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import InfoDrawer from './components/InfoDrawer'
import EmpsTable from './components/EmpsTable'
import { injectReducer } 		from 'store/index'
import reducer 					from './store'

injectReducer('attendance', reducer);

const Asistencias = () =>
{
	const { employeesList:data } = useSelector((state) => state.attendance.state)

	useEffect( () => {} , [data])
	return (
		<>
			<div className='mt-5'>
				<EmpsTable data={data}/>
			</div>
			<InfoDrawer/>
		</>
	);
}

export default Asistencias;