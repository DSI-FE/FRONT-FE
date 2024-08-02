import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Select, Notification, toast } from 'components/ui';
import { apiUpdateProductos, apiGetProductosById, apiGetUnidades } from 'services/ProductosService';

const ProductosDrawerEdit = ({ isOpen, setIsOpen, productoId }) => {
    const [formData, setFormData] = useState({
        nombreProducto: '',
        unidadMedida: '',
        equivalencia: ''
    });
    const [tiposUnidades, setTiposUnidades] = useState([]);
    const [selectedTipoProducto, setSelectedTipoProducto] = useState(null);

    useEffect(() => {
        const fetchProductos = async (id) => {
            try {
                const response = await apiGetProductosById(id);
                const producto = response.data.data[0];
                // Verifica la estructura de la respuesta
                    setFormData({
                        nombreProducto: producto.nombre_producto || '',
                        unidadMedida: producto.unidad_medida || '',
                        equivalencia: producto.equivalencia || ''
                    });
                    console.log("Nombre:" +producto.nombre_unidad_medida)
                    setSelectedTipoProducto({
                        value: producto.unidad_medida || '',
                        label: producto.nombre_unidad_medida || ''
                    });

        
            } catch (error) {
                console.error("Error fetching productos:", error);
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
        if(productoId){
            fetchProductos(productoId);
        }         
        fetchUnidades();
    }, [productoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTipoUnidadesChange = (selectedOption) => {
        setFormData({ ...formData, unidadMedida: selectedOption.value });
        setSelectedTipoProducto(selectedOption);
    };

    const validateForm = () => {
        const { nombreProducto, unidadMedida, equivalencia } = formData;
        if (!nombreProducto || !unidadMedida || !equivalencia) {
            const missingFields = [];
            if (!nombreProducto) missingFields.push('Nombre');
            if (!unidadMedida) missingFields.push('Unidad');
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
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await apiUpdateProductos(productoId, formData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    El producto se actualizó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            onDrawerClose();
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al actualizar el producto.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al actualizar el producto:', error);
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
                        Editar registro del producto
                    </h2>
                    <h4 className="text-sm mt-2" style={{ color: 'grey' }}>
                        Complete el formulario...
                    </h4>
                </div>
            }
            footer={
                <div className="flex justify-between items-center w-full">
                    <Button size="sm" variant="solid" color="gray-500" onClick={() => setFormData({ nombre: '', unidad: '', equivalencia: '' })}>Limpiar</Button>
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
                        <label htmlFor="equivalencia" className="mb-4">Equivalencia:</label>
                        <Input
                            id="equivalencia"
                            name="equivalencia"
                            value={formData.equivalencia}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </div>
        </Drawer>
    );
};

export default ProductosDrawerEdit;
