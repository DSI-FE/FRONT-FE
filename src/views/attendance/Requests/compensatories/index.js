import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { injectReducer } from 'store/index'
import reducer from './store'
import EntriesTable from './components/EntriesTable'
import Drawer from './components/CreateDrawer/Drawer'
import ManagementDrawer from './components/ManagementDrawer/Drawer'
import Dialog from './components/DeleteDialog/Dialog'
import { Tabs } from 'components/ui'
import { HiPaperAirplane,HiUserGroup,HiOfficeBuilding } from 'react-icons/hi';

const { TabNav, TabList, TabContent } = Tabs


injectReducer('compensatories', reducer);

const Compensatories = ({className}) => {

    const [opt, setOpt] = useState('tab1')

    const {employee,functionalPosition} = useSelector( state => state.auth )
    const isBoss = functionalPosition.boss === 1
    const isRRHH = functionalPosition.id === 48 || functionalPosition.id === 89

    const DivList = () => {
        const EnviadasTab = () =>  <TabNav value="tab1" icon={<HiPaperAirplane />}>Enviadas</TabNav>
        const EmployeesTab = () =>  isBoss ? <TabNav value="tab2" icon={<HiUserGroup />}>Mi Equipo</TabNav> : <></>
        // const RRHHTab = () =>  isRRHH ? <TabNav value="tab3" icon={<HiOfficeBuilding />}>RRHH</TabNav> :<></>
        return (
            <div className='flex justify-end'>
                <EnviadasTab/>
                <EmployeesTab/>
                {/* <RRHHTab/> */}
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
                                <EntriesTable/>
                            </TabContent>
                            <TabContent value="tab2">
                                <EntriesTable isBoss={isBoss}/>
                            </TabContent>
                            <TabContent value="tab3">
                            </TabContent>
                        </div>
                    </Tabs>
                </div>
            </div>
            
            <Drawer/>
            <ManagementDrawer/>
            <Dialog/>
        </>
	);
}

export default Compensatories;