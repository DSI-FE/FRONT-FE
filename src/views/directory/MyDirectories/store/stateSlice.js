import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetDirectory,apiGetContactIndexByDirectoryWithImage,apiGetContact } from 'services/DirectoryService';

export const getDirectory = createAsyncThunk('directory_my_directories/state/get_directory', async (id) => await apiGetDirectory(id) )
export const getContactIndexByDirectoryWithImage = createAsyncThunk('directory_my_directories/state/get_contact_index_by_directory_with_image', async (id) => await apiGetContactIndexByDirectoryWithImage(id) )
export const getContact = createAsyncThunk('directory_my_directories/state/get_contact', async (id) => await apiGetContact(id) )

const dataSlice = createSlice(
{
    name: 'directory_my_directories/state',
    initialState: {
        loading: false,
        drawer_open: false,
        drawer_contact_open: false,
        drawer_contact_info_open: false,
        create: false,
        dialog_open: false,
        selected_directory:{},
        selected_directory_id:null,
        selected_directory_contacts:[],
        selected_contact:{}
    },
    reducers: {
        setLoading: (state,action) => { state.loading = action.payload },
        setDrawerOpen: (state,action) => { state.drawer_open = action.payload },
        setDrawerContactOpen: (state,action) => { state.drawer_contact_open = action.payload },
        setDrawerContactInfoOpen: (state,action) => { state.drawer_contact_info_open = action.payload },
        setCreate: (state,action) => { state.create = action.payload },
        setDialogOpen: (state,action) => { state.dialog_open = action.payload },
        setSelectedDirectory: (state,action) => { state.selected_directory = action.payload },
        setSelectedDirectoryId: (state,action) => { state.selected_directory_id = action.payload },
        setSelectedDirectoryContacts: (state,action) => { state.selected_directory_contacts = action.payload },
        setSelectedContact: (state,action) => { state.selected_contact = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(getDirectory.fulfilled, (state, {payload}) => {
            state.selected_directory = payload.data
            state.loading = false
        })
        builder.addCase(getDirectory.pending, (state) => {
            state.selected_directory = {}
            state.loading = true
        })
        builder.addCase(getContactIndexByDirectoryWithImage.fulfilled, (state, {payload}) => {
            state.selected_directory_contacts = payload.data
            state.loading = false
        })
        builder.addCase(getContactIndexByDirectoryWithImage.pending, (state) => {
            state.selected_directory_contacts = []
            state.loading = true
        })
        builder.addCase(getContact.fulfilled, (state, {payload}) => {
            state.selected_contact = payload.data
            state.loading = false
        })
        builder.addCase(getContact.pending, (state) => {
            state.selected_contact = {}
            state.loading = true
        })
    }
});

export const {
    setLoading,
    setDrawerOpen,
    setDrawerContactOpen,
    setDrawerContactInfoOpen,
    setCreate,
    setDialogOpen,
    setSelectedDirectory,
    setSelectedDirectoryId,
    setSelectedDirectoryContacts,
    setSelectedContact
} = dataSlice.actions;

export default dataSlice.reducer;