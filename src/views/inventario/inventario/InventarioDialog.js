import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";

const InventarioDialog = ({ isOpen, onClose, inventario }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [detalleInventario, setDetalleInventario] = useState(null);

    useEffect(() => {
        if (inventario) {
            setDetalleInventario(inventario);
        }
    }, [inventario]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <h2 style={{ marginBottom: '25px', marginTop: '2px' }}>
                Detalles del producto
            </h2>
            <Table style={{ borderCollapse: 'collapse', marginBottom: '30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Código:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.producto_id}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Nombre:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.nombre_producto}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Unidad de medida:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.unidad_medida}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Existencias:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.existencias}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Precio de Costo:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.precioCosto}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Precio de Venta:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleInventario && detalleInventario.precioVenta}
                        </Td>
                    </Tr>
                </TBody>
            </Table>
        </Dialog>
    );
};

export default InventarioDialog;