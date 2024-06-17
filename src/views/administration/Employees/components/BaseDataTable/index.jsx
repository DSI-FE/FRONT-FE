import React, { useEffect, useCallback, useMemo, forwardRef } from 'react';
import { getData, setTableData, setSortedColumn, setUrl } from './store/dataSlice';
import cloneDeep from 'lodash/cloneDeep';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'components/shared';
import debounce from 'lodash/debounce';
import { Input } from 'components/ui';
import { HiOutlineSearch } from 'react-icons/hi';

import { injectReducer } from 'store/index';
import reducer from './store';

injectReducer('dataEmployees', reducer);

const BaseDataTable = forwardRef((props, ref) => {
	const { columns, reqUrl } = props;

	const dispatch = useDispatch();

	const data = useSelector((state) => state.dataEmployees.data.data);
	const loading = useSelector((state) => state.dataEmployees.data.loading);
	const { page, perPage, total, search, sort } = useSelector((state) => state.dataEmployees.data.tableData);

	const fetchData = useCallback(() => {
		dispatch(getData({ reqParams: { page, perPage, sort, search }, reqUrl }));
		dispatch(setUrl(reqUrl));
	}, [page, perPage, sort, search, reqUrl, dispatch]);

	useEffect(() => { fetchData() }, [fetchData, page, perPage, sort, search]);

	const tableData = useMemo(() => ({ page, perPage, sort, search, total }), [page, perPage, sort, search, total]);

	const onPaginationChange = page => {
		const newTableData = cloneDeep(tableData);
		newTableData.page = page;
		dispatch(setTableData(newTableData));
	}

	const onSort = (sort, sortingColumn) => {
		const newTableData = cloneDeep(tableData);
		newTableData.sort = sort;
		dispatch(setTableData(newTableData));
		dispatch(setSortedColumn(sortingColumn));
	}

	const handleInputChanges = (val) => {
		const newTableData = cloneDeep(tableData)
		newTableData.search = val
		newTableData.page = 1

		if (typeof val === 'string' && val.length > 1) {
			dispatch(setTableData(newTableData));
		}

		if (typeof val === 'string' && val.length === 0) {
			dispatch(setTableData(newTableData));
		}
	}


	const debounceFn = debounce(handleDebounceFn, 500);

	function handleDebounceFn(val) {
		handleInputChanges?.(val);
	}

	const handleInputChange = (e) => {
		debounceFn(e.target.value);
	}

	return (
		<>
			<Input
				ref={ref}
				className="max-w-md md:w-52"
				size="sm"
				placeholder="Buscar"
				prefix={<HiOutlineSearch className="text-lg" />}
				onChange={handleInputChange}
			/>
			<DataTable
				columns={columns}
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ width: 28, height: 28 }}
				loading={loading}
				pagingData={{ page, perPage, total }}
				pageSizes={[5, 10, 25, 50, 100]}
				onPaginationChange={onPaginationChange}
				onSort={onSort}
			/>
		</>
	)
});

export default BaseDataTable;