import ApiService from "./ApiService";

export async function apiGetActiveConfigurations() {
    return ApiService.fetchData(
        {
            url: '/general/configurations',
            method: 'GET',
        }
    );
}

export async function apiGetConfigurations(params) {
    return ApiService.fetchData(
        {
            url: '/general/configurations',
            method: 'GET',
            params
        }
    );
}

export async function apiGetConfiguration(id) {
    return ApiService.fetchData(
        {
            url: '/general/configurations/' + id,
            method: 'GET',
        }
    )
}

export async function apiStoreConfiguration(data) {
    let url = '/general/configurations';
    let method = 'POST';

    if (data.id) {
        url = '/general/configurations/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData({
        url: url,
        method: method,
        data
    });
}

export async function apiDeleteConfiguration(id) {
    return ApiService.fetchData(
        {
            url: '/general/configurations/' + id,
            method: 'DELETE',
        }
    )
}