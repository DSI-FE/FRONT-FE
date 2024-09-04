import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Select, Notification, toast } from 'components/ui';
import { apiUpdateInventario, apiGetProductosById, apiGetInventario, apiSumaInventario, apiGetProductosBy } from 'services/InventarioService';
import { apiGetUnidades } from 'services/ProductosService';
const InventarioDrawerEdit = ({ isOpen, setIsOpen, inventarioId }) => {
    const [formData, setFormData] = useState({
        nombreProducto: '',
        unidadMedida: '',
        existencias: '',
        precioCosto: '',
        precioVenta: '',
    });
    const [tiposUnidades, setTiposUnidades] = useState([]);
    const [selectedTipoProducto, setSelectedTipoProducto] = useState(null);


    useEffect(() => {
        const fetchInventario = async (id) => {
            
            try {
                const response = await apiGetProductosById(id);
                const inventario = response.data.data[0];
                setFormData({
                    nombreProducto: inventario.nombre_producto,
                    unidadMedida: inventario.unidad_medida,
                    existencias: inventario.existencias,
                    precioCosto: inventario.precioCosto,
                    precioVenta: inventario.precioVenta,
                });
                console.log("Nombre:" +inventario.nombre_unidad_medida)
                    setSelectedTipoProducto({
                        value: inventario.unidad_medida || '',
                        label: inventario.nombre_unidad_medida || ''
                    });

            } catch (error) {
                console.error("Error fetching inventario:", error);
            }
        };

        const fetchUnidades = async () => {
            try {
                const response = await apiGetUnidades();
                setTiposUnidades(response.data.data || []);
            } catch (error) {
                console.error("Error fetching tipos de productos:", error);
                setTiposUnidades([]);
            }
        };

        if (inventarioId) {
            fetchInventario(inventarioId);
        }
        fetchUnidades();
    }, [inventarioId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleTipoUnidadesChange = (selectedOption) => {
        setFormData({ ...formData, unidadMedida: selectedOption.value });
        setSelectedTipoProducto(selectedOption);
    };


    const validateForm = () => {
        const { nombreProducto, unidadMedida, existencias, precioCosto, precioVenta } = formData;
        if (!nombreProducto || !unidadMedida || !existencias || !precioCosto || !precioVenta) {
            const missingFields = [];
            if (!nombreProducto) missingFields.push('Nombre del Producto');
            if (!unidadMedida) missingFields.push('Unidad de Medida');
            if (!existencias) missingFields.push('Existencias');
            if (!precioCosto) missingFields.push('Precio de Costo');
            if (!precioVenta) missingFields.push('Precio de Venta');

            const errorNotification = (
                <Notification title="Error" type="danger">
                    {`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`}
                </Notification>
            );
            toast.push(errorNotification);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await apiUpdateInventario(inventarioId, formData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    El inventario se actualizó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            onDrawerClose();
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al actualizar el inventario.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al actualizar el inventario:', error);
        }
    };

    const onDrawerClose = () => {
        setIsOpen(false);
    };

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
                        Editar registro del inventario
                    </h2>
                    <h4 className="text-sm mt-2" style={{ color: 'grey' }}>
                        Complete el formulario...
                    </h4>
                </div>
            }
            footer={
                <div className="flex justify-between items-center w-full">
                    <Button size="sm" variant="solid" color="gray-500" onClick={() => setFormData({})}>Limpiar</Button>
                    <Button size="sm" variant="solid" color="gray-500" onClick={onDrawerClose}>Salir</Button>
                    <Button size="sm" variant="solid" onClick={handleSubmit}>Guardar</Button>
                </div>
            }
            width={500}
        >
            <div className="p-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                <div className="mt-0 mb-4">
                        <label htmlFor="nombreProducto" className="mb-4">Nombre del producto:</label>
                        <Input
                            id="nombreProducto"
                            name="nombreProducto"
                            value={formData.nombreProducto}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                <div className="mt-4 mb-8">
                        <label htmlFor="unidadMedida">Unidad de medida:</label>
                        <Select
                            id="unidadMedida"
                            value={selectedTipoProducto}
                            onChange={handleTipoUnidadesChange}
                            options={tiposUnidades.map(tipo => ({
                                value: tipo.id,
                                label: tipo.nombreUnidad
                            }))}
                            isDisabled={true} 
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="existencias" className="mb-4">Existencias:</label>
                        <Input
                            id="existencias"
                            name="existencias"
                            value={formData.existencias}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="precioCosto" className="mb-4">Precio de Costo:</label>
                        <Input
                            id="precioCosto"
                            name="precioCosto"
                            value={formData.precioCosto}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="precioVenta" className="mb-4">Precio de Venta:</label>
                        <Input
                            id="precioVenta"
                            name="precioVenta"
                            value={formData.precioVenta}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </div>
        </Drawer>
    );
};

export default InventarioDrawerEdit;