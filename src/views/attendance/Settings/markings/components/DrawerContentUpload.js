import React, { forwardRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { setLoading} from '../store/stateSlice';
import BaseService from "services/BaseService";
import { Upload } from 'components/ui';
import { Button } from 'components/custom';
import { toast, Notification } from 'components/ui';



const DrawerContentUpload = forwardRef( (props, ref) => 
{
    const dispatch = useDispatch();
    const initialValues = { attendance_file:'' }
    const onSubmit = async (values) => 	{
        dispatch(setLoading(true));
        try {
            let data = new FormData;
            data.append('attendance_file',values.attendance_file);
            await BaseService.post('/attendance/markings/sync-by-file', data);
            openNotification('success','Carga completa','Las marcaciones se han almacenado correctamente','top-start');
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
                {(formProps)=>(
                    <Form>
                        <Upload
                            name='attendance_file'
                            uploadLimit={1}
                            onChange={ (files) => formProps.setFieldValue('attendance_file',files[0]) }
                        >
                            <Button>Cargar Archivo</Button>
                        </Upload>
                    </Form>
                )}
            </Formik>
        </div>
    )
})

export default DrawerContentUpload;

