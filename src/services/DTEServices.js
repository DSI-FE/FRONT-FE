//ESTE ES ENDPOINT PARA TODAS LAS TABLAS CATALOGO 
import ApiService from "./ApiService";

//Para get las condciones de la operacion
export async function apiGetCondicion() {
    return ApiService.fetchData({
      url: 'dte/condicion',
      method: 'GET',
    });
  }

  //Para get los tipos de documento
export async function apiGetDocumento() {
    return ApiService.fetchData({
      url: 'dte/tipo',
      method: 'GET',
    });
  }

    //Para get clientes completos
export async function apiGetListaClientes() {
    return ApiService.fetchData({
      url: 'dte/clientes',
      method: 'GET',
    });
  }

  //Para get clientes completos
export async function apiGetListaProveedores() {
    return ApiService.fetchData({
      url: 'dte/proveedores',
      method: 'GET',
    });
  }

  // Para crear un dte
export async function apiCreateDTE(id) {
  return ApiService.fetchData({
    url: `dte/adddte/${id}`,
    method: 'POST',
  });
}

  //Para get el dte
  export async function apiGetDTE(id) {
    return ApiService.fetchData({
      url: `dte/dte/${id}`,
      method: 'GET',
    });
  }

  //Para get el dte por id de venta
  export async function apiGetFactura(id) {
    return ApiService.fetchData({
      url: `dte/facturadte/${id}`,
      method: 'GET',
    });
  }