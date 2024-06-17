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
import Filters from './Filters'
import {StringDateToFormat,dollarFormat,intToHours,capitalizeFirstLetter,getTimeInHHmmFormat} from 'helpers/index'
import { BsFillDiagram2Fill } from 'react-icons/bs'

import { themeConfig } from 'configs/theme.config'

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

function ReactTable({ renderRowSubComponent, getRowCanExpand,data=[] }) {

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
            })
        ],
        []
    )
    const [sorting, setSorting] = React.useState([ { id: "name", desc: false }])
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
    
    return (
        <>
            <Filters children = {
                <DebouncedInput value={globalFilter ?? ''} onChange={(value) => setGlobalFilter(String(value))} className="" />
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
                                            if(row?.original?.discounts?.totalTimeNotWorked>0)
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
    
    const TableRow = (per,i) =>
    {

        return(
            <Tr key={i} className={`text-center`}>
                <Td>
                    <div className={`flex items-center justify-between font-bold`}>
                        {per.name}
                    </div>
                </Td>
                {/* <Td>{per.used_hours_on_year}</Td>
                <Td>{per.used_hours_on_month}</Td>
                <Td>{per.used_requests_on_year}</Td>
                <Td>{per.used_requests_on_month}</Td> */}

            </Tr>
        )
    }

    const columns =
    [
        {header:'Nombre',accessorKey:'name',divClassName:'text-center '},
        {header:'Horas en año',accessorKey:'available_hours_on_year',divClassName:'text-center'},
        {header:'Horas en mes',accessorKey:'available_hours_on_month',divClassName:'text-center',className:'border-r'},
        {header:'Peticiones en Año',accessorKey:'available_requests_on_year',divClassName:'text-center'},
        {header:'Peticiones en Mes',accessorKey:'available_requests_on_month',divClassName:'text-center'},
    ]

    const perTypes = row.original?.permission_types;

    return (
            <div className='w-full my-8'>
                {
                    perTypes?.length === 0 ?  (
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
                                {/* <div className='mb-2'>
                                    <h6 className={`${textInfoColor}`}>Marcaciones y descuentos</h6>
                                </div> */}
                                <Table compact className='' >
                                    <THead>
                                        <Tr>
                                            {columns.map((col,i)=><Th key={col.header+i} className={col.className}><div className={col.divClassName}>{col.header}</div></Th>)}
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {
                                            perTypes.map((per,i)=> {
                                                return TableRow(per,i)
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