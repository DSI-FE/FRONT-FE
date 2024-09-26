import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Card, Select, Notification, toast } from "components/ui";
import { HiTrash, HiPencil } from 'react-icons/hi';
import { apiGetVentaBy, apiUpdateVentas } from 'services/VentasService';
import ProductoDialog from './ProductoDialog';
import { apiGetCondicion, apiGetDocumento, apiGetListaClientes } from 'services/DTEServices';
import CambioDialog from './CambioDialog';

const { Tr, Th, Td, THead, TBody } = Table;

const VentasEdit = ({ ventaId }) => {
    const [venta, setVenta] = useState({
        id: '',
        fecha: '',
        nombre_cliente: '',
        total_no_sujetas: 0,
        total_exentas: 0,
        total_gravadas: '',
        total_iva: '',
        condicion: '',
        nombre_condicion: '',
        nombre_documento: '',
        tipo_documento: '',
        cliente_id: '',
        productos: []
    });
    const [productoDialogOpen, setProductoDialogOpen] = useState(false);
    const [cambioDialogOpen, setCambioDialogOpen] = useState(false);
    const [productosList, setProductosList] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaCondicion, setListaCondicion] = useState([]);
    const [listaDocumentos, setListaDocumentos] = useState([]);
    const [enabledFacturar, setEnabledFacturar] = useState(false);
    const [enabledComponents, setEnabledComponents] = useState(true) // inician los componentes deshabiliatdos
 
    useEffect(() => {
        //hacer la consulta de la api para una venta especifica
        const fetchVenta = async (id) => {
            try {
                const response = await apiGetVentaBy(id);
                const detalleVenta = response.data.data.detalles;
                const ventaInfo = response.data.data.venta[0];

                setVenta({
                    fecha: ventaInfo.fecha,
                    cliente_id: ventaInfo.cliente_id,
                    nombre_cliente: ventaInfo.cliente_nombre,
                    tipo_documento: ventaInfo.tipo_documento.id,
                    nombre_documento: ventaInfo.tipo_documento.nombre,
                    condicion: ventaInfo.condicion.id,
                    nombre_condicion: ventaInfo.condicion.nombre,
                    total: ventaInfo.total_pagar,
                    productos: detalleVenta.map(detalle => ({
                        producto_id: detalle.producto.producto_id,
                        cantidad: detalle.cantidad,
                        unidad_medida_id: detalle.producto.unidad_medida_id,
                        precio: detalle.precio,
                        iva: detalle.iva,
                        total: detalle.total,
                    }))
                });
                //productos que se mostraran en la tabla
                const productosTabla = detalleVenta.map(detalle => ({
                    producto_id: detalle.producto.producto.id,
                    codigo: detalle.producto.producto.id,
                    cantidad: detalle.cantidad,
                    unidad_medida_id: detalle.producto.unidad_medida_id,
                    precio: detalle.precio,
                    iva: detalle.iva,
                    total: detalle.total,
                    descripcion: detalle.producto.nombre_producto,
                    unidad: detalle.producto.unidad_medida,
                    precioUnitario: detalle.precio.toFixed(2)
                }));
                setProductosList(productosTabla);
            } catch (error) {
                console.log("Error fetching venta", error);
            }
        };

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

        //Condiciones de la operacion
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

        //Tipo de documento
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

        if (ventaId) {
            fetchVenta(ventaId);
        }
        
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
                    codigo: clienteBuscado.id,
                    nombre_cliente: clienteBuscado.nombres + ' ' + clienteBuscado.apellidos,

                }));
            } else {
                venta.nombre_cliente = ''
            }
        }
    };

    const agregarProducto = (nuevoProducto) => {
        setProductosList([...productosList, nuevoProducto]);
    };

    const generarVenta = () => {
        
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

    //Select de la condicion de la operacion
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
        //Limpia los campos y habilita los botones
      //  clearFields();
      setCambioDialogOpen(true)

    }

    //Select del tipo de documento
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

    const onEdit = () => {
        setEnabledComponents(!enabledComponents);
        setEnabledFacturar(true);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setEnabledComponents(!enabledComponents);
        setEnabledFacturar(false);



        //Preparar los datos antes de enviar
        const ventaData = {
            fecha: venta.fecha,
            total_no_sujetas: 0,
            total_exentas: 0,
            total_iva: venta.iva,
            total_gravadas: venta.gravadas,
            total_pagar: venta.total,
            cliente_id: venta.cliente_id,
            condicion: venta.condicion,
            tipo_documento: venta.tipo_documento,
            productos: productosList.map(producto => ({
                producto_id: producto.producto_id, //existentes
                unidad_medida_id: producto.unidad_medida_id, //existentes
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
            // clearFields();
            //prueba del boton
            // setIsDisabled(true)
        } catch (error) {
            const errorNotification = (
                <Notification title="Error" type="danger">
                    Ocurrió un error al actualizar la venta.
                </Notification>
            );
            toast.push(errorNotification);
        }
    };

    useEffect(() => {
        const calcularTotalCompra = () => {
            return productosList.reduce((acc, producto) => acc + parseFloat(producto.total), 0).toFixed(2);
        };

        setVenta(prevCompra => ({
            ...prevCompra,
            gravadas: (calcularTotalCompra() / 1.13).toFixed(2),
            iva: ((calcularTotalCompra() / 1.13) * 0.13).toFixed(2),
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
                            disabled={enabledComponents}
                        />
                    </div>
                    <div>
                        <label>Tipo de documento</label>
                        <Select
                            id="condicion"
                            value={venta.nombre_documento ? { value: venta.nombre_documento, label: venta.nombre_documento } : null}
                            onChange={handleDocumentoChange}
                            options={listaDocumentos.map(con => ({
                                value: con.id,
                                label: con.nombre
                            }))}
                            isDisabled={enabledComponents}
                        />
                    </div>
                    <div>
                        <label>Condición de la venta</label>
                        <Select
                            id="condicion"
                            value={venta.nombre_condicion ? { value: venta.nombre_condicion, label: venta.nombre_condicion } : null}
                            onChange={handleCondicionChange}
                            options={listaCondicion.map(con => ({
                                value: con.id,
                                label: con.nombre
                            }))}
                            isDisabled={enabledComponents}
                        />
                    </div>
                </div>
            </Card>

            <Card headerClass="bg-gray-200" header="Datos del cliente" className="mb-4 border-blue-600">
                <div className=" gap-1 flex row text-black">
                    <div>
                        <label>Código</label>
                        <Input
                            type="number"
                            name="cliente_id"
                            value={venta.cliente_id}
                            onChange={handleInputChange}
                            disabled={enabledComponents}
                        />
                    </div>

                    <div className="w-full text-black">
                        <label>Nombre del cliente</label>
                        <Select
                            id="nombre_cliente"
                            value={venta.nombre_cliente ? { value: venta.nombre_cliente, label: venta.nombre_cliente } : null}
                            onChange={handleClientesChange}
                            options={listaClientes.map(proveedor => ({
                                value: proveedor.id,
                                label: `${proveedor.nombres} ${proveedor.apellidos}`
                            }))}
                            isDisabled={enabledComponents}
                        />
                    </div>
                </div>
            </Card>

            <Card headerClass="bg-gray-200" header="Detalles de productos" className="mb-4 border-blue-600 text-black" >
                <div className="grid grid-cols-9 gap-4">
                    <Button
                        onClick={() => setProductoDialogOpen(true)}
                        size="sm"
                        variant="solid"
                        style={{ display: !enabledComponents ? 'block' : 'none' }}
                        className="flex items-center bg-green-500 hover:bg-green-400 active:bg-green-700 mt-6 w-40 border border-black"
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
                                <Td>{"$ " + prod.total.toFixed(2)}</Td>
                                <Td className="flex justify-start items-center">
                                    <Button
                                        className="bg-red-500 hover:bg-red-400 active:bg-red-700 mr-2"
                                        title="Eliminar datos"
                                        size="xs"
                                        variant="solid"
                                        icon={<HiTrash />}
                                        style={{ display: !enabledComponents ? 'block' : 'none' }}
                                        onClick={() => eliminarProducto(index)}
                                    />
                                </Td>

                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </Card>

            <Card headerClass="bg-gray-200" header="Resumen de la venta" className="mb-4 border-blue-600 text-black">
                <div className="flex flex-col gap-2">

                    <div className="flex items-center justify-end w-full">
                        <span className="font-bold w-1/2 text-right">Total a pagar:</span>
                        <Input
                            type="number"
                            name="total"
                            value={venta.total}
                            onChange={handleInputChange}
                            className="text-right w-1/3 font-semibold"
                            readOnly
                        />
                    </div>
                </div>
            </Card>

            <div className="flex flex-row items-center gap-4 mt-6">
                <Button
                    size="sm"
                    variant="solid"
                    disabled={enabledComponents}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-400 active:bg-green-700 w-40 text-center border border-black"
                    onClick={handleSubmit}>
                    MODIFICAR PEDIDO
                </Button>
                <Button
                    title='Editar datos'
                    size="sm"
                    variant="solid"
                    className="flex items-center justify-center bg-blue-500 hover:bg-blue-400 active:bg-blue-700 w-10 text-center border border-black"
                    onClick={onEdit}
                    style={{ display: enabledComponents ? 'block' : 'none' }}
                    icon={< HiPencil />}
                />
                <Button
                    size="sm"
                    variant="solid"
                    className="flex items-center justify-center bg-green-500 hover:bg-green-400 active:bg-green-700 w-40 text-center border border-black ml-auto"
                    onClick={facturar}
                    disabled={enabledFacturar}
                >
                    FACTURAR VENTA
                </Button>
            </div>
            <ProductoDialog
                isOpen={productoDialogOpen}
                onClose={() => setProductoDialogOpen(false)}
                onSave={agregarProducto}
            />
            <CambioDialog
                isOpen={cambioDialogOpen}
                onClose={() => setCambioDialogOpen(false)}
                onSave={generarVenta}
                vVenta={venta}
                ventaId={ventaId}
                limpiarCampos={clearFields}
            />

        </div>
    );
};

export default VentasEdit;
