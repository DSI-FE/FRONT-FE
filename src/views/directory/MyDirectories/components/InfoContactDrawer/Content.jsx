import React, { useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Notification,toast,Avatar,Spinner } from 'components/ui'
import classNames from 'classnames'
import { BsFillDiagram2Fill } from 'react-icons/bs'
import { HiOutlineUser, HiMail, HiPhone,HiDeviceMobile } from 'react-icons/hi'

import BaseService from 'services/BaseService'
import { setDrawerContactOpen, setSelectedContact } from '../../store/stateSlice'


const Content = () => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee } = useSelector( state => state.auth )
    const { selected_directory:selectedDirectory,selected_contact:selectedContact,loading } =  useSelector( state => state.directory_my_directories.state )

    // Initial Values --------------------------------------------------------------------------------------


    // States ----------------------------------------------------------------------------------------------


    // Handlers --------------------------------------------------------------------------------------------


    // Subcomponents --------------------------------------------------------------------------------------

    
    // Submit ----------------------------------------------------------------------------------------------

    // Info ------------------------------------------------------------------------------------------------
    return (
            ! loading  ?
            (
                <>
                    <div className={classNames(`flex justify-start items-center gap-5`)}>
                
                        <Avatar size={150} src={selectedContact.file_image} shape="rounded" icon={<HiOutlineUser />} />
                        
                        <div className={classNames(`flex flex-col justify-start items-start gap-2 w-full`)}>

                            <div className={`flex justify-start items-start gap-2 w-full font-semibold text-buke-500`}>
                                <div className='w-1/12'>
                                    <HiOutlineUser className="text-lg" />
                                </div>
                                <div className='w-10/12'>
                                    <span>{`${selectedContact?.name?(selectedContact.name+' '+selectedContact?.lastname):'-'}`}</span>
                                </div>
                            </div>
                            
                            <div className={`flex justify-start items-start gap-2 w-full`}>
                                <div className='w-1/12'>
                                    <HiMail className="text-lg" />
                                </div>
                                <div className='w-10/12'>
                                    <a href={`mailto:${selectedContact?.email?selectedContact.email:'-'}`}>
                                        <span>{`${selectedContact?.email?selectedContact.email:'-'}`}</span>
                                    </a>
                                </div>
                            </div>

                            <div className={`flex justify-start items-start gap-2 w-full`}>
                                <div className='w-1/12'>
                                    <HiPhone className="text-lg" />
                                </div>
                                <div className='w-10/12'>
                                    <span>{`${selectedContact?.phone?selectedContact.phone:'-'}`}</span>
                                </div>
                            </div>
                            <div className={`flex justify-start items-start gap-2 w-full`}>
                                <div className='w-1/12'>
                                    <HiDeviceMobile className="text-lg" />
                                </div>
                                <div className='w-10/12'>
                                    <span>{`${selectedContact?.mobile?selectedContact.mobile:'-'}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <span className='font-bold'>Notas</span>
                        <p>{`${selectedContact?.notes?selectedContact.notes:'-'}`}</p>
                    </div>
                </>
            ) : (
                <div className='flex justify-center items-center w-full h-full'>
					<Spinner size="3.25rem" />
				</div>
            )
    )

}

export default Content