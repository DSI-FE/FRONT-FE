import React, { useState } from 'react';
import { toast, Notification } from 'components/ui';
import { apiDeleteCliente  } from 'services/ClienteService';

const VentasDialogDelete = ({ isOpen, onClose, ventas, onDeleteComplete }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await apiDeleteCliente(ventas.id);
            onDeleteComplete();
            openNotification('success', 'Éxito', 'El cliente se ha eliminado correctamente', 'top-start');
        } catch (error) {
            const message = error?.response?.data?.message || error.toString();
            openNotification('danger', 'Algo salió mal', message, 'top-end');
        }
        setLoading(false);
        onClose();
    };

    const openNotification = (type, title, message, placement) => {
        toast.push(
            <Notification className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
                {message}
            </Notification>,
            { placement }
        );
    };

    return (
        <div
            isOpen={isOpen}
            onClose={onClose}
            onCancel={onClose}
            onConfirm={handleConfirm}
            type="danger"
            title="Eliminar Cliente"
            confirmText="Confirmar"
            cancelText="Cancelar"
            confirmButtonColor="red"
            loading={loading}
        >
            <p className="text-justify">Esta acción eliminará permanentemente el cliente seleccionado, por lo que no se mostrará más en el sitio.</p>
            <p className="font-semibold mt-2">¿Está seguro que desea continuar?</p>
        </div>
    );
};

export default VentasDialogDelete;
