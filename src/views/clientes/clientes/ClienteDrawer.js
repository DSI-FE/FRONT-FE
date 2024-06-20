import React, { useState, useEffect } from "react";
import { Input, Button, Drawer } from 'components/ui';
import { apiCreateCliente, apiUpdateCliente } from 'services/ClienteService';

const ClienteDrawer = ({ isOpen, setIsOpen, cliente }) => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombres: '',
        apellidos: '',
        numeroDocumento: '',
        direccion: '',
        nrc: '',
        telefono: '',
        correoElectronico: '',
        department_id: '',
        municipality_id: '',
        economic_activity_id: ''
    });

    useEffect(() => {
        if (cliente) {
            setFormData(cliente);
        } else {
            setFormData({
                codigo: '',
                nombres: '',
                apellidos: '',
                numeroDocumento: '',
                direccion: '',
                nrc: '',
                telefono: '',
                correoElectronico: '',
                department_id: '',
                municipality_id: '',
                economic_activity_id: ''
            });
        }
    }, [cliente]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (cliente) {
                // Actualizar cliente existente
                await apiUpdateCliente(cliente.id, formData);
            } else {
                // Crear nuevo cliente
                await apiCreateCliente(formData);
            }
            setIsOpen(false);
            window.location.reload();  // Refrescar la página
        } catch (error) {
            console.error('Error al guardar el cliente:', error);
        }
    };

    const onDrawerClose = () => {
        setIsOpen(false);
    };

    const title = cliente ? "Editar cliente" : "Nuevo cliente";

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
                        <label htmlFor="nombres" className="mb-4">Nombres:</label>
                        <Input
                            id="nombres"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="apellidos" className="mb-4">Apellidos:</label>
                        <Input
                            id="apellidos"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="numeroDocumento" className="mb-4">Número de Documento:</label>
                        <Input
                            id="numeroDocumento"
                            name="numeroDocumento"
                            value={formData.numeroDocumento}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="direccion" className="mb-4">Dirección:</label>
                        <Input
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
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
                        <label htmlFor="telefono" className="mb-4">Teléfono:</label>
                        <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="correoElectronico" className="mb-4">Correo Electrónico:</label>
                        <Input
                            id="correoElectronico"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="department_id" className="mb-4">Departamento:</label>
                        <Input
                            id="department_id"
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="municipality_id" className="mb-4">Municipio:</label>
                        <Input
                            id="municipality_id"
                            name="municipality_id"
                            value={formData.municipality_id}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="economic_activity_id" className="mb-4">Actividad Económica:</label>
                        <Input
                            id="economic_activity_id"
                            name="economic_activity_id"
                            value={formData.economic_activity_id}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </div>
        </Drawer>
    );
};

export default ClienteDrawer;
