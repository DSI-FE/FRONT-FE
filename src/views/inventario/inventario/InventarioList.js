import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil } from 'react-icons/hi';
import { Button, Notification, toast } from "components/ui";
import { apiGetInventario} from 'services/InventarioService';
import InventarioDrawerEdit from './InventarioDrawerEdit';
import InventarioDialog from './InventarioDialog'; 

const InventarioList = () => {

  const [inventarioList, setInventarioList] = useState([]);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState(null); 

  useEffect(() => {
    const fetchInventario = async () => {
      const inventarioResponse = await apiGetInventario();
      setInventarioList(inventarioResponse.data);
    };
    fetchInventario();
  }, []);

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedInventario(row); 
      setViewDialogOpen(true); 

    };

    const onEdit = () => {
      setSelectedInventario(row);
      setIsEditDrawerOpen(true);
    
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
      header: 'Código de producto',
      accessorKey: 'producto_id',
      sortable: true,
    },
    {
      header: 'NOMBRE',
      accessorKey: 'nombre_producto', 
      sortable: true,
    },
    {
      header: 'Unidad de Medida',
      accessorKey: 'unidad_medida', 
      sortable: true,
    },
    {
      header: 'Existencias',
      accessorKey: 'existencias', 
      sortable: true,
    },
    {
      header: 'Precio de Costo',
      accessorKey: 'precioCosto', 
      sortable: true,
    },
    {
      header: 'Precio de Venta',
      accessorKey: 'precioVenta', 
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
  
  const openDrawer = () => {
 
  };

  const handleDeleteSuccess = (id) => {

  };

  return (
    <>
      <div className="flex justify-between items-center">
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Inventario</h2>
      </div>
      <div>
        <BaseDataTable columns={columns} reqUrl={'/inventario/inventario'} />
      </div>
      {selectedInventario && (
        <>
          <InventarioDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            inventario={selectedInventario}
          />
          <InventarioDrawerEdit
            isOpen={isEditDrawerOpen}
            setIsOpen={setIsEditDrawerOpen}
            inventarioId={selectedInventario.id}
            onClose={() => setIsEditDrawerOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default InventarioList;