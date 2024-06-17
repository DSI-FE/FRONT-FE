import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button,Avatar } from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDialogOpen, getEntry } from '../store/stateSlice'
import { getHolidays } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer,TextActivo, TextSiNo } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = () =>
{

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { entries }  = useSelector( state => state.settingsHolidays.data )

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => { dispatch(getHolidays()) }, [ dispatch ])
	useEffect( () => { fetchData() }, [])

    // Subcomponents --------------------------------------------------------------------------------------

    const NameColumn = ( { row } ) => {
	
        const dispatch = useDispatch()
        
        const ava = row.file_image ? row.file_image : '/img/avatars/empty-image-thumb.png'
        return (
            <div className="flex items-center gap-3 cursor-pointer">
                <Avatar size={45} src={ava}/>
                <span  className='font-bold ml-3'>{`${row.name}`}</span>
            </div>
        )
    }

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('name', {
            thClassName:'w-3/12',
            header: () => <span>Entrada</span>,
            cell: props => <NameColumn row={props.row.original}/>,
        }),
        columnHelper.accessor('date_start', {
            thClassName:'w-2/12',
            header: () => <span>Fecha</span>,
            cell: props => <RowDate row={props.row} />,
            sortingFn: ( rowA, rowB, columnId ) => {
                const numA = rowA.getValue(columnId)
                const numB= rowB.getValue(columnId)
                return numA < numB ? 1 : numA > numB ? -1 : 0
            }
        }),
        columnHelper.accessor('vacation', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Vacación</span>,
            cell: props => <div className='text-center'>{TextSiNo(props.row.original.vacation)}</div>,
        }),
        columnHelper.display({
            thClassName:'w-1/12',
            headerClassName:'justify-center',
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
                title='Editar Feriado'
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
                title='Eliminar Feriado'
                size="xs"
                color={`${dangerColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiTrash />}
                onClick={handleDelete}
            />
        )

        return (
            <div className="flex justify-center gap-4 items-center">
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