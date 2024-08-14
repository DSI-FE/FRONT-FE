//ESTE ES EL CRUD PARA COMPRAS   
import ApiService from "./ApiService";


//Para obtener todas las compras
export async function apiGetCompras() {
    return ApiService.fetchData({
      url: 'compras/compras',
      method: 'GET',
    });
  }

  //Para obtener todas las compras
export async function apiGetCompraBy(id) {
  return ApiService.fetchData({
    url: `compras/detallecompra/${id}`,
    method: 'GET',
  });
}

//para crear una nueva compra
export async function apiCreateCompra(data) {
  return ApiService.fetchData({
    url: 'compras/addcompra',
    method: 'POST',
    data,
  });
}
