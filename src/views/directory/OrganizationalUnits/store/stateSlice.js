import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice(
{
    name: 'adminUnidadesOrganizacionales/state',
    initialState:
    {
        drawerOpen: false,
        selectedUnidadOrganizacional: {},
        sortedColumn: () => {},
    },
    reducers:
    {
        setSelectedUnidadOrganizacional: (state, action) =>
        {
            state.selectedUnidadOrganizacional = action.payload;
        },
        setSortedColumn: (state, action) =>
        {
            state.sortedColumn = action.payload;
        },
        setDrawerOpen: (state) =>
        {
            state.drawerOpen = true;
        },
        setDrawerClose: (state) =>
        {
            state.drawerOpen = false;
        },
    },
});

export const
{ 
    setSelectedUnidadOrganizacional, 
    setSortedColumn, 
    setDrawerOpen,
    setDrawerClose
} = stateSlice.actions;

export default stateSlice.reducer;