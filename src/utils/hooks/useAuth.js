import { useSelector, useDispatch }							from 'react-redux';

import { setUser, initialState as userInitialState } 		from 'store/auth/userSlice';
import { setEmployee, initialState as empInitialState }		from 'store/auth/employeeSlice';
import { setFunctionalPosition, initialState as functionalPositionInitialState }		from 'store/auth/functionalPositionSlice';
import { setOrganizationalUnit, initialState as organizationalUnitInitialState }	from 'store/auth/organizationalUnitSlice';
import { setNotifications, initialState as notificationsInitialState }	from 'store/auth/notificationsSlice';


import { apiSignIn, apiSignOut, apiSignUp }					from 'services/AuthService';
import { onSignInSuccess, onSignOutSuccess }				from 'store/auth/sessionSlice';
import { REDIRECT_URL_KEY }									from 'constants/app.constant';
import { useNavigate }										from 'react-router-dom';

import useQuery 											from './useQuery';
import appConfig											from 'configs/app.config';

function useAuth()
{
	const query					= useQuery();
    const dispatch				= useDispatch();
    const navigate				= useNavigate();
    const { token, signedIn }	= useSelector( (state) => state.auth.session );
	const { user }				= useSelector( (state) => state.auth );

    const signIn = async (values) =>
	{
		try
		{
			const resp = await apiSignIn(values);
			if (resp.data)
			{
				const
				{
					user,
					employee,
					functional_position:functionalPosition,
					organizational_unit:organizationalUnit,
					notifications,
					access_token:token
				} = resp.data;

				if(user) 		dispatch( setUser( user || userInitialState ) );
				
				if(!user.change_password)
				{
					dispatch( onSignInSuccess(token) );

					if(employee) 	dispatch( setEmployee( employee || empInitialState	));
					if(functionalPosition)		dispatch( setFunctionalPosition( functionalPosition || functionalPositionInitialState		));
					if(organizationalUnit)		dispatch( setOrganizationalUnit( organizationalUnit || organizationalUnitInitialState	));
					if(notifications)		dispatch( setNotifications( notifications || notificationsInitialState	));
					navigate(appConfig.authenticatedEntryPath);
				}
				else
				{
					navigate (appConfig.changePasswordEntryPath);
				}
				
                return {
                    status: 'success',
                    message: ''
                }
			}
		}
		catch (errors)
		{
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

	const signUp = async (values) => {
        try {
			const resp = await apiSignUp(values)
			if (resp.data) {
				const { token } = resp.data
				dispatch(onSignInSuccess(token))
				if(resp.data.user) {
					dispatch(setUser(resp.data.user || { 
						avatar: '', 
						userName: 'Anonymous', 
						authority: ['USER'], 
						email: ''
					}))
				}
				const redirectUrl = query.get(REDIRECT_URL_KEY)
				navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
                return {
                    status: 'success',
                    message: ''
                }
			}
		} catch (errors) {
			return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
		}
    }

    const handleSignOut = () =>
	{
		dispatch( onSignOutSuccess() );
		dispatch( setUser(userInitialState) );
		dispatch( setEmployee(empInitialState) );

		dispatch( setFunctionalPosition(functionalPositionInitialState) );
		dispatch( setOrganizationalUnit(organizationalUnitInitialState) );
		navigate( appConfig.unAuthenticatedEntryPath );
	}

    const signOut = async () =>
	{
		await apiSignOut();
		handleSignOut();
	}
    
    return {
        authenticated: token && signedIn,
		user:user,
        signIn,
		signUp,
        signOut
    }
}

export default useAuth