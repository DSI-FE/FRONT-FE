import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetEntriesIndexWithFilesByType } from 'services/InstitutionService'

export const getEntriesIndexWithFilesByType = createAsyncThunk('settingsNews/data/getEntriesIndexWithFilesByType', async (type) =>  await apiGetEntriesIndexWithFilesByType(type) )

const dataSlice = createSlice(
{
    name: 'settingsNews/data',
    initialState: {
        loading:false,
        entries:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getEntriesIndexWithFilesByType.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getEntriesIndexWithFilesByType.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading
} = dataSlice.actions

export default dataSlice.reducer
