import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button, Notification, toast } from "components/ui";
import { apiCreateDTE } from 'services/DTEServices';
import Ticket from './Ticket';

const CambioDialog = ({ isOpen, onClose, vVenta, ventaId, limpiarCampos }) => {
    const total = vVenta.total;
    const [mostrarTicket, setMostrarTicket] = useState(false);
    const [dteId, setDTEId] = useState(null);

    const [datos, setDatos] = useState({
        efectivo: '',
        cobrar: total,
        cambio: '',
    });

    useEffect(() => {
        if (ventaId) {
            setDatos(prevDatos => ({
                ...prevDatos,
                cobrar: total
            }));
        }
    }, [ventaId, total]);

    const handleDatosChange = (e) => {
        const { name, value } = e.target;

        setDatos(prevDatos => {
            const updatedDatos = {
                ...prevDatos,
                [name]: value
            };

            if (name === 'efectivo') {
                const efectivo = parseFloat(updatedDatos.efectivo) || 0;
                const cobrar = parseFloat(updatedDatos.cobrar) || 0;

                const cambio = efectivo > cobrar ? (efectivo - cobrar).toFixed(2) : 0;

                return {
                    ...updatedDatos,
                    cambio: cambio
                };
            }

            return updatedDatos;
        });
    };

    const handleFinalizarVenta = async () => {
        try {
            const response = await apiCreateDTE(ventaId);
            const id = response.data.data.id;
            setDTEId(id);

            const toastNotification = (
                <Notification title="Completado" type="success">
                    La factura fue generada exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            // Mostrar el ticket
            setMostrarTicket(true);
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al emitir la factura.
                </Notification>
            );
            toast.push(errorNotification);
        }
    };

    useEffect(() => {
        if (mostrarTicket) {
           // onClose();
        }
    }, [mostrarTicket, onClose]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={375}>
            {!mostrarTicket ? (
                <>
                    <h2 style={{ marginBottom: '25px', marginTop: '2px', textAlign: 'center' }}>
                        Detalle del pago
                    </h2>
                    <div className="grid grid-cols-1 gap-2 text-black">
                        <div className="flex flex-col">
                            <label>Efectivo</label>
                            <Input
                                type="number"
                                name="efectivo"
                                value={datos.efectivo}
                                onChange={handleDatosChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Dinero a cobrar</label>
                            <Input
                                type="number"
                                name="cobrar"
                                value={datos.cobrar}
                                onChange={handleDatosChange}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Cambio a dar al cliente</label>
                            <Input
                                type="number"
                                name="cambio"
                                value={datos.cambio}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button variant="solid" onClick={handleFinalizarVenta}>
                            Finalizar venta
                        </Button>
                    </div>
                </>
            ) : (
                // Mostrar el ticket después de finalizar la venta
                <Ticket 
                idDTE={dteId} />
            )}
        </Dialog>
    );
};

export default CambioDialog;
