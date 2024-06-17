import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button,Avatar } from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDialogOpen, getOrganizationalUnit } from '../store/stateSlice'
import { getOrganizationalUnits } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer,TextActivo } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'

import { FaUsersCog } from 'react-icons/fa'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = () =>
{

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { entries }  = useSelector( state => state.organizationalUnits.data )

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => { dispatch(getOrganizationalUnits()) }, [ dispatch ])
	useEffect( () => { fetchData() }, [])

    // Subcomponents --------------------------------------------------------------------------------------

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('name', {
            thClassName:'w-6/12',
            header: () => <span>Unidad</span>,
            cell: props => <span  className='font-bold'>{`${props.row.original.name}`}</span>,
        }),
        columnHelper.accessor('abbreviation', {
            thClassName:'w-2/12',
            header: () => <span>Abreviatura</span>,
            cell: props => <div className='text-center'>{props.row.original.abbreviation}</div>,
        }),
        columnHelper.accessor('active', {
            thClassName:'w-2/12',
            headerClassName:'justify-center',
            header: () => <span>Activo</span>,
            cell: props => <div className='text-center'>{TextActivo(props.row.original.active)}</div>,
        }),
        columnHelper.display({
            thClassName:'w-2/12',
            headerClassName:'justify-center',
            id: 'actions',
            header: () => <span>Acciones</span>,
            cell: props => <RowActions row={props.row} />,
            enableSorting: false
        })
    ]

    const ButtonEdit = ( { row } ) => {
        const handleEdit = () => {
            dispatch( setLoading( true ) )
            dispatch( getOrganizationalUnit( row.original.id ) )
            setTimeout( () => { dispatch(setDrawerOpen( true )) }, 250 )
            dispatch( setLoading( false ) )
        }
        return (
            <Button
                title='Editar Unidad Organizacional'
                size="xs"
                color={`${themeColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiPencil />}
                onClick={handleEdit}
            />
        )
    }

    const ButtonDelete = ( { row } ) => {
        const handleDelete = () => {
            dispatch( setLoading( true ) )
            dispatch( getOrganizationalUnit( row.original.id ) )
            setTimeout( () => { dispatch( setDialogOpen( true )) }, 250 )
            dispatch( setLoading( false ) )
        }
        return (
            <Button
                title='Eliminar'
                size="xs"
                color={`${dangerColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiTrash />}
                onClick={handleDelete}
            />
        )
    }

    const ButtonManageFunctionalPositions = ( { row } ) => {
        const handleFunctionalPositions = () => {
            dispatch( setLoading( true ) )
            dispatch( getOrganizationalUnit( row.original.id ) )
            setTimeout( () => { dispatch( setDialogOpen( true )) }, 250 )
            dispatch( setLoading( false ) )
        }
        return (
            <Button
                title='Gestionar Cargos Funcionales de la Unidad Organizacional'
                size="xs"
                color={`${themeColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<FaUsersCog />}
                onClick={handleFunctionalPositions}
            />
        )
    }

    const RowActions = ( { row } ) => (
        <div className="flex justify-center gap-4 items-center">
            <ButtonManageFunctionalPositions row={ row } />
            <ButtonEdit row={ row } />
            <ButtonDelete row={ row } />
        </div>
    )

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