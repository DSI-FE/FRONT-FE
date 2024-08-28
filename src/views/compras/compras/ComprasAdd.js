import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Card, Select, Notification, toast } from "components/ui";
import ProductoDialog from './ProductoDialog';
import { apiGetProveedores } from 'services/ProveedorService';
import { HiTrash } from 'react-icons/hi';
import { apiCreateCompra } from 'services/ComprasService';

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
        percepcion: 0,
        exentas: 0,
        gravadas: 0,
        iva: 0,
        total: 0,
        productos: []
    });

    const [productoDialogOpen, setProductoDialogOpen] = useState(false);
    const [productosList, setProductosList] = useState([]);
    const [listaProveedor, setListaProveedor] = useState([]);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await apiGetProveedores();
                if (response.data && Array.isArray(response.data.data)) {
                    setListaProveedor(response.data.data);
                } else {
                    setListaProveedor([]);
                }
            } catch (error) {
                console.error("Error fetching proveedores:", error);
                setListaProveedor([]);
            }
        };
        fetchProveedores();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    const agregarProducto = (nuevoProducto) => {
        setProductosList([...productosList, nuevoProducto]);
    };

    const eliminarProducto = (index) => {
        setProductosList(productosList.filter((_, i) => i !== index));
    };

    const handleProveedoresChange = (selectedOption) => {
        const proveedorSeleccionado = listaProveedor.find(proveedor => proveedor.id === selectedOption.value);

        if (proveedorSeleccionado) {
            setCompra({
                ...compra,
                codigoProveedor: proveedorSeleccionado.id,
                nrcProveedor: proveedorSeleccionado.nrc,
                nombreProveedor: proveedorSeleccionado.nombre // Guardamos el nombre seleccionado
            });
        }
    };

    const clearFields = () => {
        setCompra({
            fecha: '',
            numeroCCF: '',
            codigoProveedor: '',
            nrcProveedor: '',
            nombreProveedor: null,
            exentas: 0,
            gravadas: 0,
            percepcion: 0,
            total: 0
        })
        setProductosList([]);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Preparar los datos antes de enviar
        const compraData = {
            fecha: compra.fecha,
            numeroCCF: compra.numeroCCF,
            ivaCompra: compra.iva,
            totalCompra: compra.total,
            proveedor_id: compra.codigoProveedor,
            comprasExentas: compra.exentas,
            comprasGravadas: compra.gravadas,
            ivaPercibido: compra.percepcion,
            productos: productosList.map(producto => ({
                producto_id: producto.codigo,
                unidad_medida_id: producto.unidad_id,
                costo: producto.precioUnitario,
                iva: producto.iva,
                total: producto.total,
                cantidad: producto.cantidad
            }))
        };


        try {
            await apiCreateCompra(compraData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    La compra se guardó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al guardar la compra.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al guardar la compra:', error);
        }

        clearFields();
    };

    useEffect(() => {
        const calcularTotalCompra = () => {
            return productosList.reduce((acc, producto) => acc + parseFloat(producto.total), 0).toFixed(2);
        };

        setCompra(prevCompra => ({
            ...prevCompra,
            gravadas: (calcularTotalCompra()),
            iva: (calcularTotalCompra() * 0.13).toFixed(2),
            total: (calcularTotalCompra() * 1.13).toFixed(2)
        }));
    }, [productosList]);

    return (
        <div>
            <Card headerClass="bg-gray-200" header="Detalle de crédito fiscal" className="mb-4 border-blue-600">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Fecha</label>
                        <Input
                            type="date" // Mantener como "date"
                            name="fecha"
                            value={compra.fecha}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Número de CCF</label>
                        <Input
                            type="text" // Cambiar a "text" para aceptar letras y números
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
                            readOnly
                        />
                    </div>
                    <div>
                        <label>NRC</label>
                        <Input
                            type="text"
                            name="nrcProveedor"
                            value={compra.nrcProveedor}
                            readOnly
                        />
                    </div>
                </div>
                <div>
                    <label>Nombre</label>
                    <Select
                        id="nombreProveedor"
                        value={compra.nombreProveedor ? { value: compra.nombreProveedor, label: compra.nombreProveedor } : null}
                        onChange={handleProveedoresChange}
                        options={listaProveedor.map(proveedor => ({
                            value: proveedor.id,
                            label: proveedor.nombre
                        }))}
                    />
                </div>
            </Card>

            <Card headerClass="bg-gray-200" header="Detalles de productos" className="mb-4 border-blue-600">
                <div className="grid grid-cols-9 gap-4">
                    <Button
                        onClick={() => setProductoDialogOpen(true)}
                        size="sm"
                        variant="solid"
                        className="flex items-center bg-green-500 hover:bg-green-400 active:bg-green-700 mt-6 w-40"
                    >
                        Agregar producto
                    </Button>
                </div>

                <Table>
                    <THead>
                        <Tr>
                            <Th>N°</Th>
                            <Th>Código</Th>
                            <Th>Cantidad</Th>
                            <Th>Descripción del producto</Th>
                            <Th>Unidad</Th>
                            <Th>Precio unitario</Th>
                            <Th>Total</Th>
                            <Th>Acción</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {productosList.map((prod, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{prod.codigo}</Td>
                                <Td>{prod.cantidad}</Td>
                                <Td>{prod.descripcion}</Td>
                                <Td>{prod.unidad}</Td>
                                <Td>{"$ " + prod.precioUnitario}</Td>
                                <Td>{"$ " + prod.total}</Td>
                                <Td>
                                    <Button
                                        className="bg-red-500 hover:bg-red-400 active:bg-red-700"
                                        title="Eliminar datos"
                                        size="xs"
                                        variant="solid"
                                        icon={<HiTrash />}
                                        onClick={() => eliminarProducto(index)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </Card>

            <Card headerClass="bg-gray-200" header="Resumen de la compra" className="mb-4 border-blue-600">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-end w-full">
                        <span className="font-semibold w-1/2 text-right">Ventas Exentas:</span>
                        <Input
                            type="number"
                            name="exentas"
                            value={compra.exentas}
                            onChange={handleInputChange}
                            className="text-right w-1/3"
                        />
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <span className="font-semibold w-1/2 text-right">Ventas gravadas:</span>
                        <Input
                            type="number"
                            name="gravadas"
                            value={compra.gravadas}
                            onChange={handleInputChange}
                            className="text-right w-1/3"
                        />
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <span className="font-semibold w-1/2 text-right">IVA crédito fiscal:</span>
                        <Input
                            type="number"
                            name="iva"
                            value={compra.iva}
                            onChange={handleInputChange}
                            className="text-right w-1/3"
                        />
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <span className="font-semibold w-1/2 text-right">Percepción 1%:</span>
                        <Input
                            type="number"
                            name="percepcion"
                            value={compra.percepcion}
                            onChange={handleInputChange}
                            className="text-right w-1/3"
                        />
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <span className="font-semibold w-1/2 text-right">Total:</span>
                        <Input
                            type="number"
                            name="total"
                            value={compra.total}
                            onChange={handleInputChange}
                            className="text-right w-1/3"
                        />
                    </div>
                </div>
            </Card>

            <Button
                size="sm"
                variant="solid"
                className="flex items-center justify-center bg-green-500 hover:bg-green-400 active:bg-green-700 mt-6 w-40 text-center"
                onClick={handleSubmit}>
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
