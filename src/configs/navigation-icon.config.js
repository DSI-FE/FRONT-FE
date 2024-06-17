import React from 'react'
import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCog,
    HiOutlineClock,
    HiOutlineDocumentDuplicate
} from 'react-icons/hi';

import { IoExtensionPuzzleSharp } from "react-icons/io5";

import { VscPreview } from 'react-icons/vsc';

import { RiContactsBook2Line, RiBuildingFill } from 'react-icons/ri';

import { AiFillSchedule } from 'react-icons/ai';

import {
    BsBook,
} from 'react-icons/bs';

import {
    FaBusinessTime,
    FaCarAlt,
    FaFileInvoice,
    FaUserCog,
    FaCarSide,
} from 'react-icons/fa';

import { BiMailSend } from 'react-icons/bi';
import { MdPhoneAndroid } from 'react-icons/md';

// const Dsi = () => {
//     return (
//         <div className='text-sm'>
//             <img src='/img/logo/logo-dark-streamline.png' alt='dsi' height={10} width={23}/>
//         </div>
//     )
// }

const navigationIcon = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    businessTime: <FaBusinessTime />,
    cogs: <HiOutlineCog />,
    clock: <HiOutlineClock />,
    contacts: <RiContactsBook2Line />,
    building: <RiBuildingFill />,
    documents: <HiOutlineDocumentDuplicate />,
    userCog: <FaUserCog />,
    reservations: <BsBook />,
    dsi: <IoExtensionPuzzleSharp />,
    magazine: <VscPreview/>,
    parkings: <FaCarAlt />,
    request: <FaFileInvoice />,
    schedule: <AiFillSchedule />,
    courier: <BiMailSend />,
    transport: <FaCarSide/>,
}

export default navigationIcon
