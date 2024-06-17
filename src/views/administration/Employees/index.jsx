import React, { useEffect } from "react";
import BasePage from "components/template/BasePage";
import BaseDataTable from "./components/BaseDataTable";
import { Avatar, Badge, Button } from "components/ui";
import { CgAdd } from "react-icons/cg";
import {
    FaUserCheck,
    FaUserEdit,
    FaUserTimes,
} from "react-icons/fa";
import { BsPersonPlus } from 'react-icons/bs';
import { injectReducer } from "store/index";
import reducer from "./store";
import { TextSlicer } from "helpers";
import { setOpenPhotoDrawer,setOpenDrawerAddEmployee, setNewEmployee, setUpdateEmployee, setOpenAddUserDrawer, setSelectedEmployee, setOpenUnsubscribeEmployeeDrawer, setUnsubscribedEmployee, setOpenDrawerUpdateEmployee } from "./store/stateSlice";
import NewEmployeeDrawer from "./components/NewEmployeeDrawer";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "./components/BaseDataTable/store/dataSlice";
// import OpenNotification from "../PaymentVouchers/components/OpenNotification";
import AddUserDrawer from "./components/AddUserDrawer";
import UnsubscribeUserDrawer from "./components/UnsubscribeUserDrawer";
import { object } from "yup";
import UpdateEmployeeDrawer from "./components/UpdateEmployeeDrawer";
import PhotoDrawer from './components/PhotoDrawer'

injectReducer('employee', reducer);

const Employees = () => {
    const dispatch = useDispatch();

    const {employee:loggedEmployee} = useSelector((state) => state.auth);
    const tableData = useSelector((state) => state.dataEmployees.data.tableData);
    const actualEmployee = useSelector((state) => state.employee.state.selectedEmployee);
    const newEmployee = useSelector((state) => state.employee.state.newEmployee);
    const updateEmployee = useSelector((state) => state.employee.state.updateEmployee);
    const unsubscribedEmployee = useSelector((state) => state.employee.state.unsubscribedEmployee);

    const esJuan = loggedEmployee.id === 78
    const esAzu = loggedEmployee.id === 2 || loggedEmployee.id === 34 || loggedEmployee.id === 174 || loggedEmployee.id === 167

    const handleAddUser = (employee) => {
        //if (employee.id !== actualEmployee?.id) {
            dispatch(setSelectedEmployee(employee.id));
        //};
        dispatch(setOpenAddUserDrawer(true));
    }

    const handleEditUser = (employee) => {
        dispatch(setOpenDrawerUpdateEmployee(true));
        //if (employee.id !== actualEmployee?.id) {
            dispatch(setSelectedEmployee(employee.id));
        //}
    }

    const handleEditPhotoUser = (employee) => {
        dispatch(setOpenPhotoDrawer(true))
        dispatch(setSelectedEmployee(employee.id));
    }

    const handleUnsubscribeEmployee = (employee) => {
        if (employee.id !== actualEmployee?.id) {
            dispatch(setSelectedEmployee(employee.id));
        };
        dispatch(setOpenUnsubscribeEmployeeDrawer(true));
    }

    const handleNewEmployee = () => {
        dispatch(setOpenDrawerAddEmployee(true));
    }

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
            sortable: true,
            cell: props => {
                const photo = props?.row?.original?.photo_route_sm;
                return (
                    <div className="grid grid-cols-3" style={{ width:'100%' }}>
                        <div className="flex items-center justify-center col-span-1 md:justify-start md:items-start hover:cursor-pointer" style={{ width:'100%' }}>
                            <Avatar onClick={() => { handleEditPhotoUser(props?.row?.original) }} src={photo} />
                        </div>
                        <div className="flex flex-col col-span-2 md:ml-4">
                            <div>{TextSlicer(props?.row?.original?.name)}</div>
                            <div>{TextSlicer(props?.row?.original?.lastname)}</div>
                        </div>
                    </div>
                );
            },
            headerClassName: 'text-center',
            cellClassName: 'w-4/12',
        },
        {
            header: 'Unidad',
            sortable: false,
            cell: props => TextSlicer(props?.row?.original?.functional_positions[0]?.unit_name),
            headerClassName: 'text-center',
            cellClassName: 'w-2/10',
        },
        {
            header: 'Cargo',
            sortable: false,
            cell: props => TextSlicer(props?.row?.original?.functional_positions[0]?.name),
            headerClassName: 'text-center',
            cellClassName: 'w-2/10',
        },
        /*{
            header: 'Teléfono',
            sortable: false,
            cell: props => props?.row?.original?.phone,
            headerClassName: 'text-center',
            cellClassName: 'w-1/10',
        },
        {
            header: 'Correo electrónico',
            sortable: false,
            cell: props => props?.row?.original?.email,
            headerClassName: 'text-center',
            cellClassName: 'w-2/10',
        },*/
        {
            header: 'Opciones',
            sortable: false,
            cell: props => {
                const requestResume = props?.row?.original?.request_resume || null;

                const hasUserRequestIncomplete = requestResume.filter(obj => obj.adm_request_type_id === 1 && obj.status === 1) || [];
                const hasUserRequestComplete = requestResume.filter(obj => obj.adm_request_type_id === 1 && obj.status === 2) || [];
                const hasUnsubscribeRequestIncomplete = requestResume.filter(obj => obj.adm_request_type_id === 2 && obj.status === 1) || [];
                const hasUnsubscribeRequestComplete = requestResume.filter(obj => obj.adm_request_type_id === 2 && obj.status === 2) || [];

                return (
                    <div className="flex flex-row gap-1">
                        { (hasUserRequestIncomplete.length > 0 && hasUserRequestComplete.length === 0 && hasUnsubscribeRequestComplete.length === 0) && esJuan && hasUnsubscribeRequestIncomplete.length === 0 && <div><Button className="hover:animate-bounce" color="sky-500" variant="solid" onClick={() => {handleAddUser(props?.row?.original)}} icon={<BsPersonPlus />} size="xs"></Button></div> }
                        {/* { (hasUserRequestComplete.length > 0 || props?.row?.original.user_id)  && <div><Button color="green-500" variant="twoTone" icon={<FaUserCheck />} size="xs" onClick={() => {OpenNotification('success', 'Empleado', 'Empleado y usuario creados', 'top-start', 3500)}} /></div> } */}
                        { (hasUnsubscribeRequestComplete.length === 0 && hasUnsubscribeRequestIncomplete.length === 0) && !esJuan && <div><Button className="hover:animate-bounce" color="orange-500" variant="twoTone" onClick={() => {handleEditUser(props?.row?.original)}} icon={<FaUserEdit />} size="xs"></Button></div>}
                        { (hasUnsubscribeRequestComplete.length === 0 && hasUnsubscribeRequestIncomplete.length > 0) && !esJuan && <div className="hover:animate-bounce"><Badge className="mr-5" content={hasUnsubscribeRequestIncomplete[0].total}><Button color="red-500" variant="twoTone" onClick={() => {handleUnsubscribeEmployee(props?.row?.original)}} icon={<FaUserTimes />} size="xs"></Button></Badge></div> }
                        { (hasUnsubscribeRequestComplete.length === 0 && hasUnsubscribeRequestIncomplete.length === 0) && !esJuan && <div><Button className="hover:animate-bounce" color="red-500" variant="twoTone" onClick={() => {handleUnsubscribeEmployee(props?.row?.original)}} icon={<FaUserTimes />} size="xs"></Button></div> }
                    </div>
                );
            },
            headerClassName: '',
            cellClassName: 'w-1/10 grid justify-center'
        }
    ];

    useEffect(() => {
        if (newEmployee || updateEmployee || unsubscribedEmployee) {
            //dispatch(getData( {reqParams : {  page:tableData.page, perPage:tableData.perPage, sort:tableData.sort, search:tableData.search }, reqUrl : '/administration/employees'} ));
            dispatch(setNewEmployee(false));
            dispatch(setUpdateEmployee(false));
            dispatch(setUnsubscribedEmployee(false));
        }
    }, [newEmployee, updateEmployee, unsubscribedEmployee]);

    return <>
        <BasePage
            title={'Administración'}
            subtitle={'Colaboradores'}
            info={'Lista de colaboradores, solicitud de creación de usuario y solicitud de baja de usuario.'}
        >
            <div className="flex justify-end">
                {/* { esAzu && <Button onClick={handleNewEmployee} icon={<CgAdd />} size="sm" variant="solid" className="flex items-center">Registro de Empleado</Button> } */}
                <Button onClick={handleNewEmployee} icon={<CgAdd />} size="sm" variant="solid" className="flex items-center">Registro de Empleado</Button> 
            </div>
            
            <BaseDataTable
                columns={columns}
                reqUrl={'/administration/employees'}
                
            />
            <NewEmployeeDrawer />
            <AddUserDrawer />
            <UpdateEmployeeDrawer />
            <UnsubscribeUserDrawer />
            <PhotoDrawer/>
        </BasePage>
    </>
}

export default Employees;
