import React from 'react'
import Button from './Button'
import { FaFileExcel } from "react-icons/fa";

import * as XLSX from 'xlsx'

const ExportToExcelButton = ({ data, title='Exportar a Excel', reportName='exported_data', className='' }) =>
{
	const exportToExcel = () => {

		const workbook = XLSX.utils.book_new()
		const worksheet = XLSX.utils.json_to_sheet(data)

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
		XLSX.writeFile(workbook, reportName+'.xlsx')
	}
	return (
		<Button
			className={className}
			title={title}
			color="green-800"
			variant="solid"
			onClick={exportToExcel}
			icon={<FaFileExcel/>}
		/>
	)
}

export default ExportToExcelButton
