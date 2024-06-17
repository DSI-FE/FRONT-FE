import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button } from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDialogOpen, getEntry } from '../store/stateSlice'
import { getPermissionTypes } from '../store/dataSlice'

import {TextSlicer, TextSiNo } from 'helpers'

import { themeConfig } from 'configs/theme.config'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = () =>
{

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { entries }  = useSelector( state => state.settingsPermissionTypes.data )

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => { dispatch(getPermissionTypes()) }, [ dispatch ])
	useEffect( () => { fetchData() }, [ fetchData ])

    // Subcomponents --------------------------------------------------------------------------------------

    const columnHelper = createColumnHelper()

//     minutes_per_year
// minutes_per_month
// requests_per_year
// requests_per_month
// days_per_request

    const columns = [
        columnHelper.accessor('name', {
            thClassName:'w-2/12',
            header: () => <span>Nombre</span>,
            cell: props => <span className='font-semibold'>{props.row.original.name}</span>,
        }),
        columnHelper.accessor('description', {
            thClassName:'w-3/12',
            header: () => <span>Descripción</span>,
            cell: props => <span className=''>{TextSlicer(props.row.original.description,75)}</span>,
        }),
        columnHelper.accessor('adjacent_to_holiday', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Continuo_Festivos </span>,
            cell: props => <div className='text-center'>{TextSiNo(props.row.original.adjacent_to_holiday)}</div>,
        }),
        columnHelper.accessor('minutes_per_year', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Horas/Año</span>,
            cell: props => <div className='text-center'>{(props.row.original.minutes_per_year?(props.row.original.minutes_per_year/60):'-')}</div>,
        }),
        columnHelper.accessor('minutes_per_month', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Horas/Mes</span>,
            cell: props => <div className='text-center'>{(props.row.original.minutes_per_month?(props.row.original.minutes_per_month/60):'-')}</div>,
        }),
        columnHelper.accessor('requests_per_year', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Sol/Año</span>,
            cell: props => <div className='text-center'>{props.row.original.requests_per_year??'-'}</div>,
        }),
        columnHelper.accessor('requests_per_month', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Sol/Mes</span>,
            cell: props => <div className='text-center'>{props.row.original.requests_per_month??'-'}</div>,
        }),
        columnHelper.accessor('active', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Activo</span>,
            cell: props => <div className='text-center'>{TextSiNo(props.row.original.active)}</div>,
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