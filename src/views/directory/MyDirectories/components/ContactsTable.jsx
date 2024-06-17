import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button, Avatar } from 'components/ui'

import {HiOutlineUserAdd} from 'react-icons/hi'
import {HiTrash,HiPencil} from 'react-icons/hi'

// import { setLoading, setDrawerOpen, setDialogOpen, getEntry } from '../store/stateSlice'
import { setLoading, setDrawerContactOpen, setDialogOpen, getContact,setDrawerContactInfoOpen } from '../store/stateSlice'

// import { getEntriesIndexWithFilesByType } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer,TextActivo, TextSiNo } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const ContactsTable = ( { className, contacts } ) =>
{

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    // Fetching Data --------------------------------------------------------------------------------------

    // const fetchData = useCallback( () => { dispatch(getEntriesIndexWithFilesByType(4)) }, [ dispatch ])
	// useEffect( () => { fetchData() }, [])

    // Subcomponents --------------------------------------------------------------------------------------


    const NameColumn = ( { row } ) => {
	
        const dispatch = useDispatch()
        
        const onShow = async () => {
            dispatch(setDrawerContactInfoOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(getContact(row.id))
            }, 500)
        }
        const ava = row.file_image ? row.file_image : '/img/avatars/nopic.jpg'
        return (
            <div className="flex items-center gap-3 cursor-pointer" onClick={onShow}>
                <Avatar size={45} src={ava}/>
                <span  className='font-bold ml-3'>{`${row.name} ${row.lastname}`}</span>
            </div>
        )
    }

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>Nombre</span>,
            cell: props => <NameColumn row ={props.row.original}/>
        }),
        columnHelper.accessor('phone', {
            header: () => <span>Teléfono</span>,
            headerClassName:'justify-center',
            cell: props => <div className='text-center'>{props.row.original.phone}</div>
        }),
        columnHelper.accessor('mobile', {
            header: () => <span>Móvil</span>,
            headerClassName:'justify-center',
            cell: props => <div className='text-center'>{props.row.original.mobile}</div>
        }),
        columnHelper.accessor('email', {
            header: () => <span>Correo</span>,
            headerClassName:'justify-center',
            cell: props => <div className='text-center'>{props.row.original.email}</div>
        }),
        columnHelper.accessor('classification', {
            header: () => <span>Clasificación</span>,
            headerClassName:'justify-center',
            cell: props => <div className='text-center'>-</div>
        }),
        // columnHelper.display({
        //     id: 'actions',
        //     header: () => <span>Acciones</span>,
        //     cell: props => <RowActions row={props.row} />,
        //     enableSorting: false
        // })
    ]
    const RowActions = ( { row } ) => {

        const handleEdit = () => {
            dispatch(getContact(row.original.id))
            setTimeout( () => {
                dispatch(setDrawerContactOpen(true))
                dispatch(setLoading(true))
                dispatch(setLoading(false))
            },250)
        }

        const ButtonEdit = () => (
            <Button
                title='Editar Entrada'
                size="xs"
                color={`${themeColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiPencil />}
                onClick={ handleEdit }
            />
        )

        const handleDelete = () => {
            dispatch(setDialogOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(getContact(row.original.id))
                dispatch(setLoading(false))
            },250)
        }

        const ButtonDelete = () => (
            <Button
                title='Eliminar Entrada'
                size="xs"
                color={`${dangerColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiTrash />}
                onClick={handleDelete}
            />
        )

        return (
            <div className="flex justify-start gap-4 items-center">
                <ButtonEdit />
                <ButtonDelete />
            </div>
        )
    }

    const RowDate = ( { row } ) => {
        const res = row.original
        const dateIni = res.date_start
        const dateEnd = res.date_end
        const dateToShow = dateIni === dateEnd || dateEnd === '' || !dateEnd ? StringDateToFormat(dateIni,false,true) : StringDateToFormat(dateIni,false,true) + ' - ' + StringDateToFormat(dateEnd,false,true)
        return (
            <div className="flex justify-start gap-4 items-center">
                {dateToShow}
            </div>
        )
    }
    
    return(
        <div className={`${className}`}>
            <DataTable
                className = { `mt-3` }
                columns = { columns }
                data = { contacts }
            />
        </div>
    )
}

export default ContactsTable