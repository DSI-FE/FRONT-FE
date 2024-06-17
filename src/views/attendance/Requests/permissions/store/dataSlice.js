import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetEmployeePermissions,apiGetOrganizationUnitPermissions,apiGetAllPermissions,apiGetPermissionsByState } from 'services/AttendanceService'

import { apiGetOrganizationalUnitChildrens } from 'services/AdministrationService'

export const getEmployeePermissions = createAsyncThunk('attendance/data/getEmployeePermissions', async (data) =>  await apiGetEmployeePermissions({id:data.id,state:data.state}) )
export const getOrganizationUnitPermissions = createAsyncThunk('attendance/data/getOrganizationalUnitPermissions', async (data) =>  await apiGetOrganizationUnitPermissions({id:data.id,state:data.state,organizationalUnitId:data.organizationalUnitId}) )
export const getAllPermissions = createAsyncThunk('attendance/data/getAllPermissions', async () =>  await apiGetAllPermissions() )
export const getPermissionsByState = createAsyncThunk('attendance/data/getPermissionsByState', async (state) =>  await apiGetPermissionsByState(state) )
export const getOrganizationalUnitChildrens = createAsyncThunk('attendance/data/getOrganizationalUnitChildrens', async (id) =>  await apiGetOrganizationalUnitChildrens(id) )



const dataSlice = createSlice(
{
    name: 'attendance/data',
    initialState: {
        loading:false,
        employee_permissions:[],
        organizational_unit_permissions:[],
        all_permissions:[],
        organizational_units:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getEmployeePermissions.fulfilled, (state, {payload}) => {
            state.employee_permissions = payload.data
            state.loading = false
        })
        builder.addCase(getEmployeePermissions.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getOrganizationUnitPermissions.fulfilled, (state, {payload}) => {
            state.organizational_unit_permissions = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationUnitPermissions.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllPermissions.fulfilled, (state, {payload}) => {
            state.all_permissions = payload.data
            state.loading = false
        })
        builder.addCase(getAllPermissions.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getPermissionsByState.fulfilled, (state, {payload}) => {
            state.all_permissions = payload.data
            state.loading = false
        })
        builder.addCase(getPermissionsByState.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getOrganizationalUnitChildrens.fulfilled, (state, {payload}) => {
            state.organizational_units = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnitChildrens.pending, (state) => {
            state.loading = true
        })

        
    }
})

export const {
    setLoading
} = dataSlice.actions

export default dataSlice.reducer
