import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCompensatoriesByEmployee, apiGetCompensatoriesByOrganizationalUnit} from 'services/AttendanceService'

export const getCompensatoriesByEmployee = createAsyncThunk('compensatories/data/getCompensatoriesByEmployee', async (id) =>  await apiGetCompensatoriesByEmployee(id) )
export const getCompensatoriesByOrganizationalUnit = createAsyncThunk('compensatories/data/getCompensatoriesByOrganizationalUnit', async (id) =>  await apiGetCompensatoriesByOrganizationalUnit(id) )

const dataSlice = createSlice(
{
    name: 'compensatories/data',
    initialState: {
        loading:false,
        entries:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getCompensatoriesByEmployee.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getCompensatoriesByEmployee.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCompensatoriesByOrganizationalUnit.fulfilled, (state, {payload}) => {
            state.entries = payload.data
            state.loading = false
        })
        builder.addCase(getCompensatoriesByOrganizationalUnit.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading
} = dataSlice.actions

export default dataSlice.reducer
