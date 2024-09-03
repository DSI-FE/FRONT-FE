import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { TbFileDownload } from "react-icons/tb";
import { CgAdd } from 'react-icons/cg';
import { Button } from "components/ui";
import VentasAdd from './VentasAdd';
import VentasDialog from './VentasDialog';

const VentasList = () => {
  const [ventasList, setVentasList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedVenta, setSelectedVenta] = useState(null); 
  const [showList, setShowList] = useState(true);

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
        setSelectedVenta(row); 
        setViewDialogOpen(true);
    };

    const onEdit = () => {
        // Acción de editar
    };

    const onDelete = () => {
        // Acción de eliminar
    };

    const descargarFactura = () => {
     //esta es una prueba, pero asi debe ser, se debe abrir el pdf con la factura
     window.open('https://drive.google.com/file/d/1q431biYg10yYWVjimcQppvvUdqJL6Nn5/view?usp=sharing',  '_blank', 'width=800,height=600');
     
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
                    {/* Otros botones que aparecen si el estado no es "Finalizada" */}
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
      accessorKey:'total_pagar', 
      sortable: true,
      cell: props => {
        const total = parseFloat(props.getValue());
        return "$ "+total.toFixed(2);
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
  
  const openDrawer = () => {

  };

  const handleDeleteSuccess = (id) => {

  };

  const toggleView = () => {
    setShowList(!showList);
  };

  return (
    <>
      <div className="flex justify-between items-center ">
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
        <>
          <VentasDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            venta={selectedVenta}
          />
        </>
      )}
    </>
  );
};

export default VentasList;