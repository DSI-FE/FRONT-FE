import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";

const ClienteDialog = ({ isOpen, onClose, cliente }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [detalleCliente, setDetalleCliente] = useState(null);

    useEffect(() => {
        if (cliente) {
            setDetalleCliente(cliente);
        }
    }, [cliente]);

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={500}>
            <h2 style={{marginBottom:'25px', marginTop:'2px'}}>
                Detalle del Cliente
            </h2>
            <Table style={{ borderCollapse: 'collapse', marginBottom:'30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Código:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.codigo}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px',  fontWeight: 'bold' }}>
                            Nombres:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.nombres}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Apellidos:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.apellidos}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Dirección:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.direccion}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Teléfono:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.telefono}
                        </Td>
                    </Tr>
                    <Tr>
                        <Th style={{ width: '150px', padding: '8px', fontWeight: 'bold' }}>
                            Correo Electrónico:
                        </Th>
                        <Td style={{ padding: '8px' }}>
                            {detalleCliente && detalleCliente.correoElectronico}
                        </Td>
                    </Tr>
                </TBody>
            </Table>
        </Dialog>
    );
};

export default ClienteDialog;
