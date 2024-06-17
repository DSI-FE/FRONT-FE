import React from 'react'
import { Dialog} from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerOpen,clearEmployee } from '../store/stateSlice'
import EmployeesInfoContent from './EmployeesInfoContent'

const EmployeesInfoDrawer = () =>
{
	const dispatch      = useDispatch()
	const drawerOpen    = useSelector((state) => state.directory.state.drawerOpen)

	const onDrawerClose = () => {
		dispatch(clearEmployee())
		dispatch(setDrawerOpen(false))
	}

	return (
		<Dialog
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			closable={false}
			width={550}
		>
			<EmployeesInfoContent />
		</Dialog>
	)
}

export default EmployeesInfoDrawer;
