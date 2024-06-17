import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetEmployeeWithPic } from 'services/DirectoryService'

export const setEmployee = createAsyncThunk('directory/state/getEmployee', async (id) =>  await apiGetEmployeeWithPic(id) )

const stateSlice = createSlice(
{
    name: 'directory/state',
    initialState: {
        loading:false,
        drawerOpen: false,
        employee: {},
        sortedColumn: () => {},
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawerOpen = action.payload },
        setSortedColumn: (state, action) => { state.sortedColumn = action.payload },
        clearEmployee:(state) => { state.employee = {} }
        
    } ,
    extraReducers: (builder) => {
        builder.addCase(setEmployee.fulfilled, (state, {payload}) =>
        {
            state.employee = payload.data
            state.loading = false
        })
        builder.addCase(setEmployee.pending, (state) =>
        {
            state.loading = true
        })
    }
})

export const
{
    setLoading,
    setDrawerOpen,
    setSortedColumn,
    clearEmployee
} = stateSlice.actions

export default stateSlice.reducer