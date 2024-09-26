import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button, Notification, toast, Spinner } from "components/ui";
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
    const [cargando, setCargando] = useState(false); // Estado para el spinner

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
        setCargando(true); // Iniciar carga
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
            setMostrarTicket(true);
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al emitir la factura.
                </Notification>
            );
            toast.push(errorNotification);
        } finally {
            setCargando(false); // Finalizar carga
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
                        <Button variant="solid" onClick={handleFinalizarVenta} disabled={cargando}>
                            {cargando ? 'Generando...' : 'Finalizar venta'}
                        </Button>
                    </div>

                    {cargando && (
                        <div className="flex justify-center mt-4">
                            <Spinner className="mr-4" color="blue-500" size="40px" />
                        </div>
                    )}
                </>
            ) : (
                <Ticket idDTE={dteId} />
            )}
        </Dialog>
    );
};

export default CambioDialog;
