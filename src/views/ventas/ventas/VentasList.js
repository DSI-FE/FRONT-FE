import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetVentas } from 'services/VentasService';
import VentasAdd from './VentasAdd';
import VentasDialogDelete from './VentasDialogDelete';
import { apiDeleteVenta } from 'services/VentasService';

const VentasList = () => {
  const [ventasList, setVentasList] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedVenta, setSelectedVenta] = useState(null); 
  const [showList, setShowList] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      const ventasResponse = await apiGetVentas();
      setVentasList(ventasResponse.data);
    };
    fetchVentas();
  }, []);

  const handleDeleteComplete = async () => {
    try {
      await apiDeleteVenta(selectedVenta.id); 
      const ventasResponse = await apiGetVentas();
      setVentasList(ventasResponse.data);
      
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    } finally {
      setShowConfirmation(false);
      // window.location.reload(); esto lo vamos a cambiar por un dispatch porque no es reactivo
    }
  };

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedVenta(row); 
      setDeleteDialogOpen(true);
    };

    const onEdit = () => {

    }

    const onDelete = () => {
      setSelectedVenta(row); 
      setShowConfirmation(true);
    }

    return (
      <div className='flex justify-center text-center space-x-4'>
        <Button className='bg-green-500 hover:bg-green-400 active:bg-green-700'
          title='Ver detalles'
          size="xs"
          variant="solid"
          icon={<HiEye />}
          onClick={onView}
        />
        <Button
          title='Editar datos'
          size="xs"
          variant="solid"
          icon={<HiPencil />}
          onClick={onEdit}
        />
        <Button className='bg-red-500 hover:bg-red-400 active:bg-red-700'
          title='Eliminar datos'
          size="xs"
          variant="solid"
          icon={<HiTrash />}
          onClick={onDelete}
        />
      </div>
    );
  }

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
    },
    {
      header: 'total_no_sujetas',
      accessorKey: 'total_no_sujetas', 
      sortable: true,
    },
    {
      header: 'total_exentas',
      accessorKey: 'total_exentas', 
      sortable: true,
    },
    {
      header: 'total_gravadas',
      accessorKey: 'total_gravadas', 
      sortable: true,
    },
    {
      header: 'total_iva',
      accessorKey: 'total_iva', 
      sortable: true,
    },
    {
      header: 'total_pagar',
      accessorKey: 'total_pagar', 
      sortable: true,
    },
    {
      header: 'estado',
      accessorKey: 'estado', 
      sortable: true,
    },
    {
      header: 'tipo_documento',
      accessorKey: 'tipo_documento', 
      sortable: true,
    },
    {
      header: 'cliente_id',
      accessorKey: 'cliente_id', 
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
  
  const toggleView = () => {
    setShowList(!showList);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {showList ? "Lista de ventas" : "Agregar nueva venta"}
        </h2>
        <div>
          <Button
            onClick={toggleView}
            icon={<CgAdd />}
            size="sm"
            variant="solid"
            className="flex items-center mr-2"
          >
            {showList ? "Agregar nueva venta" : "Listar ventas"}
          </Button>
        </div>
      </div>
      
      <div>
        {showList ? (
          <BaseDataTable columns={columns} reqUrl={'/ventas/ventas'} />
        ) : (
          <VentasAdd />
        )}
      </div>
      
      {selectedVenta && (
        <VentasDialogDelete
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          client={selectedVenta}
          onDeleteComplete={handleDeleteComplete}
        />
      )}
      
    </>
  );
};

export default VentasList;