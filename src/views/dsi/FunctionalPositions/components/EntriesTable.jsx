import React, { useEffect,useCallback, useState } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'

import { DataTable, CustomSelectOption } from 'components/custom'
import { Button, Select, Avatar} from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDialogOpen, getFunctionalPosition } from '../store/stateSlice'
import { getFunctionalPositions, getOrganizationalUnits } from '../store/dataSlice'

import { TextActivo, TextSiNo } from 'helpers'

import { themeConfig } from 'configs/theme.config'

const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = () =>
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { entries,organizational_units:organizationalUnits }  = useSelector( state => state.functionalPositions.data )

    // States ----------------------------------------------------------------------------------------------

    const [organizationalUnit, setOrganizationalUnit] = useState(null);
    
    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => {
        dispatch(getFunctionalPositions(organizationalUnit))
    }, [ dispatch, organizationalUnit ])
	useEffect(() => {
        dispatch(getOrganizationalUnits());
        fetchData();
    }, [fetchData]);
    
    // Subcomponents --------------------------------------------------------------------------------------

    const AvatarsEmployees = ( { row } ) => {
        const employees = row.employees
        return (
            <Avatar.Group
                chained
                maxCount={5}
                omittedAvatarProps={{ shape: 'circle' }}
                omittedAvatarTooltip
            >
            {
                employees.map( emp =>
                    <Avatar
                        key={'ava'+emp.name}
                        shape="circle"
                        title={emp.name}
                        src={emp.photo_image??'/img/avatars/nopic.jpg'}
                    />
                )
            }
            </Avatar.Group>
        )
    }

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('name', {
            thClassName:'w-3/12',
            header: () => <span>Cargo Funcional</span>,
            cell: props => <span  className='font-bold'>{`${props.row.original.name}`}</span>,
        }),
        columnHelper.accessor('organizational_unit', {
            thClassName:'w-3/12',
            header: () => <span>Unidad</span>,
            cell: props => <span>{`${props.row.original.organizational_unit}`}</span>,
        }),
        columnHelper.accessor('photo', {
            thClassName:'w-2/12',
            header: () => <span></span>,
            cell: props => <AvatarsEmployees row={props.row.original}/>,
            enableSorting: false
        }),
        columnHelper.accessor('boss', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Jefe</span>,
            cell: props => <div className='text-center'>{TextSiNo(props.row.original.boss)}</div>,
        }),
        columnHelper.accessor('active', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Activo</span>,
            cell: props => <div className='text-center'>{TextActivo(props.row.original.active)}</div>,
        }),
        columnHelper.accessor('employees_names', {
            thClassName:'hidden',
            headerClassName:'hidden',
            cellClassName:'hidden',
            header: () => <span>Activo</span>,
            cell: props => <span>{props.row.original.employees_names}</span>,
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

    const ButtonCreate = () => {
        const handleCreate = () =>    {
            dispatch(setLoading(true))
            setTimeout( () => {
                dispatch(setDrawerOpen(true))
            },250)
            dispatch(setLoading(false))
        }
        return <Button onClick={handleCreate} icon={<RiAddCircleFill/>} variant="solid">Nueva Entrada</Button>
    }

    const ButtonEdit = ( { row } ) => {
        const handleEdit = () => {
            dispatch( setLoading( true ) )
            dispatch( getFunctionalPosition( row.original.id ) )
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
            dispatch( getFunctionalPosition( row.original.id ) )
            setTimeout( () => { dispatch( setDialogOpen( true )) }, 250 )
            dispatch( setLoading( false ) )
        }
        return (
            <Button
                title='Eliminar Feriado'
                size="xs"
                color={`${dangerColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiTrash />}
                onClick={handleDelete}
            />
        )
    }

    const RowActions = ( { row } ) => (
        <div className="flex justify-center gap-4 items-center">
            <ButtonEdit row={ row } />
            <ButtonDelete row={ row } />
        </div>
    )
    
    const SelectOrganizationalUnit = () =>
    {
        const options = [{value:'all',label:'Todas las Unidades Organizacionales'}]
        organizationalUnits?.forEach( per => { options.push({ value:per.id, label:(per.name) }) })
        return (
            <Select
                className='w-8/12'
                options = { options }
                placeholder={'Selecciona Unidad Organizacional'}
                onChange={selected => { 
                    setOrganizationalUnit(selected.value === 'all' || ! selected.value ? null : selected.value); 
                }}
                components = {{ Option: CustomSelectOption }}
                value={ options.find( option => ( organizationalUnit === null && option.value === 'all' ) || option.value === organizationalUnit ) }
            />
        )
    }
    
    return(
        <>
            <DataTable
                className = { `mt-3` }
                columns = { columns }
                data = { entries }
                LeftContent={<SelectOrganizationalUnit/>}
                RightContent={<ButtonCreate/>}
            />
        </>
    )
}

export default EntriesTable