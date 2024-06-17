import React, { useEffect, useState } from "react";
import { setOpenAddUserDrawer, setUpdateEmployee } from "../store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button, Card, Checkbox, Avatar, Spinner, Input } from "components/ui";
import { ImSpinner9 } from "react-icons/im";
import BaseService from "services/BaseService";
import OpenNotification from "views/attendance/RemoteMark/OpenNotification";

const AddUserDrawer = () => {
    const dispatch = useDispatch();

    const drawerAddUserOpen = useSelector((state) => state.employee.state.openAddUserDrawer);
    const employeeInfo = useSelector((state) => state.employee.state.selectedEmployee);

    const [requestInfo, setRequestInfo] = useState(null);
    const [formData, setFormData] = useState({});
    const [sending, setSending] = useState(false);
 
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const gettingRequestData = await BaseService.get('/administration/employee-requests/' + employeeInfo?.id);
                setRequestInfo(gettingRequestData.data);
            
                if (gettingRequestData.data) {
                    const initialFormData = gettingRequestData.data.employee_request_type_elements.reduce((acc, element) => {
                    if (element.pivot.value_boolean === 1 && element.pivot.value_string === 1) {
                        return {
                            ...acc,
                            [element.pivot.field_name]: null
                        };
                    }
                    return acc;
                    }, {});
                    setFormData(initialFormData);
                }
            } catch (error) {
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
            }
        };          
    
        if (employeeInfo && drawerAddUserOpen) {
            fetchRequest();
        }
    }, [employeeInfo,drawerAddUserOpen]);    

    const title = (
        <div>
            <h5 className="flex justify-start gap-2 mb-2 item-center text-slate-600">Agregar Usuario a Colaborador</h5>
        </div>
    );

    const Footer = ({onCancel, onSave}) => {
        return (
            <div className="flex items-center justify-between w-full">
                <Button size="sm" variant="solid" loading={sending} color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" loading={sending} onClick={onSave} disabled={false}>Guardar</Button>
            </div>
        )
    }

    const onCancel = () => {
        onDrawerClose();
    }

    const onDrawerClose = () => {
        dispatch(setOpenAddUserDrawer(false));
        setRequestInfo(null);
        setFormData({});
    }

    const handleInputChange = (event, fieldName) => {
        const {value} = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        try {
            const finalFormData = {
                ...formData,
                employee_id: requestInfo?.employee_id_affected,
                request_id: requestInfo?.id,
            }
            const response = await BaseService.put('/administration/employees/' + requestInfo?.employee_id_affected, finalFormData);
            if (response.status === 200) {
                onDrawerClose();
                dispatch(setUpdateEmployee(true));
                OpenNotification('success', 'Colaborador actualizado!', 'La información del colaborador ha sido actualizada.', 'top-start', 3500);

            }
            setSending(false);
        } catch (error) {
            console.log('error', error);
            setSending(false);
            dispatch(setUpdateEmployee(false));
            OpenNotification('danger', 'Error!', error?.response?.data?.message, 'top-start', 5000);
        }
    }

    return (
        <Drawer
            isOpen={drawerAddUserOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            closable={false}
            title={title}
            footer={<Footer onCancel={onCancel} onSave={handleSubmit}></Footer>}
            width={500}
            lockScroll={true}
        >
            {employeeInfo && requestInfo ? (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2">
                        <div>Colaborador:<br/><i>{employeeInfo?.name + ' ' + employeeInfo?.lastname}</i></div>
                        <div className="flex justify-end">
                            <Avatar src={employeeInfo?.photo_route_sm} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Requisitos:</label>
                        <Card>
                            {requestInfo.employee_request_type_elements.map((element, idx) => (
                                <div key={idx} className={element?.pivot?.value_string ? 'grid grid-cols-2 mb-4' : 'grid grid-cols-1 mb-4'}>
                                    <Checkbox key={idx} checked={element?.pivot?.value_boolean}>{element?.name}</Checkbox>
                                    {element?.pivot?.value_boolean && element?.pivot?.value_string ? <Input id={element?.pivot?.field_name} size="sm" onChange={(event) => {handleInputChange(event, element?.pivot?.field_name)}} /> : ''}
                                </div>
                            ))}
                        </Card>
                    </div>
                </form>
            ) : (
                <div className="flex items-center justify-center h-40">
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            )}
        </Drawer>
    );
}

export default AddUserDrawer;