import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const dataSlice = createSlice(
{
    name: 'attendanceStt/settings/state',
    initialState: {
        loading: false,
        dialog_sync_open: false,
        data_drawer_open: false,
        data_drawer_title: '',
        data_drawer_info:'',
        data_drawer_body:1

    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDialogSyncOpen: (state,action) => { state.dialog_sync_open = action.payload },
        setDataDrawerOpen: (state,action) => { state.data_drawer_open = action.payload },
        setDataDrawerTitle: (state,action) => { state.data_drawer_title = action.payload },
        setDataDrawerInfo: (state,action) => { state.data_drawer_info = action.payload },
        setDataDrawerBody: (state,action) => { state.data_drawer_body = action.payload }
    }
});

export const {
    setLoading,
    setDialogSyncOpen,
    setDataDrawerOpen,
    setDataDrawerTitle,
    setDataDrawerInfo,
    setDataDrawerBody
} = dataSlice.actions;

export default dataSlice.reducer;