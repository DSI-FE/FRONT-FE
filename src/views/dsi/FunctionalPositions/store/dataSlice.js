import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetFunctionalPositions, apiGetOrganizationalUnits } from 'services/AdministrationService'

export const getFunctionalPositions = createAsyncThunk('organizationalUnits/data/getFunctionalPositions', async ( id ) => 
    await apiGetFunctionalPositions( id )
)

export const getOrganizationalUnits = createAsyncThunk('organizationalUnits/data/getOrganizationalUnits', async () =>
    await apiGetOrganizationalUnits()
)

const dataSlice = createSlice(
{
    name: 'organizationalUnits/data',
    initialState: {
        loading:false,
        entries:[],
        organizational_units:[]

    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setEntries: (state,action) => { state.entries = action.payload },
        setOrganizationalUnits: (state,action) => { state.organizational_units = action.payload }

    },
    extraReducers: (builder) => {
        builder.addCase(getFunctionalPositions.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getFunctionalPositions.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getOrganizationalUnits.fulfilled, (state, {payload}) => {
            state.organizational_units = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnits.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading,
    setEntries,
    setOrganizationalUnits
} = dataSlice.actions

export default dataSlice.reducer
