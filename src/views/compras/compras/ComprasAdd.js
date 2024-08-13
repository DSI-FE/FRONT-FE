import React, { useState } from 'react';
import { Input, Button, Table, Card } from "components/ui";
import ProductoDialog from './ProductoDialog';

const { Tr, Th, Td, THead, TBody } = Table;

const ComprasAdd = () => {
    const [compra, setCompra] = useState({
        fecha: '',
        numeroCCF: '',
        codigoProveedor: '',
        nrcProveedor: '',
        nombreProveedor: '',
        clase: '',
        tipo: '',
        productos: []
    });

    const [productoDialogOpen, setProductoDialogOpen] = useState(false);
    const [productosList, setProductosList] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    const agregarProducto = (nuevoProducto) => {
        setProductosList([...productosList, nuevoProducto]);
    };

    const calcularTotalCompra = () => {
        return productosList.reduce((acc, producto) => acc + parseFloat(producto.total), 0).toFixed(2);
    };

    return (
        <div>
            <Card headerClass="bg-gray-200" header="Detalle de crédito fiscal" className="mb-4 border-blue-600">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Fecha</label>
                        <Input
                            type="date"
                            name="fecha"
                            value={compra.fecha}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Número de CCF</label>
                        <Input
                            type="text"
                            name="numeroCCF"
                            value={compra.numeroCCF}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Card>

            <Card headerClass="bg-gray-200" header="Datos del proveedor" className="mb-4 border-blue-600">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Código</label>
                        <Input
                            type="text"
                            name="codigoProveedor"
                            value={compra.codigoProveedor}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>NRC</label>
                        <Input
                            type="text"
                            name="nrcProveedor"
                            value={compra.nrcProveedor}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div>
                    <label>Nombre</label>
                    <Input
                        type="text"
                        name="nombreProveedor"
                        value={compra.nombreProveedor}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Clase</label>
                        <Input
                            type="text"
                            name="clase"
                            value={compra.clase}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Tipo</label>
                        <Input
                            type="text"
                            name="tipo"
                            value={compra.tipo}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Card>

            <Card headerClass="bg-gray-200" header="Detalles de productos" className="mb-4 border-blue-600">
                <div className="grid grid-cols-10 gap-4">
                    <Button
                        onClick={() => setProductoDialogOpen(true)}
                        size="sm"
                        variant="solid"
                        className="flex items-center bg-green-500 hover:bg-green-400 active:bg-green-700 mt-6"
                    >
                        Agregar producto
                    </Button>
                </div>

                <Table>
                    <THead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Código</Th>
                            <Th>Descripción del producto</Th>
                            <Th>Precio unitario</Th>
                            <Th>IVA</Th>
                            <Th>Total</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {productosList.map((prod, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{prod.codigo}</Td>
                                <Td>{prod.descripcion}</Td>
                                <Td>{prod.precioUnitario}</Td>
                                <Td>{prod.iva}</Td>
                                <Td>{prod.total}</Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </Card>
            <Card headerClass="bg-gray-200" header="Resumen de la compra" className="mb-4 border-blue-600">
                <div className="flex flex-col gap-2 items-start">
                    <div className="flex justify-start items-center">
                        <span className="font-semibold">Total ventas gravadas:</span>
                        <span className="ml-2">{calcularTotalCompra()}</span>
                    </div>
                    <div className="flex justify-start items-center">
                        <span className="font-semibold">IVA crédito fiscal:</span>
                        <span className="ml-2">{(calcularTotalCompra() * 0.13).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-start items-center">
                        <span className="font-semibold">Percepción 1%:</span>
                        <span className="ml-2">{(calcularTotalCompra() * 0.01).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-start items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="ml-2">{(calcularTotalCompra() * 1.13).toFixed(2)}</span>
                    </div>
                </div>
            </Card>

            <Button className="bg-blue-500 hover:bg-blue-400 active:bg-blue-700 mt-4">
                REGISTRAR
            </Button>

            <ProductoDialog
                isOpen={productoDialogOpen}
                onClose={() => setProductoDialogOpen(false)}
                onSave={agregarProducto}
            />
        </div>
    );
};

export default ComprasAdd;
