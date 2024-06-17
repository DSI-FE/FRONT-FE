import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetMarkingsByPeriod } from 'services/AttendanceService';

export const getMarkingsByPeriod = createAsyncThunk('attendance/data/getMarkings', async (data) => await apiGetMarkingsByPeriod(data) );
export const initialFilterData = { unidadId: '' }

const dataSlice = createSlice(
{
    name: 'attendance/data',
    initialState: {
        permission_types:[],
        total_time_not_worked:0,
        total_time_justified_pay:0,
        total_time_justified_no_pay:0,
        total_time_discounted:0,
        total_discount_mount:0,
        dates: [],
        date_ini:null,
        date_end:null,
        show_no_laboral_days:false,
        employee_id:null,
        filterData:initialFilterData,
        loading:false
    },
    reducers: {
        setPermissionTypes:(state, action) =>{ state.permission_types = action.payload },
        setTotalTimeNotWorked:(state, action) =>{ state.total_time_not_worked = action.payload },
        setTotalTimeJustifiedPay:(state, action) =>{ state.total_time_justified_pay = action.payload },
        setTotalTimeJustifiedNoPay:(state, action) =>{ state.total_time_justified_no_pay = action.payload },
        setTotalTimeDiscounted:(state, action) =>{ state.total_time_discounted = action.payload },
        setTotalDiscountMount:(state, action) =>{ state.total_discount_mount = action.payload },
        setDates: (state, action) =>{ state.markings = action.payload },
        setDateIni: (state, action) => { state.date_ini=action.payload },
        setDateEnd: (state, action) => { state.date_end=action.payload },
        setShowNoLaboralDays: (state, action) => { state.show_no_laboral_days=action.payload },
        setEmployeeId: (state, action) => { state.employee_id=action.payload },
        setFilterData: (state, action) => { state.filterData = action.payload; },
        setLoading: (state, action) =>  {state.loading=action.payload}
    },
    extraReducers: (builder) =>
    {
        builder.addCase(getMarkingsByPeriod.fulfilled, (state, {payload}) =>
        {
            state.permission_types=payload.data.permission_types
            state.total_time_not_worked=payload.data.totalTimeNotWorked
            state.total_time_justified_pay=payload.data.totalTimeJustifiedPay
            state.total_time_justified_no_pay=payload.data.totalTimeJustifiedNoPay
            state.total_time_discounted=payload.data.totalTimeDiscounted
            state.total_discount_mount=payload.data.totalDiscountMount
            state.dates = payload.data.dates;
            state.loading = false;
        })
        builder.addCase(getMarkingsByPeriod.pending, (state) =>
        {
            state.loading = true;
        })
    }
});

export const
{
    setPermissionTypes,
    setTotalTimeNotWorked,
    setTotalTimeJustifiedPay,
    setTotalTimeJustifiedNoPay,
    setTotalTimeDiscounted,
    setTotalDiscountMount,
    setDates,
    setDateIni,
    setDateEnd,
    setShowNoLaboralDays,
    setEmployeeId,
    setFilterData,
    setLoading
} = dataSlice.actions;

export default dataSlice.reducer;
