import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetCompras } from 'services/ComprasService';
import ComprasDrawer from './ComprasDrawer';
import ComprasDrawerEdit from './ComprasDrawerEdit';
import ComprasDialog from './ComprasDialog'; 
import ComprasDialogDelete from './ComprasDialogDelete';
import ComprasAdd from './ComprasAdd'; 

const ComprasList = () => {
  const [comprasList, setComprasList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedCompra, setSelectedCompra] = useState(null); 
  const [showList, setShowList] = useState(true);

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedCompra(row); 
      setViewDialogOpen(true); 
    };

    const onEdit = () => {

    }

    const onDelete = () => {
      setSelectedCompra(row); 
      setDeleteDialogOpen(true);
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

  const toggleView = () => {
    setShowList(!showList);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
          {showList ? "Lista de compras" : "Agregar nueva compra"}
        </h2>
        <div>
          <Button
            onClick={toggleView}
            icon={<CgAdd />}
            size="sm"
            variant="solid"
            className="flex items-center mr-2"
          >
            {showList ? "Agregar nueva compra" : "Listar compras"}
          </Button>
        </div>
      </div>
      
      <div>
        {showList ? (
          <BaseDataTable columns={columns} reqUrl={'/compras/compras'} />
        ) : (
          <ComprasAdd />
        )}
      </div>
      
      {selectedCompra && (
        <>
          <ComprasDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            compra={selectedCompra}
          />
          <ComprasDialogDelete
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            compra={selectedCompra}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  );
};

export default ComprasList;
