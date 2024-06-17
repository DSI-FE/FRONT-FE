import React from 'react'
import { Input, Button, Checkbox, FormItem, FormContainer } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'

import { Notification, toast} from 'components/ui'

const validationSchema = Yup.object().shape(
{
	identity: Yup.string().required('Ingresa tu Correo o Nombre de Usuario'),
	password: Yup.string().required('Ingresa tu contraseña'),
	rememberMe: Yup.bool()
});

const SignInForm = props =>
{
	const
	{
		disableSubmit = false,
		className,
		forgotPasswordUrl = '/forgot-password',
	} = props;

	const { signIn }			= useAuth();
	const [message, setMessage] = useTimeOutMessage(5000);

	const onSignIn = async (values, setSubmitting) => 
	{
		const { identity, password } = values;
		setSubmitting(true);
		
		const result = await signIn({ identity, password });

		if (result.status === 'failed')
		{
			setMessage(result.message);
			setSubmitting(false);
		}
		
	}

	const openNotification = (type,title,message) => {
		toast.push(
			<Notification className="border-red-100" title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
				{message}
			</Notification>
		)

	}

	return (
		<div className={className}>
			{message && openNotification('danger','Error',message)}
			<Formik
				initialValues={{
					identity:'',
					password:'',
					rememberMe: true
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					if(!disableSubmit) {
						onSignIn(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({touched, errors, isSubmitting}) => (
					<Form>
						<FormContainer>
							<FormItem
								label="Correo electrónico o usuario"
								invalid={errors.identity && touched.identity}
								errorMessage={errors.identity}
							>
								<Field 
									type="text" 
									autoComplete="off" 
									name="identity" 
									placeholder="" 
									component={Input} 
								/>
							</FormItem>
							<FormItem
								label="Contraseña"
								invalid={errors.password && touched.password}
								errorMessage={errors.password}
							>
								<Field
									autoComplete="off" 
									name="password" 
									placeholder="" 
									component={PasswordInput} 
								/>
							</FormItem>
							<div className="flex justify-between mb-6">
								<Field className="mb-0 " name="rememberMe" component={Checkbox} children="Recordarme" />
								<ActionLink className="text-center" to={forgotPasswordUrl}>
									¿Olvidaste la contraseña?
								</ActionLink>
							</div>
							<div className='flex justify-end'>
								<div className='w-2/5'>
									<Button className={`text-center`} block loading={isSubmitting} variant="solid" type="submit">
										{ isSubmitting ? 'Ingrensando...' : 'Ingresar' }
									</Button>
								</div>
							</div>
						</FormContainer>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default SignInForm
