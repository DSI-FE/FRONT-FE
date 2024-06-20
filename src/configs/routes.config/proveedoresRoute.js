import React from "react";

const proveedorRoute = [

    {
        key: 'proveedores',
        path: `/proveedores/proveedores`,
        component: React.lazy(() => import('views/proveedores/proveedores/ProveedorList')),
        authority: [],
    }
]

export default proveedorRoute;