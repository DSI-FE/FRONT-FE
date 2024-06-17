import React, { forwardRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { Input,DatePicker,FormItem,FormContainer,Notification,toast,Avatar,Switcher} from 'components/ui'

import { Formik } from 'formik'

import { dateToStringFormat, StringToDate } from 'helpers'
import { HiDocument, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlinePlus,HiOutlineMinusCircle } from 'react-icons/hi'
import BaseService from 'services/BaseService'
import { setDrawerOpen, setSelectedDirectory,setSelectedDirectoryContacts } from '../../store/stateSlice'
// import { getEntriesIndexWithFilesByType } from '../../store/dataSlice'

const Content = forwardRef( (props, ref) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee } = useSelector( state => state.auth )
    const { selected_directory:selectedDirectory,create } =  useSelector( state => state.directory_my_directories.state )

    // Initial Values --------------------------------------------------------------------------------------

    const directoryIdIni = selectedDirectory && !create ? selectedDirectory.id : null
    const fileIdIni = selectedDirectory && !create && selectedDirectory.file ? selectedDirectory.file.id : null
    const nameIni = selectedDirectory && !create && selectedDirectory.name ? selectedDirectory.name : ''
    const descriptionIni = selectedDirectory && !create && selectedDirectory.description ? selectedDirectory.description : ''
    const classificationNameIni = selectedDirectory && !create && selectedDirectory.classification_name ? selectedDirectory.classification_name : ''
    const publicIni = selectedDirectory && selectedDirectory.public && !create  ? selectedDirectory.public === 1 : true

    // States ----------------------------------------------------------------------------------------------

    const [ directoryId, setDirectoryId ] = useState(directoryIdIni)
    const [ fileId, setFileId ] = useState(fileIdIni)

    const [ name, setName ] = useState(nameIni)
    const [ description, setDescription ] = useState(descriptionIni)
    const [ classificationName, setClassificationName ] = useState(classificationNameIni)
    const [ publicDirectory, setPublicDirectory ] = useState(publicIni)


    const [ file, setFile ] = useState([])
    const [avatarImg, setAvatarImg] = useState(null)
    const [avaSize, setAvaSize] = useState(80)

    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeName = entry => { setName(entry.target.value)}
    const handleChangeDescription = entry => { setDescription(entry.target.value)}
    const handleChangeClassificationName = entry => { setClassificationName(entry.target.value)}
    const handleChangePublic = ( val ) => { setPublicDirectory(!val) }
    const handleChangeFile = (e) => { setFile(e) }

    const onFileUpload = (files) => {
        if(files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            handleChangeFile(files)
            setAvaSize(150)
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
            <div >
            {
                file.map((el,i) =>{
                    return (
                        <div className='flex justify-between' key={`file-${i}`}>
                            <div className='flex align-middle items-center gap-2'><HiDocument className='inline-block'/><span>{el.name}</span></div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )

    const CustomMandatoriesAttachments = () => {
        return (
            <>
                <h6 className='mb-4'>Imagen</h6>
                <FormContainer className='w-full mt-2'>
                    <CustomMandatoryAttachments name={`Imagen de Entrada`}/>
                </FormContainer>
            </>
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
            if (directoryId) {
                values['id'] = directoryId
            }
            if (fileId) {
                values['file_id'] = fileId
            }
            values['name'] =  name
            values['description'] =  description
            values['classification_name'] =  classificationName
            values['public'] = publicDirectory === 'true' || publicDirectory === 1 ? 1 : 0

            values['active'] = 1

            values['adm_employee_id'] =employee.id

            if (file && file[0]){
                values['file'] = file[0]
            }

            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/directory/directories', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                if ( create ) {
                    dispatch(setSelectedDirectory({})) // Pendiente: Seleccionar el directorio creado
                    dispatch(setSelectedDirectoryContacts([]))
                }

                openNotification('success','Éxito','El directorio se almacenó con éxito','top-start')
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
                                    <FormItem label="Nombre">
                                        <Input value={ name } onChange={ handleChangeName } />
                                    </FormItem>
                                    <FormItem label="Descripción">
                                        <Input textArea value={ description } onChange={ handleChangeDescription } />
                                    </FormItem>
                                    <FormItem label="Nombre de Clasificación">
                                        <Input value={ classificationName } onChange={ handleChangeClassificationName } />
                                    </FormItem>
                                    <div className='flex justify-around'>
                                        <FormItem label="Público">
                                            <Switcher checked={publicDirectory} onChange={handleChangePublic} />
                                        </FormItem>
                                    </div>
                                    <CustomMandatoriesAttachments/>
                                </FormContainer>
                            }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content