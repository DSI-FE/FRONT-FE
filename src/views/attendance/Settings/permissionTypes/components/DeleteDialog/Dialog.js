import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { toast, Notification } from 'components/ui';

import { ConfirmDialog } from 'components/custom';

import { setDialogOpen,setLoading,setSelectedEntry } from '../../store/stateSlice'
import { getPermissionTypes } from '../../store/dataSlice';

import { apiDeletePermissionType } from 'services/AttendanceService';

const deleteEntry = async (id) => {
    const res = await apiDeletePermissionType(id)
    return res.data
}


const Dialog = () => {

    const dispatch = useDispatch()
    const { selected_entry:selectedEntry,dialog_open:dialogOpen,loading } =  useSelector( state => state.settingsPermissionTypes.state )

    const handleClose = () => {
        dispatch(setSelectedEntry(null));
        dispatch(setDialogOpen(false));
        dispatch(setLoading(false));
    }

    const handleConfirm = async () => {
        dispatch(setLoading(true));
        try {
            await deleteEntry( selectedEntry.id );
            dispatch(getPermissionTypes())
            openNotification('success','Éxito','El asueto se ha eliminado correctamente','top-start');
        } catch (error) {
            const message = error?.response?.data?.message || error.toString();
            openNotification('danger','Algo salio mal',message,'top-end');
        }
        dispatch(setDialogOpen(false));
        dispatch(setLoading(false));
    }

    const openNotification = (type,title,message,placement) =>
    {
		toast.push((
			<Notification className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
				{message}
			</Notification>), {placement: placement}
		)
	}
    
    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            type={`danger`}
            title={`Eliminar Asueto`}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmButtonColor={`buke-600`}
            confirmText={`Confirmar`}
            cancelText={`Cancelar`}
            loading={loading}
        >
            <p className={`text-justify`}>Esta acción eliminará permanentemente el tipo de permiso seleccionado, además también se eliminaran los permisos de este tipo que se hayan enviado</p>
            <p className='font-semibold mt-2'>¿Desea continuar?</p>
        </ConfirmDialog>
	);
}

export default Dialog;