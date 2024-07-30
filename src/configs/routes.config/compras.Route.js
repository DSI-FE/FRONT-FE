import React from "react";

const comprasRoute = [

    {
        key: 'compras',
        path: `/compras/compras`,
        component: React.lazy(() => import('views/compras/compras/ComprasList')),
        authority: [],
    }
]

export default comprasRoute;