//ESTE ES EL CRUD PARA PRODUCTOS    
import ApiService from "./ApiService";

// Para crear un nuevo proveedor
export async function apiCreateProductos(data) {
    return ApiService.fetchData({
      url: 'inventario/addinventario',
      method: 'POST',
      data,
    });
  }

//Para get todos los productos
export async function apiGetProductos() {
    return ApiService.fetchData({
      url: 'inventario/inventario',
      method: 'GET',
    });
  }

  //Para get todas las unidades de medida
export async function apiGetUnidades() {
    return ApiService.fetchData({
      url: 'productos/unidades',
      method: 'GET',
    });
  }


//Para get un producto porid
export async function apiGetProductosById(idProd) {
    return ApiService.fetchData({
      url: `inventario/productoByCod/${idProd}`,
      method: 'GET',
    });
  }

  //Para get un producto por codigo
export async function apiGetProductosBy(idProd) {
  return ApiService.fetchData({
    url: `inventario/productoBy/${idProd}`,
    method: 'GET',
  });
}


//Para upd un producto por su id
export async function apiUpdateProductos(idProd, data) {
    return ApiService.fetchData({
      url: `inventario/inventarioUpd/${idProd}`,
      method: 'PATCH',
      data,
    });
  }

  //Para listar los poductos y luego sus unidades de medida
export async function apiGetNombreProductos() {
  return ApiService.fetchData({
    url: 'productos/productos',
    method: 'GET',
  });
}
  