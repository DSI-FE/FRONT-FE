import React, { useCallback, useEffect } from "react"
import {useDispatch,useSelector} from 'react-redux'

import { getEntriesIndexWithFilesByType } from './store/dataSlice'

import EntriesCards from "./components/EntriesCards"
import { injectReducer } from 'store/index'
import reducer from './store'

injectReducer('magazine', reducer);

const Magazine = () => {

	const dispatch = useDispatch()

    const { entries }  = useSelector( state => state.magazine.data )

    const fetchData = useCallback( () => {
        dispatch(getEntriesIndexWithFilesByType(5))
	}, [ ])
	useEffect( () => {
		fetchData()
	}, [ ])

    return (
		<div className={`mt-4`}>
			<EntriesCards className={`mt-12`} entries={entries}/>
		</div>
	)
}

export default Magazine;