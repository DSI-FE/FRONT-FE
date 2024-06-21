import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Select, Notification, toast } from 'components/ui';
import { apiCreateProveedor } from 'services/ProveedorService';
import { apiGetTiposProveedor } from "services/TipoProveedorService";

const ProveedorDrawer = ({ isOpen, setIsOpen, drawerOpen, formType, eventSent }) => {
    const [codigo, setCodigo] = useState('');
    const [nrc, setNrc] = useState('');
    const [nombre, setNombre] = useState('');
    const [nit, setNit] = useState('');
    const [serie, setSerie] = useState('');
    const [tipoProveedor, setTipoProveedor] = useState(null);
    const [tiposProveedor, setTiposProveedor] = useState([]);

    useEffect(() => {
        setIsOpen(drawerOpen);
        if (formType === "DataProveedor" && eventSent) {
            setCodigo(eventSent?.extendedProps?.codigo || '');
            setNrc(eventSent?.extendedProps?.nrc || '');
            setNombre(eventSent?.extendedProps?.nombre || '');
            setNit(eventSent?.extendedProps?.nit || '');
            setSerie(eventSent?.extendedProps?.serie || '');
            setTipoProveedor(eventSent?.extendedProps?.tipoProveedor || null);
        } else {
            setCodigo('');
            setNrc('');
            setNombre('');
            setNit('');
            setSerie('');
            setTipoProveedor(null);
        }
    }, [drawerOpen, formType]);

    useEffect(() => {
        const fetchTiposProveedor = async () => {
            try {
                const response = await apiGetTiposProveedor();
                if (response.data && Array.isArray(response.data.data)) {
                    setTiposProveedor(response.data.data);
                } else {
                    setTiposProveedor([]);
                }
            } catch (error) {
                console.error("Error fetching tipos de proveedor:", error);
                setTiposProveedor([]);
            }
        };
        fetchTiposProveedor();
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!codigo || !nombre || !nit || !tipoProveedor) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Por favor, complete todos los campos obligatorios.
                </Notification>
            );
            toast.push(errorNotification);
            return;
        }

        const proveedorData = {
            codigo,
            nrc,
            nombre,
            nit,
            serie,
            tipo_proveedor_id: tipoProveedor.value 
        };

        try {
            await apiCreateProveedor(proveedorData);
            onDrawerClose();
            clearFields();
            const successNotification = (
                <Notification title="Completado" type="success">
                    El proveedor se guardó exitosamente.
                </Notification>
            );
            toast.push(successNotification);
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al guardar el proveedor.
                </Notification>
            );
            toast.push(errorNotification);
        }
    };

    const clearFields = () => {
        setCodigo('');
        setNrc('');
        setNombre('');
        setNit('');
        setSerie('');
        setTipoProveedor(null);
    };

    const handleReset = () => {
        clearFields();
    };

    const handleTipoProveedorChange = (selectedOption) => {
        setTipoProveedor(selectedOption);
    };

    const title = formType === "DataProveedor" ? "Editar registro del proveedor" : "Nuevo registro de proveedor";

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
            footer={<Footer onCancel={onDrawerClose} onSave={handleSubmit} onReset={handleReset} />}
            width={500}
        >
            <div className="p-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <div className="mt-0 mb-4">
                        <label htmlFor="codigo" className="mb-4">Código:</label>
                        <Input
                            id="codigo"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nrc" className="mb-4">NRC:</label>
                        <Input
                            id="nrc"
                            value={nrc}
                            onChange={(e) => setNrc(e.target.value)}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nombre" className="mb-4">Nombre:</label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nit" className="mb-4">NIT:</label>
                        <Input
                            id="nit"
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="serie" className="mb-4">Serie:</label>
                        <Input
                            id="serie"
                            value={serie}
                            onChange={(e) => setSerie(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 mb-8">
                        <label htmlFor="tipo_proveedor">Tipo de Proveedor:</label>
                        <Select
                            id="tipo_proveedor"
                            value={tipoProveedor}
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
    )
}

export default ProveedorDrawer;
