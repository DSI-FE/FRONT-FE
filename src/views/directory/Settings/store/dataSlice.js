import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetDirectoriesEmployee } from 'services/DirectoryService'

export const getDirectoriesEmployee = createAsyncThunk(
    'directory_settings/data/get_directories_employee',
    async () =>  await apiGetDirectoriesEmployee()
)

const dataSlice = createSlice(
{
    name: 'directory_settings/data',
    initialState: {
        loading:false,
        directories:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getDirectoriesEmployee.fulfilled, (state, {payload}) => {
            state.directories = payload.data
            state.loading = false
        })
        builder.addCase(getDirectoriesEmployee.pending, (state) => {
            state.loading = true
        })
    }
})

export const {
    setLoading
} = dataSlice.actions

export default dataSlice.reducer
