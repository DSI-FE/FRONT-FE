import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from 'components/ui';
import {RxCounterClockwiseClock} from 'react-icons/rx';
import {MdOutlinePunchClock,MdCalculate,MdFileUpload} from 'react-icons/md';

import { injectReducer } from 'store/index';

import reducer from './store';
import { setDialogSyncOpen,setDataDrawerOpen,setDataDrawerTitle,setDataDrawerInfo,setLoading,setDataDrawerBody } from './store/stateSlice';
import DialogSync from './components/DialogSync';
import DrawerMarking from './components/DrawerMarking';

injectReducer('attendanceStt', reducer);

const Markings = ({className}) => {
    
    const dispatch = useDispatch()
    
    const handleOpenSetData = () =>
    {
        dispatch(setDataDrawerOpen(true));
        dispatch(setLoading(true));
        setTimeout( () => {
            dispatch(setDataDrawerTitle('Clasificar Marcaciones'));
            dispatch(setDataDrawerInfo('Se clasifican las marcaciones como entrada o salida, además de asignar los respectivos tiempos no laborados. No se calculan descuentos en este proceso'));
            dispatch(setLoading(false));
            dispatch(setDataDrawerBody(1));
        },500)
    }

    const handleOpenUpload = () =>
    {
        dispatch(setDataDrawerOpen(true));
        dispatch(setLoading(true));
        setTimeout( () => {
            dispatch(setDataDrawerTitle('Cargar Marcaciones desde Archivo'));
            dispatch(setDataDrawerInfo('Cargue los archivos obtenidos desde los dispositivos de marcación.'));
            dispatch(setLoading(false));
            dispatch(setDataDrawerBody(3));
        },500)
    }

    const handleOpenSetDiscount = () =>
    {
        dispatch(setDataDrawerOpen(true));
        dispatch(setLoading(true));
        setTimeout( () => {
            dispatch(setDataDrawerTitle('Calcular Descuentos'));
            dispatch(setDataDrawerInfo('Se toman en cuenta las marcaciones del periodo seleccionado y se realizan los descuentos correspondientes, tomando en cuenta los permisos ingresados por los empleados'));
            dispatch(setLoading(false));
            dispatch(setDataDrawerBody(2));
        },500)
    }

    return (
        <>
            <div className={`${className}`}>
                <h4>Marcaciones y Descuentos</h4>
                <div className='mt-3 mb-5'>
                    <p className='mb-2'>
                        En esta sección, se muestran los procesos necesarios para el cálculo de descuentos.
                        Puedes acceder a los procesos para la sincronización de marcaciones, clasificación de marcaciones y cálculo de descuentos
                    </p>
                </div>
                <div className='flex justify-between'>
                    <div className={`flex flex-col justify-between gap-5`}>
                        <Button onClick={() => dispatch(setDialogSyncOpen(true))} className='flex justify-start' icon={<RxCounterClockwiseClock/>} variant="solid">Obtener marcaciones desde dispositivo</Button>
                        <Button onClick={handleOpenUpload} className='flex justify-start' icon={<MdFileUpload/>} variant="solid">Cargar marcaciones desde archivo</Button>
                        <Button onClick={handleOpenSetData} className='flex justify-start' icon={<MdOutlinePunchClock/>} variant="solid">Clasificar marcaciones</Button>
                        <Button onClick={handleOpenSetDiscount} className='flex justify-start' icon={<MdCalculate/>} variant="solid">Calcular descuento</Button>
                    </div>
                </div>
            </div>
            <DialogSync/>
            <DrawerMarking/>
        </>

        
        
	);
}

export default Markings;