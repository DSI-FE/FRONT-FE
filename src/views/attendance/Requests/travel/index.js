import React, { useState } from 'react';
import { injectReducer } from 'store/index';

import reducer from './store';
import { Segment } from 'components/ui';
import Inbox from './components/Inbox';

injectReducer('compensatories', reducer);

const Compensatories = ({className}) => {
    
    const [opt, setOpt] = useState(['0'])
    const onOptChange = val => { setOpt(val) }

    const ContentBody = () => {
        return opt[0] === '0' ? <Inbox/> : <h4>OPT2</h4>
    }

    return (
        <>
            <div className={`${className}`}>
                <div className='flex justify-between'>
                    <div>
                        <h4>Viáticos</h4>
                    </div>
                    <div>
                        {/* <Segment onChange={onOptChange} value={opt}>
                            <Segment.Item value="0">Salida</Segment.Item>
                            <Segment.Item value="1">Entrada</Segment.Item>
                        </Segment> */}
                    </div>
                </div>
                <div>
                    <ContentBody />
                </div>
            </div>
        </>
	);
}

export default Compensatories;