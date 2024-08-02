//ESTE ES EL CRUD PARA COMPRAS   
import ApiService from "./ApiService";




//Para obtener todas las compras
export async function apiGetCompras() {
    return ApiService.fetchData({
      url: 'compras/compras',
      method: 'GET',
    });
  }
