import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button, Notification, toast } from "components/ui";
import { apiGetProveedores, apiGetProveedorById } from 'services/ProveedorService';
import ProductosDrawer from './ProductosDrawer';
import ProductosDrawerEdit from './ProductosDrawerEdit';
import ProductosDialog from './ProductosDialog'; 
import ProductosDialogDelete from './ProductosDialogDelete';

const ProductosList = () => {

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {

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
          onClick={null}
        />
        <Button
          title='Editar datos'
          size="xs"
          variant="solid"
          icon={<HiPencil />}
          onClick={null}
        />
        <Button className='bg-red-500 hover:bg-red-400 active:bg-red-700'
          title='Eliminar datos'
          size="xs"
          variant="solid"
          icon={<HiTrash />}
          onClick={null}
        />
      </div>
    );
  }

  const columns = [
    {
      header: 'NOMBRE',
      accessorKey: 'nombre',
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

  };

  const handleDeleteSuccess = (id) => {
   
  };

  return (
    <>
      <div className="flex justify-between items-center">
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Lista de productos</h2>
        <Button
          onClick={null}
          icon={<CgAdd />}
          size="sm"
          variant="solid"
          className="flex items-center"
        >
          Agregar nuevo producto
        </Button>
      </div>
    </>
  );
};

export default ProductosList;
