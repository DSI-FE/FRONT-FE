import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetDiscountByDate, apiGetPermissionRequestsFromEmployeeByPeriod } from 'services/AttendanceService';

export const getDiscountByDate = createAsyncThunk(
    'attendance/state/getDiscountByDate',
    async (data) => await apiGetDiscountByDate(data)
);

export const getPermissionRequestsFromEmployeeByPeriod = createAsyncThunk(
    'attendance/state/getPermissionRequestsFromEmployeeByPeriod',
    async (data) => await apiGetPermissionRequestsFromEmployeeByPeriod(data) 
);


const dataSlice = createSlice(
{
    name: 'attendance/state',
    initialState: {
        loading:false,
        drawer_permission_request_open: false,

        discount_info: null,
        permission_requests: null
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerPermissionRequestOpen: (state,action) => { state.drawer_permission_request_open = action.payload },

        setDiscountInfo: (state, action) => { state.discount_info = action.payload },
        setPermissionRequests: (state,action) => { state.permission_requests = action.payload }
    },
    extraReducers: (builder) =>
    {
        builder.addCase(getDiscountByDate.fulfilled, ( state, { payload }) =>
        {
            state.discount_info = payload.data;
            state.loading = false;
        })
        builder.addCase(getDiscountByDate.pending, ( state ) =>
        {
            state.discount_info = null;
            state.loading = true;
        })

        builder.addCase(getPermissionRequestsFromEmployeeByPeriod.fulfilled, ( state, { payload }) =>
        {
            state.permission_requests = payload.data;
            state.loading = false;
        })
        builder.addCase(getPermissionRequestsFromEmployeeByPeriod.pending, ( state ) =>
        {
            state.permission_requests = null;
            state.loading = true;
        })
    }
});

export const
{
    setLoading,
    setDiscountInfo,
    setDrawerPermissionRequestOpen,
    setPermissionRequests
} = dataSlice.actions;

export default dataSlice.reducer;
