import React, { useState } from "react";
import { setOpenUnsubscribeEmployeeDrawer, setUnsubscribedEmployee } from "../store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, DatePicker, Drawer, Input, Spinner } from "components/ui";
import OpenNotification from "views/attendance/RemoteMark/OpenNotification";
import { ImSpinner9 } from "react-icons/im";
import BaseService from "services/BaseService";
import moment from "moment";

const UnsubscribeUserDrawer = () => {
    const dispatch = useDispatch();

    const drawerOpen = useSelector((state) => state.employee.state.openUnsubscribeUserDrawer);
    const loadingSelectedEmployee = useSelector((state) => state.employee.state.loading);
    const selectedEmployee = useSelector((state) => state.employee.state.selectedEmployee);

    const [sending, setSending] = useState(false);
    const [endDate, setEndDate] = useState(null);
    const [justification, setJustification] = useState(null);

    const title = (
        <div>
            <h5 className="flex items-center justify-start gap-2 mb-2 text-slate 600">Solicitud de Baja de Colaborador</h5>
        </div>
    );

    const onCancel = () => {
        onDrawerClose();
    }

    const Footer = ({onCancel, onSave}) => {
        return (
            <div className="flex items-center justify-between w-full">
                <Button size="sm" variant="solid" loading={sending} color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" loading={sending} onClick={onSave} disabled={!justification || !Boolean(endDate)}>Guardar</Button>
            </div>
        )
    }

    const handleJustificationChange = (event) => {
        const value = (event.target.value);
        setJustification(value);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event);
    }

    const onDrawerClose = () => {
        setEndDate(null);
        setJustification(null);
        dispatch(setOpenUnsubscribeEmployeeDrawer(false));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const formData = {
                employee_id: selectedEmployee.id,
                end_date: moment(endDate).format('YYYY-MM-DD'),
                unsubscribe_justification: justification,
            };
            const response = await BaseService.post('/administration/employees-unsubscribe/' + selectedEmployee.id, formData);
            if (response.status === 200) {
                OpenNotification('success', 'Éxito!', 'Se ha enviado la solicitud de baja de usuario.', 'top-start', 3500);
                dispatch(setUnsubscribedEmployee(true));
                onDrawerClose();
            }
            setSending(false);
        } catch (error) {
            console.log('errorSending', error);
            setSending(false);
            dispatch(setOpenUnsubscribeEmployeeDrawer(true));
            OpenNotification('danger', 'Error!', error?.response?.data?.message, 'top-start', 3500);
        }
    }

    return (
        <Drawer
            isOpen={drawerOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            closable={true}
            title={title}
            footer={<Footer onCancel={onCancel} onSave={handleSubmit}></Footer>}
            width={500}
            lockScroll={true}
        >
            { loadingSelectedEmployee ? (
                <div className="flex items-center justify-center h-40">
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 mb-4">
                        <div className="col-span-3">
                            <div>Colaborador:</div>
                            <div><i>{selectedEmployee?.name + ' ' + selectedEmployee?.lastname}</i></div>
                        </div>
                        <div className="flex justify-end">
                            <Avatar src={selectedEmployee?.photo_route_sm} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="required">Fecha de Aplicaci&oacute;n de Baja:</div>
                        <DatePicker
                            id='end_date'
                            name='end_date'
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div className="required">Justificaci&oacute;n:</div>
                    <Input
                        id='unsubscribe_justification'
                        name='unsubscribe_justification'
                        value={justification}
                        onChange={handleJustificationChange}
                        textArea
                    />
                </form>
            ) }
        </Drawer>
    );
}

export default UnsubscribeUserDrawer;