import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiPermissionTypesIndexActive,apiGetPermission } from 'services/AttendanceService';

export const getPermissionTypesIndexActive = createAsyncThunk('permissions/state/getDiscountByDate', async (data) => await apiPermissionTypesIndexActive(data) )
export const getPermission = createAsyncThunk('permissions/state/getPermission', async (id) => await apiGetPermission(id) )

const dataSlice = createSlice(
{
    name: 'permissions/state',
    initialState: {
        loading: false,
        drawer_open: false,
        drawer_app_open: false,
        drawer_title: '',
        drawer_info:'',
        drawer_body:1,
        permission_types_list:[],
        selected_permission_type:{},
        selected_permission:null,
        submit_type: 1,
        observations:'',
        selected_date: null,
        date_input_read_only: false

    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDrawerAppOpen: (state,action) => { state.drawer_app_open = action.payload },
        setDrawerTitle: (state,action) => { state.drawer_title = action.payload },
        setDrawerInfo: (state,action) => { state.drawer_info = action.payload },
        setDrawerBody: (state,action) => { state.drawer_body = action.payload },
        setSelectedPermissionType: (state,action) => { state.selected_permission_type = action.payload },
        setSelectedPermission: (state,action) => { state.selected_permission = action.payload },
        setSubmitType: (state,action) => { state.submit_type = action.payload },
        setObservations: (state,action) => { state.observations = action.payload },
        setSelectedDate: (state,action) => { state.selected_date = action.payload },
        setDateInputReadOnly: (state,action) => { state.date_input_read_only = action.payload }

    
    },
    extraReducers: (builder) => {
        builder.addCase(getPermissionTypesIndexActive.fulfilled, (state, {payload}) => {
            state.permission_types_list = payload.data
            state.loading = false
        })
        builder.addCase(getPermissionTypesIndexActive.pending, (state) => {
            state.permission_types_list = null
            state.loading = true
        })

        builder.addCase(getPermission.fulfilled, (state, {payload}) => {
            state.selected_permission = payload.data
            // state.loading = false
        })
        builder.addCase(getPermission.pending, (state) => {
            state.selected_permission = null
            state.loading = true
        })
        
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDrawerAppOpen,
    setDrawerTitle,
    setDrawerInfo,
    setDrawerBody,
    setSelectedPermissionType,
    setSelectedPermission,
    setSubmitType,
    setObservations,
    setSelectedDate,
    setDateInputReadOnly
} = dataSlice.actions;

export default dataSlice.reducer;