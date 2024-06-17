import React, { useCallback,useEffect,useState,forwardRef } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { FormItem,FormContainer,Button,DatePicker,Select } from 'components/ui';
import { IconText } from 'components/shared';
import { Button as CustomButton } from 'components/custom'

import { Formik, Field, Form } from 'formik';
import { BiUndo } from 'react-icons/bi';
import { HiOutlineCalendar,HiCalendar,HiOutlineMinusCircle,HiOutlinePlusCircle } from 'react-icons/hi';
import {apiSetMarkingsPeriodData,apiCalculatePeriodDiscounts} from 'services/AttendanceService'
import { apiGetEmployeesMarkingRequired } from 'services/AdministrationService';
import { setLoading} from '../store/stateSlice';
import { toast, Notification } from 'components/ui';
import { HiCheck } from 'react-icons/hi';
import CreatableSelect from 'react-select/creatable'

import { StringToDate,dateToStringFormat } from 'helpers';

const getEmployeesMarkingRequired = async () => {
    const res = await apiGetEmployeesMarkingRequired()
    return res.data
}

const DrawerContent = forwardRef( (props, ref) => 
{

    const dispatch = useDispatch();

    const {
		data_drawer_body:dataDrawerBody,
	} = useSelector((state) => state.attendanceStt.state);

    const [ employeesList, setEmployeesList ] = useState([])
    const [ dateEndRequired, setDateEndRequired ] = useState([false])
    const [ dateEndAvailable, setDateEndAvailable ] = useState([true])
    const [ dateIni, setDateIni ] = useState([])
    const [ dateEnd, setDateEnd ] = useState([])

    const periodTitle = dataDrawerBody === 1 ? 'Periodo a Clasificar Marcaciones' : 'Periodo a Calcular Descuentos';
    const initialValues = { date_ini:'',date_end:'' }
    
    const fetchData = useCallback( async () => {
        setEmployeesList( await getEmployeesMarkingRequired() )
    },[])
    useEffect(() => { fetchData() }, [ ])

    const MyDatePicker = (field,form,ini) => {
        return <DatePicker
            field={field}
            form={form}
            inputPrefix={<HiOutlineCalendar className="text-lg" />}
            inputSuffix={null}
            inputFormat="DD/MM/YYYY"
            // value={(field.value && field.value!='' ? StringToDate(field.value) : new Date())}
            disabled = { !ini ? dateEndAvailable[0] : false}
            onChange={ date => {
                date = date ? date : null;
                let dateFormated = null;
                if (date) {
                    if (ini) {
                        dateEndAvailable[0] = (false)
                        dateIni[0] = ( date )
                    } else {
                        dateEnd[0] = ( date )
                    }
                    const day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
                    const month = date.getMonth() < 10 ? '0'+(date.getMonth()+1) : date.getMonth();
                    const year = date.getFullYear() < 10 ? '0'+date.getFullYear() : date.getFullYear();
                    dateFormated = day+'/'+month+'/'+year;
                } else {
                    dateEndAvailable[0] = (true)
                }
                form.setFieldValue(field.name,dateFormated)
            }}
        />
    }

    const EmployeeSelect = ( { className,values } ) =>
    {
        const options = [ ]
        employeesList.forEach( org =>	{ options.push({ value:org.id, label:(org.name+' '+org.lastname) }) })

        return (
            <FormItem
                label="Empleados"
            >
                <Field name="employees">
                    {({ field, form }) => (
                        <Select
                            isMulti
                            field={field}
                            form={form}
                            options={options}
                            value={values.employees}
                            onChange={(option) => { form.setFieldValue( field.name, option ) }}
                            placeholder={`Seleccione empleados`}
                        />
                    )}
                </Field>
                <div className='flex justify-end text-sm text-slate-400 mt-2'>
                    (No seleccionar para aplicar a todos los empleados)
                </div>
            </FormItem>
        )
    }
    
    const onSubmit = async (values) => 	{
        dispatch(setLoading(true));
        try {
            if ( dateIni[0] ) {
                values['date_ini'] = dateIni[0] ? dateToStringFormat( dateIni[0] ) : null
            }
            if ( dateEnd[0] && dateEndRequired[0] ) {
                values['date_end'] =  dateToStringFormat(dateEnd[0]) 
            }
            if (values['employees']) {

            }
            dataDrawerBody === 1 ? await apiSetMarkingsPeriodData(values) : await apiCalculatePeriodDiscounts(values)
            const notiMsg = dataDrawerBody === 1 ? 'Las marcaciones se han almacenado correctamente' : 'Los descuentos se han calculado correctamente'
            openNotification('success','Sincronización completa',notiMsg,'top-start');
		} catch (errors) {
            const message = errors?.response?.data?.message || errors.toString();
            openNotification('danger','Algo salio mal',message,'top-start');
		}
        dispatch(setLoading(false));
	}

    const openNotification = (type,title,message,placement) => {

        let BodyMessage = () => <>{message}</>;

        if( typeof message === 'object' ) {
            BodyMessage = () => (
                <ul>{ Object.entries(message).map(([key, value]) => <li className=''>{value[0]}</li>  ) }</ul>
            )
        }
        toast.push((
            <Notification closable className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={9000}>
                <BodyMessage/>
            </Notification>), {placement: placement}
        )
    }

    const onSwitcherToggle = () => { setDateEndRequired([!dateEndRequired[0]])}
    
    return (
        <div className="p-6 h-full w-full ">
            <Formik
                enableReinitialize
                innerRef = { ref }
                onSubmit = { values => onSubmit( values ) }
                initialValues = { initialValues }
            >
                { ({ resetForm,values }) =>{

                    return (
                        <Form className='h-full w-full '>
                            <div className='w-full flex flex-col justify-between items-start h-full'>
                                <div className='w-full'>
                                    <FormContainer className="w-full flex justify-between gap-5">
                                        <FormItem label="Fecha Inicial" className='w-5/12'>
                                            <Field name={`date_ini`}>
                                                {({ field, form }) => ( MyDatePicker(field,form,true))}
                                            </Field>
                                        </FormItem>

                                        {
                                            dateEndRequired[0] ?
                                            (
                                                <FormItem label="Fecha Final" className='w-5/12'>
                                                    <Field name={`date_end`}>
                                                        {({ field, form }) => ( MyDatePicker(field,form,false))}
                                                    </Field>
                                                </FormItem>
                                            ) : 
                                            <div className='w-5/12' ></div>
                                        }
                                        
                                        
                                        <FormContainer className='w-2/12 flex flex-col justify-center items-center'>
                                            <CustomButton
                                                variant = "solid"
                                                color = { dateEndRequired[0] ? 'red-500' : 'buke-500' }
                                                icon = { dateEndRequired[0] ? <HiOutlineMinusCircle /> : <HiOutlinePlusCircle /> }
                                                title = { dateEndRequired[0] ? 'Remover fecha final' : 'Agregar fecha final (Permiso de más de un día)' }
                                                onClick = { onSwitcherToggle }
                                            />
                                        </FormContainer>
                                    </FormContainer>

                                    <FormContainer className="w-full">
                                        <EmployeeSelect values={values} />
                                    </FormContainer>


                                </div>
                                <div className='flex justify-end align-middle w-full'>
                                    <Button size="sm" className="mr-2" variant="plain" type="button" onClick={resetForm} icon={<BiUndo />}>
                                        <span>Deshacer</span>
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
})

export default DrawerContent;

