import React, { useState,useEffect } from 'react';
import { Button, Table, Pagination, Select, Input} from 'components/ui';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    getSortedRowModel
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils'

import { themeConfig } from 'configs/theme.config';
import { HiEye } from 'react-icons/hi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { themeColor, primaryColorLevel } = themeConfig;

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
    const [value, setValue] = useState(initialValue)
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}

const RowActions = ( { cell } ) => {

    const buttonInfo = (
        <Button
            title='Consultar información'
            size="xs"
            color={`${themeColor}-${primaryColorLevel}`}
            variant="solid"
            icon={<HiEye />}
            onClick={()=> alert(cell)}
        />
    );

    return (
        <div className="flex justify-start gap-4 items-center">
            {buttonInfo}
            {cell}
        </div>
	);
}

const columnHelper = createColumnHelper();

const defaultColumns = [
    columnHelper.accessor('type', {
        header: () => <span>Visitas</span>,
        cell: cell => <RowActions cell={cell.getValue()}/>,
    }),
    columnHelper.accessor('status', {
        header: 'Status'
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress'
    })
];

const tableData = () => {
    const arr = []
    arr.push({
        type:`ZZZZ`,
        description: `ZZZZZ`,
        status: `SDFSDF`,
        date: `SDFSFD`
    });

    for (let i = 0; i < 800; i++) {
        arr.push({
            type:`col - a - ${i}`,
            description: `col - b - ${i}`,
            status: `col - c - ${i}`,
            date: `col - d - ${i}`,
        })
    }
    return arr
}

const totalData = tableData().length;

const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const InboxTable = (props) =>
{
    const {className} = props;

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [ data ] = useState( () => tableData() );


    const table = useReactTable({
        data,
        columns:defaultColumns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = page => { table.setPageIndex( page - 1 ) }
    const onSelectChange = value => { table.setPageSize( Number(value) ) }
    // const onSortChange = value => { table.setSorting( Number(value) ) }

    return (

        <div>
            <DebouncedInput
                value={globalFilter ?? ''}
                onChange={(value) => setGlobalFilter(String(value))}
                className="p-2 font-lg shadow border border-block"
                placeholder="Buscar"
            />
            <Table>
                <THead>
                    { table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            { headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        { header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                    onClick:
                                                    header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                { flexRender( header.column.columnDef.header, header.getContext() )}
                                                { header.column.getCanSort() && <Sorter sort = { header.column.getIsSorted() } />}

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
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
                
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={ pageSizeOption.filter( option => option.value === table.getState().pagination.pageSize )}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default InboxTable;