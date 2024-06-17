import React, { forwardRef, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { FormContainer,Notification,toast,Avatar } from 'components/ui'
import { setOpenPhotoDrawer,setUpdateEmployee } from '../../store/stateSlice'

import { Formik } from 'formik'

import { HiOutlinePlus,HiUpload } from 'react-icons/hi'

import BaseService from "services/BaseService";


const Content = forwardRef( (props, ref) => 
{
    const dispatch = useDispatch()
    // Redux Selectors -------------------------------------------------------------------------------------

    const { selectedEmployee } = useSelector((state) => state.employee.state );


    // Initial Values --------------------------------------------------------------------------------------

    const entryIdIni = selectedEmployee ? selectedEmployee.id : null
    const photo = selectedEmployee && selectedEmployee.photo_route ? selectedEmployee.photo_route : null
    const nameIni = selectedEmployee && selectedEmployee.name ? selectedEmployee.name : ''
    const lastnameIni = selectedEmployee && selectedEmployee.lastname ? selectedEmployee.lastname : ''

    // States ----------------------------------------------------------------------------------------------

    const [ file, setFile ] = useState([])
    const [ setAvatarImg ] = useState()

    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeFile = (e) => { setFile(e) }

    const onFileUpload = (files) => {
        if(files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            handleChangeFile(files)
        }
    }

    // Subcomponents --------------------------------------------------------------------------------------

    
    // Submit ----------------------------------------------------------------------------------------------

    const openNotification = (type,title,message,placement) => {
        let BodyMessage = () => <>{message}</>
        if( typeof message === 'object' ) {
            BodyMessage = () => (
                <ul>{ Object.entries(message).map(([key, value]) => <li className='text-justify'>{value[0]}</li>  ) }</ul>
            )
        }
        toast.push((
            <Notification closable className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }

    const onSubmit = async () => {
        try {
            const values = []
            if (entryIdIni) {
                values['employee_id'] = entryIdIni
            }

            if (file && file[0]){
                values['photo'] = file[0]
            }

            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })
            console.log(data)

            const response = await BaseService.post('/administration/employee-update/' + entryIdIni, data);
            if ( response ) {
                dispatch(setOpenPhotoDrawer(false))
                dispatch(setUpdateEmployee(true));
                openNotification('success','Éxito','La entrada se almacenó con éxito','top-start')
            }
        } catch (errors) {
            const message = errors?.response?.data?.message || errors.toString()
            openNotification('danger','Error',message,'top-start')
        }
    }

    // Form ------------------------------------------------------------------------------------------------
    return (
            <Formik
                enableReinitialize
                innerRef = { ref }
                onSubmit = { values => onSubmit( values ) }
                initialValues = {{}}
            >
                { ( { resetForm, values } ) => {
                    return (
                        <>
                        {
                            <FormContainer>
                                <div className='flex flex-col justify-center items-center gap-4'>
                                    <div className='font-semibold'>
                                        <span>{`${nameIni} ${lastnameIni}`}</span>
                                    </div>
                                    <div>
                                        <Avatar size={ 100 } src={ photo } icon={ <HiOutlinePlus /> } />
                                    </div>
                                    <Upload
                                        className='w-full flex justify-center'
                                        name='attachment_mandatory'
                                        accept='image/jpeg, image/png'
                                        uploadLimit={1}
                                        onChange={ file => {
                                            onFileUpload(file)
                                        }}
                                    >
                                        <CustomButton icon={<HiUpload className='text-lg'/>}>Cargar foto</CustomButton>
                                    </Upload>
                                </div>
                            </FormContainer>
                        }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content