import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const dataSlice = createSlice(
{
    name: 'compensatories/data',
    initialState: {
        loading:false
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload }
    }
});

export const
{
    setLoading
} = dataSlice.actions;

export default dataSlice.reducer;
