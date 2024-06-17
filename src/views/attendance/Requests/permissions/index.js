import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { injectReducer } from 'store/index';

import reducer from './store';
import Inbox from './components/Inbox';

import { Tabs } from 'components/ui'

import { HiPaperAirplane,HiUserGroup,HiOfficeBuilding } from 'react-icons/hi';

const { TabNav, TabList, TabContent } = Tabs

injectReducer('permissions', reducer);

const Permissions = ({className}) => {
    
    const [opt, setOpt] = useState('tab1')

    const {employee,functionalPosition} = useSelector( state => state.auth )
    const isBoss = functionalPosition.boss === 1
    const isRRHH = functionalPosition.id === 48 || functionalPosition.id === 89

    const DivList = () => {
        const EnviadasTab = () =>  <TabNav value="tab1" icon={<HiPaperAirplane />}>Enviadas</TabNav>
        const EmployeesTab = () =>  isBoss ? <TabNav value="tab2" icon={<HiUserGroup />}>Mi Equipo</TabNav> : <></>
        const RRHHTab = () =>  isRRHH ? <TabNav value="tab3" icon={<HiOfficeBuilding />}>RRHH</TabNav> :<></>
        return (
            <div className='flex justify-end'>
                <EnviadasTab/>
                <EmployeesTab/>
                <RRHHTab/>
            </div>
        )
    }
    
    return (
        <>
            <div className={`${className}`}>
                <div>
                    <Tabs value={opt} onChange={(val)=>setOpt(val)}>
                        <TabList className='flex justify-end'>
                            <DivList/>
                        </TabList>
                        <div className="p-4">
                            <TabContent value="tab1">
                                <Inbox/>
                            </TabContent>
                            <TabContent value="tab2">
                                <Inbox isBoss={isBoss}/>
                            </TabContent>
                            <TabContent value="tab3">
                                <Inbox isRRHH={isRRHH}/>
                            </TabContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
	);
}

export default Permissions;
