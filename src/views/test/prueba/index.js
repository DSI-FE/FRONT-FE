import React from "react"

import { injectReducer } from 'store/index'
import reducer from './store'

injectReducer('gallery', reducer);

const Gallery = () => {



    return (
		<>
		</>
	)
}

export default Gallery;