import React, { useState } from 'react';
import { Dialog, Input, Button } from "components/ui";

const ProductoDialog = ({ isOpen, onClose, onSave }) => {
    const [producto, setProducto] = useState({
        codigo: '',
        descripcion: '',
        precioUnitario: 0,
        iva: 0,
        total: 0
    });

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSave = () => {
        const nuevoProducto = {
            ...producto,
            total: parseFloat(producto.precioUnitario) + parseFloat(producto.iva)
        };
        onSave(nuevoProducto);
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Agregar Producto">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label>Código</label>
                    <Input
                        type="text"
                        name="codigo"
                        value={producto.codigo}
                        onChange={handleProductoChange}
                    />
                </div>
                <div>
                    <label>Descripción del producto</label>
                    <Input
                        type="text"
                        name="descripcion"
                        value={producto.descripcion}
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
                    <label>IVA</label>
                    <Input
                        type="number"
                        name="iva"
                        value={producto.iva}
                        onChange={handleProductoChange}
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="solid" onClick={handleSave}>
                    Agregar a la tabla
                </Button>
            </div>
        </Dialog>
    );
};

export default ProductoDialog;
