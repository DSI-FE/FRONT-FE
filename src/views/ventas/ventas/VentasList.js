import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { HiTrash, HiEye } from 'react-icons/hi';
import { TbFileDownload } from "react-icons/tb";
import { CgAdd } from 'react-icons/cg';
import { Button, Notification, toast } from "components/ui";
import { apiGetVentas } from 'services/VentasService';
import VentasEdit from './VentasEdit';
import VentasAdd from './VentasAdd';
import VentasDialog from './VentasDialog';
import VentasDialogDelete from './VentasDialogDelete';


const VentasList = () => {
  const [ventaList, setVentaList] = useState([]);
  //const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showList, setShowList] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchVenta = async () => {
      const ventaResponse = await apiGetVentas();
      setVentaList(ventaResponse.data);


      /* Esto es solo mientras tanto, aqui va ir la factura */


    };
    fetchVenta();
  }, []);

  const BotonesOpcion = ({ row }) => {

    const onEdit = () => {
      setSelectedVenta(row);  // Guardar la venta seleccionada
      setEditMode(true);  // Activar el modo de edición
      setShowList(false);
    };

    const onDelete = () => {
      setSelectedVenta(row);
      setDeleteDialogOpen(true);
    };

    const descargarFactura = () => {
  

    };


    return (
      <div className='flex justify-center text-center space-x-4'>
        {row.estado === 'Finalizada' ? (
          <>
            <Button className='bg-green-500 hover:bg-green-400 active:bg-green-700'
              title='Descargar factura'
              size="xs"
              variant="solid"
              icon={<TbFileDownload />}
              onClick={descargarFactura}
            />
          </>
        ) : (
          <>
            <Button
              title='Ver pedido'
              size="xs"
              variant="solid"
              icon={<HiEye />}
              onClick={onEdit}
            />
            <Button className='bg-red-500 hover:bg-red-400 active:bg-red-700'
              title='Eliminar datos'
              size="xs"
              variant="solid"
              icon={<HiTrash />}
              onClick={onDelete}
            />
          </>
        )}
      </div>
    );
  };


  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      sortable: true,
    }
    ,
    {
      header: 'documento',
      accessorKey: 'tipo_documento.nombre',
      sortable: true,
    },
    {
      header: 'Cliente',
      accessorKey: 'cliente_nombre',
      sortable: true,
    },
    {
      header: 'Total a pagar',
      accessorKey: 'total_pagar',
      sortable: true,
      cell: props => {
        const total = parseFloat(props.getValue());
        return "$ " + total.toFixed(2);
      },
    },
    {
      header: 'estado',
      accessorKey: 'estado',
      sortable: true,
    },
    {
      header: 'Opciones',
      sortable: false,
      cell: props => {
        const row = props.row.original;
        return <BotonesOpcion row={row} />;
      },
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    }
  ];


  const handleDeleteSuccess = (id) => {
    setVentaList(ventaList.filter(venta => venta.id !== id));
    const toastNotification = (
      <Notification title="Completado" type="success">
        La venta se eliminó exitosamente.
      </Notification>
    );
    toast.push(toastNotification);
  };

  const toggleView = () => {
    setShowList(!showList);
    setEditMode(false);
  };

  return (
    <>
      <div className="flex justify-between items-center ">
        <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {showList && !editMode ? "Lista de ventas" : editMode ? "Detallles de la venta" : "Agregar nueva venta"}
        </h2>
        <div>
          <Button
            onClick={toggleView}
            icon={<CgAdd />}
            size="sm"
            variant="solid"
            className="flex items-center mr-2"
          >
            {showList && !editMode ? "Agregar nueva venta" : "Listar ventas"}
          </Button>
        </div>
      </div>

      <div>
        {showList && !editMode ? (
          <BaseDataTable columns={columns} reqUrl={'/ventas/ventas'} />
        ) : editMode ? (
          <VentasEdit
            venta={selectedVenta}
            ventaId={selectedVenta.id}
          /> // Mostrar el formulario de edición
        ) : (
          <VentasAdd />
        )}
      </div>

      {selectedVenta && (
        <>
          <VentasDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            venta={selectedVenta}
          />

          <VentasDialogDelete
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            venta={selectedVenta}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  );
};

export default VentasList;