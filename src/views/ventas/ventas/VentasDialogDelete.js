import React from 'react';
import { Dialog, Button, Notification, toast } from 'components/ui';
import { apiDeleteVenta } from 'services/VentasService';

const VentasDialogDelete = ({ isOpen, onClose, venta, onDeleteSuccess }) => {
    const handleDelete = async () => {
        try {
            const response = await apiDeleteVenta(venta.id);
            onDeleteSuccess(venta.id);
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al eliminar la venta.
                </Notification>
            );
            toast.push(errorNotification);
            onClose();
        } catch (error) {
            const toastNotification = (
                <Notification title="Completado" type="success">
                    La venta se eliminó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
        } finally {
            onClose(); 
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <h2 style={{ marginBottom: '25px', marginTop: '2px' }}>
                Confirmar eliminación
            </h2>
            <p>¿Estás seguro de que deseas eliminar la venta<strong>{venta.nombre}</strong>?</p>
            <div className="flex justify-end space-x-2 mt-4">
                <Button size="sm" variant="solid" color="gray-500" onClick={onClose}>Cancelar</Button>
                <Button size="sm" variant="solid" color="red-500" onClick={handleDelete}>Eliminar</Button>
            </div>
        </Dialog>
    );
};

export default VentasDialogDelete;
