import { createSlice } from '@reduxjs/toolkit'

const dataSlice = createSlice(
{
    name: 'attendance_requests/state',
    initialState: {
        loading: false,
        selected_state:0,
        selected_employee: 0,
        selected_segment:['1'],
        selected_organizational_unit: 0
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setSelectedState: (state,action) => { state.selected_state = action.payload },
        setSelectedSegment: (state,action) => { state.selected_segment = action.payload },
        setSelectedEmployee: (state,action) => { state.selected_employee = action.payload },
        setSelectedOrganizationalUnit: (state,action) => { state.selected_organizational_unit = action.payload }

    },
})

export const {
    setLoading,
    setSelectedState,
    setSelectedSegment,
    setSelectedEmployee,
    setSelectedOrganizationalUnit
} = dataSlice.actions

export default dataSlice.reducer