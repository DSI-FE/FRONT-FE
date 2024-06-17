import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetEmployees, apiGetOrganizationalUnits } from 'services/DirectoryService';

export const getEmployees = createAsyncThunk(
    'directory/data/getEmployees', 
    async (data) => await apiGetEmployees(data)
);

export const getOrganizationalUnits = createAsyncThunk(
    'directory/data/getOrganizationalUnits', 
    async (data) => await apiGetOrganizationalUnits(data)
);

export const initialOrganizationalUnitId = '';
export const initialTableData =
{
    total: 0,
    page: 1,
    paginate: 25,
    search: '',
    sort:
    {
        order: 'name',
        key: 'desc'
    }
}

const dataSlice = createSlice(
{
    name: 'directory/data',
    initialState:
    {
        loading: false,
        employeesList: [],
        organizationalUnitsList: [],
        tableData: initialTableData,
        organizationalUnitId: initialOrganizationalUnitId,
    },
    reducers:
    {
        setTableData: (state, action) =>
        {
            state.tableData = action.payload;
        },
        setEmployeesList: (state, action) =>
        {
            state.employeesList = action.payload;
        },
        setOrganizationalUnitId: (state, action) =>
        {
            state.organizationalUnitId = action.payload;
        },
        setOrganizationalUnitsList: (state, action) =>
        {
            state.organizationalUnitsList = action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder.addCase(getEmployees.fulfilled, (state, {payload}) =>
        {
            state.employeesList = payload.data.data;
            state.tableData.total = payload.data.last_page;
            state.loading = false;
        })

        builder.addCase(getEmployees.pending, (state) =>
        {
            state.loading = true;
        })

        builder.addCase(getOrganizationalUnits.fulfilled, (state, {payload}) =>
        {
            state.organizationalUnitsList = payload.data;
            state.loading = false;
        })

        builder.addCase(getOrganizationalUnits.pending, (state) =>
        {
            state.loading = true;
        })
    }
});

export const
{
    setTableData,
    setOrganizationalUnitId,
    setEmployeesList
} = dataSlice.actions;

export default dataSlice.reducer;
