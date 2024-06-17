import React, { useEffect, useMemo,useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from 'components/ui'
import { DataTable } from 'components/shared'
import { getEmployees, getOrganizationalUnits, setTableData } from '../store/dataSlice'
import { setDrawerOpen, setEmployee,setLoading } from '../store/stateSlice'

import cloneDeep from 'lodash/cloneDeep'
import EmployeesTableTools from './EmployeesTableTools'
import EmployeesInfoDrawer from './EmployeesInfoDrawer'

const NameColumn = ( { row } ) => {
	
	const dispatch = useDispatch()
	
	const onShow = async () => {
		dispatch(setDrawerOpen(true))
		dispatch(setLoading(true))
		setTimeout( () => {
			dispatch(setEmployee(row.id))
        }, 500)
	}
	const ava = row.photo ? row.photo : '/img/avatars/nopic.jpg'
	return (
		<div className="flex items-center gap-3 cursor-pointer" onClick={onShow}>
			<Avatar size={45} src={ava}/>
			<span  className='font-bold ml-3'>{`${row.name} ${row.lastname}`}</span>
		</div>
	)
}


const EmployeesTable = () =>
{
    const tableRef = useRef(null)

	const dispatch = useDispatch()
	
	const { page, paginate, sort, search, total } = useSelector((state) => state.directory.data.tableData)
	const organizationalUnitId = useSelector((state) => state.directory.data.organizationalUnitId)
	const loading = useSelector((state) => state.directory.data.loading)
	const data = useSelector((state) => state.directory.data.employeesList)

	const fetchData = useCallback( () =>
    {
		dispatch(getEmployees({page, paginate, sort, search,organizationalUnitId}))
		dispatch(getOrganizationalUnits())
	}, [page, paginate, sort, search,organizationalUnitId, dispatch])

	useEffect( () => {
		fetchData()
	}, [page, paginate, sort, fetchData])

	useEffect(() => {
		tableRef?.current.resetSorting()
    }, [organizationalUnitId])

	const tableData = useMemo( () => 
    ({page, paginate, sort, search, total}), 
	[page, paginate, sort, search, total])

	const columns = useMemo( () => 
		[
			{
				header: 'Nombre',
				accessorKey: 'name',
				cell: (props) => {
					const row = props.row.original
					return <NameColumn row={row} />
				},
				sortable: true,
			},
			{
				header: 'Cargo',
				accessorKey: 'functional_position',
				cell: (props) => {
					let row = <div className='w-100 text-center'>-</div>
					if(props.row.original.functional_position)
					{
						const cargo = props.row.original.functional_position
						row = (
								<span>{`${cargo}`}</span>
						)
					}
					return row
				},
			},
			{
				header: 'Unidad',
				accessorKey: 'organizational_unit',
				cell: (props) => {
					let row = <div className='w-100 text-center'>-</div>
					if(props.row.original.organizational_unit)
					{
						let unidad = props.row.original.organizational_unit
						row = (
								<span>{`${unidad}`}</span>
						)
					}
					return row
				},
			},
			{
				header: 'Telefono',
				accessorKey: 'phone',
				enableSorting: false,
				cell: (props) => {
					let row = <div className='w-100 text-center'>-</div>
					if (props.row.original.phone) {
						const phones = props.row.original.phone
						row = (
							<div className='w-100 text-center flex flex-col justify-between gap-2'>
							{
								phones.split(",").map((phone,i) => (
									<a key={`phone${i}`} href={`tel:${phone}`}>
										<span>{`${phone}`}</span>
									</a>
								))
							}
							</div>
						)
					}
					return row
				},
			},
			{
				header: 'Correo',
				accessorKey: 'email',
				enableSorting: false,
				cell: (props) => {
					let row = <div className='w-100 text-center'>-</div>
					if(props.row.original.email)
					{
						const email = props.row.original.email
						row = (
								<a href={`mailto:${email}`}>
									<span>{`${email}`}</span>
								</a>
						)
					}
					return row
				},
			},
		], []
    )

	const onPaginationChange = page => {
		const newTableData = cloneDeep(tableData)
		newTableData.page =  page
		dispatch(setTableData(newTableData))
	}

	const onSelectChange = value => {
		const newTableData = cloneDeep(tableData)
		newTableData.paginate =  Number(value)
		newTableData.page = 1
		dispatch(setTableData(newTableData))
	}

	const onSort = ( sort ) => {
		const newTableData = cloneDeep(tableData)
		newTableData.sort = sort
		dispatch(setTableData(newTableData))
	}
	
	return (
		<>
			<EmployeesTableTools className={`mb-5`}/>
			<DataTable
				ref={tableRef}
				columns={columns} 
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={{ page, paginate, sort, search, total }}
				onPaginationChange={onPaginationChange}
				onSelectChange={onSelectChange}
				onSort={onSort}
				availableAll={true}
			/>
			<EmployeesInfoDrawer/>
		</>
	)
}

export default EmployeesTable