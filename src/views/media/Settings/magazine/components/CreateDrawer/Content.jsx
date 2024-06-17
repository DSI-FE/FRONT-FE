import React, { forwardRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { Input,DatePicker,FormItem,FormContainer,Notification,toast,Avatar,Switcher} from 'components/ui'

import { Formik } from 'formik'

import { dateToStringFormat, StringToDate } from 'helpers'
import { HiDocument, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlinePlus,HiOutlineMinusCircle } from 'react-icons/hi'
import BaseService from 'services/BaseService'
import { setDrawerOpen } from '../../store/stateSlice'
import { getEntriesIndexWithFilesByType } from '../../store/dataSlice'

const Content = forwardRef( (props, ref) => 
{
    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { employee } = useSelector( state => state.auth )
    const { selected_entry:selectedEntry } =  useSelector( state => state.settingsMagazine.state )

    // Initial Values --------------------------------------------------------------------------------------

    const entryIdIni = selectedEntry ? selectedEntry.id : null
    const fileIdIni = selectedEntry && selectedEntry.file ? selectedEntry.file.id : null
    const nameIni = selectedEntry && selectedEntry.name ? selectedEntry.name : ''
    const descriptionIni = selectedEntry && selectedEntry.description ? selectedEntry.description : ''
    const urlIni = selectedEntry && selectedEntry.url ? selectedEntry.url : ''
    const activeIni = selectedEntry && selectedEntry.active ? selectedEntry.active === 1 : false
    const dateIniIni = selectedEntry && selectedEntry.date_start ? StringToDate(selectedEntry.date_start,'-',2) : {}
    const dateEndIni = selectedEntry && selectedEntry.date_end ? StringToDate(selectedEntry.date_end,'-',2) : {}
    const showInCarouselIni = selectedEntry && selectedEntry.show_in_carousel ? selectedEntry.show_in_carousel === 1 : false

    const dateEndRequiredIni = !selectedEntry || (selectedEntry && (selectedEntry.date_start === selectedEntry.date_end || !selectedEntry.date_end) ) ? false : true

    // States ----------------------------------------------------------------------------------------------

    const [ entryId, setEntryId ] = useState(entryIdIni)
    const [ fileId, setFileId ] = useState(fileIdIni)

    const [ name, setName ] = useState(nameIni)
    const [ description, setDescription ] = useState(descriptionIni)
    const [ url, setUrl ] = useState(urlIni)
    const [ active, setActive ] = useState(activeIni)
    const [ showInCarousel, setShowInCarousel ] = useState(showInCarouselIni)

    const [ dateIni, setDateIni ] = useState(dateIniIni)
    const [ dateEnd, setDateEnd ] = useState(dateEndIni)

    const [ file, setFile ] = useState([])
    const [avatarImg, setAvatarImg] = useState(null)
    const [avaSize, setAvaSize] = useState(80)

    const [ dateIniMax, setDateIniMax ] = useState(dateEnd)
    const [ dateIniMin, setDateIniMin ] = useState(dateIni)

    const [ dateEndMax, setDateEndMax ] = useState(dateEnd)
    const [ dateEndMin, setDateEndMin ] = useState(dateIni)

    const [ dateEndRequired, setDateEndRequired ] = useState(dateEndRequiredIni)


    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeName = entry => { setName(entry.target.value)}
    const handleChangeDescription = entry => { setDescription(entry.target.value)}
    const handleChangeUrl = entry => { setUrl(entry.target.value)}
    const handleChangeActive = ( val ) => { setActive(!val) }
    const handleChangeFile = (e) => { setFile(e) }
    const handleChangeShowInCarousel = ( val ) => { setShowInCarousel(!val) }

    const onFileUpload = (files) => {
        if(files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            handleChangeFile(files)
            setAvaSize(150)
        }
    }

    // Subcomponents --------------------------------------------------------------------------------------

    const CustomDatePicker = ({ ini = true }) => {

        return (
            <DatePicker
                clearable={ false }
                inputPrefix={ null }
                inputSuffix={ <HiOutlineCalendar className="text-lg" /> }
                inputFormat={ `DD/MM/YYYY` }
                value={ ( ini ? dateIni : dateEnd ) }
                disableOutOfMonth={true}
                disabled = { !ini ? !dateEndRequired && dateIni : false }
                maxDate={(ini ? dateIniMax : dateEndMax)}
                minDate={(ini ? dateIniMin : dateEndMin)}
                onChange = { date => { 
                    if (ini) {
                        setDateIni( date )
                        setDateEndMin( date )
                    } else {
                        setDateEnd( date )
                        setDateIniMax( date )
                    }
                }}
            />
        )
    }

    const CustomDatePickers = () => {
        const onSwitcherToggle = () => { setDateEndRequired(!dateEndRequired)}
        return (
            <div className='w-full flex justify-between gap-5'>
                <FormItem className='w-5/12' label={`Fecha ${dateEndRequired ? 'inicial' : ''}`}>
                    <CustomDatePicker  ini= { true } />
                </FormItem>
                {
                    dateEndRequired ? ( <FormItem className='w-5/12' label="Fecha final"><CustomDatePicker ini={false} /></FormItem> ) :  <div className='w-5/12' ></div>
                }
                <div className='w-2/12 flex flex-col justify-center items-center'>
                    <CustomButton
                        variant = "solid"
                        color = { dateEndRequired ? 'red-500' : 'buke-500' }
                        icon = { dateEndRequired ? <HiOutlineMinusCircle /> : <HiOutlinePlusCircle /> }
                        title = { dateEndRequired ? 'Remover fecha final' : 'Agregar fecha final (Permiso de más de un día)' }
                        onClick = { onSwitcherToggle }
                    />
                </div>
            </div>
        )
    }
    
    const CustomMandatoryAttachments = ({name}) => (
        <div className='flex justify-between items-center align-middle'>
            <Upload
                name='attachment_mandatory'
                accept='image/jpeg, image/png'
                uploadLimit={2}
                onChange={(file) => {onFileUpload(file)}}
            >
                <Avatar size={ avaSize } src={ avatarImg } icon={ <HiOutlinePlus /> } />

                {/* <CustomButton icon={<HiUpload className='text-lg'/>}>Cargar {name}</CustomButton> */}
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
            if (entryId) {
                values['id'] = entryId
            }
            if (fileId) {
                values['file_id'] = fileId
            }
            values['name'] =  name
            values['description'] =  'description de descargable'
            values['type'] =  4
            values['url'] =  url
            values['show_in_carousel'] =  0
            values['active'] =  active ? 1 : 0

            if ( dateIni instanceof Date  ) { values['date_start'] = dateToStringFormat(dateIni) }
            if( dateEnd instanceof Date && dateEndRequired ) { values['date_end'] =  dateToStringFormat(dateEnd) }

            values['adm_employee_id'] =employee.id

            if (file && file[0]){
                values['file'] = file[0]
            }

            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('/institution/entries', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                dispatch(getEntriesIndexWithFilesByType(4))
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
                                    <FormItem label="Nombre">
                                        <Input value={ name } onChange={ handleChangeName } />
                                    </FormItem>
                                    {/* <FormItem label="Descripción">
                                        <Input textArea value={ description } onChange={ handleChangeDescription } />
                                    </FormItem> */}
                                    <FormItem label="Enlace a Drive">
                                        <Input value={ url } onChange={ handleChangeUrl } />
                                    </FormItem>
                                    <div className='flex justify-around'>
                                    {/* <FormItem label="Mostrar en Carrusel">
                                        <Switcher checked={showInCarousel} onChange={handleChangeShowInCarousel} />
                                    </FormItem> */}
                                    <FormItem label="Activo">
                                        <Switcher checked={active} onChange={handleChangeActive} />
                                    </FormItem>
                                    </div>

                                    
                                    {/* <CustomDatePickers /> */}
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