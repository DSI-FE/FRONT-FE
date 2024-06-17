import React, { useMemo, useState, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Table,Tooltip,Input,Spinner,Avatar } from 'components/ui'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    flexRender,
    getExpandedRowModel,
    getSortedRowModel,
    createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { HiOutlineUser,HiMail,HiPhone,HiDocumentSearch, HiOutlineChevronRight, HiOutlineChevronDown, HiSearch } from 'react-icons/hi'
import { IconText } from 'components/shared'
import { BiParty } from 'react-icons/bi'
import { MdToday } from 'react-icons/md'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import Filters from './Filters'
import {StringDateToFormat,dollarFormat,intToHours,capitalizeFirstLetter,getTimeInHHmmFormat} from 'helpers/index'
import { BsFillDiagram2Fill } from 'react-icons/bs'

import { themeConfig } from 'configs/theme.config'

import { ExportToExcelButton } from 'components/custom'


const { textDangerColor,textInfoColor} = themeConfig

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput( { className, value: initialValue, onChange, debounce = 500, ...props } ) {
    
    const [value, setValue] = useState(initialValue)
    useEffect(() => { setValue(initialValue) }, [initialValue])
    useEffect( () => { const timeout = setTimeout(() => { onChange(value) }, debounce)
        return () => clearTimeout(timeout)
    }, [value] )
    
    return (
        <div className={className}>
            <div className="mb-1 font-semibold text-sm">Buscar Empleado</div>
            <Input
                {...props}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                prefix={<HiSearch className="text-lg" />}
            />
        </div>
    )

}

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank, })
    return itemRank.passed
}

function ReactTable({ renderRowSubComponent, getRowCanExpand, data=[] }) {

    const columnHelper = createColumnHelper()

    

    const columns = useMemo(
        () => [

            columnHelper.accessor('id', {
                header: () => <span></span>,
                cell: ({ row }) => {
                    return (<>
                        {row.getCanExpand() ? (
                            <button
                                className={`text-lg`}
                                {...{ onClick: row.getToggleExpandedHandler() }}
                            >
                                {row.getIsExpanded() ? ( <HiOutlineChevronDown /> ) : ( <HiOutlineChevronRight /> )}
                            </button>
                        ) : null}
                    </>)
                },
                enableSorting: false,
                subCell: () => null,
            }),
            columnHelper.accessor('name', {
                header: () => <span>Empleado</span>,
                cell: ({ row }) => (
                    <div className='font-semibold'>
                        {`${row?.original?.name} ${row?.original?.lastname}`}
                    </div>
                )
            }),
            columnHelper.accessor('discounts.totalTimeNotWorked', {
                header: () => <span>No Laborado</span>,
                headerClass:'text-center',
                cell: ({ row }) => {
                    let displayData =  '-'
                    if(row?.original?.discounts?.totalTimeNotWorked>0) {
                        displayData = intToHours(row.original.discounts.totalTimeNotWorked)
                    }
                    return (<div className='text-center'>{`${displayData}`}</div>)
                }
            }),
            columnHelper.accessor('discounts.totalDiscountMount', {
                header: () => <span>Descuento</span>,
                headerClass:'text-center',
                cell: ({ row }) => {
                    let displayData =  '-'
                    if(row?.original?.discounts?.totalDiscountMount>0) {
                        displayData = dollarFormat(row.original.discounts.totalDiscountMount)
                    }

                    if(row?.original?.discounts?.totalDiscountMount<=0 && row?.original?.discounts?.totalTimeNotWorked>0){
                        return (
                            <div className='flex justify-center'>
                                <HiOutlineCheckCircle color='green' className='text-2xl' title='Horas no laborados justificadas en su totalidad'/>
                            </div>
                        )
                    } else
                    {
                        return (<div className='text-center'>{`${displayData}`}</div>)
                    }
                    
                }
            }),
        ],
        []
    )
    const [sorting, setSorting] = React.useState([ { id: "discounts_totalDiscountMount", desc: true }])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { sorting,columnFilters, globalFilter },
        getRowCanExpand,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

	const { loading } = useSelector((state) => state.attendance.state)

    

    const formatedData = []

    data?.forEach( element => {
        formatedData.push({
            empleado: element.name+' '+element.lastname,
            cargo: element.functional_position ?? '-' ,
            unidad: element.organizational_unit ?? '-' ,
            no_laborado: element.discounts?.totalTimeDiscounted ? intToHours(element.discounts?.totalTimeDiscounted) : '-',
            justificado_goce: element.discounts?.totalTimeJustifiedPay ? intToHours(element.discounts?.totalTimeJustifiedPay) : '-',
            justificado_sin_goce: element.discounts?.totalTimeJustifiedNoPay ? intToHours(element.discounts?.totalTimeJustifiedNoPay) : '-',
            discount: element.discounts?.totalDiscountMount? element.discounts.totalDiscountMount :0,
        })
        
    })

    const sortedData = formatedData?.slice().sort( ( a, b ) => b.discount - a.discount );
    
    return (
        <>
            <Filters children = {
                <div className='flex align-middle items-center gap-2'>
                    <DebouncedInput value={globalFilter ?? ''} onChange={(value) => setGlobalFilter(String(value))} className="" />
                    <ExportToExcelButton className={`mt-5`} data={sortedData} reportName={'descuentos_'} />
                </div>
            }/>
            {
                    loading ?
                    <div className='flex justify-center items-center'>
                        <Spinner size="3.25rem" />
                    </div>
                    :
                    (                    
                        data?.length > 0 ? (
                            <div>
                                <Table>
                                    <THead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => {
                                                    return (
                                                        <Th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        className='text-center'
                                                        >
                                                            {header.isPlaceholder ? null : (
                                                                <div
                                                                {...{
                                                                    className:
                                                                        header.column.getCanSort()
                                                                        ? `cursor-pointer select-none ${header.column.columnDef.headerClass}`
                                                                        : '',
                                                                    onClick:
                                                                        header.column.getToggleSortingHandler(),
                                                                }}
                                                                >
                                                                    {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                                    {
                                                                        <>
                                                                            {header.column.getCanSort()?<Sorter sort={header.column.getIsSorted()} />:<></>}
                                                                        </>
                                                                    }
                                                                </div>
                                                            )}
                                                        </Th>
                                                    )
                                                })}
                                            </Tr>
                                        ))}
                                    </THead>
                                    <TBody>
                                        {table.getRowModel().rows.map((row) => {

                                            let discountsClass = ''
                                            if(row?.original?.discounts?.totalDiscountMount>0)
                                            {
                                                discountsClass = 'bg-red-200 '
                                            }
                                            return (
                                                <Fragment key={row.id}>
                                                    <Tr className={`${discountsClass}`}>
                                                        {/* first row is a normal row */}
                                                        {row.getVisibleCells().map((cell) => {
                                                            return (
                                                                <td key={cell.id}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </Tr>
                                                    {row.getIsExpanded() && (
                                                        <Tr  className={`border-4`}>
                                                            <Td
                                                                colSpan={ row.getVisibleCells().length }
                                                            >
                                                                {renderRowSubComponent({ row })}
                                                            </Td>
                                                        </Tr>
                                                    )}
                                                </Fragment>
                                            )
                                        })}
                                    </TBody>
                                </Table>
                            </div>
                        )
                        :
                        <></>
                    )
            }
            
        </>
    )
}

const RenderSubComponent = ({ row }) => {
    
    const TableRow = (date,i) =>
    {
        const trClass = date.discount?.discount > 0 ? 'bg-red-200' :''
        const dateClass  = date.isWeekend || date.isHoliday  ? textInfoColor : ''
        const dateTodayClass  = date.isToday ? `` : ''
        const DateHoliday = (params) => date.isHoliday ?  <HolidayTooltip titleStr={params.titleStr}/> : <div></div>
        const DateToday = () => date.isToday ?  <TodayTooltip/> : <div></div>
        let dateTitle = date.isWeekend ? `Fin de Semana` : 'Día Laboral'
        dateTitle = date.isHoliday ? `Día Festivo: ${date.dateHoliday.name}` : dateTitle
        dateTitle = date.isHoliday && date.isWeekend ? `Día Festivo: ${date.dateHoliday.name} y Fin de Semana` : dateTitle

        return(
            <Tr key={i} className={`text-center ${trClass} ${dateTodayClass}`}>
                <Td>
                    <div className={`flex items-center justify-between font-bold ${dateClass}`}>
                        <div className='w-2/12 flex items justify-center'><DateToday/><DateHoliday titleStr={`${dateTitle}`}/></div>
                        <div className='w-8/12'>{`${capitalizeFirstLetter(StringDateToFormat(date?.date,true,true))}`}</div>
                        <div className='w-2/12'></div>
                    </div>
                </Td>
                <Td>{date?.iniMark?.datetime? getTimeInHHmmFormat(date.iniMark.datetime) :'-'}</Td>
                <Td className="border-r">{date?.endMark?.datetime? getTimeInHHmmFormat(date.endMark.datetime):'-'}</Td>
                <Td>{date.discount?.time_not_worked ? intToHours(date.discount?.time_not_worked) : '-'}</Td>
                <Td className="">{date.discount?.discount? <span className={`${textDangerColor} font-semibold`}>{dollarFormat(date.discount.discount)}</span> :'-'}</Td>
            </Tr>
        )
    }

    const HolidayTooltip = (params) => {
        return (
                <Tooltip
                    wrapperClass=''
                    title={
                        <div>
                            {params.titleStr}
                        </div>
                    }
                >
                    <span className="cursor-pointer text-lg"><BiParty/></span>
                </Tooltip>
        )
    }

    const TodayTooltip = () => ( <Tooltip title = { <div>Hoy</div> }><span className="cursor-pointer text-lg"><MdToday/></span></Tooltip>)
    
    const columns =
    [
        {header:'Fecha',accessorKey:'formatDate',divClassName:'text-center '},
        {header:'Entrada',accessorKey:'iniMark',divClassName:'text-center'},
        {header:'Salida',accessorKey:'endMark',divClassName:'text-center',className:'border-r'},
        {header:'No Laborado',accessorKey:'timeNotWorked',divClassName:'text-center'},
        {header:'Descuento del Día',accessorKey:'discount',divClassName:'text-center'},
    ]

    const dates = row.original?.discounts?.dates;

    const formatedDates = []

    dates.forEach( element => {
        formatedDates.push({
            fecha: capitalizeFirstLetter(StringDateToFormat(element.date,true,true)),
            entrada: element?.iniMark?.datetime ? getTimeInHHmmFormat(element.iniMark.datetime) :'-',
            salida: element?.endMark?.datetime ? getTimeInHHmmFormat(element.endMark.datetime) :'-',
            no_laborado: element.discount?.time_not_worked ? intToHours(element.discount?.time_not_worked) : '-',
            justificado_goce: element.discount?.time_justified_pay ? intToHours(element.discount?.time_justified_pay) : '-',
            justificado_sin_goce: element.discount?.time_justified_no_pay ? intToHours(element.discount?.time_justified_no_pay) : '-',
            discount: element.discount?.discount? dollarFormat(element.discount.discount) :'-',
        })
        
    })

    return (
            <div className='w-full my-8'>
                {
                    dates?.length === 0 ?  (
                        <div className="flex justify-start items-center">
                            <IconText
                                icon={<HiDocumentSearch className="text-lg" />}
                            >
                                <h5 className="text-slate-500">Sin información que mostrar</h5>
                            </IconText>
                        </div>
                    )
                    :(
                        <div className='w-full flex justify-center items-start'>
                            <div className={classNames(`flex flex-col justify-start items-center gap-5`)}>
                                
                                <Avatar size={90} src={row.original.photo} shape="rounded" icon={<HiOutlineUser />} />
                                
                                <div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>
                                    
                                    <div className={`flex justify-start items-start gap-2 w-full font-semibold text-buke-500`}>
                                        <div className='w-1/12'>
                                            <HiOutlineUser className="text-lg" />
                                        </div>
                                        <div className='w-10/12'>
                                            <span>{`${row.original?.functional_position?row.original.functional_position:'-'}`}</span>
                                        </div>
                                    </div>

                                    <div className={`flex justify-start items-start gap-2 w-full`}>
                                        <div className='w-1/12'>
                                            <BsFillDiagram2Fill className="text-lg" />
                                        </div>
                                        <div className='w-10/12'>
                                            <span>{`${row.original?.organizational_unit?row.original.organizational_unit:'-'}`}</span>
                                        </div>
                                    </div>

                                    <div className={`flex justify-start items-start gap-2 w-full`}>
                                        <div className='w-1/12'>
                                            <HiMail className="text-lg" />
                                        </div>
                                        <div className='w-10/12'>
                                            <a href={`mailto:${row.original?.email?row.original.email:'-'}`}>
                                                <span>{`${row.original?.email?row.original.email:'-'}`}</span>
                                            </a>
                                        </div>
                                    </div>

                                    <div className={`flex justify-start items-start gap-2 w-full`}>
                                        <div className='w-1/12'>
                                            <HiPhone className="text-lg" />
                                        </div>
                                        <div className='w-10/12'>
                                            <span>{`${row.original?.phone?row.original.phone:'-'}`}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='w-9/12'>
                            <div className='mb-2 flex justify-between items-center'>
                                <h6 className={`${textInfoColor}`}>Marcaciones y descuentos</h6>
                                <ExportToExcelButton data={formatedDates} />
                            </div>
                                <Table compact className='' >
                                    <THead>
                                        <Tr>
                                            {columns.map((col,i)=><Th key={col.header+i} className={col.className}><div className={col.divClassName}>{col.header}</div></Th>)}
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {
                                            dates.map((date,i)=> {
                                                return TableRow(date,i)
                                            })
                                        }
                                    </TBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    
            </div>
	)
}

const EmpsTable = ({data}) => {
    return (
        <ReactTable
            data={data}
            renderRowSubComponent={RenderSubComponent}
            getRowCanExpand={() => true}
        />
    )
}

export default EmpsTable