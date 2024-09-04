import React from 'react';
import authRoute from './authRoute';
import administrationRoute from './administrationRoute';

import directoryRoute from './directoryRoute'
import ourJobRoute from './ourJobRoute'

import magazineRoute from './magazineRoute'

import clientesRoute from './clientesRoute';
import proveedorRoute from './proveedoresRoute';
import productosRoute from './productosRoute';
import ventasRoute from './ventasRoute';
import comprasRoute from './compras.Route';
import inventarioRoute from './inventarioRoute';

export const publicRoutes = [ ...authRoute ]

export const protectedRoutes = [

    ...directoryRoute,
    ...administrationRoute,
    ...magazineRoute,
    ...ourJobRoute,
    ...clientesRoute,
    ...proveedorRoute,
    ...productosRoute,
    ...ventasRoute,
    ...comprasRoute,
    ...inventarioRoute

]
