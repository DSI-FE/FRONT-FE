import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
    apiGetOrganizationalUnitChildrens,
    apiGetOrganizationalUnitChildrensActiveEmployees,
    apiGetOrganizationalUnitDirectChildrensActiveBossEmployees,
} from 'services/AdministrationService'

export const getOrganizationalUnits = createAsyncThunk(
    'permission_requests/data/getOrganizationalUnits',
    async ({ id }) =>  await apiGetOrganizationalUnitChildrens(id)
)

export const getOrganizationalUnitChildrensActiveEmployees = createAsyncThunk(
    'permission_requests/data/getOrganizationalUnitChildrensActiveEmployees',
    async ({ id }) =>  await apiGetOrganizationalUnitChildrensActiveEmployees(id)
)

export const getOrganizationalUnitDirectChildrensActiveBossEmployees = createAsyncThunk(
    'permission_requests/data/getOrganizationalUnitDirectChildrensActiveBossEmployees',
    async ({ id }) =>  await apiGetOrganizationalUnitDirectChildrensActiveBossEmployees(id)
)

const dataSlice = createSlice(
{
    name: 'attendance_requests/data',
    initialState: {
        loading: false,
        segments: [
			{ name: 'Enviadas', value:1, default:true },
            { name: 'Colaboradores', value:2, default:false },
            { name: 'THumano', value:3, default:false }
		],
        organizational_units:[],
        employees:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setSegments: (state,action) => { state.segments = action.payload },
        setEmployees: (state,action) => { state.employees = action.payload },
        setOrganizationalUnits: (state,action) => { state.organizational_units = action.payload }
    },
    extraReducers: (builder) => {
        
        builder.addCase(getOrganizationalUnits.fulfilled, (state, {payload}) => {
            state.organizational_units = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnits.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getOrganizationalUnitChildrensActiveEmployees.fulfilled, (state, {payload}) => {
            state.employees = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnitChildrensActiveEmployees.pending, (state) => {
            state.loading = true
        })

        builder.addCase(getOrganizationalUnitDirectChildrensActiveBossEmployees.fulfilled, (state, {payload}) => {
            state.employees = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnitDirectChildrensActiveBossEmployees.pending, (state) => {
            state.loading = true
        })
        
    }
    
})

export const {
    setLoading,
    setSegments,
    setEmployees,
    setOrganizationalUnits
} = dataSlice.actions

export default dataSlice.reducer
