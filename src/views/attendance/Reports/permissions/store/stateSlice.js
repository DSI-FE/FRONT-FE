import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetDiscountByDate } from 'services/AttendanceService'
import { apiGetOrganizationalUnitEmployeesPermissionTypes } from 'services/AdministrationService'

export const getDiscountByDate = createAsyncThunk('attendance/state/getDiscountByDate', async (data) => await apiGetDiscountByDate(data) )
export const setEmployeesList = createAsyncThunk('attendance/state/setEmployeesList', async (data) =>  await apiGetOrganizationalUnitEmployeesPermissionTypes(data) )


const dataSlice = createSlice({
    name: 'attendance/state',
    initialState: {
        loading:false,
        dateInfo: null,
        employeesList:[],
        drawerInfoOpen: false,
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDateInfo: (state, action) => { state.dateInfo = action.payload },
        setDrawerInfoOpen: (state, action) => { state.drawerInfoOpen = action.payload },
    },
    extraReducers: (builder) => {
        builder.addCase(getDiscountByDate.fulfilled, (state, {payload}) => {
            state.dateInfo = payload.data
            state.loading = false
        })
        builder.addCase(getDiscountByDate.pending, (state) => {
            state.dateInfo = null
            state.loading = true
        })
        builder.addCase(setEmployeesList.fulfilled, (state, {payload}) => {
            state.employeesList = payload.data
            state.loading = false
        })
        builder.addCase(setEmployeesList.pending, (state) => {
            state.employeesList = null
            state.loading = true
        })
    }
})

export const
{
    setLoading,
    setDateInfo,
    setDrawerInfoOpen
} = dataSlice.actions

export default dataSlice.reducer
