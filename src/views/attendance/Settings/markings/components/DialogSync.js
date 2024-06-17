import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { toast, Notification } from 'components/ui';

import { ConfirmDialog } from 'components/custom';

import { apiSyncMarkingDevices } from 'services/AttendanceService';
import { setLoading,setDialogSyncOpen } from '../store/stateSlice';

const DialogSync = () => {

    const dispatch = useDispatch()
    const {
        dialog_sync_open:dialogSyncOpen,
        loading
    } = useSelector((state) => state.attendanceStt.state);

    const handleClose = () => {
        dispatch(setDialogSyncOpen(false));
        dispatch(setLoading(false));
    }

    const handleConfirm = async () => {
        dispatch(setLoading(true));
        try {
            const res = await apiSyncMarkingDevices();
            openNotification('success','Sincronización completa','Las marcaciones se han almacenado correctamente','top-end');
        } catch (error) {
            const message = error?.response?.data?.message || error.toString();
            openNotification('danger','Algo salio mal',message,'top-end');
        }
        dispatch(setDialogSyncOpen(false));
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
            isOpen={dialogSyncOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            type={`warning`}
            title={`Sicronizar Marcaciones`}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmButtonColor={`buke-600`}
            confirmText={`Confirmar`}
            cancelText={`Cancelar`}
            loading={loading}
        >
            <p className={`text-justify`}>Esta acción recolecta y almacena las marcaciones de todos los dispositivos registrados, una vez almacenadas, las elimina de los dispositivos</p>
            <p className='font-semibold mt-2'>¿Desea continuar?</p>
        </ConfirmDialog>
	);
}

export default DialogSync;