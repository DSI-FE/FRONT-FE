import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Select, Notification, toast } from 'components/ui';
import { apiCreateProductos, apiUpdateProducto, apiGetUnidades } from 'services/ProductosService';


const ProductosDrawer = ({ isOpen, setIsOpen, drawerOpen, formType, eventSent }) => {
    const [nombreProducto, setNombre] = useState('');
    const [equivalencia, setEquivalencia] = useState('');
    const [unidad, setUnidad] = useState(null);
    const [tiposUnidades, setTiposUnidades] = useState([]);

    useEffect(() => {
        setIsOpen(drawerOpen);
        if (formType === "DataProducto" && eventSent) {
            setNombre(eventSent?.extendedProps?.nombre_producto || '');
            setUnidad(eventSent?.extendedProps?.unidad_medida || '');
            setEquivalencia(eventSent?.extendedProps?.equivalencia || null);
        } else {
            setNombre('');
            setUnidad(null);
            setEquivalencia('');
        }
    }, [drawerOpen, formType]);

    useEffect(() => {
        const fetchTiposUnidad = async () => {
            try {
                const response = await apiGetUnidades();
                if (response.data && Array.isArray(response.data.data)) {
                    setTiposUnidades(response.data.data);
                } else {
                    setTiposUnidades([]);
                }
            } catch (error) {
                console.error("Error fetching tipos de unidades:", error);
                setTiposUnidades([]);
            }
        };
        fetchTiposUnidad();
    }, []);

    const Footer = ({ onSave, onCancel, onReset }) => {
        return (
            <div className="flex justify-between items-center w-full">
                <Button size="sm" variant="solid" color="gray-500" onClick={onReset}>Limpiar</Button>
                <Button size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" onClick={onSave}>Guardar</Button>
            </div>
        )
    }

    const onDrawerClose = () => {
        setIsOpen(false);
        clearFields();
    }

    const validateForm = () => {
        if (!nombreProducto || !unidad || !equivalencia) {
            const missingFields = [];
            if (!nombreProducto) missingFields.push('Nombre');
            if (!unidad) missingFields.push('Unidad');
            if (!equivalencia) missingFields.push('Equivalencia');

            const errorNotification = (
                <Notification title="Error" type="danger">
                    {`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`}
                </Notification>
            );
            toast.push(errorNotification);
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const productoData = {
            nombreProducto,
            unidadMedida: unidad.value,
            equivalencia
        };
        console.log(productoData);

        try {
            await apiCreateProductos(productoData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    El producto se guardó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            onDrawerClose();
            clearFields();
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al guardar el producto.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al guardar el producto:', error);
        }
    };

    const clearFields = () => {
        setNombre('');
        setUnidad(null);
        setEquivalencia('');
    };

    const handleReset = () => {
        clearFields();
    };

    const handleTipoUnidadChange = (selectedOption) => {
        setUnidad(selectedOption);
    };

    const title = formType === "DataProductos" ? "Editar registro del producto" : "Nuevo registro de producto";

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            closable={false}
            bodyClass="p-5"
            title={
                <div className="p-2" style={{ marginTop: '2px', textAlign: 'left' }}>
                    <h2 className="text-2xl font-bold mt-2" style={{ color: '#019DE1' }}>
                        {title}
                    </h2>
                    <h4 className="text-sm mt-2" style={{ color: 'grey' }}>
                        Complete el formulario...
                    </h4>
                </div>
            }
            footer={<Footer onReset={handleReset} onCancel={onDrawerClose} onSave={handleSubmit} />}
            width={500}
        >
            <div className="p-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nombre" className="mb-4">Nombre:</label>
                        <Input
                            id="nombre"
                            value={nombreProducto}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 mb-8">
                        <label htmlFor="unidad">Unidad de medida:</label>
                        <Select
                            id="unidad"
                            value={unidad}
                            onChange={handleTipoUnidadChange}
                            options={tiposUnidades.map(tipo => ({
                                value: tipo.id,
                                label: tipo.nombreUnidad
                            }))}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="serie" className="mb-4">Equivalencia:</label>
                        <Input
                            id="serie"
                            value={equivalencia}
                            onChange={(e) => setEquivalencia(e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default ProductosDrawer;
