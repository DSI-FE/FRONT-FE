import ApiService from "./ApiService";

// Crear un nuevo tipo de proveedor
export async function apiCreateTipoProveedor(data) {
    return ApiService.fetchData({
        url: 'tipos-proveedor/tipo-proveedor',
        method: 'POST',
        data,
    });
}

// Obtener todos los tipos de proveedor
export async function apiGetTiposProveedor() {
    return ApiService.fetchData({
        url: 'tipos-proveedor/listatiposproveedor',
        method: 'GET',
    });
}

// Obtener un tipo de proveedor por ID
export async function apiGetTipoProveedorById(id) {
    return ApiService.fetchData({
        url: `tipos-proveedor/tipo-proveedorBy/${id}`,
        method: 'GET',
    });
}

// Actualizar un tipo de proveedor por su ID
export async function apiUpdateTipoProveedor(id, data) {
    return ApiService.fetchData({
        url: `tipos-proveedor/tipo-proveedorUpd/${id}`,
        method: 'PATCH',
        data,
    });
}

// Eliminar un tipo de proveedor por su ID
export async function apiDeleteTipoProveedor(id) {
    return ApiService.fetchData({
        url: `tipos-proveedor/tipo-proveedorDel/${id}`,
        method: 'DELETE',
    });
}
