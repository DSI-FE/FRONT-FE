import React, { useEffect,useCallback } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from 'components/custom'
import { Button } from 'components/ui'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiTrash,HiPencil, HiEye} from 'react-icons/hi'

import { setLoading, setDrawerOpen, setDrawerManagementOpen, setDialogOpen, getEntry } from '../store/stateSlice'
import { getCompensatoriesByEmployee,getCompensatoriesByOrganizationalUnit } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer,TextActivo, TextSiNo, convertToAmPm, intToHours, StringToDate } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'


const {themeColor,primaryColorLevel,dangerColor} = themeConfig

const EntriesTable = ( {isBoss} ) =>
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()
    const { employee,organizationalUnit }  = useSelector( state => state.auth )
    const { entries }  = useSelector( state => state.compensatories.data )

    // Fetching Data --------------------------------------------------------------------------------------

    const fetchData = useCallback( () => {
        if(isBoss) {
            dispatch(getCompensatoriesByOrganizationalUnit(organizationalUnit.id))
        } else {
            dispatch(getCompensatoriesByEmployee(employee.id))
        }
    }, [ dispatch ])
	useEffect( () => { fetchData() }, [])

    // Subcomponents --------------------------------------------------------------------------------------

    const RowDate = ( { row } ) => {
        const res = row.original
        const dateIni = res.date
        const timeIni = convertToAmPm(res.time_start)
        const timeEnd = convertToAmPm(res.time_end)
        const dateToShow = StringDateToFormat(dateIni,false,true)
        return (
            <>
                <div className='text-center'>
                    {`${dateToShow}`}
                </div>
                <div className='text-center'>
                    {`(${timeIni} - ${timeEnd})`}
                </div>
            </>
        )
    }

    const StateColumn = ({row}) => {

        const now = new Date()
        const expirationDate = StringToDate(row.date_expiration,'-',2)
        const StateComp = () => now > expirationDate ? <span className='text-red-500'>Vencido</span> : <span>{row.statusStr}</span>
        return <div className='text-center'>{<StateComp/>}</div>
    }

    // Columns --------------------------------------------------------------------------------------

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('date', {
            thClassName:'w-3/12',
            // headerClassName:'justify-center',
            header: () => <span>Fecha</span>,
            cell: props => <RowDate row={props.row} />,
        }),
        columnHelper.accessor('description', {
            thClassName:'w-3/12',
            header: () => <span>Descripción</span>,
            cell: props => TextSlicer(props.row.original.description,75),
            enableSorting: false
        }),
        columnHelper.accessor('status', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Estado</span>,
            cell: props => <StateColumn row={props.row.original} />,
        }),
        columnHelper.accessor('time_requested', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Solicitado</span>,
            cell: props => <div className='text-center'>{intToHours(props.row.original.time_requested)}</div>,
        }),
        columnHelper.accessor('time_approved', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Aprobado</span>,
            cell: props => <div className='text-center'>{intToHours(props.row.original.time_approved)}</div>,
        }),
        columnHelper.accessor('time_available', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Disponible</span>,
            cell: props => <div className='text-center'>{intToHours(props.row.original.time_available)}</div>,
        }),
        columnHelper.accessor('date_expiration', {
            thClassName:'w-1/12',
            headerClassName:'justify-center',
            header: () => <span>Expira</span>,
            cell: props => <div className='text-center'>{StringDateToFormat(props.row.original.date_expiration,false,true)}</div>,
        }),
        columnHelper.display({
            thClassName:'w-1/12',
            id: 'actions',
            header: () => <span>Acciones</span>,
            cell: props => <RowActions row={props.row} />,
            enableSorting: false
        })
    ]

    const RowActions = ( { row } ) => {

        const handleEdit = () => {
            
            dispatch(getEntry(row.original.compensatory_id))
            setTimeout( () => {
                dispatch(setDrawerManagementOpen(true))
                dispatch(setLoading(true))
                dispatch(setLoading(false))
            },250)
        }

        const ButtonEdit = () => (
            <Button
                title='Gestionar Compensatorio'
                size="xs"
                color={`${themeColor}-${primaryColorLevel}`}
                variant="solid"
                icon={<HiEye />}
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
                {/* <ButtonDelete /> */}
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

    const ButtonNewEntry = ()  => <Button onClick={handleCreate} icon={<RiAddCircleFill/>} variant="solid">Nuevo Compensatorio</Button>
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