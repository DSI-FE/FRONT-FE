import React from 'react';
import {useSelector,useDispatch} from 'react-redux';

import { Button } from 'components/ui';

import Filters from './Filters';
import InboxTable from './InboxTable';

import {RiAddCircleFill} from 'react-icons/ri';

import { setLoading, setDrawerOpen, setDrawerTitle, setDrawerInfo, setDrawerBody } from '../store/stateSlice';
import ComDrawer from './ComDrawer';


const Inbox = (props) =>
{
    const {className} = props;
    const {loading,drawer_open,drawer_title,drawer_info,drawer_body} = useSelector( state => state.compensatories.state );

    const dispatch = useDispatch();


    const handleOpenDrawer = () =>
    {
        dispatch(setDrawerOpen(true));
        dispatch(setLoading(true));
        setTimeout( () => {
            dispatch(setDrawerTitle('Solicitar Compensatorio'));
            dispatch(setDrawerInfo('Por favor, llene el formulario, los campos con asterico rojo son obligatorios'));
            dispatch(setLoading(false));
            dispatch(setDrawerBody(1));
        },500)
    }

    return (
        <div className={`${className}`}>
            <div className='flex justify-between items-center mt-4'>
                <Filters/>
                <Button onClick={handleOpenDrawer} className='' icon={<RiAddCircleFill/>} variant="solid">Nuevo Compensatorio</Button>
            </div>
            <InboxTable/>
            <ComDrawer/>
        </div>
    );
}

export default Inbox;