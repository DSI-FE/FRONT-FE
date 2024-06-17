import ApiService from "./ApiService";

export async function apiGetEmployees(params) {
    return ApiService.fetchData({ url: '/administration/employees', method: 'GET' });
}

export async function apiGetEmployeesActive(params) {
    return ApiService.fetchData( { url:'/administration/employees/index-active', method:'GET', } );
}

//------------------------------------------------------------------------------------------------------------------------------------------
export async function apiGetListEmployee() {
    return ApiService.fetchData( { url:'/administration/active-employees', method:'GET', } );
}
//------------------------------------------------------------------------------------------------------------------------------------------
export const apiGetEmployeeShowPic = async id => (
    ApiService.fetchData({
        url:'/administration/employees/show-pic/'+id, method:'GET'
    })
)

export async function apiGetEmployeesMarkingRequired(params) { 
    return ApiService.fetchData( {
        url: '/administration/employees/index-marking-required',
        method: 'GET',
    } );
}

export async function apiGetEmployee(id) {
    return ApiService.fetchData(
        {
            url: '/administration/employees/' + id,
            method: 'GET',
        }
    );
}

export async function apiStoreEmployee(data) {
    let url = '/administration/employees';
    let method = 'POST';

    if (data.id) {
        url = '/administration/employees/' + data.id;
        method = 'PATCH';
    }

    return ApiService.fetchData(
        {
            url: url,
            method: method,
            data
        }
    )
}

export async function apiGetNotifications()
{
    return ApiService.fetchData({
        url: '/administration/employees/notifications',
        method: 'GET',
    });
}

export async function apiDeleteEmployee(id) {
    return ApiService.fetchData(
        {
            url: '/administration/employees/' + id,
            method: 'DELETE',
        }
    )
}

export async function apiGetPaymentVouchers() {
    return ApiService.fetchData({
        url: '/administration/payment-vouchers',
        method: 'GET',
    });
}

export async function apiGetPaymentVoucher(id) {
    return ApiService.fetchData(
        {
            url: '/administration/payment-vouchers/' + id,
            method: 'GET',
        }
    )
}

export async function apiStorePaymentVoucher(data) {
    return ApiService.fetchData({
        url: '/administration/payment-vouchers',
        method: 'POST',
        data
    })
}

export async function apiGetOrganizationalUnitsActive() {
    return ApiService.fetchData({
        url: '/administration/active-organizational-units',
        method: 'GET',
    });
}

export async function apiGetOrganizationalUnitActive(id) {
    return ApiService.fetchData({
        url: '/administration/active-organizational-units/' + id,
        method: 'GET',
    });
}

export async function apiGetOrganizationalUnitEmployees(id) {
    return ApiService.fetchData({
        url: 'administration/organizational-units/'+id+'/childrens/employees',
        method: 'GET',
    })
}


export async function apiGetOrganizationalUnitEmployeesSimple(id) {
    return ApiService.fetchData({
        url: 'administration/organizational-units/'+id+'/employees',
        method: 'GET',
    })
}

export async function apiGetOrganizationalUnitEmployeesBosses(id) {
    return ApiService.fetchData({
        url: 'administration/organizational-units/'+id+'/employees/bosses',
        method: 'GET',
    })
}

export async function apiGetOrganizationalUnitChildrens(id) {
    return ApiService.fetchData( { url: 'administration/organizational-units/'+id+'/childrens', method: 'GET' } )
}

export async function apiGetOrganizationalUnitEmployeesDiscount(params) {
    const id = params.id
    return ApiService.fetchData({
        url: 'administration/organizational-units/'+id+'/childrens/employees-discount',
        method: 'GET',
        params
    })
}

export async function apiGetOrganizationalUnitEmployeesPermissionTypes(params) {
    const id = params.id
    return ApiService.fetchData({
        url: 'administration/organizational-units/'+id+'/childrens/employees-permission-types',
        method: 'GET',
        params
    })
    
}

export async function apiGetGenders() {
    return ApiService.fetchData({
        url: '/administration/genders',
        method: 'GET',
    });
}

export async function apiGetActiveGenders() {
    return ApiService.fetchData({
        url: '/administration/active-genders',
        method: 'GET',
    });
}

export async function apiGetMaritalStatuses() {
    return ApiService.fetchData({
        url: '/administration/marital-statuses',
        method: 'GET',
    });
}

export async function apiGetActiveMaritalStatuses() {
    return ApiService.fetchData({
        url: '/administration/active-marital-statuses',
        method: 'GET',
    });
}

export async function apiGetEmployeesBirthdaysBetweenDates(dateIni,dateEnd) {
    return ApiService.fetchData({ url: 'administration/employees/birthdays-between-dates/date-ini/'+dateIni+'/date-end/'+dateEnd, method: 'GET' })
}

export async function apiGetEmployeesBirthdaysInMonth(dateIni) {
    return ApiService.fetchData({ url: 'administration/employees/birthdays-in-month/date-ini/'+dateIni, method: 'GET' })
}

export async function apiGetOrganizationalUnits() {
    return ApiService.fetchData({ url: 'administration/organizational-units/index-simple', method: 'GET' })
}

export async function apiGetOrganizationalUnit(id) {
    return ApiService.fetchData({ url: 'administration/organizational-units/'+id, method: 'GET' })
}

export async function apiGetFunctionalPositions( id = null ) {
    const uri = id ? '/index-by-organizational-unit/'+id : ''
    return ApiService.fetchData({ url: 'administration/functional-positions'+uri, method: 'GET' })
}

export async function apiGetFunctionalPosition( id ) {
    return ApiService.fetchData({ url: 'administration/functional-positions/'+id, method: 'GET' })
}

export async function apiGetFunctionalPositionByOrganizationalUnit(id) {
    return ApiService.fetchData({ url: 'administration/functional-positions/index-by-organizational-unit/'+id, method: 'GET' })
}

export async function apiDeleteFunctionalPosition(id) {
    return ApiService.fetchData({ url: 'administration/functional-positions/'+id, method: 'DELETE' })
}

export async function apiGetOrganizationalUnitChildrensActiveEmployees(id) {
    return ApiService.fetchData({ url: 'administration/organizational-units/'+id+'/childrens/employees/active', method: 'GET' })
}

export async function apiGetOrganizationalUnitDirectChildrensActiveBossEmployees(id) {
    return ApiService.fetchData({ url: 'administration/organizational-units/'+id+'/childrens/bosses-employees/active', method: 'GET' })
}