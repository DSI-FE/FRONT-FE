import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button, Select, Notification, toast } from "components/ui";
import { apiGetNombreProductos } from 'services/ProductosService';

const ProductoDialog = ({ isOpen, onClose, onSave }) => {
    const [producto, setProducto] = useState({
        cantidad: '',
        codigo: '',
        descripcion: '',
        existencias: '',
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
        // Actualiza solo el campo que cambió
        setProducto(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        if (name === 'codigo') {
        const numero = parseFloat(value);
        const productoBuscado = listaProductos.find(prod => prod.id === numero);
    
        if (productoBuscado) {
            const primeraUnidad = productoBuscado.unidades[0];
            setProducto(prevState => ({
                ...prevState,
                descripcion: productoBuscado.nombreProducto,
                codigo: productoBuscado.id,
                unidad: primeraUnidad.nombreUnidad,
                unidad_id: primeraUnidad.id,
                existencias: primeraUnidad.existencias,
                precioUnitario: parseFloat(primeraUnidad.precioVenta),
                cantidad: '',
                total: ''
            }));
            setUnidadesDisponibles(productoBuscado.unidades);
        } else {
            setProducto(prevState => ({
                ...prevState,
                descripcion: '',
                unidad: '',
                existencias: 0,
                precioUnitario: 0
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
        // Validar el formulario
        if(producto.cantidad > producto.existencias){
            const errorNotification = (
                <Notification title="Error" type="danger">
                    {`No hay suficientes existencias`}
                </Notification>
            );
            toast.push(errorNotification);
            return false;
        }else      
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
                codigo: productoSeleccionado.id,
                unidad: productoSeleccionado.unidades[0].nombreUnidad,
                existencias: productoSeleccionado.unidades[0].existencias,
                precioUnitario: productoSeleccionado.unidades[0].precioVenta,
                cantidad: '',
                total: ''
            });
            setUnidadesDisponibles(productoSeleccionado.unidades);
        }
    };

    const handleUnidadChange = (selectedOption) => {
        const unidadSeleccionada = unidadesDisponibles.find(
            unidad => unidad.id === selectedOption.value,
        );

        if (unidadSeleccionada) {
            setProducto({
                ...producto,
                unidad_id: selectedOption.value,
                unidad: selectedOption.label,
                existencias: unidadSeleccionada.existencias,
                precioUnitario: unidadSeleccionada.precioVenta
            });
        }
    };
    const clearFields = () => {
        setProducto({
            cantidad: '',
            codigo: '',
            descripcion: '',
            existencias: '',
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
            <div className="grid grid-cols-1 gap-4 text-black">
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
                        <label>Existencias</label>
                        <Input
                            type="number"
                            name="existencias"
                            value={producto.existencias}
                            onChange={handleProductoChange}
                            readOnly
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Cantidad</label>
                        <Input
                            type="number"
                            name="cantidad"
                            value={producto.cantidad}
                            onChange={handleProductoChange}
                        />
                    </div>
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
                    Agregar al pedido
                </Button>
            </div>
        </Dialog>
    );
};

export default ProductoDialog;
