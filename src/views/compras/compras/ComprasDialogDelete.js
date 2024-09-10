import React from 'react';
import { Dialog, Button, Notification, toast } from 'components/ui';
import { apiDeleteCompra } from 'services/ComprasService';

const ComprasDialogDelete = ({ isOpen, onClose, compra, onDeleteSuccess }) => {
    const handleDelete = async () => {
        try {
            const response = await apiDeleteCompra(compra.id);
            onDeleteSuccess(compra.id);
            
            const successNotification = (
                <Notification title="Completado" type="success">
                    La compra se eliminó exitosamente.
                </Notification>
            );
            toast.push(successNotification);
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al eliminar la compra.
                </Notification>
            );
            toast.push(errorNotification);
        } finally {
            onClose(); 
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <h2 style={{ marginBottom: '25px', marginTop: '2px' }}>
                Confirmar eliminación
            </h2>
            <p>¿Estás seguro de que deseas eliminar la compra con ID <strong>{compra.id}</strong>?</p>
            <div className="flex justify-end space-x-2 mt-4">
                <Button size="sm" variant="solid" color="gray-500" onClick={onClose}>Cancelar</Button>
                <Button size="sm" variant="solid" color="red-500" onClick={handleDelete}>Eliminar</Button>
            </div>
        </Dialog>
    );
};

export default ComprasDialogDelete;
