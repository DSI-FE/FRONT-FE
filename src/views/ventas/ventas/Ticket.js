import React, { useEffect, useState } from 'react';
import { apiGetDTE } from 'services/DTEServices';

const Ticket = ({ idDTE}) => {

    const [dataDTE, setDataDTE] = useState({
        id: '',
        fechaGeneracion: '',
        codigoGeneracion: '',
        numeroControl: '',
        selloRecepcion: '',
        tipo_documento: '',
        modelo_facturacion: '',
        tipo_transmision: '',
        cliente: {
            nombre: '',
            direccion: '',
            municipio: '',
            departamento: '',
            correo: ''
        },
        articulos: [],
        totalGravadas: 0,
        totalExentas: 0,
        totalPagar: 0,
        emisor: {
            nombre: '',
            nit: '',
            nrc: '',
            actividadEconomica: '',
            direccion: '',
            telefono: '',
            correo: ''
        }
    });
    

    const handlePrint = () => {
        window.print();
    };

useEffect(() => {
    const fetchDTE = async (id) => {
        try {
            const response = await apiGetDTE(id);
            const data = response.data;
            
            setDataDTE({
                id: data.data.id,
                modelo_facturacion: data.data.modelo_facturacion,
                tipo_transmision: data.data.tipo_transmision,
                fechaGeneracion: data.data.fecha + ' ' + data.data.hora,
                codigoGeneracion: data.data.codigo_generacion,
                numeroControl: data.data.numero_control,
                selloRecepcion: data.data.sello_recepcion,
                tipo_documento: data.data.tipo.nombre,
                cliente: {
                    nombre: data.data.ventas.cliente.nombres + ' ' + data.data.ventas.cliente.apellidos,
                    direccion: data.data.ventas.cliente.direccion,
                    municipio: data.data.ventas.cliente.municipality_name,
                    departamento: data.data.ventas.cliente.department_name,
                    correo: data.data.ventas.cliente.correoElectronico
                },
                articulos: data.detalle.map(item => ({
                    id: item.id,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    iva: item.iva,
                    total: item.total,
                    producto: item.producto.nombre_producto,
                    unidad: item.producto.unidad.nombreUnidad
                })),
                totalGravadas: data.data.ventas.total_gravadas,
                totalExentas: data.data.ventas.total_exentas,
                totalPagar: data.data.ventas.total_pagar,
                emisor: {
                    nombre: data.emisor.nombre_comercial,
                    nit: data.emisor.nit,
                    nrc: data.emisor.nrc,
                    actividadEconomica: data.emisor.economic_activity_name,
                    direccion: data.emisor.direccion,
                    telefono: data.emisor.telefono,
                    correo: data.emisor.correo
                }
            });
            
        } catch (error) {
            console.error("Error fetching DTE", error);
        }
    };

    if (idDTE) {
        fetchDTE(idDTE);
    }
}, [idDTE]);


    return (
        <div className="ticket-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
             <div style={{ textAlign: 'center', marginTop: '20px', backgroundColor: 'gray' }}>
                <button
                    onClick={handlePrint}
                    style={{ color: 'white', padding: '10px 20px', cursor: 'pointer' }}>
                    Imprimir Ticket</button>
            </div>
            <div style={{fontFamily: 'Consolas',  maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
            <h3 style={{ textAlign: 'center' }}>{dataDTE.emisor.nombre}</h3>
            <p>{dataDTE.emisor.actividadEconomica}</p>
            <p>NRC: {dataDTE.emisor.nrc} NIT: {dataDTE.emisor.nit}</p>
            <p>Teléfono: {dataDTE.emisor.telefono}</p>
            <p>Correo: {dataDTE.emisor.correo}</p>
            <hr />
            <p style={{ textAlign: 'center', backgroundColor:'black', color: 'white'}}><strong> DETALLE DEL DTE </strong></p>
            <p>Tipo: {dataDTE.tipo_documento}</p>
            <p>Modelo de facturación: {dataDTE.modelo_facturacion}  Tipo de transmisión: {dataDTE.tipo_transmision}</p>
            <p>Fecha de generación: {dataDTE.fechaGeneracion}</p>
            <p>Código de generación: {dataDTE.codigoGeneracion}</p>
            <p>Número de Control: {dataDTE.numeroControl}</p>
            <p>Sello de recepción: {dataDTE.selloRecepcion}</p>
            <hr />
            <p style={{ textAlign: 'center', backgroundColor:'black', color: 'white' }}><strong> DATOS DEL CLIENTE </strong></p>
            <p>Cliente: {dataDTE.cliente.nombre}</p>
            <p>Dirección: {dataDTE.cliente.direccion}</p>
            <p>Municipio: {dataDTE.cliente.municipio}</p>
            <p>Departamento: {dataDTE.cliente.departamento}</p>
            <p>Correo: {dataDTE.cliente.correo}</p>
            <hr />
            <p style={{ textAlign: 'center', backgroundColor:'black', color: 'white', fontFamily: 'Consolas' }}><strong> DETALLE DE LA VENTA </strong></p>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Cant.</th>
                        <th>Artículo</th>
                        <th>Precio/u</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                {dataDTE.articulos.map((articulo) => (
                        <tr key={articulo.id}>
                            <td>{articulo.cantidad}</td>
                            <td>{articulo.producto+'-'+articulo.unidad}</td>
                            <td>${articulo.precio.toFixed(2)}</td>
                            <td>${articulo.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <p style={{textAlign: 'right'}}>Total gravadas: ${dataDTE.totalPagar}</p>
            <p style={{textAlign: 'right'}}>Total exentas: ${dataDTE.totalExentas}</p>
            <p style={{textAlign: 'right'}}><strong>Total a pagar: ${dataDTE.totalPagar}</strong></p>
            <hr /><br/><br/>
            <p style={{ textAlign: 'center' }}>**** GRACIAS POR SU COMPRA ****</p>
            <p style={{ textAlign: 'center' }}>LO ESPERAMOS PRONTO</p>
            </div>
        </div>
    );
};

export default Ticket;
