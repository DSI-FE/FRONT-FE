import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetEntry } from 'services/InstitutionService';

export const getEntry = createAsyncThunk('gallery/state/getEntry', async (id) => await apiGetEntry(id) )

const dataSlice = createSlice(
{
    name: 'gallery/state',
    initialState: {
        loading: false,
        drawer_open: false,
        dialog_open: false,
        selected_entry:{},
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDialogOpen: (state,action) => { state.dialog_open = action.payload },
        setSelectedEntry: (state,action) => { state.selected_entry = action.payload },

    },
    extraReducers: (builder) => {

        builder.addCase(getEntry.fulfilled, (state, {payload}) => {
            state.selected_entry = payload.data
            state.loading = false
        })
        builder.addCase(getEntry.pending, (state) => {
            state.selected_entry = {}
            state.loading = true
        })
        
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDialogOpen,
    setSelectedEntry
} = dataSlice.actions;

export default dataSlice.reducer;