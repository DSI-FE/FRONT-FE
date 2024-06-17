import React, {useRef,useCallback,useEffect, useState } from 'react'
import {  Drawer as DrawerTemplate, Button } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import DrawerContent from './DrawerContent'
import {
	setLoading,
	setDrawerOpen,
	setDrawerTitle,
	setDrawerInfo,
	getPermissionTypesIndexActive,
	setSubmitType,
	setSelectedPermissionType,
	setSelectedPermission,
	setSelectedDate,
	setDateInputReadOnly
} from '../store/stateSlice'

const Drawer = ({isBoss,isRRHH}) =>
{
	const formikRef = useRef()
	const dispatch = useDispatch()

	const {
		loading,
		drawer_open:drawerOpen,
		drawer_title:drawerTitle,
		drawer_info:drawerInfo,
		drawer_body:drawerBody,
	} = useSelector((state) => state.permissions.state)
	
	const Title = () =>(
		<div>
			<h5 className="mb-2 flex justify-start items-center gap-2 text-slate-600">{drawerTitle}</h5>
			<p>{drawerInfo}</p>
		</div>
	)

	const Footer = ( { onCancel, onSaveClick, onApproveClick, onModifyClick, onDenyClick } ) => {
		if ( drawerBody === 1 ) {
			return (
				<div className="flex justify-between items-center w-full">
					<Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
					<Button disabled={loading} loading={loading} size="sm" variant="solid" onClick={onSaveClick}>Aceptar</Button>
				</div>
			)
		} else if (drawerBody === 2 ) {
			return (
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center w-2/12">
						<Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
					</div>
					<div className="flex justify-between items-center w-5/12">
						<Button color="emerald-500" loading={loading} size="sm" variant="solid" onClick={onApproveClick}>Aprobar</Button>
						<Button color="orange-500" loading={loading} size="sm" variant="solid" onClick={onModifyClick}>Observar</Button>
						<Button color="red-600" loading={loading} size="sm" variant="solid" onClick={onDenyClick}>Rechazar</Button>
					</div>
				</div>
			)
		}
	}


	const onDrawerClose = () => {
		dispatch(setDrawerOpen(false))
		dispatch(setDrawerTitle(''))
		dispatch(setDrawerInfo(''))
		dispatch(setSelectedPermissionType(''))
		dispatch(setSelectedPermission(null))
		dispatch(setSelectedDate(null))
		dispatch(setDateInputReadOnly(false))
	}
	
	const formSubmit = () => {
		dispatch(setLoading(true))
		dispatch(setSubmitType(1))
		setTimeout( () => {
			formikRef.current?.submitForm()
        }, 500)
	}
	const obsSubmit = () => {
		dispatch(setSubmitType(2))
		setTimeout( () => {
			formikRef.current?.submitForm()
        }, 500)
	}
	const denySubmit = () => {
		dispatch(setSubmitType(3))
		setTimeout( () => {
			formikRef.current?.submitForm()
        }, 500)
	}

	const fetchData = useCallback( () => {
        dispatch(getPermissionTypesIndexActive())
	}, [ dispatch ])

	const [drawerWidth, setDrawerWidth] = useState(50);
    useEffect( () => {
		fetchData()
		const handleResize = () => {
			const screenWidth = window.innerWidth;
			if (screenWidth < 640) {
				setDrawerWidth(100)
			} else if (screenWidth >= 640 && screenWidth < 768) {
			  setDrawerWidth(100);
			} else if (screenWidth >= 768 && screenWidth < 1024) {
			  setDrawerWidth(50);
			} else if (screenWidth >= 1024 && screenWidth < 1280) {
			  setDrawerWidth(50);
			} else if (screenWidth >= 1280 && screenWidth < 1536) {
			  setDrawerWidth(50);
			} else {
			  setDrawerWidth(50);
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [ fetchData ])

	return (
		<DrawerTemplate
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			onRequestClose={onDrawerClose}
			closable={false}
			bodyClass="p-0"
			title={ <Title/> }
			footer={ <Footer onCancel={onDrawerClose} onSaveClick={formSubmit} onApproveClick={formSubmit} onModifyClick={obsSubmit} onDenyClick={denySubmit}/> }
			widthPercent={ true }
			width={ drawerWidth }
			className={`w-full`}
		>
			<DrawerContent isBoss= {isBoss} isRRHH={isRRHH} drawerBody={drawerBody} ref={formikRef}/>
		</DrawerTemplate>
	)
}

export default Drawer
