//ESTE ES EL CRUD PARA PROVEEDORES, Y SE PUEDEN SEGUIR AGREGANDO MAS ENDPOINT DEPENDIENDO DE LO QUE SE NECESITE
import ApiService from "./ApiService";

//para crear un nuevo proveedor
export async function apiCreateProveedor(data) {
    return ApiService.fetchData({
      url: 'proveedores/proveedor',
      method: 'POST',
      data,
    });
  }

//Para get todos los proveedores
export async function apiGetProveedores() {
    return ApiService.fetchData({
      url: 'proveedores/listaproveedores',
      method: 'GET',
    });
  }

//Para get un proveedor por ID
export async function apiGeProveedorById(id) {
    return ApiService.fetchData({
      url: `proveedores/proveedorBy/${id}`,
      method: 'GET',
    });
  }

//Para upd un proveedor por su id
export async function apiUpdateProveedor(id, data) {
    return ApiService.fetchData({
      url: `proveedores/proveedorUpd/${id}`,
      method: 'PATCH',
      data,
    });
  }
  
//Para eliminar un proveedor por su id
export async function apiDeleteProveedor(id) {
    return ApiService.fetchData({
      url: `proveedores/proveedorDel/${id}`,
      method: 'DELETE',
    });
  }
  