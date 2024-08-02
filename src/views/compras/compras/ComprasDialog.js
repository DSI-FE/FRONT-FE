import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";

const ComprasDialog = ({ isOpen, onClose, compra }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [detalleCompra, setDetalleCompra] = useState(null);

    useEffect(() => {
        if (compra) {
            setDetalleCompra(compra);
        }
    }, [compra]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <h2 style={{marginBottom:'25px', marginTop:'2px'}}>
                Detalle de la compra
            </h2>
            <Table style={{ borderCollapse: 'collapse', marginBottom:'30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Fecha:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.fecha}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px',  fontWeight: 'bold' }}>
                            Numero CCF:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.numeroCCF}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            NRC:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.proveedor.nrc}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Proveedor:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.proveedor_nombre}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Compras Exentas:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.comprasExentas}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Compras Gravadas:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.comprasGravadas}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            IVA:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.ivaCompra}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            IVA Percibido:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.ivaPercibido}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Total:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCompra && detalleCompra.totalCompra}
                        </Td>
                    </Tr>
                </TBody>
            </Table>
        </Dialog>
    );
};

export default ComprasDialog;
