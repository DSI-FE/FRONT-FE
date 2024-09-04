import React from 'react';
import { Dialog, Button, Notification, toast } from 'components/ui';
import { apiDeleteProveedor } from 'services/ProveedorService';

const ProveedorDialogDelete = ({ isOpen, onClose, proveedor, onDeleteSuccess }) => {
    const handleDelete = async () => {
        try {
            const response = await apiDeleteProveedor(proveedor.id);
            onDeleteSuccess(proveedor.id);
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al eliminar el proveedor.
                </Notification>
            );
            toast.push(errorNotification);
            onClose();
        } catch (error) {
            const toastNotification = (
                <Notification title="Completado" type="success">
                    El proveedor se eliminó exitosamente.
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
            <p>¿Estás seguro de que deseas eliminar el proveedor <strong>{proveedor.nombre}</strong>?</p>
            <div className="flex justify-end space-x-2 mt-4">
                <Button size="sm" variant="solid" color="gray-500" onClick={onClose}>Cancelar</Button>
                <Button size="sm" variant="solid" color="red-500" onClick={handleDelete}>Eliminar</Button>
            </div>
        </Dialog>
    );
};

export default ProveedorDialogDelete;
