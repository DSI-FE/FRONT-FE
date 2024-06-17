import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetCompensatory } from 'services/AttendanceService';

export const getEntry = createAsyncThunk('compensatories/state/getEntry', async (id) => await apiGetCompensatory(id) )

const dataSlice = createSlice(
{
    name: 'compensatories/state',
    initialState: {
        loading: false,
        drawer_open: false,
        drawer_management_open: false,
        dialog_open: false,
        selected_entry_id:null,
        selected_entry:null
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDrawerManagementOpen: (state,action) => { state.drawer_management_open = action.payload },
        setDialogOpen: (state,action) => { state.dialog_open = action.payload },
        setSelectedEntryId: (state,action) => { state.selected_entry_id = action.payload },
        setSelectedEntry: (state,action) => { state.selected_entry = action.payload },

    },
    extraReducers: (builder) => {

        builder.addCase(getEntry.fulfilled, (state, {payload}) => {
            state.selected_entry = payload.data
            state.loading = false
        })
        builder.addCase(getEntry.pending, (state) => {
            state.selected_entry = null
            state.loading = true
        })
        
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDrawerManagementOpen,
    setDialogOpen,
    setSelectedEntryId,
    setSelectedEntry
} = dataSlice.actions;

export default dataSlice.reducer;