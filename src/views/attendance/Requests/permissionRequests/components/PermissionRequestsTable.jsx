import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HiCheckCircle } from 'react-icons/hi'
import { RiSendPlaneFill } from 'react-icons/ri'
import { createColumnHelper } from '@tanstack/react-table'

import { DataTable, ExportToExcelButton, Button } from 'components/custom'
import { themeConfig } from 'configs/theme.config'

import { StringDateToFormat,TextSlicer } from 'helpers'

import DrawerPermissionRequest from 'views/attendance/components/DrawerPermissionRequest'

import {
    getPermissionRequestsFromEmployeeAndState,
    getPermissionRequestFromOrganizationalUnit
} from '../store/dataSlice'

const { colorTheme, textSuccessColor } = themeConfig


const PermissionRequestsTable = ( { LeftContent } ) =>
{
    // Redux Selector --------------------------------------------------------------------------------------------

    const {
        organizationalUnit
    } = useSelector( state => state.auth )

    const {
        selected_state:selectedState,
        selected_segment:selectedSegment,
        selected_employee:selectedEmployee,
        selected_organizational_unit:selectedOrganizationalUnit
    } = useSelector( state => state.attendance_requests.state )

    const {
        loading,
        permission_requests:permissionRequests
    } = useSelector( state => state.permission_requests.data )

    // Initial Values --------------------------------------------------------------------------------------------
    
    const dispatch = useDispatch()

    const isBoss = selectedSegment && selectedSegment[0] === '2'
    const isRRHH = selectedSegment && selectedSegment[0] === '3'

    // states ----------------------------------------------------------------------------------------------------

    const [ openDrawePermission, setOpenDrawePermission ] = useState(false)

    
    // Subcomponents ---------------------------------------------------------------------------------------------

    const columnHelper = createColumnHelper()

    const StatusCell = ({row}) => {
        let statusMsg = ''
        const statusBossApprovedMsg = isRRHH ? '(Pendiente)' : ''
        const statusSendedMsg = isBoss ? '(Pendiente)' : ''
        const StatusTHApprovedIcon = () => isBoss ? <div className='flex justify-start items-center gap-2'>Aprobado por Jefe {statusBossApprovedMsg}<HiCheckCircle className='text-2xl text-blue-500'/></div> : <>Aprobado por Jefe {statusBossApprovedMsg}</>
        switch (row.state) {
            case 0:
                statusMsg = 'Sin Definir'
            break
            case 1:
                statusMsg = 'Enviado ' + statusSendedMsg
            break
            case 2:
                statusMsg = <StatusTHApprovedIcon/>
            break
            case 3:
                statusMsg = <div className='flex justify-start items-center gap-2'>Aprobado por TH<HiCheckCircle className='text-2xl text-green-500'/></div>
            break
            case 4:
                statusMsg = 'Observado'
            break
            case 5:
                statusMsg = 'Rechazado'
            break
            case 6:
                statusMsg = 'Cancelado'
            break
            default:
                statusMsg = 'Sin Definir'
            break
        }
        return <span>{statusMsg}</span>
    }

    const RowDate = ( { row } ) => {
        const res = row.original
        const dateIni = res.date_ini
        const dateEnd = res.date_end
        const dateToShow = dateIni === dateEnd || dateEnd === '' || !dateEnd ? StringDateToFormat(dateIni,false,true) : StringDateToFormat(dateIni,false,true) + ' - ' + StringDateToFormat(dateEnd,false,true)
        return (
            <div className="flex justify-start gap-4 items-center">
                {dateToShow}
            </div>
        )
    }

    const columns = [
        columnHelper.accessor('att_permission_type_name', {
            thClassName:'w-3/12',
            header: () => <span>Tipo</span>,
        }),
        columnHelper.accessor('date_ini', {
            thClassName:'w-3/12',
            header: () => <span>Fecha</span>,
            cell: props => <RowDate row={props.row} />,
        }),
        columnHelper.accessor('state', {
            thClassName:'w-3/12',
            header: () => <span>Estado</span>,
            cellClassName:'font-semibold',
            cell: props => <StatusCell row={props.row.original} />
        }),
        columnHelper.display({
            thClassName:'w-1/12',
            id: 'actions',
            header: () => <span className='text-center w-full'>Acciones</span>,
            // cell: props => <RowActions isBoss={ isBoss } isRRHH={ isRRHH } row={props.row} />,
            enableSorting: false
        })
    ]

    // Columns management

    if(isBoss || isRRHH) {
        columns.unshift(
            columnHelper.accessor('adm_employee_name', {
            thClassName:'w-3/12',
            header: () => <span>Empleado</span>,
            cell: props => props.row.original.adm_employee_name
        }))
    } else {
        columns.splice(2, 0, (columnHelper.accessor('justification', {
            thClassName:'w-3/12',
            header: () => <span>Descripción</span>,
            cell: props => TextSlicer(props.row.original.justification),
            enableSorting: false
        })))
        
    }

    const ButtonNewPermissionRequest = () => (
        <Button
            variant='solid'
            color={`${colorTheme}`}
            icon={ <RiSendPlaneFill />}
            onClick={ () => {
                setOpenDrawePermission(true)
            }}
        >
            Nueva solicitud de permiso
        </Button>
    )

    // Handle Rerendering ----------------------------------------------------------------------------------------
    
    useEffect(() => {

        if ( selectedEmployee && selectedEmployee !== 0 ) {

            dispatch(getPermissionRequestsFromEmployeeAndState(
                { employeeId: selectedEmployee, state: selectedState }
            ))
            
        } else {
            if ( isBoss || isRRHH ) {
                
                const orgUnitId = isRRHH && selectedOrganizationalUnit === 0 ? 1 : isBoss && selectedOrganizationalUnit === 0 ? organizationalUnit.id : selectedOrganizationalUnit
                const childrens = selectedOrganizationalUnit === 0 ? 1 : 0 
                
                dispatch( getPermissionRequestFromOrganizationalUnit( {
                    organizationalUnitId: orgUnitId,
                    childrens:childrens,
                    activeOnly:1,
                    state:selectedState
                }))
            }
        }

    }, [ dispatch, selectedEmployee, selectedState, isBoss, isRRHH, selectedOrganizationalUnit, organizationalUnit.id ])
    
    return (
        <>
            <DrawerPermissionRequest
                state={openDrawePermission}
                setState={setOpenDrawePermission}
                employeeIsBoss = { isBoss }
                permissionRequestId = { null }
                selectedDate = { null }
            />
            <DataTable
                className = { `mt-3` }
                columns = { columns }
                data = { permissionRequests }
                LeftContent={
                    <>
                        <LeftContent/>
                        <ExportToExcelButton data={permissionRequests} />
                    </>
                }
                RightContent={ <ButtonNewPermissionRequest/> }
                defaultPageSize={ 50 }
                loading={loading}
            />
        </>
    )
	
}

export default PermissionRequestsTable