import React, { useCallback, useEffect } from "react"
import {useDispatch,useSelector} from 'react-redux'

import { getEntriesIndexWithFilesByType } from './store/dataSlice'


import Slider from './components/Slider'
import EntriesCards from "./components/EntriesCards"
import { injectReducer } from 'store/index'
import reducer from './store'

injectReducer('gallery', reducer);

const Gallery = () => {

	const dispatch = useDispatch()

    const { entries }  = useSelector( state => state.gallery.data )

    const fetchData = useCallback( () => {
        dispatch(getEntriesIndexWithFilesByType(2))
	}, [ ])
	useEffect( () => {
		fetchData()
	}, [ ])

    return (
		<div className={`mt-4`}>
			<Slider entries={entries}/>
			<EntriesCards className={`mt-12`} entries={entries}/>
		</div>
	)
}

export default Gallery;