import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { openNotification } from 'helpers'

import { ConfirmDialog } from 'components/custom'
import { apiStorePermissionRequest } from 'services/AttendanceService'
import { IconText } from 'components/shared'
import {HiOutlineCalendar,HiOutlineClock } from 'react-icons/hi'

import { getPermissionRequestsFromEmployeeAndState } from 'views/attendance/Requests/permissionRequests/store/dataSlice'

import { setSelectedEmployee, setSelectedState } from 'views/attendance/Requests/store/stateSlice'

const storePermissionRequest = async (data) => {
    const res = await apiStorePermissionRequest(data)
    return res.data
}

const DialogPermissionRequest = ( { state, setState, setParentState, data } ) =>
{
    const attendanceRequests = useSelector( state => state.attendance_requests?.data )
    const permissionRequests = useSelector( state => state.permission_requests?.data )
    const dispatch = useDispatch()

    const plainObject = {};
    data.forEach((value, key) => {
      plainObject[key] = value
    })

    const handleClose = () => {
        setState(false)
    }

    const handleConfirm = async () => {
        try {
            await storePermissionRequest(data)
            setState(false)
            setParentState(false)
            if( attendanceRequests && attendanceRequests!=='undefined' && permissionRequests && permissionRequests !== 'undefined' ){
                dispatch(getPermissionRequestsFromEmployeeAndState({employeeId:plainObject.adm_employee_id, state:0}))
                dispatch(setSelectedEmployee(plainObject.adm_employee_id))
                dispatch(setSelectedState(0))
            }
            document.body.style.overflow = 'auto';
        } catch (errors) {
            const message = errors?.response?.data?.errors || errors.toString()
            openNotification('danger','Error',message,'top-start')
        }
    }
    
    return (
        <ConfirmDialog
            isOpen={state}
            onClose={handleClose}
            onRequestClose={handleClose}
            type={`warning`}
            title={<span className={`text-buke-500 mt-2 block text-2xl`}>Confirmación</span>}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmButtonColor={`buke-600`}
            confirmText={`Confirmar`}
            cancelText={`Cancelar`}
            loading={false}
        >
            <div className='flex flex-col justify-start gap-4 max-h-96 overflow-y-auto'>

                <span className='font-bold text-md'>Datos de la Solicitud de Permiso</span>

                <div className='text-justify'>
                    <span className='font-semibold'>Tipo de Permiso: </span>
                    <span className=''>{plainObject?.att_permission_type}</span>
                </div>
                
                <div className='flex justify-around'>
                    <div className='text-center'>
                        <IconText className="font-semibold" icon={<HiOutlineCalendar className="text-lg" />}>
                            { plainObject?.date_ini === plainObject?.date_end ? 'Fecha' : 'Fecha Final' }
                        </IconText>
                        <span className=''>{plainObject?.date_ini}</span>
                    </div>
                    {
                        plainObject?.date_ini !== plainObject?.date_end ? (
                        <div className='text-center'>
                            <IconText className="font-semibold" icon={<HiOutlineCalendar className="text-lg" />}>
                                Fecha Final: 
                            </IconText>
                            <span className=''>{plainObject?.date_end}</span>
                        </div>
                        )
                        :<></>
                    }
                </div>
                <div className='flex justify-around'>
                    <div className='text-center'>
                        <IconText className="font-semibold" icon={<HiOutlineClock className="text-lg" />}>
                            Hora Inicial: 
                        </IconText>
                        <span className=''>{plainObject?.time_ini}</span>
                    </div>
                    <div className='text-center'>
                        <IconText className="font-semibold" icon={<HiOutlineClock className="text-lg" />}>
                            Hora Final: 
                        </IconText>
                        <span className=''>{plainObject?.time_end}</span>
                    </div>
                </div>

                <div className='text-justify'>
                    <span className='font-semibold'>Justificación: </span>
                    <span className=''>{plainObject?.justification}</span>
                </div>

                <hr/>

                <p className='text-center'>
                    <span className='font-semibold text-lg'>¿Está seguro de querer enviar esta solicitud?</span>
                </p>
                
            </div>

        </ConfirmDialog>
	)
}

export default DialogPermissionRequest