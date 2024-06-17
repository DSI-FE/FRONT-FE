import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button } from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDialogOpen, getEntry } from '../store/stateSlice'
import { getEntriesIndexWithFilesByType } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer,TextActivo, TextSiNo } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = () =>
{

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { entries }  = useSelector( state => state.settingsGallery.data )

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => { dispatch(getEntriesIndexWithFilesByType(2)) }, [ dispatch ])
	useEffect( () => { fetchData() }, [])

    // Subcomponents --------------------------------------------------------------------------------------

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('name', {
            header: () => <span>Entrada</span>,
            cell: props => <span className='font-semibold'>{TextSlicer(props.row.original.name)}</span>,
        }),
        columnHelper.accessor('description', {
            header: () => <span>Descripción</span>,
            cell: props => TextSlicer(props.row.original.description),
            enableSorting: false
        }),
        columnHelper.accessor('date_start', {
            header: () => <span>Fecha</span>,
            cell: props => <RowDate row={props.row} />,
        }),
        columnHelper.accessor('show_in_carousel', {
            header: () => <span>Mostrar en Carrusel</span>,
            cell: props => TextSiNo(props.row.original.show_in_carousel),
        }),
        columnHelper.accessor('active', {
            header: () => <span>Estado</span>,
            cell: props => TextActivo(props.row.original.active),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span>Acciones</span>,
            cell: props => <RowActions row={props.row} />,
            enableSorting: false
        })
    ]
    const RowActions = ( { row } ) => {

        const handleEdit = () => {
            
            dispatch(getEntry(row.original.id))
            setTimeout( () => {
                dispatch(setDrawerOpen(true))
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
                onClick={handleEdit}
            />
        )

        const handleDelete = () => {
            dispatch(setDialogOpen(true))
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(getEntry(row.original.id))
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

    const handleCreate = () =>    {
        dispatch(setDrawerOpen(true))
        dispatch(setLoading(true))
        setTimeout( () => {
            dispatch(setLoading(false))
        },250)
    }

    const ButtonNewEntry = ()  => <Button onClick={handleCreate} icon={<RiAddCircleFill/>} variant="solid">Nueva Entrada</Button>
    return(
        <>
            <DataTable
                className = { `mt-3` }
                columns = { columns }
                data = { entries }
                RightContent={<ButtonNewEntry/>}
            />
        </>
    )
}

export default EntriesTable