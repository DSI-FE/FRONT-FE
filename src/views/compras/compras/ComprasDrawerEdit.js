import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Select, Notification, toast } from 'components/ui';
import { apiUpdateProveedor, apiGetProveedorById, apiGetProveedores } from 'services/ProveedorService';
import { apiGetTiposProveedor } from 'services/TipoProveedorService';

const ComprasDrawerEdit = ({ isOpen, setIsOpen, proveedorId }) => {
    const [formData, setFormData] = useState({
        codigo: '',
        nrc: '',
        nombre: '',
        nit: '',
        serie: '',
        tipo_proveedor_id: ''
    });
    const [tiposProveedor, setTiposProveedor] = useState([]);
    const [selectedTipoProveedor, setSelectedTipoProveedor] = useState(null);

    useEffect(() => {
        const fetchProveedor = async (id) => {
            try {
                const response = await apiGetProveedorById(id);
                setFormData({
                    codigo: response.data.data.codigo,
                    nrc: response.data.data.nrc,
                    nombre: response.data.data.nombre,
                    nit: response.data.data.nit,
                    serie: response.data.data.serie,
                    tipo_proveedor_id: response.data.data.tipo_proveedor_id
                });
                setSelectedTipoProveedor({
                    value: response.data.data.tipo_proveedor_id,
                    label: response.data.data.tipo_proveedor.tipo
                });
            } catch (error) {
                console.error("Error fetching proveedor:", error);
            }
        };

        const fetchTiposProveedor = async () => {
            try {
                const response = await apiGetTiposProveedor();
                setTiposProveedor(response.data.data || []);
            } catch (error) {
                console.error("Error fetching tipos de proveedor:", error);
                setTiposProveedor([]);
            }
        };

        if (proveedorId) {
            fetchProveedor(proveedorId);
        }
        fetchTiposProveedor();
    }, [proveedorId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTipoProveedorChange = (selectedOption) => {
        setFormData({ ...formData, tipo_proveedor_id: selectedOption.value });
        setSelectedTipoProveedor(selectedOption);
    };

    const validateForm = () => {
        const { codigo, nombre, nit, serie, tipo_proveedor_id } = formData;
        if (!codigo || !nombre || !nit || !serie || !tipo_proveedor_id) {
            const missingFields = [];
            if (!codigo) missingFields.push('Código');
            if (!nombre) missingFields.push('Nombre');
            if (!nit) missingFields.push('NIT');
            if (!serie) missingFields.push('Serie');
            if (!tipo_proveedor_id) missingFields.push('Tipo de Proveedor');

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
            await apiUpdateProveedor(proveedorId, formData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    El proveedor se actualizó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            onDrawerClose();
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al actualizar el proveedor.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al actualizar el proveedor:', error);
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
                        Editar registro del proveedor
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
                        <label htmlFor="codigo" className="mb-4">Código:</label>
                        <Input
                            id="codigo"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nrc" className="mb-4">NRC:</label>
                        <Input
                            id="nrc"
                            name="nrc"
                            value={formData.nrc}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nombre" className="mb-4">Nombre:</label>
                        <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nit" className="mb-4">NIT:</label>
                        <Input
                            id="nit"
                            name="nit"
                            value={formData.nit}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="serie" className="mb-4">Serie:</label>
                        <Input
                            id="serie"
                            name="serie"
                            value={formData.serie}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-4 mb-8">
                        <label htmlFor="tipo_proveedor">Tipo de Proveedor:</label>
                        <Select
                            id="tipo_proveedor"
                            value={selectedTipoProveedor}
                            onChange={handleTipoProveedorChange}
                            options={tiposProveedor.map(tipo => ({
                                value: tipo.id,
                                label: tipo.tipo
                            }))}
                        />
                    </div>
                </form>
            </div>
        </Drawer>
    );
};

export default ComprasDrawerEdit;
