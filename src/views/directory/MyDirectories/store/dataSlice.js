import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetDirectoriesEmployee } from 'services/DirectoryService'

export const getDirectoriesEmployee = createAsyncThunk(
    'directory_my_directories/data/get_directories_employee',
    async () =>  await apiGetDirectoriesEmployee()
)

const dataSlice = createSlice(
{
    name: 'directory_my_directories/data',
    initialState: {
        loading:false,
        directories:[]
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDirectories:(state,action) => { state.directories = action.payload }
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
    setLoading,
    setDirectories
} = dataSlice.actions

export default dataSlice.reducer
