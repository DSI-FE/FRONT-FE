import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer as DrawerTemp } from 'components/ui'
import Content from './Content'
// import { setDrawerOpen, setSelectedEntry, setLoading } from '../../store/stateSlice'
import { setDrawerContactInfoOpen,setDrawerContactOpen, setSelectedContact, setLoading } from '../../store/stateSlice'

import { themeConfig } from 'configs/theme.config';
import { HiPencil, HiTrash } from 'react-icons/hi'
const {textThemeColor, colorTheme, colorDanger} = themeConfig;


const Drawer = () =>
{
	const dispatch = useDispatch();
	const { drawer_contact_info_open:drawerContactInfoOpen,loading } = useSelector((state) => state.directory_my_directories.state );

    const onDrawerClose = () => {
        dispatch(setDrawerContactInfoOpen(false))
        dispatch(setSelectedContact({}))
        dispatch(setLoading(false))
	}


    const Title = () => (
		<div>
			<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
                {`Información Contacto`}
            </h4>
            <span>
                Elit dolore voluptate consequat cupidatat nulla nostrud sint consequat officia dolor do. Dolor proident ipsum velit eiusmod cillum id.
            </span>
		</div>
	);
    
    const Footer = ( { onSaveClick, onCancel, onReset } ) =>
	{

        const handleEdit = () =>    {
            dispatch(setDrawerContactInfoOpen(false))
            dispatch(setDrawerContactOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(setLoading(false))
            },250)
        }

		return (
			<div className="flex justify-between items-center w-full">
                <Button disabled={loading} size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                <div className="flex justify-start gap-5">
                    <Button disabled={loading} size="sm" icon={<HiPencil/>} variant="solid" color={colorDanger} onClick={onCancel}>Eliminar</Button>
                    <Button disabled={loading} size="sm" icon={<HiTrash/>} variant="solid" color={colorTheme} onClick={handleEdit}>Editar</Button>
                </div>
			</div>
		)
	}
    
    return (
        <>
            <DrawerTemp
                isOpen={drawerContactInfoOpen}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
                closable={false}
                title={<Title />}
                footer={ <Footer onCancel={onDrawerClose} /> }
                width={40}
                widthPercent={true}
            >
                <Content/>
            </DrawerTemp>
        </>
	)
    
}

export default Drawer;
