import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";

const InventarioDialog = ({ isOpen, onClose, proveedor }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [detalleProveedor, setDetalleProveedor] = useState(null);

    useEffect(() => {
        if (proveedor) {
            setDetalleProveedor(proveedor);
        }
    }, [proveedor]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <h2 style={{marginBottom:'25px', marginTop:'2px'}}>
                Detalle del Proveedor
            </h2>
            <Table style={{ borderCollapse: 'collapse', marginBottom:'30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Código:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.codigo}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px',  fontWeight: 'bold' }}>
                            NRC:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.nrc}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Nombre:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.nombre}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            NIT:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.nit}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Serie:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.serie}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Tipo de Proveedor:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleProveedor && detalleProveedor.tipo_proveedor.tipo}
                        </Td>
                    </Tr>
                </TBody>
            </Table>
        </Dialog>
    );
};

export default InventarioDialog;
