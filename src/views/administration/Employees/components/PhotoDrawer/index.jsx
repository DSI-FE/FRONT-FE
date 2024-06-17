import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer as DrawerTemp } from 'components/ui'
import Content from './Content'
import { setOpenPhotoDrawer, setSelectedEmployee } from '../../store/stateSlice'
import { themeConfig } from 'configs/theme.config';
const {textThemeColor} = themeConfig;


const Drawer = () =>
{
	const formikRef = useRef();

	const dispatch = useDispatch();
	const { openPhotoDrawer } = useSelector((state) => state.employee.state );

    const onDrawerClose = () => {
        dispatch(setOpenPhotoDrawer(false))
        dispatch(setSelectedEmployee(null))
	}

    const formSubmit = () =>
	{
		formikRef.current?.submitForm();
	}

	const formReset = () =>
	{
		formikRef.current?.resetForm();
	}

    const Title = () => (
		<div>
			<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
                {`Actualizar Foto del Empleado`}
            </h4>
            <span>
                Puedes cargar una nueva foto, si el empleado ya tiene cargada una, esta se reemplazará.
            </span>
		</div>
	);
    
    const Footer = ( { onSaveClick, onCancel, onReset } ) =>
	{
		return (
			<div className="flex justify-between items-center w-full">
                <Button size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" onClick={onSaveClick}>Aceptar</Button>
			</div>
		)
	}
    
    return (
        <>
            <DrawerTemp
                isOpen={openPhotoDrawer}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
                closable={false}
                title={<Title />}
                footer={ <Footer onCancel={onDrawerClose} onSaveClick={formSubmit} onReset={formReset}/> }
                width={40}
                widthPercent={true}
            >
                <Content ref={formikRef}/>
            </DrawerTemp>
        </>
	)
    
}

export default Drawer;
