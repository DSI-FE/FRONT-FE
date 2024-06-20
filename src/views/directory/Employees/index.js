
import React, { useState } from 'react';
import EmployeesTable from './components/EmployeesTable';
import reducer from './store';
import { injectReducer } from 'store/index';
//import { Button } from 'react-scroll';
import Button from 'components/ui/Buttons';
import Input from 'components/ui/Input'
import Radio from 'components/ui/Radio'
import Drawer from 'components/ui/Drawer'
injectReducer('directory', reducer);


const Employees = () => {


	const [isOpen, setIsOpen] = useState(false)

	const openDrawer = () => {
		setIsOpen(true)
	}

	const onDrawerClose = () => {
		console.log('onDrawerClose')
		setIsOpen(false)
	}


	return (
		<>
			<div className='mt-5'>
				<div>

					<EmployeesTable className='mt-5' />
				</div>


				<div>
					<Button onClick={() => openDrawer()}>Open Drawer</Button>
					<Drawer
						title="Drawer Title"
						isOpen={isOpen}
						onClose={onDrawerClose}
						onRequestClose={onDrawerClose}
						closable={true}
					>



						<div>
							<div className="mb-4">
								<Input size="sm" placeholder="Input sm" />
							</div>
							<div className="mb-4">
								<Input placeholder="Input md" />
							</div>
							<div className="mb-4">
								<Input size="lg" placeholder="Input lg" />
							</div>
						</div>



					</Drawer>
				</div>

			</div>
		</>
	);
}

export default Employees;