import { createSlice } from '@reduxjs/toolkit'

const dataSlice = createSlice(
{
    name: 'permission_requests/state',
    initialState: {
        loading: false
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    },
})

export const {
    setLoading
} = dataSlice.actions

export default dataSlice.reducer