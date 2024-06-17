import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetHolidays } from 'services/AttendanceService'

export const getHolidays = createAsyncThunk('settingsHolidays/data/getHolidays', async () =>  await apiGetHolidays() )

const dataSlice = createSlice(
{
    name: 'settingsHolidays/data',
    initialState: {
        loading:false,
        entries:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setEntries: (state,action) => { state.entries = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getHolidays.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getHolidays.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading,
    setEntries
} = dataSlice.actions

export default dataSlice.reducer
