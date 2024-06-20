import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetClientes } from 'services/ClienteService';
import ClienteDrawer from './ClienteDrawer';

const ClienteList = () => {

  const [clientesList, setClientesList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesResponse = await apiGetClientes();
      setClientesList(clientesResponse.data);
    };
    fetchClientes();
  }, []);



  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

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
          onClick={onEdit}
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
      header: 'Nombres',
      accessorKey: 'nombres', 
      sortable: true,
    },
    {
      header: 'Apellidos',
      accessorKey: 'apellidos', 
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
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Lista de clientes</h2>
        <Button
          onClick={openDrawer}
          icon={<CgAdd />}
          size="sm"
          variant="solid"
          className="flex items-center"
        >
          Agregar nuevo cliente
        </Button>
      </div>
      <div>
        <BaseDataTable columns={columns} reqUrl={'/clientes/listaclientes'} />
      </div>
      <ClienteDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
    </>
  );
};

export default ClienteList;
