import React, { useRef, useEffect, useState } from 'react'
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
	const { drawer_open:drawerOpen,loading } = useSelector((state) => state.compensatories.state );

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
                {`Compensatorio`}
            </h4>
            <span>
                Llene los campos que se le solicitan en el formulario
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

    const [drawerWidth, setDrawerWidth] = useState(50);
    useEffect( () => {
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
	}, [])
    
    return (
        <>
            <DrawerTemp
                isOpen={drawerOpen}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
                closable={false}
                title={<Title />}
                footer={ <Footer onCancel={onDrawerClose} onSaveClick={formSubmit} onReset={formReset}/> }
                width={drawerWidth}
                widthPercent={true}
            >
                <Content ref={formikRef}/>
            </DrawerTemp>
        </>
	)
    
}

export default Drawer;
