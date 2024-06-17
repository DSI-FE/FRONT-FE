import React from 'react';
import authRoute from './authRoute';
import administrationRoute from './administrationRoute';

import directoryRoute from './directoryRoute'
import ourJobRoute from './ourJobRoute'

import magazineRoute from './magazineRoute'

export const publicRoutes = [ ...authRoute ]

export const protectedRoutes = [

    ...directoryRoute,
    ...administrationRoute,
    ...magazineRoute,
    ...ourJobRoute,

]
