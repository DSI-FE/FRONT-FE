//ESTE ES EL CRUD PARA VENTASS   
import ApiService from "./ApiService";


//Para obtener todas las ventas
export async function apiGetVentas() {
    return ApiService.fetchData({
      url: 'ventas/ventas',
      method: 'GET',
    });
  }

  //Para obtener ventas por id
export async function apiGetVentaBy(id) {
  return ApiService.fetchData({
    url: `ventas/detalleventa/${id}`,
    method: 'GET',
  });
}

//para crear una nueva venta
export async function apiCreateVenta(data) {
  return ApiService.fetchData({
    url: 'ventas/addventa',
    method: 'POST',
    data,
  });
}

//para borrar una venta
export async function apiDeleteVenta(id) {
    return ApiService.fetchData({
      url: `ventas/delete/${id}`,
      method: 'DELETE',
    });
  }

//Para upd una venta por su id
export async function apiUpdateVentas(id, data) {
    return ApiService.fetchData({
      url: `ventas/ventasUpd/${id}`,
      method: 'PATCH',
      data,
    });
  }
