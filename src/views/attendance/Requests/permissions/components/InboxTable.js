import React, { useEffect,useCallback,useState } from 'react'

import {useDispatch,useSelector} from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'

import { DataTable, CustomSelectOption } from 'components/custom'
import { Button, Select } from 'components/ui'


import axios from 'axios'

import {RiAddCircleFill} from 'react-icons/ri'
import {HiPencil,HiEye,HiDocumentDownload, HiCheckCircle} from 'react-icons/hi'

import { BsFiletypePdf } from 'react-icons/bs'

import { setLoading, setDrawerOpen,setDrawerAppOpen, setDrawerTitle, setDrawerInfo, setDrawerBody,getPermission,setSelectedDate } from '../store/stateSlice'
import { getEmployeePermissions,getOrganizationUnitPermissions, getAllPermissions, getPermissionsByState,getOrganizationalUnitChildrens } from '../store/dataSlice'

import { StringDateToFormat,TextSlicer } from 'helpers'

import appConfig from 'configs/app.config'
import { themeConfig } from 'configs/theme.config'

const { apiPrefix } = appConfig

const {themeColor,primaryColorLevel,textDangerColor} = themeConfig

const InboxTable = ({isBoss=false,isRRHH=false}) =>
{
    const dispatch = useDispatch()

    const iniPermissionState = isBoss ? 1 : ( isRRHH ? 2 : 0)

    const [ permissionState, setPermissionState ] = useState(iniPermissionState)

    const data  = useSelector(state => state.permissions.data.employee_permissions )
    const dataOrganizationalUnit  = useSelector(state => state.permissions.data.organizational_unit_permissions )
    const dataAll  = useSelector(state => state.permissions.data.all_permissions )
    const organizationalUnits  = useSelector(state => state.permissions.data.organizational_units )


    const dataShow = isBoss ? dataOrganizationalUnit : isRRHH ? dataOrganizationalUnit : data

    const {employee,functionalPosition,organizationalUnit,session} = useSelector( state => state.auth )
    const employeeId = employee.id
    const iniSelectedOrganizationalUnit = isRRHH ? 0 : organizationalUnit.id

    const [selectedOrganizationalUnit, setSelectedOrganizationalUnit] = useState(iniSelectedOrganizationalUnit)

    const fetchData = useCallback( () => {
        if ( !isBoss ) {
            if ( !isRRHH ) {
                dispatch( getEmployeePermissions({id:employeeId,state:permissionState}) )
            } else {
                dispatch(getOrganizationalUnitChildrens(1))
                dispatch(getOrganizationUnitPermissions({id:1,state:permissionState,organizationalUnitId:selectedOrganizationalUnit}))
                // dispatch( getPermissionsByState({state:permissionState}) )
            }
        } else {
            dispatch(getOrganizationalUnitChildrens(organizationalUnit.id))
            dispatch(getOrganizationUnitPermissions({id:organizationalUnit.id,state:permissionState,organizationalUnitId:selectedOrganizationalUnit}))
        }
	}, [  employeeId,permissionState,selectedOrganizationalUnit ])

	useEffect( () => {
		fetchData()
	}, [ permissionState,selectedOrganizationalUnit ])

    const StatusCell = ({row}) => {
        let statusMsg = ''
        const statusBossApprovedMsg = isRRHH ? '(Pendiente)' : ''
        const statusSendedMsg = isBoss ? '(Pendiente)' : ''
        const StatusTHApprovedIcon = () => isBoss ? <div className='flex justify-start items-center gap-2'>Aprobado por Jefe {statusBossApprovedMsg}<HiCheckCircle className='text-2xl text-blue-500'/></div> : <>Aprobado por Jefe {statusBossApprovedMsg}</>
        switch (row.status) {
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

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('type', {
            thClassName:'w-3/12',
            header: () => <span>Tipo</span>,
            // cell: cell => <RowActions isBoss={ isBoss } isRRHH={ isRRHH } cell={cell.getValue()}/>
        }),
        columnHelper.accessor('date_start', {
            thClassName:'w-3/12',
            header: () => <span>Fecha</span>,
            cell: props => <RowDate row={props.row} />,
        }),
        columnHelper.accessor('statusStr', {
            thClassName:'w-3/12',
            header: () => <span>Estado</span>,
            cellClassName:'font-semibold',
            cell: props => <StatusCell row={props.row.original} />
        }),
        columnHelper.display({
            thClassName:'w-1/12',
            id: 'actions',
            header: () => <span className='text-center w-full'>Acciones</span>,
            cell: props => <RowActions isBoss={ isBoss } isRRHH={ isRRHH } row={props.row} />,
            enableSorting: false
        })
    ]

    if(isBoss || isRRHH) {
        columns.unshift(
            columnHelper.accessor('name', {
            thClassName:'w-3/12',
            header: () => <span>Empleado</span>,
            cell: props => props.row.original.name + ' ' + props.row.original.lastname
        }))
    } else {
        columns.splice(2, 0, (columnHelper.accessor('description', {
            thClassName:'w-3/12',
            header: () => <span>Descripción</span>,
            cell: props => TextSlicer(props.row.original.description),
            enableSorting: false
        })))
        
    }

    const RowActions = ({ row }) =>
    {

        const handleShowInfo = () => {
            dispatch(setDrawerAppOpen(true))
            dispatch(setLoading(true))
            dispatch(getPermission(row.original.perm_id))
            setTimeout(() => {
                dispatch(setDrawerTitle('Aprobar permiso de miembro de Mi Equipo'))
                dispatch(setDrawerInfo('Se muestra la información ingresada por el empleado'))
                dispatch(setDrawerBody(2))
            }, 250 )
            dispatch(setLoading(false))
        }

        const handleEdit = () => {
            dispatch(setDrawerOpen(true))
            dispatch(setLoading(true))
            dispatch(getPermission(row.original.perm_id))
            setTimeout( () => {
                dispatch(setDrawerTitle('Editar Permiso'))
                dispatch(setDrawerInfo('Por favor, llene el formulario, los campos con asterico rojo son obligatorios'))
                dispatch(setDrawerBody(1))
                dispatch(setLoading(false))
            }, 250 )
        }
      
        const handlePdf = (permissionId) => {
            axios
            .get( `${apiPrefix}/attendance/permissions/download-pdf/${permissionId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${session.token}`,
                },
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${row.original.date_start} Comprobante Permiso.pdf`)
                document.body.appendChild(link)
                link.click()
            })
            .catch((error) => {
                console.error('Error al descargar archivo:', error)
            })
        }
      
        return (
            <div className="flex justify-start gap-4 items-center">

                <Button
                    title="Gestionar Permiso"
                    size="xs"
                    color={`${themeColor}-${primaryColorLevel}`}
                    variant="solid"
                    icon={<HiEye />}
                    onClick={handleShowInfo}
                />
                
                <Button
                    title="Descargar Archivo PDF"
                    size="xs"
                    color="red-500"
                    variant="solid"
                    icon={<BsFiletypePdf />}
                    onClick={() => handlePdf(row.original.perm_id)}
                />

{
                row.original.status === 4 ?
                        <Button
                            title="Editar Permiso"
                            size="xs"
                            color={`${themeColor}-${primaryColorLevel}`}
                            variant="solid"
                            icon={<HiPencil />}
                            onClick={handleEdit}
                        />
                    : <></>
                }
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

    const SelectPermissionsState = ({className}) =>
    {
        const options = [
            {value:0,label:'Todas los Permisos'},
            {value:1,label:'Enviados'+( isBoss ? ' (Pendientes de Revisión)' : (isRRHH ? '' : '') )},
            {value:2,label:'Aprobados por Jefe'+( isBoss ? '' : (isRRHH ? ' (Pendientes de Revisión)' : '') )},
            {value:3,label:'Aprobados por Talento Humano'},
            {value:4,label:'Observados'},
            {value:5,label:'Rechazados'}
        ]
        return (
            <Select
                className={className}
                options = { options }
                placeholder={'Selecciona Estado'}
                onChange={ selected => {
                    setPermissionState(selected.value === 0 || ! selected.value ? null : selected.value) 
                }}
                components = {{ Option: CustomSelectOption }}
                value = { options.find( 
                    option => ( 
                        permissionState === null && option.value === 0 ) || option.value === permissionState 
                    ) 
                }
            />

            
        )
    }

    const SelectOrganizationalUnit = ({className}) => {
        const options = [{value:0,label:'Todas las Unidades Organizacionales'}]
        organizationalUnits?.forEach( per => { options.push({ value:per.id, label:(per.name) }) })
        return (
            (isBoss || isRRHH) && (organizationalUnits && organizationalUnits.length > 1)  ?
            <Select
                className={className}
                options = { options }
                placeholder={'Selecciona Unidad Organizacional'}
                onChange={selected => { 
                    setSelectedOrganizationalUnit(selected.value === 'all' || ! selected.value ? null : selected.value) 
                }}
                components = {{ Option: CustomSelectOption }}
                value={ options.find( option => ( selectedOrganizationalUnit === null && option.value === 0 ) || option.value === selectedOrganizationalUnit ) }
            />
            :<></>
        )
    }
    
    const handleNewPermission = () =>
    {
        dispatch(setDrawerOpen(true))
        dispatch(setLoading(true))
        setTimeout( () => {
            dispatch(setDrawerTitle('Solicitar Permiso'))
            dispatch(setDrawerInfo('Por favor, llene el formulario, los campos con asterico rojo son obligatorios'))
            dispatch(setLoading(false))
            dispatch(setDrawerBody(1))
        },250)
    }

    const ButtonNewPermission = ()  => (
        ! isRRHH ? (
            <Button
                onClick={handleNewPermission}
                icon={<RiAddCircleFill/>}
                variant="solid"
            >
                Nuevo Permiso
            </Button>
        ) : (
            <></>
        )
    )

    return(
        <>
            <DataTable
                className = { `mt-3` }
                columns = { columns }
                data = { dataShow }
                LeftContent={
                    <div className='
                        flex gap-2
                        xs:flex-col xs:w-full
                        md:flex-row md:w-6/12
                    '>
                        <SelectPermissionsState className='xs:w-full md:w-6/12'/>
                        <SelectOrganizationalUnit className='xs:w-full md:w-6/12'/>
                    </div>
                }
                RightContent={<ButtonNewPermission/>}
                defaultPageSize={50}
            />
        </>
    )
}

export default InboxTable
