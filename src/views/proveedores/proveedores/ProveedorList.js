import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetProveedores } from 'services/ProveedorService';
import ProveedorDrawer from './ProveedorDrawer';
import ProveedorDialog from './ProveedorDialog'; // Importa ProveedorDialog

const ProveedorList = () => {

  const [proveedoresList, setProveedoresList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null); // Estado para el proveedor seleccionado

  useEffect(() => {
    const fetchProveedores = async () => {
      const proveedoresResponse = await apiGetProveedores();
      setProveedoresList(proveedoresResponse.data);
    };
    fetchProveedores();
  }, []);

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedProveedor(row); // Setea el proveedor seleccionado
      setViewDialogOpen(true); // Abre el diálogo
    };

    const onEdit = () => {
      // Lógica para editar
    }

    const onDelete = () => {
      // Lógica para eliminar
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
        <Button className='bg-red-500 hover.bg-red-400 active.bg-red-700'
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
      header: 'Código',
      accessorKey: 'codigo', 
      sortable: true,
    },
    {
      header: 'NRC',
      accessorKey: 'nrc', 
      sortable: true,
    },
    {
      header: 'NIT',
      accessorKey: 'nit', 
      sortable: true,
    },
    {
      header: 'SERIE',
      accessorKey: 'serie', 
      sortable: true,
    },
    {
      header: 'Tipo de Proveedor',
      accessorKey: 'tipo_proveedor.tipo', 
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
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Lista de proveedores</h2>
        <Button
          onClick={openDrawer}
          icon={<CgAdd />}
          size="sm"
          variant="solid"
          className="flex items-center"
        >
          Agregar nuevo proveedor
        </Button>
      </div>
      <div>
        <BaseDataTable columns={columns} reqUrl={'/proveedores/listaproveedores'} />
      </div>
      <ProveedorDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      {selectedProveedor && (
        <ProveedorDialog
          isOpen={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          proveedor={selectedProveedor}
        />
      )}
    </>
  );
};

export default ProveedorList;
