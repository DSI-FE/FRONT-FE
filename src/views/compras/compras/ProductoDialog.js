import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button, Select, Notification, toast } from "components/ui";
import { apiGetNombreProductos } from 'services/ProductosService';

const ProductoDialog = ({ isOpen, onClose, onSave }) => {
    const [producto, setProducto] = useState({
        cantidad: '',
        codigo: '',
        descripcion: '',
        precioUnitario: 0,
        iva: 0,
        total: 0,
        unidad: '',
        unidad_id: 0
    });

    const [listaProductos, setListaProductos] = useState([]);
    const [unidadesDisponibles, setUnidadesDisponibles] = useState([]);

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevState => ({
            ...prevState,
            [name]: value
        }));

        console.log("PRODUCTO CAMBIO", name);

        if (name === 'codigo') {
            const numero = parseInt(value);

            // Buscar el producto correspondiente al código ingresado
            const productoBuscado = listaProductos.find(producto => producto.id === numero);
    
            if (productoBuscado) {
                // Actualizar los datos del producto si se encuentra
                setProducto(prevState => ({
                    ...prevState,
                    descripcion: productoBuscado.nombreProducto,
                    codigo: productoBuscado.id
                }));
                setUnidadesDisponibles(productoBuscado.unidades);
            } else {
                // Restablecer campos si no se encuentra el producto
                setProducto(prevState => ({
                    ...prevState,
                    descripcion: ''
                }));
                setUnidadesDisponibles([]);
            }        
        }
    };

    const totalIva = (producto.precioUnitario * 0.13).toFixed(2);
    const totalConIva = ((producto.precioUnitario * producto.cantidad)).toFixed(2);

    const validateForm = () => {
        const { codigo, descripcion, unidad_id, cantidad, precioUnitario } = producto;
        if (!codigo || !descripcion || !unidad_id || !cantidad || precioUnitario <= 0) {
            const missingFields = [];
            if (!codigo) missingFields.push('Código');
            if (!descripcion) missingFields.push('Nombre');
            if (!unidad_id) missingFields.push('Unidad de medida');
            if (!cantidad) missingFields.push('Cantidad');
            if (precioUnitario <= 0) missingFields.push('Precio unitario');

            const errorNotification = (
                <Notification title="Error" type="danger">
                    {`Los siguientes campos son obligatorios o inválidos: ${missingFields.join(', ')}`}
                </Notification>
            );
            toast.push(errorNotification);
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validateForm()) {
            const nuevoProducto = {
                ...producto,
                iva: totalIva,
                total: parseFloat(totalConIva)
            };
            onSave(nuevoProducto);
            clearFields();
            onClose();
        }
    };

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await apiGetNombreProductos();
                if (response.data && Array.isArray(response.data.data)) {
                    setListaProductos(response.data.data);
                } else {
                    setListaProductos([]);
                }
            } catch (error) {
                console.error("Error fetching productos:", error);
                setListaProductos([]);
            }
        };
        fetchProductos();
    }, []);

    const handleProductosChange = (selectedOption) => {
        const productoSeleccionado = listaProductos.find(prod => prod.id === selectedOption.value);
        if (productoSeleccionado) {
            setProducto({
                ...producto,
                descripcion: productoSeleccionado.nombreProducto,
                codigo: productoSeleccionado.id
            });
            setUnidadesDisponibles(productoSeleccionado.unidades);
        }
    };

    const handleUnidadChange = (selectedOption) => {
        setProducto({
            ...producto,
            unidad_id: selectedOption.value,
            unidad: selectedOption.label
        });
    };

    const clearFields = () => {
        setProducto({
            cantidad: '',
            codigo: '',
            descripcion: '',
            precioUnitario: 0,
            iva: 0,
            total: 0,
            unidad: '',
            unidad_id: 0
        });
        setUnidadesDisponibles([]);
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Agregar Producto">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label>Código</label>
                    <Input
                        type="number"
                        name="codigo"
                        value={producto.codigo}
                        onChange={handleProductoChange}
                        className="border-gray-300"
                    />
                </div>
                <div>
                    <label>Nombre del producto</label>
                    <Select
                        id="descripcion"
                        value={producto.descripcion ? { value: producto.descripcion, label: producto.descripcion } : null}
                        onChange={handleProductosChange}
                        options={listaProductos.map(pro => ({
                            value: pro.id,
                            label: pro.nombreProducto
                        }))}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Unidad de medida</label>
                        <Select
                            id="unidad"
                            value={producto.unidad ? { value: producto.unidad, label: producto.unidad } : null}
                            onChange={handleUnidadChange}
                            options={unidadesDisponibles.map(unidad => ({
                                value: unidad.id,
                                label: unidad.nombreUnidad
                            }))}
                        />
                    </div>
                    <div>
                        <label>Cantidad</label>
                        <Input
                            type="number"
                            name="cantidad"
                            value={producto.cantidad}
                            onChange={handleProductoChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Precio unitario</label>
                        <Input
                            type="number"
                            name="precioUnitario"
                            value={producto.precioUnitario}
                            onChange={handleProductoChange}
                        />
                    </div>
                    <div>
                        <label>Total</label>
                        <Input
                            type="number"
                            name="total"
                            value={totalConIva}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="solid" onClick={handleSave}>
                    Agregar a la compra
                </Button>
            </div>
        </Dialog>
    );
};

export default ProductoDialog;
