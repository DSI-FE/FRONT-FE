import React from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
	return (
		<>
			<div className="mb-8">
				<h2 className="mb-1">¡Bienvenido!</h2>
				<p>Por favor, introduce tus credenciales para ingresar</p>
			</div>
			<SignInForm disableSubmit = { false } />
		</>
	)
}

export default SignIn