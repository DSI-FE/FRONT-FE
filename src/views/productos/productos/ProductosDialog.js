import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";
import { apiGetProductosBy } from 'services/ProductosService';

const ProductosDialog = ({ isOpen, onClose, producto }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [detalleProducto, setDetalleProducto] = useState(null);

    // Asegúrate de que `producto` tiene un ID y asigna ese ID a una variable
    const productoId = producto?.id;

    useEffect(() => {
        const fetchProductoDetalles = async (id) => {
            try {
                const response = await apiGetProductosBy(id);
                setDetalleProducto(response.data);
                console.log("data", response.data)
            } catch (error) {
                console.error("Error fetching detalle de producto:", error);
            }
        };

        if (productoId) {
            fetchProductoDetalles(productoId);
        }
    }, [productoId]);

  

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <h2 style={{ marginBottom: '25px', marginTop: '2px' }}>
                Detalle del Producto
            </h2>
            {detalleProducto ? (
                <Table style={{ borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <TBody>
                        <Tr>
                            <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold', verticalAlign: 'top' }}>
                                Nombre:
                            </Th>
                            <Td colSpan={3} style={{ padding: '8px' }}>
                                {detalleProducto.nombreProducto}
                            </Td>
                        </Tr>
                        {detalleProducto.data.map((unidad, index) => (
                            <Tr key={index}>
                                <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                                    Unidad de medida:
                                </Th>
                                <Td style={{ padding: '8px' }}>
                                    {unidad.unidadMedida}
                                </Td>
                                <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                                    Equivalencia:
                                </Th>
                                <Td style={{ padding: '8px' }}>
                                    {unidad.equivalencia}
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            ) : (
                <p>Cargando detalles del producto...</p>
            )}
        </Dialog>
    );
};

export default ProductosDialog;
