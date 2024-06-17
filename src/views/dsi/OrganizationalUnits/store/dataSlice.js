import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetOrganizationalUnits } from 'services/AdministrationService'

export const getOrganizationalUnits = createAsyncThunk('organizationalUnits/data/getOrganizationalUnits', async () =>  await apiGetOrganizationalUnits() )

const dataSlice = createSlice(
{
    name: 'organizationalUnits/data',
    initialState: {
        loading:false,
        entries:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setEntries: (state,action) => { state.entries = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrganizationalUnits.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getOrganizationalUnits.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading,
    setEntries
} = dataSlice.actions

export default dataSlice.reducer
