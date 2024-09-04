import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import { apiGetClientes, apiDeleteCliente } from 'services/ClienteService';
import ClienteDrawer from './ClienteDrawer';
import DeleteDialog from './components/DeleteDialog/DeleteDialog';
<<<<<<< HEAD
=======
import ClienteDialog from './ClienteDialog'; 
>>>>>>> alfonsog

const ClienteList = () => {
  const [clientesList, setClientesList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
<<<<<<< HEAD
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); 
  const dispatch = useDispatch();
=======
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  
>>>>>>> alfonsog

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
<<<<<<< HEAD
      await apiDeleteCliente(selectedClient.id); // Llama a apiDeleteCliente para eliminar el cliente
      const clientesResponse = await apiGetClientes();
      setClientesList(clientesResponse.data);
=======
      await apiDeleteCliente(selectedClient.id); 
      const clientesResponse = await apiGetClientes();
      setClientesList(clientesResponse.data);
      
>>>>>>> alfonsog
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    } finally {
      setShowConfirmation(false);
<<<<<<< HEAD
=======
      window.location.reload();
>>>>>>> alfonsog
    }
  };

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedCliente(row);
      setIsDialogOpen(true);
    };

    const onEdit = () => {
      setSelectedCliente(row);
      setIsDrawerOpen(true);
      console.log(selectedCliente);
    };

<<<<<<< HEAD
 
=======
    const onDelete = () => {
      setSelectedClient(row);
      setShowConfirmation(true);
    };
>>>>>>> alfonsog

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
          onClick={() => onDelete(row)}
        />
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
      header: 'Direccion',
      accessorKey: 'direccion',
      sortable: true,
    },
    {
      header: 'Correo',
      accessorKey: 'correoElectronico',
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
<<<<<<< HEAD
  

    const openDrawer = () => {
      setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
      setIsDrawerOpen(false);
    };
  
    const closeConfirmation = () => {
      setShowConfirmation(false);
    };
  

=======

  const openDrawer = () => {
    setSelectedCliente(null); 
    setIsDrawerOpen(true);
  };

  
>>>>>>> alfonsog
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>Lista de clientes</h2>
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
<<<<<<< HEAD
      <ClienteDrawer isOpen={isDrawerOpen} setIsOpen={closeDrawer} />
=======
      <ClienteDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} cliente={selectedCliente} />
>>>>>>> alfonsog
      {selectedClient && (
        <DeleteDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          client={selectedClient}
          onDeleteComplete={handleDeleteComplete}
        />
      )}
<<<<<<< HEAD
=======
      {selectedCliente && (
        <ClienteDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          cliente={selectedCliente}
        />
      )}
>>>>>>> alfonsog
    </>
  );
};

export default ClienteList;
