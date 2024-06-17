import React from 'react';
import { Button, FormItem, FormContainer, Alert } from 'components/ui';
import { PasswordInput, ActionLink } from 'components/shared';
import { apiChangePassword } from 'services/AuthService';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector }	from 'react-redux';
import useAuth from 'utils/hooks/useAuth'

const validationSchema = Yup.object().shape({
	password: Yup.string().required('Por favor, ingresa tu contraseña'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
})

const ChangePasswordForm = props =>
{
	const { user } = useSelector( (state) => state.auth );
	const { disableSubmit = false, className, signInUrl = '/signin' } = props
	const [ message, setMessage ] = useTimeOutMessage()

	const { signIn } = useAuth();

	const onSubmit = async (values, setSubmitting) => {

		const { password,password_confirmation } = values
		setSubmitting(true)
		try {
			const userId = user.id;
			const identity = user.username;
			const resp = await apiChangePassword({ password,password_confirmation,user_id:userId })
			if (resp.data) {
				setSubmitting(false)
				setSubmitting(true);
				const result = await signIn({ identity, password });
				if (result.status === 'failed') {
					setMessage(result.message);
					setSubmitting(false);
				}
			}
		} catch (errors) {
			setMessage(errors?.response?.data?.message || errors.toString())
			setSubmitting(false)
		}
	}

	return (
		<div className={className}>
			<div className="mb-6">
				{
					// changeComplete ? 
					// <>
					// 	<h3 className="mb-1">¡Cambio realizado!</h3>
					// 	<p>Has cambiado con éxito tu contraseña, por favor, inicia sesión.</p>
					// </>
					// :
					<>
						<h2 className="mb-1">{`¡Bienvenido ${user.name}!`}</h2>
						<h3 className="mb-1">{`Cambio de contraseña requerido`}</h3>
						<p>Por tu seguridad actualiza tu contraseña, por favor, llena los campos del formulario</p>
					</>
				}
			</div>
			{message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
			<Formik
				initialValues={{
					password: '', 
					confirmPassword: '',
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					if(!disableSubmit) {
						onSubmit(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({touched, errors, isSubmitting}) => (
					<Form>
						<FormContainer>
							{
								// !changeComplete ? (
									<>
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
										<FormItem
											label="Confirmar Contraseña"
											invalid={errors.confirmPassword && touched.confirmPassword}
											errorMessage={errors.confirmPassword}
										>
											<Field
												autoComplete="off" 
												name="password_confirmation" 
												placeholder="" 
												component={PasswordInput} 
											/>
										</FormItem>
										<div className='flex justify-between items-center'>
											<div className="">
												<span>Regresar a </span>
												<ActionLink to={signInUrl}>
													Inicio de Sesión
												</ActionLink>
											</div>
											<div className='w-2/5'>
												<Button 
													block 
													loading={isSubmitting} 
													variant="solid" 
													type="submit"
												>
													{ isSubmitting ? 'Enviando Cambios...' : 'Cambiar' }
												</Button>
											</div>
										</div>
									</>
								// )
								// :
								// (
								// 	<Button 
								// 		block 
								// 		variant="solid" 
								// 		type="button"
								// 		onClick={onContinue}
								// 	>
								// 		Continuar
								// 	</Button>
								// )
							}

							
							
							
						</FormContainer>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default ChangePasswordForm