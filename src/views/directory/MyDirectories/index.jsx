import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer from './store'
import { getDirectoriesEmployee,setDirectories } from './store/dataSlice'
import { setDialogOpen } from './store/stateSlice'
import { getDirectory,getContactIndexByDirectoryWithImage,setLoading,setDrawerOpen,setDrawerContactOpen,setCreate,setSelectedDirectory } from './store/stateSlice'
import { Select,Button } from 'components/ui'
import { CustomSelectOption } from 'components/custom'
import { RiAddCircleFill } from 'react-icons/ri'
import { HiCog, HiPencil,HiTrash,HiOutlineUserAdd} from 'react-icons/hi'
import { FaListUl } from 'react-icons/fa'
import CreateDrawer from './components/CreateDrawer/Drawer'
import CreateContactDrawer from './components/CreateContactDrawer/Drawer'
import ContactsTable from './components/ContactsTable'
import InfoContactDrawer from './components/InfoContactDrawer/Drawer'
import { themeConfig } from 'configs/theme.config'
import { Dropdown } from 'components/ui'
import { TextSlicer } from 'helpers'


const { colorDanger } = themeConfig

injectReducer('directory_my_directories', reducer)

const MyDirectories = ({className}) => {

    // States ----------------------------------------------------------------------------------------------


    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { employee, user }  = useSelector( state => state.auth )
    const { directories }  = useSelector( state => state.directory_my_directories.data )
    const { selected_directory:selectedDirectory,selected_directory_contacts:contacts }  = useSelector( state => state.directory_my_directories.state )

    // Fetching Data ---------------------------------------------------------------------------------------

    const fetchData = useCallback( async () => {
        dispatch(setSelectedDirectory({}))
        dispatch(setDirectories([]))
        dispatch(getDirectoriesEmployee())
    }, [ dispatch ])
    
    useEffect( () => { fetchData() }, [ fetchData ])
    useEffect(() => {
        if (directories && directories.length > 0) {
            dispatch( getDirectory(directories[0].id) )
            dispatch( getContactIndexByDirectoryWithImage(directories[0].id) )
        }
    }, [directories, dispatch]);
    
    // Subcomponents ---------------------------------------------------------------------------------------

    const DirectorySelect = ( { className } ) =>
    {
        const options = []
        directories.forEach( per =>	{ options.push({ value:per.id, label:(per.name) }) })
        const handleFilterChange = async (selected) => { 
            dispatch( getDirectory(selected.value) )
            dispatch( getContactIndexByDirectoryWithImage(selected.value) )
        }
        return (
            <div className={`${className}`}>
                <div className={`mb-2 font-semibold`}>Directorios</div>
                <Select 
                    options = { options }
                    placeholder={'Selecciona el directorio que deseas consultar'}
                    onChange = { handleFilterChange }
                    components = {{ Option: CustomSelectOption }}
                    value = { options.filter(option => selectedDirectory ? option.value === selectedDirectory.id : null) }
                />
            </div>
        )
    }

    const CreateDirectoryButton = ( { className } ) =>
    {
        const handleCreate = () =>    {
            dispatch(setDrawerOpen(true))
            dispatch(setLoading(true))
            dispatch(setCreate(true))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }
        return (
            <div className={`${className}`}>
                <Button onClick={handleCreate} icon={<RiAddCircleFill/>} variant="solid">Nuevo Directorio</Button>
            </div>
        )
    }

    const EditDirectoryButton = () =>
    {
        const handleEditDirectory = () =>    {
            dispatch(setDrawerOpen(true))
            dispatch(setLoading(true))
            dispatch(setCreate(false))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }
        return (
            <Dropdown.Item eventKey="a" onClick={handleEditDirectory} >
                <HiPencil/> Editar
            </Dropdown.Item>
        )
    }

    const ManageDirectoryClassificationsButton = () =>
    {
        const handleManageClassifications = () =>    {
            dispatch(setDrawerOpen(true))
            dispatch(setLoading(true))
            dispatch(setCreate(true))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }
        return (
            <Dropdown.Item eventKey="c" onClick={handleManageClassifications} >
                <FaListUl/> Clasificaciones
            </Dropdown.Item>
        )
    }

    const DeleteDirectoryButton = () =>
    {
        const handleDeleteDirectory = () => {
            dispatch(setDialogOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }
        return (
            <Dropdown.Item eventKey="b" onClick={handleDeleteDirectory} >
                <HiTrash/> Eliminar
            </Dropdown.Item>
        )
    }

    const ContactsDiv = () => {
        const handleCreate = () =>    {
            dispatch(setDrawerContactOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }
    
        const ButtonNewEntry = ()  => <Button onClick={handleCreate} title='Agregar nuevo contacto' icon={<HiOutlineUserAdd/>} variant="solid" />
        return (
            <>
                <div className={`flex justify-between items-center mt-8 border-t border-b py-2`}>
                    <div className='flex justify-start items-center gap-4'>
                        <h4>{TextSlicer(selectedDirectory.name)}</h4>
                        <Dropdown placement="bottom-center" renderTitle={<Button icon={<HiCog/>} variant='plain'></Button>}>
                            <EditDirectoryButton/>
                            <ManageDirectoryClassificationsButton/>
                            <DeleteDirectoryButton/>
                        </Dropdown>
                    </div>
                    <div className={`flex gap-4`}>
                        <ButtonNewEntry/>
                    </div>
                </div>
                <ContactsTable contacts = { contacts }/>
            </>
        )
    }

    return (
        <div className={`${className}`}>
            <div className={`flex justify-between items-end`}>
                <div className={`flex justify-start items-end gap-4 w-8/12`}>
                    <div className={`flex justify-start items-end gap-4 w-8/12 `}>
                        <DirectorySelect className={`w-full`} />
                    </div>
                </div>
                <CreateDirectoryButton />
            </div>
            <div>
            {
                Object.keys(selectedDirectory).length > 0 && ( directories && directories.length > 0 ) ? <ContactsDiv/> : <></>
            }
            </div>


            <CreateDrawer />
            <CreateContactDrawer />
            <InfoContactDrawer />

        </div>
	)
}

export default MyDirectories


