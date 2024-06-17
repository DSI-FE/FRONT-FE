import React, { forwardRef } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import classNames from 'classnames'
import { Avatar,Button } from 'components/ui'
import { Spinner } from 'components/ui'

import { HiOutlineUser,HiMail,HiPhone} from 'react-icons/hi'
import { BsFillDiagram2Fill } from 'react-icons/bs'
import useThemeClass from 'utils/hooks/useThemeClass'

import { setDrawerOpen,clearEmployee } from '../store/stateSlice'


const EmployeesInfoContent = forwardRef( (props, ref) => {

	const { textSecTheme } = useThemeClass()

	const { employee, loading } = useSelector((state) => state.directory.state)
	const ava = employee.photo ? employee.photo : '/img/avatars/nopic.jpg'
	const dispatch = useDispatch()

	const onDrawerClose = () => {
		dispatch(clearEmployee())
		dispatch(setDrawerOpen(false))
	}

	let Content
    
    if (loading) {
        Content = () => {
            return (
                <div className='flex justify-center items-center w-full h-full'>
                    <Spinner size="3.25rem" />
                </div>
            )
        }
    } else {
        Content = () => (
			<div>
				<h6 className={`${textSecTheme} text-right font-bold mb-3 w-full border-b pb-2`}>
					{`${employee.name?employee.name:'-'} ${employee.lastname?employee.lastname:'-'}`}
				</h6>
				<div className={classNames(`flex justify-start items-center gap-5`)}>
					
					<Avatar size={150} src={ava} shape="rounded" icon={<HiOutlineUser />} />
					
					<div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>
						
						<div className={`flex justify-start items-start gap-2 w-full font-semibold text-buke-500`}>
							<div className='w-1/12'>
								<HiOutlineUser className="text-lg" />
							</div>
							<div className='w-10/12'>
								<span>{`${employee?.functional_position?employee.functional_position:'-'}`}</span>
							</div>
						</div>

						<div className={`flex justify-start items-start gap-2 w-full`}>
							<div className='w-1/12'>
								<BsFillDiagram2Fill className="text-lg" />
							</div>
							<div className='w-10/12'>
								<span>{`${employee?.organizational_unit?employee.organizational_unit:'-'}`}</span>
							</div>
						</div>

						<div className={`flex justify-start items-start gap-2 w-full`}>
							<div className='w-1/12'>
								<HiMail className="text-lg" />
							</div>
							<div className='w-10/12'>
								<a href={`mailto:${employee?.email?employee.email:'-'}`}>
									<span>{`${employee?.email?employee.email:'-'}`}</span>
								</a>
							</div>
						</div>

						<div className={`flex justify-start items-start gap-2 w-full`}>
							<div className='w-1/12'>
								<HiPhone className="text-lg" />
							</div>
							<div className='w-10/12'>
								<span>{`${employee?.phone?employee.phone:'-'}`}</span>
							</div>
						</div>
						
					</div>
				</div>
				<div className="text-right w-full">
					<Button size="sm" className="mr-2" variant="solid" onClick={onDrawerClose}>Salir</Button>
				</div>
			</div>
		)
	}

	return <Content/>
})

export default EmployeesInfoContent
