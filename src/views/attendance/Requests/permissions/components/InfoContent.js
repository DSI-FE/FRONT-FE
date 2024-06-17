import React, { useState } from 'react'
import { Button as CustomButton} from 'components/custom'
import { Tooltip, toast, Notification } from 'components/ui'
import { HiOutlineInformationCircle } from 'react-icons/hi'

const InfoContent = ({permissionType}) => {
    const name = permissionType.name ?? '-'
    const description = permissionType.description ?? '-'

    const notificationNeverClose = () => {
        toast.push(
            <Notification className='border ' closable type="info" duration={0}>
                <p className='font-semibold text-slate-700'>{name}</p>
                <p className='mt-2 text-justify'>{description}</p>
            </Notification>,
            {placement: 'top-start'}
        )
    }

    return (

        <CustomButton
            shape="circle"
            variant='twoTone'
            onClick={notificationNeverClose}
            icon={<HiOutlineInformationCircle className="text-lg"/>}
        >
        </CustomButton> 
        

    )

}

export default InfoContent;