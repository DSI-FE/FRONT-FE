//ESTE ES EL CRUD PARA CLIENTES, Y SE PUEDEN SEGUIR AGREGANDO MAS ENDPOINT DEPENDIENDO DE LO QUE SE NECESITE
import ApiService from "./ApiService";

//para crear un nuevo cliente
export async function apiCreateCliente(data) {
    return ApiService.fetchData({
      url: 'clientes/cliente',
      method: 'POST',
      data,
    });
  }

//Para get todos los clientes
export async function apiGetClientes() {
    return ApiService.fetchData({
      url: 'clientes/listaclientes',
      method: 'GET',
    });
  }

//Para get un cliente por ID
export async function apiGetClienteById(id) {
    return ApiService.fetchData({
      url: `clientes/clienteBy/${id}`,
      method: 'GET',
    });
  }

//Para upd un cliente por su id
export async function apiUpdateCliente(id, data) {
    return ApiService.fetchData({
      url: `clientes/clienteUpd/${id}`,
      method: 'PATCH',
      data,
    });
  }
  
//Para eliminar un cliente por su id
export async function apiDeleteCliente(id) {
    return ApiService.fetchData({
      url: `clientes/clienteDel/${id}`,
      method: 'DELETE',
    });
  }
  