import React from 'react'
import { Button, Drawer } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../store/stateSlice'
import InfoContent  from './InfoContent'
import { themeConfig } from 'configs/theme.config';
const {textThemeColor} = themeConfig;


const InfoDrawer = () =>
{
	const dispatch = useDispatch();
	const drawerInfoOpen = useSelector((state) => state.attendance.state.drawerInfoOpen);

    const onDrawerClose = () => {
        dispatch(setLoading(true));
	}

    const Title = () => (
		<div>
			<h4 className={`mb-2 flex justify-start items-center gap-2 ${textThemeColor}`}>
                {`Información de Fecha`}
            </h4>
		</div>
	);
    
    const Footer = ({onCancel}) =>
    (
        <div className="flex justify-between items-center w-full">
                <Button size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
        </div>
    );
    
    return (
        <>
            <Drawer
                isOpen={drawerInfoOpen}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
                closable={false}
                title={<Title />}
                footer={ <Footer onCancel={onDrawerClose} /> }
                width={40}
                widthPercent={true}
            >
                <InfoContent/>
            </Drawer>
        </>
	)
    
}

export default InfoDrawer;
