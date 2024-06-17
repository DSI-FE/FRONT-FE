import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetEmployee } from "services/AdministrationService";

export const setSelectedEmployee = createAsyncThunk('administration/state/getEmployee', async (id) => {
  return await apiGetEmployee(id);
});

const stateSlice = createSlice({
  name: 'employee/state',
  initialState: {
    deleteConfirmation: false,
    openDrawerAddEmployee: false,
    openAddUserDrawer: false,
    openPhotoDrawer: false,
    openUnsubscribeUserDrawer: false,
    openDrawerUpdateEmployee: false,
    drawerTitle: '',
    updateEmployee: false,
    selectedEmployee: null,
    newEmployee: false,
    unsubscribebEmployee: false,
  },
  reducers: {
    setOpenPhotoDrawer: ( state, action ) => { state.openPhotoDrawer = action.payload },
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;

      if (!action.payload) {
        state.selectedEmployee = null;
      }
    },
    setOpenDrawerAddEmployee: (state, action) => {
      state.openDrawerAddEmployee = action.payload;
      setOpenAddUserDrawer(false);
      setOpenUnsubscribeEmployeeDrawer(false);
      setOpenDrawerUpdateEmployee(false);
    },
    setOpenAddUserDrawer: (state, action) => {
      state.openAddUserDrawer = action.payload;
      //state.selectedEmployee = null;
      setOpenDrawerAddEmployee(false);
      setOpenUnsubscribeEmployeeDrawer(false);
      setOpenDrawerUpdateEmployee(false);
    },
    setOpenUnsubscribeEmployeeDrawer: (state, action) => {
      state.openUnsubscribeUserDrawer = action.payload;
      //state.selectedEmployee = null;
      setOpenAddUserDrawer(false);
      setOpenDrawerAddEmployee(false);
      setOpenDrawerUpdateEmployee(false);
    },
    setOpenDrawerUpdateEmployee: (state, action) => {
      state.openDrawerUpdateEmployee = action.payload;
      setOpenDrawerAddEmployee(false);
      setOpenAddUserDrawer(false);
      setOpenUnsubscribeEmployeeDrawer(false);
    },
    setNewEmployee: (state, action) => {
      state.newEmployee = action.payload;
    },
    setUpdateEmployee: (state, action) => {
      state.updateEmployee = action.payload
    },
    setUnsubscribedEmployee: (state, action) => {
      state.unsubscribedEmployee = action.payload
    },
  },
  extraReducers: {
    [setSelectedEmployee.fulfilled]: (state, action) => {
      state.selectedEmployee = action.payload.data;
      state.loading = false;
    },
    [setSelectedEmployee.pending]: (state) => {
      state.loading = true;
    },
    [setSelectedEmployee.failed]: (state) => {
      state.selectedEmployee = null;
      state.loading = false;
    }
  }
});

export const { setOpenPhotoDrawer,setOpenDrawerAddEmployee, setOpenAddUserDrawer, setOpenUnsubscribeEmployeeDrawer, setOpenDrawerUpdateEmployee, toggleDeleteConfirmation, setNewEmployee, setUpdateEmployee, setUnsubscribedEmployee } = stateSlice.actions;

export default stateSlice.reducer;