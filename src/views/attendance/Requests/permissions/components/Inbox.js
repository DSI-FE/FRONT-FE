import React from 'react';
import InboxTable from './InboxTable';
import Drawer from './Drawer';
import DrawerApp from './DrawerApprove';


const Inbox = ({className,isBoss=false,isRRHH=false}) =>
{
    return (
        <div className={`${className}`}>
            <InboxTable isBoss= {isBoss} isRRHH={isRRHH}/>
            <Drawer isBoss= {isBoss} isRRHH={isRRHH}/>
            <DrawerApp isBoss= {isBoss} isRRHH={isRRHH}/>
        </div>
    );
}

export default Inbox;