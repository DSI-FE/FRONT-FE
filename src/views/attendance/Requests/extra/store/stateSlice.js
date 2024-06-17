import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const dataSlice = createSlice(
{
    name: 'compensatories/state',
    initialState: {
        loading: false,
        drawer_open: false,
        drawer_title: '',
        drawer_info:'',
        drawer_body:1

    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDrawerTitle: (state,action) => { state.drawer_title = action.payload },
        setDrawerInfo: (state,action) => { state.drawer_info = action.payload },
        setDrawerBody: (state,action) => { state.drawer_body = action.payload }
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDrawerTitle,
    setDrawerInfo,
    setDrawerBody
} = dataSlice.actions;

export default dataSlice.reducer;