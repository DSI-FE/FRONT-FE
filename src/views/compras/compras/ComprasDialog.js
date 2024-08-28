import React, { useState, useEffect } from 'react';
import { Dialog, Table } from "components/ui";
import { apiGetCompraBy } from 'services/ComprasService';

const ComprasDialog = ({ isOpen, onClose, compra }) => {
    const { Tr, Th, Td, TBody } = Table;
    const [compraData, setCompraData] = useState(null);

    const numeroCcf = compra?.numeroCCF;

    useEffect(() => {
        const fetchCompraDetalles = async (ccf) => {
            try {
                const response = await apiGetCompraBy(ccf);
                setCompraData(response.data);
            } catch (error) {
                console.error("Error fetching detalle de compra:", error);
            }
        };

        if (numeroCcf) {
            fetchCompraDetalles(numeroCcf);
        }
    }, [numeroCcf]);

    if (!compraData) {
        return <p>Cargando detalles de la compra...</p>;
    }

    const { compra: compraInfo, detalles } = compraData.data;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={800}>
            <h2 style={{ marginBottom: '25px', marginTop: '2px', textAlign: 'center' }}>
                Detalle de la Compra
            </h2>
            <Table style={{ borderCollapse: 'collapse', marginBottom: '30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Fecha:</Th>
                        <Td style={{ padding: '8px' }}>{compraInfo.fecha}</Td>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Número CCF:</Th>
                        <Td style={{ padding: '8px' }}>{compraInfo.numeroCCF}</Td>
                    </Tr>
                    <Tr>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>NRC:</Th>
                        <Td style={{ padding: '8px' }}>{compraInfo.proveedor.nrc}</Td>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Proveedor:</Th>
                        <Td style={{ padding: '8px' }}>{compraInfo.proveedor.nombre}</Td>
                    </Tr>
                </TBody>
            </Table>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '30px' }}>
                <Table style={{ borderCollapse: 'collapse' }}>
                    <TBody>
                        <Tr>
                            <Th style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#c0e2f9' }}>Cantidad</Th>
                            <Th style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#c0e2f9' }}>Producto</Th>
                            <Th style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#c0e2f9' }}>Unidad de medida</Th>
                            <Th style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#c0e2f9' }}>Costo</Th>
                            <Th style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#c0e2f9' }}>Total</Th>
                        </Tr>
                        {detalles.map((detalle, index) => (
                            <Tr key={index}>
                                <Td style={{ padding: '8px', textAlign: 'center' }}>{detalle.cantidad}</Td>
                                <Td style={{ padding: '8px', textAlign: 'center' }}>{detalle.producto?.nombreProducto}</Td>
                                <Td style={{ padding: '8px', textAlign: 'center' }}>{detalle.unidad_medida}</Td>
                                <Td style={{ padding: '8px', textAlign: 'center' }}>{detalle.costo}</Td>
                                <Td style={{ padding: '8px', textAlign: 'center' }}>{detalle.total}</Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
            <Table style={{ borderCollapse: 'collapse', marginBottom: '30px' }}>
                <TBody>
                    <Tr>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Compras Exentas</Th>
                        <Td style={{ padding: '8px', textAlign: 'center' }}>{"$" + compraInfo.comprasExentas}</Td>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Compras Gravadas</Th>
                        <Td style={{ padding: '8px', textAlign: 'center' }}>{"$" + compraInfo.comprasGravadas}</Td>
                    </Tr>
                    <Tr>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>IVA percibido</Th>
                        <Td style={{ padding: '8px', textAlign: 'center' }}>{"$" + compraInfo.ivaPercibido}</Td>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>IVA</Th>
                        <Td style={{ padding: '8px', textAlign: 'center' }}>{"$" + compraInfo.ivaCompra}</Td>
                    </Tr>
                    <Tr>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}></Th>
                        <Td style={{ padding: '8px' }}>{}</Td>
                        <Th style={{ padding: '8px', fontWeight: 'bold' }}>Total</Th>
                        <Td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{"$" + compraInfo.totalCompra}</Td>
                    </Tr>
                </TBody>
            </Table>
        </Dialog>
    );
};

export default ComprasDialog;
