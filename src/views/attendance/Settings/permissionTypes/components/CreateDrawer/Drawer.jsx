import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer as DrawerTemp } from 'components/ui'
import Content from './Content'
import { setDrawerOpen, setSelectedEntry, setLoading } from '../../store/stateSlice'
import { themeConfig } from 'configs/theme.config';
const {textThemeColor} = themeConfig;


const Drawer = () =>
{
	const formikRef = useRef();

	const dispatch = useDispatch();
	const { drawer_open:drawerOpen,loading } = useSelector((state) => state.settingsPermissionTypes.state );

    const onDrawerClose = () => {
        dispatch(setDrawerOpen(false))
        dispatch(setSelectedEntry(null))
        dispatch(setLoading(false))
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
                {`Crear Entrada`}
            </h4>
            <span>
                Llene los campos que se muestran en el formulario
            </span>
		</div>
	);
    
    const Footer = ( { onSaveClick, onCancel, onReset } ) =>
	{
		return (
			<div className="flex justify-between items-center w-full">
                <Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                <Button loading={loading} size="sm" variant="solid" onClick={onSaveClick}>Aceptar</Button>
			</div>
		)
	}
    
    return (
        <>
            <DrawerTemp
                isOpen={drawerOpen}
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
