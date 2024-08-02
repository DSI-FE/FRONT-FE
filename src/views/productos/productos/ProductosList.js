import React, { useState, useEffect } from 'react';
import BaseDataTable from './BaseDataTable';
import { useDispatch } from 'react-redux';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { CgAdd } from 'react-icons/cg';
import { Button, Notification, toast } from "components/ui";
import { apiGetProductos} from 'services/ProductosService';
import ProductosDrawer from './ProductosDrawer';
import ProductosDrawerEdit from './ProductosDrawerEdit';
import ProductosDialog from './ProductosDialog'; 
import ProductosDialogDelete from './ProductosDialogDelete';

const ProductosList = () => {

  const [productosList, setProductosList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedProducto, setSelectedProducto] = useState(null); 

  useEffect(() => {
    const fetchProductos = async () => {
      const productosResponse = await apiGetProductos();
      setProductosList(productosResponse.data);
    };
    fetchProductos();
  }, []);

  const BotonesOpcion = ({ row }) => {
    const dispatch = useDispatch();

    const onView = () => {
      setSelectedProducto(row); 
      setViewDialogOpen(true); 
    };

    const onEdit = () => {
      setSelectedProducto(row);
      setIsEditDrawerOpen(true);
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
      accessorKey: 'producto_id',
      sortable: true,
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre_producto', 
      sortable: true,
    },
    {
      header: 'Unidad de medida',
      accessorKey: 'unidad_medida', 
      sortable: true,
    },
    {
      header: 'Equivalencia',
      accessorKey: 'equivalencia', 
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
      <h2 style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}> Lista de productos</h2>
        <Button
          onClick={openDrawer}
          icon={<CgAdd />}
          size="sm"
          variant="solid"
          className="flex items-center"
        >
          Agregar nuevo producto
        </Button>
      </div>
      <div>
        <BaseDataTable columns={columns} reqUrl={'/inventario/inventario'} />
      </div>
      <ProductosDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      {selectedProducto && (
        <>
          <ProductosDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            producto={selectedProducto}
          />
        <ProductosDrawerEdit
        isOpen={isEditDrawerOpen}
        setIsOpen={setIsEditDrawerOpen}
        productoId={selectedProducto.id}
        onClose={() => setIsEditDrawerOpen(false)}
      />
      </>
      )}
    </>
  );
};

export default ProductosList;
