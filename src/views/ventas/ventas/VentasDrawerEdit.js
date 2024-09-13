import React, { useState, useEffect } from "react";
import { Input, Button, Table, Card, Drawer, Select, Notification, toast } from 'components/ui';
import { HiTrash } from 'react-icons/hi';
import { apiUpdateVentas, apiGetVentaBy, apiGetVentas } from 'services/VentasService';
import ProductoDialog from './ProductoDialog';
import { apiGetCondicion, apiGetDocumento, apiGetListaClientes } from 'services/DTEServices';

const { Tr, Th, Td, THead, TBody } = Table;
const VentasDrawerEdit = ({ isOpen, setIsOpen, ventaId }) => {
    const [venta, setVenta] = useState({
        fecha: '',
        nombre_cliente: '',
        total_no_sujetas: '',
        total_exentas: '',
        total_gravadas: '',
        total_iva: '',
        condicion: 1,
        nombre_condicion: '',
        nombre_documento: '',
        tipo_documento: '',
        cliente_id: '',
        productos: []
    });
    
    const [productoDialogOpen, setProductoDialogOpen] = useState(false);
    const [productosList, setProductosList] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaCondicion, setListaCondicion] = useState([]);
    const [listaDocumentos, setListaDocumentos] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await apiGetListaClientes();
                if (response.data && Array.isArray(response.data.data)) {
                    setListaClientes(response.data.data);
                } else {
                    setListaClientes([]);
                }
            } catch (error) {
                console.error("Error fetching clientes:", error);
                setListaClientes([]);
            }
        };
        fetchClientes();

        const fetchCondicion = async () => {
            try {
                const response = await apiGetCondicion();
                if (response.data && Array.isArray(response.data.data)) {
                    setListaCondicion(response.data.data);
                } else {
                    setListaCondicion([]);
                }
            } catch (error) {
                console.error("Error fetching condicion:", error);
                setListaCondicion([]);
            }
        };
        fetchCondicion();

        const fetchDocumento = async () => {
            try {
                const response = await apiGetDocumento();
                if (response.data && Array.isArray(response.data.data)) {
                    setListaDocumentos(response.data.data);
                } else {
                    setListaDocumentos([]);
                }
            } catch (error) {
                console.error("Error fetching documentos:", error);
                setListaDocumentos([]);
            }
        };
        fetchDocumento();

        const fetchVenta = async () => {
            try {
                const response = await apiGetVentas(ventaId);
                if (response.data) {
                    setVenta(response.data);
                    setProductosList(response.data.productos || []);
                }
            } catch (error) {
                console.error("Error fetching venta:", error);
            }
        };
        fetchVenta();
    }, [ventaId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVenta(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'cliente_id') {
            const numero = parseInt(value);
            const clienteBuscado = listaClientes.find(cliente => cliente.id === numero);
            if (clienteBuscado) {
                setVenta(prevState => ({
                    ...prevState,
                    nombre_cliente: clienteBuscado.nombres + ' ' + clienteBuscado.apellidos,
                }));
            } else {
                setVenta(prevState => ({
                    ...prevState,
                    nombre_cliente: ''
                }));
            }
        }
    };

    const agregarProducto = (nuevoProducto) => {
        setProductosList([...productosList, nuevoProducto]);
    };

    const eliminarProducto = (index) => {
        setProductosList(productosList.filter((_, i) => i !== index));
    };

    const handleClientesChange = (selectedOption) => {
        const clienteSeleccionado = listaClientes.find(cliente => cliente.id === selectedOption.value);

        if (clienteSeleccionado) {
            setVenta({
                ...venta,
                cliente_id: clienteSeleccionado.id,
                nombre_cliente: clienteSeleccionado.nombres + ' ' + clienteSeleccionado.apellidos
            });
        }
    };

    const handleCondicionChange = (selectedOption) => {
        const condicionSeleccionada = listaCondicion.find(con => con.id === selectedOption.value);

        if (condicionSeleccionada) {
            setVenta({
                ...venta,
                condicion: condicionSeleccionada.id,
                nombre_condicion: condicionSeleccionada.nombre
            });
        }
    };

    const facturar = () => {
        //estará disponible próximamente
    }

    const handleDocumentoChange = (selectedOption) => {
        const docSeleccionado = listaDocumentos.find(doc => doc.id === selectedOption.value);

        if (docSeleccionado) {
            setVenta({
                ...venta,
                tipo_documento: docSeleccionado.id,
                nombre_documento: docSeleccionado.nombre
            });
        }
    };

    const clearFields = () => {
        setVenta({
            fecha: '',
            nombre_cliente: '',
            total_no_sujetas: '',
            total_exentas: '',
            total_gravadas: '',
            total_iva: '',
            condicion: 1,
            nombre_condicion: '',
            nombre_documento: '',
            tipo_documento: '',
            cliente_id: '',
            productos: []
        });
        setProductosList([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ventaData = {
            fecha: venta.fecha,
            total_no_sujetas: 0,
            total_exentas: 0,
            total_iva: venta.total_iva,
            total_gravadas: venta.total_gravadas,
            total_pagar: venta.total,
            cliente_id: venta.cliente_id,
            condicion: venta.condicion,
            tipo_documento: venta.tipo_documento,
            productos: productosList.map(producto => ({
                producto_id: producto.codigo,
                unidad_medida_id: producto.unidad_medida_id,
                precio: producto.precioUnitario,
                iva: producto.iva,
                total: producto.total,
                cantidad: producto.cantidad
            }))
        };

        try {
            await apiUpdateVentas(ventaId, ventaData);
            const toastNotification = (
                <Notification title="Completado" type="success">
                    La venta se actualizó exitosamente.
                </Notification>
            );
            toast.push(toastNotification);
            clearFields();
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al actualizar la venta.
                </Notification>
            );
            toast.push(errorNotification);
            console.error('Error al actualizar la venta:', error);
        }
    };

    useEffect(() => {
        const calcularTotalCompra = () => {
            return productosList.reduce((acc, producto) => acc + parseFloat(producto.total), 0).toFixed(2);
        };

        setVenta(prevCompra => ({
            ...prevCompra,
            total_gravadas: (calcularTotalCompra() / 1.13).toFixed(2),
            total_iva: ((calcularTotalCompra() / 1.13) * 0.13).toFixed(2),
            total: (calcularTotalCompra())
        }));
    }, [productosList]);

    return (
        <div>
            <Card headerClass="bg-gray-200" header="Detalles de la venta" className="mb-4 border-blue-600 text-black">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Fecha</label>
                        <Input
                            type="date"
                            name="fecha"
                            value={venta.fecha}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Tipo de documento</label>
                        <Select
                            id="tipo_documento"
                            value={venta.nombre_documento ? { value: venta.tipo_documento, label: venta.nombre_documento } : null}
                            onChange={handleDocumentoChange}
                            options={listaDocumentos.map(con => ({
                                value: con.id,
                                label: con.nombre
                            }))}
                        />
                    </div>
                    <div>
                        <label>Condición de la venta</label>
                        <Select
                            id="condicion"
                            value={venta.nombre_condicion ? { value: venta.condicion, label: venta.nombre_condicion } : null}
                            onChange={handleCondicionChange}
                            options={listaCondicion.map(con => ({
                                value: con.id,
                                label: con.nombre
                            }))}
                        />
                    </div>
                    <div>
                        <label>Cliente</label>
                        <Select
                            id="cliente_id"
                            value={venta.nombre_cliente ? { value: venta.cliente_id, label: venta.nombre_cliente } : null}
                            onChange={handleClientesChange}
                            options={listaClientes.map(cliente => ({
                                value: cliente.id,
                                label: cliente.nombres + ' ' + cliente.apellidos
                            }))}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <Button onClick={() => setProductoDialogOpen(true)}>Agregar Producto</Button>
                </div>
            </Card>
            <Card headerClass="bg-gray-200" header="Productos" className="mb-4 border-blue-600 text-black">
                <Table>
                    <THead>
                        <Tr>
                            <Th>Producto</Th>
                            <Th>Cantidad</Th>
                            <Th>Precio Unitario</Th>
                            <Th>Total</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {productosList.map((producto, index) => (
                            <Tr key={index}>
                                <Td>{producto.nombre}</Td>
                                <Td>{producto.cantidad}</Td>
                                <Td>{producto.precioUnitario}</Td>
                                <Td>{producto.total}</Td>
                                <Td>
                                    <Button onClick={() => eliminarProducto(index)}><HiTrash /></Button>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </Card>
            <div className="flex justify-between mb-4">
                <div className="text-lg font-semibold">Total: {venta.total}</div>
                <Button onClick={handleSubmit} color="primary">Actualizar Venta</Button>
            </div>
            <ProductoDialog
                open={productoDialogOpen}
                onClose={() => setProductoDialogOpen(false)}
                onProductoAgregado={agregarProducto}
            />
        </div>
    );
};

export default VentasDrawerEdit;
