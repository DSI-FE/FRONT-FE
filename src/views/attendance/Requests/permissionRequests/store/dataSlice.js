import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetPermissionRequestsFromEmployeeAndState,
    apiGetPermissionRequestFromOrganizationalUnit
} from 'services/AttendanceService'

// Obtener por empleado y estado
export const getPermissionRequestsFromEmployeeAndState = createAsyncThunk(
    'permission_requests/data/getPermissionRequestsFromEmployeeAndState',
    async ({ employeeId, state }) =>  await apiGetPermissionRequestsFromEmployeeAndState({ employeeId, state })
)

// Obtener por unidad organizacional
export const getPermissionRequestFromOrganizationalUnit = createAsyncThunk(
    'permission_requests/data/getPermissionRequestFromOrganizationalUnit',
    async ({ organizationalUnitId, childrens, activeOnly, state }) =>  await apiGetPermissionRequestFromOrganizationalUnit({ organizationalUnitId, childrens, activeOnly, state })
)

const dataSlice = createSlice(
{
    name: 'permission_requests/data',
    initialState: {
        loading: false,
        permission_requests: []
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setPermissionRequest: (state,action) => { state.permission_requests = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getPermissionRequestsFromEmployeeAndState.fulfilled, (state, {payload}) => {
            state.permission_requests = payload.data
            state.loading = false
        })
        builder.addCase(getPermissionRequestsFromEmployeeAndState.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getPermissionRequestFromOrganizationalUnit.fulfilled, (state, {payload}) => {
            state.permission_requests = payload.data
            state.loading = false
        })
        builder.addCase(getPermissionRequestFromOrganizationalUnit.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading,
    setPermissionRequest
} = dataSlice.actions

export default dataSlice.reducer
