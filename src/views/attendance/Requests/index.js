import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Tabs, Segment } from 'components/ui'
import { injectReducer } from 'store/index'

import PermissionRequests from './permissionRequests'
import reducer from './store'
import { setSelectedState, setSelectedSegment, setSelectedEmployee, setSelectedOrganizationalUnit } from './store/stateSlice'

injectReducer('attendance_requests', reducer)

const { TabNav, TabList, TabContent } = Tabs

const Requests = () =>
{
	const dispatch = useDispatch()

    const { functionalPosition, organizationalUnit } = useSelector( state => state.auth )
    const { segments } = useSelector( state => state.attendance_requests.data )
    const { selected_segment:selectedSegment } = useSelector( state => state.attendance_requests.state )

	const isBoss = functionalPosition.boss === 1
	const isPermissionRequestManager = functionalPosition.id === 48 || functionalPosition.id === 89
	
	const tabs =
	[
		{ id: 'tab_1', label: 'Permisos', content: <PermissionRequests /> },
		{ id: 'tab_2', label: 'Compensatorios', content: (<></>) }
	];

	return (
		<Tabs
			defaultValue='tab_1'
			variant='pill'
			className={'mt-5'}
		>
			<div className='flex justify-between md:border-b md:pb-4 mb-5'>
				{/* Mayor options */}
				<TabList className='
					xs:justify-center xs:w-full
					md:justify-start
				'>
				{
					tabs.map( (tab, i) => (
						<TabNav key={ tab.id+i } showSelectedIcon={ true } value={ tab.id }>{tab.label}</TabNav>
					))
				}
				</TabList>

				{/* Common segments */}
				<Segment
					value={ selectedSegment }
					onChange={ val => {
						dispatch( setSelectedState( 0 ) )
						dispatch( setSelectedSegment( val ) )
						dispatch( setSelectedEmployee( 0 ) )
						if( val[0] === '2' ) {
							dispatch( setSelectedOrganizationalUnit( organizationalUnit.id ) )
						} else if( val[0] === '3' ){
							dispatch( setSelectedOrganizationalUnit( 0 ) )
						}
					}}
				>
				{
					segments.map( (seg,i) => {
						if ( seg.value===1 || (isBoss && seg.value ===2) || (isPermissionRequestManager && seg.value===3)){
							return <Segment.Item key={seg.value+i} value={seg.value.toString()}>{seg.name}</Segment.Item>
						} else {
							return <span key={'sp'+i}></span>
						}
					})
				}
				</Segment>

			</div>
			{
				tabs.map( tab => (
					<TabContent key={ tab.id } value={ tab.id }>
					{ tab.content }
					</TabContent>
				))
			}

		</Tabs>

	);
}

export default Requests;