import ApiService from "./ApiService";

// Para crear un nuevo registro de inventario
export async function apiCreateInventario(data) {
  return ApiService.fetchData({
    url: 'inventario/addinventario',
      method: 'POST',
        data,
   });
}

// Para obtener todos los productos del inventario
export async function apiGetInventario() {
    return ApiService.fetchData({
        url: 'inventario/inventario',
        method: 'GET',
    });
}

// Para obtener un producto de inventario por ID
export async function apiGetProductosBy(idProd) {
    return ApiService.fetchData({
        url: `inventario/productoBy/${idProd}`,
        method: 'GET',
    });
}

// Para obtener un producto de inventario por su codigo
export async function apiGetProductosById(idProd) {
    return ApiService.fetchData({
        url: `inventario/productoByCod/${idProd}`,
        method: 'GET',
    });
}

// Para actualizar un inventario por su ID
export async function apiUpdateInventario(idProd, data) {
    return ApiService.fetchData({
        url: `inventario/inventarioUpd/${idProd}`,
        method: 'PATCH',
        data,
    });
}

// Para eliminar un inventario por su ID
export async function apiDeleteInventario(producto_id, unidad_medida_id) {
  return ApiService.fetchData({
    url: `inventario/inventariodel/${producto_id}/${unidad_medida_id}`,
      method: 'DELETE',
    });
}

export async function apiSumaInventario() {
    return ApiService.fetchData({
        url: `inventario/sumaCosto`,
        method: 'GET',
    });
}

// Para obtener los proveedores
export async function apiGetProveedores() {
    return ApiService.fetchData({
        url: `inventario/proveedores`,
        method: 'GET',
    });
}