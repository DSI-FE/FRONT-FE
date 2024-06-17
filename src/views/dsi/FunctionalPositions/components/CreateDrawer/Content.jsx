import React, { forwardRef,useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { Upload, Button as CustomButton} from 'components/custom'
import { Input,Select,FormItem,FormContainer,Notification,toast,Avatar,Switcher} from 'components/ui'
import { CustomSelectOption } from 'components/custom'
import { Formik } from 'formik'
import BaseService from 'services/BaseService'
import { setDrawerOpen } from '../../store/stateSlice'
import { getFunctionalPositions } from '../../store/dataSlice'


const Content = forwardRef( (props, ref) => 
{

    // States ----------------------------------------------------------------------------------------------
    // const [organizationalUnit, setOrganizationalUnit] = useState(null)

    // Redux Selectors -------------------------------------------------------------------------------------

    const dispatch = useDispatch()

    const { organizational_units:organizationalUnits } =  useSelector( state => state.functionalPositions.data )
    const { selected_entry:functionalPosition } =  useSelector( state => state.functionalPositions.state )

    // States ----------------------------------------------------------------------------------------------

    const [ id, setId ] = useState(null)
    const [ name, setName ] = useState('')
    const [ abbreviation, setAbbreviation ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ amountRequired, setAmountRequired ] = useState(null)
    const [ salaryMin, setSalaryMin ] = useState(null)
    const [ salaryMax, setSalaryMax ] = useState(null)
    const [ boss, setBoss ] = useState(null)
    const [ bossHierarchy, setBossHierarchy ] = useState(null)
    const [ original, setOriginal ] = useState(null)
    const [ userRequired, setUserRequired ] = useState(null)
    const [ active, setActive ] = useState(null)
    const [ organizationalUnit, setOrganizationalUnit ] = useState(null)
    const [ functionalPositionId, setFunctionalPositionId ] = useState(null)

    useEffect(() => {

        if( functionalPosition ) {
            setId(functionalPosition ? functionalPosition.id : null)
            setName(functionalPosition && functionalPosition.name ? functionalPosition.name : '')
            setAbbreviation(functionalPosition && functionalPosition.abbreviation ? functionalPosition.abbreviation : '')
            setDescription(functionalPosition && functionalPosition.description ? functionalPosition.description : '')
            setAmountRequired(functionalPosition && functionalPosition.amount_required ? functionalPosition.amount_required : 1)
            setSalaryMin(functionalPosition && functionalPosition.salary_min ? functionalPosition.salary_min : 0)
            setSalaryMax(functionalPosition && functionalPosition.salary_max ? functionalPosition.salary_max : 0)
            setBoss(functionalPosition && functionalPosition.boss ? functionalPosition.boss === 1 : false)
            setBossHierarchy(functionalPosition && functionalPosition.boss_hierarchy ? functionalPosition.boss_hierarchy : 0)
            setOriginal(functionalPosition && functionalPosition.original ? functionalPosition.original === 1 : false)
            setUserRequired(functionalPosition && functionalPosition.user_required ? functionalPosition.user_required === 1 : false)
            setActive(functionalPosition && functionalPosition.active ? functionalPosition.active === 1 : false)
            setOrganizationalUnit(functionalPosition && functionalPosition.adm_organizational_unit_id ? functionalPosition.adm_organizational_unit_id : null)
            setFunctionalPositionId(functionalPosition && functionalPosition.adm_functional_position_id ? functionalPosition.adm_functional_position_id : null)
        }

    }, [ functionalPosition ])
    
    // Handlers --------------------------------------------------------------------------------------------

    const handleChangeName = entry => { setName(entry.target.value)}
    const handleChangeAbbreviation = entry => { setAbbreviation(entry.target.value)}
    const handleChangeDescription = entry => { setDescription(entry.target.value)}
    const handleChangeBoss = val => { setBoss(!val) }
    const handleChangeUserRequired = val => { setUserRequired(!val) }
    const handleChangeActive = val => { setActive(!val) }

    // Subcomponents --------------------------------------------------------------------------------------

    const SelectOrganizationalUnit = () =>
    {
        const options = []
        organizationalUnits.forEach( per =>	{ options.push({ value:per.id, label:(per.name) }) })
        return (
            <Select
                options = { options }
                placeholder={'Selecciona Unidad Organizacional'}
                onChange={ selected => { setOrganizationalUnit( selected.value ) } }
                components = {{ Option: CustomSelectOption }}
                value={ options.find( option => ( organizationalUnit === null && option.value === 'all' ) || option.value === organizationalUnit ) }
            />
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
            <Notification closable title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }

    const onSubmit = async () => {
        try {
            const values = []
            if (id) {
                values['id'] = id
                values['active'] = active === true || active === 1 ? 1 : 0
            } else {
                values['active'] = 1
            }
            
            values['name'] = name

            if (abbreviation) {
                values['abbreviation'] = abbreviation
            }

            if (description) {
                values['description'] = description
            }            

            if (amountRequired) {
                values['amount_required'] = amountRequired
            }
            if (salaryMin) {
                values['salary_min'] = salaryMin
            }
            if (salaryMax) {
                values['salary_max'] = salaryMax
            }
            values['boss'] = boss ? 1 : 0
            if (bossHierarchy) {
                values['boss_hierarchy'] = bossHierarchy
            }
            if (original) {
                values['original'] = original ? 1 : 0
            }
            if (userRequired) {
                values['user_required'] = userRequired ? 1 : 0
            }
            if (organizationalUnit) {
                values['adm_organizational_unit_id'] = organizationalUnit
            }
            if (functionalPositionId) {
                values['adm_functional_position_id'] = functionalPositionId
            }

            let data = new FormData
            Object.entries(values).forEach(([key, value]) => { data.append(key,value) })

            const response = await BaseService.post('administration/functional-positions', data)
            if ( response ) {
                dispatch(setDrawerOpen(false))
                dispatch(getFunctionalPositions())
                openNotification('success','Éxito','El festivo se almacenó con éxito','top-start')
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
                            <FormContainer>
                                <FormItem label="Unidad Organizacional">
                                    <SelectOrganizationalUnit/>
                                </FormItem>
                                <FormItem label="Nombre">
                                    <Input value={ name } onChange={ handleChangeName } />
                                </FormItem>
                                <FormItem label="Abreviatura">
                                    <Input value={ abbreviation } onChange={ handleChangeAbbreviation } />
                                </FormItem>
                                <FormItem label="Descripción">
                                    <Input textArea value={ description } onChange={ handleChangeDescription } />
                                </FormItem>
                                <div className='flex justify-around'>
                                    <FormItem label="Es Jefe">
                                        <Switcher checked={boss} onChange={handleChangeBoss} />
                                    </FormItem>
                                    <FormItem label="Requiere Usuario">
                                        <Switcher checked={userRequired} onChange={handleChangeUserRequired} />
                                    </FormItem>
                                    {
                                        id ?
                                        <FormItem label="Activo">
                                            <Switcher checked={active === true || active === 1 ? true : false} onChange={handleChangeActive} />
                                        </FormItem>
                                        : <></>
                                    }
                                </div>
                            </FormContainer>
                            {
                                functionalPosition && functionalPosition.employees && functionalPosition.employees.length > 0  ?
                                <div className=''>
                                    <h6 className={`text-slate-500`}>
                                        <span>Colaboradores en el cargo: {functionalPosition.employees.length}</span>
                                    </h6>
                                    <div className='mt-4 flex flex-wrap justify-center gap-4'>
                                    {
                                        functionalPosition.employees?.map( (employee,i) => {
                                            return (
                                                <Avatar
                                                    key={'ava'+i}
                                                    shape='circle'
                                                    className={`hover:animate-bounce`}
                                                    src={ employee.photo_image ? employee.photo_image : '/img/avatars/nopic.jpg' }
                                                    title={`${employee.name}`}
                                                />
                                            )
                                        })
                                    }
                                    </div>
                                </div> : <></>
                            }
                        </>
                    )}
                }
            </Formik>
    )

})

export default Content
