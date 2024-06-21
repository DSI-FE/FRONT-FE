import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetClientes, apiDeleteCliente } from 'services/ClienteService';
import ClienteDrawer from './ClienteDrawer';
import DeleteDialog from './components/DeleteDialog/DeleteDialog';

const ClienteList = () => {

  const [clientesList, setClientesList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesResponse = await apiGetClientes();
      setClientesList(clientesResponse.data);
    };
    fetchClientes();
  }, []);

  const onDelete = (client) => {
    setSelectedClient(client);
    setShowConfirmation(true);
  };

  const handleDeleteComplete = async () => {
    try {
      await apiDeleteCliente(selectedClient.id); // Llama a apiDeleteCliente para eliminar el cliente
      const clientesResponse = await apiGetClientes();
      setClientesList(clientesResponse.data);
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onEdit = () => {
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
          onClick={() => onDelete(row)}
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

    const closeDrawer = () => {
      setIsDrawerOpen(false);
    };
  
    const closeConfirmation = () => {
      setShowConfirmation(false);
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
      <ClienteDrawer isOpen={isDrawerOpen} setIsOpen={closeDrawer} />
      {selectedClient && (
        <DeleteDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          client={selectedClient}
          onDeleteComplete={handleDeleteComplete}
        />
      )}
    </>
  );
};

export default ClienteList;
