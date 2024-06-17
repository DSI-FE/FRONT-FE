import React, { forwardRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { Input,DatePicker,FormItem,FormContainer,Notification,toast,Avatar,Switcher} from 'components/ui'

import { Formik } from 'formik'

import { dateToStringFormat, StringToDate } from 'helpers'
import { HiDocument, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlinePlus,HiOutlineMinusCircle } from 'react-icons/hi'
import BaseService from 'services/BaseService'
import { setDrawerContactOpen, setSelectedContact } from '../../store/stateSlice'
// import { getEntriesIndexWithFilesByType } from '../../store/dataSlice'

const Content = forwardRef( (props, ref) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee } = useSelector( state => state.auth )
    const { selected_directory:selectedDirectory,selected_contact:selectedContact } =  useSelector( state => state.directory_my_directories.state )

    // Initial Values --------------------------------------------------------------------------------------

    const fileIdIni = selectedContact && selectedContact.file ? selectedContact.file.id : null

    const idIni = selectedContact ? selectedContact.id : null
    const nameIni = selectedContact && selectedContact.name ? selectedContact.name : ''
    const lastnameIni = selectedContact && selectedContact.lastname ? selectedContact.lastname : ''
    const emailIni = selectedContact && selectedContact.email ? selectedContact.email : ''
    const phoneIni = selectedContact && selectedContact.phone ? selectedContact.phone : ''
    const mobileIni = selectedContact && selectedContact.mobile ? selectedContact.mobile : ''
    const descriptionIni = selectedContact && selectedContact.description ? selectedContact.description : ''
    const notesIni = selectedContact && selectedContact.notes ? selectedContact.notes : ''
    const activeIni = selectedContact && selectedContact.active || Object.keys(selectedContact).length === 0 ? true : false
    const directoryIdIni = selectedContact ? selectedContact.dir_directory_id : null
    const avaLgSize = 150;
    const avaSmSize = 80;
    
    const avatarImgIni = selectedContact && selectedContact.file_image ? selectedContact.file_image : null
    const avaSizeIni = selectedContact && selectedContact.file_image ?  avaLgSize : avaSmSize

    // States ----------------------------------------------------------------------------------------------

    const [ contactId, setContactId ] = useState(idIni)
    const [ fileId, setFileId ] = useState(fileIdIni)

    const [ name, setName ] = useState(nameIni)
    const [ lastname, setLastname ] = useState(lastnameIni)
    const [ email, setEmail ] = useState(emailIni)
    const [ phone, setPhone ] = useState(phoneIni)
    const [ mobile, setMobile ] = useState(mobileIni)
    const [ description, setDescription ] = useState(descriptionIni)
    const [ notes, setNotes ] = useState(notesIni)
    const [ directoryId, setDirectoryId ] = useState(directoryIdIni)
    const [ active, setActive ] = useState(activeIni)

    const [ file, setFile ] = useState([])
    const [avatarImg, setAvatarImg] = useState(avatarImgIni)
    const [avaSize, setAvaSize] = useState(avaSizeIni)

    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeName = entry => { setName(entry.target.value)}
    const handleChangeLastname = entry => { setLastname(entry.target.value)}
    const handleChangeEmail = entry => { setEmail(entry.target.value)}
    const handleChangePhone = entry => { setPhone(entry.target.value)}
    const handleChangeMobile = entry => { setMobile(entry.target.value)}
    const handleChangeDescription = entry => { setDescription(entry.target.value)}
    const handleChangeNotes = entry => { setNotes(entry.target.value)}
    const handleChangeDirectoryId = entry => { setDirectoryId(entry.target.value)}
    const handleChangeActive = ( val ) => { setActive(!val) }
    const handleChangeFile = (e) => { setFile(e) }

    const onFileUpload = (files) => {
        if(files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            handleChangeFile(files)
            setAvaSize(avaLgSize)
        }
    }

    // Subcomponents --------------------------------------------------------------------------------------

    const CustomMandatoryAttachments = ({name}) => (
        <div className='flex justify-between items-center align-middle'>
            <Upload
                name='attachment_mandatory'
                accept='image/jpeg, image/png'
                uploadLimit={2}
                onChange={(file) => {onFileUpload(file)}}
            >
                <Avatar size={ avaSize } src={ avatarImg } icon={ <HiOutlinePlus /> } />
            </Upload>
        </div>
    )

    const CustomMandatoriesAttachments = ( { className } ) => {
        return (
            <div className={ className }>
                <FormContainer>
                    <CustomMandatoryAttachments name={`Imagen de Entrada`}/>
                </FormContainer>
            </div>
        )
    }
    
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
            if (contactId) {
                values['id'] = contactId
            }
            if (fileId) {
                values['file_id'] = fileId
            }
            values['name'] =  name
            values['lastname'] =  lastname

            values['email'] = email
            values['phone'] = phone
            values['mobile'] = mobile
            values['description'] = description
            values['notes'] = notes
            // values['active'] = active === 'true' || active === 1 ? 1 : 0
            values['active'] = 1
            values['dir_directory_id'] = selectedDirectory.id

            if (file && file[0]){
                values['file'] = file[0]
            }

            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/directory/contacts', data)
            if ( response ) {
                dispatch(setDrawerContactOpen(false))
                dispatch(setSelectedContact({}))
                openNotification('success','Éxito','El contacto se almacenó con éxito','top-start')
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
                                    <div className='flex justify-between'>
                                        <div className='w-6/12'>
                                            <FormItem label="Nombre">
                                                <Input value={ name } onChange={ handleChangeName } />
                                            </FormItem>
                                            <FormItem label="Apellido">
                                                <Input value={ lastname } onChange={ handleChangeLastname } />
                                            </FormItem>
                                        </div>
                                        <CustomMandatoriesAttachments className='w-6/12 flex justify-center items-center'/>
                                    </div>
                                    <FormItem label="Correo Electrónico">
                                        <Input value={ email }  onChange={ handleChangeEmail } />
                                    </FormItem>
                                    <div className='flex justify-between gap-3'>
                                        <FormItem label="Teléfono" className='w-6/12'>
                                            <Input value={ phone } onChange={ handleChangePhone } />
                                        </FormItem>
                                        <FormItem label="Teléfono Móvil" className='w-6/12'>
                                            <Input value={ mobile } onChange={ handleChangeMobile } />
                                        </FormItem>
                                    </div>

                                    {/* <FormItem label="Descripción">
                                        <Input textArea value={ description } onChange={ handleChangeDescription } />
                                    </FormItem> */}

                                    <FormItem label="Notas">
                                        <Input textArea value={ notes } onChange={ handleChangeNotes } />
                                    </FormItem>
                                    {/* <div className='flex justify-start'>
                                        <FormItem label="Activo">
                                            <Switcher checked={active} onChange={handleChangeActive} />
                                        </FormItem>
                                    </div> */}
                                </FormContainer>
                            }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content