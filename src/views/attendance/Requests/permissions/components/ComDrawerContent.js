import React, { forwardRef,useState } from 'react'
import { useDispatch } from 'react-redux';
import { Input,FormItem,FormContainer,Button,DatePicker,toast,Notification,TimeInput,Upload,Select } from 'components/ui';
import { Formik, Field,FieldArray, Form } from 'formik';
import { BiUndo } from 'react-icons/bi';
import { HiOutlineCalendar,HiMinus} from 'react-icons/hi';
import { setLoading} from '../store/stateSlice';
import { StringToDate } from 'helpers';

const MyDatePicker = (field,form) => {
    return <DatePicker
        field={field}
        form={form}
        inputPrefix={<HiOutlineCalendar className="text-lg" />}
        inputSuffix={null}
        inputFormat="DD/MM/YYYY"
        value={(field.value ? StringToDate(field.value) : null)}
        
        onChange={ date =>
        {
            date = date ? date : null;
            let dateFormated = null;
            if (date)
            {
                const day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
                const month = date.getMonth() < 10 ? '0'+(date.getMonth()+1) : date.getMonth();
                const year = date.getFullYear() < 10 ? '0'+date.getFullYear() : date.getFullYear();
                dateFormated = day+'/'+month+'/'+year;
            }
            form.setFieldValue(field.name,dateFormated)
        }}
    />
}

const TextArea = (params) => <Input textArea {...params}/>;


const CustomTimeInput = (field,form) => (
    <TimeInput/>
)

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const LoadOptionOnExpand = () => {
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)

    const promiseOptions = () => {
        setTimeout(() => {
            setOptions(colourOptions)
            setLoading(false)
        }, 1500)
    }

    const onFocus = () => {
        if (options.length === 0) {
            setLoading(true)
            promiseOptions()
        }
    }

    return (
        <div>
            <Select options={options} onFocus={onFocus} isLoading={loading} />
        </div>
    )
}

const ComDrawerContent = forwardRef( (props, ref) => 
{
    const dispatch = useDispatch();
    const initialValues = { date_start:'',date_end:'',time_start:'',time_end:'',description:'' }
    const [files, setFiles] = useState([]);


    const onSubmit = async (values) => 	{
        dispatch(setLoading(true));
        try {
            console.log(values);
            // dataDrawerBody === 1 ? await apiSetMarkingsPeriodData(values) : await apiCalculatePeriodDiscounts(values)
            openNotification('success','Envio exitoso','El compensatorio se ha enviado correctamente','top-start');

		} catch (errors) {
            const message = errors?.response?.data?.message || errors.toString();
            openNotification('danger','Algo salio mal',message,'top-start');
		}
        dispatch(setLoading(false));
	}

    const openNotification = (type,title,message,placement) =>
    {
		toast.push((
			<Notification className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
				{message}
			</Notification>), {placement: placement}
		)
	}
    return (
        <div className="p-6 h-full">
            <Formik
                enableReinitialize
                innerRef = { ref }
                onSubmit = { values => onSubmit( values ) }
                initialValues = { initialValues }
            >

                { ({ resetForm, values, handleChange }) => {
                    const attachments = values.attachments;
                    return (
                        <Form className='h-full'>
                            <div className='flex flex-col justify-between items-start h-full'>
                                <FormContainer className='w-full'>
                                    <div>
                                        <FormItem label="Fecha">
                                            <Field name={`date_start`}>
                                                {({ field, form }) => ( MyDatePicker(field,form))}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div>
                                        <FormItem label="Fecha">
                                            <Field name={`date_start`}>
                                                {({ field, form }) => (LoadOptionOnExpand(field,form))}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <div className='flex justify-start gap-8 items-start w-full'>
                                        <FormItem label="Hora Inicial" className='w-4/12'>
                                            <Field name={`time_start`}>
                                                {({ field, form }) => ( CustomTimeInput(field,form))}
                                            </Field>
                                        </FormItem>
                                        <FormItem label="Hora Final" className='w-4/12'>
                                            <Field name={`time_end`}>
                                                {({ field, form }) => ( CustomTimeInput(field,form))}
                                            </Field>
                                        </FormItem> 
                                    </div>
                                    <div>
                                        <FormItem label="Justificación">
                                            <Field
                                                type="text"
                                                name="description"
                                                component={TextArea}
                                            />
                                        </FormItem>
                                    </div>

                                    <div>
                                    <Upload
                                        className = {`flex justify-between items-center`}
                                        name='attendance_file'
                                        uploadLimit={5}
                                        onChange={ (file) => setFiles(file[0]) }
                                    >
                                        <Button type="button">Cargar Comprobantes</Button>
                                        <span>(Máximo 5 archivos)</span>
                                    </Upload>
                                    </div>
                                </FormContainer>


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

export default ComDrawerContent;

