import ApiService from './ApiService'

export async function apiSignIn(data)
{
    return ApiService.fetchData({
        url: '/auth/signin',
        method: 'POST',
        data
    });
}

export async function apiSignUp(data)
{
    return ApiService.fetchData({
        url: '/sign-up',
        method: 'POST',
        data
    })
}

export async function apiSignOut(data)
{
    return ApiService.fetchData({
        url: '/auth/signout',
        method: 'POST',
        data
    })
}

export async function apiForgotPassword(data)
{
    return ApiService.fetchData({
        url: '/password/email',
        method: 'POST',
        data
    })
}

export async function apiChangePassword(data)
{
    return ApiService.fetchData({
        url: '/auth/change-password',
        method: 'POST',
        data
    })
}

export async function apiResetPassword(data)
{
    return ApiService.fetchData({
        url: '/password/reset',
        method: 'POST',
        data
    })
}