import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetFunctionalPosition, apiGetOrganizationalUnit } from 'services/AdministrationService';

export const getFunctionalPosition = createAsyncThunk( 'organizationalUnits/state/getFunctionalPosition', async (id) =>
    await apiGetFunctionalPosition(id)
)

export const getOrganizationalUnit = createAsyncThunk( 'organizationalUnits/state/getOrganizationalUnit', async (id) =>
    await apiGetOrganizationalUnit(id)
)

const dataSlice = createSlice(
{
    name: 'organizationalUnits/state',
    initialState: {
        loading: false,
        drawer_open: false,
        dialog_open: false,
        selected_entry_id:null,
        selected_entry:null,
        organizational_unit:null
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDialogOpen: (state,action) => { state.dialog_open = action.payload },
        setSelectedEntryId: (state,action) => { state.selected_entry_id = action.payload },
        setSelectedEntry: (state,action) => { state.selected_entry = action.payload },
        setOrganizationalUnit: (state,action) => { state.organizational_unit = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getFunctionalPosition.fulfilled, (state, {payload}) => {
            state.selected_entry = payload.data
            state.loading = false
        })
        builder.addCase(getFunctionalPosition.pending, (state) => {
            state.selected_entry = null
            state.loading = true
        })
        builder.addCase(getOrganizationalUnit.fulfilled, (state, {payload}) => {
            state.organizational_unit = payload.data != '' ? payload.data : null
            state.loading = false
        })
        builder.addCase(getOrganizationalUnit.pending, (state) => {
            state.organizational_unit = null
            state.loading = true
        })
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDialogOpen,
    setSelectedEntryId,
    setSelectedEntry,
    setOrganizationalUnit
} = dataSlice.actions;

export default dataSlice.reducer;