import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button, Notification, toast } from "components/ui";
import { apiGetCompars } from 'services/ComprasService';
import ComprasDrawer from './ComprasDrawer';
import ComprasDrawerEdit from './ComprasDrawerEdit';
import ComprasDialog from './ComprasDialog'; 
import ComprasDialogDelete from './ComprasDialogDelete';

const ComprasList = () => {

  const [comprasList, setComprasList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedCompra, setSelectedCompra] = useState(null); 

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedCompra(row); 
      setViewDialogOpen(true); 
    };

    const onEdit = () => {
      
    }

    const onDelete = () => {

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
      header: 'Fecha',
      accessorKey: 'fecha', 
      sortable: true,
    },
    {
      header: 'Numero',
      accessorKey: 'numeroCCF', 
      sortable: true,
    },
    {
      header: 'Proveedor',
      accessorKey: 'proveedor_nombre', 
      sortable: true,
    },
    {
      header: 'Total',
      accessorKey: 'totalCompra', 
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
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Lista de compras</h2>
        <Button
          onClick={null}
          icon={<CgAdd />}
          size="sm"
          variant="solid"
          className="flex items-center"
        >
          Agregar nueva compra
        </Button>
      </div>
      <div>
        <BaseDataTable columns={columns} reqUrl={'/compras/compras'} />
      </div>
      {selectedCompra && (
        <>
          <ComprasDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            compra={selectedCompra}
          />
        </>
      )}
    </>
  );
};

export default ComprasList;
