import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetPermissionTypes } from 'services/AttendanceService'

export const getPermissionTypes = createAsyncThunk('settingsPermissionTypes/data/getPermissionTypes', async () =>  await apiGetPermissionTypes() )

const dataSlice = createSlice(
{
    name: 'settingsPermissionTypes/data',
    initialState: {
        loading:false,
        entries:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setEntries: (state,action) => { state.entries = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getPermissionTypes.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getPermissionTypes.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading,
    setEntries
} = dataSlice.actions

export default dataSlice.reducer
