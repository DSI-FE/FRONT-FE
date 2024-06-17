import React, {useRef} from 'react';
import { Button, Drawer, Spinner} from 'components/ui';
import { useDispatch, useSelector } from 'react-redux';
import ComDrawerContent from './ComDrawerContent';
import {
	setDrawerOpen,
	setDrawerTitle,
	setDrawerInfo,
} from '../store/stateSlice';

const ComDrawer = props =>
{
	const formikRef = useRef();
	const dispatch = useDispatch();

	const {
		loading,
		drawer_open:drawerOpen,
		drawer_title:drawerTitle,
		drawer_info:drawerInfo,
		drawer_body:drawerBody
	} = useSelector((state) => state.compensatories.state);
	
	const Title = () =>(
		<div>
			<h5 className="mb-2 flex justify-start items-center gap-2 text-slate-600">{drawerTitle}</h5>
			<p>{drawerInfo}</p>
		</div>
	)
	

	const Footer = ( { onSaveClick, onCancel, onReset } ) => {
		return (
			<div className="flex justify-between items-center w-full">
					<Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
					<Button loading={loading} size="sm" variant="solid" onClick={onSaveClick}>Aceptar</Button>
			</div>
		)
	}

	const Content = () => {
		if (loading) {
			return (
				<div className='flex justify-center items-center w-full h-full'>
					<Spinner size="3.25rem" />
				</div>
			)
		} else {

			return <ComDrawerContent ref={formikRef}/>
		}
	}

	const onDrawerClose = () => {
		dispatch(setDrawerOpen(false))
		dispatch(setDrawerTitle(''))
		dispatch(setDrawerInfo(''))
	}
	
	const formSubmit = () => {
		formikRef.current?.submitForm();
	}

	const formReset = () =>	{
		formikRef.current?.resetForm();
	}

	return (
		<Drawer
			isOpen={drawerOpen}
			onClose={onDrawerClose}
			onRequestClose={onDrawerClose}
			closable={false}
			bodyClass="p-0"
			title={<Title/>}
			footer={ <Footer onCancel={onDrawerClose} onSaveClick={formSubmit} onReset={formReset}/> }
			width={500}
		>
			<Content/>
		</Drawer>
	)
}

export default ComDrawer;
