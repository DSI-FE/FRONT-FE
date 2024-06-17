import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAdminUnidades } from 'services/AdminService';

export const getUnidades = createAsyncThunk('adminUnidades/data/getUnidades', async (data) =>
{
    const response = await apiGetAdminUnidades(data);
    const res = {data:response.data.data,total:response.data.last_page};
    return response;
});

export const initialTableData =
{
    total: 0,
    page: 1,
    paginate: 25,
    search: '',
    sort:
    {
        order: '',
        key: ''
    }
}

export const initialFilterData =
{
    unidadId: '',
}

const dataSlice = createSlice(
{
    name: 'adminUnidades/data',
    initialState:
    {
        loading: false,
        unidadesList: [],
        statisticData: {},
        tableData: initialTableData,
        filterData: initialFilterData,
    },
    reducers:
    {
        setTableData: (state, action) =>
        {
            state.tableData = action.payload;
        },
        setUnidadesList: (state, action) =>
        {
            state.unidadesList = action.payload;
        },
        setFilterData: (state, action) =>
        {
            state.filterData = action.payload;
        },
    },
    extraReducers:
    {
        [getUnidades.fulfilled]: (state, action) =>
        {
            state.unidadesList = action.payload.data;
            state.tableData.total = action.payload.total;
            state.loading = false;
        },
        [getUnidades.pending]: (state) =>
        {
            state.loading = true;
        }
    }
});

export const
{
    setTableData,
    setUnidadesList,
    setFilterData
} = dataSlice.actions;

export default dataSlice.reducer;
