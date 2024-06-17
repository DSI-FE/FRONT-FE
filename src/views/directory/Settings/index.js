import React from 'react'
import { injectReducer } from 'store/index'
import reducer from '../store'
import EntriesTable from './components/EntriesTable'
import Drawer from './components/CreateDrawer/Drawer'
import Dialog from './components/DeleteDialog/Dialog'

injectReducer('directory_settings', reducer);

const Gallery = ({className}) => {

    return (
        <>
            <EntriesTable/>
            <Drawer/>
            <Dialog/>
        </>
	);
}

export default Gallery;